'use strict'

module.exports = function(cuk, trace) {
  const { _, helper, globby, path, fs } = cuk.lib
  const app = cuk.pkg.http.lib.app

  let mws = []
  helper('core:bootDeep')('http', 'middleware', opt => {
    opt.pkg.cuks.http.middleware[opt.key] = opt.value
    trace('Middleware » %s:%s', opt.pkg.id, opt.key)
  })
}