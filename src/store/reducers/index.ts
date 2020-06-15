import { Reducer } from 'react'
import accounts from './accounts'
import connection from './connection'
import providers from './providers'
import transfers from './transfers'
import session from './session'
import assistant from './assistant'
import ui from './ui'
import service from './service'
import actions from './actions'
import { AppState } from './types'

const reducers = {
  accounts,
  connection,
  transfers,
  session,
  providers,
  assistant,
  ui,
  service,
  actions
}

export function combineReducers<TState extends {}>(reducers: { [P in keyof TState]: Reducer<any, any> }) {
  return (state: any = {}, action = {}): TState => {
    const nextState: any = {}
    for (const name in reducers) {
      nextState[name] = reducers[name](state[name], action)
    }
    return nextState
  }
}

export { AppState } from './types'

export default combineReducers<AppState>(reducers)
