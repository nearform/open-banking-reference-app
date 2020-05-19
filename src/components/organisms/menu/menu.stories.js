import React from 'react'
import { MemoryRouter } from 'react-router'
import 'storybook/index.css'
import Menu from './index'
import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'
import { Animated } from 'react-native'

const data = [
  { title: 'Menu 1 Title', data: ['Item 1.1', 'Item 1.2'] },
  { title: 'Menu 2 Title', data: ['Item 2.1', 'Item 2.2', 'Item 2.3'] }
]

export default {
  component: Menu,
  title: 'Organisms/Menu',
  decorators: [
    storyFn => (
      <StoryPage title="Menu" url="components/organisms/menu">
        <Description>
          <DocText>The Menu</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const menu = () => (
  <DocItem
    description="Menu with subsections, and items"
    example={{
      render: () => (
        <MemoryRouter>
          <Menu data={data} selectedItems={[]} animation={new Animated.Value(0.01)} />
        </MemoryRouter>
      )
    }}
  />
)

export const menuWithCehckboxes = () => (
  <DocItem
    description="Menu with checkboxes"
    example={{
      render: () => (
        <MemoryRouter>
          <Menu data={data} selectedItems={data[1].data.slice(1, 3)} animation={new Animated.Value(1)} />
        </MemoryRouter>
      )
    }}
  />
)
