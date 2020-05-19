import { SessionAction } from '../actions/session'
import { Token } from 'src/types'

const INITIAL_STATE = {
  authorizationUrl: '',
  code: '',
  loading: false,
  pin: ''
}

export type SessionState = typeof INITIAL_STATE & {
  tokens?: { [key: string]: Token }
}

export default function (state: SessionState = INITIAL_STATE, action: SessionAction) {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...state,
        loading: true,
        authorizationUrl: action.payload
      }
    case 'SESSION_TOKENS':
      return {
        ...state,
        loading: false,
        tokens: action.payload
      }
    case 'SAVE_PIN':
      return {
        ...state,
        pin: action.payload
      }
    default:
      return state
  }
}
