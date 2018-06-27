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
      koaMount: require('koa-mount'),
      koaCompose: require('koa-compose'),
      koaBodyParser: require('koa-bodyparser')
    }
  })
}