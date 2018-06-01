'use strict'

module.exports = function(cuk) {
  return {
    global: true,
    level: 2,
    customHandler: true,
    handler: function(options) {
      require('koa-qs')(cuk.pkg.http.lib.app, options)
    }
  }
}