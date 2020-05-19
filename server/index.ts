import hapi from '@hapi/hapi'
import { internal } from '@hapi/boom'
import Pack from './package.json'
import config from './config'

function handleServerError(request: hapi.Request, h: hapi.ResponseToolkit) {
  if ('isBoom' in request.response && request.response.output.statusCode === 500) {
    const error = internal('', {
      message: `[
      ${request.response.output.statusCode || request.response.name}] ${request.response.message}`,
      stack:
        request.response.stack &&
        request.response.stack
          .split('\n')
          .slice(1)
          .map((s: string) => s.trim().replace(/^at /, ''))
    })

    const response = h.response({ ...error.output.payload, ...error.data })

    response.code(500)
    response.type('application/json')

    return response
  }

  return h.continue
}

async function main() {
  // Create the server
  const server = new hapi.Server({
    port: config.app.hapi.port,
    host: config.app.hapi.host,
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['x-provider', 'x-provider-access-token'],
        credentials: true
      }
    }
  })

  // Add error handling
  server.ext('onPreResponse', handleServerError)

  await server.register({
    plugin: require('hapi-pino'),
    options: {}
  })

  await server.register({
    plugin: require('./plugins/health-check').default
  })

  await server.register({
    plugin: require('./plugins/open-banking').default,
    options: {
      sslCrt: config.app.ob.crt,
      sslKey: config.app.ob.key
    }
  })

  await server.register({
    plugin: require('./plugins/ibm').default,
    options: {
      clientId: config.app.ibm.clientId,
      clientSecret: config.app.ibm.clientSecret,
      connectionUrl: config.app.ibm.connectionUrl,
      openBankingUrl: config.app.ibm.obUrl
    }
  })

  await server.register({
    plugin: require('./plugins/assistant').default,
    options: {
      apiKey: config.app.watson.key,
      apiUrl: config.app.watson.url,
      assistantId: config.app.watson.assistantId
    }
  })

  // Register API docs
  // if (!config.isProduction) {
  const swaggerOptions = {
    info: {
      title: 'API Documentation',
      version: Pack.version
    }
  }
  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
      plugin: require('hapi-swagger'),
      options: swaggerOptions
    }
  ])
  // }

  // Start the server
  await server.start()
  server.log('info', { message: `Server running on ${server.info.uri}...`, config })
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
