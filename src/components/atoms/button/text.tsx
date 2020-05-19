import React from 'react'
import { TouchableWithoutFeedback, Text, View, StyleSheet, Platform } from 'react-native'
import { colors } from 'constants/colors'
import Icon from '../icon'

interface Props {
  label: string
  action(): void
  icon?: string
  iconColor?: string
}

const TextButton: React.FC<Props> = ({ label, action, icon = 'ic-chevron', iconColor = colors.darkBlue }) => {
  return (
    <TouchableWithoutFeedback onPress={action}>
      <View style={styles.view}>
        <Text {...(Platform.OS !== 'web' && { textAlignVertical: 'center' })} style={[styles.text]}>
          {label}
        </Text>
        <Icon name={icon} fill={iconColor} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  view: {
    height: 40,
    maxWidth: '50%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.lightGrey,
    paddingRight: 3
  },
  text: {
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontStyle: 'normal',
    letterSpacing: -0.38,
    textAlign: 'center',
    color: colors.black,
    paddingLeft: 16,
    marginTop: -2
  }
})

export default TextButton
