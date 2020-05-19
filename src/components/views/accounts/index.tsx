import React, { useMemo, useCallback } from 'react'
import { compose, connect, AppState, Dispatch } from 'store'
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { withRouter, RouteComponentProps } from 'routing'

import { loadAccounts as loadAccountsAction, selectAccount as selectAccountAction } from 'store/actions/accounts'

import Account from 'components/organisms/account'
import { RoundButton, IconButton } from 'components/atoms/button'
import Icon from 'components/atoms/icon'

import { screenNormalizer } from 'utils'
import { colors } from 'constants/colors'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends RouteComponentProps, MapStateToProps, MapDispatchToProps {
  closeMenu(): void
}

export const Accounts: React.FC<Props> = ({
  accounts,
  active,
  closeMenu,
  history,
  loadAccounts,
  selectAccount,
  connections
}) => {
  const renderedAccounts = useMemo(
    () =>
      accounts.map((account, k) => (
        <View style={{ marginBottom: 12 }} key={`${k}-${account.accountNumber}`}>
          <Account
            account={account}
            onClick={() => {
              selectAccount(account.id)
              closeMenu()
            }}
            selected={account.id === active}
            touchable
            showActions
          />
        </View>
      )),
    [accounts, closeMenu, selectAccount, active]
  )

  const renderedConnections = useMemo(
    () =>
      connections.map((connection, k) => (
        <View style={{ marginBottom: 12 }} key={`${k}-${connection.id}`}>
          <Account connection={connection} showActions onQuickAction={closeMenu} />
        </View>
      )),
    [connections, closeMenu]
  )

  const onAddButtonPressed = useCallback(() => {
    closeMenu()
    history.push('/openbanking')
  }, [history, closeMenu])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.refresh}>
          <IconButton icon={<Icon name="ic-transfer-5" width="20" height="20" />} action={loadAccounts} />
        </View>
        <Text style={styles.title}>Choose an account</Text>
        <View style={styles.close}>
          <IconButton icon={<Icon name="ic-x" width="20" height="20" fill="#000" />} action={closeMenu} />
        </View>
      </View>
      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.listScrollView}>
          {renderedAccounts}
          {renderedConnections}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.addAccountButton}>
          <RoundButton onPress={onAddButtonPressed}>Add Open Banking Account</RoundButton>
        </View>
        <RoundButton onPress={onAddButtonPressed} background={colors.white} textColor={colors.black} border>
          Open an Account
        </RoundButton>
      </View>
    </View>
  )
}

const mapStateToProps = (state: AppState) => ({
  accounts: state.accounts.accounts,
  active: state.accounts.active,
  connections: state.connection.connections.filter(connection => connection.status === 'AUTHORIZED'),
  providers: state.providers.providers
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loadAccounts: () => dispatch(loadAccountsAction()),
  selectAccount: (id: string) => dispatch(selectAccountAction(id))
})

export default compose(
  withRouter,
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)
)(Accounts)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 25 + screenNormalizer.top,
    width: '100%',
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: 0,
        borderRightWidth: 1,
        borderRightColor: colors.grey
      }
    }),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  titleContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.VERY_LIGHT_GREY,
    paddingBottom: 17
  },
  title: {
    fontSize: 18,
    fontFamily: 'fira-sans-semi-bold',
    color: colors.lightBlue
  },
  refresh: {
    position: 'absolute',
    left: 0,
    bottom: 8
  },
  close: {
    position: 'absolute',
    right: 0,
    bottom: 8
  },
  listContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginLeft: 12,
    marginRight: 12
  },
  listScrollView: {
    paddingTop: 20
  },
  accountWrapper: {
    marginBottom: 12
  },
  buttonContainer: {
    padding: 12,
    alignSelf: 'stretch'
  },
  addAccountButton: {
    marginBottom: 12
  },
  provider: {
    flexDirection: 'row',
    marginBottom: 10
  },
  providerLogo: {
    height: 18,
    marginRight: 5,
    marginTop: 2,
    width: 18
  },
  providerText: {
    fontSize: 18,
    fontFamily: 'fira-sans-semi-bold'
  }
})
