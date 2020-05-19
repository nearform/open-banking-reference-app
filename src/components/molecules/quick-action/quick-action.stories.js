import React from 'react'
import { action } from '@storybook/addon-actions'
import { text, boolean, number } from '@storybook/addon-knobs'

import { MemoryRouter } from 'react-router'
import 'storybook/index.css'

import QuickAction from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: QuickAction,
  title: 'Molecules/QuickAction',
  decorators: [
    storyFn => (
      <StoryPage title="QuickActions" url="components/molecules/quick-action">
        <Description>
          <DocText>The Quick Action component enables the user to select action</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const enabled = () => {
  return (
    <DocItem
      example={{
        render: () => (
          <MemoryRouter>
            <QuickAction
              actionsCount={number('Count', 0)}
              title={text('Title', 'Quick Action')}
              spacer={number('Spacer', 0)}
              disabled={boolean('Disabled', false)}
              onPress={action('on press')}
            />
          </MemoryRouter>
        )
      }}
    />
  )
}
