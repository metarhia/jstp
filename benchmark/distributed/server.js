'use strict';

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const jstp = require('../..');
const parseAddress = require('./parse-address');

const args = yargs
  .option('address', {
    alias: 'a',
    describe: 'Address for server to listen on',
    type: 'string',
    default: 'tcp://localhost:3030',
  })
  .option('master', {
    alias: 'm',
    describe: 'Address of master server',
    type: 'string',
    default: 'tcp://localhost:3000',
  })
  .option('report', {
    alias: 'r',
    describe: 'Report interval in ms',
    type: 'number',
    default: 10000,
  })
  .option('key', {
    alias: 'k',
    type: 'string',
    describe: 'Path to file that contains SSL certificate key',
    coerce:
      arg => (arg ? fs.readFileSync(path.resolve(__dirname, arg)) : undefined),
  })
  .option('cert', {
    alias: 'c',
    type: 'string',
    describe: 'Path to file that contains SSL certificate',
    coerce:
      arg => (arg ? fs.readFileSync(path.resolve(__dirname, arg)) : undefined),
  })
  .help()
  .alias('help', 'h')
  .argv;

const {
  address,
  master,
  report: reportInterval,
  key,
  cert,
} = args;

const [masterAddressError, parsedMasterAddress] = parseAddress(master);
if (masterAddressError) {
  console.error(`Invalid master address: ${masterAddressError.message}`);
  process.exit(1);
}

const {
  transport: masterTransport,
  connect: masterAddress,
} = parsedMasterAddress;

const [serverAddressError, parsedServerAddress] = parseAddress(address);
if (serverAddressError) {
  console.error(`Invalid server address: ${serverAddressError.message}`);
  process.exit(1);
}
const {
  transport,
  listen: listenAddress,
  connect: connectAddress,
} = parsedServerAddress;

let timer;
const application = {
  server: {
    method: (connection, argument, callback) => {
      callback(null, argument);
    },
  },
};

const config = {
  applications: [new jstp.Application('server', application)],
  heartbeatInterval: 1000,
  key,
  cert,
};

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const server = jstp[transport].createServer(config);
server.maxConnections = 100000;

server.listen(listenAddress, () => {
  console.log(`Server listening on ${address}`);

  jstp[masterTransport].connectAndInspect(
    'master', null, ['master'], ...masterAddress, (error, connection, api) => {
      if (error) {
        console.error(error);
        server.close();
        return;
      }

      api.master.registerServer(connectAddress, (error) => {
        if (error) {
          console.error(error);
          connection.close();
          server.close();
          return;
        }

        timer = setInterval(() => {
          server.getConnections((error, count) => {
            if (error) {
              console.log(error);
              return;
            }
            console.log(`Connections to server: ${count}`);
            api.master.emit('serverReport', count);
          });
        }, reportInterval);
      });
    }
  );
});

process.on('SIGINT', () => {
  console.log('\nServer is being closed');
  clearInterval(timer);
  server.close((error) => {
    if (error) {
      console.log(`Error occured when closing:\n${error}`);
      if (transport === 'ipc') {
        fs.unlink(listenAddress);
      }
    }
    process.exit(0);
  });
});
