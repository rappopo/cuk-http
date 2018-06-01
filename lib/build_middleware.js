'use strict'

module.exports = function(cuk, trace) {
  const { _, helper, globby, path, fs } = cuk.lib
  const app = cuk.pkg.http.lib.app

  let mws = []
  _.each(helper.getPkgs(), p => {
    p.cuks.http = helper.merge(p.cuks.http, { middleware: {}})
    let dir = path.join(p.dir, 'cuks', 'http', 'middleware')
    if (!fs.existsSync(dir)) return
    var files = globby.sync(`${dir}/**/*.js`, {
      ignore: [`${dir}/**/_*.js`]
    })

    _.each(files, f => {
      let key = _.camelCase(f.replace(dir, '').replace('.js', '').substr(1)),
        item = require(f)(cuk)
      item.pkgId = p.id
      item.name = key
      if (!helper.isSet(item.level)) item.level = 9999
      mws.push(item)
      p.cuks.http.middleware[key] = item
    })
  })
  mws = _.orderBy(mws, ['global', 'level'], ['asc'])
  _.each(mws, mw => {
    let p = cuk.pkg[mw.pkgId]
    if (mw.global) {
      if (_.get(p.cfg, 'cuks.http.middleware.' + mw.name) !== false) {
        trace('Middleware » Enabled -> %s:%s', p.id, mw.name)
        if (mw.customHandler)
          mw.handler(_.get(p.cfg, 'cuks.http.middleware.' + mw.name))
        else
          app.use(mw.handler(_.get(p.cfg, 'cuks.http.middleware.' + mw.name)))
      } else {
        trace('Middleware » Disabled -> %s:%s', p.id, mw.name)
      }
    } else {
      trace('Middleware » Callable -> %s:%s', p.id, mw.name)
    }
  })

}