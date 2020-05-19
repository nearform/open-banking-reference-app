import React from 'react'
import { View, Animated, Text, StyleSheet, Platform, Image, TextInput, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'routing'

import { RoundButton } from 'components/atoms/button'

import { colors } from 'constants/colors'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

interface Props {
  onContinue(): void
}

// Note: this step is hardcoded for adding account from santander bank.
// It is unused for now.
const Step3: React.FC<Props> = ({ onContinue }) => {
  const opacity = useFadeIn()
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <ScrollView>
        <View style={[styles.view, styles.notNormalized]}>
          <View style={styles.stripe} />

          <View style={styles.figure}>
            <Image source={require('assets/logos/santander-big.png')} style={styles.santanderLogo} />
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>{t('openbanking:step3:title')}</Text>

            <TextInput
              placeholderTextColor={colors.darkGrey}
              style={styles.field}
              placeholder={t('openbanking:step3:field1Placeholder')}
              value="myaccount@santander.com"
            />
            <TextInput
              placeholderTextColor={colors.darkGrey}
              style={styles.field}
              placeholder={t('openbanking:step3:field2Placeholder')}
              value="123456789"
              secureTextEntry
            />

            <View style={styles.submit}>
              <RoundButton
                onPress={() => {
                  onContinue()
                  history.goBack()
                }}
                background="#FF0000"
              >
                {t('openbanking:step3:formSubmit')}
              </RoundButton>
            </View>
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
  notNormalized: {
    paddingTop: 0,
    paddingBottom: 0
  },
  header: {
    marginBottom: 15
  },
  backButton: {
    position: 'absolute',
    left: 21,
    top: 3,
    zIndex: 2,
    transform: [{ rotate: '-180deg' }]
  },
  headerTitle: {
    fontFamily: 'NB',
    fontSize: 21,
    fontStyle: 'normal',
    letterSpacing: -0.51,
    textAlign: 'center',
    color: colors.black
  },
  stripe: {
    height: 70 + screenNormalizer.top,
    paddingTop: screenNormalizer.top,
    backgroundColor: '#FF0000'
  },
  figure: {
    marginTop: 38,
    width: '100%',
    alignItems: 'center'
  },
  santanderLogo: {
    width: 93,
    height: 93
  },
  container: {
    padding: 16,
    alignItems: 'center'
  },
  title: {
    marginTop: 48,
    color: colors.black,
    fontSize: 21,
    fontFamily: 'fira-sans-semi-bold'
  },
  field: {
    marginTop: 25,
    width: '100%',
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
    color: colors.grey,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    borderRadius: 6
  },
  submit: {
    width: '100%',
    marginTop: 37
  }
})

export default Step3
