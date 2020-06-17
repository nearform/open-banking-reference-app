import { Machine, assign, sendParent } from 'xstate'

const { REACT_APP_PIN = '' } = process.env

export interface PinContext {
  pin: string
  pinLength: number
}

export enum PinState {
  Ready = 'ready',
  Inputting = 'inputting',
  Deleting = 'deleting',
  Submitting = 'submitting',
  Submitted = 'submitted'
}

export enum PinEventType {
  Input = 'input',
  Delete = 'delete',
  Submit = 'submit',
  Transient = ''
}

export type PinSchema = {
  states: { [key in PinState]: {} }
}

type InputEvent = { type: any; key: string }

export type PinEvent = InputEvent | { type: PinEventType.Delete } | { type: PinEventType.Submit }

export const pinMachine = Machine<PinContext, PinSchema, PinEvent>(
  {
    id: 'pin',
    initial: PinState.Ready,
    context: {
      pin: '',
      pinLength: REACT_APP_PIN.length
    },
    states: {
      [PinState.Ready]: {
        on: {
          [PinEventType.Input]: PinState.Inputting,
          [PinEventType.Delete]: PinState.Deleting
        }
      },
      [PinState.Inputting]: {
        entry: 'set',
        on: {
          [PinEventType.Transient]: [
            {
              cond: 'isPinCorrectLength',
              target: PinState.Submitting
            },
            {
              target: PinState.Ready
            }
          ]
        }
      },
      [PinState.Deleting]: {
        entry: 'delete',
        on: {
          [PinEventType.Transient]: [
            {
              target: PinState.Ready
            }
          ]
        }
      },
      [PinState.Submitting]: {
        on: {
          [PinEventType.Transient]: [
            {
              target: PinState.Submitted,
              actions: sendParent(PinEventType.Submit)
            }
          ]
        }
      },
      [PinState.Submitted]: {
        type: 'final',
        data: context => context.pin
      }
    }
  },
  {
    guards: {
      isPinCorrectLength: context => context.pin.length === context.pinLength
    },
    actions: {
      set: assign<PinContext, InputEvent>({
        pin: ({ pin }, { key }) => `${pin}${key}`
      }),
      reset: assign({
        pin: ''
      }),
      delete: assign<PinContext>({
        pin: ({ pin }) => pin.substr(0, pin.length - 1)
      })
    }
  }
)
