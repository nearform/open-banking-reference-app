import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getSymbol } from 'services/currencies'

import QuickActions from 'components/organisms/quick-actions'

import { colors } from 'constants/colors'
import { Account, Connection } from 'src/types'

type Props = {
  highlight?: boolean
  showActions?: boolean
  account?: Account
  connection?: Connection
  onQuickAction?(): void
}

const AccountView: React.FC<Props> = ({ account, connection, highlight, showActions, onQuickAction }) => {
  const { title, type, accountNumber, balance, currency, currencySymbol } = useMemo(
    () => ({
      title: account?.title || connection?.connection_name,
      type: account?.type || (connection ? 'Account type' : undefined),
      accountNumber: account?.accountNumber || connection?.account_number,
      balance: account?.balance,
      currency: account?.currency,
      currencySymbol: getSymbol(account?.currency)
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, connection]
  )
  return (
    <View style={[styles.account, highlight && styles.accountHighlighted]}>
      <View style={styles.accountDetails}>
        <View>
          <View style={styles.accountTitleContainer}>
            <Text style={styles.accountTitle}>{title}</Text>
            {connection && <Text style={styles.openBanking}>Open Banking</Text>}
          </View>
          <View style={styles.accountAdditional}>
            <Text style={styles.accountType}>{type}</Text>
            {accountNumber && <Text style={styles.accountNumber}>{accountNumber}</Text>}
          </View>
        </View>
        {balance && (
          <View style={styles.accountBalance}>
            <Text style={styles.balance}>
              {currencySymbol}
              {balance}
            </Text>
            <Text style={styles.currency}>{currency}</Text>
          </View>
        )}
      </View>
      {showActions && (
        <View style={styles.quickActionsContainer}>
          <QuickActions onQuickAction={onQuickAction} connection={connection} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  account: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 8
  },
  accountHighlighted: {
    backgroundColor: colors.lightGrey
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 8
  },
  accountTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  openBanking: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 11,
    color: colors.SOFT_RED,
    textTransform: 'uppercase',
    marginLeft: 12,
    fontWeight: '100',
    paddingBottom: 1,
    letterSpacing: 0.22
  },
  accountTitle: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    paddingTop: 2
  },
  accountAdditional: {
    paddingBottom: 4,
    paddingTop: 4
  },
  accountType: {
    fontSize: 14,
    marginBottom: 5
  },
  accountNumber: {
    fontSize: 14
  },
  accountBalance: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  balance: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 18
  },
  currency: {
    fontSize: 14
  },
  quickActionsContainer: {
    padding: 12
  }
})

export default AccountView
