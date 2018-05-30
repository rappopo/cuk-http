'use strict'

module.exports = function(cuk) {
  const pkgId = 'http'
  const { _, helper } = cuk.lib
  const app = cuk.pkg[pkgId].lib.app

  return {
    responseTime: {
      global: true,
      level: 0,
      handler: function() {
        return require('koa-response-time')
      }
    },
    queryString: {
      global: true,
      level: 2,
      handler: function() {
        return require('koa-qs')
      }
    },
    bodyParser: {
      level: 2,
      handler: function(options) {
        return require('koa-body')(helper.makeOptions(pkgId, 'http.middleware.bodyparser', options))
      }
    },
    etag: {
      global: true,
      level: 1,
      handler: function(options) {
        app.use(require('koa-conditional-get')())
        return require('koa-etag')(helper.makeOptions(pkgId, 'http.middleware.etag', options))
      }
    },
    cors: {
      handler: function(options) {
        return require('@koa/cors')(helper.makeOptions(pkgId, 'http.middleware.cors', options))
      }
    }
  }
}