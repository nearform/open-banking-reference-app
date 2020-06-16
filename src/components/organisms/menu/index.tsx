import React from 'react'
import { SectionList, Animated } from 'react-native'
import MenuItemBase from 'components/molecules/menu-item-base'
import MenuSectionTitle from 'components/molecules/menu-section-title'

interface Props {
  data: {
    title: string
    data: (string | { id: number; value: string })[]
  }[]
  selectedItems: string[]
  animation: Animated.Value
  handlers: {
    [key: number]: () => void
  }

  onMenuItemToggle(item: string, checked: boolean): void
}

const Menu: React.FC<Props> = ({ data, selectedItems, onMenuItemToggle, animation, handlers }) => {
  return (
    <SectionList
      renderItem={({ item, index }) => {
        const itemValue = typeof item === 'object' ? item.value : item
        const onClickHandler = typeof item === 'object' ? handlers[item.id] : null
        return (
          <MenuItemBase
            onClick={onClickHandler}
            key={index}
            onMenuItemToggle={onMenuItemToggle}
            animation={animation}
            item={itemValue}
            checked={selectedItems.includes(itemValue)}
          />
        )
      }}
      renderSectionHeader={({ section: { title } }) => <MenuSectionTitle title={title} />}
      sections={data}
      keyExtractor={(item, index) => {
        const itemValue = typeof item === 'object' ? item.value : item
        return itemValue + index
      }}
    />
  )
}

export default Menu
