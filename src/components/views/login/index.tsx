import React, { useEffect, useRef } from 'react'
import { Animated, Platform, StyleSheet, Text, View } from 'react-native'
import { Interpreter, Actor } from 'xstate'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useService } from '@xstate/react'
import { screenNormalizer } from 'utils'

import Icon from 'components/atoms/icon'
import PIN from 'components/organisms/pin'
import Keyboard from 'components/organisms/keyboard'

import { colors } from 'constants/colors'
import {
  AuthenticationSchema,
  AuthenticationEvent,
  AuthenticationState,
  PinContext,
  PinSchema,
  PinEvent,
  PinEventType
} from 'utils/machines'

interface WrapperProps {
  authenticationService: Interpreter<{}, AuthenticationSchema, AuthenticationEvent>
}

interface Props {
  pinService: Actor<PinContext, PinEvent>
}

// this wrapper is necessary to ensure we're not erroring by passing undefined in to `useService` for the child actor
export const Login: React.FC<WrapperProps> = ({ authenticationService }) => {
  const history = useHistory()
  const [current] = useService(authenticationService)

  useEffect(() => {
    if (current.matches(AuthenticationState.Authenticated)) {
      history.push('/overview')
    }
  }, [current, history])

  const pinService = authenticationService.children.get('pinMachine')

  return pinService ? <PinEntry pinService={pinService} /> : null
}

export const PinEntry: React.FC<Props> = ({ pinService }) => {
  const { t } = useTranslation()
  const translateY = useRef<Animated.Value>(new Animated.Value(300)).current

  // `pinService as unknown` works around issue with actor and service types - https://github.com/davidkpiano/xstate/issues/772
  const [current, send] = useService((pinService as unknown) as Interpreter<PinContext, PinSchema, PinEvent>)

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true
    }).start()
  })

  const { pin, pinLength } = current.context

  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <Icon name="ic-logo" fill={colors.black} />
      </View>
      <View style={styles.pinContainer}>
        <Text style={styles.title}>{t('PIN:title')}</Text>
        <PIN pin={pin} size={pinLength} />
      </View>
      <View style={styles.keyboardContainer}>
        <Animated.View style={[styles.keyboard, { transform: [{ translateY }] }]}>
          <Keyboard
            for={pin}
            onInput={key => send({ type: PinEventType.Input, key })}
            onDelete={() => send(PinEventType.Delete)}
          />
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingTop: 70 + screenNormalizer.top
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  pinContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  keyboardContainer: {
    flex: 1,
    flexGrow: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    paddingBottom: 30
  },
  title: {
    fontFamily: 'fira-sans-bold',
    fontSize: 18,
    color: colors.darkBlue,
    marginBottom: 40
  },
  keyboard: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: { paddingBottom: 25 }
    })
  }
})

export default Login
