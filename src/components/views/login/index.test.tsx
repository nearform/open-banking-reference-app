import React from 'react'
import { interpret, Interpreter } from 'xstate'

import { Login } from './'
import { AuthenticationSchema, AuthenticationEvent, authenticationMachine } from 'utils/machines/authenticationMachine'
import { render, fireEvent, waitForElement } from 'test-utils'

let authenticationService: Interpreter<{}, AuthenticationSchema, AuthenticationEvent>

beforeEach(() => {
  authenticationService = interpret(authenticationMachine).start()
})

afterEach(() => {
  authenticationService.stop()
})

// @TODO - need to figure out how to fix the `act(() => {})` warnings
test('Login view - correct pin', async () => {
  const { getByText, queryByTestId, history } = render(<Login authenticationService={authenticationService} />)

  // wait for view to be rendered
  await waitForElement(() => queryByTestId('unlock'))
  // enter correct pin
  const correctPin = '987654'
  correctPin.split('').forEach((key: string) => fireEvent.press(getByText(key)))

  // wait for overview to be rendered
  await waitForElement(() => queryByTestId('overview'))

  // ensure we're sent to overview page
  expect(history).toHaveLength(2)
  expect(history.entries[1].pathname).toEqual('/overview')
})

test('Login view - correct pin with characters entered incorrectly', async () => {
  const { getByText, queryByTestId, getByTestId, history } = render(
    <Login authenticationService={authenticationService} />
  )

  // wait for view to be rendered
  await waitForElement(() => queryByTestId('unlock'))

  // enter correct pin but enter a couple of characters wrong and delete them
  fireEvent.press(getByText('9'))
  expect(queryByTestId('unlock')).toBeFalsy()
  fireEvent.press(getByText('2'))
  fireEvent.press(getByTestId('delete'))
  fireEvent.press(getByText('8'))
  fireEvent.press(getByText('7'))
  fireEvent.press(getByText('1'))
  fireEvent.press(getByTestId('delete'))
  fireEvent.press(getByText('6'))
  fireEvent.press(getByText('5'))
  fireEvent.press(getByText('4'))

  // wait for overview to be rendered
  await waitForElement(() => queryByTestId('overview'))

  // ensure we're sent to overview page
  expect(history).toHaveLength(2)
  expect(history.entries[1].pathname).toEqual('/overview')
})

// @TODO - this test is complaining about an update needing to be wrapped in `act(() => {})`, need to figure out why
test('Login view - incorrect pin', async () => {
  const { getByText, queryByTestId, history } = render(<Login authenticationService={authenticationService} />)

  // wait for view to be rendered
  await waitForElement(() => queryByTestId('unlock'))

  // enter incorrect pin
  const incorrectPin = '987165'
  incorrectPin.split('').forEach((key: string) => fireEvent.press(getByText(key)))

  // wait for view to be rendered
  await waitForElement(() => queryByTestId('unlock'))

  // ensure we're not sent to overview page
  expect(history).toHaveLength(1)
  expect(queryByTestId('unlock')).toBeTruthy()
})

// @TODO - need to figure out a way to mock the services or AsyncStorage to represent a
// pin already being stored
test.skip('Login view - when previously logged in', async () => {
  const { history } = render(<Login authenticationService={authenticationService} />)

  // ensure we're redirected when our logged in state has been persisted
  expect(history).toHaveLength(2)
  expect(history.entries[1].pathname).toEqual('/overview')
})
