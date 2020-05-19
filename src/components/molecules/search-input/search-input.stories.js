import React from 'react'
import 'storybook/index.css'

import SearchInput from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: SearchInput,
  title: 'Molecules/SearchInput',
  decorators: [
    storyFn => (
      <StoryPage title="SearchInput" url="components/molecules/search-input">
        <Description>
          <DocText>The Search Input provides a search text input</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const search = () => {
  return (
    <DocItem
      example={{
        render: () => <SearchInput onChange={() => {}} />
      }}
    />
  )
}

export const withPlaceholder = () => {
  return (
    <DocItem
      example={{
        render: () => <SearchInput placeholder="Search" onChange={() => {}} />
      }}
    />
  )
}
