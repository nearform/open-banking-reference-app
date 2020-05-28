import React, { useState } from 'react'
import i18next from 'i18next'
import {
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Picker,
  Platform,
  ActionSheetIOS
} from 'react-native'
import { useTranslation } from 'react-i18next'
import uuid from 'uuid/v4'
import { compose, connect, AppState, Dispatch } from 'store'
import {
  createAction as createActionAction,
  updateAction as updateActionAction,
  deleteAction as deleteActionAction
} from 'store/actions/actions'

import { RouteComponentProps } from 'routing'

import { RoundButton } from 'components/atoms/button'
import Account from 'components/organisms/account'
import Subheader from 'components/organisms/subheader'
import Icon from 'components/atoms/icon'

import ActionComplete from './complete'

import { Action } from 'src/types'
import { colors } from 'constants/colors'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface MatchParams {
  type: string
  id?: string
  connection: string
}

type Props = MapStateToProps & MapDispatchToProps & RouteComponentProps<MatchParams>

const conditions = [
  {
    label: i18next.t('actions:condition.conditional'),
    value: 'conditional'
  },
  {
    label: i18next.t('actions:condition.scheduled'),
    value: 'scheduled'
  }
]

export const CreateAction: React.FC<Props> = ({
  match: { params },
  activeAction,
  connection,
  loading,
  createAction,
  updateAction,
  deleteAction,
  history
}) => {
  const { t } = useTranslation(['common', 'transactions', 'overview', 'months'])
  const [completed, setCompleted] = useState(false)
  // all properties need default value or React will complain about unmanaged text fields
  const [edited, setEdited] = useState<Action>({
    name: '',
    note: '',
    amount: '',
    selection: '',
    customSelection: false,
    type: 'conditional',
    ...activeAction
  } as Action)
  const [selectedConditionIndex, setSelectedConditionIndex] = useState(
    params.type === 'scheduled' ? 1 : conditions.findIndex(({ value }) => value === edited.type)
  )

  const getAction = () => ({
    ...edited,
    to: connection!,
    id: edited.id || uuid(),
    type: conditions[selectedConditionIndex].value,
    balanceMonitor: activeAction?.balanceMonitor
  })

  const onActionDelete = () => {
    try {
      deleteAction(getAction())
      history.push(`/actions/${params.connection}`)
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(t('error:message'))
      } else {
        Alert.alert(t('error:title'), t('error:message'))
      }
    }
  }

  const onActionSave = () => {
    const fn = edited.id ? updateAction : createAction
    try {
      fn(getAction())
      setCompleted(true)
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(t('error:message'))
      } else {
        Alert.alert(t('error:title'), t('error:message'))
      }
    }
  }

  const { id, name, amount, note, selection, customSelection } = edited

  const selectionOptions =
    params.type === 'scheduled' || selectedConditionIndex !== 0
      ? [t('actions:create:first'), t('actions:create:middle'), t('actions:create:last')]
      : ['50', '100', '200']

  if (!connection) {
    return null
  }

  if (completed) {
    return <ActionComplete />
  }

  return (
    <>
      <View style={styles.view}>
        <Subheader title={t('actions:title')} />
        {loading ? (
          <View style={[styles.loadingContainer]}>
            <View>
              <Text style={styles.loadingText}>{t('actions:create:loading')}</Text>
            </View>
          </View>
        ) : (
          <ScrollView style={styles.form}>
            <TextInput
              placeholder={t('actions:create:name')}
              placeholderTextColor="rgb(155, 161, 161)"
              onChangeText={value => setEdited({ ...edited, name: value })}
              style={styles.input}
              value={name}
            />
            <View style={styles.listContainer}>
              <Text style={styles.transferControlTitle}>{t('actions:create:to')}</Text>
              <View style={styles.accountContainer}>
                <Account connection={connection} highlight />
              </View>
              <View style={styles.notes}>
                <TextInput
                  placeholder={t('actions:create:note')}
                  placeholderTextColor="rgb(155, 161, 161)"
                  onChangeText={value => setEdited({ ...edited, note: value })}
                  style={styles.input}
                  value={note}
                />
              </View>
              <View style={styles.amount}>
                <Text style={styles.label}>{t('actions:create:amount')}</Text>
                <View style={styles.inputFull}>
                  <TextInput
                    style={[styles.input, styles.amountInput, !note && styles.inputPlaceholder]}
                    placeholder={t('actions:create:amountPlaceholder')}
                    placeholderTextColor={colors.darkGrey}
                    onChangeText={text => setEdited({ ...edited, amount: text })}
                    keyboardType="numeric"
                    returnKeyType="done"
                    allowFontScaling={false}
                    {...{
                      type: 'number',
                      min: '0',
                      pattern: '[0-9]*',
                      inputMode: 'numeric'
                    }}
                    value={amount}
                  />
                  <View style={styles.currencyContainer}>
                    <Text style={styles.inputCurrency}>GBP</Text>
                  </View>
                </View>
              </View>
              <View style={styles.conditionContainer}>
                <Text style={styles.label}>{t('actions:create:condition')}</Text>
                {Platform.OS === 'ios' ? (
                  <View style={styles.selectContainer}>
                    <Text
                      style={styles.select}
                      onPress={() => {
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            options: [...conditions.map(({ label }) => label), 'Cancel'],
                            cancelButtonIndex: conditions.length
                          },
                          index => index !== conditions.length && setSelectedConditionIndex(index)
                        )
                      }}
                    >
                      {t(`actions:condition:${conditions[selectedConditionIndex].value}`)}
                    </Text>
                    <View style={styles.arrow}>
                      <Icon name="ic-chevron" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.selectContainer}>
                    <Picker
                      style={styles.select}
                      selectedValue={conditions[selectedConditionIndex].value}
                      onValueChange={(_, index) => setSelectedConditionIndex(index)}
                    >
                      {conditions.map(condition => (
                        <Picker.Item key={condition.value} {...condition} />
                      ))}
                    </Picker>
                    <View style={styles.arrow}>
                      <Icon name="ic-chevron" />
                    </View>
                  </View>
                )}
                <View style={styles.valuesContainer}>
                  {selectionOptions.map(value => (
                    <TouchableWithoutFeedback
                      onPress={() => setEdited({ ...edited, selection: value, customSelection: false })}
                      key={value}
                    >
                      <View style={[styles.valueContainer, selection === value ? { backgroundColor: '#fa7a9b' } : {}]}>
                        <Text style={[styles.value, selection === value ? { color: 'white' } : {}]}>{value}</Text>
                        {selectedConditionIndex === 0 && (
                          <Text style={[styles.currency, selection === value ? { color: 'white' } : {}]}>GBP</Text>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                  <TextInput
                    placeholder={t('actions:create:custom')}
                    placeholderTextColor={colors.darkBlue}
                    onChangeText={value => setEdited({ ...edited, selection: value, customSelection: true })}
                    style={[styles.input, styles.custom]}
                    value={customSelection ? selection : ''}
                  />
                </View>
              </View>
              <View style={styles.button}>
                <RoundButton disabled={!name || !selection || !amount} onPress={onActionSave}>
                  {activeAction ? t('actions:create:update') : t('actions:create:create')}
                </RoundButton>
              </View>
              {id && (
                <View style={styles.button}>
                  <RoundButton onPress={onActionDelete}>{t('actions:create:delete')}</RoundButton>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  )
}

const mapStateToProps = (state: AppState, ownProps: { match: { params: MatchParams } }) => ({
  connection: state.connection.connections.find(c => c.id === ownProps.match.params.connection),
  activeAction: state.actions.actions.find(a => a.id === ownProps.match.params.id),
  loading: state.actions.loading
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  createAction: (action: Action) => dispatch(createActionAction(action)),
  updateAction: (action: Action) => dispatch(updateActionAction(action)),
  deleteAction: (action: Action) => dispatch(deleteActionAction(action))
})

export default compose(connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps))(CreateAction)

const styles = StyleSheet.create({
  input: {
    height: 43,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    borderRadius: 6,
    padding: 11,
    fontSize: 16,
    fontFamily: 'fira-sans',
    fontStyle: 'italic',
    width: '100%'
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 43,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    borderRadius: 6,
    width: '100%',
    marginTop: 8,
    borderColor: 'transparent',
    paddingHorizontal: 11
  },
  select: {
    flex: 1
  },
  arrow: {
    transform: [{ rotate: '90deg' }],
    marginRight: 11
  },
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 30,
    width: '100%'
  },
  listContainer: {
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
  transferControlTitle: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.51,
    color: colors.lightBlue,
    marginVertical: 14
  },
  notes: {
    marginVertical: 16
  },
  accountContainer: {
    marginTop: 0,
    marginBottom: 12
  },
  titleWithMargin: {
    marginTop: 14,
    marginRight: 4
  },
  touchableWithIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountInput: {
    fontFamily: 'fira-sans',
    letterSpacing: -0.28,
    textAlign: 'right',
    paddingRight: 36
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  label: {
    color: colors.darkBlue,
    paddingRight: 15,
    fontSize: 16,
    fontFamily: 'fira-sans-semi-bold',
    lineHeight: 22,
    letterSpacing: -0.51,
    marginTop: 8
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
  inputFull: {
    flex: 1,
    display: 'flex'
  },
  inputPlaceholder: {
    fontStyle: 'italic'
  },
  conditionContainer: {
    marginTop: 28
  },
  valuesContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 20
  },
  valueContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    marginRight: 8,
    borderRadius: 2
  },
  value: {
    fontFamily: 'fira-sans-bold',
    fontSize: 21,
    marginRight: 2
  },
  currency: {
    fontFamily: 'fira-sans-bold',
    fontSize: 14
  },
  custom: {
    width: 80,
    fontStyle: 'normal',
    fontFamily: 'fira-sans-bold',
    color: colors.darkBlue
  },
  button: {
    marginTop: 20,
    marginBottom: Platform.OS !== 'web' ? 80 : 0
  },
  loadingContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black
  }
})
