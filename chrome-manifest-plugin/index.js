const path = require('path')
const RawSource = require('webpack-sources').RawSource

const Permissions = require('./permissions.js')
const Entries = require('./entries.js')
const Meta = require('./meta.js')

const defaultOptions = {
  autoDetectPermissions: true,
  name: 'My Extension',
  permissions: [],
}

class ChromeExtensionPlugin {
  constructor (options) {
    this.options = Object.assign(defaultOptions, options || {})
    this.permissions = Promise.resolve([])
  }

  apply (compiler) {
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
        this.meta
      ]).then(([autoPermissions, meta]) => {
        const permissions = new Set(this.options.permissions.concat(autoPermissions))
        const content_scripts = []
        const background_scripts = []

        for (const key of Object.keys(meta)) {
          const chunk = compilation.chunks.find(
            chunk => chunk.entryModule.resource === key
          )
          
          if (chunk === undefined || meta[key] === undefined) { 
            continue;
          }

          const type = meta[key].type;

          const script = {
            js: chunk.files,
            type: meta[key].type,
          }

          switch (script.type) {
            case 'content':
              script.run_at = meta[key].run_at;
              script.matches = meta[key].matches;
              script.matches.forEach(match => permissions.add(match))

              content_scripts.push(script)
              break
            case 'background':
              background_scripts.push(...script.js)
              break
          }
        }

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
          manifest.background = {
            scripts: background_scripts
          };
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
