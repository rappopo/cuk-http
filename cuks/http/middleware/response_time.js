'use strict'

module.exports = function(cuk) {
  return {
    global: true,
    level: 0,
    handler: function() {
      return require('koa-response-time')()
    }
  }
}