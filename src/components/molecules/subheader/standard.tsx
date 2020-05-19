import React from 'react'
import { withRouter, RouteComponentProps } from 'src/routing'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { History } from 'history'
import Icon from 'components/atoms/icon'
import { colors } from 'constants/colors'

interface Props extends RouteComponentProps {
  title?: string
  hideBackButton?: boolean
  onBackPress?({ history }: { history: History }): void
  CustomHeader?: React.ComponentType
}

const SubheaderStandard: React.FC<Props> = ({ title, history, hideBackButton, onBackPress }) => (
  <View style={styles.subheader}>
    {!hideBackButton && (
      <TouchableWithoutFeedback onPress={() => (onBackPress ? onBackPress({ history }) : history.goBack())}>
        <View style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Icon name="ic-chevron" fill={colors.lightBlue} />
          </View>
          <Text style={styles.font}>Back</Text>
        </View>
      </TouchableWithoutFeedback>
    )}
    <Text style={[styles.font, styles.headerTitle, hideBackButton && styles.headerTitleWithoutBackBtn]}>{title}</Text>
  </View>
)

const backButtonWidth = 67
const styles = StyleSheet.create({
  font: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.51
  },
  subheader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  backButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    zIndex: 2,
    alignItems: 'center',
    width: backButtonWidth
  },
  backButton: {
    transform: [{ rotate: '-180deg' }]
  },
  headerTitle: {
    textAlign: 'center',
    color: colors.lightBlue,
    flexGrow: 2,
    paddingRight: backButtonWidth
  },
  headerTitleWithoutBackBtn: {
    paddingRight: 0
  }
})

export default withRouter(SubheaderStandard)
