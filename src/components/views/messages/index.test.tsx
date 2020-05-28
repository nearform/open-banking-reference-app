import React from 'react'

import { Messages } from './'
import { render, fireEvent } from 'test-utils'

const stubProps = {
  awaitingResponse: true,
  sendMessage: jest.fn()
}

test('Messages view', () => {
  const { getByText, getByPlaceholder } = render(
    <Messages
      messages={[
        {
          id: 0,
          text: 'Hi there, my name is Assistant and I can help you with most common queries. How may I help you today?',
          icon: 'ic-transfer-2',
          isBot: true,
          date: Date.now()
        }
      ]}
      {...stubProps}
    />
  )

  // ensure we're showing 1 message by default
  expect(
    getByText('Hi there, my name is Assistant and I can help you with most common queries. How may I help you today?')
  ).toBeTruthy()

  // add a message
  fireEvent.changeText(getByPlaceholder('Ask Assistant a question'), 'Sample message')
  fireEvent(getByPlaceholder('Ask Assistant a question'), 'onSubmitEditing', 'Sample message')
  // ensure sendMessage is called with correct value
  expect(stubProps.sendMessage).toHaveBeenCalledWith('Sample message')
})
