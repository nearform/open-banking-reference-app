import { ServiceAction } from '../actions/service'

const initial = {
  available: false,
  checking: false
}

export type ServiceState = typeof initial

export default function (state = initial, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'SERVICE_QUERY_STATUS':
      return {
        ...state,
        checking: true
      }

    case 'SERVICE_UPDATE_STATUS':
      return {
        ...state,
        checking: false,
        available: action.available
      }

    default:
      return state
  }
}
