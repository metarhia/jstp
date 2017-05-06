#!/usr/bin/env node

'use strict';

// TODO: support jstp://server and jstps://server

const jstp = require('..');
const readline = require('readline');

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

function tryComplete(input, completer) {
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
// completer - object that has '_complete(inputs, depth)' function or ._help()
//             or neither (no completions or help available)
function iterativeCompletion(inputs, depth, completer) {
  function helper(depth, oldDepth, completer, completions) {
    let help = '';

    if (completions.length !== 1) return [completions, help];
    const nextCompleter = completer[completions[0]];
    if (!nextCompleter) return [completions, help];

    if (nextCompleter.complete && depth < inputs.length) {
      const [newCompletions, newDepth] = nextCompleter.complete(inputs, depth);
      return helper(newDepth, depth, nextCompleter, newCompletions);
    }
    if (inputs[oldDepth] === completions[0]) {
      if (nextCompleter.help) help = nextCompleter.help();
      return [[], help];
    }
    return [completions, help];
  }
  if (completer.complete) {
    const [newCompletions, newDepth] = completer.complete(inputs, depth);
    return helper(newDepth, depth, completer, newCompletions);
  }
  if (completer.help) return [[], completer.help()];
  return [[], ''];
}

rl.on('line', (line) => {
  const [type, leftover] = _split(line.trim(), ' ', 1);
  if (!type) {
    return rl.prompt(true);
  }

  const cmd = tryComplete(type, commandProcessor);

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
  connection: null
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

commandProcessor.connect = (host, port, appName, callback) => {
  state.client = jstp.tcp.createClient({ host, port, secure: true });
  state.client.connectAndHandshake(appName, null, null,
      (err, connection) => {
        if (err) return callback(err);
        state.connection = connection;
        // TODO: make event registering generic
        connection.on('event', (data) => {
          log(`Received remote event: ${jstp.stringify(data)}`);
        });
        callback();
      }
  );
};

commandProcessor.connect.help = () => (
  'connect <host>:<port> <application name>'
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
  if (tokens === undefined || tokens.trim().startsWith(':')) {
    return callback(reportMissingArgument('Host'));
  }
  const args = _split(tokens, ' ', 2);
  const [host, portString] = _split(args[0], ':');
  if (portString === undefined) {
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
  commandProcessor.connect(host, port, appName, (err) => {
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
