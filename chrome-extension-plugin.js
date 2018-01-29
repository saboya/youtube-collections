/**
 * @author Erik Desjardins
 * See LICENSE file in root directory for full license.
 */

'use strict';

const path = require('path')
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const RawSource = require('webpack-sources').RawSource

function ChromeExtensionPlugin(options) {
	this.options = options || {}
}

ChromeExtensionPlugin.prototype.apply = function(compiler) {
	var options = this.options

    if (options.pathPrefix && path.isAbsolute(options.pathPrefix)) {
        throw new Error('"pathPrefix" must be a relative path')
    }

	compiler.plugin('emit', function(compilation, callback) {
		// assets from child compilers will be included in the parent
		// so we should not run in child compilers
		if (this.isChild()) {
			callback()
			return;
		}

		const manifest = {}

		var pathPrefix = options.pathPrefix || ''
		var pathMapper = options.pathMapper || function(x) { return x; }

		// populate the zip file with each asset
		for (var nameAndPath in compilation.assets) {
			if (!compilation.assets.hasOwnProperty(nameAndPath)) continue

			// match against include and exclude, which may be strings, regexes, arrays of the previous or omitted
			if (!ModuleFilenameHelpers.matchObject({ include: options.include, exclude: options.exclude }, nameAndPath)) continue

			var source = compilation.assets[nameAndPath].source()

      console.log(nameAndPath)
		}

    // default to webpack's root output path if no path provided
    var outputPath = options.path || compilation.options.output.path;

    // combine the output path and filename
    var outputPathAndFilename = path.resolve(
      compilation.options.output.path, // ...supporting both absolute and relative paths
      outputPath,
      path.basename('manifest.json')
    );

    // resolve a relative output path with respect to webpack's root output path
    // since only relative paths are permitted for keys in `compilation.assets`
    var relativeOutputPath = path.relative(
      compilation.options.output.path,
      outputPathAndFilename
    );

    compilation.assets[relativeOutputPath] = new RawSource(JSON.stringify(manifest))

    callback()
	});
};

module.exports = ChromeExtensionPlugin
