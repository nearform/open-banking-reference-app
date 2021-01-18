import { differenceInMilliseconds } from 'date-fns'

import { Token, Provider, Account, Transaction, Institution, Connection, BalanceMonitor } from '../types'
import { ConnectionRequestBody } from 'src/store/actions/connection'
import TransactionIcons from './transaction-icons'

import urls from '../urls'

const randomIcon = () => {
  const icons = Object.keys(TransactionIcons)
  return icons[Math.floor(Math.random() * icons.length)]
}

const request = (endpoint: string, options = {}) => {
  if (endpoint.charAt(0) === '/') {
    endpoint = endpoint.substr(1)
  }
  return fetch(`${urls.api}/${endpoint}`, options)
}

export const loadTokens = async (code: string, provider: string | number) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      code,
      redirectUri: `${urls.ui}/openbanking`
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-provider': provider
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }
  const resTokens = await request('session', options)
  if (!resTokens.ok) {
    console.error(resTokens)
    alert('Error getting authorization tokens')
    return false
  }
  const data: Token = await resTokens.json()
  return data
}

export const loadAuthorizationURL = async (provider: string | number) => {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-provider': provider
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }
  const resAuth = await request(`session?redirectUri=${urls.ui}/openbanking`, options)
  if (!resAuth.ok) {
    console.error(resAuth)
    alert('Error getting authorization url')
    return false
  }
  const { authorizationUrl } = await resAuth.json()
  return authorizationUrl as string
}

export const loadProviders = async () => {
  const options = {
    Accept: 'application/json',
    cache: 'no-cache',
    'Content-Type': 'application/json',
    credentials: 'include',
    mode: 'cors'
  }
  const resProviders = await request('providers', options)
  if (!resProviders.ok) {
    console.error(resProviders)
    alert('Error getting providers')
    return []
  }
  const data: Provider[] = await resProviders.json()
  return data
}

export const loadAccounts = async (token: string, provider: string | number) => {
  const headers = {
    'x-provider-access-token': token,
    'x-provider': provider
  }
  const resAccounts = await request('accounts', { headers })
  if (!resAccounts.ok) {
    console.error(resAccounts)
    return []
  }
  return (await resAccounts.json()).Account.map((a: any) => ({
    accountNumber: a.Account[0].Identification,
    currency: a.Currency,
    id: a.AccountId,
    subType: a.AccountSubType,
    title: a.Nickname,
    type: a.AccountType
  })) as Account[]
}

export const loadAccountBalance = async (token: string, provider: string | number, id: string) => {
  const headers = {
    'x-provider-access-token': token,
    'x-provider': provider
  }
  const resBalance = await request(`accounts/${id}/balances`, { headers })
  if (!resBalance.ok) {
    console.error(resBalance)
    return false
  }
  const balanceJSON = (await resBalance.json()).Balance[0]
  const { CreditDebitIndicator, Amount } = balanceJSON
  return (CreditDebitIndicator === 'Debit' ? '' : '-') + Amount.Amount
}

export const loadAccountTransactions = async (token: string, provider: string | number, id: string) => {
  const headers = {
    'x-provider-access-token': token,
    'x-provider': provider
  }
  const resTransactions = await request(`accounts/${id}/transactions`, { headers })
  if (!resTransactions.ok) {
    console.error(resTransactions)
    return []
  }
  let transactions: Transaction[] = (await resTransactions.json()).Transaction
  transactions = transactions.map((t: any) => ({
    amount: (t.CreditDebitIndicator === 'Debit' ? '-' : '') + t.Amount.Amount,
    currency: t.Amount.Currency,
    date: t.ValueDateTime,
    icon: randomIcon(), // TODO add logic to determine icon to use
    title: t.TransactionInformation
  }))
  // Sort transactions by date DESC
  transactions.sort((a, b) => differenceInMilliseconds(new Date(a.date), new Date(b.date)))
  return transactions
}

export const createConnection = async (body: ConnectionRequestBody) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }
  const createConnectionResponse = await request('Connection', options)

  if (!createConnectionResponse.ok) {
    console.error(createConnectionResponse)
    throw new Error('Error creating connection')
  }

  return createConnectionResponse.json()
}

export const loadInstitutions = async () => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`Institution`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error loading institutions')
  }

  const data = await response.json()

  return data.Institution as Institution[]
}

export const loadConnection = async (id: string) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`Connection/${id}`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error loading connection')
  }

  return response.json() as Promise<Connection>
}

export const createAccountAuthorizationRequest = async (connection: Connection, institution: Institution) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      user_id: connection.id,
      institution_id: institution.id,
      callback_url: `${urls.ui}/connect/${connection.id}`
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`AccountAuthorizationRequest`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error creating account authorization request')
  }

  const data = await response.json()

  return data.authorization_url as string
}

export const updateConnection = async (id: string, token: string) => {
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      access_token: token
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`Connection/${id}`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error updating connection')
  }
}

export const deleteConnection = async ({ id }: Connection) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      id
    }),
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`Connection/${id}/rm`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error deleting connection')
  }
}

export const createBalanceMonitor = async (connection: string, threshold: string, amount: string) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      connection_id: connection,
      threshold,
      payment_amount: amount,
      notification_url: `${urls.api}/`
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request('BalanceMonitor', options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error creating balance monitor')
  }

  const data = await response.json()

  return loadBalanceMonitor(data.id)
}

export const deleteBalanceMonitor = async (balanceMonitor: BalanceMonitor) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      id: balanceMonitor.id
    }),
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`BalanceMonitor/${balanceMonitor.id}/rm`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error deleting balance monitor')
  }
}

export const loadBalanceMonitor = async (id: string) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include'
  }

  const response = await request(`BalanceMonitor/${id}`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error loading balance monitor')
  }

  return response.json() as Promise<BalanceMonitor>
}

export const createPaymentAuthorizationRequest = async (
  institution: Institution,
  connection: Connection,
  amount: string
) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      user_id: '000001',
      institution_id: institution.id,
      callback_url: `${urls.ui}/transfers/${connection.id}`,
      amount,
      payee_sort_code: connection.sort_code,
      payee_acc_number: connection.account_number,
      payee_IBAN: connection.IBAN,
      payee_name: connection.connection_name,
      currency: 'GBP'
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const response = await request(`PaymentAuthorizationRequest`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error creating payment authorization request')
  }

  const data = await response.json()

  return data.authorization_url as string
}

export const createPayment = async (connection: Connection, amount: string, consent: string) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      amount,
      payee_sort_code: connection.sort_code,
      payee_acc_number: connection.account_number,
      payee_IBAN: connection.IBAN,
      payee_name: connection.connection_name,
      currency: 'GBP',
      consent_token: consent
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const response = await request(`Payment`, options)

  if (!response.ok) {
    console.error(response)
    throw new Error('Error creating payment')
  }

  const data = await response.json()

  return data.authorization_url as string
}
