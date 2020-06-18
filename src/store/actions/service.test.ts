import { initialState } from 'store'
import { mockStore } from 'test-utils'

import { queryStatus } from './service'

test('queryStatus() with successful response', () => {
  ;(global as any).fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true
    })
  })

  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(queryStatus()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'SERVICE_QUERY_STATUS'
      },
      {
        type: 'SERVICE_UPDATE_STATUS',
        available: true
      }
    ])
  })
})

test('queryStatus() with unsuccessful response', () => {
  ;(global as any).fetch = jest.fn().mockImplementation(() => {
    return Promise.reject(new Error('error'))
  })

  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(queryStatus()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'SERVICE_QUERY_STATUS'
      },
      {
        type: 'SERVICE_UPDATE_STATUS',
        available: false
      }
    ])
  })
})
