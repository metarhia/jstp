'use strict';

let crypto;

if (typeof window !== 'undefined') {
  crypto = require('./common-crypto-fallback');
} else {
  crypto = require('crypto');
}

// Forward an event from one EventEmitter to another.
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventName - name of the event
//   newEventName - name of the forwarded event (optional)
//
const forwardEvent = (from, to, eventName, newEventName = eventName) => {
  from.on(eventName, (...eventArgs) => {
    to.emit(newEventName, ...eventArgs);
  });
};

// Forward events from one EventEmitter to another.
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventNames - array of names of events
//
const forwardMultipleEvents = (from, to, eventNames) => {
  eventNames.forEach(event => {
    forwardEvent(from, to, event);
  });
};

// Try to require `moduleName` and return the exported object if the module is
// found or null otherwise.
//
const safeRequire = moduleName => {
  try {
    return [null, require(moduleName)];
  } catch (err) {
    return [err, null];
  }
};

// Mixin source methods to target without overriding existing methods
// for ES6 classes.
//
const mixin = (target, source) => {
  Object.getOwnPropertyNames(source).forEach(property => {
    if (!target[property]) {
      target[property] = source[property];
    }
  });
};

// If last element of the array args is a function then
// pops the array and returns that function else returns null.
//
const extractCallback = args => {
  if (typeof args[args.length - 1] === 'function') return args.pop();
  return null;
};

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
const doNothing = () => {};

// Splits string by the last occurrence of separator
//
const rsplit = (string, separator) => {
  const lastIndex = string.lastIndexOf(separator);
  if (lastIndex < 0) return [string];
  return [string.slice(0, lastIndex), string.slice(lastIndex + 1)];
};

// Value prefetcher to use when crypto.randomBytes is required to generate
// multiple same-size values. `bufSize` must be a multiple of `valueSize` for
// it to work.
//
class CryptoRandomPrefetcher {
  constructor(bufSize, valueSize) {
    this.buf = crypto.randomBytes(bufSize);
    this.pos = 0;
    this.vsz = valueSize;
  }

  next(
    // Returns Buffer with next `valueSize` random bytes.
  ) {
    if (this.pos === this.buf.length) {
      this.pos = 0;
      crypto.randomFillSync(this.buf);
    }
    const end = this.pos + this.vsz;
    const buf = this.buf.slice(this.pos, end);
    this.pos = end;
    return buf;
  }
}

const randPrefetcher = new CryptoRandomPrefetcher(4096, 4);
const UINT32_MAX = 0xFFFFFFFF;

// Generate random number in the range from 0 inclusive up to
// but not including 1 (same as Math.random),
// but use crypto-secure number generator.
//
const cryptoRandom =
  () => randPrefetcher.next().readUInt32LE(0, true) / (UINT32_MAX + 1);

// Special purpose map, that does not immediately delete the values when
// `delete` method is being called, but postpones the deletion instead, every
// time the `delete` method is called, to some moment in the future, but not
// later than two times the `interval`. Also, whenever `get` is called on the
// key that is awaiting its deletion, the deletion is aborted.
//
class ExpiringMap extends Map {
  constructor(interval, ...args) {
    super(...args);

    this._interval = interval;
    this._timer = setInterval(() => this._purge(), interval).unref();
    this._deletionTimes = new Map();
  }

  _purge() {
    const purgeTime = Date.now();
    this._deletionTimes.forEach((delTime, key) => {
      if (purgeTime - delTime > this._interval) {
        super.delete(key);
      }
    });
  }

  get(key) {
    this._deletionTimes.delete(key);
    return super.get(key);
  }

  delete(key) {
    this._deletionTimes.set(key, Date.now());
  }
}

const utf16singleUnit = (1 << 16) - 1;

// https://tools.ietf.org/html/rfc3629#section-3
const utf8bytesLastCodePoints = {
  1: 0x007F,
  2: 0x07FF,
  3: 0xFFFF,
};

const utf8split = (str, maxByteCount) => {
  let utf8length = 0;
  for (let i = 0; i < str.length;) {
    const codePoint = str.codePointAt(i);

    // Calculate code point size in bytes when encoded with UTF-8:
    let utf8codePointSize = 4;
    for (let byteCount = 1; byteCount <= 3; byteCount++) {
      if (codePoint <= utf8bytesLastCodePoints[byteCount]) {
        utf8codePointSize = byteCount;
        break;
      }
    }

    // Calculate code point size in bytes when encoded with UTF-16:
    const utf16codePointSize = (codePoint > utf16singleUnit) ? 2 : 1;
    if (utf8codePointSize > maxByteCount) {
      return [str.slice(0, i), str.slice(i), utf8length];
    } else if (utf8codePointSize === maxByteCount) {
      const splitPoint = i + utf16codePointSize;
      return [
        str.slice(0, splitPoint),
        str.slice(splitPoint),
        utf8length + utf8codePointSize,
      ];
    }
    maxByteCount -= utf8codePointSize;
    utf8length += utf8codePointSize;
    i += utf16codePointSize;
  }
  return [str, '', utf8length];
};

module.exports = {
  forwardEvent,
  forwardMultipleEvents,
  safeRequire,
  mixin,
  extractCallback,
  doNothing,
  rsplit,
  cryptoRandom,
  ExpiringMap,
  utf8split,
};
