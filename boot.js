'use strict'

const http = require('http')
const https = require('https')
const multer = require('koa-multer')

module.exports = function (cuk) {
  let pkg = cuk.pkg['http']
  const { _, helper, config } = cuk.pkg.core.lib
  const reporter = function () {
    const { address, port } = this.address()
    const protocol = this.addContext ? 'https' : 'http'
    pkg.trace('Listening to %s://%s:%s', protocol, address, port)
  }

  pkg.lib.multer = multer

  const app = pkg.lib.app
  const cfg = config('http')

  return new Promise((resolve, reject) => {
    const errorHandler = require('./lib/handle_error')(cuk)
    app.context.onerror = errorHandler
    app.on('error', (err, ctx) => {
      if (cfg.printError) console.log(err)
    })
    app.keys = cfg.key.app
    helper('core:trace')('|  |- Loading http middlewares...')
    require('./lib/make_middleware')(cuk)
    require('./lib/def_middleware')(cuk)
    let mws = _.get(pkg.cfg, 'cuks.http.middleware', [])
    app.use(helper('http:composeMiddleware')(mws, '*'))

    if (cfg.server) {
      cfg.server.ip = process.env.IP || cfg.server.ip || '127.0.0.1'
      cfg.server.port = process.env.PORT || cfg.server.port || 80
      const httpServer = http.createServer(app.callback())
        .listen(cfg.server.port, cfg.server.ip, reporter)
      pkg.lib.httpServer = httpServer
      helper('core:trace')('|  |- Starting service on http://%s:%s...', cfg.server.ip, cfg.server.port)
    }
    if (cfg.server && _.isBoolean(cfg.serverSecure) && cfg.serverSecure) {
      cfg.serverSecure = {
        ip: process.env.SIP || cfg.server.ip,
        port: process.env.SPORT || cfg.server.port === 80 ? 443 : (cfg.server.port + 1)
      }
    }
    if (cfg.serverSecure) {
      cfg.serverSecure.ip = process.env.SIP || cfg.serverSecure.ip
      cfg.serverSecure.port = process.env.SPORT || cfg.serverSecure.port
      const httpsServer = https.createServer(cfg.key.secureServer || {}, app.callback())
        .listen(cfg.serverSecure.port, cfg.serverSecure.ip, reporter)
      pkg.lib.httpsServer = httpsServer
      helper('core:trace')('|  |- Starting secure service on https://%s:%s...', cfg.serverSecure.ip, cfg.serverSecure.port)
    }
    resolve(true)
  })
}
