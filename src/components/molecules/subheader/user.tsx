import React from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import { connect, AppState, Dispatch } from 'store'
import { useTranslation } from 'react-i18next'
import { colors } from 'constants/colors'
import { toggleSidebar as toggleSidebarAction, UIAction } from 'store/actions/ui'
import { getSymbol } from 'services/currencies'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends MapStateToProps, MapDispatchToProps {}

const SubheaderUser: React.FC<Props> = ({ accounts, activeAccount, toggleSidebar }) => {
  const {t} = useTranslation()
  const account = accounts.find(a => a.id === activeAccount)

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <View style={styles.accountNameContainer}>
          <Text style={styles.user} numberOfLines={1}>
            {account ? account.headerTitle || account.title : t('Accounts')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {account ? (
        <Text style={styles.balance} numberOfLines={1}>
          {account.balance && getSymbol(account.currency)}
          {account.balance}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accountNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  user: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.51,
    paddingRight: 5,
    color: colors.lightBlue
  },
  balance: {
    marginTop: -4,
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 18,
    color: colors.black
  }
})

const mapStateToProps = (state: AppState) => ({
  accounts: state.accounts.accounts,
  activeAccount: state.accounts.active
})
const mapDispatchToProps = (dispatch: Dispatch<UIAction>) => ({
  toggleSidebar: () => dispatch(toggleSidebarAction())
})

export default connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(SubheaderUser)
