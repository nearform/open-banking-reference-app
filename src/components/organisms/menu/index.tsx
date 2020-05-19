import React from 'react'
import { SectionList, Animated } from 'react-native'
import MenuItemBase from 'components/molecules/menu-item-base'
import MenuSectionTitle from 'components/molecules/menu-section-title'

interface Props {
  data: {
    title: string
    data: string[]
  }[]
  selectedItems: string[]
  animation: Animated.Value
  onMenuItemToggle(item: string, checked: boolean): void
}

const Menu: React.FC<Props> = ({ data, selectedItems, onMenuItemToggle, animation }) => (
  <SectionList
    renderItem={({ item, index }) => (
      <MenuItemBase
        key={index}
        onMenuItemToggle={onMenuItemToggle}
        animation={animation}
        item={item}
        checked={selectedItems.includes(item)}
      />
    )}
    renderSectionHeader={({ section: { title } }) => <MenuSectionTitle title={title} />}
    sections={data}
    keyExtractor={(item, index) => item + index}
  />
)

export default Menu
