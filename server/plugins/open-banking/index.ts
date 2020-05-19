import Joi from '@hapi/joi'
import Boom from '@hapi/boom'
import bankingProviders from './lib/providers'
import hapi from '@hapi/hapi'
import * as helpers from './lib/helpers'
import * as auth from './lib/auth'
import { Server, RequestWithPre, AccountAction } from '../../types'

const accountsRouteMap: {
  path: string
  action: AccountAction
  params?: {
    [key: string]: Joi.StringSchema
  }
}[] = [
  {
    path: '/accounts',
    action: 'GetAccounts'
  },
  {
    path: '/accounts/{AccountId}',
    action: 'GetAccount',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/transactions',
    action: 'GetAccountTransactions',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/beneficiaries',
    action: 'GetAccountBeneficiaries',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/balances',
    action: 'GetAccountBalances',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/direct-debits',
    action: 'GetAccountDirectDebits',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/standing-orders',
    action: 'GetAccountStandingOrders',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/scheduled-payments',
    action: 'GetAccountScheduledPayments',
    params: {
      AccountId: Joi.string().required()
    }
  },
  {
    path: '/accounts/{AccountId}/statements',
    action: 'GetAccountStatements',
    params: {
      AccountId: Joi.string().required()
    }
  }
]

interface Options {
  sslCrt: string
  sslKey: string
}

const plugin: hapi.Plugin<Options> = {
  pkg: require('../../package.json'),
  register: async (server, options) => {
    const { sslCrt, sslKey } = options
    ;(server as Server).app.openbanking = {
      key: sslKey,
      crt: sslCrt
    }

    server.route({
      method: 'GET',
      path: '/providers',
      options: {
        tags: ['api']
      },
      handler: ({ logger }) => {
        logger.info(`Getting providers`)
        return bankingProviders.map(i => i.provider)
      }
    })

    server.route({
      method: 'GET',
      path: '/session',
      options: {
        tags: ['api'],
        validate: {
          headers: Joi.object({
            'x-provider': Joi.string().required()
          }).options({ allowUnknown: true }),
          query: Joi.object({
            redirectUri: Joi.string().required()
          })
        },
        pre: [
          { method: helpers.setProvider, assign: 'provider' },
          { method: helpers.createTransportInstance, assign: 'instance' },
          { method: helpers.getClientId, assign: 'clientId' },
          { method: helpers.apiDiscovery, assign: 'resources' }
        ]
      },
      handler: async (
        request: RequestWithPre & {
          query: {
            redirectUri: string
          }
        }
      ) => {
        const { clientId, provider, instance, resources } = request.pre

        if (!provider) {
          throw Boom.badData(`Unsupported provider sent in the 'x-provider' header`)
        }

        request.logger.info(`Initiating auth session with ${provider.provider.title}`)

        const url = await auth.initiateSession({
          clientId,
          instance,
          provider,
          resources,
          redirectUri: request.query.redirectUri
        })
        return url
      }
    } as hapi.ServerRoute)

    server.route({
      method: 'POST',
      path: '/session',
      options: {
        tags: ['api'],
        validate: {
          headers: Joi.object({
            'x-provider': Joi.string().required()
          }).options({ allowUnknown: true }),
          payload: Joi.object({
            code: Joi.string().required(),
            redirectUri: Joi.string().required()
          })
        },
        pre: [
          { method: helpers.setProvider, assign: 'provider' },
          { method: helpers.createTransportInstance, assign: 'instance' },
          { method: helpers.getClientId, assign: 'clientId' },
          { method: helpers.apiDiscovery, assign: 'resources' }
        ]
      },
      handler: async (
        request: RequestWithPre & {
          payload: {
            code: string
            redirectUri: string
          }
        }
      ) => {
        const { clientId, provider, instance, resources } = request.pre
        const { code, redirectUri } = request.payload

        if (!provider) {
          throw Boom.badData(`Unsupported provider sent in the 'x-provider' header`)
        }

        request.logger.info(`Exchanging code with ${provider.provider.title}`)

        const res = await auth.exchangeCode({
          clientId,
          instance,
          provider,
          code,
          redirectUri,
          resources
        })

        return res
      }
    } as hapi.ServerRoute)

    accountsRouteMap.forEach(({ path, action, params = null }) => {
      server.route({
        method: 'GET',
        path,
        options: {
          tags: ['api'],
          validate: {
            headers: Joi.object({
              'x-provider': Joi.string().required(),
              'x-provider-access-token': Joi.string().required()
            }).options({ allowUnknown: true }),
            params: params && Joi.object().keys(params)
          },
          pre: [
            { method: helpers.setProvider, assign: 'provider' },
            { method: helpers.createTransportInstance, assign: 'instance' },
            { method: helpers.getClientId, assign: 'clientId' },
            { method: helpers.apiDiscovery, assign: 'resources' }
          ]
        },
        handler: async (request: RequestWithPre) => {
          const api = 'AccountAndTransactionAPI'
          const res = await helpers.performRequest(request, api, action, params && Object.keys(params))
          return res
        }
      } as hapi.ServerRoute)
    })
  }
}

export default plugin
