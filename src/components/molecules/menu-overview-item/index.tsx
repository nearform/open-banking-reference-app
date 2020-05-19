import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { colors } from 'constants/colors'

interface Props {
  item: string
  imgSource: object
  testID?: string
}

const MenuOverviewItem: React.FC<Props> = ({ item, imgSource, testID = 'menu-overview-item' }) => {
  return (
    <View style={itemStyles.item} testID={testID}>
      <View style={itemStyles.imageWrapper}>
        <Image source={imgSource} style={itemStyles.image} />
      </View>
      <Text numberOfLines={2} style={itemStyles.title}>
        {item}
      </Text>
    </View>
  )
}

const itemStyles = StyleSheet.create({
  item: {
    marginLeft: 25,
    alignItems: 'center'
  },
  imageWrapper: {
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1
  },
  image: {
    width: 64,
    height: 96,
    borderRadius: 4
  },
  title: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'fira-sans-bold',
    color: 'white',
    textAlign: 'center'
  }
})

export default MenuOverviewItem
