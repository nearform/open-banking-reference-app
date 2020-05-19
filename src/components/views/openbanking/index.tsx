import React, { useEffect, useMemo } from 'react'
import { Linking } from 'react-native'

import { connect, AppState, Dispatch } from 'store'
import { useLocation, useHistory } from 'routing'
import { addOpenbankingAccount } from 'store/actions/accounts'
import * as session from 'store/actions/session'
import { loadProviders as loadProvidersAction } from 'store/actions/providers'
import { loadAuthorizationURL } from 'services/api'

import Step1 from './step1'

import { Provider } from 'src/types'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

export const Openbanking: React.FC<MapStateToProps & MapDispatchToProps> = ({
  providers,
  loadProviders,
  initSession,
  loadTokens,
  addOpenbankingAccount
}) => {
  const { hash } = useLocation()
  const history = useHistory()
  const code = useMemo(() => (hash ? new URLSearchParams(hash.slice(1)).get('code') : null), [hash])

  useEffect(() => {
    if (code) {
      const processCode = async () => {
        await loadTokens(code)
        // load new account and select it.
        addOpenbankingAccount()
        history.push('/overview')
      }
      processCode()
    }
    // This effect HAS TO run only on ccode and history changes.
    // Unfortunately, because of the nature of our mapsDispatchToProps,
    // loadTokens and addOpenbankingAccount are changing on every render, and we can not include them
    // in that list
  }, [code, history]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinue = async (e: Provider) => {
    if (e && e.version && e.id) {
      const authorizationUrl = await loadAuthorizationURL(e.id)
      if (!authorizationUrl) {
        return
      }
      initSession(authorizationUrl, e.id)
      if (window && window.location) {
        window.location.href = authorizationUrl
      } else {
        Linking.openURL(authorizationUrl)
      }
    }
  }

  // Note: for now there is only one step: showing different providers (bank), and selecting one.
  // Users will be redirected to the bank website (handleContinue).
  // When the bank will redirect here, the effect will pick-up the code, add new account,
  // and redirect to overview.
  return <Step1 loadProviders={loadProviders} onContinue={handleContinue} providers={providers} />
}

const mapStateToProps = (state: AppState) => ({
  account: state.accounts.accounts[state.accounts.active],
  providers: state.providers.providers
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addOpenbankingAccount: () => dispatch(addOpenbankingAccount()),
  initSession: (authUrl: string, providerId: string | number) => session.initSession(authUrl, providerId)(dispatch),
  loadProviders: () => dispatch(loadProvidersAction(true)),
  loadTokens: (code: string) => dispatch(session.loadTokens(code))
})

export default connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(Openbanking)
