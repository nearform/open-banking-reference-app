import { initialState } from 'store'
import * as apiServices from 'services/api'
import { AsyncStorage } from 'react-native'
import { mockStore } from 'test-utils'

import { loadTokens, initSession } from './session'
const getItemSpy = jest.spyOn(AsyncStorage, 'getItem')
const setItemSpy = jest.spyOn(AsyncStorage, 'setItem')
const removeItemSpy = jest.spyOn(AsyncStorage, 'removeItem')

beforeEach(() => jest.clearAllMocks())

test('loadTokens() when there is no token', async () => {
  getItemSpy.mockResolvedValueOnce(null)

  const loadTokensSpy = jest.spyOn(apiServices, 'loadTokens')

  const state = initialState()
  const store = mockStore(state)

  await store.dispatch(loadTokens('1234'))
  expect(store.getActions()).toEqual([])
  expect(getItemSpy).toHaveBeenCalled()
  expect(setItemSpy).not.toHaveBeenCalled()
  expect(loadTokensSpy).not.toHaveBeenCalled()
})

test('loadTokens() when there is a token', async () => {
  const provider = 'abc'
  getItemSpy.mockResolvedValueOnce(provider)
  const tokens = {
    access_token: 'abc123',
    expires_in: 3600,
    id_token: '999999',
    token_type: 'access',
    scope: '*',
    refresh_token: 'xyz987'
  }

  const loadTokensSpy = jest.spyOn(apiServices, 'loadTokens')
  loadTokensSpy.mockResolvedValueOnce(tokens)

  const state = initialState()
  const store = mockStore(state)

  await store.dispatch(loadTokens('1234'))
  expect(store.getActions()).toEqual([
    {
      type: 'SESSION_TOKENS',
      payload: {
        [provider]: tokens
      }
    }
  ])
  expect(getItemSpy).toHaveBeenCalled()
  expect(setItemSpy).toHaveBeenCalledWith('@PolarisBank:tokens', JSON.stringify({ [provider]: tokens }))
  expect(removeItemSpy).toHaveBeenCalledWith('@PolarisBank:redirect-provider')
  expect(loadTokensSpy).toHaveBeenCalledWith('1234', provider)
})

test('initSession() when there is a payload', async () => {
  const provider = 'santander'
  const payload = '123456'
  const state = initialState()
  const store = mockStore(state)

  await store.dispatch(initSession(payload, provider))
  expect(store.getActions()).toEqual([
    {
      type: 'INIT_SESSION',
      payload
    }
  ])
  expect(setItemSpy).toHaveBeenCalledWith('@PolarisBank:redirect-provider', provider)
})
