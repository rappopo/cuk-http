'use strict'

const koaBody = require('koa-bodyparser')

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return {
    level: 2,
    handler: (options) => {
      return koaBody(helper('core:makeOptions')('http', 'cuks.http.middleware.bodyParser', options))
    }
  }
}