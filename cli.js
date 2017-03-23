'use strict';

// TODO: feature request: support jstp://server and jstps://server

const jstp = require('.');
const readline = require('readline');

const log = console.log;
const logErr = console.error;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer
});

const state = {
  client: null,
  connection: null
};

const methodProcessor = {
  call: (interfaceName, methodName, args, callback) => {
    state.connection.callMethod(interfaceName, methodName, args.map(jstp.parse),
        callback);
  },
  event: (interfaceName, eventName, args, callback) => {
    state.connection.emitRemoteEvent(interfaceName, eventName,
        args.map(jstp.parse));
    callback();
  },
  connect: (host, port, appName, callback) => {
    state.client = jstp.tcp.createClient({host, port, secure: true});
    state.client.connectAndHandshake(appName, null, null,
        (err, connection) => {
      if (!err) state.connection = connection;
      return callback(err)
    });
  },
  disconnect: (callback) => {
    if (state.client !== null) {
      return state.client.disconnect(() => {
        state.connection = null;
        state.client = null;
        callback();
      });
    }
    callback(new Error('Not connected'));
  }
};

function _splitArgs(token) {
  return token && _split(token, ' $ ') || [];
}

function _split(str, separator, limit, leaveEmpty) {
  const shouldTrim = (start, split) => !leaveEmpty && start === split;

  const result = [];
  let start = 0;

  for (let i = 0; !limit || i < limit; i++) {
    const split = str.indexOf(separator, start);
    if (split === -1) break;
    if (!shouldTrim(start, split)) {
      result.push(str.slice(start, split));
    } else {
      limit--;
    }
    start = split + 1;
  }
  if (!shouldTrim(start, str.length)) {
    result.push(str.slice(start));
  }
  return result;
}

const lineProcessor = {
  call: (tokens, callback) => {
    if (tokens === undefined) {
      return callback(new Error('Not enough arguments'));
    }
    const args = _split(tokens, ' ', 2);
    methodProcessor.call(args[0], args[1], _splitArgs(args[2]),
        (err, result) => {
      if (err) return callback(err);
      callback(null, `Method ${args[0]}.${args[1]} returned: ` +
        jstp.stringify(result.map(jstp.stringify)));
    });
  },
  event: (tokens, callback) => {
    if (tokens === undefined) {
      return callback(new Error('Not enough arguments'));
    }
    const args = _split(tokens, ' ', 2);
    methodProcessor.event(args[0], args[1], _splitArgs(args[2]),
        (err) => {
      if (err) return callback(err);
      callback(null, `Event ${args[0]}.${args[1]} successfully emitted`);
    });
  },
  connect: (tokens, callback) => {
    if (tokens === undefined) {
      return callback(new Error('Not enough arguments'));
    }
    const args = _split(tokens, ' ', 2);
    const [host, port] = _split(args[0], ':');
    const appName = args[1];
    methodProcessor.connect(host, port, appName, (err) => {
      if (err) return callback(err);
      callback(null, 'Connection established');
    });
  },
  disconnect: (_, callback) => {
    methodProcessor.disconnect((err) => {
      if (err) return callback('Not connected');
      callback(null, 'Successful disconnect')
    });
  }
};

rl.on('line', (line) => {
  line = line.trim();
  const [type, leftover] = _split(line, ' ', 1);
  lineProcessor[type](leftover, (err, result) => {
    if (err) logErr(err);
    else log(result);
    rl.prompt(true);
  });
});

function completer(line) {
  return [[], line];
}

rl.on('SIGINT', () => {
  rl.close();
});

rl.prompt(true);
