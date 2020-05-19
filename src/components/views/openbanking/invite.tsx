import React, { useState } from 'react'
import { Linking } from 'expo'
import { View, StyleSheet, TextInput, Platform, Text, ScrollView, Alert } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { useTranslation } from 'react-i18next'
import validator from 'email-validator'

import { connect, Dispatch } from 'store'
import {
  createConnection as createConnectionAction,
  ConnectionRequestBody,
  ConnectionResponse
} from 'store/actions/connection'

import urls from 'src/urls'

import Icon from 'components/atoms/icon'
import Subheader from 'components/organisms/subheader'
import { RoundButton } from 'components/atoms/button'

import { colors } from 'constants/colors'

type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface FormItem {
  name: string
  value: string
  focus: boolean
}

export const Invite: React.FC<MapDispatchToProps> = ({ createConnection }) => {
  const { t } = useTranslation()
  const [shareLink, setShareLink] = useState<string>()
  const [form, setForm] = useState<FormItem[]>([
    { name: 'name', value: '', focus: false },
    { name: 'contact', value: '', focus: false },
    { name: 'message', value: '', focus: false }
  ])

  const setFocus = (key: string, value: boolean) => {
    setForm(form.map(item => (item.name === key ? { ...item, focus: value } : item)))
  }

  const setFormValue = (key: string, value: string) => {
    setForm(form.map(item => (item.name === key ? { ...item, value } : item)))
  }

  const makeConnection = async () => {
    const name = form[0].value
    const contact = form[1].value
    const message = form[2].value

    return createConnection({
      hub_user_id: '1234',
      hub_name: 'Anne-Marie',
      connection_name: name,
      [validator.validate(contact) ? 'email' : 'phone_number']: contact,
      invitation: message
    })
  }

  const doShowQR = async () => {
    try {
      const { id } = await makeConnection()

      setShareLink(`${urls.ui}/connect/${id}`)
    } catch (error) {
      console.error(error)
      Platform.OS === 'web'
        ? alert(t('openbanking:invite:error:message'))
        : Alert.alert(t('openbanking:invite:error:title'), t('openbanking:invite:error:message'))
    }
  }

  const openLink = async () => {
    try {
      const { id } = await makeConnection()

      const link = `${urls.ui}/connect/${id}`
      const contact = form[1].value
      const message = form[2].value
      if (validator.validate(contact)) {
        Linking.openURL(
          `mailto:${contact}?subject=You've been invited to Polaris Bank&body=${message}%0A%0A

  Accept your invite by visiting ${link}`
        )
      } else {
        Linking.openURL(
          `sms:${contact}${Platform.OS === 'ios' ? '&' : '?'}body=${message}

  Accept your invite by visiting ${link}`
        )
      }
    } catch (error) {
      console.error(error)
      Platform.OS === 'web'
        ? alert(t('openbanking:invite:error:message'))
        : Alert.alert(t('openbanking:invite:error:title'), t('openbanking:invite:error:message'))
    }
  }

  const name = form[0].value
  const message = form[2].value

  return (
    <ScrollView>
      <View style={styles.view}>
        <Subheader title={t('openbanking:invite:title')} />
        <View style={styles.form}>
          {form.map(item => (
            <View
              key={item.name}
              style={StyleSheet.flatten([
                styles.inputWrapper,
                { borderBottomColor: item.focus ? colors.orange : 'rgb(206, 209, 209)' },
                item.name === 'message' ? { minHeight: 120, marginBottom: 30 } : {}
              ])}
            >
              <TextInput
                placeholder={t(`openbanking:invite:form:${item.name}`)}
                placeholderTextColor="rgb(155, 161, 161)"
                onChangeText={v => setFormValue(item.name, v)}
                // outlineWidth is only valid in react-native-web so we need to suppress the TS error here
                // @ts-ignore
                style={[styles.input, Platform.OS === 'web' ? { outlineWidth: 0 } : {}]}
                onBlur={() => setFocus(item.name, false)}
                onFocus={() => setFocus(item.name, true)}
                multiline={item.name === 'message'}
                numberOfLines={item.name === 'message' ? 6 : 1}
              />
            </View>
          ))}
          <View>
            <RoundButton
              disabled={!form.every(item => item.value)}
              onPress={openLink}
              background={colors.orange}
              textColor={colors.white}
            >
              {t('openbanking:invite:send')}
            </RoundButton>
            <Text style={styles.text}>{t('openbanking:invite:or')}</Text>
            <RoundButton
              disabled={!(name && message)}
              onPress={doShowQR}
              background={colors.orange}
              textColor={colors.white}
              icon={<Icon name="barcode-qr" width="20" height="20" />}
            >
              {t('openbanking:invite:share')}
            </RoundButton>
            {shareLink && (
              <View style={styles.qr}>
                <QRCode value={shareLink} size={300} />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  createConnection: (options: ConnectionRequestBody): Promise<ConnectionResponse> =>
    createConnectionAction(options)(dispatch)
})

export default connect<{}, MapDispatchToProps>(null, mapDispatchToProps)(Invite)

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  listContainer: {
    width: '100%'
  },
  form: {
    marginVertical: 26,
    paddingHorizontal: 20,
    width: '100%'
  },
  message: {
    paddingTop: 22,
    paddingHorizontal: 20,
    fontFamily: 'fira-sans',
    fontSize: 18,
    width: '100%',
    color: colors.black
  },
  buttonContainer: {
    padding: 12,
    marginBottom: 20
  },
  inputWrapper: {
    borderBottomWidth: 3,
    marginBottom: 26
  },
  input: {
    width: '100%',
    fontSize: 18,
    color: 'rgb(102, 102, 102)',
    padding: 4,
    fontFamily: 'fira-sans',
    textAlignVertical: 'top'
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'rgb(136, 136, 136)',
    fontFamily: 'fira-sans',
    marginVertical: 11
  },
  qr: {
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
