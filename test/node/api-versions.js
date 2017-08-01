'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');

const interfacesV1 = {
  calculator: {
    answer(connection, callback) {
      callback(null, 42);
    },
  },
};

const interfacesV2 = {
  calculator: {
    answer(connection, callback) {
      callback(null, 24);
    },
  },
};

const interfacesVLatest = {
  calculator: {
    answer(connection, callback) {
      callback(null, 13);
    },
  },
};

const appV1 = new jstp.Application(app.name, interfacesV1, null, '1.0.0');
const appV2 = new jstp.Application(app.name, interfacesV2, null, '2.0.0');
const appVlatest = new jstp.Application(app.name, interfacesVLatest);

let server;
let connection;

test.afterEach((done) => {
  if (connection) {
    connection.close();
    connection.once('close', () => {
      connection = null;

      if (server) server.close();
      done();
    });
  } else {
    if (server) server.close();
    done();
  }
});

test.test('must allow to specify version in application name', (test) => {
  const appV1 = new jstp.Application('app@1.0.0', interfacesV1);
  test.strictSame(appV1.version, '1.0.0');
  test.end();
});

test.test('must call latest version if no version specified', (test) => {
  const serverConfig = {
    applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback,
  };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const appLatest = { name: app.name };
    jstp.net.connect(appLatest, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 13);
        test.end();
      });
    });
  });
});

test.test('must call specific version when specified (v1)', (test) => {
  const serverConfig = {
    applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback,
  };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const appV1 = { name: app.name, version: '1' };
    jstp.net.connect(appV1, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 42);
        test.end();
      });
    });
  });
});

test.test('must call specific version when specified (v2)', (test) => {
  const serverConfig = {
    applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback,
  };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const appV2 = { name: app.name, version: '2' };
    jstp.net.connect(appV2, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 24);
        test.end();
      });
    });
  });
});

test.test('must handle version ranges (^1.0.0)', (test) => {
  const serverConfig = {
    applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback,
  };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const appV1Compatible = { name: app.name, version: '^1.0.0' };
    // must connect to appV1
    jstp.net.connect(appV1Compatible, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 42);
        test.end();
      });
    });
  });
});

test.test('must handle version ranges (>1.0.0)', (test) => {
  const serverConfig = {
    applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback,
  };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const appV1Higher = { name: app.name, version: '>1.0.0' };
    // must connect to appV2
    jstp.net.connect(appV1Higher, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 24);
        test.end();
      });
    });
  });
});

test.test('must return an error on connect to nonexistent version', (test) => {
  const serverConfig =
    { applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const nonexistentApp = { name: app.name, version: '9999' };
    jstp.net.connect(nonexistentApp, null, port, (error, conn) => {
      connection = conn;
      test.assert(error, 'connect must return an error');
      test.equal(error.code, jstp.ERR_APP_NOT_FOUND,
        'error must be an ERR_APP_NOT_FOUND');
      test.end();
    });
  });
});

test.test('must return an error on connect to invalid version', (test) => {
  const serverConfig =
    { applications: [appV1, appV2, appVlatest], authPolicy: app.authCallback };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    const application = { name: app.name, version: '__invalid_version__' };
    jstp.net.connect(application, null, port, (error, conn) => {
      connection = conn;
      test.assert(error, 'connect must return an error');
      test.equal(error.message, 'Invalid semver version range');
      test.end();
    });
  });
});

test.test('must set biggest version as latest versions', (test) => {
  const serverConfig =
    { applications: [appV1, appV2], authPolicy: app.authCallback };
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(app.name, null, port, (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      connection.callMethod('calculator', 'answer', [], (error, result) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.strictSame(result, 24);
        test.end();
      });
    });
  });
});

test.test('must throw an error on invalid version in application name',
  (test) => {
    test.throws(() => {
      new jstp.Application('app@__invalid__', interfacesV1);
    }, TypeError, 'Invalid semver version');
    test.end();
  }
);

test.test('must throw an error on invalid version in application parameter',
  (test) => {
    test.throws(() => {
      new jstp.Application('app', interfacesV1, null, '__invalid__');
    }, TypeError, 'Invalid semver version');
    test.end();
  }
);
