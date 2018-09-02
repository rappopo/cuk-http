'use strict'

module.exports = function (cuk) {
  return () => {
    return require('koa-response-time')()
  }
}