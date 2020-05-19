import React from 'react'

import { Notify } from './notify'
import { render, fireEvent, i18nStubProps, routerStubProps } from 'test-utils'

const connection = {
  access_token: '************',
  account_number: '99999999',
  connection_name: 'Dave',
  hub_name: 'Anne-Marie',
  id: 'autorized-connection-id',
  invitation: 'Welcome Dave',
  sort_code: '030901',
  status: 'AUTHORIZED'
}

test('Notify view', async () => {
  const { getByText } = render(
    <Notify
      {...i18nStubProps}
      {...routerStubProps}
      connections={[connection]}
      match={
        {
          params: { id: connection.id }
        } as any
      }
    />
  )

  const button = getByText('connect:notify:action')

  // ensure view is displayed
  expect(getByText('connect:notify:title')).toBeTruthy()
  expect(button).toBeTruthy()

  // tap to next step
  fireEvent.press(button)

  expect(routerStubProps.history.push).toHaveBeenCalledWith(`/actions/${connection.id}`)
  expect(routerStubProps.history.push).toHaveBeenCalledTimes(1)
})
