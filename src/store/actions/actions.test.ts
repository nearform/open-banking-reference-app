import { initialState } from 'store'
import * as apiServices from 'services/api'
import { mockStore } from 'test-utils'

import { createAction, updateAction, checkActions } from './actions'

afterEach(() => {
  jest.clearAllMocks()
})

test("createAction() when type isn't conditional", () => {
  const createBalanceMonitorSpy = jest.spyOn(apiServices, 'createBalanceMonitor')
  const state = initialState()
  const store = mockStore(state)

  return store
    .dispatch(
      createAction({
        to: {
          IBAN: '',
          access_token: '************',
          account_number: '1234567',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: 'aaaaaa',
          invitation: 'hello',
          sort_code: '030901',
          status: 'AUTHORIZED'
        },
        id: '999999',
        name: 'action-name',
        note: 'action-note',
        amount: '111.11',
        type: 'scheduled',
        selection: '50',
        customSelection: false
      })
    )
    .then(() => {
      expect(store.getActions()).toEqual([
        {
          type: 'LOAD_ACTION'
        },
        {
          type: 'CREATE_ACTION',
          payload: {
            to: {
              IBAN: '',
              access_token: '************',
              account_number: '1234567',
              connection_name: 'Sally',
              hub_name: 'Anne-Marie',
              id: 'aaaaaa',
              invitation: 'hello',
              sort_code: '030901',
              status: 'AUTHORIZED'
            },
            id: '999999',
            name: 'action-name',
            note: 'action-note',
            amount: '111.11',
            type: 'scheduled',
            selection: '50',
            customSelection: false
          }
        }
      ])
      expect(createBalanceMonitorSpy).not.toHaveBeenCalled()
    })
})

test("createAction() when type isn't conditional", () => {
  const createBalanceMonitorSpy = jest.spyOn(apiServices, 'createBalanceMonitor')
  createBalanceMonitorSpy.mockReturnValue(
    Promise.resolve({
      connection_id: '123456789',
      id: '987654321',
      threshold: '1000000',
      status: 'RED' as const,
      payment: '1000'
    })
  )

  const state = initialState()
  const store = mockStore(state)

  return store
    .dispatch(
      createAction({
        to: {
          IBAN: '',
          access_token: '************',
          account_number: '1234567',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: 'aaaaaa',
          invitation: 'hello',
          sort_code: '030901',
          status: 'AUTHORIZED'
        },
        id: '999999',
        name: 'action-name',
        note: 'action-note',
        amount: '111.11',
        type: 'conditional',
        selection: '50',
        customSelection: false
      })
    )
    .then(() => {
      expect(store.getActions()).toEqual([
        {
          type: 'LOAD_ACTION'
        },
        {
          type: 'CREATE_ACTION',
          payload: {
            to: {
              IBAN: '',
              access_token: '************',
              account_number: '1234567',
              connection_name: 'Sally',
              hub_name: 'Anne-Marie',
              id: 'aaaaaa',
              invitation: 'hello',
              sort_code: '030901',
              status: 'AUTHORIZED'
            },
            id: '999999',
            name: 'action-name',
            note: 'action-note',
            amount: '111.11',
            type: 'conditional',
            selection: '50',
            customSelection: false,
            balanceMonitor: {
              connection_id: '123456789',
              id: '987654321',
              threshold: '1000000',
              status: 'RED' as const,
              payment: '1000'
            }
          }
        }
      ])
      expect(createBalanceMonitorSpy).toHaveBeenCalledWith('aaaaaa', '50', '111.11')
    })
})

test("updateAction() when action doesn't have balance monitor", () => {
  const deleteBalanceMonitorSpy = jest.spyOn(apiServices, 'deleteBalanceMonitor')
  const createBalanceMonitorSpy = jest.spyOn(apiServices, 'createBalanceMonitor')
  const state = initialState()
  const store = mockStore(state)

  return store
    .dispatch(
      updateAction({
        to: {
          IBAN: '',
          access_token: '************',
          account_number: '1234567',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: 'aaaaaa',
          invitation: 'hello',
          sort_code: '030901',
          status: 'AUTHORIZED'
        },
        id: '999999',
        name: 'action-name',
        note: 'action-note',
        amount: '222.22',
        type: 'scheduled',
        selection: '50',
        customSelection: false
      })
    )
    .then(() => {
      expect(store.getActions()).toEqual([
        {
          type: 'LOAD_ACTION'
        },
        {
          type: 'UPDATE_ACTION',
          payload: {
            to: {
              IBAN: '',
              access_token: '************',
              account_number: '1234567',
              connection_name: 'Sally',
              hub_name: 'Anne-Marie',
              id: 'aaaaaa',
              invitation: 'hello',
              sort_code: '030901',
              status: 'AUTHORIZED'
            },
            id: '999999',
            name: 'action-name',
            note: 'action-note',
            amount: '222.22',
            type: 'scheduled',
            selection: '50',
            customSelection: false
          }
        }
      ])
      expect(deleteBalanceMonitorSpy).not.toHaveBeenCalled()
      expect(createBalanceMonitorSpy).not.toHaveBeenCalled()
    })
})

test('updateAction() when action has balance monitor', () => {
  const deleteBalanceMonitorSpy = jest.spyOn(apiServices, 'deleteBalanceMonitor')
  const createBalanceMonitorSpy = jest.spyOn(apiServices, 'createBalanceMonitor')
  createBalanceMonitorSpy.mockReturnValue(
    Promise.resolve({
      connection_id: '123456789',
      id: '987654321',
      threshold: '1000000',
      status: 'RED' as const,
      payment: '1000'
    })
  )
  const state = initialState()
  const store = mockStore(state)

  return store
    .dispatch(
      updateAction({
        to: {
          IBAN: '',
          access_token: '************',
          account_number: '1234567',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: 'aaaaaa',
          invitation: 'hello',
          sort_code: '030901',
          status: 'AUTHORIZED'
        },
        id: '999999',
        name: 'action-name',
        note: 'action-note',
        amount: '222.22',
        type: 'scheduled',
        selection: '50',
        customSelection: false,
        balanceMonitor: {
          connection_id: '123456789',
          id: '987654321',
          threshold: '1000000',
          status: 'RED' as const,
          payment: '1000'
        }
      })
    )
    .then(() => {
      expect(store.getActions()).toEqual([
        {
          type: 'LOAD_ACTION'
        },
        {
          type: 'UPDATE_ACTION',
          payload: {
            to: {
              IBAN: '',
              access_token: '************',
              account_number: '1234567',
              connection_name: 'Sally',
              hub_name: 'Anne-Marie',
              id: 'aaaaaa',
              invitation: 'hello',
              sort_code: '030901',
              status: 'AUTHORIZED'
            },
            id: '999999',
            name: 'action-name',
            note: 'action-note',
            amount: '222.22',
            type: 'scheduled',
            selection: '50',
            customSelection: false,
            balanceMonitor: {
              connection_id: '123456789',
              id: '987654321',
              threshold: '1000000',
              status: 'RED' as const,
              payment: '1000'
            }
          }
        }
      ])
      expect(deleteBalanceMonitorSpy).toHaveBeenCalledWith({
        connection_id: '123456789',
        id: '987654321',
        threshold: '1000000',
        status: 'RED' as const,
        payment: '1000'
      })
      expect(createBalanceMonitorSpy).toHaveBeenCalledWith('aaaaaa', '50', '222.22')
    })
})

test('checkActions() when there are no actions', () => {
  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(checkActions()).then(() => {
    expect(store.getActions()).toEqual([])
  })
})

test('checkActions() when there is an action without a balance monitor', () => {
  const state = initialState()
  const store = mockStore({
    ...state,
    actions: {
      ...state.actions,
      actions: [
        {
          to: {
            IBAN: '',
            access_token: '************',
            account_number: '1234567',
            connection_name: 'Sally',
            hub_name: 'Anne-Marie',
            id: 'aaaaaa',
            invitation: 'hello',
            sort_code: '030901',
            status: 'AUTHORIZED'
          },
          id: '999999',
          name: 'action-name',
          note: 'action-note',
          amount: '111.11',
          type: 'conditional',
          selection: '50',
          customSelection: false
        }
      ]
    }
  })

  return store.dispatch(checkActions()).then(() => {
    expect(store.getActions()).toEqual([])
  })
})

test('checkActions() when there is an action with a balance monitor', () => {
  const loadBalanceMonitorSpy = jest.spyOn(apiServices, 'loadBalanceMonitor')
  loadBalanceMonitorSpy.mockReturnValue(
    Promise.resolve({
      connection_id: '123456789',
      id: '987654321',
      threshold: '1000000',
      status: 'RED' as const,
      payment: '999'
    })
  )
  const state = initialState()
  const store = mockStore({
    ...state,
    actions: {
      ...state.actions,
      actions: [
        {
          to: {
            IBAN: '',
            access_token: '************',
            account_number: '1234567',
            connection_name: 'Sally',
            hub_name: 'Anne-Marie',
            id: 'aaaaaa',
            invitation: 'hello',
            sort_code: '030901',
            status: 'AUTHORIZED'
          },
          id: '999999',
          name: 'action-name',
          note: 'action-note',
          amount: '111.11',
          type: 'conditional',
          selection: '50',
          customSelection: false,
          balanceMonitor: {
            connection_id: '123456789',
            id: '987654321',
            threshold: '1000000',
            status: 'RED' as const,
            payment: '1000'
          }
        }
      ]
    }
  })

  return store.dispatch(checkActions()).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'UPDATE_ACTION',
        payload: {
          to: {
            IBAN: '',
            access_token: '************',
            account_number: '1234567',
            connection_name: 'Sally',
            hub_name: 'Anne-Marie',
            id: 'aaaaaa',
            invitation: 'hello',
            sort_code: '030901',
            status: 'AUTHORIZED'
          },
          id: '999999',
          name: 'action-name',
          note: 'action-note',
          amount: '111.11',
          type: 'conditional',
          selection: '50',
          customSelection: false,
          balanceMonitor: {
            connection_id: '123456789',
            id: '987654321',
            threshold: '1000000',
            status: 'RED' as const,
            payment: '999'
          }
        }
      }
    ])
    expect(loadBalanceMonitorSpy).toHaveBeenCalledWith('987654321')
  })
})
