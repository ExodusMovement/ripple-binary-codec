const { BytesList } = require('./serdes/binary-serializer')
const { STObject } = require('./types/st-object')

function serializeObject(object, opts = {}) {
  const {prefix, suffix, signingFieldsOnly = false} = opts;
  const bytesList = new BytesList();
  if (prefix) {
    bytesList.put(prefix);
  }
  const filter = signingFieldsOnly ? f => f.isSigningField : undefined;
  STObject.from(object).toBytesSink(bytesList, filter);
  if (suffix) {
    bytesList.put(suffix);
  }
  return bytesList.toBytes();
}

module.exports = serializeObject
