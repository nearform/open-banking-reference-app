import { initialState } from 'store'
import * as apiServices from 'services/api'
import { mockStore } from 'test-utils'

import { checkConnections } from './connection'

test('checkConnections() when there are no connections', () => {
  const loadConnectionSpy = jest.spyOn(apiServices, 'loadConnection')

  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(checkConnections()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadConnectionSpy).not.toHaveBeenCalled()
  })
})

test('checkConnections() when there are connections when connection status is authorized', () => {
  const loadConnectionSpy = jest.spyOn(apiServices, 'loadConnection')

  const state = initialState()
  const store = mockStore({
    ...state,
    connection: {
      ...state.connection,
      connections: [
        {
          IBAN: '',
          access_token: '************',
          account_number: '00000000',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: '123456',
          invitation: 'hello',
          sort_code: '010101',
          status: 'AUTHORIZED'
        }
      ]
    }
  })

  return store.dispatch(checkConnections()).then(() => {
    expect(store.getActions()).toEqual([])
    expect(loadConnectionSpy).not.toHaveBeenCalled()
  })
})

test('checkConnections() when there are connections when connection status is not authorized', () => {
  const loadConnectionSpy = jest.spyOn(apiServices, 'loadConnection')
  loadConnectionSpy.mockReturnValue(
    Promise.resolve({
      IBAN: '',
      access_token: '************',
      account_number: '00000000',
      connection_name: 'Sally',
      hub_name: 'Anne-Marie',
      id: '123456',
      invitation: 'hello',
      sort_code: '010101',
      status: 'AUTHORIZED'
    })
  )

  const state = initialState()
  const store = mockStore({
    ...state,
    connection: {
      ...state.connection,
      connections: [
        {
          IBAN: '',
          access_token: '************',
          account_number: '00000000',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: '123456',
          invitation: 'hello',
          sort_code: '010101',
          status: 'PENDING'
        }
      ]
    }
  })

  return store.dispatch(checkConnections()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'LOAD_CONNECTION',
        payload: {
          IBAN: '',
          access_token: '************',
          account_number: '00000000',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: '123456',
          invitation: 'hello',
          sort_code: '010101',
          status: 'AUTHORIZED'
        }
      }
    ])
    expect(loadConnectionSpy).toHaveBeenCalledWith('123456')
  })
})
