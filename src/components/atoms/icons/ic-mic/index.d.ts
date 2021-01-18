/* eslint-disable no-redeclare */

import * as web from './index.web'
import * as native from './index.native'

declare const _test: typeof web
declare const _test: typeof native

export { default } from './index.web'
export * from './index.web'
