const meta = (compiler, options) => {
  return new Promise((resolve, reject) => {
    compiler.plugin('compilation', (compilation, data) => {
      data.normalModuleFactory.plugin('parser', (parser, parserOptions) => {
        parser.plugin('program' , (ast, comments) => {
          const files = {}
          const file = parser.state.current.resource
          const regexp = /^\s*(__RUN_AT__|__MATCHES__):\s*(.+)\s*$/
          const keys = {
            __MATCHES__: 'matches',
            __RUN_AT__: 'run_at',
          }

          comments.filter(comment => {
            return comment.type === 'Block' && regexp.test(comment.value)
          }).map(comment => {
            if (files[file] === undefined) {
              files[file] = {}
            }

            const match = regexp.exec(comment.value)

            try {
              files[file][keys[match[1]]] = JSON.parse(match[2])
            } catch (err) {
              compilation.errors.push(`[chrome-extension-plugin]: Eror parsing ${match[1]} field in ${file}.`)
            }
          })

          resolve(files)
        })
      })
    })
  })
}

module.exports = meta
