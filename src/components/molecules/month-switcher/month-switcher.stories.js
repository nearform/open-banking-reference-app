import React, { useState } from 'react'
import 'storybook/index.css'

import MonthSwitcher from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: MonthSwitcher,
  title: 'Molecules/MonthSwitcher',
  decorators: [
    storyFn => (
      <StoryPage title="MonthSwitcher" url="components/molecules/month-switcher">
        <Description>
          <DocText>The month-switcher enables the user to select a month</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const unselected = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [month, setMonth] = useState(null)
  return (
    <DocItem
      example={{
        render: () => <MonthSwitcher onSelect={index => setMonth(index)} currentMonth={month} />
      }}
    />
  )
}

export const preselected = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [month, setMonth] = useState(1)
  return (
    <DocItem
      example={{
        render: () => <MonthSwitcher onSelect={index => setMonth(index)} currentMonth={month} />
      }}
    />
  )
}
