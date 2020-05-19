import React from 'react'
import { View, Text, StyleSheet, Animated, Platform } from 'react-native'
import { withTranslation, WithTranslation } from 'react-i18next'

import Subheader from 'components/organisms/subheader'
import Icon from 'components/atoms/icon'

import { colors } from 'src/constants/colors'
import { Connection } from 'src/types'
import { useFadeIn } from 'utils/hooks'

interface Props extends WithTranslation {
  amount: string
  connection: Connection
}

const Step4: React.FC<Props> = ({ t, amount, connection }) => {
  const opacity = useFadeIn()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader hideBackButton title={t('transfers:step5:title')} />
        <View style={[styles.container, styles.completeContainer]}>
          <View>
            <View style={styles.icon}>
              <Icon fill={colors.darkBlue} width="60" height="60" name="ic-checked" />
            </View>
            <Text style={styles.completeHeading}>{t('transfers:step5:subtitle')}</Text>
            <Text style={styles.completeText}>
              {t('transfers:step5:message', { amount, name: connection.connection_name, currency: 'GBP' })}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    })
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  completeHeading: {
    fontFamily: 'NB',
    fontSize: 21,
    letterSpacing: -0.51,
    textAlign: 'center',
    color: colors.darkBlue,
    marginBottom: 10
  },
  completeText: {
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black
  },
  completeTextInner: {
    fontFamily: 'fira-sans-semi-bold'
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  }
})

export default withTranslation()(Step4)
