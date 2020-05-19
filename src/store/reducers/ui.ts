import { UIAction } from '../actions/ui'

const INITIAL_STATE = {
  showSidebar: false
}

export type UIState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        showSidebar: !state.showSidebar
      }

    default:
      return state
  }
}
