import { initialState } from 'store'
import { mockStore } from 'test-utils'

import { sendMessage } from './assistant'

test('sendMessage() with successful response', () => {
  ;(global as any).fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      json: function () {
        return { text: 'test message' }
      }
    })
  })

  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(sendMessage('test message')).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'ASSISTANT_SEND_MESSAGE',
        text: 'test message'
      },
      {
        type: 'ASSISTANT_RECEIVE_RESPONSE',
        text: 'test message'
      }
    ])
  })
})

test('sendMessage() with unsuccessful response', () => {
  ;(global as any).fetch = jest.fn().mockImplementation(() => {
    return Promise.reject(new Error('error'))
  })

  const state = initialState()
  const store = mockStore(state)

  return store.dispatch(sendMessage('test message')).then(() => {
    expect(store.getActions()).toEqual([
      {
        type: 'ASSISTANT_SEND_MESSAGE',
        text: 'test message'
      },
      {
        type: 'ASSISTANT_RECEIVE_RESPONSE',
        text: 'Please try again later. There was an error processing your request.'
      }
    ])
  })
})
