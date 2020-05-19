import React from 'react'
import { Animated, View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Icon from 'components/atoms/icon'
import { colors } from 'constants/colors'

interface Props {
  onPress?(): void
  animation?: Animated.Value
  editing?: boolean
  fill?: string
  testID?: string
}

const EditButton: React.FC<Props> = ({ onPress, animation, editing, fill = colors.white, testID = 'edit-button' }) => {
  const rotation = animation
    ? animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '135deg']
      })
    : '0deg'
  const scale = animation
    ? animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      })
    : 0.01

  const rotateStyle = {
    transform: [{ rotate: rotation }]
  }
  const scaleStyle = { transform: [{ scale }] }

  return (
    <TouchableWithoutFeedback onPress={onPress} testID={testID}>
      <Animated.View style={[buttonStyles.button, rotateStyle, { borderColor: fill }]}>
        <Animated.View style={[buttonStyles.bg, scaleStyle, { backgroundColor: fill }]} />
        <View style={buttonStyles.icon}>
          <Icon name="ic-x" fill={editing ? colors.lightBlue : fill} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const buttonStyles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20
  },
  icon: {
    transform: [{ rotate: '45deg' }],
    zIndex: 1
  },
  bg: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 20
  }
})

export default EditButton
