'use strict';

const { split } = require('../../lib/cli/utils');

module.exports = (address) => {
  const [transport, location] = split(address, '://', 1, true);

  if (!location) {
    return [new Error('Missing transport'), null];
  }

  const [host, port] = split(location, ':', 1, true);

  if (transport !== 'ipc' && !port) {
    return [new Error('Missing port'), null];
  }

  const result = {
    transport: transport === 'tcp' || transport === 'ipc' ? 'net' : transport,
  };

  switch (transport) {
    case 'tcp':
    case 'tls':
      result.listen = port;
      result.connect = [port, host];
      break;
    case 'ws':
    case 'wss':
      result.listen = port;
      result.connect = [null, address];
      break;
    case 'ipc':
      result.listen = host;
      result.connect = [host];
      break;
  }

  return [null, result];
};
