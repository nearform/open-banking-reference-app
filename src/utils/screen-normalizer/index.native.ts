import { Platform } from 'react-native'
import { getModel } from 'react-native-device-info'
import get from 'lodash/get'

const devicesWithWeirdTop = ['iPhone X', 'iPhone XR', 'iPhone XS']
const hasWeirdTop =
  Platform.OS === 'ios' &&
  (devicesWithWeirdTop.includes(get(getModel, 'platform.ios.model')) || devicesWithWeirdTop.includes(getModel()))

export const screenNormalizer = {
  top: hasWeirdTop ? 33 : Platform.OS === 'android' ? 0 : 10,
  bottom: hasWeirdTop ? 20 : 0
}
