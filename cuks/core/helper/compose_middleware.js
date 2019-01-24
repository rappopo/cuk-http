'use strict'

// TODO: ability to skip middleware if not found
module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  const hint = (mws, name, isThirdLevel) => {
    if (name === 'silent') return
    if (name === '') {
      helper('core:trace')(`${isThirdLevel ? '|  |  |  +->' : '|  |  +->'} Composing middleware -> %s`, _.map(mws, 'name').join(', '))
    } else {
      helper('core:trace')(`${isThirdLevel ? '|  |  |  +->' : '|  |  +->'} Composing middleware => %s -> %s`, name, _.map(mws, 'name').join(', '))
    }
  }

  return function (obj, name = '', isThirdLevel = false) {
    if (_.isEmpty(obj)) throw helper('core:makeError')('Empty middleware given')
    if (!process.env.VERBOSE) name = 'silent'
    if (_.isFunction(obj)) {
      if (name !== 'silent') helper('core:trace')(`${isThirdLevel ? '|  |  |  +->' : '|  |  +->'} Composing middleware -> %s`, name)
      return cuk.pkg.http.lib.koaCompose([obj])
    }
    let mws = []
    if (_.isString(obj)) {
      helper('http:splitForMiddleware')(obj, mws)
      hint(mws, name, isThirdLevel)
      return cuk.pkg.http.lib.koaCompose(_.map(mws, 'handler'))
    }
    if (_.isPlainObject(obj)) {
      _.forOwn(obj, (v, k) => {
        mws.push({ name: k, handler: helper('http:middleware')(k)(v) })
      })
    } else if (_.isArray(obj)) {
      _.each(obj, o => {
        if (_.isEmpty(o)) return
        if (_.isString(o)) {
          helper('http:splitForMiddleware')(o, mws)
        } else if (_.isFunction(o)) {
          mws.push({ name: 'anonymous', handler: o })
        } else if (_.isPlainObject(o)) {
          let handler
          try {
            handler = o.handler || helper('http:middleware')(o.name)(o.options)
          } catch (e) {
            if (!o.skipMissing) throw e
          }
          mws.push({ name: o.name, handler: handler })
        }
      })
    }
    if (mws.length === 0) return (ctx, next) => { return next() }
    hint(mws, name, isThirdLevel)
    return cuk.pkg.http.lib.koaCompose(_.map(mws, 'handler'))
  }
}
