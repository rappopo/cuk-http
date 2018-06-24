'use strict'

module.exports = function(cuk) {
  const { path } = cuk.lib
  const Koa = require('koa')
  return Promise.resolve({
    id: 'http',
    level: 10,
    lib: {
      Koa: Koa,
      app: new Koa(),
      mount: require('koa-mount'),
      compose: require('koa-compose'),
      koaBody: require('koa-bodyparser')
    }
  })
}