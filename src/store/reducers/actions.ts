import { addMonths, getTime } from 'date-fns'
import { ActionAction } from '../actions/actions'
import { Action } from '../../types'

const INITIAL_STATE = {
  active: '',
  actions: [] as Action[],
  loading: false
}

export type ActionsState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: ActionAction): ActionsState {
  switch (action.type) {
    case 'LOAD_ACTION':
      return {
        ...state,
        loading: true
      }

    case 'CREATE_ACTION':
      return {
        ...state,
        actions: [
          ...state.actions,
          {
            start: Date.now(),
            end: getTime(addMonths(Date.now(), 3)),
            ...action.payload
          }
        ],
        loading: false
      }

    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map(item => {
          if (item.id !== action.payload.id) {
            return item
          }

          return {
            ...item,
            ...action.payload,
            end: getTime(addMonths(Date.now(), 3))
          }
        }),
        loading: false
      }

    case 'DELETE_ACTION': {
      return {
        ...state,
        actions: state.actions.filter(item => item.id !== action.payload.id),
        loading: false
      }
    }

    default:
      return state
  }
}
