import { AsyncStorage } from 'react-native'
import { loadTokens as loadTokensService } from '../../services/api'
import { GetState, Dispatch } from '../index'
import { SessionState } from '../reducers/session'
import { completeConnection } from './connection'

const INIT_SESSION = 'INIT_SESSION'
const SAVE_PIN = 'SAVE_PIN'
const SESSION_TOKENS = 'SESSION_TOKENS'

export function initSession(payload: string, provider: string | number) {
  return async (dispatch: Dispatch<SessionAction>) => {
    // there is currently no way of knowing which provider has redirected
    // back to the app. So set in localstorage to catch after redirect
    await AsyncStorage.setItem('@PolarisBank:redirect-provider', provider.toString())
    return dispatch({
      type: INIT_SESSION,
      payload
    } as const)
  }
}

export function handleTokens(payload: SessionState['tokens']) {
  return {
    type: SESSION_TOKENS,
    payload
  } as const
}

export type SessionAction =
  | {
      type: typeof INIT_SESSION
      payload: string
    }
  | ReturnType<typeof handleTokens>
  | {
      type: typeof SAVE_PIN
      payload: string
    }

export function loadTokens(code: string) {
  return async (dispatch: Dispatch<SessionAction | ReturnType<typeof completeConnection>>, getState: GetState) => {
    const provider = await AsyncStorage.getItem('@PolarisBank:redirect-provider')
    if (!provider) {
      return
    }
    const {
      session: { tokens = {} }
    } = getState()
    const providerTokens = await loadTokensService(code, provider)
    if (providerTokens) {
      tokens[provider] = providerTokens
    }
    if (tokens) {
      AsyncStorage.setItem('@PolarisBank:tokens', JSON.stringify(tokens))
      await AsyncStorage.removeItem('@PolarisBank:redirect-provider')
      dispatch(handleTokens(tokens))
    }
  }
}
