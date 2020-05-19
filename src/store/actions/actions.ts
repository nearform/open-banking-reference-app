import { Action } from '../../types'
import { Dispatch, GetState } from '../'
import { createBalanceMonitor, loadBalanceMonitor, deleteBalanceMonitor } from '../../services/api'

const LOAD_ACTIONS = 'LOAD_ACTIONS'
const SELECT_ACTION = 'SELECT_ACTION'
const CREATE_ACTION = 'CREATE_ACTION'
const UPDATE_ACTION = 'UPDATE_ACTION'
const LOAD_ACTION = 'LOAD_ACTION'
const DELETE_ACTION = 'DELETE_ACTION'

export function selectAction(id: string) {
  return {
    type: SELECT_ACTION,
    payload: id
  } as const
}

export type ActionAction =
  | ReturnType<typeof selectAction>
  | {
      type: typeof LOAD_ACTIONS
      payload: Action[]
    }
  | {
      type: typeof CREATE_ACTION
      payload: Action
    }
  | {
      type: typeof UPDATE_ACTION
      payload: Action
    }
  | {
      type: typeof LOAD_ACTION
    }
  | {
      type: typeof DELETE_ACTION
      payload: Action
    }

export function createAction(action: Action) {
  return async (dispatch: Dispatch<ActionAction>) => {
    dispatch({
      type: LOAD_ACTION
    })

    if (action.type === 'conditional') {
      try {
        action.balanceMonitor = await createBalanceMonitor(action.to.id, action.selection, action.amount)
      } catch {
        // FIXME: proper error handling.
        // but we need to dispatch CREATE_ACTION, or state.actions.loading will always remain true
      }
    }

    dispatch({
      type: CREATE_ACTION,
      payload: action
    })
  }
}

export function updateAction(action: Action) {
  return async (dispatch: Dispatch<ActionAction>) => {
    dispatch({
      type: LOAD_ACTION
    })

    if (action.balanceMonitor) {
      try {
        await deleteBalanceMonitor(action.balanceMonitor)

        action.balanceMonitor = await createBalanceMonitor(action.to.id, action.selection, action.amount)
      } catch {
        // FIXME: proper error handling.
        // but we need to dispatch UPDATE_ACTION, or state.actions.loading will always remain true
      }
    }

    dispatch({
      type: UPDATE_ACTION,
      payload: action
    })
  }
}

export function deleteAction(action: Action) {
  return async (dispatch: Dispatch<ActionAction>) => {
    dispatch({
      type: DELETE_ACTION,
      payload: action
    })
  }
}

export function checkActions() {
  return async (dispatch: Dispatch<ActionAction>, getState: GetState) => {
    const {
      actions: { actions }
    } = getState()

    for (const action of actions) {
      if (action.balanceMonitor) {
        action.balanceMonitor = await loadBalanceMonitor(action.balanceMonitor.id)

        dispatch({
          type: UPDATE_ACTION,
          payload: action
        })
      }
    }
  }
}
