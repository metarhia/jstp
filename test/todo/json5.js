'use strict';

const fs = require('fs');
const path = require('path');
const tap = require('tap');
const jstp = require('../..');
const jsParser = require('../../lib/serde-fallback');

const supportedByUs = {
  arrays: ['leading-comma-array', 'lone-trailing-comma-array'],
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
const testCases = fs
  .readdirSync(testCasesPath)
  .map(caseName => ({
    name: caseName,
    path: path.join(testCasesPath, caseName),
  }))
  .filter(testCase => fs.statSync(testCase.path).isDirectory());

testCases.forEach(testCase => {
  tap.test(testCase.name, test => {
    fs.readdirSync(testCase.path).forEach(filename => {
      const ext = path.extname(filename);
      if (!['.json', '.json5', '.js', '.txt'].includes(ext)) {
        return;
      }

      const testName = path.basename(filename, ext);
      const testPath = path.join(testCase.path, filename);
      const file = fs.readFileSync(testPath, 'utf8');

      const testCases = {
        json(test, parser) {
          test.strictSame(parser.parse(file), JSON.parse(file));
        },

        json5(test, parser) {
          test.strictSame(parser.parse(file), extendedEval(file));
        },

        js(test, parser) {
          const supportedTests = supportedByUs[testCase.name];
          if (supportedTests && supportedTests.includes(testName)) {
            test.strictSame(parser.parse(file), extendedEval(file));
          } else {
            test.throws(() => parser.parse(file));
          }
        },

        txt(test, parser) {
          test.throws(() => parser.parse(file));
        },
      };

      const runTest = (parserName, parser) => {
        test.test(`${testName} (${parserName} parser)`, test => {
          testCases[ext.slice(1)](test, parser);
          test.end();
        });
      };

      runTest('native', jstp);
      runTest('js', jsParser);
    });
    test.end();
  });
});
