import reducer from './accounts'

test("don't add open banking account if there is already one defined", () => {
  expect(
    reducer(
      {
        active: 'abc',
        accounts: [
          {
            id: 'ob',
            accountNumber: '123456',
            title: 'Bank Account',
            type: 'openbanking'
          }
        ],
        lastUpdated: null
      },
      { type: 'ADD_OPENBANKING_ACCOUNT' }
    )
  ).toEqual({
    active: 'ob',
    accounts: [
      {
        id: 'ob',
        accountNumber: '123456',
        title: 'Bank Account',
        type: 'openbanking'
      }
    ],
    lastUpdated: null
  })
})

test('add open banking account if none defined', () => {
  expect(
    reducer(
      {
        active: 'abc',
        accounts: [
          {
            id: 'abc',
            accountNumber: '123456',
            title: 'Bank Account',
            type: 'openbanking'
          }
        ],
        lastUpdated: null
      },
      { type: 'ADD_OPENBANKING_ACCOUNT' }
    )
  ).toEqual({
    active: 'ob',
    accounts: [
      {
        id: 'abc',
        accountNumber: '123456',
        title: 'Bank Account',
        type: 'openbanking'
      },
      {
        id: 'ob',
        title: 'Open Santander',
        balance: '345,78',
        type: 'Open banking',
        accountNumber: 'PT48SANT123456192837465',
        icon: require(`../../assets/logos/santander-red.png`)
      }
    ],
    lastUpdated: null
  })
})

test('choose specific account', () => {
  expect(
    reducer(
      {
        active: 'abc',
        accounts: [
          {
            id: 'ob',
            accountNumber: '123456',
            title: 'Bank Account',
            type: 'openbanking'
          }
        ],
        lastUpdated: null
      },
      { type: 'SELECT_ACCOUNT', payload: '123' }
    )
  ).toEqual({
    active: '123',
    accounts: [
      {
        id: 'ob',
        accountNumber: '123456',
        title: 'Bank Account',
        type: 'openbanking'
      }
    ],
    lastUpdated: null
  })
})

test('load accounts', () => {
  expect(
    reducer(
      {
        active: 'abc',
        accounts: [
          {
            id: 'ob',
            accountNumber: '123456',
            title: 'Bank Account',
            type: 'openbanking',
            balance: '123.66',
            provider: 6,
            transactions: []
          },
          {
            id: 'aaaaaa',
            accountNumber: '111111',
            title: 'Savings Account',
            type: 'personal',
            balance: '987.65',
            provider: 3,
            transactions: []
          }
        ],
        lastUpdated: null
      },
      {
        type: 'LOAD_ACCOUNTS',
        payload: [
          {
            id: 'aaaaaa',
            accountNumber: '98765',
            title: 'New Account',
            type: 'current',
            balance: '444.44',
            provider: 3
          }
        ]
      }
    )
  ).toEqual({
    active: 'abc',
    accounts: [
      {
        id: 'aaaaaa',
        accountNumber: '98765',
        title: 'New Account',
        type: 'current',
        balance: '987.65',
        provider: 3,
        transactions: []
      }
    ],
    lastUpdated: 1587340800000
  })
})

test('update account', () => {
  expect(
    reducer(
      {
        active: 'aaaaaa',
        accounts: [
          {
            id: 'aaaaaa',
            accountNumber: '111111',
            title: 'Savings Account',
            type: 'personal',
            balance: '987.65',
            provider: 3,
            transactions: []
          }
        ],
        lastUpdated: null
      },
      {
        type: 'UPDATE_ACCOUNT',
        payload: {
          id: 'aaaaaa',
          property: 'title',
          value: 'ISA'
        }
      }
    )
  ).toEqual({
    active: 'aaaaaa',
    accounts: [
      {
        id: 'aaaaaa',
        accountNumber: '111111',
        title: 'ISA',
        type: 'personal',
        balance: '987.65',
        provider: 3,
        transactions: []
      }
    ],
    lastUpdated: null
  })
})
