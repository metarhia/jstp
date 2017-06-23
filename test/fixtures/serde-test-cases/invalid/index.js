'use strict';

module.exports = [
  {
    name: 'illegal input #1',
    value: 'asdf'
  },
  {
    name: 'illegal input #2',
    value: 'process'
  },
  {
    name: 'illegal input #3',
    value: 'module'
  },
  {
    name: 'illegal input #4',
    value: '#+'
  },
  {
    name: 'illegal input #5',
    value: '\'\\u{\''
  },
  {
    name: 'illegal input #6',
    value: '\'\\u{}\''
  },
  {
    name: 'old octal literals',
    value: '0123'
  },
  {
    name: 'functions',
    value: '{key:42,fn:function(){}}'
  },
  {
    name: 'properties',
    value: '{get value() { return 42; }, set value(val) {}}'
  },
  {
    name: 'missing closing bracket in array',
    value: '[42,'
  },
  {
    name: 'missing closing brace in object',
    value: '{key:'
  },
  {
    name: 'missing value in object',
    value: '{key:,}'
  },
  {
    name: 'overflow in Unicode escape sequence',
    value: '\'\\u{420420}\''
  }
];
