import { ConnectionAction } from '../actions/connection'
import { Connection, Institution } from 'src/types'

const INITIAL_STATE = {
  connections: [] as Connection[],
  institutions: [] as Institution[],
  request: null as Connection | null,
  notify: false
}

export type ConnectionState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: ConnectionAction): ConnectionState {
  switch (action.type) {
    case 'LOAD_INSTITUTIONS':
      return {
        ...state,
        institutions: action.payload
      }

    case 'LOAD_REQUEST':
      return {
        ...state,
        request: action.payload
      }

    case 'LOAD_CONNECTION':
      return {
        ...state,
        connections: [...state.connections.filter(connection => connection.id !== action.payload.id), action.payload]
      }

    case 'NOTIFY_CONNECTION':
      return {
        ...state,
        notify: true
      }

    case 'COMPLETE_CONNECTION':
      return {
        ...state,
        request: null,
        notify: false
      }

    default:
      return state
  }
}
