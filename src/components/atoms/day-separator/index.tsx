import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { isDateToday } from 'utils/isDateToday'
import { colors } from 'constants/colors'

interface Props {
  date: number
}

interface State {
  date: string
}

const DaySeparator: React.FC<Props> = props => {
  const [state, setState] = useState<State>({
    date: 'archive'
  })
  const { t } = useTranslation(['months'])

  useEffect(() => {
    const { date } = props
    const newDate = new Date(date)
    const dateIsToday = isDateToday(newDate)
    const month = t(`months:${newDate.getMonth()}`)
    const day = newDate.getDate()
    const year = newDate.getFullYear()
    const dateToStr = date ? (dateIsToday ? 'Today' : `${day} ${month} ${year}`) : ''

    setState({ date: dateToStr })
  }, [props, t])

  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{state.date}</Text>
      </View>
    </View>
  )
}

export default DaySeparator

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16
  },
  textContainer: {
    height: 24,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    backgroundColor: colors.darkBlue,
    display: 'flex',
    justifyContent: 'center'
  },
  text: {
    fontSize: 13,
    color: colors.white
  }
})
