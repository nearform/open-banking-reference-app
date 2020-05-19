import { ProvidersAction } from '../actions/providers'
import { Provider } from 'src/types'

const INITIAL_STATE = {
  lastUpdated: null as number | null,
  loading: false,
  providers: [] as Provider[]
}

export type ProvidersState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: ProvidersAction): ProvidersState {
  switch (action.type) {
    case 'LOAD_PROVIDERS':
      return {
        ...state,
        loading: true
      }
    case 'LOADED_PROVIDERS':
      const newProviders = action.payload.map(({ name, title, ...provider }) => {
        return {
          title: name || title,
          ...provider
        }
      })
      return {
        ...state,
        lastUpdated: Date.now(),
        loading: false,
        providers: newProviders
      }
    default:
      return state
  }
}
