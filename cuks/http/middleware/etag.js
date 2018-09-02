'use strict'

module.exports = function (cuk) {
  const pkgId = 'http'
  const { _, helper } = cuk.pkg.core.lib
  const app = cuk.pkg[pkgId].lib.app

  return (options) => {
    app.use(require('koa-conditional-get')())
    return require('koa-etag')(helper('core:makeOptions')(pkgId, 'common.middlewareOpts.etag', options))
  }
}