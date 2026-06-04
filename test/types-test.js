import _ from 'lodash';
import assert from 'assert';
import coreTypes from '../src/types/index.js';
import {SerializedType} from '../src/types/serialized-type.js';

describe('SerializedType interfaces', () => {
  _.forOwn(coreTypes, (Value, name) => {
    it(`${name} has a \`from\` static constructor`, () => {
      assert(Value.from && Value.from !== Array.from);
    });
    it(`${name} has a default constructor`, () => {
      /* eslint-disable no-new*/
      new Value();
      /* eslint-enable no-new*/
    });
    it(`${name}.from will return the same object`, () => {
      const instance = new Value();
      assert(Value.from(instance) === instance);
    });
    it(`${name} instances have toBytesSink`, () => {
      assert(new Value().toBytesSink);
    });
    it(`${name} instances have toJSON`, () => {
      assert(new Value().toJSON);
    });
    it(`${name}.from(json).toJSON() == json`, () => {
      const newJSON = new Value().toJSON();
      assert.deepEqual(Value.from(newJSON).toJSON(), newJSON);
    });
    describe(`${name} supports all methods of the SerializedType mixin`, () => {
      _.keys(SerializedType).forEach(k => {
        it(`new ${name}.prototype.${k} !== undefined`, () => {
          assert.notEqual(Value.prototype[k], undefined);
        });
      });
    });
  });
});
