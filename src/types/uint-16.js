import makeClass from '../utils/make-class.js';
import {UInt} from './uint.js';

const UInt16 = makeClass({
  inherits: UInt,
  statics: {width: 2}
});

export {
  UInt16
};
