import React from 'react'

import { Accounts } from './'
import { render, fireEvent, routerStubProps } from 'test-utils'

const stubProps = {
  loadAccounts: jest.fn(),
  closeMenu: jest.fn(),
  selectAccount: jest.fn(),
  ...routerStubProps
}

test('Accounts view', () => {
  const { getAllByTestId, getByText } = render(
    <Accounts
      {...stubProps}
      active="some-id"
      accounts={[
        {
          id: 'some-id',
          accountNumber: 'AB123456',
          balance: '100.00',
          currency: 'GBP',
          provider: 1,
          title: 'Savings Account',
          type: 'Personal',
          transactions: [
            {
              amount: '-150',
              currency: 'GBP',
              date: '2012-11-03T09:30:39.919Z',
              icon: 'example',
              title: 'Bank Transfer'
            }
          ]
        },
        {
          id: 'some-other-id',
          accountNumber: 'XYZ98765',
          balance: '-100.00',
          currency: 'EUR',
          provider: 2,
          title: 'Current Account',
          type: 'Business'
        }
      ]}
      connections={[
        {
          access_token: '************',
          account_number: '',
          connection_name: 'Sally',
          hub_name: 'Anne-Marie',
          id: 'connection-id',
          invitation: 'Hi Sally!',
          sort_code: '',
          status: 'PENDING'
        }
      ]}
      providers={[
        {
          title: 'Stub Provider',
          id: 1,
          version: '0.0.1',
          logo: 'stub-provider'
        }
      ]}
    />
  )

  // ensure we're on the right page and showing expected accounts
  expect(getByText('Choose an account')).toBeTruthy()
  expect(getByText('Savings Account')).toBeTruthy()
  expect(getByText('Current Account')).toBeTruthy()
  expect(getByText('Sally')).toBeTruthy()

  // ensure that the accounts are reloaded when tapping the load icon
  fireEvent(getAllByTestId('icon-button')[0], 'action')
  expect(stubProps.loadAccounts).toHaveBeenCalled()

  // ensure menu is closed when tapping the 'X'
  fireEvent(getAllByTestId('icon-button')[1], 'action')
  expect(stubProps.closeMenu).toHaveBeenCalled()

  // ensure we're sent to the right page when tapping the add account button
  fireEvent.press(getByText('Add Open Banking Account'))
  expect(stubProps.closeMenu).toHaveBeenCalled()
  expect(stubProps.history.push).toHaveBeenCalledWith('/openbanking')
})
