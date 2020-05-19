/* eslint-disable @typescript-eslint/camelcase */

import qs from 'qs'
import uuid from 'uuid/v4'
import { AxiosInstance } from 'axios'
import { BankProvider, RequestWithPre } from 'types'
import { Token } from '@client/types'

interface DetachedJWT {
  detachedSignature: string
}

interface ClientCredential {
  access_token: string
}

interface AccountRequest {
  Data: {
    ConsentId: string
  }
}

const generateDetachedJWT = async (
  req: AxiosInstance,
  options: {
    url: string
    clientId: string
  }
) => {
  const { url, clientId } = options

  const res = await req.post<DetachedJWT>(
    `${url}/api/crypto/signPayloadToDetachedJwt`,
    {
      Data: {
        ExpirationDateTime: '2020-02-10T17:48:45+00:00',
        TransactionFromDateTime: '2017-02-10T17:48:45+00:00',
        TransactionToDateTime: '2020-02-10T17:48:45+00:00',
        Permissions: [
          'ReadAccountsDetail',
          'ReadBalances',
          'ReadBeneficiariesDetail',
          'ReadDirectDebits',
          'ReadProducts',
          'ReadStandingOrdersDetail',
          'ReadTransactionsCredits',
          'ReadTransactionsDebits',
          'ReadTransactionsDetail',
          'ReadOffers',
          'ReadPAN',
          'ReadParty',
          'ReadPartyPSU',
          'ReadScheduledPaymentsDetail',
          'ReadStatementsDetail'
        ]
      },
      Risk: {}
    },
    {
      headers: {
        'Content-Type': 'application/json',
        issuerId: clientId
      }
    }
  )

  return res.data
}

const generateClientAssertionJWT = async (
  req: AxiosInstance,
  options: {
    clientId: string
    url: string
    issuer: string
    headers?: { [key: string]: string }
  }
) => {
  const { clientId, url, issuer, headers = {} } = options

  const defaultHeaders = {
    'Content-Type': 'application/json',
    issuerId: clientId
  }

  const reqHeaders = Object.assign({}, defaultHeaders, headers)
  const exp = new Date().getTime() / 1000 + 60 * 5

  const res = await req.post<string>(
    url,
    {
      sub: clientId,
      exp,
      aud: issuer
    },
    {
      headers: reqHeaders
    }
  )

  return res.data
}

const generateClientCredential = async (
  req: AxiosInstance,
  options: {
    url: string
    grantType?: string
    scope?: string
    clientAssertion: string
  }
) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const { url, grantType = 'client_credentials', scope = 'openid payments accounts', clientAssertion } = options

  const params = {
    grant_type: grantType,
    scope,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: clientAssertion
  }

  const res = await req.post<ClientCredential>(url, qs.stringify(params), {
    headers
  })

  return res.data
}

const createAccountRequest = async (
  req: AxiosInstance,
  options: {
    url: string
    access_token: string
    financialProviderId: string
    detachedJWT: DetachedJWT
  }
) => {
  const data = {
    Data: {
      ExpirationDateTime: '2020-02-10T17:48:45+00:00',
      TransactionFromDateTime: '2017-02-10T17:48:45+00:00',
      TransactionToDateTime: '2020-02-10T17:48:45+00:00',
      Permissions: [
        'ReadAccountsDetail',
        'ReadBalances',
        'ReadBeneficiariesDetail',
        'ReadDirectDebits',
        'ReadProducts',
        'ReadStandingOrdersDetail',
        'ReadTransactionsCredits',
        'ReadTransactionsDebits',
        'ReadTransactionsDetail',
        'ReadOffers',
        'ReadPAN',
        'ReadParty',
        'ReadPartyPSU',
        'ReadScheduledPaymentsDetail',
        'ReadStatementsDetail'
      ]
    },
    Risk: {}
  }

  const { url, access_token: accessToken, financialProviderId, detachedJWT } = options

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'x-idempotency-key': uuid(),
    'x-jws-signature': detachedJWT.detachedSignature,
    'x-fapi-financial-id': financialProviderId
    // 'x-fapi-customer-last-logged-time': '',
    // 'x-fapi-customer-ip-address': ''
  }

  const res = await req.post<AccountRequest>(url, data, {
    headers
  })

  return res.data
}

const generateRequestParameter = async (
  req: AxiosInstance,
  options: {
    url: string
    clientId: string
    jwkUri: string
    issuer: string
    consentId: string
    redirectUri: string
    state: string
    nonce: string
  }
) => {
  const { url, clientId, jwkUri, issuer, consentId, state, nonce, redirectUri } = options

  const headers = {
    'Content-Type': 'application/json',
    issuerId: clientId,
    jwkUri
  }

  const exp = new Date().getTime() / 1000 + 60 * 5

  const data = {
    aud: issuer,
    scope: 'openid payments accounts',
    iss: clientId,
    claims: {
      id_token: {
        acr: {
          value: 'urn:openbanking:psd2:sca',
          essential: true
        },
        openbanking_intent_id: {
          value: consentId,
          essential: true
        }
      },
      userinfo: {
        openbanking_intent_id: {
          value: consentId,
          essential: true
        }
      }
    },
    response_type: 'code id_token',
    redirect_uri: redirectUri,
    state,
    exp,
    nonce,
    client_id: clientId
  }

  const res = await req.post<string>(url, data, {
    headers
  })

  return res.data
}

const generateAuthUrl = ({
  authorizationEndpoint,
  requestParameter,
  clientId,
  state,
  nonce,
  redirectUri
}: {
  authorizationEndpoint: string
  requestParameter: string
  clientId: string
  state: string
  nonce: string
  redirectUri: string
}) => {
  const params = qs.stringify({
    response_type: 'code id_token',
    client_id: clientId,
    state,
    nonce,
    scope: 'openid payments accounts',
    redirect_uri: redirectUri,
    request: requestParameter
  })

  return `${authorizationEndpoint}?${params}`
}

export const initiateSession = async ({
  clientId,
  instance,
  provider,
  redirectUri,
  resources
}: {
  clientId: string
  instance: AxiosInstance
  provider: BankProvider
  redirectUri: string
  resources: RequestWithPre['pre']['resources']
}) => {
  const { authorisationDefintions, resourceDefintions } = resources
  const financialProviderId = resourceDefintions.Data.FinancialId

  const clientAssertionJWT = await generateClientAssertionJWT(instance, {
    clientId,
    issuer: authorisationDefintions.issuer,
    url: `${provider.jwkmsUrl}/api/crypto/signClaims`
  })

  const [clientCredential, detachedJWT] = await Promise.all([
    generateClientCredential(instance, {
      url: authorisationDefintions.token_endpoint,
      clientAssertion: clientAssertionJWT
    }),
    generateDetachedJWT(instance, {
      url: provider.jwkmsUrl!,
      clientId
    })
  ])

  const accountRequest = await createAccountRequest(instance, {
    url: `${provider.resourceUrl}/open-banking/v3.1/aisp/account-access-consents`,
    access_token: clientCredential.access_token,
    financialProviderId,
    detachedJWT
  })

  const requestParameter = await generateRequestParameter(instance, {
    url: `${provider.jwkmsUrl}/api/crypto/signClaims`,
    clientId,
    jwkUri: `${provider.authorisationUrl}/api/jwk/jwk_uri`,
    issuer: authorisationDefintions.issuer,
    consentId: accountRequest.Data.ConsentId,
    redirectUri,
    state: '10d260bf-a7d9-444a-92d9-7b7a5f088208',
    nonce: '10d260bf-a7d9-444a-92d9-7b7a5f088208'
  })

  const authUrl = generateAuthUrl({
    authorizationEndpoint: authorisationDefintions.authorization_endpoint,
    clientId,
    requestParameter,
    state: '10d260bf-a7d9-444a-92d9-7b7a5f088208',
    nonce: '10d260bf-a7d9-444a-92d9-7b7a5f088208',
    redirectUri
  })

  return { authorizationUrl: authUrl }
}

export const exchangeCode = async ({
  clientId,
  instance,
  provider,
  code,
  redirectUri,
  resources
}: {
  clientId: string
  instance: AxiosInstance
  provider: BankProvider
  code: string
  redirectUri: string
  resources: RequestWithPre['pre']['resources']
}) => {
  const { authorisationDefintions } = resources

  const clientAssertionJWT = await generateClientAssertionJWT(instance, {
    clientId,
    issuer: authorisationDefintions.issuer,
    url: `${provider.jwkmsUrl}/api/crypto/signClaims`
  })

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const params = {
    grant_type: 'authorization_code',
    code,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    redirect_uri: redirectUri,
    client_assertion: clientAssertionJWT
  }

  const res = await instance.post<Token>(authorisationDefintions.token_endpoint, qs.stringify(params), {
    headers
  })

  return res.data
}
