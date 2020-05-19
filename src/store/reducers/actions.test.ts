import reducer from './actions'

test('load action', () => {
  expect(
    reducer(
      {
        active: '',
        actions: [],
        loading: false
      },
      { type: 'LOAD_ACTION' }
    )
  ).toEqual({
    active: '',
    actions: [],
    loading: true
  })
})

test('create action', () => {
  expect(
    reducer(
      {
        active: '',
        actions: [],
        loading: false
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
          customSelection: false
        }
      }
    )
  ).toEqual({
    active: '',
    actions: [
      {
        start: 1587340800000,
        end: 1595203200000,
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
    ],
    loading: false
  })
})

test('update action', () => {
  expect(
    reducer(
      {
        active: '',
        actions: [
          {
            start: 1587340800000,
            end: 1595203200000,
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
        ],
        loading: false
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
          name: 'new-action-name',
          note: 'action-note',
          amount: '999.99',
          type: 'conditional',
          selection: '50',
          customSelection: false
        }
      }
    )
  ).toEqual({
    active: '',
    actions: [
      {
        start: 1587340800000,
        end: 1595203200000,
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
        name: 'new-action-name',
        note: 'action-note',
        amount: '999.99',
        type: 'conditional',
        selection: '50',
        customSelection: false
      }
    ],
    loading: false
  })
})

test('delete action', () => {
  expect(
    reducer(
      {
        active: '',
        actions: [
          {
            start: 1587340800000,
            end: 1595203200000,
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
        ],
        loading: false
      },
      {
        type: 'DELETE_ACTION',
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
          customSelection: false
        }
      }
    )
  ).toEqual({
    active: '',
    actions: [],
    loading: false
  })
})
