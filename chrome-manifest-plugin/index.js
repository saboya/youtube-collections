const path = require('path')
const RawSource = require('webpack-sources').RawSource
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

const Permissions = require('./permissions.js')
const Entries = require('./entries.js')
const Meta = require('./meta.js')

const defaultOptions = {
  autoDetectPermissions: true,
  backgroundScriptsDir: 'src/background_scripts',
  contentScriptsDir: 'src/content_scripts',
  name: 'My Extension',
  permissions: [],
}

const isExternal = (module) => {
  let userRequest = module.userRequest

  if (typeof userRequest !== 'string' || !/\.jsx?$/.test(module.userRequest)) {
    return false
  }

  return userRequest.indexOf('bower_components') >= 0 ||
    userRequest.indexOf('node_modules') >= 0
}

class ChromeExtensionPlugin {
  constructor (options) {
    this.options = Object.assign(defaultOptions, options || {})
    this.permissions = Promise.resolve([])
    this.vendorFilename = 'vendor/bundle.js'
  }

  apply (compiler) {
    compiler.apply(new CommonsChunkPlugin({
      name: 'vendor bundle',
      filename: this.vendorFilename,
      minChunks: (module) => isExternal(module)
    }))

    this.entries = Entries(compiler, this.options)
    this.meta = Meta(compiler, this.options)

    if (this.options.autoDetectPermissions) {
      this.permissions = Permissions(compiler)
    }

    compiler.plugin('emit', (compilation, callback) => {
      if (compiler.isChild()) {
        callback()
        return
      }
  
      Promise.all([
        this.permissions,
        this.entries,
        this.meta
      ]).then(([autoPermissions, entries, meta]) => {
        const permissions = new Set(this.options.permissions.concat(autoPermissions))
        const content_scripts = []
        const background_scripts = []

        Object.keys(entries).map(key => {
          const script = {
            js: []
          }
  
          if (compilation.assets[this.vendorFilename]) {
            script.js.push(this.vendorFilename)
          }

          script.js.push(entries[key].asset)

          if (meta[key] !== undefined) {
            script.matches = meta[key].matches
            script.run_at = meta[key].run_at
            script.matches.map(match => permissions.add(match))
          }
  
          switch (script.type) {
            case 'content':
              content_scripts.push(script)
              break
            case 'background':
              background_scripts.push(script)
              break
          }
        })

        const manifest = {
          "manifest_version": 2,
          "name": this.options.name,
          "short_name": this.options.package.name,
          "description": this.options.package.description,
          "version": this.options.package.version,
          "permissions": Array.from(permissions),
          "web_accessible_resources": [
            "img/*"
          ]
        }

        if (content_scripts.length > 0) {
          manifest.content_scripts = content_scripts
        }

        if (background_scripts.length > 0) {
          manifest.background_scripts = background_scripts
        }
    
        const outputPathAndFilename = path.resolve(
          compilation.options.output.path,
          path.basename('manifest.json'),
        );
    
        const relativeOutputPath = path.relative(
          compilation.options.output.path,
          outputPathAndFilename
        );

        compilation.assets[relativeOutputPath] = new RawSource(JSON.stringify(manifest, null, 2))
    
        callback()
      })
    })
  }
}

module.exports = ChromeExtensionPlugin
