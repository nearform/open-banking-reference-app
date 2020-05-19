const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      pwa: false
    },
    {
      ...argv,
      projectRoot: '/',
      publicUrl: '',
      workbox: {
        serviceWorkerPath: './src/registerServiceWorker.js',
        injectManifestOptions: {
          swSrc: './src/registerServiceWorker.js'
        },
        autoRegister: true,
        useServiceWorker: true
      }
    }
  )

  config.output.publicPath = '/'

  return config
}
