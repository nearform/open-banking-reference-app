import React from 'react'
import { render } from 'react-native-testing-library'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'

import { Provider, initialState } from 'store'
import { Action } from './types'
import { AppState } from 'store/reducers'
import { act } from 'react-test-renderer'

// this is a combination of redux-mock-store and redux-thunk which allows us
// to test our custom redux-like global state via context implementation
export const mockStore = (state: AppState) => {
  const actions: Action[] = []

  const getState = () => state
  const getActions = () => actions
  const dispatchAction = (action: Action) => {
    actions.push(action)
    return action
  }

  return {
    getState,
    getActions,
    dispatch: (action: Function) => action(dispatchAction, getState)
  }
}

interface Props {
  children: React.ReactNode
}

function renderWithRouterAndContext(
  ui: React.ReactElement,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    state
  }: { route?: string; history?: MemoryHistory; state?: Partial<AppState> } = {}
) {
  const Wrapper: React.FC<Props> = ({ children }) => (
    <Router history={history}>
      <Provider initialState={initialState(state)}>{children}</Provider>
    </Router>
  )
  return {
    ...render(ui, { wrapper: Wrapper }),
    history
  }
}

export const routerStubProps = {
  history: { push: jest.fn() } as any,
  location: {} as any,
  match: {} as any
}

export async function waitOnTick() {
  await act(() => new Promise(resolve => setTimeout(resolve, 0)))
}

export * from 'react-native-testing-library'

export { renderWithRouterAndContext as render, initialState }
