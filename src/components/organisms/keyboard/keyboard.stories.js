import React, { useState } from 'react'
import 'storybook/index.css'
import { View } from 'react-native'
import Keyboard from './index'
import PIN from 'components/organisms/pin'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

const PinAndKeyboardParent = () => {
  const [input, setInput] = useState('')

  const onInput = key => setInput(input + key)

  const onDelete = () => setInput(input === '' ? input : input.substr(0, input.length - 1))

  return (
    <View>
      <PIN pin={input} />
      <Keyboard for={input} onInput={onInput} onDelete={onDelete} />
    </View>
  )
}

export default {
  component: PinAndKeyboardParent,
  title: 'Organisms/Keyboard',
  decorators: [
    storyFn => (
      <StoryPage title="Keyboard" url="components/organisms/keyboard">
        <Description>
          <DocText>The keyboard component reads numerical input from the user.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const pinAndKeyboard = () => (
  <DocItem
    name="for"
    typeInfo="?string"
    description="The current value entered by the user"
    example={{
      render: () => <PinAndKeyboardParent />
    }}
  />
)

export const numberPressedHandler = () => (
  <DocItem
    name="onInput"
    typeInfo="?func"
    description="The handler called when any of the numbers are pressed"
    example={{
      code: '<Keyboard onInput={newValue => SomeAction(newValue)} />'
    }}
  />
)

export const backArrowHandler = () => (
  <DocItem
    name="onDelete"
    typeInfo="?func"
    description="The handler called when back arrow is pressed"
    example={{
      code: '<Keyboard onDelete={() => SomeAction()} />'
    }}
  />
)
