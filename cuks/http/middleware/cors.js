'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return (options) => {
    return require('@koa/cors')(helper('core:makeOptions')(pkgId, 'common.middlewareOptions.cors', options))
  }
}