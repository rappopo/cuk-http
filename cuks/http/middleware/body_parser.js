'use strict'

module.exports = function(cuk) {
  const { _, helper } = cuk.lib
  const koaBody = cuk.pkg.http.lib.koaBody

  return (options) => {
    return koaBody(helper('core:makeOptions')('http', 'common.middlewareOptions.bodyParser', options))
  }
}