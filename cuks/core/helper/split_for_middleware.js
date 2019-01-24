'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return (text, mws) => {
    mws = mws || []
    if (text.indexOf(',') > -1) {
      _.each(helper('core:makeChoices')(text), t => {
        helper('http:splitForMiddleware')(t, mws)
      })
    } else {
      mws.push({ name: text, handler: helper('http:middleware')(text)() })
    }
  }
}
