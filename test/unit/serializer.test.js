'use strict';

const expect = require('chai').expect;

const jstp = require('../..');

function runTestCase(testFunction, testCase) {
  testCase.forEach((test) => {
    const title = test[0];

    it(title, () => {
      if (Array.isArray(test[1])) {
        test[1].forEach((subTest) => {
          runTest(subTest[0], subTest[1]);
        });
      } else {
        runTest(test[1], test[2]);
      }
    });
  });

  function runTest(source, target) {
    const serialized = jstp[testFunction](source);
    expect(serialized).to.eql(target);
  }
}

function swapTestCase(serializationTestCase) {
  const deserializationTestCase = [];

  serializationTestCase.forEach((serializationTest) => {
    const title = serializationTest[0].replace('serialize', 'deserialize');
    const deserializationTest = [title];

    if (Array.isArray(serializationTest[1])) {
      const tests = [];
      deserializationTest.push(tests);
      serializationTest[1].forEach((test) => {
        tests.push([test[1], test[0]]);
      });
    } else {
      deserializationTest.push(serializationTest[2]);
      deserializationTest.push(serializationTest[1]);
    }

    deserializationTestCase.push(deserializationTest);
  });

  return deserializationTestCase;
}

function skipFunctionTests(testCase) {
  return testCase.filter((test) => {
    const title = test[0];
    return title.indexOf('function') === -1;
  });
}

const marcusRecord = {
  name: 'Marcus Aurelius',
  passport: 'AE127095',
  birth: {
    date: '1990-02-15T00:00:00.000Z',
    place: 'Rome'
  },
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    zip: '03056',
    street: 'Pobedy',
    building: '37',
    floor: '1',
    room: '158'
  }
};

const marcusObject = {
  name: 'Marcus Aurelius',
  passport: 'AE127095',
  birth: {
    date: new Date('1990-02-15'),
    place: 'Rome'
  },
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    zip: '03056',
    street: 'Pobedy',
    building: '37',
    floor: '1',
    room: '158'
  }
};

const marcusRecordString = '{name:\'Marcus Aurelius\',passport:\'AE127095\',' +
  'birth:{date:\'1990-02-15T00:00:00.000Z\',place:\'Rome\'},' +
  'address:{country:\'Ukraine\',city:\'Kiev\',zip:\'03056\',' +
  'street:\'Pobedy\',building:\'37\',floor:\'1\',room:\'158\'}}';

const marcusObjectString = '{name:\'Marcus Aurelius\',passport:\'AE127095\',' +
  'birth:{date:new Date(\'1990-02-15T00:00:00.000Z\'),place:\'Rome\'},' +
  'address:{country:\'Ukraine\',city:\'Kiev\',zip:\'03056\',' +
  'street:\'Pobedy\',building:\'37\',floor:\'1\',room:\'158\'}}';

const recordCommonTestCase = [
  ['must correctly serialize an empty object', {}, '{}'],
  ['must serialize numbers', [
    [0, '0'], [42, '42'], [-3, '-3'], [1e100, '1e+100'], [1e-3, '0.001']
  ]],
  ['must serialize strings', [
    ['str', '\'str\''],
    ['first\nsecond', '\'first\\nsecond\''],
    ['it\'s', '\'it\\\'s\''],
    ['01\u0000\u0001', '\'01\\u0000\\u0001\'']
  ]],
  ['must serialize booleans', [
    [true, 'true'],
    [false, 'false']
  ]],
  ['must serialize arrays', [
    [[], '[]'],
    [[1, 2, 3], '[1,2,3]'],
    [['outer', ['inner']], '[\'outer\',[\'inner\']]']
  ]],
  ['must serialize undefined value', undefined, 'undefined'],
  ['must serialize null value', null, 'null'],
  ['must not omit null fields of an object',
    { field1: 'value', field2: null },
    '{field1:\'value\',field2:null}' ]
];

const recordSerializationTestCase = recordCommonTestCase.concat([
  ['must serialize sparse arrays',
    // eslint-disable-next-line no-sparse-arrays
    [[[1, , 3], '[1,,3]']]],
  ['must omit undefined fields of an object',
    { field1: 'value', field2: undefined },
    '{field1:\'value\'}' ],
  ['must omit functions',
    { key: 42, fn() {} }, '{key:42}'],
  ['must serialize non-identifier keys',
    { '*': 42 }, '{\'*\':42}']
]);

const recordDeserializationTestCase =
  swapTestCase(recordCommonTestCase).concat([
    ['must skip whitespace',
      '{ key:\n\t42 }', { key: 42 }],
    ['must parse single-quoted keys',
      '{\'key\': 42}', { key: 42 }],
    ['must parse double-quoted keys',
      '{"key": 42}', { key: 42 }],
    ['must parse binary numbers',
      '0b1010', 10],
    ['must parse octal numbers',
      '0o123', 83],
    ['must parse hexadecimal numbers', [
      ['0xff', 0xff],
      ['0xAF', 0xaf]
    ]],
    ['must parse Unicode code point escapes',
      '\'\\u{1F49A}\\u{1F49B}\'', '💚💛']
  ]);

const baseObjectSerializationTestCase =
  skipFunctionTests(recordSerializationTestCase);

const additionalObjectSerializationTestCase = [
  ['must serialize dates',
    new Date(1473249597286), 'new Date(\'2016-09-07T11:59:57.286Z\')'],
  ['must correctly serialize a complex object',
    marcusObject, marcusObjectString]
];

const baseObjectDeserializationTestCase =
  skipFunctionTests(recordDeserializationTestCase);

const additionalObjectDeserializationTestCase =
  swapTestCase(additionalObjectSerializationTestCase);

function testSyntaxError(parseFunction) {
  it('must throw error on illegal input', () => {
    [ 'asdf',
      'process',
      'module',
      '#+',
      '\'\\u{\'',
      '\'\\u{}\''
    ].map(input => jstp[parseFunction].bind(null, input)).forEach((fn) => {
      expect(fn).to.throw();
    });
  });
}

describe('JSTP Serializer and Deserializer', () => {
  describe('JSTP Record Serialization', () => {
    describe('jstp.stringify', () => {
      runTestCase('stringify', recordSerializationTestCase);
      runTestCase('stringify', [
        ['must serialize dates to strings',
          new Date(1473249597286), '\'2016-09-07T11:59:57.286Z\''],
        ['must correctly serialize a complex object', [
          [marcusRecord, marcusRecordString],
          [marcusObject, marcusRecordString]
        ]]
      ]);
    });

    describe('jstp.parse', () => {
      runTestCase('parse', recordDeserializationTestCase);
      runTestCase('parse', [
        ['must deserialize sparse arrays to arrays with undefined values',
          '[1,,3]', [1, undefined, 3]],
        ['must correctly deserialize a complex object',
          marcusRecordString, marcusRecord]
      ]);

      it('must not allow functions', () => {
        [ '{key:42,fn:function(){}}',
          '{get value() { return 42; }, set value(val) {}}'
        ].map(input => jstp.parse.bind(null, input)).forEach((fn) => {
          expect(fn).to.throw();
        });
      });

      testSyntaxError('parse');

      it('must skip undefined values of an object', () => {
        expect(jstp.parse('{value:undefined}')).to.eql({});
      });

      it('must not allow old octal literals syntax', () => {
        expect(() => {
          jstp.parse('0123');
        }).to.throw();
      });
    });
  });

  describe('JSTP Object Serialization', () => {
    describe('jstp.dump', () => {
      runTestCase('dump', baseObjectSerializationTestCase);
      runTestCase('dump', additionalObjectSerializationTestCase);
    });
    describe('jstp.interprete', () => {
      runTestCase('interprete', baseObjectDeserializationTestCase);
      runTestCase('interprete', additionalObjectDeserializationTestCase);
      runTestCase('interprete', [
        ['must deserialize sparse arrays to sparse arrays',
          // eslint-disable-next-line no-sparse-arrays
          '[1,,3]', [1, , 3]],
      ]);
      testSyntaxError('interprete');
    });
  });
});
