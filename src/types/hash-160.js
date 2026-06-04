import makeClass from '../utils/make-class.js';
import {Hash} from './hash.js';

const Hash160 = makeClass({
  inherits: Hash,
  statics: {width: 20}
});

export {
  Hash160
};
