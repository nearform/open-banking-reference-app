import React from 'react'
import LinkTo from '@storybook/addon-links/react'

import SubheaderUser from 'components/molecules/subheader/user'

import 'storybook/index.css'
import StoryPage, { DocText } from 'storybook/story-components'

export default {
  component: SubheaderUser,
  title: 'Molecules/Subheader',
  decorators: [
    storyFn => (
      <StoryPage title="SubheaderUser" url="components/molecules/subheader/user">
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const user = () => (
  <DocText>
    Please see the <LinkTo kind="organisms-subheader--user-header">Organisms/Subheader/UserHeader story</LinkTo>
  </DocText>
)
