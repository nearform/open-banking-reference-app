import {
  createConnection as createConnectionService,
  loadConnection as loadConnectionService,
  loadInstitutions as loadInstitutionsService
} from '../../services/api'
import { Dispatch, GetState } from '../'
import { Connection, Institution } from '../../types'

export interface ConnectionRequestBody {
  hub_user_id: string
  hub_name: string
  connection_name: string
  phone_number?: string
  email?: string
  invitation: string | undefined
}

export interface ConnectionResponse {
  id: string
}

const LOAD_CONNECTION = 'LOAD_CONNECTION'
const LOAD_INSTITUTIONS = 'LOAD_INSTITUTIONS'
const LOAD_REQUEST = 'LOAD_REQUEST'
const NOTIFY_CONNECTION = 'NOTIFY_CONNECTION'
const COMPLETE_CONNECTION = 'COMPLETE_CONNECTION'

export function completeConnection() {
  return {
    type: COMPLETE_CONNECTION
  } as const
}

export function notifyConnection() {
  return {
    type: NOTIFY_CONNECTION
  } as const
}

export type ConnectionAction =
  | ReturnType<typeof completeConnection>
  | ReturnType<typeof notifyConnection>
  | {
      type: typeof LOAD_CONNECTION
      payload: Connection
    }
  | {
      type: typeof LOAD_REQUEST
      payload: Connection
    }
  | {
      type: typeof LOAD_INSTITUTIONS
      payload: Institution[]
    }

export function loadRequest(id: string) {
  return async (dispatch: Dispatch<ConnectionAction>) => {
    const connection = await loadConnectionService(id)

    dispatch({ type: LOAD_REQUEST, payload: connection })
  }
}

export function loadInstitutions() {
  return async (dispatch: Dispatch<ConnectionAction>) => {
    const institutions = await loadInstitutionsService()

    dispatch({ type: LOAD_INSTITUTIONS, payload: institutions })
  }
}

export function checkConnections() {
  return async (dispatch: Dispatch<ConnectionAction>, getState: GetState) => {
    const {
      connection: { connections }
    } = getState()

    for (const connection of connections) {
      if (connection.status !== 'AUTHORIZED') {
        const response = await loadConnectionService(connection.id)

        dispatch({ type: LOAD_CONNECTION, payload: response })
      }
    }
  }
}

export function createConnection(
  options: ConnectionRequestBody
): (dispatch: Dispatch<ConnectionAction>) => Promise<ConnectionResponse> {
  return async (dispatch: Dispatch<ConnectionAction>) => {
    const response = await createConnectionService(options)
    const connection = await loadConnectionService(response.id)

    dispatch({ type: LOAD_CONNECTION, payload: connection })

    return response
  }
}
