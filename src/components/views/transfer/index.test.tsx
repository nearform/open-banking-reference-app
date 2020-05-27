import React from 'react'

import { Transfer } from './'
import { render, fireEvent } from 'test-utils'

test('Transfer view', () => {
  const { getByText, history } = render(<Transfer />)

  const linkText = getByText('transfers:step1:item3')
  // ensure the transfer view is displayed
  expect(getByText('transfers:step1:title')).toBeTruthy()
  expect(linkText).toBeTruthy()
  expect(getByText('Vodafone')).toBeTruthy()
  expect(getByText('Edite')).toBeTruthy()

  // important: we need to pass extra data, or react-router-native will crash while trying to access defaultPrevented attribute
  fireEvent(linkText, 'press', {})

  // navigation should have occured
  expect(history).toHaveLength(2)
  expect(history.entries[1].pathname).toEqual('/transfers/between-accounts')
})
