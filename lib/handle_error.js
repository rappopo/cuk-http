'use strict'

module.exports = function(cuk) {
  const { _, helper, path } = cuk.pkg.core.lib
  const pkg = cuk.pkg.http

  return async function(err) {
    if (this.headerSent || !this.writable) return
    let source = this._matchedRouteName,
      url = this.path
    if (source) url += ` (${source})`
    this.status = err.statusCode || err.status || 500
    pkg.trace('Error » %s -> %s (%s)', url, err.message, this.status)
    this.app.emit('error', err, this)
    const routerId = _.get(this, 'router.pkgId')
    const isSupportedRest = cuk.pkg.rest.cfg.common.supportedFormats.indexOf(path.extname(this.path).substr(1)) > -1
    if (cuk.pkg.rest && (routerId === 'rest' || isSupportedRest)) {
      const result = helper('rest:formatError')(err)
      helper('rest:write')(result, this)
    } else if (this.render) {
      await this.render(this.status === 404 ? 'view:/not_found' : 'view:/server_error')
    } else {
      this.body = err.status === 404 ? 'Resource not found' : 'Internal Server Error'
    }
    this.length = Buffer.byteLength(this.body)
    this.res.end(this.body)
  }
}