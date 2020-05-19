import reducer from './connection'

test('load institutions', () => {
  expect(
    reducer(
      {
        connections: [],
        institutions: [],
        request: null,
        notify: false
      },
      {
        type: 'LOAD_INSTITUTIONS',
        payload: [
          {
            full_name: 'Institution 1',
            id: 'institution-1',
            media: [
              {
                source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
                type: 'icon'
              },
              {
                source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
                type: 'logo'
              }
            ],
            name: 'Inst 1'
          }
        ]
      }
    )
  ).toEqual({
    connections: [],
    institutions: [
      {
        full_name: 'Institution 1',
        id: 'institution-1',
        media: [
          {
            source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
            type: 'icon'
          },
          {
            source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
            type: 'logo'
          }
        ],
        name: 'Inst 1'
      }
    ],
    request: null,
    notify: false
  })
})

test('load request', () => {
  expect(
    reducer(
      {
        connections: [],
        institutions: [],
        request: null,
        notify: false
      },
      {
        type: 'LOAD_REQUEST',
        payload: {
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
      }
    )
  ).toEqual({
    connections: [],
    institutions: [],
    request: {
      IBAN: '',
      access_token: '************',
      account_number: '00000000',
      connection_name: 'Sally',
      hub_name: 'Anne-Marie',
      id: '123456',
      invitation: 'hello',
      sort_code: '010101',
      status: 'PENDING'
    },
    notify: false
  })
})

test('load connections', () => {
  expect(
    reducer(
      {
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
        ],
        institutions: [],
        request: null,
        notify: false
      },
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
          status: 'APPROVED'
        }
      }
    )
  ).toEqual({
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
        status: 'APPROVED'
      }
    ],
    institutions: [],
    request: null,
    notify: false
  })
})

test('notify connection', () => {
  expect(
    reducer(
      {
        connections: [],
        institutions: [],
        request: null,
        notify: false
      },
      {
        type: 'NOTIFY_CONNECTION'
      }
    )
  ).toEqual({
    connections: [],
    institutions: [],
    request: null,
    notify: true
  })
})

test('complete connection', () => {
  expect(
    reducer(
      {
        connections: [],
        institutions: [],
        request: {
          IBAN: '',
          access_token: '************',
          account_number: '00000000',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: '123456',
          invitation: 'hello',
          sort_code: '010101',
          status: 'PENDING'
        },
        notify: true
      },
      {
        type: 'COMPLETE_CONNECTION'
      }
    )
  ).toEqual({
    connections: [],
    institutions: [],
    request: null,
    notify: false
  })
})
