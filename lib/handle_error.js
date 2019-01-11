'use strict'

module.exports = function (cuk) {
  const { _, helper, path } = cuk.pkg.core.lib
  const pkg = cuk.pkg.http

  return async function (err) {
    if (this.headerSent || !this.writable) return
    let source = this._matchedRouteName
    let url = this.path
    if (source) url += ` (${source})`
    this.status = err.statusCode || err.status || 500
    pkg.trace('Error >> %s -> %s (%s)', url, err.message, this.status)
    this.app.emit('error', err, this)
    const routerId = _.get(this, 'router.pkgId')
    const isSupportedRest = helper('core:config')('rest', 'supportedFormats', []).indexOf(path.extname(this.path).substr(1)) > -1
    if (cuk.pkg.rest && (routerId === 'rest' || isSupportedRest)) {
      const result = helper('rest:formatError')(err)
      helper('rest:write')(result, this)
    } else if (this.render) {
      let view = this.status === 404 ? 'view:/not_found' : 'view:/server_error'
      switch (err.cukStatus) {
        case 'anonymous_only': view = 'view:/anonymous_only'; break
      }
      await this.render(view)
    } else {
      this.body = err.status === 404 ? 'Resource not found' : 'Internal Server Error'
    }
    this.length = Buffer.byteLength(this.body)
    this.res.end(this.body)
  }
}
