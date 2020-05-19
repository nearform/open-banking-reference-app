import hapi from '@hapi/hapi'
import https from 'https'
import fs from 'fs'
import axios from 'axios'
import { Server, RequestWithPre, AuthorizationDefinitions, ResourceDefinitions, AccountAction } from '../../../types'
import bankingProviders from './providers'

export const createTransportInstance = async (
  req: hapi.Request & {
    server: Server
  }
) => {
  const {
    server: {
      app: { openbanking }
    }
  } = req
  const { key, crt } = openbanking

  const instance = axios.create({
    httpsAgent: new https.Agent({
      key: fs.readFileSync(`${process.cwd()}/${key}`),
      cert: fs.readFileSync(`${process.cwd()}/${crt}`)
    })
  })

  return instance
}

export const setProvider = async (req: hapi.Request) => {
  const providerHeader = req.headers['x-provider']
  const provider = bankingProviders.find(i => i.provider.id === parseInt(providerHeader, 10))
  return provider
}

export const apiDiscovery = async (req: RequestWithPre) => {
  const { instance, provider } = req.pre
  const [a, b] = await Promise.all([
    instance.get<AuthorizationDefinitions>(
      `${provider ? provider.authorisationUrl : ''}/oauth2/.well-known/openid-configuration`
    ),
    instance.get<ResourceDefinitions>(`${provider ? provider.resourceUrl : ''}/open-banking/discovery`)
  ])

  return {
    authorisationDefintions: a.data,
    resourceDefintions: b.data
  }
}

export const performRequest = async (
  req: RequestWithPre,
  api: Exclude<keyof ResourceDefinitions['Data'], 'FinancialId'>,
  action: AccountAction,
  replaceTargets: string[] | null
) => {
  const {
    instance,
    resources: { resourceDefintions }
  } = req.pre
  const accessToken = req.headers['x-provider-access-token']
  const financialProviderId = resourceDefintions.Data.FinancialId
  const {
    Links: { links }
  } = resourceDefintions.Data[api].slice(-1)[0]

  let url: string = links[action]

  if (replaceTargets) {
    replaceTargets.forEach(i => {
      url = url.replace(`{${i}}`, req.params[i])
    })
  }

  req.logger.info(`Performing ${action}: ${url}`)

  try {
    const res = await instance.get<any>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-fapi-financial-id': financialProviderId
      }
    })
    return res.data.Data
  } catch (err) {
    console.log('ERR', err)
    return err
  }
}

export const getClientId = async (req: RequestWithPre): Promise<string> => {
  const { instance, provider } = req.pre

  try {
    const res = await instance.get<any>(`${provider ? provider.resourceUrl : ''}/open-banking/mtlsTest`)

    return res.data.issuerId
  } catch (err) {
    console.log('ERR', err)
    return err
  }
}
