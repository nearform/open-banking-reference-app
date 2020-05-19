import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'

import Icon from 'components/atoms/icon'

import { colors } from 'constants/colors'

interface KeyboardButtonProps {
  onPress?(): void
  testID?: string
}

const KeyboardButton: React.FC<KeyboardButtonProps> = ({ onPress, children, testID = 'keyboard-button' }) => (
  <TouchableOpacity
    onPress={onPress}
    {...(Platform.OS !== 'web' && { activeOpacity: 0.5 })}
    style={styles.button}
    testID={testID}
  >
    {children}
  </TouchableOpacity>
)
const Num: React.FC = ({ children }) => <Text style={styles.buttonText}>{children}</Text>

interface KeyboardProps {
  for: string
  onInput(key: string): void
  onDelete(): void
}

const Keyboard: React.FC<KeyboardProps> = ({ for: value, onInput, onDelete }) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <KeyboardButton onPress={() => onInput('1')}>
        <Num>1</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('2')}>
        <Num>2</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('3')}>
        <Num>3</Num>
      </KeyboardButton>
    </View>
    <View style={styles.row}>
      <KeyboardButton onPress={() => onInput('4')}>
        <Num>4</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('5')}>
        <Num>5</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('6')}>
        <Num>6</Num>
      </KeyboardButton>
    </View>
    <View style={styles.row}>
      <KeyboardButton onPress={() => onInput('7')}>
        <Num>7</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('8')}>
        <Num>8</Num>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('9')}>
        <Num>9</Num>
      </KeyboardButton>
    </View>
    <View style={styles.row}>
      <KeyboardButton>
        <Text style={styles.link}>Forgot?</Text>
      </KeyboardButton>
      <KeyboardButton onPress={() => onInput('0')}>
        <Num>0</Num>
      </KeyboardButton>
      {value.length > 0 ? (
        <KeyboardButton onPress={onDelete} testID="delete">
          <Icon name="ic-pin-back" width="34" height="34" fill={colors.black} />
        </KeyboardButton>
      ) : (
        <KeyboardButton testID="unlock">
          <Icon name="ic-touch-id" width="48" height="48" fill={colors.black} />
        </KeyboardButton>
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    paddingRight: 6
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 14,
    height: 48
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  buttonText: {
    fontSize: 32,
    fontFamily: 'NB',
    color: colors.black
  },
  link: {
    color: colors.darkBlue,
    fontSize: 16,
    fontFamily: 'fira-sans-semi-bold'
  }
})

export default Keyboard
