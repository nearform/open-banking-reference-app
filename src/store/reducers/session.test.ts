import reducer from './session'

test('initialise session', () => {
  expect(
    reducer(
      {
        authorizationUrl: '',
        code: '',
        loading: false,
        pin: ''
      },
      {
        type: 'INIT_SESSION',
        payload: 'http://example.com/123'
      }
    )
  ).toEqual({
    authorizationUrl: 'http://example.com/123',
    code: '',
    loading: true,
    pin: ''
  })
})

test('session tokens', () => {
  expect(
    reducer(
      {
        authorizationUrl: '',
        code: '',
        loading: false,
        pin: ''
      },
      {
        type: 'SESSION_TOKENS',
        payload: {
          key: {
            access_token: 'abc123',
            expires_in: 3600,
            id_token: '999999',
            token_type: 'access',
            scope: '*',
            refresh_token: 'xyz987'
          }
        }
      }
    )
  ).toEqual({
    authorizationUrl: '',
    code: '',
    loading: false,
    pin: '',
    tokens: {
      key: {
        access_token: 'abc123',
        expires_in: 3600,
        id_token: '999999',
        token_type: 'access',
        scope: '*',
        refresh_token: 'xyz987'
      }
    }
  })
})

test('saving PIN', () => {
  expect(
    reducer(
      {
        authorizationUrl: '',
        code: '',
        loading: false,
        pin: ''
      },
      {
        type: 'SAVE_PIN',
        payload: '999999'
      }
    )
  ).toEqual({
    authorizationUrl: '',
    code: '',
    loading: false,
    pin: '999999'
  })
})
