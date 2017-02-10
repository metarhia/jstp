'use strict';

const fs = require('fs');
const childProcess = require('child_process');

const EXIT_SUCCESS = 0;
const EXIT_FAIL = 1;

const nodeGyp = childProcess.spawn('node-gyp', ['rebuild'], { shell: true });
const errorLines = [];

nodeGyp.on('error', () => {
  handleBuildError(EXIT_FAIL);
});

nodeGyp.stdout.pipe(process.stdout);

nodeGyp.stderr.on('data', (data) => {
  const line = data.toString();
  console.error(line);
  errorLines.push(line);
});

nodeGyp.on('exit', (code) => {
  if (errorLines.length > 0) {
    fs.writeFileSync('builderror.log', errorLines.join('\n'));
  }
  if (code !== EXIT_SUCCESS) {
    handleBuildError(code);
  }
  process.exit();
});

function handleBuildError(code) {
  if (process.env.TRAVIS) {
    process.exit(code);
  } else {
    console.warn('Could not build JSTP native extensions, ' +
      'JavaScript implementation will be used instead.');
  }
}
