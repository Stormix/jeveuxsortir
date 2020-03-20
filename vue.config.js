const manifestJSON = require('./public/manifest.json')
module.exports = {
  pluginOptions: {
    pwa: {
      assetsVersion: 'v0.1',
      themeColor: manifestJSON.theme_color,
      name: manifestJSON.short_name,
      msTileColor: manifestJSON.background_color,
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black',
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        swSrc: './service-worker.js'
      },
      iconPaths: {
        favicon32: 'img/sortir.png',
        favicon16: 'img/sortir.png',
        appleTouchIcon: 'img/sortir.png',
        maskIcon: 'img/icons/safari-pinned-tab.svg',
        msTileImage: 'img/sortir.png'
      }
    },
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  }
}
