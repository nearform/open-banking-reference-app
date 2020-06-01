import React from 'react'

import { Linking } from 'react-native'
import { Connect } from './'
import { render, fireEvent, routerStubProps, waitOnTick } from 'test-utils'
import * as api from 'services/api'

jest.mock('services/api')
const mockedApi = api as jest.Mocked<typeof api>

beforeEach(() => {
  jest.resetAllMocks()
})

const stubProps = {
  ...routerStubProps,
  match: {
    params: { connection: 'connection-id' },
    ...routerStubProps.match
  },
  loadConnection: jest.fn(),
  loadInstitutions: jest.fn(),
  checkConnections: jest.fn()
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

test('Connect - step 1, 2 & 3', async () => {
  const url =
    'https://openbanking.cumberland.co.uk/oauth2/authorize?client_id=MecrZw60zkgwpHx2zu2BeSfFhQEa&response_type=code+id_token&state=c9f1d7adbe6c46318e94dd94efc87a96&nonce=c9f1d7adbe6c46318e94dd94efc87a96&scope=openid+accounts&redirect_uri=https%3A%2F%2Fauth.yapily.com%2F&request=eyJraWQiOiJhdWthYlA2dkl6R3JMMUhLUU1vR3NmVEloX1kiLCJhbGciOiJQUzI1NiJ9.eyJhdWQiOiJodHRwczovL29wZW5iYW5raW5nLmN1bWJlcmxhbmQuY28udWsvbGl2ZSIsInNjb3BlIjoib3BlbmlkIGFjY291bnRzIiwiaXNzIjoiTWVjclp3NjB6a2d3cEh4Mnp1MkJlU2ZGaFFFYSIsImNsaWVudF9pZCI6Ik1lY3JadzYwemtnd3BIeDJ6dTJCZVNmRmhRRWEiLCJyZXNwb25zZV90eXBlIjoiY29kZSBpZF90b2tlbiIsInJlZGlyZWN0X3VyaSI6Imh0dHBzOi8vYXV0aC55YXBpbHkuY29tLyIsInN0YXRlIjoiYzlmMWQ3YWRiZTZjNDYzMThlOTRkZDk0ZWZjODdhOTYiLCJjbGFpbXMiOnsiaWRfdG9rZW4iOnsiYWNyIjp7InZhbHVlIjoidXJuOm9wZW5iYW5raW5nOnBzZDI6c2NhIiwiZXNzZW50aWFsIjp0cnVlfSwib3BlbmJhbmtpbmdfaW50ZW50X2lkIjp7InZhbHVlIjoiYjk3MThmMjUtNzVkNS00N2U3LWE2MjgtMGExZTE5NTFhYTg2IiwiZXNzZW50aWFsIjp0cnVlfX0sInVzZXJpbmZvIjp7Im9wZW5iYW5raW5nX2ludGVudF9pZCI6eyJ2YWx1ZSI6ImI5NzE4ZjI1LTc1ZDUtNDdlNy1hNjI4LTBhMWUxOTUxYWE4NiIsImVzc2VudGlhbCI6dHJ1ZX19fSwibm9uY2UiOiJjOWYxZDdhZGJlNmM0NjMxOGU5NGRkOTRlZmM4N2E5NiIsImp0aSI6ImI3Y2YwNzMwLTk1NDMtNDAzYy05ZTFhLWU4ZmQ0YmFjMTg4NyIsImlhdCI6MTU4OTM1NzEyNCwiZXhwIjoxNTg5MzU4OTI0fQ.R2DpeIxwZTMxylhIJQax-gDbfONdfrZ8FMhlI_a9_Vaytb_QDGYJqw8krixf2U2o2CLtT2dx1aSVxfCMgUSZkwnRoJnAiVF_x_IYY3gNCB2klymE4G6LGw_V287ZzBsi_2YYhKtkGM-R5Dpq4f7cxpkVRm2NfA0NycDlY3GJNd7FvP8L8RuYd1BR4Y1hx7c5CYWPqz6jwZRSnV5tgLPrzjnULOBI1fqRVfwMNqmKjg_hBYuI1_E3CE9HR3RBZWwamomFBE4pvO3ac3_acBs8J2uG7Eh_tGlLfXc3p4HsPgu6bG_zFQh_m6H6os7WruHiJJTslxm8vmis1R8f6jYl2w'

  Linking.openURL = jest.fn()
  mockedApi.createAccountAuthorizationRequest.mockResolvedValueOnce(url)

  const { queryByText, getAllByTestId, getByText } = render(
    <Connect {...stubProps} connection={connection} institutions={[institution]} />
  )

  // ensure we're on step 1 and connect request message is displayed
  expect(getByText('connect:step1:title')).toBeTruthy()
  expect(getByText('Welcome Dave')).toBeTruthy()

  // tap to next step
  fireEvent.press(getByText('connect:step1:formSubmit'))

  // ensure we're on step 2
  expect(queryByText('connect:step1:title')).toBeFalsy()
  expect(getByText('connect:step2:title')).toBeTruthy()

  // tap to next step
  fireEvent.press(getByText(institution.name))

  // ensure we're on step 3
  expect(queryByText('connect:step2:title')).toBeFalsy()
  expect(getByText('connect:step3:title')).toBeTruthy()

  // ensure button to go to next step is disabled
  const step3SubmitButton = getByText('connect:step3:formSubmit')
  expect(step3SubmitButton).toBeDisabled()

  // tap term accept checkboxes
  fireEvent(getAllByTestId('checkbox')[0], 'onChange')
  fireEvent(getAllByTestId('checkbox')[1], 'onChange')

  // ensure button to go to next step is enabled
  expect(step3SubmitButton).toBeEnabled()

  // tap to next step
  fireEvent.press(step3SubmitButton)

  expect(api.createAccountAuthorizationRequest).toHaveBeenCalledWith(connection, institution)
  expect(api.createAccountAuthorizationRequest).toHaveBeenCalledTimes(1)

  await waitOnTick()

  expect(Linking.openURL).toHaveBeenCalledWith(url)
  expect(Linking.openURL).toHaveBeenCalledTimes(1)
})

test('Connect - step 4 & 5', async () => {
  const consent =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJJTlNUSVRVVElPTiI6ImN1bWJlcmxhbmRidWlsZGluZ3NvY2lldHktc2FuZGJveCIsIkNPTlNFTlQiOiJiY2M0MjQ1MC02OTAwLTQ5ZmYtYTM3YS0yOWVkOTFhNmYyZWUiLCJBUFBMSUNBVElPTl9VU0VSX0lEIjoiNzc5NWVhOTBkOGMxMGI1NzMxODE4YThiMDc3YjI5NTIiLCJVU0VSIjoiZDZiZTVhMzQtYzJlMS00ZjU1LWIxZjctZmFkMWNjMzRmZmRiIn0.rofVlRlmkwwgdqUwc8S7UtBbuR1edmxh6ugU0jEikhBFmviUz_iywDdWlSzMcChyCf2TUyAkIMvSaTb_CARmog'

  const { getByText } = render(
    <Connect
      {...stubProps}
      connection={connection}
      institutions={[institution]}
      match={
        {
          params: { id: institution.id }
        } as any
      }
    />,
    { route: `?consent=${consent}` }
  )

  expect(getByText('connect:step4:message')).toBeTruthy()

  expect(api.updateConnection).toHaveBeenCalledWith(institution.id, consent)
  expect(api.updateConnection).toHaveBeenCalledTimes(1)

  await waitOnTick()

  // step 5 is completion
  expect(getByText('connect:step5:message')).toBeTruthy()
})
