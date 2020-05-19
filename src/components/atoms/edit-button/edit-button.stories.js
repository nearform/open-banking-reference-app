import React from 'react'
import 'storybook/index.css'

import EditButton from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: EditButton,
  title: 'Atoms/EditButton',
  decorators: [
    storyFn => (
      <StoryPage title="EditButton" url="components/atoms/edit-button">
        <Description>
          <DocText>The Edit Button</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withEditing = () => (
  <DocItem
    example={{
      render: () => <EditButton editing onPress={() => {}} />
    }}
  />
)
