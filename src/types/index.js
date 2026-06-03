import enums from '../enums/index.js';
import {AccountID} from './account-id.js';
import {Amount} from './amount.js';
import {Blob} from './blob.js';
import {Currency} from './currency.js';
import {Hash128} from './hash-128.js';
import {Hash160} from './hash-160.js';
import {Hash256} from './hash-256.js';
import {PathSet} from './path-set.js';
import {STArray} from './st-array.js';
import {STObject} from './st-object.js';
import {UInt16} from './uint-16.js';
import {UInt32} from './uint-32.js';
import {UInt64} from './uint-64.js';
import {UInt8} from './uint-8.js';
import {Vector256} from './vector-256.js';
const {Field} = enums;

const coreTypes = {
  AccountID,
  Amount,
  Blob,
  Currency,
  Hash128,
  Hash160,
  Hash256,
  PathSet,
  STArray,
  STObject,
  UInt8,
  UInt16,
  UInt32,
  UInt64,
  Vector256
};

Field.values.forEach(field => {
  field.associatedType = coreTypes[field.type];
});

Field.TransactionType.associatedType = enums.TransactionType;
Field.TransactionResult.associatedType = enums.TransactionResult;
Field.LedgerEntryType.associatedType = enums.LedgerEntryType;

export default coreTypes;
