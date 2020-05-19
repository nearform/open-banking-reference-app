import { Dispatch } from '../'
import urls from '../../urls'

const ASSISTANT_SEND_MESSAGE = 'ASSISTANT_SEND_MESSAGE'
const ASSISTANT_RECEIVE_RESPONSE = 'ASSISTANT_RECEIVE_RESPONSE'

export function receiveResponse(text: string) {
  return {
    type: ASSISTANT_RECEIVE_RESPONSE,
    text
  } as const
}

export type AssistantAction = ReturnType<typeof receiveResponse> | { type: typeof ASSISTANT_SEND_MESSAGE; text: string }

export function sendMessage(text: string) {
  return async (dispatch: Dispatch<AssistantAction>) => {
    // TODO: use a session
    dispatch({ type: ASSISTANT_SEND_MESSAGE, text })
    try {
      const res = await fetch(`${urls.api}/assistant/ask`, {
        method: 'POST',
        body: JSON.stringify({ message: text, session: '4' })
      })
      const json = await res.json()
      dispatch(receiveResponse(json.text))
    } catch (err) {
      console.log('Error!', err)
      dispatch(receiveResponse('Please try again later. There was an error processing your request.'))
    }
  }
}
