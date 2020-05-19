import React from 'react'

import Overview from './'
import { render, i18nStubProps, routerStubProps } from 'test-utils'

const stubProps = {
  ...i18nStubProps,
  ...routerStubProps,
  loadAccounts: jest.fn()
}

test('Overview view', () => {
  const { getByTestId, getByText } = render(
    <Overview
      activeAccount={'some-id'}
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
      providers={{
        lastUpdated: 15885996830000,
        loading: false,
        providers: [
          {
            title: 'Stub Provider',
            id: 1,
            version: '0.0.1',
            logo: 'stub-provider'
          }
        ]
      }}
      session={{
        authorizationUrl: 'localhost:3000',
        code: '123',
        loading: false,
        pin: '987654',
        tokens: {
          key: {
            access_token: 'abc123',
            expires_in: 3600,
            id_token: '999999',
            token_type: 'access',
            scope: '*',
            refresh_token: 'xyz987'
          }
        }
      }}
      {...stubProps}
    />
  )

  // ensure the overview view is displayed
  expect(getByTestId('overview')).toBeTruthy()

  // ensure header is displaying correct details
  expect(getByText('Current Account')).toBeTruthy()
  expect(getByText('£9295.55')).toBeTruthy()
  // ensure quick action buttons are disabled
  expect(getByText('accounts:transfer')).toBeDisabled()
  expect(getByText('accounts:actions')).toBeDisabled()
})
