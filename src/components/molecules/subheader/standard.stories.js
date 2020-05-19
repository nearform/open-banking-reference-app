import React from 'react'
import LinkTo from '@storybook/addon-links/react'

import SubheaderStandard from './standard'

import 'storybook/index.css'

import StoryPage, { DocText } from 'storybook/story-components'

export default {
  component: SubheaderStandard,
  title: 'Molecules/Subheader',
  decorators: [
    storyFn => (
      <StoryPage title="SubheaderStandard" url="components/molecules/subheader/standard">
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const standard = () => (
  <DocText>
    Please see the stories for
    <ul>
      <li>
        <LinkTo kind="organisms-subheader--with-title">Organisms/Subheader/WithTitle</LinkTo>
      </li>
      <li>
        <LinkTo kind="organisms-subheader--with-hidden-back-button">Organisms/WithHiddenBackButton</LinkTo>
      </li>
      <li>
        <LinkTo kind="organisms-subheader--with-back-button-callback">
          Organisms/Subheader/WithBackButtonCallback
        </LinkTo>
      </li>
    </ul>
  </DocText>
)
