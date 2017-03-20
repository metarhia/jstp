'use strict';

const jstp = require('../..');
const common = require('./common');

const tcpClient = jstp.tcp.createClient({
  host: 'localhost',
  port: common.TCP_PORT
});

console.log('Connecting a client via TCP');
tcpClient.connectAndInspect('testApp', null, null,
  ['testInterface'], onConnect.bind(null, tcpClient));

tcpClient.on('error', (error) => {
  common.fatal('TCP client error: ' + error);
});

const ipcClient = jstp.ipc.createClient(common.UNIX_SOCKET);

console.log('Connecting a client via IPC');
ipcClient.connectAndInspect('testApp', null, null,
  ['testInterface'], onConnect.bind(null, ipcClient));

ipcClient.on('error', (error) => {
  common.fatal('IPC client error: ' + error);
});

const wsClient = jstp.ws.createClient({
  url: 'ws://localhost:' + common.WS_PORT
});

console.log('Connecting a client via WebSocket');
wsClient.connectAndInspect('testApp', null, null,
  ['testInterface'], onConnect.bind(null, wsClient));

wsClient.on('error', (error) => {
  common.fatal('WebSocket client error: ' + error);
});

function onConnect(client, error, connection, api) {
  if (error) {
    common.fatal('Could not connect: ' + error);
  }

  console.log('Connected, session ID is', connection.sessionId);

  connection.on('error', (error) => {
    common.fatal('Connection error: ' +  error);
  });

  let methodsCalled = 0;

  function disconnectIfComplete() {
    if (++methodsCalled === 2) {
      console.log('Disconnecting client');
      client.disconnect();
    }
  }

  api.testInterface.add(2, 3, (error, result) => {
    if (error) {
      common.fatal(error);
    }

    console.log('RPC result for add:', result);
    disconnectIfComplete();
  });

  api.testInterface.sayHi((error, result) => {
    if (error) {
      common.fatal(error);
    }

    console.log('RPC result for sayHi:', result);
    disconnectIfComplete();
  });
}
