import React from 'react'
import 'storybook/index.css'

import DaySeparator from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

const now = new Date()

export default {
  component: DaySeparator,
  title: 'Atoms/DaySeparator',
  decorators: [
    storyFn => (
      <StoryPage title="DaySeparator" url="components/atoms/day-separator">
        <Description>
          <DocText>The day-separator component is used between blocks of messages</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const beforeToday = () => (
  <DocItem
    example={{
      render: () => <DaySeparator date={'2020-8-22'} />
    }}
  />
)

export const today = () => (
  <DocItem
    name="Today"
    example={{
      render: () => <DaySeparator date={`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`} />
    }}
  />
)
