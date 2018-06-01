'use strict'

module.exports = function(cuk) {
  return {
    global: true,
    level: 2,
    customHandler: true,
    handler: function(options) {
      return function(ctx, next) {
        console.log(options)
        return next()
      }
    }
  }
}