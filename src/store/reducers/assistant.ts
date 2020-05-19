import { AssistantAction } from '../actions/assistant'

const initial = {
  awaitingResponse: false,
  messages: [
    {
      id: 0,
      text: 'Hi there, my name is Assistant and I can help you with most common queries. How may I help you today?',
      icon: 'ic-transfer-2',
      isBot: true,
      date: Date.now()
    },
    {
      id: 1,
      text: 'You know what i want?',
      icon: 'ic-transfer-1',
      isBot: false,
      date: Date.now()
    },
    {
      id: 2,
      text: 'I want to apply for a new banking product such as credit cards, savings accounts, travel insurance, etc.',
      icon: 'ic-transfer-1',
      isBot: false,
      date: Date.now()
    }
  ]
}

export type AssistantState = typeof initial

function sendMessage(state: AssistantState, action: AssistantAction) {
  return {
    ...state,
    awaitingResponse: true,
    messages: [
      ...state.messages,
      {
        id: state.messages.length,
        text: action.text,
        icon: 'ic-transfer-1',
        isBot: false,
        date: Date.now()
      }
    ]
  }
}

function receiveResponse(state: AssistantState, action: AssistantAction) {
  return {
    ...state,
    messages: [
      ...state.messages,
      {
        id: state.messages.length,
        text: action.text,
        icon: 'ic-transfer-2',
        isBot: true,
        date: Date.now()
      }
    ]
  }
}

export default function (state = initial, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'ASSISTANT_SEND_MESSAGE':
      return sendMessage(state, action)

    case 'ASSISTANT_RECEIVE_RESPONSE':
      return receiveResponse(state, action)

    default:
      return state
  }
}
