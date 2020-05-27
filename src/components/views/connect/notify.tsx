import React, { useMemo } from 'react'
import { View, Text, StyleSheet, Animated, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { compose, connect, AppState } from 'store'
import { withRouter, RouteComponentProps } from 'src/routing'

import Subheader from 'components/organisms/subheader'
import { RoundButton } from 'components/atoms/button'

import { colors } from 'constants/colors'
import { useFadeIn } from 'src/utils/hooks'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type Props = RouteComponentProps<{ id: string }> & MapStateToProps

export const Notify: React.FC<Props> = ({
  connections,
  history,
  match: {
    params: { id }
  }
}) => {
  const {t} = useTranslation()
  const opacity = useFadeIn()

  const connection = useMemo(() => connections.find(connection => connection.id === id), [connections, id])

  if (!connection) return null

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader hideBackButton title={t('connect:notify:title')} />
        <View style={styles.notifyContainer}>
          <View style={styles.messageIcon} />
          <Text style={styles.notifyText}>
            {t('connect:notify:message', {
              username: connection.hub_name,
              connectionName: connection.connection_name
            })}
            <View style={styles.button}>
              <RoundButton
                stretch
                spacer={12}
                background={colors.lightGrey}
                textColor={colors.orange}
                onPress={() => history.push(`/actions/${id}`)}
              >
                {t('connect:notify:action')}
              </RoundButton>
            </View>
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const mapStateToProps = (state: AppState) => ({
  connections: state.connection.connections
})

export default compose(withRouter, connect<MapStateToProps>(mapStateToProps))(Notify)

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
  notifyContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16
  },
  messageIcon: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.darkBlue,
    marginRight: 16,
    marginTop: 7
  },
  notifyText: {
    fontSize: 16,
    letterSpacing: 0.32,
    lineHeight: 24,
    fontFamily: 'fira-sans',
    color: colors.black
  },
  notifyTextInner: {
    fontFamily: 'fira-sans-semi-bold'
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  button: {
    width: '100%',
    marginTop: 16
  }
})
