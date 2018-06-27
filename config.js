'use strict'

module.exports = function(cuk) {
  const { path, fs } = cuk.lib

  return new Promise((resolve, reject) => {
    const dest = path.join(cuk.dir.data, 'tmp', 'upload')
    fs.ensureDirSync(dest)
    let cfg = {
      common: {
        server: {
          ip: "0.0.0.0",
          port: 3000
        },
        key: {
          secureServer: {},
          app: ["@rappopo/cuk-http"]
        },
        middlewareOpts: {
          queryString: "extended",
          upload: {
            dest: dest
          }
        }
      },
      cuks: {
        log: true
      }
    }
    resolve(cfg)
  })
}
