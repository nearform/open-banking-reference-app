import React from 'react'
import LinkTo from '@storybook/addon-links/react'

import SubheaderSearch from 'components/molecules/subheader/search'

import 'storybook/index.css'
import StoryPage, { DocText } from 'storybook/story-components'

export default {
  component: SubheaderSearch,
  title: 'Molecules/Subheader',
  decorators: [
    storyFn => (
      <StoryPage title="SubheaderSearch" url="components/molecules/subheader/search">
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const search = () => (
  <DocText>
    Please see the <LinkTo kind="organisms-subheader--search-header">Organisms/Subheader/SearchHeader story</LinkTo>
  </DocText>
)
