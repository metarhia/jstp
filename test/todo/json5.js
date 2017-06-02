'use strict';

const fs = require('fs');
const path = require('path');
const tap = require('tap');
const deepEqual = require('lodash.isequal');
const jstp = require('../..');

const supportedByUs = {
  arrays: [
    'leading-comma-array',
    'lone-trailing-comma-array'
  ],
  numbers: [
    'negative-noctal',
    'noctal-with-leading-octal-digit',
    'noctal',
    'positive-noctal'
  ]
};

// Parses a JavaScript object, and if it's a sparse array,
// converts it to a dense one.
function extendedEval(source) {
  const obj = eval(`(${source}\n)`);
  if (Array.isArray(obj)) {
    for (let index = 0; index < obj.length; index++) {
      if (!(index in obj)) {
        obj[index] = undefined;
      }
    }
  }
  return obj;
}

const testCasesPath = path.resolve(__dirname, '../fixtures/json5');
const testCases = fs.readdirSync(testCasesPath)
  .map(caseName => ({
    name: caseName,
    path: path.join(testCasesPath, caseName)
  }))
  .filter(testCase => fs.statSync(testCase.path).isDirectory());

testCases.forEach((testCase) => {
  tap.test(testCase.name, (test) => {
    fs.readdirSync(testCase.path).forEach((filename) => {
      const ext = path.extname(filename);
      if (!['.json', '.json5', '.js', '.txt'].includes(ext)) {
        return;
      }

      const testName = path.basename(filename, ext);
      const testPath = path.join(testCase.path, filename);
      const file = fs.readFileSync(testPath, 'utf8');

      test.test(testName, (test) => {
        switch (ext) {
          case '.json':
            test.assert(deepEqual(jstp.parse(file), JSON.parse(file)));
            break;
          case '.json5':
            test.assert(deepEqual(jstp.parse(file), extendedEval(file)));
            break;
          case '.js': {
            const supportedTests = supportedByUs[testCase.name];
            if (supportedTests && supportedTests.includes(testName)) {
              test.assert(deepEqual(jstp.parse(file), extendedEval(file)));
            } else {
              test.throws(() => jstp.parse(file));
            }
            break;
          }
          case '.txt':
            test.throws(() => jstp.parse(file));
            break;
        }
        test.end();
      });
    });
    test.end();
  });
});
