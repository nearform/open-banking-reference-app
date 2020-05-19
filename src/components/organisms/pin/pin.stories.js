import React from 'react'
import { withKnobs, text, number } from '@storybook/addon-knobs'
import 'storybook/index.css'

import PIN from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: PIN,
  title: 'Organisms/PIN',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="Pin" url="components/organisms/pin">
        <Description>
          <DocText>An Indicator to display how many pin numbers have been entered</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const defaultPin = () => (
  <DocItem
    example={{
      render: () => <PIN pin={text('Pin', '')} size={number('Size', 6)} />
    }}
  />
)
