import React, { useRef, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors } from 'constants/colors'

interface Props {
  onSelect(index: number): void
  currentMonth: number
}

interface SectionListItem {
  title: string
  index: number
  data: {
    title: string
    index: number
  }[]
}

const MonthSwitcher: React.FC<Props> = ({ onSelect, currentMonth }) => {
  const { t } = useTranslation()
  const list = useRef<SectionList<SectionListItem>>(null)

  useEffect(() => {
    list.current &&
      list.current.scrollToLocation &&
      list.current.scrollToLocation({
        sectionIndex: 1,
        itemIndex: 2,
        viewPosition: 0
      })
  }, [])

  const sectionListData = useMemo(
    () => [
      {
        title: '2018',
        index: 0,
        data: [
          { title: t('months:9'), index: 9 },
          { title: t('months:10'), index: 10 },
          { title: t('months:11'), index: 11 }
        ]
      },
      {
        title: '2019',
        index: 1,
        data: [
          { title: t('months:0'), index: 0 },
          { title: t('months:1'), index: 1 }
        ]
      }
    ],
    [t]
  )

  return (
    <SectionList
      style={styles.section}
      ref={list}
      horizontal
      getItemLayout={(_, index) => {
        return {
          length: 80,
          offset: 17 * index,
          index
        }
      }}
      renderItem={({ item, index, section }) => (
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          {index === 0 && <Text style={[styles.year, section.index === 0 && styles.firstYear]}>{section.title}</Text>}
          {/* @TODO - we should try to use a button here so we can use the getByRole query when testing rather than relying on a testID */}
          <TouchableOpacity key={index} onPress={() => onSelect(item.index)}>
            <View style={[styles.item, currentMonth === item.index && styles.itemActive]} testID={item.title}>
              <Text style={[styles.itemText, currentMonth === item.index && styles.itemActiveText]}>
                {item.title.substr(0, 3)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      sections={sectionListData}
      keyExtractor={(item, index) => item.title + index}
    />
  )
}

const styles = StyleSheet.create({
  section: {
    paddingBottom: 24
  },
  firstYear: {
    marginLeft: 17
  },
  year: {
    fontFamily: 'fira-sans',
    fontSize: 14,
    color: colors.darkGrey
  },
  itemLast: {
    paddingRight: 0
  },
  item: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 17,
    height: 32,
    paddingLeft: 16,
    paddingRight: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderRadius: 20,
    borderColor: colors.shadow,
    borderWidth: 1
  },
  itemActive: {
    backgroundColor: colors.lightBlue
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1
  },
  itemText: {
    color: colors.black,
    fontFamily: 'fira-sans-bold',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 32,
    ...Platform.select({
      android: {
        lineHeight: 28
      }
    })
  },
  itemActiveText: {
    color: colors.white
  }
})

export default MonthSwitcher
