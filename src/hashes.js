import makeClass from './utils/make-class.js';
import {HashPrefix} from './hash-prefixes.js';
import types from './types/index.js';
import {parseBytes} from './utils/bytes-utils.js';
import createHash from 'create-hash';
const {Hash256} = types;

const Sha512Half = makeClass({
  Sha512Half() {
    this.hash = createHash('sha512');
  },
  statics: {
    put(bytes) {
      return new this().put(bytes);
    }
  },
  put(bytes) {
    this.hash.update(parseBytes(bytes, Buffer));
    return this;
  },
  finish256() {
    const bytes = this.hash.digest();
    return bytes.slice(0, 32);
  },
  finish() {
    return new Hash256(this.finish256());
  }
});

function sha512Half(...args) {
  const hash = new Sha512Half();
  args.forEach(a => hash.put(a));
  return parseBytes(hash.finish256(), Uint8Array);
}

function transactionID(serialized) {
  return new Hash256(sha512Half(HashPrefix.transactionID, serialized));
}

export {
  Sha512Half,
  sha512Half,
  transactionID
};
