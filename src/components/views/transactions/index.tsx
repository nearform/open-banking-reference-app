import React, { useEffect, useRef, useMemo } from 'react'
import { compose, connect, AppState } from 'store'
import { Animated, View, Text, SectionList, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { flow, groupBy, map, toPairs, reverse } from 'lodash/fp'
import { RouteComponentProps } from 'src/routing'
import { colors } from 'constants/colors'
import Transaction from 'components/organisms/transaction'
import Subheader from 'components/organisms/subheader'

import { Transaction as TransactionType } from 'src/types'

type MapStateToProps = ReturnType<typeof mapStateToProps>

interface Section {
  title: string
  data: TransactionType[]
}

type SectionHeadingProps = {
  section: {
    title: string
  }
}

// @ts-ignore
const mapNoCap = map.convert({ cap: false })

const SectionHeading = (props: SectionHeadingProps) => {
  const { title } = props.section
  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: 1,
      delay: 100 + 50 * 1,
      useNativeDriver: false
    }).start()
  }, [])

  if (!title) return <View />
  return (
    <Animated.View style={[styles.sectionHeadingContainer, { opacity: opacity.current }]}>
      <Text style={styles.sectionHeading}>{title}</Text>
    </Animated.View>
  )
}

interface TransactionsProps extends RouteComponentProps, MapStateToProps {}

export const Transactions = ({ account }: TransactionsProps) => {
  const { t } = useTranslation(['common', 'transactions', 'overview', 'months'])

  const transactions = account ? account.transactions : []

  const sortedTransactions = useMemo(
    () =>
      flow<any, any, any, any, Section[]>(
        reverse,
        groupBy<TransactionType>(({ date }) => t(`months:${new Date(date).getMonth()}`)),
        toPairs,
        mapNoCap(([title, data]: [string, TransactionType[]], index: number) => ({
          title: index ? title : 'This month',
          data
        }))
      )(transactions),
    [transactions, t]
  )

  return !account ? (
    <View style={styles.view}>
      <Subheader title={t('transactions:title')} />
      <Text style={styles.errorMessage}>{t('accounts:error:message')}</Text>
    </View>
  ) : (
    <View style={styles.view}>
      <Subheader title={t('transactions:title')} />
      <View style={styles.recentTransactions}>
        <SectionList
          renderItem={({ item, index }) => (
            <View style={styles.transactionWrapper}>
              <Transaction key={index} index={index} {...item} />
            </View>
          )}
          renderSectionHeader={(section: { section: Section }) => <SectionHeading {...section} />}
          sections={sortedTransactions}
          keyExtractor={(_, index) => `trans-${index}`}
        />
      </View>
    </View>
  )
}

const mapStateToProps = (state: AppState) => ({
  account: state.accounts.accounts.find(account => account.id === state.accounts.active)
})

export default compose(connect<MapStateToProps>(mapStateToProps))(Transactions)

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  title: {
    fontFamily: 'fira-sans-bold',
    fontSize: 18
  },
  recentTransactions: {
    paddingTop: 20,
    width: '100%',
    flex: 1
  },
  transactionWrapper: {
    paddingLeft: 12,
    paddingRight: 12
  },
  recentTransactionsHeader: {
    flexDirection: 'row'
  },
  recentTransactionsTitle: {
    fontFamily: 'fira-sans-bold',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.34,
    marginBottom: 8,
    color: colors.lightGrey
  },
  sectionHeadingContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white
  },
  sectionHeading: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkBlue
  },
  errorMessage: {
    padding: 20,
    fontFamily: 'fira-sans-bold',
    fontSize: 14,
    letterSpacing: -0.34,
    textAlign: 'center',
    color: colors.black,
    margin: 6
  }
})
