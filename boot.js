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
  pkg.lib = {
    Koa: Koa,
    app: app,
    mount: require('koa-mount')
  }

  helper.getHttpMiddleware = function(name) {
    return helper.getFunc('http:middleware')(name)
  }

  return new Promise((resolve, reject) => {
    app.keys = pkg.cfg.key.app
    require('./lib/build_middleware')(cuk, pkg.trace)
    if (pkg.cfg.server) {
      pkg.cfg.server.ip = process.env.IP || pkg.cfg.server.ip || "127.0.0.1"
      pkg.cfg.server.port = process.env.PORT || pkg.cfg.server.port || 80
      const httpServer = http.createServer(app.callback())
        .listen(pkg.cfg.server.port, pkg.cfg.server.ip, reporter)
    }
    if (pkg.cfg.server && _.isBoolean(pkg.cfg.serverSecure) && pkg.cfg.serverSecure) {
      pkg.cfg.serverSecure = {
        ip: process.env.SIP || pkg.cfg.server.ip,
        port: process.env.SPORT || pkg.cfg.server.port === 80 ? 443 : (pkg.cfg.server.port + 1)
      }
    }
    if (pkg.cfg.serverSecure) {
      pkg.cfg.serverSecure.ip = process.env.SIP || pkg.cfg.serverSecure.ip
      pkg.cfg.serverSecure.port = process.env.SPORT || pkg.cfg.serverSecure.port
      const httpsServer = https.createServer(pkg.cfg.key.secureServer || {}, app.callback())
        .listen(pkg.cfg.serverSecure.port, pkg.cfg.serverSecure.ip, reporter)
    }
    resolve(true)
  })
}