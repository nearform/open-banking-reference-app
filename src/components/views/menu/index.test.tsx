import React from 'react'

import { Menu } from './'
import { render, fireEvent } from 'test-utils'
import { interpret, Interpreter } from 'xstate'
import { AuthenticationEvent, authenticationMachine, AuthenticationSchema } from 'utils/machines'

let authenticationService: Interpreter<{}, AuthenticationSchema, AuthenticationEvent>

beforeEach(() => {
  authenticationService = interpret(authenticationMachine).start()
})

afterEach(() => {
  authenticationService.stop()
})

test('Menu view', () => {
  const { getByTestId, getAllByTestId } = render(<Menu authenticationService={authenticationService} />)

  // ensure we're showing 1 selected menu item by default
  expect(getAllByTestId('menu-overview-item')?.length).toBe(1)

  // add more selected menu items
  fireEvent.press(getByTestId('edit-button'))
  fireEvent(getAllByTestId('checkbox')[0], 'onChange', 'menuItems:account:item1', true)
  fireEvent(getAllByTestId('checkbox')[2], 'onChange', 'menuItems:account:item3', true)

  // ensure the added menu items are displayed in the selected section
  expect(getAllByTestId('menu-overview-item')?.length).toBe(3)
})
