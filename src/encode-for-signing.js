const assert = require('assert')
const { bytesToHex } = require('./utils/bytes-utils')
const signingData = require('./signing-data')

function encodeForSigning(json) {
  assert(typeof json === 'object');
  return bytesToHex(signingData(json));
}

module.exports = encodeForSigning
