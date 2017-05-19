'use strict';

module.exports = serialize;

function serialize(object) {
  let type;
  if (Array.isArray(object)) {
    type = 'array';
  } else if (object instanceof Date) {
    type = 'date';
  } else if (object === null) {
    type = 'null';
  } else {
    type = typeof(object);
  }

  const serializer = serialize.types[type];
  if (serializer) {
    return serializer(object);
  }

  return '';
}

serialize.types = {
  number:    number  => number + '',
  boolean:   boolean => (boolean ? 'true' : 'false'),
  date:      date    => `'${date.toISOString()}'`,
  undefined: ()      => 'undefined',
  null:      ()      => 'null',

  string(string) {
    const content = JSON.stringify(string).slice(1, -1);
    return `'${content.replace(/'/g, '\\\'')}'`;
  },

  array(array) {
    let result = '[';

    for (let index = 0; index < array.length; index++) {
      const value = array[index];
      if (value !== undefined) {
        result += serialize(value);
      }

      if (index !== array.length - 1) {
        result += ',';
      }
    }

    return result + ']';
  },

  object(object) {
    let result = '{';
    let firstKey = true;

    const objectKeys = Object.keys(object);
    const objectKeysCount = objectKeys.length;

    for (let i = 0; i < objectKeysCount; i++) {
      let key = objectKeys[i];
      const value = serialize(object[key]);

      if (value === '' || value === 'undefined') {
        continue;
      }

      if (!/^[a-zA-Z_]\w*$/.test(key)) {
        key = serialize.types.string(key);
      }

      if (firstKey) {
        firstKey = false;
      } else {
        result += ',';
      }

      result += key + ':' + value;
    }

    return result + '}';
  }
};
