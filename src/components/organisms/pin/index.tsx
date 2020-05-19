import React, { useMemo, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Dot from 'components/organisms/dot'

type Props = {
  pin: string
  size?: number
}

const PIN: React.FC<Props> = ({ pin, size = 6 }) => {
  const scale = useMemo(() => Array.from(Array(size)).map(() => new Animated.Value(0.01)), [size])

  useEffect(() => {
    Animated.stagger(
      50,
      scale.map(animation =>
        Animated.spring(animation, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true
        })
      )
    ).start()
  }, [scale])

  return (
    <View style={styles.container}>
      {scale.map((_, i) => (
        <Animated.View style={{ transform: [{ scale: scale[i] }] }} key={i}>
          <Dot active={i < pin.length} index={i} />
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

export default PIN
