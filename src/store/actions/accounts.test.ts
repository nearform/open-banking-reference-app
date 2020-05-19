import { initialState } from 'store'
import * as apiServices from 'services/api'
import { mockStore } from 'test-utils'

import { loadAccounts } from './accounts'

test('loadAccounts() when no tokens are set', () => {
  const loadAccountsSpy = jest.spyOn(apiServices, 'loadAccounts')
  const loadAccountBalanceSpy = jest.spyOn(apiServices, 'loadAccountBalance')
  const loadAccountTransactionsSpy = jest.spyOn(apiServices, 'loadAccountTransactions')

  const state = initialState()
  const store = mockStore({
    ...state,
    accounts: { ...state.accounts, lastUpdated: 1587330800000 },
    providers: {
      ...state.providers,
      providers: [
        {
          title: 'Provider 1',
          id: 1,
          version: '0.0.1',
          logo: 'provider-1'
        }
      ]
    }
  })

  return store.dispatch(loadAccounts()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadAccountsSpy).not.toHaveBeenCalled()
    expect(loadAccountBalanceSpy).not.toHaveBeenCalled()
    expect(loadAccountTransactionsSpy).not.toHaveBeenCalled()
  })
})

test('loadAccounts() when no providers are set', () => {
  const loadAccountsSpy = jest.spyOn(apiServices, 'loadAccounts')
  const loadAccountBalanceSpy = jest.spyOn(apiServices, 'loadAccountBalance')
  const loadAccountTransactionsSpy = jest.spyOn(apiServices, 'loadAccountTransactions')

  const state = initialState()
  const store = mockStore({
    ...state,
    accounts: { ...state.accounts, lastUpdated: 1587330800000 },
    session: {
      ...state.session,
      tokens: {
        1: {
          access_token: 'abc123',
          expires_in: 3600,
          id_token: '999999',
          token_type: 'access',
          scope: '*',
          refresh_token: 'xyz987'
        }
      }
    }
  })

  return store.dispatch(loadAccounts()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadAccountsSpy).not.toHaveBeenCalled()
    expect(loadAccountBalanceSpy).not.toHaveBeenCalled()
    expect(loadAccountTransactionsSpy).not.toHaveBeenCalled()
  })
})

test('loadAccounts() when the last update was within 15 minutes', () => {
  const loadAccountsSpy = jest.spyOn(apiServices, 'loadAccounts')
  const loadAccountBalanceSpy = jest.spyOn(apiServices, 'loadAccountBalance')
  const loadAccountTransactionsSpy = jest.spyOn(apiServices, 'loadAccountTransactions')

  const state = initialState()
  const store = mockStore({
    ...state,
    accounts: { ...state.accounts, lastUpdated: 1587340799999 },
    providers: {
      ...state.providers,
      providers: [
        {
          title: 'Provider 1',
          id: 1,
          version: '0.0.1',
          logo: 'provider-1'
        }
      ]
    },
    session: {
      ...state.session,
      tokens: {
        1: {
          access_token: 'abc123',
          expires_in: 3600,
          id_token: '999999',
          token_type: 'access',
          scope: '*',
          refresh_token: 'xyz987'
        }
      }
    }
  })

  return store.dispatch(loadAccounts()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadAccountsSpy).not.toHaveBeenCalled()
    expect(loadAccountBalanceSpy).not.toHaveBeenCalled()
    expect(loadAccountTransactionsSpy).not.toHaveBeenCalled()
  })
})

test('loadAccounts() when accounts are loadable', () => {
  const loadAccountsSpy = jest.spyOn(apiServices, 'loadAccounts')
  loadAccountsSpy.mockReturnValue(
    Promise.resolve([
      {
        id: 'aaaaaa',
        accountNumber: '98765',
        title: 'New Account',
        type: 'current',
        balance: '444.44',
        provider: 3
      }
    ])
  )

  const loadAccountBalanceSpy = jest.spyOn(apiServices, 'loadAccountBalance')
  loadAccountBalanceSpy.mockReturnValue(Promise.resolve('99'))

  const loadAccountTransactionsSpy = jest.spyOn(apiServices, 'loadAccountTransactions')
  loadAccountTransactionsSpy.mockReturnValue(
    Promise.resolve([
      {
        amount: '-150',
        currency: 'GBP',
        date: '2012-11-03T09:30:39.919Z',
        icon: 'example',
        title: 'Bank Transfer'
      }
    ])
  )

  const state = initialState()
  const store = mockStore({
    ...state,
    accounts: { ...state.accounts, lastUpdated: 1587330800000 },
    providers: {
      ...state.providers,
      providers: [
        {
          title: 'Provider 1',
          id: 1,
          version: '0.0.1',
          logo: 'provider-1'
        }
      ]
    },
    session: {
      ...state.session,
      tokens: {
        1: {
          access_token: 'abc123',
          expires_in: 3600,
          id_token: '999999',
          token_type: 'access',
          scope: '*',
          refresh_token: 'xyz987'
        }
      }
    }
  })

  return store.dispatch(loadAccounts()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'LOAD_ACCOUNTS',
        payload: [
          {
            id: 'aaaaaa',
            accountNumber: '98765',
            title: 'New Account',
            type: 'current',
            balance: '444.44',
            provider: 1
          }
        ]
      },
      {
        type: 'UPDATE_ACCOUNT',
        payload: { id: 'aaaaaa', property: 'balance', value: '99' }
      },
      {
        type: 'UPDATE_ACCOUNT',
        payload: {
          id: 'aaaaaa',
          property: 'transactions',
          value: [
            {
              amount: '-150',
              currency: 'GBP',
              date: '2012-11-03T09:30:39.919Z',
              icon: 'example',
              title: 'Bank Transfer'
            }
          ]
        }
      }
    ])
  })
})
