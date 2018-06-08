'use strict'

const http = require('http'),
  https = require('https'),
  Koa = require('koa'),
  app = new Koa()

module.exports = function(cuk){
  let id = 'http',
    pkg = cuk.pkg[id]
  const { _, debug, helper, path, fs } = cuk.lib
  const reporter = function() {
    const { address, port } = this.address()
    const protocol = this.addContext ? 'https' : 'http'
    pkg.trace('Listening to %s://%s:%s', protocol, address, port)
  }

  pkg.trace('Initializing...')
  pkg.lib.Koa = Koa
  pkg.lib.app = app
  pkg.lib.mount = require('koa-mount')
  pkg.lib.compose = require('koa-compose')

  return new Promise((resolve, reject) => {
    app.on('error', require('./lib/handle_error')(cuk))
    app.keys = pkg.cfg.common.key.app
    require('./lib/make_middleware')(cuk, pkg.trace)
    let mws = _.get(pkg.cfg, 'cuks.http.middleware', [])
    app.use(helper('http:composeMiddleware')(mws, '*'))

    if (pkg.cfg.common.server) {
      pkg.cfg.common.server.ip = process.env.IP || pkg.cfg.common.server.ip || "127.0.0.1"
      pkg.cfg.common.server.port = process.env.PORT || pkg.cfg.common.server.port || 80
      const httpServer = http.createServer(app.callback())
        .listen(pkg.cfg.common.server.port, pkg.cfg.common.server.ip, reporter)
      pkg.lib.httpServer = httpServer
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
    }
    resolve(true)
  })
}