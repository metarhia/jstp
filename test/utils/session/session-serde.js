'use strict';

const jstp = require('../../..');

function serialize(session) {
  if (!(session instanceof jstp.Session)) {
    throw new TypeError('session is expected to be a jstp.Session object');
  }
  const copy = Object.assign(Object.create(null), session);
  copy.buffer = Array.from(copy.buffer);
  copy.connection = null;
  return JSON.stringify(copy);
}

function deserialize(serializedSession) {
  const session = JSON.parse(serializedSession);
  session.buffer = new Map(session.buffer);
  return Object.assign(new jstp.Session(), session);
}

module.exports = {
  serialize,
  deserialize,
};
