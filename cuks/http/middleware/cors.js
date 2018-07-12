'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return (options) => {
    return require('@koa/cors')(helper('core:makeOptions')(pkgId, 'common.middlewareOpts.cors', options))
  }
}