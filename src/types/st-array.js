import makeClass from '../utils/make-class.js';
import {ensureArrayLikeIs, SerializedType} from './serialized-type.js';
import enums from '../enums/index.js';
import {STObject} from './st-object.js';
const {Field} = enums;
const {ArrayEndMarker} = Field;

const STArray = makeClass({
  mixins: SerializedType,
  inherits: Array,
  statics: {
    fromParser(parser) {
      const array = new STArray();
      while (!parser.end()) {
        const field = parser.readField();
        if (field === ArrayEndMarker) {
          break;
        }
        const outer = new STObject();
        outer[field] = parser.readFieldValue(field);
        array.push(outer);
      }
      return array;
    },
    from(value) {
      return ensureArrayLikeIs(STArray, value).withChildren(STObject);
    }
  },
  toJSON() {
    return this.map(v => v.toJSON());
  },
  toBytesSink(sink) {
    this.forEach(so => so.toBytesSink(sink));
  }
});

export {
  STArray
};
