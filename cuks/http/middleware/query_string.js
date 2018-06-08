'use strict'

module.exports = function(cuk) {
  return (options) => {
    return (ctx, next) => {
      require('koa-qs')(cuk.pkg.http.lib.app, options)
      return next()
    }
  }
}