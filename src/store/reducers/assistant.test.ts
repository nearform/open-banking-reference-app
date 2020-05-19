import reducer from './assistant'

test('send message', () => {
  expect(
    reducer(
      {
        awaitingResponse: false,
        messages: []
      },
      { type: 'ASSISTANT_SEND_MESSAGE', text: 'hello there!' }
    )
  ).toEqual({
    awaitingResponse: true,
    messages: [
      {
        id: 0,
        text: 'hello there!',
        icon: 'ic-transfer-1',
        isBot: false,
        date: 1587340800000
      }
    ]
  })
})

test('receive response', () => {
  expect(
    reducer(
      {
        awaitingResponse: true,
        messages: []
      },
      { type: 'ASSISTANT_RECEIVE_RESPONSE', text: 'hi, how are you?' }
    )
  ).toEqual({
    awaitingResponse: true,
    messages: [
      {
        id: 0,
        text: 'hi, how are you?',
        icon: 'ic-transfer-2',
        isBot: true,
        date: 1587340800000
      }
    ]
  })
})
