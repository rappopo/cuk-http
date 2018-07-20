'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return function(obj, name = '', isThirdLevel = false) {
    if (_.isFunction(obj)) {
      if (!_.isEmpty(name)) helper('core:trace')(`${isThirdLevel ? '|  |  |--->':'|  |--->'} Composing middleware => %s`, name)
      return cuk.pkg.http.lib.koaCompose([obj])
    }
    let mws = []
    if (_.isString(obj)) {
      _.each(helper('core:makeChoices')(obj), mw => {
        mws.push({ name: mw, handler: helper('http:middleware')(mw)() })
      })
      if (!_.isEmpty(name)) helper('core:trace')(`${isThirdLevel ? '|  |  |--->':'|  |--->'} Composing middleware => %s -> %s`, name, _.map(mws, 'name').join(', '))
      return cuk.pkg.http.lib.koaCompose(_.map(mws, 'handler'))
    }
    if (_.isPlainObject(obj)) {
      _.forOwn(obj, (v, k) => {
        mws.push({ name: k, handler: helper('http:middleware')(k)(v) })
      })
    } else if (_.isArray(obj)) {
      _.each(obj, o => {
        if (_.isString(o)) {
          _.each(helper('core:makeChoices')(o), mw => {
            mws.push({ name: mw, handler: helper('http:middleware')(mw)() })
          })
        } else if (_.isFunction(o)) {
          mws.push({ name: 'anonymous', handler: o })
        } else if (_.isPlainObject(o)) {
          _.forOwn(o, (v, k) => {
            mws.push({ name: k, handler: helper('http:middleware')(k)(v) })
          })
        }
      })
    }
    if (mws.length === 0)
      return (ctx, next) => { return next() }
    if (!_.isEmpty(name)) helper('core:trace')(`${isThirdLevel ? '|  |  |--->':'|  |--->'} Composing middleware => %s -> %s`, name, _.map(mws, 'name').join(', '))
    return cuk.pkg.http.lib.koaCompose(_.map(mws, 'handler'))
  }
}