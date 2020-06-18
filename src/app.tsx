import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useMachine } from '@xstate/react'
import { compose, connect, AppState, Dispatch } from 'store'
import { Redirect, Route, Router, withRouter, RouteComponentProps } from 'routing'
import { Notifications } from 'expo'
import { EventSubscription } from 'fbemitter'
import * as Permissions from 'expo-permissions'
import { useTranslation } from 'react-i18next'
import 'services/i18n'
import useInterval from 'use-interval'

import Layout from 'components/templates/layout'
import Overview from 'components/views/overview'
import Transactions from 'components/views/transactions'
import Transfer from 'components/views/transfer'
import TransferBetweenAccounts from 'components/views/transfer/between-accounts'
import Login from 'components/views/login'
import Menu from 'components/views/menu'
import Messages from 'components/views/messages'
import Openbanking from 'components/views/openbanking'
import Connect from 'components/views/connect'
import ConnectNotify from 'components/views/connect/notify'
import OpenbankingInvite from 'components/views/openbanking/invite'
import Actions from 'components/views/actions'
import CreateAction from 'components/views/actions/create'
import IconPlayground from 'components/atoms/icons/Playground'

import * as actionActions from 'store/actions/actions'
import * as connectionActions from 'store/actions/connection'
import * as providerActions from 'store/actions/providers'
import * as sessionActions from 'store/actions/session'
import * as transferActions from 'store/actions/transfers'
import { loginRoutes } from 'constants/login-routes'

import { usePrevious } from 'utils/hooks/usePrevious'
import { Connection, Action } from 'src/types'
import { authenticationMachine, AuthenticationState } from 'utils/machines'

type Tokens = AppState['session']['tokens']

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

type Props = MapStateToProps & MapDispatchToProps & RouteComponentProps

export const App: React.FC<Props> = ({
  checkActions,
  checkConnections,
  handleTokens,
  loadProviders,
  history,
  actions,
  connections,
  setTransferAmount,
  location: { pathname }
}) => {
  const { t } = useTranslation()
  const [loadProvidersCalled, setLoadProvidersCalled] = useState(false)

  // Initialize previous actions & connextions with value provided on mount
  // This prevents to show notifications on every page refresh.
  // They will be shown only when actions array is mutated
  const previousConnections = usePrevious<Connection[]>(connections, true)
  const previousActions = usePrevious<Action[]>(actions, true)
  const [current, , service] = useMachine(authenticationMachine)

  useInterval(() => {
    checkActions()
    checkConnections()
  }, Number(process.env.REACT_APP_POLL_INTERVAL))

  useEffect(() => {
    // Uncomment to force login screen on `/` route
    // AsyncStorage.clear()

    let notificationListener: EventSubscription | null
    StatusBar.setBarStyle('light-content')

    const processToken = async () => {
      let tokens: Tokens | null = null

      if (process.env.REACT_APP_DEFAULT_TOKEN) {
        tokens = {
          6: {
            access_token: process.env.REACT_APP_DEFAULT_TOKEN,
            expires_in: 0,
            id_token: '',
            refresh_token: '',
            scope: '',
            token_type: 'Bearer'
          }
        }
      }

      try {
        const tokensFromStorage = await AsyncStorage.getItem('@PolarisBank:tokens')
        if (tokensFromStorage) {
          tokens = JSON.parse(tokensFromStorage)
        }
      } catch (_) {}

      if (tokens) {
        handleTokens(tokens)
      }
    }

    const setNotificationListener = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)

      notificationListener =
        status === 'granted'
          ? Notifications.addListener(notification => {
              if (notification.data && notification.data.url) {
                history.push(notification.data.url)
              }
            })
          : null
    }

    processToken()
    setNotificationListener()

    return () => {
      if (notificationListener) {
        notificationListener.remove()
      }
    }
    // this useEffect for FC mount/unmount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loadProvidersCalled) {
      setLoadProvidersCalled(true)
      loadProviders()
    }

    for (const { status, id } of connections) {
      const previousConnection = previousConnections?.find(previous => id === previous.id)

      if (status === 'AUTHORIZED' && previousConnection && previousConnection?.status !== 'AUTHORIZED') {
        history.push(`/connect/notify/${id}`)
      }
    }

    const getPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)

      if (status === 'granted') {
        for (const { id, amount, to, selection, balanceMonitor } of actions) {
          const previousAction = previousActions?.find(previous => id === previous.id)

          if (balanceMonitor?.status === 'RED' && previousAction?.balanceMonitor?.status !== 'RED') {
            setTransferAmount(amount)

            Notifications.presentLocalNotificationAsync({
              title: t('notifications:action:title'),
              body: t('notifications:action:body', {
                name: to.connection_name,
                threshold: selection,
                currency: 'GBP'
              }),
              data: {
                _webPath: pathname,
                url: `/transfers/${to.id}`
              },
              web: {
                requireInteraction: true,
                tag: id
              }
            })
          }
        }
      }
    }

    getPermissions()
    // This effect must only run when connections, actions and providers have changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadProvidersCalled, actions, connections])

  if (
    current.matches(AuthenticationState.Unauthenticated) &&
    pathname !== '/login' &&
    !pathname.startsWith('/openbanking') &&
    !pathname.startsWith('/connect') &&
    !pathname.startsWith('/transfers')
  ) {
    return <Redirect to="/login" />
  }

  return (
    <Layout loginRoutes={loginRoutes}>
      {loginRoutes.map(path => (
        <Route exact hideNavBar path={path} render={() => <Login authenticationService={service} />} key={path} />
      ))}
      <Route exact path="/transfers" render={() => <Transfer />} />
      <Route exact path="/transfers/:id?" component={TransferBetweenAccounts} />
      <Route exact path="/openbanking/invite" render={() => <OpenbankingInvite />} />
      <Route exact path="/openbanking" render={() => <Openbanking />} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/overview" component={Overview} />
      <Route path="/messages" component={Messages} />
      <Route path="/menu" render={() => <Menu authenticationService={service} />} />
      <Route path="/actions/:connection/edit/:id" component={CreateAction} />
      <Route path="/actions/:connection/create/:type?" component={CreateAction} />
      <Route path="/actions/:connection" component={Actions} />
      <Route path="/icons" render={() => <IconPlayground />} />
      <Route path="/connect/notify/:id" component={ConnectNotify} />
      <Route path="/connect/:id" component={Connect} />
    </Layout>
  )
}

const mapStateToProps = (state: AppState) => ({
  actions: state.actions.actions,
  connections: state.connection.connections,
  session: state.session
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  handleTokens: (data: Tokens) => dispatch(sessionActions.handleTokens(data)),
  loadProviders: () => dispatch(providerActions.loadProviders()),
  checkActions: () => dispatch(actionActions.checkActions()),
  checkConnections: () => dispatch(connectionActions.checkConnections()),
  setTransferAmount: (amount: string) => dispatch(transferActions.setAmount(amount))
})

const EnhancedApp = compose(
  withRouter,
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)
)(App)

export default () => (
  <Router>
    <EnhancedApp />
  </Router>
)
