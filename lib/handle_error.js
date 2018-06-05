'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib
  const pkg = cuk.pkg.http
  const app = pkg.lib.app

  return (err, ctx) => {
    pkg.trace('Error » %s -> %s', err.status || 500, err.message)
  }
}