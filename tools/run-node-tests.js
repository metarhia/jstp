#!/usr/bin/env node

'use strict';

const os = require('os');
const childProcess = require('child_process');

const jobs = `-j${process.env.JOBS || os.cpus().length}`;

const tests = childProcess.spawn(
  'tap', [jobs, 'test/node/*.js'], { shell: true, stdio: 'inherit' }
);

tests.on('error', error => {
  console.error(error.message);
  process.exit(1);
});

tests.on('exit', code => {
  process.exit(code);
});
