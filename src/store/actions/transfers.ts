import { Institution } from '../../types'

const SET_TRANSFER_AMOUNT = 'SET_TRANSFER_AMOUNT'
const SET_TRANFER_INSTITUTION = 'SET_TRANSFER_INSTITUTION'
const RESET_TRANSFER = 'RESET_TRANSFER'

export function setInstitution(institution: Institution) {
  return {
    type: SET_TRANFER_INSTITUTION,
    payload: institution
  } as const
}

export function setAmount(amount: string) {
  return {
    type: SET_TRANSFER_AMOUNT,
    payload: amount
  } as const
}

export function resetTransfer() {
  return {
    type: RESET_TRANSFER
  } as const
}

export type TransferAction = ReturnType<typeof setInstitution | typeof resetTransfer | typeof setAmount>
