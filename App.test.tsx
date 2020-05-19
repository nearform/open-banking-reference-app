import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from './src/store'
import combinedReducer from './src/store/reducers'
import App from './src/app'
import MockDate from 'mockdate'

jest.mock('expo', () => ({
  AppLoading: 'AppLoading'
}))

jest.mock('expo-constants', () => ({
  platform: {
    ios: {
      model: 'iPhone X'
    }
  }
}))

beforeEach(() => {
  // As part of constructing the Animation, it will grab the
  // current time. Mocking the date right away ensures everyone
  // is starting from the same time
  MockDate.set(0)

  // Need to fake the timers for timeTravel to work
  jest.useFakeTimers()
})

afterAll(done => {
  done()
})

describe('App', () => {
  it(`doesn't render a view until we've checked if the user has been previously logged in or not`, () => {
    const initialState = combinedReducer()
    initialState.accounts.accounts = [
      {
        id: 'some-id',
        accountNumber: 'AB123456',
        balance: '100.00',
        currency: 'GBP',
        provider: 1,
        title: 'Foo Bar Account',
        type: 'Personal'
      }
    ]
    initialState.providers.providers = [
      {
        id: 1,
        logo: 'abanca',
        title: 'Foo Bar Provider',
        version: '0.0.1'
      }
    ]
    const tree = renderer
      .create(
        <Provider initialState={initialState}>
          <App />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
