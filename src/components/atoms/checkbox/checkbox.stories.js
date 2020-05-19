import React from 'react'
import 'storybook/index.css'
import Checkbox from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Checkbox,
  title: 'Atoms/Checkbox',
  decorators: [
    storyFn => (
      <StoryPage title="Checkbox" url="components/atoms/checkbox">
        <Description>
          <DocText>The checkbox component reads boolean input from the user.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const tickWhenChecked = () => (
  <DocItem
    name="checked"
    typeInfo="?boolean"
    description="Ticks the box when true"
    example={{
      render: () => <Checkbox checked />
    }}
  />
)

export const onChangeHandler = () => (
  <DocItem
    name="onChange"
    typeInfo="?func"
    description="The handler called when the checkbox is pressed"
    example={{
      code: '<Checkbox onChange={newValue => SomeAction(newValue)} />'
    }}
  />
)
