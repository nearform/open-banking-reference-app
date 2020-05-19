/* eslint-disable no-redeclare */

import * as web from './routing.web'
import * as native from './routing.native'

declare const _test: typeof web
declare const _test: typeof native

export * from './routing.native'
