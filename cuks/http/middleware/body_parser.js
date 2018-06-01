'use strict'

const koaBody = require('koa-bodyparser')

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return {
    level: 2,
    handler: function(options) {
      return koaBody(helper.makeOptions('http', 'cuks.http.middleware.bodyParser', options))
    }
  }
}