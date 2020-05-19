import React from 'react'
import 'storybook/index.css'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import Dot from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Dot,
  title: 'Organisms/Dot',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="Pin" url="components/organisms/dot">
        <Description>
          <DocText>An Indicator to display how many pin numbers have been entered</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withActive = () => {
  return (
    <DocItem
      example={{
        render: () => <Dot index={0} active={boolean('Active', false)} />
      }}
    />
  )
}
