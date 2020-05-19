// Currently the assistant is basically IBM Watson, you can get more info from
// - https://www.ibm.com/cloud/watson-assistant/
// - https://cloud.ibm.com/developer/watson/documentation

import hapi from '@hapi/hapi'
import Joi from '@hapi/joi'
import { badGateway } from '@hapi/boom'
import { Server } from '../../types'
import AssistantV2 from 'ibm-watson/assistant/v2'
import { IamAuthenticator } from 'ibm-watson/auth'

const defaultApiVersion = '2018-09-19'

function handleUpstreamError(
  prefix: string,
  e: {
    response?: any
  } & Error
) {
  const message = e.response ? `[HTTP ${e.response.statusCode}] ${JSON.stringify(e.response.body)}` : e.message
  throw badGateway(`${prefix}: ${message}`)
}

interface Request extends hapi.Request {
  payload: {
    session: string
    message: string
  }
  server: Server
}

async function handleRequest({ apiUrl, apiKey, assistantId, apiVersion }: Options, req: Request) {
  // TODO session needs picking up once the front end can handle it.
  // const { session, message } = req.payload
  const { message } = req.payload
  try {
    const assistant = new AssistantV2({
      authenticator: new IamAuthenticator({ apikey: apiKey }),
      url: apiUrl,
      version: apiVersion
    })

    const session = await assistant.createSession({ assistantId: assistantId })
    const response = await assistant.message({
      input: { text: message },
      assistantId: assistantId,
      sessionId: session.result.session_id
    })
    if (response?.result?.output?.generic) {
      return { text: response.result.output.generic[0].text }
    }
  } catch (e) {
    handleUpstreamError('Unable to open a session with Watson', e)
  }
  return false
}

interface Options {
  apiKey: string
  apiUrl: string
  assistantId: string
  apiVersion?: string
}

interface ExtendedJoi extends Joi.Root {
  coerce: Joi.CoerceFunction
}

const plugin: hapi.Plugin<Options> = {
  name: 'assistant',
  version: '1.0.0',
  async register(server, options) {
    // Adjust some options
    if (!options.apiVersion) {
      options.apiVersion = defaultApiVersion
    }

    // Prepare Watson sessions
    server.decorate('server', 'watsonSessions', () => new Map<string, string>())

    const custom: ExtendedJoi = Joi.extend(
      (joi): Joi.Extension => {
        return {
          type: 'object',
          base: joi.object(),
          coerce: (value: string): Joi.CoerceResult => {
            if (value[0] !== '{' && !/^\s*\{/.test(value)) {
              return { value: null }
            }

            try {
              return { value: JSON.parse(value) }
            } catch (err) {
              console.log(err)
              return { errors: err }
            }
          }
        }
      }
    )

    // Add the new route
    server.route({
      method: 'POST',
      path: '/assistant/ask',
      handler: handleRequest.bind(null, options),
      options: {
        validate: {
          failAction: async (_request, _h, err) => {
            if (process.env.NODE_ENV === 'production') {
              // In prod, log a limited error message and throw the default Bad Request error.
              console.error('ValidationError:', !!err && err.message)
            } else {
              // During development, log and respond with the full error.
              console.error(err)
              throw err
            }
          },
          payload: custom
            .object()
            .required()
            .keys({
              message: Joi.string().min(1).required(),
              session: Joi.string().min(1).required()
            })
        }
      }
    })
  }
}

export default plugin
