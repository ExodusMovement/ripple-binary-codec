import Decimal from 'decimal.js';
import {bytesToHex, slice, parseBytes} from './utils/bytes-utils.js';
import types from './types/index.js';
import BN from 'bn.js';
const {UInt64} = types;

export default {
  encode(arg) {
    const quality = arg instanceof Decimal ? arg : new Decimal(arg);
    const exponent = quality.e - 15;
    const qualityString = quality.times('1e' + -exponent).abs().toString();
    const bytes = new UInt64(new BN(qualityString)).toBytes();
    bytes[0] = exponent + 100;
    return bytes;
  },
  decode(arg) {
    const bytes = slice(parseBytes(arg), -8);
    const exponent = bytes[0] - 100;
    const mantissa = new Decimal('0x' + bytesToHex(slice(bytes, 1)));
    return mantissa.times('1e' + exponent);
  }
};
