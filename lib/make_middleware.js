'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.pkg.core.lib
  const app = cuk.pkg.http.lib.app

  let mws = []
  helper('core:bootDeep')({
    pkgId: 'http',
    name: 'middleware',
    action: opt => {
      opt.pkg.cuks.http.middleware[opt.key] = require(opt.file)(cuk)
      helper('core:bootTrace')('|  |  |- %s:%s', opt.pkg.id, opt.key)
    }
  })
}