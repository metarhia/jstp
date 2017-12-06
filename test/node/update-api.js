'use strict';

const test = require('tap');

const jstp = require('../..');

const appName = 'api';

const oldApi = {
  name: `${appName}@1.0.0`,
  interfaces: {
    iface: {
      method: (connection, callback) => {
        callback(null, 42);
      },
    },
  },
};

const newApi = {
  name: `${appName}@1.1.0`,
  interfaces: {
    iface: {
      method: (connection, callback) => {
        callback(null, 420);
      },
    },
  },
};

const apiWithBreakingChange = {
  name: `${appName}@2.0.0`,
  interfaces: {
    iface: {
      newMethod: (connection, callback) => {
        callback(null, 420);
      },
    },
  },
};

const oldApplication = new jstp.Application(oldApi.name, oldApi.interfaces);
const newApplication = new jstp.Application(newApi.name, newApi.interfaces);
const breakingApp = new jstp.Application(
  apiWithBreakingChange.name, apiWithBreakingChange.interfaces
);

let server;
let port;

test.beforeEach((done) => {
  server = jstp.net.createServer({ applications: [oldApplication] });
  server.listen(0, () => {
    port = server.address().port;
    done();
  });
});

test.afterEach((done) => {
  server.close(done);
});

test.test('must update API', (test) => {
  server.updateApplications([newApplication]);
  jstp.net.connect(appName, null, port, 'localhost',
    (error, connection) => {
      test.assertNot(error, 'must connect to a new application');
      connection.callMethod('iface', 'method', [], (error, result) => {
        test.assertNot(error, 'must call a new method');
        test.equal(result, 420);
        connection.close();
        test.end();
      });
    }
  );
});

test.test('must update API on existing connection', (test) => {
  jstp.net.connect(appName, null, port, 'localhost',
    (error, connection) => {
      test.assertNot(error, 'must connect to an application');
      server.updateApplications([newApplication]);
      server.updateConnectionsApi();
      connection.callMethod('iface', 'method', [], (error, result) => {
        test.assertNot(error, 'must call a new method');
        test.equal(result, 420);
        connection.close();
        test.end();
      });
    }
  );
});

test.test(
  'must not update API on existing connection if no supported version is ' +
  'found (connection to a latest app)',
  (test) => {
    jstp.net.connect(appName, null, port, 'localhost',
      (error, connection) => {
        test.assertNot(error, 'must connect to an application');
        server.updateApplications([breakingApp]);
        server.updateConnectionsApi();
        connection.callMethod('iface', 'method', [], (error, result) => {
          test.assertNot(error, 'must call an old method');
          test.equal(result, 42);
          connection.close();
          test.end();
        });
      }
    );
  }
);

test.test(
  'must not update API on existing connection if no supported version is ' +
  'found (connection to @1)',
  (test) => {
    jstp.net.connect(`${appName}@1`, null, port, 'localhost',
      (error, connection) => {
        test.assertNot(error, 'must connect to an application');
        server.updateApplications([breakingApp]);
        server.updateConnectionsApi();
        connection.callMethod('iface', 'method', [], (error, result) => {
          test.assertNot(error, 'must call an old method');
          test.equal(result, 42);
          connection.close();
          test.end();
        });
      }
    );
  }
);

test.test(
  'must not update API on existing connection if no supported version is ' +
  'found (connection to @1.0)',
  (test) => {
    jstp.net.connect(`${appName}@1.0`, null, port, 'localhost',
      (error, connection) => {
        test.assertNot(error, 'must connect to an application');
        server.updateApplications([newApplication]);
        server.updateConnectionsApi();
        connection.callMethod('iface', 'method', [], (error, result) => {
          test.assertNot(error, 'must call an old method');
          test.equal(result, 42);
          connection.close();
          test.end();
        });
      }
    );
  }
);

test.test(
  'must not update API on existing connection if no supported version is ' +
  'found (connection to @1.0.0)',
  (test) => {
    jstp.net.connect(`${appName}@1.0.0`, null, port, 'localhost',
      (error, connection) => {
        test.assertNot(error, 'must connect to an application');
        server.updateApplications([newApplication]);
        server.updateConnectionsApi();
        connection.callMethod('iface', 'method', [], (error, result) => {
          test.assertNot(error, 'must call an old method');
          test.equal(result, 42);
          connection.close();
          test.end();
        });
      }
    );
  }
);
