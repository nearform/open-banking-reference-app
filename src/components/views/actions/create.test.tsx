import React from 'react'

import { CreateAction } from './create'
import { render, fireEvent, routerStubProps } from 'test-utils'

const stubProps = {
  ...routerStubProps,
  match: {
    params: { id: 'action-id' },
    ...routerStubProps.history.match
  },
  loading: false,
  createAction: jest.fn(),
  deleteAction: jest.fn(),
  updateAction: jest.fn()
}

test('Create action view - create new action', () => {
  const { getByText, queryByText, getByPlaceholder } = render(
    <CreateAction
      {...stubProps}
      activeAction={undefined}
      connection={{
        access_token: '************',
        account_number: '99999999',
        connection_name: 'Dave',
        hub_name: 'Anne-Marie',
        id: 'autorized-connection-id',
        invitation: 'Welcome Dave',
        sort_code: '030901',
        status: 'AUTHORIZED'
      }}
    />
  )

  // ensure the create action button is disabled until the form is filled in
  expect(getByText('actions:create:create')).toBeDisabled()

  // ensure we can't delete an action which hasn't been created
  expect(queryByText('actions:create:delete')).toBeFalsy()

  // ensure the action name is empty
  expect(getByPlaceholder('actions:create:name')).toBeEmpty()

  // ensure the action note is empty
  expect(getByPlaceholder('actions:create:note')).toBeEmpty()

  // ensure the action amount is empty
  expect(getByPlaceholder('actions:create:amountPlaceholder')).toBeEmpty()

  // ensure the connected account is displayed
  expect(getByText('Dave')).toBeTruthy()

  // complete form
  fireEvent.changeText(getByPlaceholder('actions:create:name'), 'Sample action name')
  fireEvent.changeText(getByPlaceholder('actions:create:note'), 'Sample action note')
  fireEvent.changeText(getByPlaceholder('actions:create:amountPlaceholder'), '100')
  fireEvent.press(getByText('50'))
  fireEvent.changeText(getByPlaceholder('actions:create:custom'), '5000')

  // ensure form fields are completed
  expect(getByPlaceholder('actions:create:name').props.value).toBe('Sample action name')
  expect(getByPlaceholder('actions:create:note').props.value).toBe('Sample action note')
  expect(getByPlaceholder('actions:create:amountPlaceholder').props.value).toBe('100')
  expect(getByPlaceholder('actions:create:custom').props.value).toBe('5000')

  // ensure create action button is enabled
  expect(getByText('actions:create:create')).toBeEnabled()

  // ensure createAction is fired
  fireEvent.press(getByText('actions:create:create'))
  expect(stubProps.createAction).toHaveBeenCalled()
})

test('Create action view - edit existing action', () => {
  const { getByText, getByPlaceholder } = render(
    <CreateAction
      {...stubProps}
      activeAction={{
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
      }}
      connection={{
        access_token: '************',
        account_number: '99999999',
        connection_name: 'Dave',
        hub_name: 'Anne-Marie',
        id: 'autorized-connection-id',
        invitation: 'Welcome Dave',
        sort_code: '030901',
        status: 'AUTHORIZED'
      }}
    />
  )

  // ensure fields are populated with action values
  expect(getByText('actions:create:update')).toBeEnabled()
  expect(getByText('actions:create:delete')).toBeEnabled()
  expect(getByPlaceholder('actions:create:name').props.value).toBe('Stub Action')
  expect(getByPlaceholder('actions:create:note').props.value).toBe("Here's a top up to help!")
  expect(getByPlaceholder('actions:create:amountPlaceholder').props.value).toBe('100')
  expect(getByText('Dave')).toBeTruthy()

  // ensure updateAction is fired
  fireEvent.press(getByText('actions:create:update'))
  expect(stubProps.updateAction).toHaveBeenCalled()
})

test('Create action view - delete existing action', () => {
  const { getByText, getByPlaceholder } = render(
    <CreateAction
      {...stubProps}
      activeAction={{
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
      }}
      connection={{
        access_token: '************',
        account_number: '99999999',
        connection_name: 'Dave',
        hub_name: 'Anne-Marie',
        id: 'autorized-connection-id',
        invitation: 'Welcome Dave',
        sort_code: '030901',
        status: 'AUTHORIZED'
      }}
    />
  )

  // ensure fields are populated with action values
  expect(getByText('actions:create:update')).toBeEnabled()
  expect(getByText('actions:create:delete')).toBeEnabled()
  expect(getByPlaceholder('actions:create:name').props.value).toBe('Stub Action')
  expect(getByPlaceholder('actions:create:note').props.value).toBe("Here's a top up to help!")
  expect(getByPlaceholder('actions:create:amountPlaceholder').props.value).toBe('100')
  expect(getByText('Dave')).toBeTruthy()

  // ensure deleteAction is fired
  fireEvent.press(getByText('actions:create:delete'))
  expect(stubProps.deleteAction).toHaveBeenCalled()
})
