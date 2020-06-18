import { Machine } from 'xstate'
import AsyncStorage from '@react-native-community/async-storage'

import { pinMachine } from './pinMachine'

const { REACT_APP_PIN = '' } = process.env

export enum AuthenticationState {
  Checking = 'checking',
  Authenticating = 'authenticating',
  Unauthenticated = 'unauthenticated',
  Authenticated = 'authenticated'
}

export enum AuthenticationEvents {
  Logout = 'logout'
}

export type AuthenticationSchema = {
  states: { [key in AuthenticationState]: {} }
}

export type AuthenticationEvent = { type: string; data: string }

export const checkPersistedLogin = async () => {
  try {
    const pin = await AsyncStorage.getItem('@PolarisBank:pin')

    if (pin === null) {
      throw new Error('no persisted pin available')
    }

    return pin
  } catch (error) {
    throw new Error(error)
  }
}

export const verifyLogin = (pin: string) =>
  new Promise((resolve, reject) => {
    if (pin === REACT_APP_PIN) {
      resolve(pin)
    } else {
      reject(new Error('incorrect pin'))
    }
  })

export const persistLogin = (pin: string) => AsyncStorage.setItem('@PolarisBank:pin', pin)

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('@PolarisBank:pin')
  } catch (error) {
    throw new Error(error)
  }
}

export const authenticationMachine = Machine<{}, AuthenticationSchema, AuthenticationEvent>(
  {
    id: 'authenticationMachine',
    initial: AuthenticationState.Checking,
    states: {
      [AuthenticationState.Checking]: {
        invoke: {
          src: 'checkPersistedLogin',
          onDone: AuthenticationState.Authenticating,
          onError: AuthenticationState.Unauthenticated
        }
      },
      [AuthenticationState.Unauthenticated]: {
        invoke: {
          id: 'pinMachine',
          src: pinMachine,
          onDone: AuthenticationState.Authenticating
        }
      },
      [AuthenticationState.Authenticating]: {
        invoke: {
          src: 'verifyLogin',
          onDone: AuthenticationState.Authenticated,
          onError: AuthenticationState.Unauthenticated
        }
      },
      [AuthenticationState.Authenticated]: {
        entry: 'persistLogin',
        on: {
          [AuthenticationEvents.Logout]: {
            target: AuthenticationState.Unauthenticated,
            actions: logout
          }
        }
      }
    }
  },
  {
    services: {
      checkPersistedLogin,
      verifyLogin: (_, { data }) => verifyLogin(data)
    },
    actions: {
      persistLogin: (_, { data }) => persistLogin(data)
    }
  }
)
