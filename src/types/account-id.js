import makeClass from '../utils/make-class.js';
import {
  decodeAccountID,
  encodeAccountID
} from '@exodus/ripple-address-codec';
import {Hash160} from './hash-160.js';

const AccountID = makeClass({
  AccountID(bytes) {
    Hash160.call(this, bytes);
  },
  inherits: Hash160,
  statics: {
    from(value) {
      return value instanceof this ? value :
        /^r/.test(value) ? this.fromBase58(value) :
          new this(value);
    },
    cache: {},
    fromCache(base58) {
      let cached = this.cache[base58];
      if (!cached) {
        cached = this.cache[base58] = this.fromBase58(base58);
      }
      return cached;
    },
    fromBase58(value) {
      const acc = new this(decodeAccountID(value));
      acc._toBase58 = value;
      return acc;
    }
  },
  toJSON() {
    return this.toBase58();
  },
  cached: {
    toBase58() {
      return encodeAccountID(this._bytes);
    }
  }
});

export {
  AccountID
};
