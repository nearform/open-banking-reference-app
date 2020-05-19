import React from 'react'
import { View, Image } from 'react-native'
import '../../storybook/index.css'

import StoryPage, { DocText, Description, DocItem, DocSection } from '../../storybook/story-components'

export default {
  component: View,
  title: 'Assets/Avatar',
  decorators: [
    storyFn => (
      <StoryPage title="Checkbox" url="components/checkbox">
        <Description>
          <DocText>Avatars can be used for various different things in the app</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const marcusStephens = () => (
  <DocSection title="Marcus Stephens">
    <DocItem
      name="avi1"
      typeInfo="png"
      example={{
        render: () => (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./avatars/avi1.png')} style={{ margin: 10, width: 16, height: 16 }} />
            <Image source={require('./avatars/avi1.png')} style={{ margin: 10, width: 32, height: 32 }} />
            <Image source={require('./avatars/avi1.png')} style={{ margin: 10, width: 64, height: 64 }} />
            <Image source={require('./avatars/avi1.png')} style={{ margin: 10, width: 96, height: 96 }} />
            <Image source={require('./avatars/avi1.png')} style={{ margin: 10, width: 128, height: 128 }} />
          </View>
        )
      }}
    />
  </DocSection>
)

export const kathrynMoore = () => (
  <DocSection title="Kathryn Moore">
    <DocItem
      name="avi1"
      typeInfo="png"
      example={{
        render: () => (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./avatars/avi2.png')} style={{ margin: 10, width: 16, height: 16 }} />
            <Image source={require('./avatars/avi2.png')} style={{ margin: 10, width: 32, height: 32 }} />
            <Image source={require('./avatars/avi2.png')} style={{ margin: 10, width: 64, height: 64 }} />
            <Image source={require('./avatars/avi2.png')} style={{ margin: 10, width: 96, height: 96 }} />
            <Image source={require('./avatars/avi2.png')} style={{ margin: 10, width: 128, height: 128 }} />
          </View>
        )
      }}
    />
  </DocSection>
)

export const saraBuckley = () => (
  <DocSection title="Sara Buckley">
    <DocItem
      name="avi1"
      typeInfo="png"
      description="The first avatar"
      example={{
        render: () => (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./avatars/avi3.png')} style={{ margin: 10, width: 16, height: 16 }} />
            <Image source={require('./avatars/avi3.png')} style={{ margin: 10, width: 32, height: 32 }} />
            <Image source={require('./avatars/avi3.png')} style={{ margin: 10, width: 64, height: 64 }} />
            <Image source={require('./avatars/avi3.png')} style={{ margin: 10, width: 96, height: 96 }} />
            <Image source={require('./avatars/avi3.png')} style={{ margin: 10, width: 128, height: 128 }} />
          </View>
        )
      }}
    />
  </DocSection>
)

export const eduardaGonzalez = () => (
  <DocSection title="Eduarda Gonzalez">
    <DocItem
      name="avi1"
      typeInfo="png"
      description="The first avatar"
      example={{
        render: () => (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./avatars/avi4.png')} style={{ margin: 10, width: 16, height: 16 }} />
            <Image source={require('./avatars/avi4.png')} style={{ margin: 10, width: 32, height: 32 }} />
            <Image source={require('./avatars/avi4.png')} style={{ margin: 10, width: 64, height: 64 }} />
            <Image source={require('./avatars/avi4.png')} style={{ margin: 10, width: 96, height: 96 }} />
            <Image source={require('./avatars/avi4.png')} style={{ margin: 10, width: 128, height: 128 }} />
          </View>
        )
      }}
    />
  </DocSection>
)
