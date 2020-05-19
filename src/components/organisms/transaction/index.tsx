import React, { useState, useEffect } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { Animated, Image, View, Text, StyleSheet } from 'react-native'

import Icon from 'components/atoms/icon'
import TransactionIcons from 'services/transaction-icons'

import { Transaction as TransactionType } from 'src/types'
import { colors } from 'constants/colors'

interface Props extends WithTranslation, TransactionType {
  index: number
}

interface State {
  opacityAnimation: Animated.Value
}

const Transaction: React.FC<Props> = props => {
  const [state] = useState<State>({
    opacityAnimation: new Animated.Value(0)
  })

  useEffect(() => {
    const { index } = props

    Animated.timing(state.opacityAnimation, {
      toValue: 1,
      delay: 100 + 50 * index,
      useNativeDriver: true
    }).start()
  }, [props, state.opacityAnimation])

  const { title, amount, currency, date, icon } = props
  const opacity = { opacity: state.opacityAnimation }
  const d = new Date(date)
  const formattedDate = d.toString() === 'Invalid Date' ? date : format(parseISO(date), 'do MMM yyyy')
  let useIcon = <Icon name="ic-clothing" />
  if (icon) {
    useIcon = <Image source={TransactionIcons[icon]} style={{ width: 36, height: 36 }} />
  }
  return (
    <Animated.View style={[styles.transaction, opacity]}>
      <View style={styles.icon}>{useIcon}</View>
      <View style={styles.detail}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.supplement}>
        <Text style={styles.amount}>
          {amount} {amount && <Text style={styles.currency}>{currency}</Text>}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  transaction: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14
  },
  icon: {
    marginRight: 12,
    marginTop: 4
  },
  detail: {
    flex: 1
  },
  supplement: {
    marginLeft: 12
  },
  title: {
    fontFamily: 'fira-sans',
    fontSize: 18,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black
  },
  date: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.darkGrey
  },
  amount: {
    fontFamily: 'fira-sans',
    fontSize: 18,
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.black
  },
  currency: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'fira-sans',
    letterSpacing: 0
  }
})

export default withTranslation()(Transaction)
