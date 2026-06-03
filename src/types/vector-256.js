import makeClass from '../utils/make-class.js';
import {Hash256} from './hash-256.js';
import {ensureArrayLikeIs, SerializedType} from './serialized-type.js';

const Vector256 = makeClass({
  mixins: SerializedType,
  inherits: Array,
  statics: {
    fromParser(parser, hint) {
      const vector256 = new this();
      const bytes = hint !== null ? hint : parser.size() - parser.pos();
      const hashes = bytes / 32;
      for (let i = 0; i < hashes; i++) {
        vector256.push(Hash256.fromParser(parser));
      }
      return vector256;
    },
    from(value) {
      return ensureArrayLikeIs(Vector256, value).withChildren(Hash256);
    }
  },
  toBytesSink(sink) {
    this.forEach(h => h.toBytesSink(sink));
  },
  toJSON() {
    return this.map(hash => hash.toJSON());
  }
});

export {
  Vector256
};
