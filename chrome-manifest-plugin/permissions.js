'use strict'

const simplePermissions = [
  'alarms',
  'audio',
  'browser',
  'certificateProvider',
  'clipboard',
  'contextMenus',
  'desktopCapture',
  'displaySource',
  'documentScan',
  'experimental',
  'fileBrowserHandler',
  'fileSystem',
  'fileSystemProvider',
  'gcm',
  'hid',
  'identity',
  'idle',
  'mdns',
  'mediaGalleries',
  'notifications',
  'platformKeys',
  'power',
  'printerProvider',
  'proxy',
  'serial',
  'signedInDevices',
  'socket',
  'storage',
  'syncFileSystem',
  'tts',
  'usb',
  'virtualKeyboard',
  'vpnProvider',
  'wallpaper',
  'webview',
]

const permissions = (compiler) => {
  const permissions = new Set()

  return new Promise((resolve, reject) => {
    compiler.plugin('compilation', (compilation, data) => {
      data.normalModuleFactory.plugin("parser", function(parser, options) {
        parser.plugin('call document.execCommand' , function (expr) {
          if (expr.arguments.length === 1) {
            switch (expr.arguments[0].value) {
              case 'paste':
                permissions.add('clipboardRead')
                break
              case 'copy':
              case 'cut':
                permissions.add('clipboardWrite')
                break
            }
          }
          return true
        })

        parser.plugin('expression chrome.*' , (expr) => {
          if (simplePermissions.includes(expr.property.name)) {
            permissions.add(expr.property.name)
          }
          return true
        })

        parser.plugin('expression navigator.geolocation.*' , (expr) => {
          permissions.add('geolocation')
          return true
        })
      })
    })

    compiler.plugin('after-compile', (compilation, next) => {
      resolve(Array.from(permissions))
      next()
    })
  })
}

module.exports = permissions