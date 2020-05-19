import reducer from './providers'

test('load providers', () => {
  expect(
    reducer(
      {
        lastUpdated: null,
        loading: false,
        providers: []
      },
      {
        type: 'LOAD_PROVIDERS'
      }
    )
  ).toEqual({
    lastUpdated: null,
    loading: true,
    providers: []
  })
})

test('loaded providers', () => {
  expect(
    reducer(
      {
        lastUpdated: null,
        loading: false,
        providers: []
      },
      {
        type: 'LOADED_PROVIDERS',
        payload: [
          {
            title: 'Provider 1',
            id: 1,
            version: '0.0.1',
            logo: 'provider-1'
          },
          {
            title: '',
            name: 'Provider 2',
            id: 1,
            version: '0.0.1',
            logo: 'provider-2'
          }
        ]
      }
    )
  ).toEqual({
    lastUpdated: 1587340800000,
    loading: false,
    providers: [
      {
        title: 'Provider 1',
        id: 1,
        version: '0.0.1',
        logo: 'provider-1'
      },
      {
        title: 'Provider 2',
        id: 1,
        version: '0.0.1',
        logo: 'provider-2'
      }
    ]
  })
})
