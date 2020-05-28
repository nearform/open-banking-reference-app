import React from 'react'

import { Linking } from 'react-native'
import { Transfer } from './'
import { render, fireEvent, routerStubProps, waitOnTick } from 'test-utils'
import * as api from 'services/api'

jest.mock('services/api')
const mockedApi = api as jest.Mocked<typeof api>

beforeEach(() => {
  jest.resetAllMocks()
})

const stubProps = {
  ...routerStubProps,
  loadInstitutions: jest.fn(),
  setAmount: jest.fn(),
  setInstitution: jest.fn(),
  resetTransfer: jest.fn()
}

const connection = {
  access_token: '************',
  account_number: '99999999',
  connection_name: 'Dave',
  hub_name: 'Anne-Marie',
  id: 'autorized-connection-id',
  invitation: 'Welcome Dave',
  sort_code: '030901',
  status: 'AUTHORIZED'
}

const institution = {
  full_name: 'Stub Institution',
  id: 'stubinstitution',
  media: [
    {
      source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
      type: 'icon' as const
    },
    {
      source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
      type: 'logo' as const
    }
  ],
  name: 'S Inst'
}

test('Transfer - step 1', () => {
  const { getByText } = render(
    <Transfer amount="" connection={connection} institutions={[institution]} institution={null} {...stubProps} />
  )

  // select an institution
  fireEvent.press(getByText(institution.name))

  expect(stubProps.setInstitution).toHaveBeenCalledWith(institution)
  expect(stubProps.setInstitution).toHaveBeenCalledTimes(1)
  expect(stubProps.resetTransfer).not.toHaveBeenCalled()
})

test('Transfer - step 2', async () => {
  const url =
    'https://openbanking.cumberland.co.uk/authenticationendpoint/login.do?state=be59a9ab01fb41be92e548987aeca7a6&sessionDataKey=0551e573-adc6-4939-8c2a-68cc7424311e&relyingParty=MecrZw60zkgwpHx2zu2BeSfFhQEa&authenticators=SandstoneBasicCustomAuth%3ALOCAL'
  Linking.openURL = jest.fn()
  mockedApi.createPaymentAuthorizationRequest.mockResolvedValueOnce(url)

  const amount = '333'
  const { getByPlaceholder, getByText } = render(
    <Transfer
      amount={amount}
      connection={connection}
      institutions={[institution]}
      institution={institution}
      {...stubProps}
    />
  )

  // enter note and amount
  fireEvent.changeText(getByPlaceholder('transfers:step3:notePlaceholder'), 'Transfer Note')
  fireEvent.changeText(getByPlaceholder('transfers:step3:amountPlaceholder'), amount)

  expect(stubProps.setAmount).toHaveBeenCalledWith(amount)
  expect(stubProps.setAmount).toHaveBeenCalledTimes(1)

  fireEvent.press(getByText('transfers:step3:formSubmit'))

  expect(api.createPaymentAuthorizationRequest).toHaveBeenCalledWith(institution, connection, amount)
  expect(api.createPaymentAuthorizationRequest).toHaveBeenCalledTimes(1)

  await waitOnTick()

  expect(Linking.openURL).toHaveBeenCalledWith(url)
  expect(Linking.openURL).toHaveBeenCalledTimes(1)
  expect(stubProps.resetTransfer).not.toHaveBeenCalled()
})

test('Transfer - step 3 & 4', async () => {
  const consent =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJJTlNUSVRVVElPTiI6ImN1bWJlcmxhbmRidWlsZGluZ3NvY2lldHktc2FuZGJveCIsIkNPTlNFTlQiOiJhZjA5ZGMyZC1lYjRjLTQzZDEtYmIwOC1jODZhYjdhOGE0YzMiLCJBUFBMSUNBVElPTl9VU0VSX0lEIjoiMDAwMDAxIiwiVVNFUiI6ImMzMGIzZTMwLTQ0NzctNDA5Ni1hNmZiLWUzNGJhYWEyMThkMyJ9.STa4gMU0DG67M0Ks0gk95oAnTxbhtXep6-VPlPnohTdZxbz4pgBvtQvDxwPiDlcbVNjKBuz_cr8FvAVguxQroQ'
  const amount = '150'

  const { getByText } = render(
    <Transfer
      amount={amount}
      connection={connection}
      institutions={[institution]}
      institution={institution}
      {...stubProps}
    />,
    { route: `?consent=${consent}` }
  )

  // step 3 is just waiting
  expect(getByText('transfers:step4:message')).toBeTruthy()

  expect(api.createPayment).toHaveBeenCalledWith(connection, amount, consent)
  expect(api.createPayment).toHaveBeenCalledTimes(1)

  await waitOnTick()

  // step 4 is completion
  expect(getByText('transfers:step5:message')).toBeTruthy()
  expect(stubProps.resetTransfer).toHaveBeenCalledTimes(1)
})
