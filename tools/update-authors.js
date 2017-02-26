#!/usr/bin/env node

'use strict';

const path = require('path');
const { getCommandOutput, writeFile } = require('./common');

const AUTHORS_PATH = path.resolve(__dirname, '..', 'AUTHORS');

getCommandOutput('git log --reverse --format="%aN <%aE>"').then((out) => {
  const seen = new Set();
  const authors = out.split('\n').reduce((list, author) => {
    if (!seen.has(author)) {
      list.push(author);
      seen.add(author);
    }
    return list;
  }, []);
  return writeFile(AUTHORS_PATH, authors.join('\n'));
}).catch((error) => {
  const message = error.stack || error.toString();
  console.error(message);
  process.exit(1);
});
