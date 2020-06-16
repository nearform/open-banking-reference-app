import React from 'react'
import { StyleSheet, Animated, View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'routing'

import Icon from 'components/atoms/icon'
import Checkbox from 'components/atoms/checkbox'

import { colors } from 'constants/colors'

interface Props {
  item: string
  checked: boolean
  animation: Animated.Value
  onMenuItemToggle(item: string, checked: boolean): void
  onClick: (() => void) | null
}

const MenuItemBase: React.FC<Props> = ({ item, checked, animation, onMenuItemToggle, onClick }) => {
  const paddingStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 36]
        })
      }
    ]
  }

  const translateStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    }),
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-24, -20]
        })
      }
    ]
  }

  return (
    <Animated.View style={[itemStyles.item, paddingStyle]}>
      <Animated.View style={[itemStyles.checkbox, translateStyle]}>
        <Checkbox value={item} checked={checked} onChange={onMenuItemToggle} />
      </Animated.View>
      {onClick ? (
        <TouchableWithoutFeedback onPress={onClick}>
          <View style={itemStyles.row}>
            <Text style={itemStyles.text}>{item}</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <Link
          to="/overview"
          {...(Platform.OS !== 'web' && { component: TouchableOpacity, activeOpacity: 0.5 })}
          style={{ flex: 1 }}
        >
          <View style={itemStyles.row}>
            <Text style={itemStyles.text}>{item}</Text>
            <Icon name="ic-chevron" />
          </View>
        </Link>
      )}
    </Animated.View>
  )
}

const itemStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 51,
    paddingLeft: 18,
    paddingRight: 16
  },
  text: {
    lineHeight: 48,
    fontSize: 16,
    fontFamily: 'fira-sans-semi-bold',
    color: colors.black
  },
  row: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  checkbox: {
    position: 'absolute',
    left: 0,
    transform: [{ translateX: -24 }]
  }
})

export default MenuItemBase
