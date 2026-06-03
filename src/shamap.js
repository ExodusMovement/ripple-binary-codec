import assert from 'assert';
import makeClass from './utils/make-class.js';
import types from './types/index.js';
import {HashPrefix} from './hash-prefixes.js';
import {Sha512Half as Hasher} from './hashes.js';
const {Hash256} = types;

const ShaMapNode = makeClass({
  virtuals: {
    hashPrefix() {},
    isLeaf() {},
    isInner() {}
  },
  cached: {
    hash() {
      const hasher = Hasher.put(this.hashPrefix());
      this.toBytesSink(hasher);
      return hasher.finish();
    }
  }
});

const ShaMapLeaf = makeClass({
  inherits: ShaMapNode,
  ShaMapLeaf(index, item) {
    ShaMapNode.call(this);
    this.index = index;
    this.item = item;
  },
  isLeaf() {
    return true;
  },
  isInner() {
    return false;
  },
  hashPrefix() {
    return this.item.hashPrefix();
  },
  toBytesSink(sink) {
    this.item.toBytesSink(sink);
    this.index.toBytesSink(sink);
  }
});

const $uper = ShaMapNode.prototype;

const ShaMapInner = makeClass({
  inherits: ShaMapNode,
  ShaMapInner(depth = 0) {
    ShaMapNode.call(this);
    this.depth = depth;
    this.slotBits = 0;
    this.branches = Array(16);
  },
  isInner() {
    return true;
  },
  isLeaf() {
    return false;
  },
  hashPrefix() {
    return HashPrefix.innerNode;
  },
  setBranch(slot, branch) {
    this.slotBits = this.slotBits | (1 << slot);
    this.branches[slot] = branch;
  },
  empty() {
    return this.slotBits === 0;
  },
  hash() {
    if (this.empty()) {
      return Hash256.ZERO_256;
    }
    return $uper.hash.call(this);
  },
  toBytesSink(sink) {
    for (let i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i];
      const hash = branch ? branch.hash() : Hash256.ZERO_256;
      hash.toBytesSink(sink);
    }
  },
  addItem(index, item, leaf) {
    assert(index instanceof Hash256);
    const nibble = index.nibblet(this.depth);
    const existing = this.branches[nibble];
    if (!existing) {
      this.setBranch(nibble, leaf || new ShaMapLeaf(index, item));
    } else if (existing.isLeaf()) {
      const newInner = new ShaMapInner(this.depth + 1);
      newInner.addItem(existing.index, null, existing);
      newInner.addItem(index, item, leaf);
      this.setBranch(nibble, newInner);
    } else if (existing.isInner()) {
      existing.addItem(index, item, leaf);
    } else {
      assert(false);
    }
  }
});

const ShaMap = makeClass({
  inherits: ShaMapInner
});

export {
  ShaMap
};
