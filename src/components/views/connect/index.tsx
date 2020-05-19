import React, { useState, useEffect } from 'react'
import { Alert, Linking, Platform } from 'react-native'

import { withRouter, RouteComponentProps } from 'src/routing'
import { withTranslation, WithTranslation } from 'react-i18next'

import { compose, connect, AppState, Dispatch } from 'store'
import * as connectionActions from 'store/actions/connection'
import { createAccountAuthorizationRequest, updateConnection } from 'services/api'
import { Institution } from 'src/types'
import { useConsent } from 'utils/hooks'

import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends MapStateToProps, MapDispatchToProps, WithTranslation, RouteComponentProps<{ id: string }> {}

export const Connect: React.FC<Props> = ({
  connection,
  institutions,
  loadConnection,
  loadInstitutions,
  checkConnections,
  match: {
    params: { id }
  },
  t
}) => {
  const [step, setStep] = useState(1)
  const [institution, setInstitution] = useState<Institution>()

  const consent = useConsent()

  useEffect(() => {
    loadInstitutions()
    loadConnection(id)

    if (consent) {
      setStep(4)

      const processConsent = async () => {
        try {
          await updateConnection(id, consent)
          setStep(5)
          // This is required if we want to suggest setting up action on the new connection
          setTimeout(checkConnections, 2000)
        } catch (error) {
          if (Platform.OS === 'web') {
            alert(t('error:message'))
          } else {
            Alert.alert(t('error:title'), t('error:message'))
          }
        }
      }
      processConsent()
    }
    // This effect HAS TO run only on consent and id changes.
    // Unfortunately, because of the nature of our mapsDispatchToProps,
    // loadInstitutions and loadConnection are changing on every render, and we can not include them
    // in that list
  }, [consent, id, t]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthorize = async () => {
    if (!connection || !institution) {
      return
    }

    try {
      setStep(4)
      const authorizationUrl = await createAccountAuthorizationRequest(connection, institution)

      if (!authorizationUrl) {
        return
      }

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

  if (!connection || institutions.length === 0) {
    return null
  }
  return step === 2 ? (
    <Step2
      onContinue={selected => {
        setInstitution(selected)
        setStep(3)
      }}
      institutions={institutions}
    />
  ) : step === 3 ? (
    <Step3 onContinue={handleAuthorize} connection={connection} institution={institution!} />
  ) : step === 4 ? (
    <Step4 />
  ) : step === 5 ? (
    <Step5 />
  ) : (
    <Step1 onContinue={() => setStep(2)} connection={connection} />
  )
}

const mapStateToProps = (state: AppState) => ({
  connection: state.connection.request,
  institutions: state.connection.institutions
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loadConnection: (id: string) => dispatch(connectionActions.loadRequest(id)),
  loadInstitutions: () => dispatch(connectionActions.loadInstitutions()),
  checkConnections: () => dispatch(connectionActions.checkConnections())
})

export default compose(
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation()
)(Connect)
