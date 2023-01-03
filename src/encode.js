const assert = require('assert');
const serializeObject = require('./serializeObject')
const { bytesToHex } = require('./utils/bytes-utils')

function encode(json) {
  assert(typeof json === 'object');
  return bytesToHex(serializeObject(json));
}

module.exports = encode
