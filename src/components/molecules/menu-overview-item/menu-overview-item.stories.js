import React from 'react'
import { MemoryRouter } from 'react-router'
import 'storybook/index.css'

import MenuOverviewItem from './index'

import StoryPage, { DocText, Description, DocSection, DocItem } from 'storybook/story-components'

export default {
  component: MenuOverviewItem,
  title: 'Molecules/MenuOverviewItem',
  decorators: [
    storyFn => (
      <StoryPage title="MenuOverviewItem" url="components/molecules/menu-item-base">
        <Description>
          <DocText>Menu Overview Item</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withICScreen1 = () => (
  <DocSection>
    <DocItem
      example={{
        render: () => (
          <MemoryRouter>
            <MenuOverviewItem imgSource={require('assets/images/ic-screen1.png')} />
          </MemoryRouter>
        )
      }}
    />
  </DocSection>
)
