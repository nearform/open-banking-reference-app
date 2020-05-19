import React from 'react'
import 'storybook/index.css'

import Action from './index'

import StoryPage, { DocText, Description, DocSection, DocItem } from 'storybook/story-components'

export default {
  component: Action,
  title: 'Molecules/Action',
  decorators: [
    storyFn => (
      <StoryPage title="Action" url="components/molecules/action">
        <Description>
          <DocText>User actions</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withName = () => (
  <DocSection title="Action with name">
    <DocItem
      name="name"
      typeInfo="?string"
      example={{
        render: () => <Action id={1234} name="An Action" connection="conn" />
      }}
    />
  </DocSection>
)

export const withDates = () => (
  <DocSection title="Action with dates">
    <DocItem
      example={{
        render: () => <Action id={1234} name="An Action" connection="conn" start={new Date()} end={new Date()} />
      }}
    />
  </DocSection>
)
