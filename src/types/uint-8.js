import makeClass from '../utils/make-class.js';
import {UInt} from './uint.js';

const UInt8 = makeClass({
  inherits: UInt,
  statics: {width: 1}
});

export {
  UInt8
};
