'use strict'

module.exports = function (cuk) {
  const { _, helper, globby, path, fs, moment, deleteEmpty } = cuk.pkg.core.lib
  const pkg = cuk.pkg.task

  return {
    time: '*/45 * * * *',
    onTick: function () {
      this.locked = moment()
      const tmp = path.join(cuk.dir.data, 'tmp', 'upload')
      const files = globby.sync(tmp, '**/*', {
        dot: true
      })
      let success = 0
      let error = 0
      let skipped = 0

      let exclude = _.get(pkg.cfg, 'cuks.task.clearUploadDir.exclude', [])
      _.each(exclude, (item, i) => {
        if (!path.isAbsolute(item)) exclude[i] = path.join(cuk.dir.data, 'tmp', 'upload', item)
      })
      let excludeDir = _.filter(exclude, item => {
        if (!fs.existsSync(item)) return false
        return fs.statSync(item).isDirectory()
      })
      exclude = _.difference(exclude, excludeDir)

      _.each(files, f => {
        if (excludeDir.indexOf(path.dirname(f)) > -1 || exclude.indexOf(f) > -1) {
          skipped++
          return
        }
        let stat = fs.statSync(f)
        let mtime = moment(stat.mtime)
        let maxAge = helper('core:parseUnitOfTime')(
          _.get(pkg.cfg, 'cuks.task.clearUploadDir.maxAge', 1000 * 60 * 60 * 24)
        )
        if (moment().diff(mtime) > maxAge) {
          try {
            fs.unlinkSync(f)
            success++
          } catch (e) {
            error++
          }
        } else {
          skipped++
        }
      })
      deleteEmpty(tmp)
      pkg.trace('%s » status: Success %d, Fail: %d, Skipped: %d', this.name, success, error, skipped)
      this.locked = false
    },
    timeout: 30,
    autoStart: true
  }
}
