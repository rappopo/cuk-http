'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  const app = cuk.pkg.http.lib.app

  return (options) => {
    app.use(require('koa-conditional-get')())
    return require('koa-etag')(helper('core:makeOptions')('http', 'middlewareOpts.etag', options))
  }
}
