import React from 'react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { MemoryRouter } from 'react-router'

import SubheaderUser from 'components/molecules/subheader/user'
import SubheaderSearch from 'components/molecules/subheader/search'
import { Provider } from 'store'
import combinedReducer from 'store/reducers'
import 'storybook/index.css'
import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

import Subheader from './index'

const initialState = combinedReducer()
initialState.accounts = {
  active: 'personal',
  accounts: [
    {
      id: 'personal',
      title: 'Personal',
      headerTitle: 'Personal',
      balance: '467,98',
      type: 'Account type',
      accountNumber: 'PT48IBAN123456192837465'
    }
  ]
}

export default {
  component: Subheader,
  title: 'Organisms/Subheader',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="Subheader" url="components/organisms/subheader">
        <Description>
          <DocText>
            The subheader component defaults to a basic template of a back button and page title which can be
            overridden.
          </DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const withTitleAndBackButton = () => (
  <DocItem
    name="title"
    typeInfo="?string"
    description="Displays title"
    example={{
      code: `<Subheader title="${text('title', 'Transfer')}" hideBackButton={${boolean('hideBackButton', false)}} />`,
      render: () => (
        <MemoryRouter>
          <Subheader
            title={text('title', 'Transfer')}
            hideBackButton={boolean('hideBackButton', false)}
            onBackPress={action('Back button pressed')}
          />
        </MemoryRouter>
      )
    }}
  />
)

export const userHeader = () => (
  <DocItem
    name="CustomHeader"
    typeInfo="?function"
    description="Overrides all contents of the header while still getting some styles"
    example={{
      code: '<Subheader CustomHeader={UserHeader} />',
      render: () => (
        <Provider initialState={initialState}>
          <MemoryRouter>
            <Subheader CustomHeader={SubheaderUser} />
          </MemoryRouter>
        </Provider>
      )
    }}
  />
)

export const searchHeader = () => (
  <DocItem
    name="CustomHeader"
    typeInfo="?function"
    description="Overrides all contents of the header while still getting some styles"
    example={{
      code: '<Subheader CustomHeader={SearchHeader} />',
      render: () => (
        <Provider initialState={initialState}>
          <MemoryRouter>
            <Subheader CustomHeader={SubheaderSearch} />
          </MemoryRouter>
        </Provider>
      )
    }}
  />
)
