import assert from 'assert';
import coreTypes from './coretypes.js';
const {quality,
       binary: {bytesToHex,
                signingData,
                signingClaimData,
                multiSigningData,
                binaryToJSON,
                serializeObject,
                BinaryParser}} = coreTypes;

function decodeLedgerData(binary) {
  assert(typeof binary === 'string', 'binary must be a hex string');
  const parser = new BinaryParser(binary)
  return {
    ledger_index:          parser.readUInt32(),
    total_coins:           parser.readType(coreTypes.UInt64).valueOf().toString(),
    parent_hash:           parser.readType(coreTypes.Hash256).toHex(),
    transaction_hash:      parser.readType(coreTypes.Hash256).toHex(),
    account_hash:          parser.readType(coreTypes.Hash256).toHex(),
    parent_close_time:     parser.readUInt32(),
    close_time:            parser.readUInt32(),
    close_time_resolution: parser.readUInt8(),
    close_flags:           parser.readUInt8()
  }
}

function decode(binary) {
  assert(typeof binary === 'string', 'binary must be a hex string');
  return binaryToJSON(binary);
}

function encode(json) {
  assert(typeof json === 'object');
  return bytesToHex(serializeObject(json));
}

function encodeForSigning(json) {
  assert(typeof json === 'object');
  return bytesToHex(signingData(json));
}

function encodeForSigningClaim(json) {
  assert(typeof json === 'object');
  return bytesToHex(signingClaimData(json));
}

function encodeForMultisigning(json, signer) {
  assert(typeof json === 'object');
  assert.equal(json.SigningPubKey, '');
  return bytesToHex(multiSigningData(json, signer));
}

function encodeQuality(value) {
  assert(typeof value === 'string');
  return bytesToHex(quality.encode(value));
}

function decodeQuality(value) {
  assert(typeof value === 'string');
  return quality.decode(value).toString();
}

export {
  decode,
  encode,
  encodeForSigning,
  encodeForSigningClaim,
  encodeForMultisigning,
  encodeQuality,
  decodeQuality,
  decodeLedgerData
};

// Mirror the legacy CommonJS default-object shape as the ESM default export,
// so existing default-import consumers (e.g. `@exodus/ripple-lib`'s sign paths
// and `hw-ledger`, which do `import binaryCodec from '@exodus/ripple-binary-codec'`
// then call `binaryCodec.encode(...)`) keep working. Named exports above cover
// `import { encode } from ...` consumers.
export default {
  decode,
  encode,
  encodeForSigning,
  encodeForSigningClaim,
  encodeForMultisigning,
  encodeQuality,
  decodeQuality,
  decodeLedgerData
};
