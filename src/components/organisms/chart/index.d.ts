/* eslint-disable no-redeclare */

import DefaultWeb from './index.web'
import DefaultNative from './index.native'

declare const _test: typeof DefaultWeb
declare const _test: typeof DefaultNative

export { default } from './index.web'
