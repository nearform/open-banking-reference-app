import React from 'react'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'

import { App } from './app'
import { render, routerStubProps, waitOnTick } from './test-utils'
import { Connection, Action, Institution, BalanceMonitor } from 'src/types'

// We need to mock expo because jest can not spy on Notification methods: it fails with message.
jest.mock('expo', () => ({
  Notifications: {
    presentLocalNotificationAsync: jest.fn()
  }
}))

const { REACT_APP_PIN: pin } = process.env

const stubProps = {
  handleTokens: jest.fn(),
  loadProviders: jest.fn(),
  savePin: jest.fn(),
  checkActions: jest.fn(),
  checkConnections: jest.fn(),
  setTransferAmount: jest.fn(),
  ...routerStubProps
}

const connection: Connection = {
  access_token: '************',
  account_number: '99999999',
  connection_name: 'Dave',
  hub_name: 'Anne-Marie',
  id: 'autorized-connection-id',
  invitation: 'Welcome Dave',
  sort_code: '030901',
  status: 'PENDING'
}

const institution: Institution = {
  full_name: 'Stub Institution',
  id: 'stubinstitution',
  media: [
    {
      source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
      type: 'icon' as const
    },
    {
      source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
      type: 'logo' as const
    }
  ],
  name: 'S Inst'
}

beforeEach(() => jest.resetAllMocks())

test('Redirection to connect/notify on new connection', async () => {
  jest.spyOn(Permissions, 'askAsync').mockResolvedValue({
    status: Permissions.PermissionStatus.DENIED,
    granted: false,
    canAskAgain: false,
    expires: 'never',
    permissions: {}
  })

  const { getByText, rerender } = render(
    <App
      {...stubProps}
      actions={[]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />,
    {
      route: `/connect/${connection.id}?consent=123456`,
      state: {
        connection: {
          request: connection,
          connections: [connection],
          institutions: [institution],
          notify: false
        }
      }
    }
  )

  // ensure we're on the connection confirmation message
  expect(getByText('connect:step4:message')).toBeTruthy()

  await waitOnTick()

  rerender(
    <App
      {...stubProps}
      actions={[]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[
        {
          ...connection,
          status: 'AUTHORIZED'
        }
      ]}
    />
  )

  await waitOnTick()

  // ensure we've been redirected to connect notify view
  expect(stubProps.history.push).toHaveBeenCalledWith(`/connect/notify/${connection.id}`)
  expect(stubProps.history.push).toHaveBeenCalledTimes(1)
})

const action: Action = {
  id: 'top-up-action',
  name: 'Auto top-up',
  type: 'conditional',
  to: connection,
  amount: '150',
  selection: '100000',
  customSelection: true,
  balanceMonitor: {
    id: 'ab742c456',
    connection_id: connection.id,
    threshold: '100000',
    payment: 'whatever',
    status: 'GREEN'
  }
}

test('Triggers notification on low balance for new actions', async () => {
  jest.spyOn(Permissions, 'askAsync').mockResolvedValue({
    status: Permissions.PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
    permissions: {}
  })

  const { getByText, rerender } = render(
    <App
      {...stubProps}
      actions={[]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />,
    {
      route: '/overview'
    }
  )

  // ensure we're on the overview page
  expect(getByText('overview:recentTransactions')).toBeTruthy()

  await waitOnTick()

  rerender(
    <App
      {...stubProps}
      actions={[
        {
          ...action,
          balanceMonitor: {
            ...action.balanceMonitor,
            status: 'RED'
          } as BalanceMonitor
        }
      ]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />
  )

  await waitOnTick()

  // ensure we've displayed the notification
  expect(Notifications.presentLocalNotificationAsync).toHaveBeenCalledWith({
    body: 'notifications:action:body',
    title: 'notifications:action:title',
    data: {
      url: `/transfers/${action.to.id}`
    },
    web: {
      tag: action.id,
      requireInteraction: true
    }
  })
  expect(Notifications.presentLocalNotificationAsync).toHaveBeenCalledTimes(1)
})

test('Triggers notification on low balance for existing actions', async () => {
  jest.spyOn(Permissions, 'askAsync').mockResolvedValue({
    status: Permissions.PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
    permissions: {}
  })

  const { getByText, rerender } = render(
    <App
      {...stubProps}
      actions={[action]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />,
    {
      route: '/overview'
    }
  )

  // ensure we're on the overview page
  expect(getByText('overview:recentTransactions')).toBeTruthy()

  await waitOnTick()

  rerender(
    <App
      {...stubProps}
      actions={[
        {
          ...action,
          balanceMonitor: {
            ...action.balanceMonitor,
            status: 'RED'
          } as BalanceMonitor
        }
      ]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />
  )

  await waitOnTick()

  // ensure we've displayed the notification
  expect(Notifications.presentLocalNotificationAsync).toHaveBeenCalledWith({
    body: 'notifications:action:body',
    title: 'notifications:action:title',
    data: {
      url: `/transfers/${action.to.id}`
    },
    web: {
      tag: action.id,
      requireInteraction: true
    }
  })
  expect(Notifications.presentLocalNotificationAsync).toHaveBeenCalledTimes(1)
})

test('Does not triggers notification on unmodified balance', async () => {
  jest.spyOn(Permissions, 'askAsync').mockResolvedValue({
    status: Permissions.PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
    permissions: {}
  })

  const { getByText, rerender } = render(
    <App
      {...stubProps}
      actions={[action]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />,
    {
      route: '/overview'
    }
  )

  // ensure we're on the overview page
  expect(getByText('overview:recentTransactions')).toBeTruthy()

  await waitOnTick()

  rerender(
    <App
      {...stubProps}
      actions={[action]}
      session={{ pin: pin!, code: '', authorizationUrl: '', loading: false }}
      connections={[connection]}
    />
  )

  await waitOnTick()

  // ensure we didn't displayed notification
  expect(Notifications.presentLocalNotificationAsync).not.toHaveBeenCalled()
})
