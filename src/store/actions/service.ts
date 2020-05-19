import { Dispatch } from '../'
import urls from '../../urls'

const SERVICE_QUERY_STATUS = 'SERVICE_QUERY_STATUS'
const SERVICE_UPDATE_STATUS = 'SERVICE_UPDATE_STATUS'

export type ServiceAction =
  | {
      type: typeof SERVICE_QUERY_STATUS
    }
  | {
      type: typeof SERVICE_UPDATE_STATUS
      available: boolean
    }

export function queryStatus() {
  return function (dispatch: Dispatch<ServiceAction>) {
    dispatch({ type: SERVICE_QUERY_STATUS })

    return fetch(`${urls.api}/health-check`)
      .then(res => dispatch({ type: SERVICE_UPDATE_STATUS, available: res.ok }))
      .catch(() => dispatch({ type: SERVICE_UPDATE_STATUS, available: false }))
  }
}
