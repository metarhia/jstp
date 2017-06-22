'use strict';

let logger = null;

const defaultLevelCallback = level => logger && logger[level];
let isLevel = defaultLevelCallback;

const levelToNumber = {
  fatal: 60, error: 50,
  warn: 40, info: 30,
  verbose: 25, debug: 20,
  silly: 10, trace: 10
};

const winstonLevelCallback =
  level => levelToNumber[logger.level] <= levelToNumber[level];

const bunyanLevelCallback =
  level => logger.level() <= levelToNumber[level];

// Set logger that will be used to forward JSTP logging
//   loggerInstance - instance of logger that may have methods
//                    'debug', 'verbose', 'info', 'warn', 'error', 'silly'.
//                    It must have levels that levelCallback
//                    reports as existing.
//   levelCallback - function to check current logging level, will be
//                   called with one of the:
//                   'debug', 'verbose', 'info', 'warn', 'error', 'silly'.
//                   by default defaultLevelCallback will be used that only
//                   checks that such method exists.
//                   You can provide your own or use one of the available:
//                   winston (winstonLevelCallback) or
//                   bunyan(bunyanLevelCallback).
//                   In case of bunyan to support silly logging level
//                   you must map 'silly' function to 'trace'.
//
const set = (loggerInstance, levelCallback) => {
  if (loggerInstance) logger = loggerInstance;
  if (levelCallback) isLevel = levelCallback;
};

const get = () => logger;

const isSilly = () => isLevel('silly');
const isDebug = () => isLevel('debug');
const isVerbose = () => isLevel('verbose');
const isInfo = () => isLevel('info');
const isWarn = () => isLevel('warn');
const isError = () => isLevel('error');

module.exports = {
  get,
  set,
  winstonLevelCallback,
  bunyanLevelCallback,
  defaultLevelCallback,
  isLevel,
  isSilly,
  isDebug,
  isVerbose,
  isInfo,
  isWarn,
  isError
};
