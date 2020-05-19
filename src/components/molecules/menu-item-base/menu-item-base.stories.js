import React from 'react'
import { MemoryRouter } from 'react-router'
import 'storybook/index.css'
import { Animated } from 'react-native'

import MenuItemBase from './index'

import StoryPage, { DocText, Description, DocSection, DocItem } from 'storybook/story-components'

export default {
  component: MenuItemBase,
  title: 'Molecules/MenuItemBase',
  decorators: [
    storyFn => (
      <StoryPage title="MenuItemBase" url="components/molecules/menu-item-base">
        <Description>
          <DocText>Menu Item Base</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withItem = () => (
  <DocSection>
    <DocItem
      description="Menu item without checkbox"
      example={{
        render: () => (
          <MemoryRouter>
            <MenuItemBase item="Menu Item Label" animation={new Animated.Value(0)} />
          </MemoryRouter>
        )
      }}
    />
  </DocSection>
)

export const withItemAndCheckboxes = () => (
  <DocSection>
    <DocItem
      description="Menu item with visible, checked checkbox"
      example={{
        render: () => (
          <MemoryRouter>
            <MenuItemBase item="Menu Item Label" animation={new Animated.Value(1)} checked />
          </MemoryRouter>
        )
      }}
    />
  </DocSection>
)
