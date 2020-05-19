import React from 'react'

import { Provider } from 'store'
import combinedReducer from 'store/reducers'

import { I18nextProvider } from 'react-i18next'
import i18n from 'services/i18n'

import 'storybook/index.css'
import StoryPage, { DocText, Description, DocItem, DocSection } from 'storybook/story-components'
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { MemoryRouter } from 'react-router'
import Account from './index'

const initialState = combinedReducer()
initialState.accounts = {
  accounts: {
    active: 0,
    accounts: []
  }
}

export default {
  component: Provider,
  title: 'Organisms/Account',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="Account" url="components/organisms/account">
        <Description>
          <DocText>The account component displays a short summary of user&apos;s account.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const accountWithNameOnly = () => (
  <DocSection title="Account with name only">
    <DocItem
      description="Account name at the top. Use knobs to add more properties"
      example={{
        render: () => (
          <Provider initialState={initialState}>
            <I18nextProvider i18n={i18n}>
              <MemoryRouter>
                <Account
                  selected={boolean('Selected', true)}
                  touchable={boolean('Touchable', false)}
                  highlight={boolean('Highlight', false)}
                  showActions={boolean('Show actions', false)}
                  account={{
                    title: text('title', 'Personal'),
                    balance: number('Balance', null),
                    currency: 'GBP',
                    type: select('Type', { without: null, Premium: 'Premium Account' }),
                    accountNumber: select('Account Number', { without: null, 'number 1': 'PT48IBAN123456192837465' })
                  }}
                  onClick={action('Click on account')}
                  onQuickAction={action('Click on quick actions')}
                />
              </MemoryRouter>
            </I18nextProvider>
          </Provider>
        )
      }}
    />
  </DocSection>
)

export const connectionWithNameOnly = () => (
  <DocSection title="Connection with name only">
    <DocItem
      description="Connection name at the top. Use knobs to add more properties"
      example={{
        render: () => (
          <Provider initialState={initialState}>
            <I18nextProvider i18n={i18n}>
              <MemoryRouter>
                <Account
                  selected={boolean('Selected', true)}
                  touchable={boolean('Touchable', false)}
                  highlight={boolean('Highlight', false)}
                  showActions={boolean('Show actions', false)}
                  connection={{
                    connection_name: text('title', 'A Connection Name'),
                    account_number: select('Account Number', { without: null, 'number 1': 'ABC123456' })
                  }}
                  onClick={action('Click on connection')}
                  onQuickAction={action('Click on quick actions')}
                />
              </MemoryRouter>
            </I18nextProvider>
          </Provider>
        )
      }}
    />
  </DocSection>
)

export const accountWithAllProperties = () => (
  <DocSection title="Account With all properties">
    <DocItem
      description="With account type, balance"
      example={{
        render: () => (
          <Provider initialState={initialState}>
            <I18nextProvider i18n={i18n}>
              <MemoryRouter>
                <Account
                  selected
                  touchable={false}
                  showActions
                  account={{
                    title: 'Personal',
                    balance: '467,98',
                    currency: 'GBP',
                    type: 'Premium Account',
                    accountNumber: 'PT48IBAN123456192837465'
                  }}
                />
              </MemoryRouter>
            </I18nextProvider>
          </Provider>
        )
      }}
    />
  </DocSection>
)
