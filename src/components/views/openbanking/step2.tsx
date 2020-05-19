import React from 'react'
import { View, Animated, Text, StyleSheet, Platform, Image, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

import Checkbox from 'components/atoms/checkbox'
import { RoundButton } from 'components/atoms/button'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

interface Props {
  onContinue(): void
  onBack(): void
}

// Note: this step is hardcoded for adding account from santander bank.
// It is unused for now.
const Step2: React.FC<Props> = ({ onBack, onContinue }) => {
  const opacity = useFadeIn()
  const { t } = useTranslation()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <ScrollView>
        <View style={styles.view}>
          <Subheader title={t('openbanking:step2:title')} onBackPress={onBack} />
          <View style={styles.container}>
            <Text style={styles.subtitle}>{t('openbanking:step2:subtitle')}</Text>
            <View style={styles.figure}>
              <Image source={require('assets/logos/appicon.png')} style={styles.bankLogo} />
              <View style={styles.row}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <Image source={require('assets/logos/santander.png')} style={[styles.bankLogo, { marginLeft: 15 }]} />
            </View>

            <View style={styles.banksContainer}>
              <Text style={styles.text}>{t('openbanking:step2:text1')}</Text>
              <Text style={styles.text}>{t('openbanking:step2:text2')}</Text>
              <View style={styles.separator} />

              <View style={styles.formRow}>
                <Checkbox />
                <Text style={styles.checkboxLabel}>{t('openbanking:step2:agreement1')}</Text>
              </View>
              <View style={styles.formRow}>
                <Checkbox />
                <Text style={styles.checkboxLabel}>{t('openbanking:step2:agreement2')}</Text>
              </View>
              <View style={styles.formSubmit}>
                <RoundButton onPress={onContinue} background={colors.orange}>
                  {t('openbanking:step2:formSubmit')}
                </RoundButton>
              </View>
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
  container: {
    padding: 16,
    paddingTop: 20
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
  figure: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 25
  },
  bankLogo: { width: 32, height: 32, borderRadius: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
    marginLeft: 15
  },
  subtitle: {
    fontFamily: 'fira-sans-semi-bold',
    color: colors.lightBlue,
    fontSize: 16
  },
  text: {
    fontFamily: 'fira-sans',
    color: colors.black,
    fontSize: 16,
    marginTop: 10
  },
  banksContainer: {},
  account: {
    marginTop: 18
  },
  separator: {
    height: 1,
    backgroundColor: colors.lightGrey,
    marginTop: 23
  },
  formRow: {
    flexDirection: 'row',
    marginTop: 20
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'fira-sans',
    color: colors.black,
    marginLeft: 18
  },
  formSubmit: {
    marginTop: 31
  }
})

export default Step2
