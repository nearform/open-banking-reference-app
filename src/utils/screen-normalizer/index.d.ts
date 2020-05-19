/* eslint-disable no-redeclare */

import * as web from './index.web'
import * as native from './index.native'

declare const _test: typeof web
declare const _test: typeof native

export * from './index.web'
