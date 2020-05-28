import React, { useState } from 'react'
import { ScrollView, View, Animated, Text, StyleSheet, Platform, Image } from 'react-native'
import { useTranslation } from 'react-i18next'

import Checkbox from 'components/atoms/checkbox'
import Icon from 'components/atoms/icon'
import Subheader from 'components/organisms/subheader'
import { RoundButton } from 'components/atoms/button'

import { Connection, Institution } from 'src/types'
import { screenNormalizer } from 'src/utils'
import { colors } from 'constants/colors'
import { useFadeIn } from 'src/utils/hooks'

interface Props {
  connection: Connection
  institution: Institution
  onContinue(): void
}

const Step3: React.FC<Props> = ({ connection, institution, onContinue }) => {
  const { t } = useTranslation()
  const opacity = useFadeIn()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [furtherTermsAccepted, setFurtherTermsAccepted] = useState(false)

  if (!institution) {
    return null
  }

  const icon = institution.media.find(media => media.type === 'icon')

  return (
    <Animated.View style={{ flex: 1, opacity, width: '100%' }}>
      <ScrollView>
        <View style={styles.view}>
          <Subheader hideBackButton title={t('connect:step3:title')} />

          <View style={styles.container}>
            <Text style={styles.subtitle}>{t('connect:step3:subtitle')}</Text>
          </View>

          {icon !== undefined && (
            <View style={styles.logoContainer}>
              <Icon name="ic-polaris" style={[styles.logo]} />
              <Text style={styles.logoSeparator}>{'\u22ef'}</Text>
              <Image source={{ uri: icon.source }} style={[styles.logo]} />
            </View>
          )}

          <Text style={styles.message}>
            {t('connect:step3:message1', { provider: institution.name, name: connection.hub_name })}
          </Text>

          <Text style={styles.message}>{t('connect:step3:message2')}</Text>

          <View style={styles.provider}>
            <Text style={styles.providerTitle}>{institution.name}</Text>
            <Text style={styles.providerType}>Account type</Text>
            <Text style={styles.providerType}>IBAN</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
            <Text style={styles.checkboxLabel}>{t('connect:step3:agreement1')}</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox checked={furtherTermsAccepted} onChange={() => setFurtherTermsAccepted(!furtherTermsAccepted)} />
            <Text style={styles.checkboxLabel}>{t('connect:step3:agreement2')}</Text>
          </View>

          <Text style={styles.message}>{t('connect:step3:agreement3', { date: new Date() })}</Text>

          <View style={styles.continueButton}>
            <RoundButton disabled={!furtherTermsAccepted || !termsAccepted} onPress={onContinue}>
              {t('connect:step3:formSubmit', { provider: institution.name })}
            </RoundButton>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: screenNormalizer.top,
    paddingBottom: screenNormalizer.bottom,
    ...Platform.select({
      android: {
        paddingTop: 0
      },
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
    paddingTop: 20
  },
  subtitle: {
    marginLeft: 16,
    marginRight: 16,
    fontFamily: 'fira-sans-semi-bold',
    color: colors.lightBlue,
    fontSize: 16
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoSeparator: {
    fontSize: 42,
    color: colors.grey,
    padding: 18
  },
  logo: {
    width: 36,
    height: 36
  },
  message: {
    padding: 12,
    paddingLeft: 18,
    paddingRight: 18,
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 24
  },
  provider: {
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
    padding: 8,
    margin: 18,
    marginTop: 8
  },
  providerTitle: {
    fontFamily: 'fira-sans',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24
  },
  providerType: {
    fontFamily: 'fira-sans',
    fontWeight: '100',
    fontSize: 16,
    lineHeight: 24
  },
  checkboxContainer: {
    flexDirection: 'row',
    padding: 18,
    paddingTop: 8,
    paddingBottom: 8
  },
  checkboxLabel: {
    fontFamily: 'fira-sans',
    fontWeight: '100',
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 18
  },
  continueButton: {
    padding: 12,
    paddingLeft: 18,
    paddingRight: 18,
    width: '100%'
  }
})

export default Step3
