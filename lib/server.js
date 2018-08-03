'use strict';

const semver = require('semver');

const apps = require('./applications');
const Connection = require('./connection');
const errors = require('./errors');
const { ExpiringMap } = require('./common');
const Session = require('./session');
const SimpleSessionStorageProvider = require('./simple-session-storage-provider');

const HANDSHAKE_TIMEOUT = 3000;

const prepareApplications = function(applications) {
  if (Array.isArray(applications)) {
    applications = apps.createAppsIndex(applications);
  }

  // versions cached for efficient search when provided version is a range
  const cachedVersions = new Map();
  applications.forEach((appVersions, appName) => {
    const versions = Array.from(appVersions)
      .filter(version => version[0] !== 'latest')
      .map(version => [new semver.SemVer(version[0]), version[1]])
      .sort((a, b) => semver.rcompare(a[0], b[0]));
    cachedVersions.set(appName, versions);
  });

  return { cachedVersions, applications };
};

// Initializes JSTP server.
//   applications - applications array or index
//                  (see applications.createAppsIndex)
//   authPolicy - authentication policy is a function or an object with method
//                authenticate (optional).
//                This method takes next arguments:
//                  connection - jstp.Connection object.
//                  application - application object.
//                  strategy - authentication strategy string (note: this method
//                             will NOT be called for 'anonymous' and 'session'
//                             authentication strategies).
//                  credentials - authentication credentials array.
//                  callback - function with signature (error, username).
//   sessionStorageProvider - provider for session storage (optional).
//                            If provided, it will be used to store sessions
//                            for applications that do not provide storage
//                            provider
//   heartbeatInterval - heartbeat interval, if heartbeat should be used
//                       (optional).
//   clientExpirationTime - time it takes for clients connection and
//                          corresponding session stored in memory to expire
//                          and to be moved to sessionStorageProvider
//                          (optional). Defaults to 1 hour.
//   listener - jstp connection listener that will be registered on
//              server 'connect' event (optional).
//
const initServer = function(
  applications,
  authPolicy,
  sessionStorageProvider,
  heartbeatInterval,
  clientExpirationTime,
  listener
) {
  ({
    cachedVersions: this._cachedVersions,
    applications: this.applications,
  } = prepareApplications(applications));

  this.heartbeatInterval = heartbeatInterval;

  if (typeof authPolicy === 'object') {
    authPolicy = authPolicy.authenticate.bind(authPolicy);
  }
  this.authenticate = authPolicy;

  this.clients = new Map();
  this._clientsBySessionId = new ExpiringMap(
    clientExpirationTime || 1000 * 60 * 60
  );

  this.sessionsStorage =
    sessionStorageProvider || new SimpleSessionStorageProvider();

  this.on('connect', this._onClientConnect.bind(this));
  this.on('disconnect', this._onClientDisconnect.bind(this));

  this.on('handshakeRequest', (connection, appName, authStrategy) => {
    this.emit('log', connection, 'handshakeRequest', appName, authStrategy);
  });

  if (listener) this.on('connect', listener);
};

// JSTP server base class with necessary methods.
//
class Server {
  // Get all clients as an Iterator of JSTP connection instances.
  //
  getClients() {
    return this.clients.values();
  }

  // Get all clients as an array of JSTP connection instances.
  //
  getClientsArray() {
    return Array.from(this.getClients());
  }

  // Update applications.
  //   applications - applications array or index
  //                  (see applications.createAppsIndex)
  updateApplications(applications) {
    ({
      cachedVersions: this._cachedVersions,
      applications: this.applications,
    } = prepareApplications(applications));
  }

  // Update application version for each connection.
  // It will update application in the connection to the newest version
  // in the range requested by the client.
  // If the client requested (1.1.x) range, it will not be updated to (1.2.x).
  // If no suitable version is found, the client will use its previous
  // app version.
  updateConnectionsApi() {
    for (const connection of this.clients.values()) {
      if (semver.valid(connection.requestedVersion)) {
        continue;
      }
      const newApp = this._getApplication(
        connection.application.name,
        connection.requestedVersion
      );
      if (newApp) {
        connection.application = newApp;
      }
    }
  }

  broadcast(interfaceName, eventName, ...eventArgs) {
    this.clients.forEach(client => {
      client.emitRemoteEvent(interfaceName, eventName, eventArgs);
    });
  }

  _createSession(username, connection, sessionStorageProvider, callback) {
    const session = new Session(connection, username);
    this._clientsBySessionId.set(session.id, connection);
    connection.once('close', () => {
      if (connection.id === session.connection.id) {
        sessionStorageProvider.set(session.id, session);
        if (sessionStorageProvider.setInactive) {
          sessionStorageProvider.setInactive(session.id);
        }
      }
    });
    callback(null, username, session);
  }

  startSession(connection, application, strategy, credentials, callback) {
    const sessionStorageProvider =
      application.sessionsStorage || this.sessionsStorage;

    if (strategy === 'anonymous') {
      this._createSession(null, connection, sessionStorageProvider, callback);
      return;
    }

    if (!this.authenticate) {
      callback(errors.ERR_AUTH_FAILED);
      return;
    }
    this.authenticate(
      connection,
      application,
      strategy,
      credentials,
      (error, username) => {
        if (error) {
          if (error instanceof errors.RemoteError) {
            callback(error);
          } else {
            callback(
              new errors.RemoteError(errors.ERR_AUTH_FAILED, error.message)
            );
          }
          return;
        }
        if (!username) {
          callback(errors.ERR_AUTH_FAILED);
          return;
        }
        this._createSession(
          username,
          connection,
          sessionStorageProvider,
          callback
        );
      }
    );
  }

  restoreSession(connection, application, credentials, callback) {
    const [sessionId, receivedCount] = credentials;
    const existingConnection = this._clientsBySessionId.get(sessionId);
    const sessionStorageProvider =
      application.sessionsStorage || this.sessionsStorage;

    const getSessionCallback = (session, replacementTransport, callback) => {
      if (!session) {
        callback(errors.ERR_AUTH_FAILED);
        return;
      }

      this._clientsBySessionId.set(sessionId, connection);
      session._restore(connection, receivedCount);
      if (replacementTransport) {
        connection._initTransport(replacementTransport);
      }
      connection.once('close', () => {
        if (connection.id === session.connection.id) {
          sessionStorageProvider.set(session.id, session);
          if (sessionStorageProvider.setInactive) {
            sessionStorageProvider.setInactive(session.id);
          }
        }
      });
      this.emit('restoreSession', session, connection, application);
      callback(null, session.username, session);
    };

    if (existingConnection) {
      const replacementTransport = connection._removeTransport();
      connection.handshakeDone = true;
      connection = existingConnection;
      const cb = connection._onSessionRestored.bind(connection);
      getSessionCallback(connection.session, replacementTransport, cb);
      return;
    }

    if (sessionStorageProvider.isAsync()) {
      sessionStorageProvider.get(sessionId, session =>
        getSessionCallback(session, null, callback)
      );
    } else {
      getSessionCallback(sessionStorageProvider.get(sessionId), null, callback);
    }
  }

  // Handler of a new connection event emitter from the underlying server.
  //   socket - a lower-level socket or connection
  //
  _onRawConnection(socket) {
    const connection = new Connection(this.createTransport(socket), this);

    connection.on('error', error => {
      this.emit('connectionError', error, connection);
    });

    const handleTimeout = () => {
      if (!connection.handshakeDone) {
        connection.close();
        this.emit('handshakeTimeout', connection);
      }
    };

    const handshakeTimeout = setTimeout(handleTimeout, HANDSHAKE_TIMEOUT);

    connection.on('client', () => {
      clearTimeout(handshakeTimeout);
      if (this.heartbeatInterval) {
        connection.startHeartbeat(this.heartbeatInterval);
      }
    });
  }

  _getApplication(name, version) {
    const appVersions = this.applications.get(name);
    if (!appVersions) return null;
    if (!version) return appVersions.get('latest');
    // when version is not a range simply return matched
    if (semver.valid(version)) return appVersions.get(version);

    // search matching version, first matched will be the latest
    try {
      const range = new semver.Range(version);
      const versions = this._cachedVersions.get(name);
      for (let i = 0; i < versions.length; i++) {
        // version === [versionCode, app]
        const version = versions[i];
        if (range.test(version[0])) return version[1];
      }
    } catch (error) {
      // ignored
    }
    return null;
  }

  // Client connection event handler.
  //   connection - JSTP connection instance
  //
  _onClientConnect(connection) {
    this.clients.set(connection.id, connection);
  }

  // Client connection close event handler.
  //   connection - JSTP connection instance
  //
  _onClientDisconnect(connection) {
    this.clients.delete(connection.id);
    if (connection.session) {
      this._clientsBySessionId.delete(connection.session.id);
    }
  }
}

module.exports = {
  initServer,
  Server,
};
