import React, { useState } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native'
import Icon from 'components/atoms/icon'
import { colors } from 'constants/colors'

interface Props {
  checked?: boolean
  value?: string
  disabled?: boolean
  onChange?(value: string | undefined, checked: boolean): void
  testID?: string
}

interface State {
  checked: boolean
  animation: Animated.Value
}

const Checkbox: React.FC<Props> = props => {
  const [state, setState] = useState<State>({
    checked: !!props.checked,
    animation: new Animated.Value(props.checked ? 1 : 0.01)
  })

  const toggle = () => {
    if (props.onChange) {
      props.onChange(props.value, !state.checked)
    }

    Animated.timing(state.animation, {
      toValue: !state.checked ? 1 : 0.01,
      duration: 150,
      useNativeDriver: true
    }).start()

    setState({
      ...state,
      checked: !state.checked
    })
  }

  const { checked } = state
  const scale = {
    transform: [{ scale: state.animation }]
  }

  return (
    <TouchableWithoutFeedback onPress={!props.disabled ? toggle : () => {}} testID={props.testID || 'checkbox'}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        <Animated.View style={[styles.bg, scale]}>
          <Icon name="ic-checked" {...styles.image} />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const size = 24
const styles = StyleSheet.create({
  checkbox: {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: colors.grey,
    backgroundColor: 'white'
  },
  checked: {
    borderColor: 'transparent'
  },
  bg: {
    position: 'absolute',
    left: -2,
    top: -2,
    right: -2,
    bottom: -2,
    transform: [{ scale: 0 }],
    borderRadius: size / 2
  },
  image: {
    width: size,
    height: size
  }
})

export default Checkbox
