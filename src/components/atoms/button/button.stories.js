import React from 'react'
import 'storybook/index.css'
import { TextButton, IconButton, SimpleButton, RoundButton } from './index'

import { colors } from 'constants/colors'
import Icon from '../icon'

import StoryPage, { DocText, Description, DocItem, DocSection } from 'storybook/story-components'

export default {
  component: TextButton,
  title: 'Atoms/Button',
  decorators: [
    storyFn => (
      <StoryPage title="Button" url="components/atoms/button">
        <Description>
          <DocText>The button component is split into a number of different button types</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const textButton = () => (
  <DocSection title="TextButton">
    <DocItem
      name="label"
      typeInfo="?string"
      description="The label to be used for the buttons content"
      example={{
        render: () => <TextButton label={'A Textual Button'} />
      }}
    />
  </DocSection>
)

export const textButtonWithIcon = () => (
  <DocSection title="TextButton">
    <DocItem
      name="icon"
      typeInfo="?string"
      description="The icon via ./icons"
      example={{
        render: () => <TextButton icon={'ic-budget'} />
      }}
    />
  </DocSection>
)

export const textButtonWithIconColor = () => (
  <DocSection title="TextButton">
    <DocItem
      name="iconColor"
      typeInfo="?string"
      description="The icon's color"
      example={{
        render: () => <TextButton icon={'ic-x'} iconColor={colors.lightBlue} />
      }}
    />
  </DocSection>
)

export const textButtonWithAction = () => (
  <DocSection title="TextButton">
    <DocItem
      name="action"
      typeInfo="?func"
      description="The handler called when button is pressed"
      example={{
        code: '<TextButton action={()=> SomeAction()} />'
      }}
    />
  </DocSection>
)

export const roundButton = () => (
  <DocSection title="RoundButton">
    <DocItem
      name="label"
      typeInfo="?string"
      description="The content of the button"
      example={{
        render: () => <RoundButton>A Round Button</RoundButton>
      }}
    />
  </DocSection>
)

export const simpleButton = () => (
  <DocSection title="SimpleButton">
    <DocItem
      name="Simple Button"
      example={{
        render: () => <SimpleButton>Find Out More!</SimpleButton>
      }}
    />
  </DocSection>
)

export const iconButton = () => (
  <DocSection title="IconButton">
    <DocItem
      name="Icon Button"
      example={{
        render: () => (
          <IconButton icon={<Icon name="ic-transfer-1" width="40" height="40" />} iconColor={colors.lightBlue} />
        )
      }}
    />
  </DocSection>
)
