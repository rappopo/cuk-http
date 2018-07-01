'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib
  const pkg = cuk.pkg.http

  return (err, ctx) => {
    let source = ctx._matchedRouteName,
      url = ctx.path
    if (source) url += ` (${source})`
    pkg.trace('Error » %s -> %s (%s)', url, err.message, err.statusCode || err.status || 500)
    console.log(err)
    if (!ctx) return
    ctx.render('view:/not_found')
  }
}