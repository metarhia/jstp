// Common utilities used by tools
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');

const promisify = util.promisify || (fn => (...args) => (
  new Promise((resolve, reject) => {
    fn(...args, (error, ...result) => {
      if (error) reject(error);
      else resolve(...result);
    });
  })
));

const getCommandOutput = (cmd) => {
  const exec = promisify(childProcess.exec);
  return exec(cmd).then((stdout, stderr) => {
    if (stderr) console.error(stderr);
    return stdout;
  });
};

const writeFile = promisify(fs.writeFile);

module.exports = {
  getCommandOutput,
  writeFile,
};
