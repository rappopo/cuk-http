'use strict'

module.exports = function (cuk) {
  const { path, fs } = cuk.pkg.core.lib

  return new Promise((resolve, reject) => {
    const dest = path.join(cuk.dir.data, 'tmp', 'upload')
    fs.ensureDirSync(dest)
    let cfg = {
      server: {
        ip: '0.0.0.0',
        port: 3000
      },
      key: {
        secureServer: {},
        app: ['@rappopo/cuk-http']
      },
      info: {
        contactName: 'Webmaster',
        contactEmail: 'webmaster@localhost.localdomain'
      },
      middlewareOpts: {
        queryString: 'extended',
        upload: {
          dest: dest
        },
        cors: {
          origin: '*'
        }
      },
      minifier: {
        enabled: false,
        opts: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          minifyJS: true,
          minifyCSS: true,
          ignoreCustomFragments: [/{([%#])[^]+?\1}/, /{{[^]+?}}/],
          trimCustomFragments: true
        }
      },
      printError: true,
      cuks: {
        log: true,
        task: {
          clearUploadDir: {
            maxAge: '24h',
            exclude: []
          }
        }
      }
    }
    resolve(cfg)
  })
}
