import React from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native'

import { Link } from 'routing'

import Icon from '../icon'

import { colors } from 'constants/colors'

interface Props {
  to?: string
  icon?: string
  fill?: string
}

const SimpleButton: React.FC<Props> = ({ children, to, icon = 'ic-chevron', fill = colors.black }) => {
  const content = (
    <View style={styles.button}>
      <Text style={[styles.text]} {...(Platform.OS !== 'web' && { textAlignVertical: 'center' })}>
        {children}
      </Text>
      <Icon name={icon} fill={fill} />
    </View>
  )

  return to ? (
    <Link
      style={{ textDecorationLine: 'none' }}
      to={to}
      {...(Platform.OS !== 'web' && { component: TouchableWithoutFeedback })}
    >
      {content}
    </Link>
  ) : (
    <TouchableWithoutFeedback>{content}</TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0
  },
  text: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 22,
    marginRight: 7
  }
})
export default SimpleButton
