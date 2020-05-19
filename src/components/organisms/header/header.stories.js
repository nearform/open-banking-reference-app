import React from 'react'
import 'storybook/index.css'
import Header from './index'
import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'
import { MemoryRouter } from 'react-router'

export default {
  component: Header,
  title: 'Organisms/Header',
  decorators: [
    storyFn => (
      <StoryPage title="Header" url="components/organisms/header">
        <Description>
          <DocText>The header component only displays the logo</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withLogo = () => (
  <DocItem
    example={{
      render: () => (
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      )
    }}
  />
)
