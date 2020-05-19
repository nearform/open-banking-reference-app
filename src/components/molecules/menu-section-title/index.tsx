import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { colors } from 'constants/colors'

interface Props {
  title: string
}

const MenuSectionTitle: React.FC<Props> = ({ title }) => (
  <View style={sectionStyles.section}>
    <Text style={sectionStyles.title}>{title}</Text>
  </View>
)

const sectionStyles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    fontSize: 21,
    lineHeight: 30,
    fontFamily: 'NB',
    color: colors.lightBlue
  }
})

export default MenuSectionTitle
