'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib

  return function(name) {
    let names = (name || '').split(':')
    if (names.length !== 2) throw new Error('Invalid http middleware')
    const pkg = helper.getPkg(names[0])
    if (!pkg) throw new Error('Invalid package id')
    let mw = _.get(pkg, `cuks.http.middleware.${names[1]}.handler`)
    if (!_.isFunction(mw))  throw new Error('Invalid http middleware name')
    return mw
  }
}