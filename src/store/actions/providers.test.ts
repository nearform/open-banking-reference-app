import { initialState } from 'store'
import * as apiServices from 'services/api'
import { mockStore } from 'test-utils'

import { loadProviders } from './providers'

test('loadProviders() when the last update was less than 24  hours ago', () => {
  const loadProvidersSpy = jest.spyOn(apiServices, 'loadProviders')

  const state = initialState()
  const store = mockStore({ ...state, providers: { ...state.providers, lastUpdated: 1587340700000 } })

  return store.dispatch(loadProviders()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadProvidersSpy).not.toHaveBeenCalled()
  })
})

test('loadProviders() when the last update was more than 24 hours ago', () => {
  const loadProvidersSpy = jest.spyOn(apiServices, 'loadProviders')
  loadProvidersSpy.mockReturnValue(
    Promise.resolve([
      {
        title: 'Provider 1',
        id: 1,
        version: '0.0.1',
        logo: 'provider-1'
      }
    ])
  )

  const state = initialState()
  const store = mockStore({ ...state, providers: { ...state.providers, lastUpdated: 1538340900000 } })

  return store.dispatch(loadProviders()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'LOADED_PROVIDERS',
        payload: [
          {
            title: 'Provider 1',
            id: 1,
            version: '0.0.1',
            logo: 'provider-1'
          }
        ]
      }
    ])
    expect(loadProvidersSpy).toHaveBeenCalled()
  })
})

test('loadProviders() when force updated', () => {
  const loadProvidersSpy = jest.spyOn(apiServices, 'loadProviders')
  loadProvidersSpy.mockReturnValue(
    Promise.resolve([
      {
        title: 'Provider 1',
        id: 1,
        version: '0.0.1',
        logo: 'provider-1'
      }
    ])
  )

  const state = initialState()
  const store = mockStore({ ...state, providers: { ...state.providers, lastUpdated: 1587340900000 } })

  return store.dispatch(loadProviders(true)).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'LOADED_PROVIDERS',
        payload: []
      },
      {
        type: 'LOADED_PROVIDERS',
        payload: [
          {
            title: 'Provider 1',
            id: 1,
            version: '0.0.1',
            logo: 'provider-1'
          }
        ]
      }
    ])
    expect(loadProvidersSpy).toHaveBeenCalled()
  })
})
