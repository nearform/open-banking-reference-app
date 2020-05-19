import React from 'react'

import { Actions } from './'
import { render, fireEvent, routerStubProps, i18nStubProps } from 'test-utils'

const stubProps = {
  ...i18nStubProps,
  ...routerStubProps,
  match: {
    params: { connection: 'connection-id' },
    ...routerStubProps.history.match
  }
}

test('Actions view when there are no actions', () => {
  const { getByText } = render(<Actions {...stubProps} actions={[]} />)

  // ensure we show that there are no action
  expect(getByText('actions:noActions')).toBeTruthy()

  // ensure that we have the ability to create templated actions
  expect(getByText('actions:scheduled')).toBeTruthy()
  expect(getByText('actions:conditional')).toBeTruthy()
})

test('Actions view when there are actions', () => {
  const { getByText, getAllByText } = render(
    <Actions
      {...stubProps}
      actions={[
        {
          start: 1588332120455,
          end: 1596533920532,
          to: {
            access_token: '************',
            account_number: '99999999',
            connection_name: 'Dave',
            hub_name: 'Anne-Marie',
            id: 'autorized-connection-id',
            invitation: 'Welcome Dave',
            sort_code: '030901',
            status: 'AUTHORIZED'
          },
          id: 'action-id',
          name: 'Stub Action',
          note: "Here's a top up to help!",
          amount: '100',
          type: 'conditional',
          selection: '1000000',
          customSelection: true,
          balanceMonitor: {
            connection_id: '123456789',
            id: '987654321',
            threshold: '1000000',
            status: 'RED' as const,
            payment: '1000'
          }
        }
      ]}
    />
  )

  // ensure the actions passed in are displayed
  expect(getByText('Stub Action')).toBeTruthy()

  // ensure the new action creation view is loaded with the correct connection id
  fireEvent.press(getAllByText('actions:title')[1])
  expect(stubProps.history.push).toHaveBeenCalledWith('/actions/connection-id/create')
})
