import _ from 'lodash';
import inherits from 'inherits';

function forEach(obj, func) {
  Object.keys(obj || {}).forEach(k => {
    func(obj[k], k);
  });
}

function ensureArray(val) {
  return Array.isArray(val) ? val : [val];
}

function asConstructor(fn) {
  // Concise object methods (`Name(args) {}`) are not constructors and have no
  // `prototype`. Under the previous Babel (es2015) build these were emitted as
  // ordinary function expressions, which makeClass relies on (it reads
  // `klass.prototype` and instantiates via `new this(...)`). When the raw
  // source runs as native ESM we restore that behaviour by wrapping such a
  // method in a plain function that forwards `this`/`arguments`.
  if (typeof fn === 'function' &&
      !Object.prototype.hasOwnProperty.call(fn, 'prototype')) {
    return function() {
      return fn.apply(this, arguments);
    };
  }
  return fn;
}

export default function makeClass(klass_, definition_) {
  const definition = definition_ || klass_;
  // Keep a reference to the original constructor function as it appears on the
  // definition, so the prototype-method loop below can skip it (asConstructor
  // may return a wrapper, which would otherwise no longer compare equal).
  let klassDef = typeof klass_ === 'function' ? klass_ : null;
  let klass = asConstructor(klassDef);
  if (klass === null) {
    for (const k in definition) {
      if (k[0].match(/[A-Z]/)) {
        klassDef = definition[k];
        klass = asConstructor(klassDef);
        break;
      }
    }
  }
  const parent = definition.inherits;
  if (parent) {
    if (klass === null) {
      klass = function() {
        parent.apply(this, arguments);
      };
    }
    inherits(klass, parent);
    _.defaults(klass, parent);
  }
  if (klass === null) {
    klass = function() {};
  }
  const proto = klass.prototype;
  function addFunc(original, name, wrapper) {
    proto[name] = wrapper || original;
  }
  (definition.getters || []).forEach(k => {
    const key = '_' + k;
    proto[k] = function() {
      return this[key];
    };
  });
  forEach(definition.virtuals, (f, n) => {
    addFunc(f, n, function() {
      throw new Error('unimplemented');
    });
  });
  forEach(definition.methods, addFunc);
  forEach(definition, (f, n) => {
    if (_.isFunction(f) && f !== klass && f !== klassDef) {
      addFunc(f, n);
    }
  });
  _.assign(klass, definition.statics);
  if (typeof klass.init === 'function') {
    klass.init();
  }
  forEach(definition.cached, (f, n) => {
    const key = '_' + n;
    addFunc(f, n, function() {
      let value = this[key];
      if (value === undefined) {
        value = this[key] = f.call(this);
      }
      return value;
    });
  });
  if (definition.mixins) {
    const mixins = {};
    // Right-most in the list win
    ensureArray(definition.mixins).reverse().forEach(o => {
      _.defaults(mixins, o);
    });
    _.defaults(proto, mixins);
  }

  return klass;
};
