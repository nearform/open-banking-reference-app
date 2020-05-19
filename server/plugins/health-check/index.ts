import hapi from '@hapi/hapi'

const plugin: hapi.Plugin<{}> = {
  name: 'polaris-health-check',
  async register(server) {
    server.route({
      method: 'GET',
      path: '/health-check',
      options: {
        tags: ['api']
      },
      handler: () => {
        return { status: 'OK' }
      }
    })
  }
}

export default plugin
