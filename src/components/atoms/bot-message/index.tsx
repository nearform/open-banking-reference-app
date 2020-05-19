import React from 'react'
import { Animated, View, StyleSheet, Text } from 'react-native'
import { colors } from 'constants/colors'
import Icon from '../icon'

interface Props {
  text: string
}

const BotMessage: React.FC<Props> = ({ text }) => (
  <Animated.View style={styles.message}>
    <View style={styles.avatarContainer}>
      <Icon name={'bot-avatar'} width="48" height="48" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  </Animated.View>
)

const styles = StyleSheet.create({
  message: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  textContainer: {
    maxWidth: '80%',
    width: '100%',
    marginLeft: 16,
    borderRadius: 6,
    overflow: 'hidden'
  },
  text: {
    backgroundColor: colors.lightGrey,
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 24,
    paddingVertical: 10,
    paddingHorizontal: 13,
    color: colors.black
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  avatar: {
    width: 48,
    height: 48
  }
})

export default BotMessage
