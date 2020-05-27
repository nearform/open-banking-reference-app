import React, { useState, useRef } from 'react'
import { StyleSheet, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

import SubheaderSearch from 'components/molecules/subheader/search'
import Subheader from 'components/organisms/subheader'
import MenuOverview from 'components/organisms/menu-overview'
import MenuList from 'components/organisms/menu'
import { useFadeIn } from 'utils/hooks'

export const Menu: React.FC = () => {
  const {t} = useTranslation()
  const opacity = useFadeIn({ delay: 500 } as Animated.TimingAnimationConfig)
  const animation = useRef(new Animated.Value(0.01)).current

  const [editing, setEditing] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Array<string>>([t('menuItems:account:item2')])

  const toggleEdit = () => {
    setEditing(!editing)
    Animated.spring(animation, {
      toValue: editing ? 0.01 : 1,
      friction: 6,
      useNativeDriver: true
    }).start()
  }

  const handleCheckboxChange = (item: string, checked: boolean) => {
    const index = selectedItems.indexOf(item)
    if (!checked && index !== -1) {
      setSelectedItems([...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)])
    } else if (checked && index === -1) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const data = [
    {
      title: t('menuItems:sections:account'),
      data: [
        t('menuItems:account:item1'),
        t('menuItems:account:item2'),
        t('menuItems:account:item3'),
        t('menuItems:account:item4'),
        t('menuItems:account:item5'),
        t('menuItems:account:item6'),
        t('menuItems:account:item7'),
        t('menuItems:account:item8'),
        t('menuItems:account:item9'),
        t('menuItems:account:item10'),
        t('menuItems:account:item11')
      ]
    }
  ]
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Subheader CustomHeader={SubheaderSearch} />
      <MenuOverview selectedItems={selectedItems} animation={animation} toggleEdit={toggleEdit} editing={editing} />
      <MenuList
        data={data}
        selectedItems={selectedItems}
        onMenuItemToggle={handleCheckboxChange}
        animation={animation}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 40
  }
})

export default Menu
