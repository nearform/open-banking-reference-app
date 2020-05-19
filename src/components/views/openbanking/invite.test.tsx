import React from 'react'

import { Linking } from 'expo'
import { render, fireEvent, waitOnTick } from 'test-utils'
import { Invite } from './invite'
import urls from 'src/urls'

const id = 'test-id'
const createConnection = jest.fn().mockResolvedValue({ id })

beforeEach(() => jest.clearAllMocks())

test('Invite view - display QR code', async () => {
  const { getByText, getByPlaceholder } = render(<Invite createConnection={createConnection} />)

  // ensure we're on step 1 and connect request message is displayed
  expect(getByText('openbanking:invite:title')).toBeTruthy()

  // ensure buttons can't be pressed until form is completed
  expect(getByText('openbanking:invite:send')).toBeDisabled()
  expect(getByText('openbanking:invite:share')).toBeDisabled()

  // complete enough of form to enable QR code sharing
  const name = 'Joanna'
  const message = 'Please join'
  fireEvent.changeText(getByPlaceholder('openbanking:invite:form:name'), name)
  fireEvent.changeText(getByPlaceholder('openbanking:invite:form:message'), message)

  // ensure send invite button is still disabled
  expect(getByText('openbanking:invite:send')).toBeDisabled()

  // ensure show qr button is enabled
  expect(getByText('openbanking:invite:share')).toBeEnabled()

  // trigger display of qr code
  fireEvent.press(getByText('openbanking:invite:share'))

  // TODO assert displayed QRCode

  // ensure createConnection is called
  await waitOnTick()
  expect(createConnection).toHaveBeenCalledWith({
    hub_user_id: '1234',
    hub_name: 'Anne-Marie',
    connection_name: name,
    phone_number: '',
    invitation: message
  })
  expect(createConnection).toHaveBeenCalledTimes(1)
})

test('Invite view - send message', async () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')

  const { getByText, getByPlaceholder } = render(<Invite createConnection={createConnection} />)

  // ensure we're on step 1 and connect request message is displayed
  expect(getByText('openbanking:invite:title')).toBeTruthy()

  // ensure send invite button can't be pressed until form is completed
  expect(getByText('openbanking:invite:send')).toBeDisabled()

  // complete all of form
  const name = 'Joanna'
  const contact = 'joanna@example.com'
  const message = 'Please join'
  fireEvent.changeText(getByPlaceholder('openbanking:invite:form:name'), name)
  fireEvent.changeText(getByPlaceholder('openbanking:invite:form:contact'), contact)
  fireEvent.changeText(getByPlaceholder('openbanking:invite:form:message'), message)

  // ensure send invite button is enabled
  expect(getByText('openbanking:invite:send')).toBeEnabled()

  // trigger send invite
  fireEvent.press(getByText('openbanking:invite:send'))

  // ensure createConnection is called
  await waitOnTick()
  expect(createConnection).toHaveBeenCalledWith({
    hub_user_id: '1234',
    hub_name: 'Anne-Marie',
    connection_name: name,
    email: contact,
    invitation: message
  })
  expect(createConnection).toHaveBeenCalledTimes(1)
  expect(openURLSpy)
    .toHaveBeenCalledWith(`mailto:${contact}?subject=You've been invited to Polaris Bank&body=${message}%0A%0A

  Accept your invite by visiting ${`${urls.ui}/connect/${id}`}`)
  expect(openURLSpy).toHaveBeenCalledTimes(1)
})
