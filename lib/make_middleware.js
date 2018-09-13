'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  helper('core:bootDeep')({
    pkgId: 'http',
    name: 'middleware',
    action: opt => {
      opt.pkg.cuks.http.middleware[opt.key] = require(opt.file)(cuk)
      helper('core:trace')('|  |  |- %s:%s', opt.pkg.id, opt.key)
    }
  })
}
