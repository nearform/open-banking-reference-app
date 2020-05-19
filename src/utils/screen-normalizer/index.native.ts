import { Platform } from 'react-native'
import Constants from 'expo-constants'
import get from 'lodash/get'

const devicesWithWeirdTop = ['iPhone X', 'iPhone XR', 'iPhone XS']
const hasWeirdTop =
  Platform.OS === 'ios' &&
  (devicesWithWeirdTop.includes(get(Constants, 'platform.ios.model')) ||
    devicesWithWeirdTop.includes(Constants.deviceName as string))

export const screenNormalizer = {
  top: hasWeirdTop ? 33 : Platform.OS === 'android' ? 0 : 10,
  bottom: hasWeirdTop ? 20 : 0
}
