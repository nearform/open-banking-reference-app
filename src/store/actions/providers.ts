import differenceInHours from 'date-fns/differenceInHours'

import { loadProviders as loadProvidersService } from '../../services/api'
import { Provider } from '../../types'
import { Dispatch, GetState } from '../'

const LOAD_PROVIDERS = 'LOAD_PROVIDERS'
const LOADED_PROVIDERS = 'LOADED_PROVIDERS'

export type ProvidersAction =
  | {
      type: typeof LOAD_PROVIDERS
    }
  | {
      type: typeof LOADED_PROVIDERS
      payload: Provider[]
    }

export function loadProviders(force?: boolean) {
  return async (dispatch: Dispatch<ProvidersAction>, getState: GetState) => {
    const {
      providers: { lastUpdated }
    } = getState()
    if (
      !force &&
      // only reload providers if it's been at least 24 hours
      lastUpdated &&
      differenceInHours(Date.now(), lastUpdated) < 24
    ) {
      return
    }
    if (force) {
      dispatch({ type: LOADED_PROVIDERS, payload: [] })
    }
    const payload = await loadProvidersService()
    dispatch({ type: LOADED_PROVIDERS, payload })
  }
}
