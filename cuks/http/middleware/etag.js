'use strict'

module.exports = function(cuk) {
  const pkgId = 'http'
  const { _, helper } = cuk.lib
  const app = cuk.pkg[pkgId].lib.app

  return {
    global: true,
    level: 1,
    handler: function(options) {
      app.use(require('koa-conditional-get')())
      return require('koa-etag')(helper('core:makeOptions')(pkgId, 'cuks.http.middleware.etag', options))
    }
  }
}