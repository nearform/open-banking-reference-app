import React from 'react'

import { Linking } from 'react-native'
import { Openbanking } from './'
import { render, fireEvent, waitOnTick } from 'test-utils'
import * as api from 'services/api'

jest.mock('services/api')
const mockedApi = api as jest.Mocked<typeof api>

beforeEach(() => {
  jest.resetAllMocks()
})

const stubProps = {
  addOpenbankingAccount: jest.fn(),
  initSession: jest.fn(),
  loadProviders: jest.fn(),
  loadTokens: jest.fn()
}

const account = {
  id: 'some-id',
  accountNumber: 'AB123456',
  balance: '100.00',
  currency: 'GBP',
  provider: 1,
  title: 'Savings Account',
  type: 'Personal',
  transactions: [
    {
      amount: '-150',
      currency: 'GBP',
      date: '2012-11-03T09:30:39.919Z',
      icon: 'example',
      title: 'Bank Transfer'
    }
  ]
}

const provider = {
  title: 'Stub Provider',
  id: 1,
  version: '0.0.1',
  logo: 'stub-provider'
}

test('Openbanking to invite flow', () => {
  const { getByText, history } = render(<Openbanking account={account} providers={[provider]} {...stubProps} />)

  // ensure we're on step 1 and connect request message is displayed
  expect(getByText('openbanking:step1:title')).toBeTruthy()

  // progress to step
  fireEvent.press(getByText('openbanking:invite:button'))

  // ensure we're sent to the invite view
  expect(history.location.pathname).toBe('/openbanking/invite')
})

test('Openbanking - step 1', async () => {
  const url =
    'https://as.aspsp.ob.forgerock.financial/oauth2/authorize?response_type=code%20id_token&client_id=f507d6c2-5d8f-4098-b7ba-d84018f35668&state=10d260bf-a7d9-444a-92d9-7b7a5f088208&nonce=10d260bf-a7d9-444a-92d9-7b7a5f088208&scope=openid%20payments%20accounts&redirect_uri=http%3A%2F%2Fpolarisbank.com%3A3000&request=eyJraWQiOiJiYWJjYjkxMWQyZDgzOTQ4ZTc0MGQwNzBmMjQ2YzllMmMwMDQ3MDk1IiwiYWxnIjoiUFMyNTYifQ.eyJhdWQiOiJodHRwczpcL1wvYXMuYXNwc3Aub2IuZm9yZ2Vyb2NrLmZpbmFuY2lhbFwvb2F1dGgyIiwic2NvcGUiOiJvcGVuaWQgcGF5bWVudHMgYWNjb3VudHMiLCJpc3MiOiJmNTA3ZDZjMi01ZDhmLTQwOTgtYjdiYS1kODQwMThmMzU2NjgiLCJjbGFpbXMiOnsiaWRfdG9rZW4iOnsiYWNyIjp7InZhbHVlIjoidXJuOm9wZW5iYW5raW5nOnBzZDI6c2NhIiwiZXNzZW50aWFsIjp0cnVlfSwib3BlbmJhbmtpbmdfaW50ZW50X2lkIjp7InZhbHVlIjoiQUFDXzIxZTUwOWMwLTE1YTUtNDg5YS04NDNmLTdjNGI3MDRkMmI1ZCIsImVzc2VudGlhbCI6dHJ1ZX19LCJ1c2VyaW5mbyI6eyJvcGVuYmFua2luZ19pbnRlbnRfaWQiOnsidmFsdWUiOiJBQUNfMjFlNTA5YzAtMTVhNS00ODlhLTg0M2YtN2M0YjcwNGQyYjVkIiwiZXNzZW50aWFsIjp0cnVlfX19LCJyZXNwb25zZV90eXBlIjoiY29kZSBpZF90b2tlbiIsInJlZGlyZWN0X3VyaSI6Imh0dHA6XC9cL3BvbGFyaXNiYW5rLmNvbTozMDAwIiwic3RhdGUiOiIxMGQyNjBiZi1hN2Q5LTQ0NGEtOTJkOS03YjdhNWYwODgyMDgiLCJleHAiOjE1ODkzODM5NTcsIm5vbmNlIjoiMTBkMjYwYmYtYTdkOS00NDRhLTkyZDktN2I3YTVmMDg4MjA4IiwiaWF0IjoxNTg5MzgzNjU3LCJjbGllbnRfaWQiOiJmNTA3ZDZjMi01ZDhmLTQwOTgtYjdiYS1kODQwMThmMzU2NjgiLCJqdGkiOiIwZWZiMjU0ZS1iZjZlLTRhYTUtODJlYS0wMGUyNmEyOGFiNzMifQ.faWEm2k7X3nlsrFgIMaux9mbElVmJ18D-f7CytoJ6ih7PnZTBWiTn4BVkkhdDRc3pXNpTc3q92WM3r_bLGy9iZX_oHxHULRRrDLjb3iFRHo1Hzj1Jyo2SgZWmMzI_qPfRv_v_TwJLlJgDmPi5jbUNYIkZB96mEUPzWperddqyhDFs92d37FnR1rV16pDsNvR_8r2hq5ulsJ44_RWEs_-oyik79ip0RUmy8NCXu9WuKeCI-7hFH1Hxtjkl2c8eXqxzOwwSGSEUOpRx3RC-jN9DNUzZHsm1_jfwYnF_JalKBZ3zn6ft33CZ2X9wjeNWHctBiNLh-MRBNm5tHXFXMZz4A'

  Linking.openURL = jest.fn()
  mockedApi.loadAuthorizationURL.mockResolvedValueOnce(url)
  const { getByText } = render(<Openbanking account={account} providers={[provider]} {...stubProps} />)

  // ensure we're on step 1 and connect request message is displayed
  expect(getByText('openbanking:step1:title')).toBeTruthy()

  // tap to next step
  fireEvent.press(getByText(provider.title))

  expect(api.loadAuthorizationURL).toHaveBeenCalledWith(provider.id)
  expect(api.loadAuthorizationURL).toHaveBeenCalledTimes(1)

  await waitOnTick()

  expect(stubProps.initSession).toHaveBeenCalledWith(url, provider.id)
  expect(stubProps.initSession).toHaveBeenCalledTimes(1)

  expect(Linking.openURL).toHaveBeenCalledWith(url)
  expect(Linking.openURL).toHaveBeenCalledTimes(1)
})

test('Openbanking - step 2', async () => {
  const code = 'ujYKPIRb2p2jQAh76ZV6oxqw9eg'
  const hash = `code=${code}&id_token=eyJ0eXAiOiJKV1QiLCJraWQiOiJNUUVBbFh5cUJmQ20zY0xteVAveTV1Z0dOdHM9IiwiYWxnIjoiUFMyNTYifQ.eyJzdWIiOiJBQUNfYWRiMmM1NzctNWJkMy00ZDNlLTllMDEtZWEyNDE4OGY3OWRiIiwiYXVkaXRUcmFja2luZ0lkIjoiYTllNjFhYjAtMzA4My00MTQzLWFkNWItMDNjZjM5YzQ0NWViLTQ2NzQiLCJpc3MiOiJodHRwczovL2FzLmFzcHNwLm9iLmZvcmdlcm9jay5maW5hbmNpYWwvb2F1dGgyIiwidG9rZW5OYW1lIjoiaWRfdG9rZW4iLCJub25jZSI6IjEwZDI2MGJmLWE3ZDktNDQ0YS05MmQ5LTdiN2E1ZjA4ODIwOCIsImF1ZCI6IjAyMzA4YTQ0LTE2MWYtNDZjMi04Zj…SI6MTU4OTQ3MDY3MSwicmVhbG0iOiIvb3BlbmJhbmtpbmciLCJleHAiOjE1ODk1NTcxMDEsInRva2VuVHlwZSI6IkpXVFRva2VuIiwiaWF0IjoxNTg5NDcwNzAxfQ.cuARmQyLrcnM3GkTsx6ui0V7iUmfqGK5lmtq6bpEXPLxdoKWF3YApqDk54mywYjY5b2FpbaEgZVmyO2-RXnvqcjULy-85OQixmgDrr_J_DNPRGqKk3JZsRyxHPEpFcPRbo6ofvlAjpbGrQv2OuiQVvu85FzV9hwZSZV7Ts6RB9S26Cw2bJbhULjmNWXh_xnHLNJSAheVebafYhuBCWaMM24292mIdPznE2O0vjMOSqCnkIDIKQBHrEXEwKjAwk6sa4kSouuxdw2I9L8AlBVB8v_g6AGG61arYVM-y03eb0ef9fPHklPS5AYWlzFzOVstx05xM2CTY_lF24Cot5zvGw&state=10d260bf-a7d9-444a-92d9-7b7a5f088208`

  const { history } = render(<Openbanking {...stubProps} account={account} providers={[provider]} />, {
    route: `#${hash}`
  })

  expect(stubProps.loadTokens).toHaveBeenCalledWith(code)
  expect(stubProps.loadTokens).toHaveBeenCalledTimes(1)

  await waitOnTick()

  expect(stubProps.addOpenbankingAccount).toHaveBeenCalled()
  expect(stubProps.addOpenbankingAccount).toHaveBeenCalledTimes(1)

  expect(history).toHaveLength(2)
  expect(history.entries[1].pathname).toEqual('/overview')
})
