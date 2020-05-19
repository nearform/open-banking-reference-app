import hapi from '@hapi/hapi'
import pino from 'pino'
import { AxiosInstance } from 'axios'

declare module '@hapi/hapi' {
  interface Server {
    logger: () => pino.Logger
  }

  interface Request {
    logger: pino.Logger
  }

  interface PluginSpecificConfiguration {
    [key: string]: any
  }
}

export interface Server extends hapi.Server {
  watsonSessions(): Map<string, string>
  app: hapi.ServerApplicationState & {
    openbanking: {
      key: string
      crt: string
    }
  }
}

export interface BankProvider {
  provider: Provider
  authorisationUrl?: string
  resourceUrl?: string
  jwkmsUrl?: string
}

export interface RequestWithPre extends hapi.Request {
  pre: {
    clientId: string
    instance: AxiosInstance
    provider?: BankProvider
    resources: {
      authorisationDefintions: AuthorizationDefinitions
      resourceDefintions: ResourceDefinitions
    }
  }
}

export interface AuthorizationDefinitions {
  issuer: string
  token_endpoint: string
  authorization_endpoint: string
}

export interface ResourceDefinitions {
  Data: {
    FinancialId: string
    AccountAndTransactionAPI: {
      Version: string
      Links: {
        '@type': string
        links: {
          CreateAccountRequest: string
          DeleteAccountRequest: string
          GetParty: string
          GetAccountStatements: string
          GetScheduledPayments: string
          GetAccountRequest: string
          GetAccountBeneficiaries: string
          GetProducts: string
          GetTransactions: string
          GetAccountTransactions: string
          GetAccountScheduledPayments: string
          GetAccountStatementFile: string
          GetAccounts: string
          GetAccountStandingOrders: string
          GetBalances: string
          GetAccount: string
          GetAccountProduct: string
          GetOffers: string
          GetBeneficiaries: string
          GetAccountStatementTransactions: string
          GetAccountOffers: string
          GetAccountDirectDebits: string
          GetStatements: string
          GetAccountBalances: string
          GetAccountParty: string
          GetStandingOrders: string
          GetAccountStatement: string
          GetDirectDebits: string
        }[]
      }
    }[]
  }
}

export type AccountAction = keyof ResourceDefinitions['Data']['AccountAndTransactionAPI'][0]['Links']['links'][0]

export interface Token {
  access_token: string
  expires_in: number
  id_token: string
  token_type: string
  scope: string
  refresh_token: string
}

export interface Provider {
  id: number
  logo: string
  title: string
  name?: string
  version: string
}

export interface Transaction {
  amount: string
  currency: string
  date: number
  icon: string
  title: string
}

export interface Account {
  id: string
  accountNumber: string
  currency?: string
  provider?: number
  subType?: string
  title: string
  type: string
  headerTitle?: string
  // TODO: remove once we only load accounts from API
  balance?: string
  icon?: string | object
  transactions?: Transaction[]
}

export interface Connection {
  id: string
  invitation: string
  hub_name: string
  connection_name: string
  access_token?: string
  status: string
  account_number?: string
  IBAN?: string
  sort_code?: string
}

export interface Institution {
  id: string
  name: string
  full_name: string
}

export interface Action {
  id?: string
  name: string
  type: string
  start?: number
  end?: number
  from: Account
  to: Connection
  note?: string
  amount: string
  selection: string
  customSelection: boolean
  balanceMonitor?: BalanceMonitor
}

export interface BalanceMonitor {
  id: string
  connection_id: string
  threshold: string
  payment: string
  status: 'RED' | 'GREEN'
}
