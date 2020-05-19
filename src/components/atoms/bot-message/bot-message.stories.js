import React from 'react'
import 'storybook/index.css'
import BotMessage from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: BotMessage,
  title: 'Atoms/BotMessage',
  decorators: [
    storyFn => (
      <StoryPage title="Message" url="components/message">
        <Description>
          <DocText>The message component displays a summary of an individual message in the messages section.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const botMessage = () => (
  <DocItem
    name="isBot"
    typeInfo="?boolean"
    description="Shows bot message component"
    example={{
      render: () => <BotMessage text="Hello, how can I help you?" />
    }}
  />
)
