'use strict'

const http = require('http'),
  https = require('https'),
  multer = require('koa-multer')

module.exports = function(cuk){
  let id = 'http',
    pkg = cuk.pkg[id]
  const { _, debug, helper, path, fs } = cuk.pkg.core.lib
  const reporter = function() {
    const { address, port } = this.address()
    const protocol = this.addContext ? 'https' : 'http'
    pkg.trace('Listening to %s://%s:%s', protocol, address, port)
  }

  pkg.lib.multer = multer

  const app = pkg.lib.app

  return new Promise((resolve, reject) => {
    app.on('error', require('./lib/handle_error')(cuk))
    app.keys = pkg.cfg.common.key.app
    helper('core:bootTrace')('|  |- Loading http middlewares...')
    require('./lib/make_middleware')(cuk)
    let mws = _.get(pkg.cfg, 'cuks.http.middleware', [])
    app.use(async (ctx, next) => {
      await next()
      if (ctx.status === 404) {
        ctx.app.emit('error', helper('core:makeError')({ msg: 'Resource not found', status: 404 }), ctx)
      }
    })
    app.use(helper('http:composeMiddleware')(mws, '*'))

    if (pkg.cfg.common.server) {
      pkg.cfg.common.server.ip = process.env.IP || pkg.cfg.common.server.ip || "127.0.0.1"
      pkg.cfg.common.server.port = process.env.PORT || pkg.cfg.common.server.port || 80
      const httpServer = http.createServer(app.callback())
        .listen(pkg.cfg.common.server.port, pkg.cfg.common.server.ip, reporter)
      pkg.lib.httpServer = httpServer
      helper('core:bootTrace')('|  |- Starting service on http://%s:%s...', pkg.cfg.common.server.ip, pkg.cfg.common.server.port)
    }
    if (pkg.cfg.common.server && _.isBoolean(pkg.cfg.common.serverSecure) && pkg.cfg.common.serverSecure) {
      pkg.cfg.common.serverSecure = {
        ip: process.env.SIP || pkg.cfg.common.server.ip,
        port: process.env.SPORT || pkg.cfg.common.server.port === 80 ? 443 : (pkg.cfg.common.server.port + 1)
      }
    }
    if (pkg.cfg.common.serverSecure) {
      pkg.cfg.common.serverSecure.ip = process.env.SIP || pkg.cfg.common.serverSecure.ip
      pkg.cfg.common.serverSecure.port = process.env.SPORT || pkg.cfg.common.serverSecure.port
      const httpsServer = https.createServer(pkg.cfg.common.key.secureServer || {}, app.callback())
        .listen(pkg.cfg.common.serverSecure.port, pkg.cfg.common.serverSecure.ip, reporter)
      pkg.lib.httpsServer = httpsServer
      helper('core:bootTrace')('|  |- Starting secure service on https://%s:%s...', pkg.cfg.common.serverSecure.ip, pkg.cfg.common.serverSecure.port)
    }
    resolve(true)
  })
}