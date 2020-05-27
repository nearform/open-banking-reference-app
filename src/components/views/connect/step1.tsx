import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Connection } from 'src/types'

import Message from 'components/molecules/message'
import Subheader from 'components/organisms/subheader'
import { RoundButton } from 'components/atoms/button'

import { colors } from 'constants/colors'

interface Props {
  onContinue(): void
  connection: Connection
}

const Step1: React.FC<Props> = ({ connection, onContinue }) => {
  const { t } = useTranslation()

  return (
    <ScrollView>
      <View style={styles.view}>
        <Subheader title={t('connect:step1:title', { name: connection.hub_name })} hideBackButton />
        <View style={styles.messages}>
          <View>
            <Message isAvatarVisible isBot id={0} text={connection.invitation} icon="ic-transfer-2" date={Date.now()} />
          </View>
        </View>
        <Text style={styles.agreement}>{t('connect:step1:agreement1')}</Text>
        <View style={styles.addAccountButton}>
          <RoundButton onPress={onContinue}>{t('connect:step1:formSubmit')}</RoundButton>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  messages: {
    padding: 12,
    paddingBottom: 0,
    paddingRight: 18,
    width: '100%'
  },
  agreement: {
    padding: 12,
    paddingLeft: 18,
    paddingRight: 18,
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 24
  },
  addAccountButton: {
    padding: 12,
    paddingLeft: 18,
    paddingRight: 18,
    width: '100%'
  }
})

export default Step1
