'use strict'

module.exports = function (cuk) {
  const lib = require('./_lib')(cuk)

  return (fieldName, maxCount, opts) => {
    return lib.wrap(lib.upload(opts).array(fieldName, maxCount))
  }
}
