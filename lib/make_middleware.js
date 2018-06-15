'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.lib
  const app = cuk.pkg.http.lib.app

  let mws = []
  helper('core:bootDeep')({
    pkgId: 'http',
    name: 'middleware',
    action: opt => {
      opt.pkg.cuks.http.middleware[opt.key] = opt.value
      helper('core:bootTrace')('%B %s:%s', null, opt.pkg.id, opt.key)
    }
  })
}