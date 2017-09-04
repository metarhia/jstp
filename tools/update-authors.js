#!/usr/bin/env node

'use strict';

const path = require('path');
const { getCommandOutput, writeFile } = require('./helpers');

const AUTHORS_PATH = path.resolve(__dirname, '..', 'AUTHORS');

getCommandOutput('git log --reverse --format="%aN <%aE>"').then((out) => {
  const authors = [];
  for (const author of out.split('\n')) {
    if (!authors.includes(author)) {
      authors.push(author);
    }
  }
  return writeFile(AUTHORS_PATH, authors.join('\n'));
}).catch((error) => {
  const message = error.stack || error.toString();
  console.error(message);
  process.exit(1);
});
