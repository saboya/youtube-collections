const fs = require('fs')
const path = require('path')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')

const entries = (compiler, options) => {
  const contentScriptsDir = path.resolve(compiler.context, options.contentScriptsDir)
  const backgroundScriptsDir = path.resolve(compiler.context, options.backgroundScriptsDir)

  return new Promise((outerResolve, outerReject) => {
    compiler.plugin('make', (compilation, callback) => {
      const dirs = {
        contentScriptsDir: contentScriptsDir,
        backgroundScriptsDir: backgroundScriptsDir,
      }

      return Promise.all(Object.keys(dirs).map(key => {
        return new Promise((resolve, reject) => {
          fs.stat(dirs[key], (err, stats) => {
            if (err && err.code === 'ENOENT'  || !stats.isDirectory()) {
              compilation.warnings.push('[chrome-extension-plugin]: ' + key + ' is not a directory')
              resolve([])
            } else {
              fs.readdir(dirs[key], (err, files) => {
                if (err) {
                  compilation.errors.push('[chrome-extension-plugin]: Cannot read files from ' + key)
                  resolve([])
                } else {
                  resolve(files.map(file => path.resolve(dirs[key],file)))
                }
              })
            }
          })
        })
      })).then(([arr]) => {
        return Promise.all(arr.reduce((a,c) => a.concat(c),[]).map(file => {
          let type = 'content'

          if (file.startsWith(backgroundScriptsDir)) {
            type = 'background'
          }

          const asset = path.join(type, path.basename(file))

          return new Promise((resolve, reject) => {
            compilation.addEntry(
              compiler.context,
              SingleEntryPlugin.createDependency(file, type + '_' + path.basename(file)),
              asset, 
              err => {
                if (err) {
                  reject(err)
                } else {
                  resolve({
                    [file]: {
                      asset: asset,
                      type: type,
                    }
                  })
                }
              },
            )
          })
        }))
      }).then(arr => {
        outerResolve(arr.reduce((a, c) => ({ ...a, ...c }), {}))
        callback()
        callback()
      })
    })
  })
}

module.exports = entries
