'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib

  return (options) => {
    return require('@koa/cors')(helper('core:makeOptions')('http', 'common.middlewareOpts.cors', options))
  }
}
