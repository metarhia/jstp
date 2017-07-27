'use strict';

// Simple default storage provider for Session objects.
// Used on server by default, can be also used by Application
// objects if you need to store clients' sessions
// separately for this application.
// You are free to substitute it with other class with
// the corresponding interface.
class SimpleSessionStorageProvider extends Map {
  // Constructor arguments can be used to change the default
  // purging options.
  //   inactiveSessionLifetime - determines the minimal lifetime of
  //                             the session which was marked as inactive
  //   purgeInterval - determines the interval at which session
  //                   purging occurs
  //
  constructor(
    inactiveSessionLifetime = 24 * 60 * 60 * 1000,
    purgeInterval = 60 * 60 * 1000
  ) {
    super();
    this._purgeInterval = purgeInterval;
    this._inactiveSessionLifetime = inactiveSessionLifetime;
    setInterval(() => {
      this._purgeSessions();
    }, purgeInterval).unref();
  }

  // Must return the Session object with the corresponding session id
  // or undefined if the session cannot be found.
  // This method is called at most once for each connection
  // on handshake, in case of session restoring when there is no connection
  // associated with the session in memory.
  //   sessionId - id of the requested session
  //
  get(sessionId) {
    const storedSession = super.get(sessionId);
    if (!storedSession) return storedSession;
    storedSession.lastActive = null;
    return storedSession.value;
  }

  // Must save the Session object with the corresponding session id.
  // This method is called once on session creation and every time
  // when connection associated with session is being closed.
  //   sessionId - id of the session to be added
  //   session - Session object to be added
  //
  set(sessionId, session) {
    const storedSession = {
      value: session,
      lastActive: null,
    };
    super.set(sessionId, storedSession);
    return this;
  }

  // Optional method, can be omitted if this functionality is not
  // required.
  // If provided, must mark the session as inactive.
  // Called whenever the connection associated with the session
  // is being closed.
  //   sessionId - id of the session to mark inactive
  //
  setInactive(sessionId) {
    const session = super.get(sessionId);
    session.lastActive = Date.now();
  }

  _purgeSessions() {
    const purgeStartTime = Date.now();
    this.forEach((storedSession, sessionId) => {
      if (!storedSession.lastActive) return;
      const sessionInactivityTime = purgeStartTime - storedSession.lastActive;
      if (sessionInactivityTime >= this._inactiveSessionLifetime) {
        super.delete(sessionId);
      }
    });
  }
}

module.exports = SimpleSessionStorageProvider;
