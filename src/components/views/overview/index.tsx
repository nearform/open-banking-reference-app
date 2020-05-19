import React, { useState, useEffect, useRef, useMemo } from 'react'
import { compose, connect, AppState, Dispatch } from 'store'
import { Animated, View, Text, StyleSheet, ScrollView } from 'react-native'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withRouter, RouteComponentProps } from 'routing'
import { Spring } from 'react-spring/renderprops'
import { loadAccounts as loadAccountsAction } from 'store/actions/accounts'
import { colors } from 'constants/colors'

import { SimpleButton } from 'components/atoms/button'
import LineChart from 'components/organisms/chart'
import SubheaderUser from 'components/molecules/subheader/user'
import Subheader from 'components/organisms/subheader'
import Transactions from 'components/organisms/transaction'

import QuickActions from 'components/organisms/quick-actions'
import MonthSwitcher from 'components/molecules/month-switcher'

import { usePrevious } from 'utils/hooks'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends MapStateToProps, MapDispatchToProps, WithTranslation, RouteComponentProps {}
type State = typeof initialState

const initialState = {
  chartVariation: 1,
  month: 1
}

const recentTransactionQuantityIncrement = 3

const monthBalances = {
  9: '280,59',
  10: '232,94',
  11: '397,60',
  0: '543,25',
  1: '451,25'
}

const Overview: React.FC<Props> = props => {
  const {
    accounts,
    activeAccount,
    t,
    session: { tokens },
    history: {
      location: { pathname }
    },
    loadAccounts,
    providers: { providers }
  } = props
  const prevTokens = usePrevious(tokens)
  const [loadedAccounts, setLoadedAccounts] = useState<boolean>(false)
  const [state, setState] = useState<State>(initialState)

  const opacity: Animated.Value = useRef(new Animated.Value(0)).current
  const budgetProgressAnimation: Animated.Value = useRef(new Animated.Value(0)).current

  const updateState = (newState: object): void => {
    setState(state => ({ ...state, ...newState }))
  }

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, delay: 0, useNativeDriver: false }).start()
    Animated.timing(budgetProgressAnimation, {
      toValue: 0.65,
      delay: 500,
      duration: 750,
      useNativeDriver: false
    }).start()
  }, [opacity, budgetProgressAnimation])

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: pathname === '/overview' ? 1 : 0,
      delay: pathname === '/overview' ? 0 : 0,
      useNativeDriver: true
    }).start()
  }, [pathname, opacity])

  useEffect(() => {
    if (tokens && (prevTokens !== tokens || loadedAccounts) && providers.length) {
      setLoadedAccounts(true)
      loadAccounts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, loadedAccounts, providers])

  const { chartVariation, month } = state

  const daysInMonth = new Date(2019, month + 1, 0).getDate()
  const account = accounts.find(a => a.id === activeAccount)

  const recentTransactions = useMemo(
    () =>
      account && account.transactions
        ? account.transactions.slice().reverse().slice(0, recentTransactionQuantityIncrement)
        : [],
    [account]
  )

  return (
    <Animated.View style={[styles.container, { opacity }]} testID="overview">
      <Subheader CustomHeader={SubheaderUser} />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.quickActions}>
            <QuickActions />
          </View>

          <View style={styles.recentTransactions}>
            <View style={styles.recentTransactionsHeader}>
              <View style={{ flexBasis: '70%' }}>
                <Text style={styles.recentTransactionsTitle}>{t('overview:recentTransactions')}</Text>
              </View>
              <View
                style={{
                  flexBasis: '30%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}
              >
                <SimpleButton to="/transactions">{t('overview:viewMore')}</SimpleButton>
              </View>
            </View>
            {recentTransactions.map((i, k: number) => (
              <Transactions key={`trans-${k}`} index={k} {...i} />
            ))}
          </View>

          <View style={styles.budget}>
            <View style={styles.budgetDetail}>
              <Text numberOfLines={1} style={styles.budgetTitleText}>
                {t('overview:budget')} 26,00{' '}
                <Text style={styles.budgetTitleTextExtra}>{account && account.currency}</Text>
              </Text>
              <Text style={styles.budgetSumplementalText}>
                {t('overview:spent')} 10,15 {account && account.currency}
              </Text>
              <View style={styles.progressContainer}>
                <Animated.View
                  style={[
                    styles.progress,
                    {
                      width: budgetProgressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </View>
            </View>
            <View>
              <Text style={styles.budgetTitleText}>
                15,85 <Text style={[styles.budgetTitleTextExtra, { fontSize: 12 }]}>{account && account.currency}</Text>
              </Text>
              <Text style={[styles.budgetSumplementalText, { textAlign: 'right' }]}>{t('overview:remaining')}</Text>
            </View>
          </View>

          <View style={styles.chartDisplay}>
            <View style={[styles.chartColumn, styles.chartTitleContainer]}>
              <Text style={styles.chartTitle}>{t('overview:balance')}</Text>
              <Text style={styles.chartRange}>
                {t(`months:${month}`).substr(0, 3)} 1st - {daysInMonth}
                {daysInMonth % 2 === 0 ? 'th' : 'st'}
              </Text>
            </View>
            <View style={styles.chartColumn}>
              <Spring
                from={{
                  opacity: 0
                }}
                to={{ opacity: 1 }}
                reset={true}
              >
                {props => (
                  <Text style={[styles.chartBalance, props]}>
                    {monthBalances[month]}{' '}
                    <Text style={[styles.chartBalanceSupplementary]}>{account && account.currency}</Text>
                  </Text>
                )}
              </Spring>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart chartVariation={chartVariation} key={`chart${chartVariation}`} />
            <MonthSwitcher
              currentMonth={month}
              onSelect={month =>
                updateState({
                  chartVariation: chartVariation === 1 ? 2 : 1,
                  month
                })
              }
            />
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  )
}

const mapStateToProps = (state: AppState) => ({
  activeAccount: state.accounts.active,
  accounts: state.accounts.accounts,
  providers: state.providers,
  session: state.session
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loadAccounts: () => dispatch(loadAccountsAction())
})

export default compose(
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps),
  withRouter,
  withTranslation(undefined)
)(Overview)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  quickActions: {
    paddingTop: 18,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12
  },
  title: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 18
  },
  budget: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    paddingTop: 24,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.VERY_LIGHT_GREY
  },
  budgetDetail: {
    flex: 1,
    paddingRight: 6
  },
  budgetTitleText: {
    fontFamily: 'fira-sans',
    fontSize: 18,
    lineHeight: 20,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black
  },
  budgetTitleTextExtra: {
    fontSize: 18,
    fontFamily: 'fira-sans',
    color: colors.darkGrey
  },
  budgetSumplementalText: {
    fontFamily: 'fira-sans',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0,
    lineHeight: 14,
    color: colors.darkGrey
  },
  progressContainer: {
    width: '100%',
    height: 7,
    marginTop: 9,
    borderRadius: 3,
    backgroundColor: 'rgba(155, 161, 161, 0.4)'
  },
  progress: {
    height: 7,
    borderRadius: 3,
    backgroundColor: colors.lightBlue
  },
  recentTransactions: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 6
  },
  recentTransactionsHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  recentTransactionsTitle: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    letterSpacing: -0.51,
    color: colors.darkBlue
  },
  chartDisplay: {
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 18,
    backgroundColor: colors.lightGrey
  },
  chartColumn: {
    flex: 1
  },
  chartTitleContainer: {
    marginTop: 4
  },
  chartTitle: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0.32,
    color: colors.darkBlue
  },
  chartBalance: {
    fontFamily: 'fira-sans',
    fontSize: 18,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black,
    flex: 0,
    alignSelf: 'flex-end'
  },
  chartRange: {
    fontFamily: 'fira-sans',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.darkGrey,
    flex: 0,
    alignSelf: 'flex-start',
    paddingTop: 7,
    paddingBottom: 2
  },
  chartBalanceSupplementary: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'fira-sans',
    letterSpacing: 0
  },
  chartContainer: {
    backgroundColor: colors.lightGrey
  }
})
