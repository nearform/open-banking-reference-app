import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Platform,
  Image,
  TextInput
} from 'react-native'

import { useTranslation } from 'react-i18next'

import { RoundButton } from 'components/atoms/button'
import Account from 'components/organisms/account'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { Connection as ConnectionType } from 'src/types'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

interface Props {
  onContinue(): void
  onChangeAmount(amount: string): void
  amount: string
  connection: ConnectionType
}

const Step2: React.FC<Props> = ({ amount, connection, onChangeAmount, onContinue }) => {
  const { t } = useTranslation()
  const opacity = useFadeIn()

  const [note, setNote] = useState('')

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader title={t('transfers:step3:title')} />

        <ScrollView contentContainerStyle={styles.transferAction}>
          <View style={styles.container}>
            <KeyboardAvoidingView>
              <Text style={styles.transferControlTitle}>{t('transfers:step3:to')}</Text>
              <View style={styles.accountContainer}>
                <Account connection={connection} highlight />
              </View>
              <View style={styles.notes}>
                <TextInput
                  style={[styles.input, !note && styles.inputPlaceholder]}
                  placeholder={t('transfers:step3:notePlaceholder')}
                  placeholderTextColor={colors.darkGrey}
                  onChangeText={setNote}
                  returnKeyType="next"
                />
                <View style={styles.imgInputIcon}>
                  <Image source={require('assets/icons/icCamera.png')} style={{ width: 28, height: 28 }} />
                </View>
              </View>
              <View style={styles.amount}>
                <Text style={styles.amountHeading}>{t('transfers:step3:amount')}</Text>
                <View style={styles.inputFull}>
                  <TextInput
                    style={[styles.input, styles.amountInput, !note && styles.inputPlaceholder]}
                    placeholder={t('transfers:step3:amountPlaceholder')}
                    placeholderTextColor={colors.darkGrey}
                    onChangeText={onChangeAmount}
                    keyboardType="numeric"
                    returnKeyType="done"
                    allowFontScaling={false}
                    value={amount}
                    {...{
                      type: 'number',
                      min: '0',
                      pattern: '[0-9]*',
                      inputMode: 'numeric'
                    }}
                  />
                  <View style={styles.currencyContainer}>
                    <Text style={styles.inputCurrency}>GBP</Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <RoundButton onPress={onContinue}>{t('transfers:step3:formSubmit')}</RoundButton>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  )
}

export default Step2

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    paddingTop: screenNormalizer.top,
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
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 20
  },
  header: {
    marginBottom: 40,
    flex: 0
  },
  backButton: {
    position: 'absolute',
    left: 21,
    top: 3,
    zIndex: 2,
    transform: [{ rotate: '-180deg' }]
  },
  touchableWithIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontFamily: 'NB',
    fontSize: 21,
    fontStyle: 'normal',
    letterSpacing: -0.51,
    textAlign: 'center',
    color: colors.black
  },
  titleWithMargin: {
    marginTop: 14,
    marginRight: 4
  },
  transferAction: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 12
  },
  transferControlTitle: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.51,
    color: colors.lightBlue,
    marginBottom: 12
  },
  accountContainer: {
    marginTop: 0,
    marginBottom: 12
  },
  input: {
    borderRadius: 6,
    height: 40,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    padding: 8,
    fontFamily: 'fira-sans',
    fontSize: 16,
    letterSpacing: -0.16,
    paddingRight: 48
  },
  inputPlaceholder: {
    fontStyle: 'italic'
  },
  imgInputIcon: {
    position: 'absolute',
    right: 10,
    top: 6
  },
  inputFull: {
    flex: 1,
    display: 'flex'
  },
  currencyContainer: {
    display: 'flex',
    position: 'absolute',
    right: 6,
    borderLeftWidth: 1,
    borderLeftColor: colors.grey,
    height: 26,
    marginTop: 7,
    marginBottom: 7,
    paddingLeft: 5,
    justifyContent: 'center'
  },
  inputCurrency: {
    fontFamily: 'fira-sans',
    fontSize: 12,
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.darkGrey
  },
  amountInput: {
    fontFamily: 'fira-sans',
    letterSpacing: -0.28,
    textAlign: 'right',
    paddingRight: 36
  },
  notes: {
    marginBottom: 16,
    marginTop: 25
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  amountHeading: {
    color: colors.darkBlue,
    paddingRight: 15,
    fontSize: 16,
    fontFamily: 'fira-sans-semi-bold',
    lineHeight: 22,
    letterSpacing: -0.51,
    marginTop: 8
  },
  buttonContainer: {
    marginTop: 23,
    paddingTop: 23,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey
  },
  errorMessage: {
    padding: 20,
    fontFamily: 'fira-sans-bold',
    fontSize: 14,
    letterSpacing: -0.34,
    textAlign: 'center',
    color: colors.black,
    margin: 6
  }
})
