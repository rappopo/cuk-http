'use strict'

module.exports = function(cuk) {
  const { helper, fs, path } = cuk.lib
  const multer = cuk.pkg.http.lib.multer
  const compose = cuk.pkg.http.lib.koaCompose

  return {
    upload: (opts) => {
      let cfg = helper('core:makeOptions')('http', 'common.middlewareOpts.upload', opts)
      return multer(cfg)
    },
    wrap: (mw) => {
      const copy = async (ctx, next) => {
        if (ctx.req.body) ctx.request.body = ctx.req.body
        if (ctx.req.file) ctx.request.file = ctx.req.file
        if (ctx.req.files) ctx.request.files = ctx.req.files
        next()
      }
      return compose([mw, copy])
    }
  }
}