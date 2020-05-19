import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { colors } from 'constants/colors'

type Props = {
  index: number
  active: boolean
}

const Dot: React.FC<Props> = ({ index, active }) => {
  const [scale] = useState(new Animated.Value(0.01))

  useEffect(() => {
    Animated.spring(scale, {
      toValue: Number(active),
      useNativeDriver: true
    }).start()
  }, [active, scale])

  return (
    <View style={[styles.dot, index === 0 && styles.dotFirst]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  dotFirst: {
    marginLeft: 0
  },
  dot: {
    marginLeft: 17,
    width: 12,
    height: 12,
    backgroundColor: colors.grey,
    borderRadius: 6
  },
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 6,
    backgroundColor: colors.orange
  }
})

export default Dot
