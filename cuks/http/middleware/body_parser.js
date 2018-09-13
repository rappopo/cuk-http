'use strict'

module.exports = function (cuk) {
  const { helper } = cuk.pkg.core.lib
  const koaBodyParser = cuk.pkg.http.lib.koaBodyParser

  return (options) => {
    return koaBodyParser(helper('core:makeOptions')('http', 'common.middlewareOpts.bodyParser', options))
  }
}
