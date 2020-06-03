import Boom from '@hapi/boom'
import Joi from '@hapi/joi'
import axios, { AxiosResponse } from 'axios'
import hapi from '@hapi/hapi'

interface Options {
  clientId: string
  clientSecret: string
  connectionUrl: string
  openBankingUrl: string
}

const proxiedRoutes: {
  path: string
  method: 'GET' | 'POST' | 'PUT'
  service: 'connection' | 'openBanking'
  params?: {
    [key: string]: Joi.StringSchema
  }
  payload?: {
    [key: string]: Joi.AnySchema
  }
}[] = [
  {
    path: '/Connection',
    method: 'GET',
    service: 'connection'
  },
  {
    path: '/Connection/{ConnectionId}',
    method: 'GET',
    service: 'connection',
    params: {
      ConnectionId: Joi.string().required()
    }
  },
  {
    path: '/Connection',
    method: 'POST',
    service: 'connection',
    payload: {
      hub_user_id: Joi.string().allow(''),
      hub_name: Joi.string().allow(''),
      connection_name: Joi.string().allow(''),
      phone_number: Joi.string().allow(''),
      access_token: Joi.string().allow(''),
      account_number: Joi.string().allow(''),
      sort_code: Joi.string().allow(''),
      IBAN: Joi.string().allow(''),
      email: Joi.string().allow(''),
      invitation: Joi.string().allow(''),
      status: Joi.string().allow(''),
      notification_url: Joi.string().allow('')
    }
  },
  {
    path: '/Connection/{ConnectionId}',
    method: 'PUT',
    service: 'connection',
    params: {
      ConnectionId: Joi.string().required()
    },
    payload: {
      id: Joi.string().allow(''),
      hub_user_id: Joi.string().allow(''),
      hub_name: Joi.string().allow(''),
      connection_name: Joi.string().allow(''),
      phone_number: Joi.string().allow(''),
      access_token: Joi.string().allow(''),
      account_number: Joi.string().allow(''),
      sort_code: Joi.string().allow(''),
      IBAN: Joi.string().allow(''),
      email: Joi.string(),
      invitation: Joi.string().allow(''),
      status: Joi.string().allow(''),
      notification_url: Joi.string().allow('')
    }
  },
  {
    path: '/Connection/{ConnectionId}/rm',
    method: 'POST',
    service: 'connection',
    params: {
      ConnectionId: Joi.string().required()
    },
    payload: {
      id: Joi.string().allow('')
    }
  },
  {
    path: '/BalanceMonitor',
    method: 'POST',
    service: 'connection',
    payload: {
      connection_id: Joi.string().allow(''),
      threshold: Joi.string().allow(''),
      payment_amount: Joi.string().allow(''),
      notification_url: Joi.string().allow(''),
      status: Joi.string().allow('')
    }
  },
  {
    path: '/BalanceMonitor',
    method: 'GET',
    service: 'connection'
  },
  {
    path: '/BalanceMonitor/{BalanceMonitorId}',
    method: 'GET',
    service: 'connection',
    params: {
      BalanceMonitorId: Joi.string().required()
    }
  },
  {
    path: '/BalanceMonitor/{BalanceMonitorId}/rm',
    method: 'POST',
    service: 'connection',
    params: {
      BalanceMonitorId: Joi.string().required()
    },
    payload: {
      id: Joi.string().allow('')
    }
  },
  {
    path: '/Institution',
    method: 'GET',
    service: 'openBanking'
  },
  {
    path: '/Payment',
    method: 'POST',
    service: 'openBanking',
    payload: {
      user_id: Joi.string().allow(''),
      institution_id: Joi.string().allow(''),
      amount: Joi.string().allow(''),
      currency: Joi.string().allow(''),
      payee_name: Joi.string().allow(''),
      payee_sort_code: Joi.string().allow(''),
      payee_acc_number: Joi.string().allow(''),
      payee_IBAN: Joi.string().allow(''),
      consent_token: Joi.string().allow(''),
      payment_id: Joi.string().allow('')
    }
  },
  {
    path: '/PaymentAuthorizationRequest',
    method: 'POST',
    service: 'openBanking',
    payload: {
      user_id: Joi.string().allow(''),
      institution_id: Joi.string().allow(''),
      callback_url: Joi.string().allow(''),
      amount: Joi.string().allow(''),
      currency: Joi.string().allow(''),
      payee_name: Joi.string().allow(''),
      payee_sort_code: Joi.string().allow(''),
      payee_acc_number: Joi.string().allow(''),
      payee_IBAN: Joi.string().allow('')
    }
  },
  {
    path: '/AccountAuthorizationRequest',
    method: 'POST',
    service: 'openBanking',
    payload: {
      user_id: Joi.string().allow(''),
      institution_id: Joi.string().allow(''),
      callback_url: Joi.string().allow('')
    }
  }
]

const plugin: hapi.Plugin<Options> = {
  name: 'polaris-ibm',
  register: async (server, { clientId, clientSecret, connectionUrl, openBankingUrl }) => {
    for (const { path, method, params, payload, service } of proxiedRoutes) {
      server.route({
        path,
        method,
        options: {
          tags: ['api', 'ibm'],
          validate: {
            params: params && Joi.object().keys(params).unknown(false),
            payload: payload && Joi.object().keys(payload).unknown(false)
          }
        },
        handler: async request => {
          try {
            const config = {
              headers: {
                'x-ibm-client-id': clientId,
                'x-ibm-client-secret': clientSecret
              }
            }

            let pathUrl = `${service === 'connection' ? connectionUrl : openBankingUrl}${path}`
            let response: AxiosResponse

            if (params) {
              Object.keys(params).forEach(i => {
                pathUrl = pathUrl.replace(`{${i}}`, request.params[i])
              })
            }

            if (method === 'POST') {
              response = await axios.post(pathUrl, request.payload, config)
            } else if (method === 'PUT') {
              response = await axios.put(pathUrl, request.payload, config)
            } else {
              response = await axios.get(pathUrl, config)
            }

            return response.data
          } catch (error) {
            console.error(error)

            throw Boom.badRequest()
          }
        }
      })
    }
  }
}

export default plugin
