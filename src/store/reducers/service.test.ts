import reducer from './service'

test('query service status', () => {
  expect(
    reducer(
      {
        available: false,
        checking: false
      },
      {
        type: 'SERVICE_QUERY_STATUS'
      }
    )
  ).toEqual({
    available: false,
    checking: true
  })
})

test('query update status', () => {
  expect(
    reducer(
      {
        available: false,
        checking: false
      },
      {
        type: 'SERVICE_UPDATE_STATUS',
        available: true
      }
    )
  ).toEqual({
    available: true,
    checking: false
  })
})
