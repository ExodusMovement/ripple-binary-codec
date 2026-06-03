/* eslint-disable func-style */

import BN from 'bn.js';
import assert from 'assert';
import lib from '../src/coretypes.js';
import {encode} from '../src/index.js';
import {loadFixture} from './utils.js';
import deliverMinTx from './fixtures/delivermin-tx.json' with { type: 'json' };
import deliverMinTxBinary from './fixtures/delivermin-tx-binary.json' with { type: 'json' };
import signerListSetTx from './fixtures/signerlistset-tx.json' with { type: 'json' };
import signerListSetBinary from './fixtures/signerlistset-tx-binary.json' with { type: 'json' };
import signerListSetMeta from './fixtures/signerlistset-tx-meta-binary.json' with { type: 'json' };
import depositPreauthTx from './fixtures/deposit-preauth-tx.json' with { type: 'json' };
import depositPreauthBinary from './fixtures/deposit-preauth-tx-binary.json' with { type: 'json' };
import depositPreauthMeta from './fixtures/deposit-preauth-tx-meta-binary.json' with { type: 'json' };
import escrowCreateTx from './fixtures/escrow-create-tx.json' with { type: 'json' };
import escrowCreateBinary from './fixtures/escrow-create-binary.json' with { type: 'json' };
import escrowFinishTx from './fixtures/escrow-finish-tx.json' with { type: 'json' };
import escrowFinishBinary from './fixtures/escrow-finish-binary.json' with { type: 'json' };
import escrowFinishMeta from './fixtures/escrow-finish-meta-binary.json' with { type: 'json' };
import escrowCancelTx from './fixtures/escrow-cancel-tx.json' with { type: 'json' };
import escrowCancelBinary from './fixtures/escrow-cancel-binary.json' with { type: 'json' };
import paymentChannelCreateTx from './fixtures/payment-channel-create-tx.json' with { type: 'json' };
import paymentChannelCreateBinary from './fixtures/payment-channel-create-binary.json' with { type: 'json' };
import paymentChannelFundTx from './fixtures/payment-channel-fund-tx.json' with { type: 'json' };
import paymentChannelFundBinary from './fixtures/payment-channel-fund-binary.json' with { type: 'json' };
import paymentChannelClaimTx from './fixtures/payment-channel-claim-tx.json' with { type: 'json' };
import paymentChannelClaimBinary from './fixtures/payment-channel-claim-binary.json' with { type: 'json' };
const {binary: {makeParser, BytesList, BinarySerializer}} = lib;
const {UInt8, UInt16, UInt32, UInt64, STObject} = lib;
const fixtures = loadFixture('data-driven-tests.json');
const SignerListSet = {
  tx: signerListSetTx,
  binary: signerListSetBinary,
  meta: signerListSetMeta
};
const DepositPreauth = {
  tx: depositPreauthTx,
  binary: depositPreauthBinary,
  meta: depositPreauthMeta
};
const Escrow = {
  create: {
    tx: escrowCreateTx,
    binary: escrowCreateBinary
  },
  finish: {
    tx: escrowFinishTx,
    binary: escrowFinishBinary,
    meta: escrowFinishMeta
  },
  cancel: {
    tx: escrowCancelTx,
    binary: escrowCancelBinary
  }
}
const PaymentChannel = {
  create: {
    tx: paymentChannelCreateTx,
    binary: paymentChannelCreateBinary
  },
  fund: {
    tx: paymentChannelFundTx,
    binary: paymentChannelFundBinary
  },
  claim: {
    tx: paymentChannelClaimTx,
    binary: paymentChannelClaimBinary
  }
}

function bytesListTest() {
  const list = new BytesList().put([0]).put([2, 3]).put([4, 5]);
  it('is an Array<Uint8Array>', function() {
    assert(Array.isArray(list.arrays));
    assert(list.arrays[0] instanceof Uint8Array);
  });
  it('keeps track of the length itself', function() {
    assert.equal(list.length, 5);
  });
  it('can join all arrays into one via toBytes', function() {
    const joined = list.toBytes();
    assert(joined.length, 5);
    assert.deepEqual(joined, Uint8Array.from([0, 2, 3, 4, 5]));
  });
}

function assertRecycles(blob) {
  const parser = makeParser(blob);
  const so = parser.readType(STObject);
  const out = new BytesList();
  so.toBytesSink(out);
  const hex = out.toHex();
  assert.equal(hex, blob);
  assert.notEqual(hex + ':', blob);
}

function nestedObjectTests() {
  fixtures.whole_objects.forEach((f, i) => {
    it(`whole_objects[${i}]: can parse blob and dump out same blob`,
    /*                                              */ () => {
        assertRecycles(f.blob_with_no_signing);
      });
  });
}

function UIntTest() {
  function check(type, n, expected) {
    it(`Uint${type.width * 8} serializes ${n} as ${expected}`, function() {
      const bl = new BytesList();
      const serializer = new BinarySerializer(bl);
      if (expected === 'throws') {
        assert.throws(() => serializer.writeType(type, n));
        return;
      }
      serializer.writeType(type, n);
      assert.deepEqual(bl.toBytes(), Uint8Array.from(expected));
    });
  }

  check(UInt8, 5, [5]);
  check(UInt16, 5, [0, 5]);
  check(UInt32, 5, [0, 0, 0, 5]);
  check(UInt32, 0xFFFFFFFF, [255, 255, 255, 255]);
  check(UInt8, 0xFEFFFFFF, 'throws');
  check(UInt16, 0xFEFFFFFF, 'throws');
  check(UInt16, 0xFEFFFFFF, 'throws');
  check(UInt64, 0xFEFFFFFF, [0, 0, 0, 0, 254, 255, 255, 255]);
  check(UInt64, -1, 'throws');
  check(UInt64, 0, [0, 0, 0, 0, 0, 0, 0, 0]);
  check(UInt64, 1, [0, 0, 0, 0, 0, 0, 0, 1]);
  check(UInt64, new BN(1), [0, 0, 0, 0, 0, 0, 0, 1]);
}


function parseLedger4320278() {
  it('can parse object', done => {
    this.timeout(30e3);
    const json = loadFixture('as-ledger-4320278.json');
    json.forEach(e => {
      assertRecycles(e.binary);
    });
    done();
  });
}

function deliverMinTest() {
  it('can serialize DeliverMin', () => {
    assert.strictEqual(encode(deliverMinTx), deliverMinTxBinary);
  });
}

function SignerListSetTest() {
  it('can serialize SignerListSet', () => {
    assert.strictEqual(encode(SignerListSet.tx), SignerListSet.binary);
  });
  it('can serialize SignerListSet metadata', () => {
    assert.strictEqual(encode(SignerListSet.tx.meta), SignerListSet.meta);
  });
}

function DepositPreauthTest() {
  it('can serialize DepositPreauth', () => {
    assert.strictEqual(encode(DepositPreauth.tx), DepositPreauth.binary);
  });
  it('can serialize DepositPreauth metadata', () => {
    assert.strictEqual(encode(DepositPreauth.tx.meta), DepositPreauth.meta);
  });
}

function EscrowTest() {
  it('can serialize EscrowCreate', () => {
    assert.strictEqual(encode(Escrow.create.tx),
      Escrow.create.binary);
  });
  it('can serialize EscrowFinish', () => {
    assert.strictEqual(encode(Escrow.finish.tx),
      Escrow.finish.binary);
    assert.strictEqual(encode(Escrow.finish.tx.meta),
      Escrow.finish.meta);
  });
  it('can serialize EscrowCancel', () => {
    assert.strictEqual(encode(Escrow.cancel.tx),
      Escrow.cancel.binary);
  });
}

function PaymentChannelTest() {
  it('can serialize PaymentChannelCreate', () => {
    assert.strictEqual(encode(PaymentChannel.create.tx),
      PaymentChannel.create.binary);
  });
  it('can serialize PaymentChannelFund', () => {
    assert.strictEqual(encode(PaymentChannel.fund.tx),
      PaymentChannel.fund.binary);
  });
  it('can serialize PaymentChannelClaim', () => {
    assert.strictEqual(encode(PaymentChannel.claim.tx),
      PaymentChannel.claim.binary);
  });
}

describe('Binary Serialization', function() {
  describe.skip('parseLedger4320278', parseLedger4320278);
  describe('nestedObjectTests', nestedObjectTests);
  describe('UIntTest', UIntTest);
  describe('BytesList', bytesListTest);
  describe('DeliverMin', deliverMinTest);
  describe('DepositPreauth', DepositPreauthTest);
  describe('SignerListSet', SignerListSetTest);
  describe('Escrow', EscrowTest);
  describe('PaymentChannel', PaymentChannelTest);
});
