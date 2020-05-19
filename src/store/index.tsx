import { AsyncStorage } from 'react-native'
import React, { createContext, useReducer, useContext } from 'react'
import combinedReducer, { AppState } from './reducers'

export type GetState = () => AppState
export type Dispatch<A> = React.Dispatch<A>
export { AppState }

const whitelist = ['accounts', 'providers', 'actions', 'connection', 'transfers']

export const initialState = (localState?: Partial<AppState>) => {
  const state = combinedReducer()
  if (localState) {
    for (const key in localState) {
      if (whitelist.indexOf(key) > -1) {
        state[key] = localState[key]
      }
    }
  }
  return state
}

// this is to handle thunks and localstorage
const augmentDispatch = (dispatch: React.Dispatch<any>, state: any) => {
  const localState = {}
  for (const key in state) {
    if (whitelist.indexOf(key) > -1) {
      localState[key] = state[key]
    }
  }
  AsyncStorage.setItem('@PolarisBank:state', JSON.stringify(localState))
  return (input: any): void => (input instanceof Function ? input(dispatch, () => state) : dispatch(input))
}

interface StoreContextType {
  state: AppState
  dispatch: ReturnType<typeof augmentDispatch>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

interface ProviderProps {
  initialState?: AppState
}

export const Provider: React.FC<ProviderProps> = ({ children, initialState }) => {
  if (!initialState) {
    initialState = combinedReducer()
  }

  const [state, dispatch] = useReducer(combinedReducer, initialState)

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch: augmentDispatch(dispatch, state)
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function connect<TState, TDispatch = {}>(
  mapStateToProps: ((state: AppState, props: any) => TState | void) | null,
  mapDispatchToProps?: ((dispatch: Dispatch<any>, props: any) => TDispatch | void) | undefined
) {
  /*
    mapStateToProps could be passed in as null
    so ES6 default parameters wont work
  */
  if (!mapStateToProps) {
    mapStateToProps = () => {}
  }
  if (!mapDispatchToProps) {
    mapDispatchToProps = () => {}
  } else if (!(mapDispatchToProps instanceof Function)) {
    throw new Error(
      [
        '`mapDispatchToProps` must be a function like ',
        '`(dispatch, ownProps) => ({ foo: value => dispatch(bar(value)) })`'
      ].join('')
    )
  }

  return (WrappedComponent: React.ComponentType) => (props: any) => {
    const context = useContext(StoreContext)
    if (context === undefined) {
      throw new Error('connect must be used within a Provider component')
    }

    const { state, dispatch } = context

    return (
      <WrappedComponent
        {...props}
        {...(mapStateToProps && mapStateToProps(state, props))}
        {...(mapDispatchToProps && mapDispatchToProps(dispatch, props))}
      />
    )
  }
}

export const compose = (...funcs: any) => (x: any) => funcs.reduceRight((a: any, f: any) => f(a), x)
