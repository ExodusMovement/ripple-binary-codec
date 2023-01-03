const { HashPrefix } = require('./hash-prefixes')
const serializeObject = require('./serializeObject')

function signingData(tx, prefix = HashPrefix.transactionSig) {
  return serializeObject(tx, {prefix, signingFieldsOnly: true});
}

module.exports = signingData
