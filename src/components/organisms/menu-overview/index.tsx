import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

import EditButton from 'components/atoms/edit-button'
import MenuOverviewItem from 'components/molecules/menu-overview-item'

import { colors } from 'constants/colors'

interface Props {
  animation: Animated.Value
  toggleEdit(): void
  editing: boolean
  selectedItems: string[]
}

const MenuOverview: React.FC<Props> = ({ animation, toggleEdit, selectedItems, editing }) => {
  const { t } = useTranslation()
  const list = useRef<FlatList<string>>(null)
  const data = [...selectedItems, 'Edit']

  useEffect(() => {
    // make sure we always see the last selected element
    if (list.current) {
      list.current.scrollToEnd({ animated: true })
    }
  }, [data])

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{t('menuOverview:title')}</Text>
      </View>

      <FlatList
        ref={list}
        data={data}
        renderItem={({ item, index }) => {
          return index === data.length - 1 ? (
            <View style={styles.editCell}>
              <EditButton onPress={toggleEdit} animation={animation} editing={editing} />
            </View>
          ) : (
            <View style={styles.cell}>
              <MenuOverviewItem
                item={item}
                imgSource={
                  item === t('menuItems:account:item2')
                    ? require('assets/images/ic-screen1.png')
                    : index % 2 === 0
                    ? require('assets/images/ic-screen2.png')
                    : require('assets/images/ic-screen3.png')
                }
              />
            </View>
          )
        }}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingRight: 64
  },
  container: {
    width: '100%',
    backgroundColor: colors.lightBlue,
    paddingTop: 8,
    paddingBottom: 10
  },
  titleWrapper: {
    alignItems: 'center'
  },
  title: {
    fontSize: 21,
    fontFamily: 'NB',
    lineHeight: 30,
    color: 'white',
    marginBottom: 8
  },
  firstItem: {
    marginLeft: 15
  },
  cell: {
    width: 130,
    alignItems: 'center'
  },
  editCell: {
    alignItems: 'center',
    width: 100,
    paddingTop: 34
  }
})

export default MenuOverview
