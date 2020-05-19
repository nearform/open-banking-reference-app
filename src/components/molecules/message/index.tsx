import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Image } from 'react-native'
import { AppState } from 'store'

import BotMessage from 'components/atoms/bot-message'
import { colors } from 'constants/colors'

type Props = {
  isAvatarVisible: boolean
} & AppState['assistant']['messages'][0]

const Message: React.FC<Props> = ({ id, text, isAvatarVisible, isBot }) => (
  <TouchableOpacity {...(Platform.OS !== 'web' && { activeOpacity: id === 3 ? 0.9 : 0.8 })}>
    {isBot && <BotMessage text={text} />}
    {!isBot && (
      <Animated.View style={styles.message}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>

        {isAvatarVisible && (
          <View style={styles.avatarContainer}>
            <Image source={require('assets/avatars/avi1.png')} style={styles.avatar} />
          </View>
        )}
      </Animated.View>
    )}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  message: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },

  textContainer: {
    maxWidth: '80%',
    width: '100%',
    marginRight: 16,
    borderRadius: 6,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  text: {
    backgroundColor: colors.SOFT_RED,
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 24,
    paddingVertical: 10,
    paddingHorizontal: 13,
    color: colors.white
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

export default Message
