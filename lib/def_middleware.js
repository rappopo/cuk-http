'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.http
  const { app, minifier } = pkg.lib
  const errorHandler = require('./handle_error')(cuk)

  app.use(async (ctx, next) => {
    // dummy items for upcoming pkgs
    ctx.state.reqId = helper('core:makeId')()
    ctx.ts = text => text
    ctx.t = text => text
    ctx.state.site = {
      domain: 'localhost',
      skin: 'view',
      theme: null
    }
    await next()
    // if body is a string, pass it to minifier
    if (_.isString(ctx.body) && _.get(pkg.cfg, 'common.minifier.enabled')) {
      ctx.body = minifier.minify(ctx.body, _.get(pkg.cfg, 'common.minifier.opts') || {})
    }
    if (ctx.status === 404) {
      errorHandler.call(ctx, helper('core:makeError')({
        msg: 'Resource not found',
        status: 404
      }))
    }
  })
}
