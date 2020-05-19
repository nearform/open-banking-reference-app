import { Reducer } from 'react'
import accounts, { AccountsState } from './accounts'
import connection, { ConnectionState } from './connection'
import providers, { ProvidersState } from './providers'
import transfers, { TransfersState } from './transfers'
import session, { SessionState } from './session'
import assistant, { AssistantState } from './assistant'
import ui, { UIState } from './ui'
import service, { ServiceState } from './service'
import actions, { ActionsState } from './actions'

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

export interface AppState {
  accounts: AccountsState
  connection: ConnectionState
  transfers: TransfersState
  session: SessionState
  providers: ProvidersState
  assistant: AssistantState
  ui: UIState
  service: ServiceState
  actions: ActionsState
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

export default combineReducers<AppState>(reducers)
