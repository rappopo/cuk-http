'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return function(obj, name = 'unknown', isThirdLevel = false) {
    let mws = []
    if (_.isString(obj)) {
      _.each(helper('core:makeChoices')(obj), mw => {
        mws.push({ name: mw, handler: helper('http:middleware')(mw)() })
      })
      helper('core:bootTrace')(`%${isThirdLevel ? 'E':'D'} Composing middleware %K %s %L %s`, null, null, name, null, _.map(mws, 'name').join(', '))
      return cuk.pkg.http.lib.compose(_.map(mws, 'handler'))
    }
    if (_.isPlainObject(obj)) {
      _.forOwn(obj, (v, k) => {
        mws.push({ name: k, handler: helper('http:middleware')(k)(v) })
      })
    } else if (_.isArray(obj)) {
      _.each(obj, o => {
        if (_.isString(o)) {
          mws.push({ name: o, handler: helper('http:middleware')(o)() })
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
      helper('core:bootTrace')(`%${isThirdLevel ? 'E':'D'} Composing middleware %K %s %L %s`, null, null, name, null, _.map(mws, 'name').join(', '))
    return cuk.pkg.http.lib.compose(_.map(mws, 'handler'))
  }
}