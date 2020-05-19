import React from 'react'
import { Animated, View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native'

import AccountView from './account-view'

import { Account as AccountType, Connection as ConnectionType } from 'src/types'
import { colors } from 'constants/colors'

type Props = {
  touchable?: boolean
  showActions?: boolean
  highlight?: boolean
  selected?: boolean
  onClick?(): void
  onQuickAction?(): void
  connection?: ConnectionType
  account?: AccountType
}

const Account: React.FC<Props> = ({
  selected = false,
  touchable,
  highlight,
  onClick,
  onQuickAction,
  account,
  connection,
  showActions
}) => {
  const wrapperProps = touchable ? { onPress: onClick } : {}
  const Wrapper: React.ComponentType = touchable ? TouchableWithoutFeedback : View

  return (
    <Wrapper {...wrapperProps}>
      <Animated.View
        style={[
          styles.accountContainer,
          connection && styles.connection,
          selected && styles.accountSelected,
          highlight && styles.accountHighlighted
        ]}
      >
        <View style={[!selected && !highlight && styles.border]}>
          <View style={!highlight && styles.shadow}>
            <AccountView
              account={account}
              connection={connection}
              highlight={highlight}
              showActions={showActions}
              onQuickAction={onQuickAction}
            />
          </View>
        </View>
      </Animated.View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  accountContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey
  },
  connection: {
    borderTopWidth: 8,
    borderTopColor: colors.SOFT_RED,
    borderBottomColor: colors.grey
  },
  accountHighlighted: {
    borderColor: colors.lightGrey
  },
  accountSelected: {
    borderWidth: 2,
    borderColor: colors.lightBlue + '80' // 80 = 50% in HEX
  },
  border: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'transparent',
    ...Platform.select({
      android: {
        borderColor: 'rgba(206, 209, 209, 0.5)'
      }
    })
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    backgroundColor: colors.white,
    borderRadius: 8
  }
})

export default Account
