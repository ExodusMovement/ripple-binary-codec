import makeClass from '../utils/make-class.js';
import {UInt} from './uint.js';

const UInt32 = makeClass({
  inherits: UInt,
  statics: {width: 4}
});

export {
  UInt32
};
