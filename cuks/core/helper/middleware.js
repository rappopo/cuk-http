'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return function (name) {
    let names = (name || '').split(':')
    if (names.length !== 2) throw new Error(`Invalid http middleware (${name})`)
    const pkg = helper('core:pkg')(names[0])
    if (!pkg) throw new Error(`Invalid http middleware (${name})`)
    let mw = _.get(pkg, `cuks.http.middleware.${names[1]}`)
    if (!_.isFunction(mw)) throw new Error(`Invalid http middleware (${name})`)
    return mw
  }
}
