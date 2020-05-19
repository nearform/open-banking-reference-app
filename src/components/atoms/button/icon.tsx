import React from 'react'
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native'

function hex2rgba(hex: string, opacity: number) {
  let str = hex.slice()
  str = str.replace('#', '')
  const r = parseInt(str.substring(0, str.length / 3), 16)
  const g = parseInt(str.substring(str.length / 3, (2 * str.length) / 3), 16)
  const b = parseInt(str.substring((2 * str.length) / 3, (3 * str.length) / 3), 16)

  const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')'
  return result
}

interface Props {
  action(): void
  icon: React.ReactNode
  iconColor?: string
  style?: object
  testID?: string
}

const IconButton: React.FC<Props> = ({ action, icon, iconColor, style = {}, testID = 'icon-button' }) => {
  const backgroundColor = iconColor ? hex2rgba(iconColor, 20) : null
  return (
    <TouchableWithoutFeedback onPress={action} testID={testID}>
      <View
        style={[
          styles.view,
          {
            backgroundColor: backgroundColor
          },
          style
        ]}
      >
        {icon}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  view: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default IconButton
