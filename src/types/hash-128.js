import makeClass from '../utils/make-class.js';
import {Hash} from './hash.js';

const Hash128 = makeClass({
  inherits: Hash,
  statics: {width: 16}
});

export {
  Hash128
};
