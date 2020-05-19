import React from 'react'

import 'storybook/index.css'
import Transaction from './index'
import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Transaction,
  title: 'Organisms/Transaction',
  decorators: [
    storyFn => (
      <StoryPage title="Transaction" url="components/organisms/transaction">
        <Description>
          <DocText>Transaction provides an overview of an account transaction</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const transaction = () => {
  return (
    <DocItem
      example={{
        render: () => <Transaction title="Transaction name" amount={2.25} currency="Pounds" date="12:23" />
      }}
    />
  )
}
