import React from 'react'
import 'storybook/index.css'

import Badge from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Badge,
  title: 'Atoms/Badge',
  decorators: [
    storyFn => (
      <StoryPage title="Badge" url="components/atoms/badge">
        <Description>
          <DocText>
            The badge component is displayed next to icons. For example, it can be used to display the amount of unread
            messages.
          </DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withOneUnreadMessage = () => (
  <DocItem
    example={{
      render: () => <Badge>1</Badge>
    }}
  />
)
