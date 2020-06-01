import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { RouteComponentProps } from 'routing'
import { useTranslation } from 'react-i18next'

import Icon from 'components/atoms/icon'

import { Action as ActionType } from 'src/types'
import { colors } from 'constants/colors'

type Props = RouteComponentProps & {
  connection: string
} & ActionType &
  any

const Action: React.FC<Props> = ({ name, start, end, onPress }) => {
  const { i18n } = useTranslation()
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.action}>
        <View style={styles.icon} />
        <View style={styles.detail}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          {start && end && (
            <Text style={styles.date}>
              {i18n.format(start, 'date-do')} - {i18n.format(end, 'date-do')}
            </Text>
          )}
        </View>
        <View style={styles.supplement}>
          <Icon name="ic-chevron" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  detail: {
    flex: 1,
    marginLeft: 16
  },
  supplement: {
    marginLeft: 12
  },
  icon: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(250, 122, 155, 0.57)',
    borderRadius: 6
  },
  title: {
    fontFamily: 'fira-sans',
    fontSize: 18
  },
  date: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 12,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.darkGrey
  }
})

export default Action
