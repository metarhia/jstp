'use strict';

const test = require('tap').test;

const { utf8split } = require('../../lib/common');

const runTestCases = (test, string, testCases) => {
  testCases.forEach(testCase => {
    const result = utf8split(string, testCase.maxByteCount);
    test.strictSame(result, testCase.result);
  });
};

test(
  'must correctly split strings with code points using single UTF-8 code unit',
  test => {
    const string = 'test string';
    const testCases = [
      {
        maxByteCount: 1,
        result: ['t', 'est string', 1],
      },
      {
        maxByteCount: 5,
        result: ['test ', 'string', 5],
      },
      {
        maxByteCount: 11,
        result: ['test string', '', 11],
      },
      {
        maxByteCount: 15,
        result: ['test string', '', 11],
      },
    ];
    runTestCases(test, string, testCases);
    test.end();
  }
);

test(
  'must correctly split strings with code points using two UTF-8 code units',
  test => {
    const string = 'тестоваястрока';
    const testCases = [
      {
        maxByteCount: 1,
        result: ['', 'тестоваястрока', 0],
      },
      {
        maxByteCount: 2,
        result: ['т', 'естоваястрока', 2],
      },
      {
        maxByteCount: 17,
        result: ['тестовая', 'строка', 16],
      },
      {
        maxByteCount: 28,
        result: ['тестоваястрока', '', 28],
      },
      {
        maxByteCount: 31,
        result: ['тестоваястрока', '', 28],
      },
    ];
    runTestCases(test, string, testCases);
    test.end();
  }
);

test(
  'must correctly split strings with code points using three UTF-8 code units',
  test => {
    const string = '测试字符串';
    const testCases = [
      {
        maxByteCount: 1,
        result: ['', '测试字符串', 0],
      },
      {
        maxByteCount: 2,
        result: ['', '测试字符串', 0],
      },
      {
        maxByteCount: 3,
        result: ['测', '试字符串', 3],
      },
      {
        maxByteCount: 8,
        result: ['测试', '字符串', 6],
      },
      {
        maxByteCount: 15,
        result: ['测试字符串', '', 15],
      },
      {
        maxByteCount: 20,
        result: ['测试字符串', '', 15],
      },
    ];
    runTestCases(test, string, testCases);
    test.end();
  }
);

test(
  'must correctly split strings with code points using four UTF-8 code units',
  test => {
    const string = '💓💕💖💗💝';
    const testCases = [
      {
        maxByteCount: 1,
        result: ['', '💓💕💖💗💝', 0],
      },
      {
        maxByteCount: 2,
        result: ['', '💓💕💖💗💝', 0],
      },
      {
        maxByteCount: 3,
        result: ['', '💓💕💖💗💝', 0],
      },
      {
        maxByteCount: 4,
        result: ['💓', '💕💖💗💝', 4],
      },
      {
        maxByteCount: 12,
        result: ['💓💕💖', '💗💝', 12],
      },
      {
        maxByteCount: 14,
        result: ['💓💕💖', '💗💝', 12],
      },
      {
        maxByteCount: 20,
        result: ['💓💕💖💗💝', '', 20],
      },
      {
        maxByteCount: 25,
        result: ['💓💕💖💗💝', '', 20],
      },
    ];
    runTestCases(test, string, testCases);
    test.end();
  }
);

test(
  'must correctly split strings with code points using different counts of ' +
  'UTF-8 code units',
  test => {
    const string = 'т测t💓';
    const testCases = [
      {
        maxByteCount: 1,
        result: ['', 'т测t💓', 0],
      },
      {
        maxByteCount: 2,
        result: ['т', '测t💓', 2],
      },
      {
        maxByteCount: 3,
        result: ['т', '测t💓', 2],
      },
      {
        maxByteCount: 4,
        result: ['т', '测t💓', 2],
      },
      {
        maxByteCount: 5,
        result: ['т测', 't💓', 5],
      },
      {
        maxByteCount: 6,
        result: ['т测t', '💓', 6],
      },
      {
        maxByteCount: 7,
        result: ['т测t', '💓', 6],
      },
      {
        maxByteCount: 8,
        result: ['т测t', '💓', 6],
      },
      {
        maxByteCount: 9,
        result: ['т测t', '💓', 6],
      },
      {
        maxByteCount: 10,
        result: ['т测t💓', '', 10],
      },
      {
        maxByteCount: 11,
        result: ['т测t💓', '', 10],
      },
    ];
    runTestCases(test, string, testCases);
    test.end();
  }
);
