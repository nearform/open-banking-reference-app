import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

export function useFadeIn(props: Partial<Animated.TimingAnimationConfig> = {} as Animated.TimingAnimationConfig) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => Animated.timing(opacity, { toValue: 1, delay: 0, useNativeDriver: true, ...props }).start(), [
    opacity,
    props
  ])
  return opacity
}
