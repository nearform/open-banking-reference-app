import React from 'react'
import 'storybook/index.css'
import MenuOverview from './index'
import { Provider } from 'store'
import combinedReducer from 'store/reducers'
import { I18nextProvider } from 'react-i18next'
import i18n from 'services/i18n/'
import { MemoryRouter } from 'react-router'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

const initialState = combinedReducer()
initialState.accounts = {
  accounts: {
    active: 0,
    accounts: []
  }
}

export default {
  component: MenuOverview,
  title: 'Organisms/MenuOverview',
  decorators: [
    storyFn => (
      <StoryPage title="Menu Overview" url="components/organisms/menu-overview">
        <Description>
          <DocText>The menu that a user uses to select app components.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const menuOverview = () => (
  <DocItem
    example={{
      render: () => (
        <Provider initialState={initialState}>
          <I18nextProvider i18n={i18n}>
            <MemoryRouter>
              <MenuOverview t={text => text} selectedItems={['Statements', 'Direct Debits']} />
            </MemoryRouter>
          </I18nextProvider>
        </Provider>
      )
    }}
  />
)
