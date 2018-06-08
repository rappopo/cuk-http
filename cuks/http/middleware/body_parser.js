'use strict'

const koaBody = require('koa-bodyparser')

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return (options) => {
    return koaBody(helper('core:makeOptions')('http', 'common.middlewareOptions.bodyParser', options))
  }
}