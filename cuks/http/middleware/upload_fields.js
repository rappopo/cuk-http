'use strict'

module.exports = function (cuk) {
  const lib = require('./_lib')(cuk)

  return (fields, opts) => {
    return lib.wrap(lib.upload(opts).array(fields))
  }
}
