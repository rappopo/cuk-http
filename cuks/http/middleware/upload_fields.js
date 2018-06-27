'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib
  const lib = require('./_lib')(cuk)

  return (fields, opts) => {
    return lib.wrap(lib.upload(opts).array(fields))
  }
}