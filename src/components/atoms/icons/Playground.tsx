import React from 'react'
import { View, StyleSheet } from 'react-native'
import icons from '.'

const IconPlayground = () => (
  <View style={styles.playground}>
    {icons.map(({ name, icon: Icon }) => (
      <View style={styles.icon} key={name}>
        <Icon width="50" height="50" />
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  playground: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  icon: {
    marginLeft: 10
  }
})

export default IconPlayground
