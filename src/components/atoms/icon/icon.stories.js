import React from 'react'
import 'storybook/index.css'
import { View } from 'react-native'
import Icon from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

export default {
  component: Icon,
  title: 'Atoms/Icon',
  decorators: [
    storyFn => (
      <StoryPage title="Icon" url="components/atoms/icon">
        <Description>
          <DocText>The icon component loads SVG icons.</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const iconIdentifier = () => (
  <DocItem
    example={{
      render: () => (
        <DocItem
          name="name"
          typeInfo="?string"
          description="The icon identifier"
          example={{
            render: () => (
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Icon style={{ margin: 10 }} name="ic-transfer-1" width="40" height="40" />
                <Icon style={{ margin: 10 }} name="ic-transfer-2" width="40" height="40" />
                <Icon style={{ margin: 10 }} name="ic-transfer-3" width="40" height="40" />
                <Icon style={{ margin: 10 }} name="ic-transfer-4" width="40" height="40" />
                <Icon style={{ margin: 10 }} name="ic-transfer-5" width="40" height="40" />
                <Icon style={{ margin: 10 }} name="ic-transfer-6" width="40" height="40" />
              </View>
            )
          }}
        />
      )
    }}
  />
)

export const iconWidth = () => (
  <DocItem
    name="width"
    typeInfo="?string"
    description="The width of the icon"
    example={{
      render: () => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="10" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="20" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="30" height="40" />
        </View>
      )
    }}
  />
)

export const iconHeight = () => (
  <DocItem
    name="height"
    typeInfo="?string"
    description="The height of the icon"
    example={{
      render: () => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="40" height="10" />
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="40" height="20" />
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="40" height="30" />
        </View>
      )
    }}
  />
)

export const svgIconsWithFillColor = () => (
  <DocItem
    name="fill"
    typeInfo="?string"
    description="The color fill of the icon"
    example={{
      render: () => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Icon style={{ margin: 10 }} name="ic-x" width="40" height="40" />
        </View>
      )
    }}
  />
)

export const allIcons = () => (
  <DocItem
    description="All available icons"
    example={{
      render: () => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Icon style={{ margin: 10 }} name="ic-barcode-qr" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-bot" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-budget" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-checked" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-chevron" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-clothing" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-down" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-home" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-logo" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-menu" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-messages" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-mic" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-money" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-open-banking" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-pin-back" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-plus" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-polaris" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-question-mark" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-search" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-1" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-2" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-3" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-4" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-5" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-transfer-6" width="40" height="40" />
          <Icon style={{ margin: 10 }} name="ic-x" width="40" height="40" />
        </View>
      )
    }}
  />
)
