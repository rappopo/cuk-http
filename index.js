'use strict'

module.exports = function(cuk) {
  const { path } = cuk.lib
  return Promise.resolve({
    id: 'http',
    tag: 'boot, middleware',
    level: 2
  })
}