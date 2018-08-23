// Common utilities used by tools
'use strict';

const childProcess = require('child_process');
const fs = require('fs');

const common = {};
module.exports = common;

common.getCommandOutput = cmd => {
  const exec = common.promisify(childProcess.exec);
  return exec(cmd).then((stdout, stderr) => {
    if (stderr) console.error(stderr);
    return stdout;
  });
};

common.promisify = fn => (...args) => (
  new Promise((resolve, reject) => {
    fn(...args, (error, ...result) => {
      if (error) reject(error);
      else resolve(...result);
    });
  })
);

common.writeFile = common.promisify(fs.writeFile);
