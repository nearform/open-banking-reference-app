import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native'
import { colors } from 'constants/colors'

interface Props {
  onPress(): void
  children: React.ReactNode
  background?: string
  textColor?: string
  border?: boolean
  stretch?: boolean
  spacer?: number
  badge?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  testID?: string
}

const RoundButton: React.FC<Props> = ({
  onPress = () => {},
  children,
  background,
  textColor,
  border,
  stretch,
  spacer,
  badge,
  icon,
  disabled,
  testID = 'round-button'
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={StyleSheet.flatten([
      styles.buttonContainer,
      stretch ? { flex: 1 } : {},
      spacer ? { marginRight: spacer } : {},
      disabled ? { opacity: Platform.OS === 'android' ? 0.5 : 0.2 } : {}
    ])}
    disabled={disabled}
    {...(Platform.OS !== 'web' && { activeOpacity: 0.5 })}
    testID={testID}
  >
    <View
      style={StyleSheet.flatten([
        styles.button,
        background ? { backgroundColor: background } : {},
        border && styles.border,
        { justifyContent: icon ? 'space-between' : 'center' }
      ])}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={StyleSheet.flatten([styles.buttonText, textColor ? { color: textColor } : {}])}>{children}</Text>
      {badge && <View style={styles.badgeContainer}>{badge}</View>}
      {icon && <View style={styles.iconSuffix} />}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: colors.SOFT_RED,
    shadowColor: colors.shadow,
    flexDirection: 'row'
  },
  buttonText: {
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    letterSpacing: 0.5,
    color: colors.white,
    textAlign: 'center',
    paddingVertical: 15
  },
  border: {
    borderWidth: 1,
    borderColor: colors.grey
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    marginHorizontal: 16
  },
  iconSuffix: {
    width: 57
  }
})

export default RoundButton
