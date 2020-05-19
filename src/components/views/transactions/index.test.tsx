import React from 'react'

import { Transactions } from './'
import { render, i18nStubProps, routerStubProps } from 'test-utils'

const stubProps = {
  ...i18nStubProps,
  ...routerStubProps
}

test('Transactions view', () => {
  const { getByText } = render(
    <Transactions
      account={{
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
      }}
      {...stubProps}
    />
  )

  // ensure the transactions view is displayed
  expect(getByText('transactions:title')).toBeTruthy()

  // ensure transaction values are displayed
  expect(getByText('Bank Transfer')).toBeTruthy()
  expect(getByText('3rd Nov 2012')).toBeTruthy()
  expect(getByText('GBP')).toBeTruthy()
})
