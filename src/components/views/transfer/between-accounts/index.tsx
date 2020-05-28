import React, { useState, useEffect } from 'react'
import { compose, connect, AppState, Dispatch } from 'store'
import { Alert, Linking, Platform } from 'react-native'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import { createPaymentAuthorizationRequest, createPayment } from 'services/api'
import { loadInstitutions as loadInstitutionsAction } from 'store/actions/connection'
import {
  setAmount as setAmountAction,
  setInstitution as setInstitutionAction,
  resetTransfer as resetTransferAction
} from 'store/actions/transfers'
import { withRouter, RouteComponentProps } from 'src/routing'
import { useTranslation } from 'react-i18next'
import { Institution } from 'src/types'
import { useConsent } from 'utils/hooks'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>
type RouteProps = RouteComponentProps<{ id: string }>
interface Props extends MapStateToProps, MapDispatchToProps, RouteProps {}

export const Transfer: React.FC<Props> = ({
  amount,
  institutions,
  connection,
  institution,
  loadInstitutions,
  resetTransfer,
  setAmount,
  setInstitution
}) => {
  const { t } = useTranslation()
  const [inProgress, setInProgress] = useState(false)

  const consent = useConsent()

  useEffect(() => {
    if (consent) {
      const processConsent = async () => {
        try {
          setInProgress(true)
          await createPayment(connection!, amount, consent)
          setInProgress(false)
          resetTransfer()
        } catch (error) {
          if (Platform.OS === 'web') {
            alert(t('error:message'))
          } else {
            Alert.alert(t('error:title'), t('error:message'))
          }
        }
      }

      processConsent()
    } else {
      loadInstitutions()
    }
    // This effect HAS TO run only on consent changes.
    // Unfortunately, because of the nature of our mapsDispatchToProps,
    // loadInstitutions and resetTransfer are changing on every render, and we can not include them
    // in that list
    // Also, we should not trigger on amount changes
  }, [consent, connection, t]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthorize = async () => {
    if (!amount || !connection || !institution) {
      return
    }

    try {
      setInProgress(true)
      const authorizationUrl = await createPaymentAuthorizationRequest(institution, connection, amount)

      if (window && window.location) {
        window.location.href = authorizationUrl
      } else {
        Linking.openURL(authorizationUrl)
      }
    } catch (error) {
      if (Platform.OS === 'web') {
        alert(t('error:message'))
      } else {
        Alert.alert(t('error:title'), t('error:message'))
      }
    }
  }

  return inProgress ? (
    <Step3 />
  ) : consent ? (
    <Step4 amount={amount} connection={connection!} />
  ) : institution ? (
    <Step2 amount={amount} connection={connection!} onChangeAmount={setAmount} onContinue={handleAuthorize} />
  ) : (
    <Step1 institutions={institutions} onContinue={setInstitution} />
  )
}

const mapStateToProps = (state: AppState, ownProps: RouteProps) => ({
  amount: state.transfers.amount,
  connection: state.connection.connections.find(c => c.id === ownProps.match.params.id),
  institutions: state.connection.institutions,
  institution: state.transfers.institution
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loadInstitutions: () => dispatch(loadInstitutionsAction()),
  setAmount: (amount: string) => dispatch(setAmountAction(amount)),
  setInstitution: (institution: Institution) => dispatch(setInstitutionAction(institution)),
  resetTransfer: () => dispatch(resetTransferAction())
})

export default compose(
  withRouter,
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)
)(Transfer)
