import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

interface Props {
  children: React.ReactNode
  background?: string
}

const Badge: React.FC<Props> = ({ children, background }) => (
  <View style={styles.badge}>
    <View style={StyleSheet.flatten([styles.bg, background ? { backgroundColor: background } : {}])} />
    <Text style={styles.text}>{children}</Text>
  </View>
)

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderColor: 'rgba(206, 209, 209, 0.1)'
  },
  bg: {
    position: 'absolute',
    top: -1,
    right: -1,
    bottom: -1,
    left: -1,
    backgroundColor: 'red',
    borderRadius: 11
  },
  text: {
    position: 'relative',
    color: 'white',
    fontFamily: 'fira-sans-bold',
    fontSize: 11,
    top: Platform.OS === 'android' ? -1 : 2
  }
})

export default Badge
