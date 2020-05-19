import reducer from './ui'

test('toggling sidebar', () => {
  expect(
    reducer(
      {
        showSidebar: true
      },
      {
        type: 'TOGGLE_SIDEBAR'
      }
    )
  ).toEqual({
    showSidebar: false
  })
})
