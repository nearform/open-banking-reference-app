import React from 'react'
import { Provider } from 'store'
import combinedReducer from 'store/reducers'
import { I18nextProvider } from 'react-i18next'
import i18n from 'services/i18n/'
import { MemoryRouter } from 'react-router'

import 'storybook/index.css'
import TabBar from './index'
import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

const initialState = combinedReducer()
initialState.accounts = {
  accounts: {
    active: 0,
    accounts: []
  }
}

export default {
  component: TabBar,
  title: 'Organisms/TabBar',
  decorators: [
    storyFn => (
      <StoryPage title="TabBar" url="components/organisms/tab-bar">
        <Description>
          <DocText>The Tab Bar provides top level navigation</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const tabs = () => {
  return (
    <DocItem
      example={{
        render: () => (
          <Provider initialState={initialState}>
            <I18nextProvider i18n={i18n}>
              <MemoryRouter>
                <TabBar />
              </MemoryRouter>
            </I18nextProvider>
          </Provider>
        )
      }}
    />
  )
}
