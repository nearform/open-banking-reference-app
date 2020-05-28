import React from 'react'
import { View, Text, StyleSheet, Animated, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'

import Icon from 'components/atoms/icon'
import { RoundButton } from 'components/atoms/button'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { Account, Connection } from 'src/types'
import { useFadeIn } from 'utils/hooks'

interface Props {
  onContinue(): void
  account: Account
  connection: Connection
  transferredAmount: string
}

const Completed: React.FC<Props> = ({ connection, onContinue, account, transferredAmount }) => {
  const { t } = useTranslation()
  const opacity = useFadeIn()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader title={t('transfers:step2:title')} />
        <View style={[styles.container, styles.completeContainer]}>
          <View>
            <View style={styles.icon}>
              <Icon fill={colors.darkBlue} width="60" height="60" name="ic-checked" />
            </View>
            <Text style={styles.completeHeading}>{t('transfers:step3:title')}</Text>
            <Text style={styles.completeText}>
              {t('transfers:step3:transferOf')}{' '}
              <Text>
                {transferredAmount} {account?.currency}
              </Text>{' '}
              {t('transfers:step3:to')} <Text style={styles.completeTextInner}>{connection?.connection_name}</Text>{' '}
              {t('transfers:step3:success')}
            </Text>
            <View style={styles.completeButtonContainer}>
              <RoundButton onPress={onContinue} background={colors.orange}>
                {t('transfers:step3:submit')}
              </RoundButton>
            </View>
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
  completeButtonContainer: { marginTop: 29 },
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

export default Completed
