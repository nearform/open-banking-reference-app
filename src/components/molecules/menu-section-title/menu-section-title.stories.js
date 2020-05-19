import React from 'react'
import { MemoryRouter } from 'react-router'
import 'storybook/index.css'

import MenuSectionTitle from './index'

import StoryPage, { DocText, Description, DocSection, DocItem } from 'storybook/story-components'

export default {
  component: MenuSectionTitle,
  title: 'Molecules/MenuSectionTitle',
  decorators: [
    storyFn => (
      <StoryPage title="MenuSectionTitle" url="components/molecules/menu-section-title">
        <Description>
          <DocText>Menu Section Title</DocText>
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
            <MenuSectionTitle title="A Section Title" />
          </MemoryRouter>
        )
      }}
    />
  </DocSection>
)
