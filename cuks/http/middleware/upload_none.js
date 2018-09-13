'use strict'

module.exports = function (cuk) {
  const lib = require('./_lib')(cuk)

  return (opts) => {
    return lib.wrap(lib.upload(opts).none())
  }
}
