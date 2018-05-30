'use strict'

const http = require('http'),
  https = require('https'),
  Koa = require('koa'),
  app = new Koa()

module.exports = function(cuk){
  let id = 'http',
    pkg = cuk.pkg[id]
  const { _, debug, helper, path, fs } = cuk.lib
  const trace = debug(`cuk:${id}`)
  const traceMw = debug(`cuk:${id}:middleware`)
  const reporter = function() {
    const { address, port } = this.address()
    const protocol = this.addContext ? 'https' : 'http'
    trace('Listening to %s://%s:%s', protocol, address, port)
  }

  trace('Initializing...')
  pkg.lib = {
    Koa: Koa,
    app: app,
    mount: require('koa-mount')
  }

  return new Promise((resolve, reject) => {
    app.keys = pkg.cfg.keys
    let mws = []
    _.each(helper.getPkgs(), p => {
      let file = path.join(p.dir, 'cuks', 'http', 'middleware.js')
      if (!fs.existsSync(file)) return
      let items = require(file)(cuk)
      _.forOwn(items, (i, k) => {
        i.pkgId = p.id
        i.name = k
        if (!helper.isSet(i.level)) i.level = 9999
        mws.push(i)
      })
    })
    mws = _.orderBy(mws, ['global', 'level'], ['asc'])
    _.each(mws, mw => {
      let p = cuk.pkg[mw.pkgId]
      if (mw.global) {
        if (_.get(p.cfg, 'http.middleware.' + mw.name) !== false) {
          traceMw('Enabled » %s:%s', p.id, mw.name)
          app.use(mw.handler(_.get(p.cfg, 'http.middleware.' + mw.name)))
        } else {
          traceMw('Disabled » %s:%s', p.id, mw.name)
        }
      } else {
        traceMw('Callable » %s:%s', p.id, mw.name)
        _.set(p, 'httpMiddleware', mw.handler)
      }
    })
    if (pkg.cfg.server) {
      pkg.cfg.server.ip = process.env.IP || pkg.cfg.server.ip || "127.0.0.1"
      pkg.cfg.server.port = process.env.PORT || pkg.cfg.server.port || 80
      pkg.cfg.server.options = pkg.cfg.server.options || {}
      const httpServer = http.createServer(pkg.cfg.server.options, app.callback())
        .listen(pkg.cfg.server.port, pkg.cfg.server.ip, reporter)
    }
    if (pkg.cfg.server && _.isBoolean(pkg.cfg.serverSecure) && pkg.cfg.serverSecure) {
      pkg.cfg.serverSecure = {
        ip: process.env.SIP || pkg.cfg.server.ip,
        port: process.env.SPORT || pkg.cfg.server.port === 80 ? 443 : (pkg.cfg.server.port + 1),
        options: pkg.cfg.server.options
      }
    }
    if (pkg.cfg.serverSecure) {
      pkg.cfg.serverSecure.ip = process.env.SIP || pkg.cfg.serverSecure.ip
      pkg.cfg.serverSecure.port = process.env.SPORT || pkg.cfg.serverSecure.port
      const httpsServer = https.createServer(pkg.cfg.serverSecure.options || {}, app.callback())
        .listen(pkg.cfg.serverSecure.port, pkg.cfg.serverSecure.ip, reporter)
    }
    resolve(true)
  })
}