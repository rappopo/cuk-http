'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return {
    handler: function(options) {
      return require('@koa/cors')(helper('core:makeOptions')(pkgId, 'cuks.http.middleware.cors', options))
    }
  }
}