#!/usr/bin/env node

'use strict';

const jstp = require('..');
const readline = require('readline');

const DEFAULT_SCHEME = 'jstps';

const commandProcessor = {};
const lineProcessor = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer
});

const log = (msg) => {
  const userInput = rl.line;
  if (userInput) rl.clearLine();
  console.log(msg);
  rl.write('\n');
  if (userInput) rl.write(userInput);
};

function complete(input, completions) {
  if (!input) return completions;
  return completions.filter(c => c.startsWith(input));
}

function tryCompleter(input, completer) {
  const completions = completer.complete([input], 0)[0];
  if (completions.length === 1) return completions[0];
  return input;
}

function completer(line) {
  const inputs = _split(line, ' ', 0, true);
  const [completions, help] = iterativeCompletion(inputs, 0, commandProcessor);
  if (help) log('\n' + help);
  // to allow partial completion, as method above gives
  // completions for the latest command part
  const lastPart = inputs.length === 0 ? line : inputs[inputs.length - 1];
  return [completions, lastPart];
}

// inputs - array of user inputs
// depth - level of nested completion (index in inputs array)
// completer - object that has '.complete(inputs, depth)'
//             function or '.help()' or neither
//             (no completions or help available)
function iterativeCompletion(inputs, depth, completer) {
  let help = '';
  let completions = [];
  let newDepth = depth;
  if (completer.complete) {
    do {
      depth = newDepth;
      [completions, newDepth] = completer.complete(inputs, newDepth);
      if (completions.length === 1 && completer[completions[0]]) {
        completer = completer[completions[0]];
      } else {
        break;
      }
    } while (newDepth < inputs.length && completer.complete);
  }
  // reset completions if we didn't reach last input because
  // they'll be not valid (those are completions for previous inputs)
  if (newDepth <= inputs.length - 1) completions = [];
  if (!completions[0] ||
      completions.length === 1 && completions[0] === inputs[depth]) {
    completions = [];
    if (completer.help) help = completer.help();
  }
  return [completions, help];
}

rl.on('line', (line) => {
  const [type, leftover] = _split(line.trim(), ' ', 1);
  if (!type) {
    return rl.prompt(true);
  }

  const cmd = tryCompleter(type, commandProcessor);

  const processor = lineProcessor[cmd];
  if (!processor) {
    log(`Unknown command '${cmd}'`);
  } else {
    processor(leftover, (err, result) => {
      if (err) return log(`${err.name} occurred: ${err.message}`);
      log(result);
    });
  }
  rl.prompt(true);
});

rl.on('SIGINT', () => {
  rl.close();
  process.exit();
});

rl.on('close', () => {
  process.exit();
});

const state = {
  client: null,
  connection: null,
  api: {}
};

commandProcessor.complete = (inputs, depth) => {
  const completions = ['call', 'connect', 'disconnect', 'event', 'exit'];
  const cmd = inputs[depth];
  return [complete(cmd, completions), depth + 1];
};

commandProcessor.call = (interfaceName, methodName, args, callback) => {
  if (!state.client) return callback(new Error('Not connected'));
  state.connection.callMethod(interfaceName, methodName, args, callback);
};

commandProcessor.call.complete = (inputs, depth) => {
  if (!state.api) return [[], depth];

  const iface = inputs[depth++];
  let method = inputs[depth];
  // there may be multiple spaces between interface and method names
  // this function completes both of them so handle empty element ('')
  // in between (just skip it)
  if (method === '' && inputs[depth + 1] !== undefined) {
    method = inputs[++depth];
  }

  let completions = complete(iface, Object.keys(state.api));
  if (method === undefined || !completions.some(el => el === iface)) {
    return [completions, depth];
  }

  completions = complete(method, state.api[iface]);
  if (completions.length === 1 && method === completions[0]) {
    // full method name -> show help
    return [[], depth + 1];
  }
  return [completions, depth + 1];
};

commandProcessor.call.help = () => (
  'call <interfaceName> <methodName> [ <arg> [ , ... ] ]'
);

commandProcessor.event = (interfaceName, eventName, args, callback) => {
  if (!state.client) return callback(new Error('Not connected'));
  state.connection.emitRemoteEvent(interfaceName, eventName, args);
  callback();
};

commandProcessor.event.help = () => (
  'event <interfaceName> <eventName> [ <arg> [ , ... ] ]'
);

function filterApiCompletions(rawApi) {
  const api = {};
  const forbidden = ['_', 'domain'];
  Object.keys(rawApi).forEach((int) => {
    api[int] = Object.keys(
      rawApi[int]).filter(c => forbidden.every(el => !c.startsWith(el)));
  });
  return api;
}

commandProcessor.connect = (
  protocol, host, port, appName, interfaces, callback
) => {
  let transport;

  switch (protocol) {
    case 'jstp':
    case 'jstps':
      transport = jstp.tcp;
      break;
    case 'ws':
    case 'wss':
      transport = jstp.ws;
      break;
    default:
      return callback(new Error(`Unknown protocol '${protocol}'`));
  }

  const url = `${protocol}://${host}:${port}`;

  state.client = transport.createClient(url);
  state.client.connectAndInspect(appName, null, null, interfaces,
      (err, connection, api) => {
        if (err) return callback(err);
        state.connection = connection;
        state.api = filterApiCompletions(api);
        // TODO: make event registering generic
        connection.on('event', (event) => {
          log(`Received remote event '${event.remoteEventName}'` +
            ` in interface '${event.interfaceName}':` +
            ` ${jstp.stringify(event.remoteEventArgs)}`);
        });
        callback();
      }
  );
};

commandProcessor.connect.help = () => (
  'connect [<protocol>://]<host>:<port> <application name> ' +
  '[ <interface> [ ... ] ]'
);

commandProcessor.disconnect = (callback) => {
  if (state.client) {
    return state.client.disconnect(() => {
      state.connection = null;
      state.client = null;
      callback();
    });
  }
  callback(new Error('Not connected'));
};

commandProcessor.exit = () => {
  rl.close();
  process.exit();
};

// str - inputs string
// separator - string to use as a separator
// limit - resulting length of output array - 1 (last one is what's left),
//         if !limit === true => means no limit and split till no more
//         separators found
// leaveEmpty - if true multiple separators in sequence will be added as
//              empty string, else they are skipped
//
// returns an array of strings
//
// the behaviour is as follows:
//  splits 'str' till limit is bound or no more separators left in 'str'
//  if leaveEmpty is true then multiple separators in sequence are written in
//  resulting array as one empty string (''), else they are skipped
//  and doesn't get counted to limit
function _split(str, separator, limit, leaveEmpty) {
  const result = [];
  let start = 0;

  const shouldPush = end =>
    start !== end || (leaveEmpty && result[result.length - 1] !== '');

  // eslint-disable-next-line no-unmodified-loop-condition
  while (!limit || result.length < limit) {
    const split = str.indexOf(separator, start);
    if (split === -1) break;
    if (shouldPush(split)) result.push(str.slice(start, split));
    start = split + separator.length;
  }
  if (shouldPush(str.length)) result.push(str.slice(start));
  return result;
}

const reportMissingArgument =
  missing => new Error(`${missing} is not provided`);

lineProcessor.call = (tokens, callback) => {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Interface name'));
  }
  const args = _split(tokens, ' ', 2);
  if (args.length === 1) {
    return callback(reportMissingArgument('Method name'));
  }
  let methodArgs;
  try {
    methodArgs = jstp.parse('[' + args[2] + ']');
  } catch (err) {
    return callback(err);
  }
  commandProcessor.call(args[0], args[1], methodArgs, (err, ...result) => {
    if (err) return callback(err);
    callback(null, `Method ${args[0]}.${args[1]} returned: ` +
                   jstp.stringify(result));
  });
};

lineProcessor.event = (tokens, callback) => {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Interface name'));
  }
  const args = _split(tokens, ' ', 2);
  if (args.length === 1) {
    return callback(reportMissingArgument('Event name'));
  }
  let eventArgs;
  try {
    eventArgs = jstp.parse('[' + args[2] + ']');
  } catch (err) {
    return callback(err);
  }
  commandProcessor.event(args[0], args[1], eventArgs, (err) => {
    if (err) return callback(err);
    callback(null, `Event ${args[0]}.${args[1]} successfully emitted`);
  });
};

lineProcessor.connect = (tokens, callback) => {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Host'));
  }
  const args = _split(tokens, ' ', 2);
  let [scheme, authority] = _split(args[0], '://', 1, true);
  if (authority === undefined) {
    authority = scheme;
    scheme = DEFAULT_SCHEME;
  }
  const [host, portString] = _split(authority, ':', 2, true);
  if (!host) {
    return callback(reportMissingArgument('Host'));
  } else if (!portString) {
    return callback(reportMissingArgument('Port'));
  }
  const port = Number(portString);
  if (isNaN(port) || port < 0 || port >= 65536) {
    return callback(new Error(`Port has incorrect value: ${portString}`));
  }
  const appName = args[1];
  if (appName === undefined) {
    return callback(reportMissingArgument('Application name'));
  }
  const interfaces = args[2] ? _split(args[2], ' ') : [];
  commandProcessor.connect(scheme, host, port, appName, interfaces, (err) => {
    if (err) return callback(err);
    callback(null, 'Connection established');
  });
};

lineProcessor.disconnect = (_, callback) => {
  commandProcessor.disconnect((err) => {
    if (err) return callback(err);
    callback(null, 'Successful disconnect');
  });
};

// Map all remaining commands directly
Object.keys(commandProcessor).map((command) => {
  if (!lineProcessor[command]) {
    lineProcessor[command] = commandProcessor[command];
  }
});

rl.prompt(true);
