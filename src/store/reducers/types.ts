import { AccountsState } from 'store/reducers/accounts'
import { ConnectionState } from 'store/reducers/connection'
import { TransfersState } from 'store/reducers/transfers'
import { SessionState } from 'store/reducers/session'
import { ProvidersState } from 'store/reducers/providers'
import { AssistantState } from 'store/reducers/assistant'
import { UIState } from 'store/reducers/ui'
import { ServiceState } from 'store/reducers/service'
import { ActionsState } from 'store/reducers/actions'

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
