import React from 'react'

import 'storybook/index.css'
import { withKnobs, select } from '@storybook/addon-knobs'

import LineChart from './index'

import StoryPage, { DocText, Description, DocItem } from 'storybook/story-components'

const options = {
  'Line Chart 1': 1,
  'Line Chart 2': 2
}
export default {
  component: LineChart,
  title: 'Organisms/Chart/Line',
  decorators: [
    withKnobs,
    storyFn => (
      <StoryPage title="Line Chart" url="components/organisms/chart">
        <Description>
          <DocText>The line chart component visualizes aggregate information</DocText>
        </Description>
        {storyFn()}
      </StoryPage>
    )
  ]
}

export const animatedChart = () => (
  <DocItem
    example={{
      render: () => <LineChart chartVariation={select('Chart Variations', options, 1)} />
    }}
  />
)
