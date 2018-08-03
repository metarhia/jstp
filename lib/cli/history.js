'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const historyPath = process.env.JSTP_CLI_HISTORY;
const historyDisabled = historyPath === '';
const historySize = Number(process.env.JSTP_CLI_HISTORY_SIZE);
const DEFAULT_HISTORY_SIZE = 1000;
const DEFAULT_FILENAME = '.jstp_cli_history';

const getHistorySize = () => {
  if (historyDisabled) return 0;
  return Number.isNaN(historySize) || historySize <= 0
    ? DEFAULT_HISTORY_SIZE
    : historySize;
};

const historyHandle = Symbol('historyHandle');

const setupHistory = (rl, callback) => {
  if (historyDisabled) {
    callback();
    return;
  }
  let resolvedPath;
  try {
    resolvedPath = historyPath || path.join(os.homedir(), DEFAULT_FILENAME);
  } catch (err) {
    callback(
      err,
      'Error: could not get home directory\nHistory will not be persisted'
    );
    return;
  }

  createFile();

  function createFile() {
    fs.open(resolvedPath, 'a+', 0o0600, (err, fd) => {
      if (err) {
        callback(
          err,
          'Error: could not open history file\nHistory will not be persisted'
        );
        return;
      }
      loadHistory(fd);
    });
  }

  function loadHistory(fd) {
    fs.readFile(fd, 'utf8', (err, data) => {
      if (err) {
        callback(err);
        return;
      }
      if (data) {
        rl.history = data.split(/[\n\r]+/, rl.historySize);
      }
      fs.close(fd, onClose);
    });
  }

  function onClose(err) {
    if (err) {
      callback(err);
      return;
    }
    open();
  }

  function open() {
    fs.open(resolvedPath, 'r+', (err, fd) => {
      if (err) {
        callback(err);
        return;
      }
      rl.on('line', flushHistory);
      rl.once('flushHistory', callback);
      rl[historyHandle] = fd;
      flushHistory();
    });
  }

  function flushHistory() {
    rl._flushingHistory = true;
    fs.ftruncate(rl[historyHandle], 0, () => {
      const data = rl.history.join(os.EOL);
      fs.write(rl[historyHandle], data, 0, 'utf8', () => {
        rl._flushingHistory = false;
        rl.emit('flushHistory');
      });
    });
  }
};

module.exports = {
  setupHistory,
  getHistorySize,
};
