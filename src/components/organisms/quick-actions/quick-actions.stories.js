import React from 'react'
import { MemoryRouter } from 'react-router'
import 'storybook/index.css'

import QuickActions from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'
import { withKnobs, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  component: QuickActions,
  title: 'Molecules/QuickActions',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="QuickActions" url="components/molecules/quick-actions">
        <Description>
          <DocText>The Quick Actions component enables the user to select actions</DocText>
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
            <QuickActions
              actionsCount={number('Action count', 0)}
              onAction={action('On action')}
              connection={{ id: 2 }}
            />
          </MemoryRouter>
        )
      }}
    />
  )
}
