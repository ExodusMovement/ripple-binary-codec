import _ from 'lodash';
import enums from './enums/index.js';
import types from './types/index.js';
import * as binary from './binary.js';
import {ShaMap} from './shamap.js';
import * as ledgerHashes from './ledger-hashes.js';
import * as hashes from './hashes.js';
import quality from './quality.js';
import {HashPrefix} from './hash-prefixes.js';
const {Field} = enums;


export default _.assign({
  hashes: _.assign({}, hashes, ledgerHashes),
  binary,
  enums,
  quality,
  Field,
  HashPrefix,
  ShaMap
},
  types
);
