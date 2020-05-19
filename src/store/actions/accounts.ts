import differenceInMinutes from 'date-fns/differenceInMinutes'

import {
  loadAccounts as loadAccountsService,
  loadAccountBalance as loadAccountBalanceService,
  loadAccountTransactions as loadAccountTransactionsService
} from '../../services/api'
import { Dispatch, GetState } from '../'
import { Account } from '../../types'

const ADD_OPENBANKING_ACCOUNT = 'ADD_OPENBANKING_ACCOUNT'
const LOAD_ACCOUNTS = 'LOAD_ACCOUNTS'
const SELECT_ACCOUNT = 'SELECT_ACCOUNT'
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'

export function addOpenbankingAccount() {
  return {
    type: ADD_OPENBANKING_ACCOUNT
  } as const
}

export function selectAccount(id: string) {
  return {
    type: SELECT_ACCOUNT,
    payload: id
  } as const
}

export function updateAccountProperty(id: string, property: keyof Account, value: any) {
  return {
    type: UPDATE_ACCOUNT,
    payload: {
      id,
      property,
      value
    }
  } as const
}

export type AccountsAction =
  | ReturnType<typeof addOpenbankingAccount | typeof selectAccount | typeof updateAccountProperty>
  | {
      type: typeof LOAD_ACCOUNTS
      payload: Account[]
    }

export function loadAccounts() {
  return async (dispatch: Dispatch<AccountsAction>, getState: GetState) => {
    const {
      accounts: { lastUpdated },
      providers: { providers },
      session: { tokens = {} }
    } = getState()

    if (
      Object.keys(tokens).length === 0 ||
      !providers.length ||
      // only reload accounts if it's been at least 15 minutes
      (lastUpdated && differenceInMinutes(Date.now(), lastUpdated) < 15)
    ) {
      return
    }

    providers.forEach(async ({ id: provider }) => {
      const token = tokens[provider] ? tokens[provider].access_token : false
      if (!token) {
        return
      }
      const accounts = await loadAccountsService(token, provider)
      if (accounts.length === 0) {
        return
      }
      const payload = accounts.map((p: Account) => ({ ...p, provider }))
      dispatch({ type: LOAD_ACCOUNTS, payload })

      // load balances and transactions
      payload.forEach(async ({ id }: Account) => {
        const balance = await loadAccountBalanceService(token, provider, id)
        if (balance) {
          dispatch({
            type: UPDATE_ACCOUNT,
            payload: { id, property: 'balance', value: balance }
          })
        }
        const transactions = await loadAccountTransactionsService(token, provider, id)
        if (!transactions || transactions.length === 0) {
          return
        }
        dispatch({
          type: UPDATE_ACCOUNT,
          payload: { id, property: 'transactions', value: transactions }
        })
      })
    })
  }
}
