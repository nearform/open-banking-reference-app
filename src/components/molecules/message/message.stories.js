import React from 'react'
import 'storybook/index.css'
import Message from './index'
import { colors } from 'constants/colors'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Message,
  title: 'Molecules/Message',
  decorators: [
    storyFn => (
      <StoryPage title="Message" url="components/molecules/message">
        <Description>
          <DocText>The message component displays a summary of an individual message in the messages section.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}
console.log(colors)
export const messageBody = () => (
  <DocItem
    name="text"
    typeInfo="?string"
    description="The body of the message"
    example={{
      render: () => (
        <Message
          isAvatarVisible={false}
          id={1}
          text="I want to apply for a new banking product such as Credit Cards, Savings Accounts, Travel Insurance, etc."
        />
      )
    }}
  />
)

export const withAvatar = () => (
  <DocItem
    name="isAvatarVisible"
    typeInfo="?boolean"
    description="Shows avatar next to the body message"
    example={{
      render: () => (
        <Message
          isAvatarVisible
          id={1}
          text="I want to apply for a new banking product such as Credit Cards, Savings Accounts, Travel Insurance, etc."
        />
      )
    }}
  />
)

export const botMessage = () => (
  <DocItem
    name="isBot"
    typeInfo="?boolean"
    description="Shows bot message component"
    example={{
      render: () => <Message isAvatarVisible id={1} isBot text="Hello, how can I help you?" />
    }}
  />
)
