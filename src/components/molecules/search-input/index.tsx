import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from 'components/atoms/icon'

interface Props {
  placeholder: string
  onChange?(): void
}

const SearchInput: React.FC<Props> = ({ placeholder, onChange }) => (
  <View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="rgb(155, 161, 161)"
      onChangeText={onChange}
      style={styles.input}
    />
    <View style={styles.inputIcon}>
      <Icon name="ic-search" />
    </View>
  </View>
)

const styles = StyleSheet.create({
  input: {
    height: 43,
    paddingLeft: 49,
    paddingRight: 15,
    backgroundColor: 'rgba(206, 209, 209, 0.2)',
    borderRadius: 6
  },
  inputIcon: {
    position: 'absolute',
    left: 3,
    top: 3
  }
})

export default SearchInput
