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
  date: string
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

export interface InstitutionMedia {
  source: string
  type: 'logo' | 'icon'
}

export interface Institution {
  id: string
  name: string
  full_name: string
  media: InstitutionMedia[]
}

export interface NavigateItem {
  id?: string
  type: string
}

export interface Action {
  id?: string
  name: string
  type: string
  start?: number
  end?: number
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
