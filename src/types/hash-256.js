import makeClass from '../utils/make-class.js';
import {Hash} from './hash.js';

const Hash256 = makeClass({
  inherits: Hash,
  statics: {
    width: 32,
    init() {
      this.ZERO_256 = new this(new Uint8Array(this.width));
    }
  }
});

export {
  Hash256
};
