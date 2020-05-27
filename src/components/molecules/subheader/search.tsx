import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import Icon from 'components/atoms/icon'
import SearchInput from 'components/molecules/search-input'
import { colors } from 'constants/colors'

interface Props {}

const SubheaderSearch: React.FC<Props> = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <SearchInput placeholder={t('searchHeader:inputPlaceholder')} onChange={() => {}} />
      </View>
      <View style={styles.voiceIcon}>
        <Icon name="ic-mic" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 54,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10
  },
  inputWrapper: {
    flex: 1
  },
  voiceIcon: {
    marginLeft: 25
  }
})

export default SubheaderSearch
