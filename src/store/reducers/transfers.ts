import { TransferAction } from '../actions/transfers'
import { Institution } from 'src/types'

const INITIAL_STATE = {
  amount: '',
  institution: null as Institution | null
}

export type TransfersState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: TransferAction): TransfersState {
  switch (action.type) {
    case 'SET_TRANSFER_INSTITUTION':
      return {
        ...state,
        institution: action.payload
      }
    case 'SET_TRANSFER_AMOUNT':
      return {
        ...state,
        amount: action.payload
      }
    case 'RESET_TRANSFER':
      return {
        ...state,
        amount: '',
        institution: null
      }
    default:
      return state
  }
}
