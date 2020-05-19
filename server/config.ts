/* eslint-disable */
require('dotenv-expand')(require('dotenv').config())

import { ServerOptions } from '@hapi/hapi'

export interface Config {
  isProduction: boolean
  app: {
    hapi: ServerOptions
    ob: {
      key: string
      crt: string
    }
    watson: {
      url: string
      key: string
      assistantId: string
    }
    ibm: {
      clientId: string
      clientSecret: string
      connectionUrl: string
      obUrl: string
    }
  }
}

const isProduction = (process.env.NODE_ENV && process.env.NODE_ENV.includes('prod')) || false
const {
  HOST,
  PORT,
  OPEN_BANKING_KEY,
  OPEN_BANKING_CRT,
  WATSON_ASSISTANT_URL,
  WATSON_ASSISTANT_ID,
  WATSON_API_KEY,
  IBM_CLIENT_ID,
  IBM_CLIENT_SECRET,
  IBM_CONNECTION_URL,
  IBM_OB_URL
} = process.env

const config: Config = {
  isProduction,
  app: {
    hapi: {
      host: HOST,
      port: PORT
    },
    ob: {
      key: OPEN_BANKING_KEY!,
      crt: OPEN_BANKING_CRT!
    },
    watson: {
      url: WATSON_ASSISTANT_URL!,
      assistantId: WATSON_ASSISTANT_ID!,
      key: WATSON_API_KEY!
    },
    ibm: {
      clientId: IBM_CLIENT_ID!,
      clientSecret: IBM_CLIENT_SECRET!,
      connectionUrl: IBM_CONNECTION_URL!,
      obUrl: IBM_OB_URL!
    }
  }
}

export default config
