'use strict'

module.exports = function (cuk) {
  const lib = require('./_lib')(cuk)

  return (fieldName, opts) => {
    return lib.wrap(lib.upload(opts).single(fieldName))
  }
}
