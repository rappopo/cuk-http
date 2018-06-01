'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return {
    handler: function(options) {
      return require('@koa/cors')(helper.makeOptions(pkgId, 'cuks.http.middleware.cors', options))
    }
  }
}