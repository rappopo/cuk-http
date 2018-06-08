'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib
  const pkg = cuk.pkg.http

  return (err, ctx) => {
    let source = ctx._matchedRouteName || ctx.path
    pkg.trace('Error » %s -> %s (%s)', source ,err.message, err.status || 500)
  }
}