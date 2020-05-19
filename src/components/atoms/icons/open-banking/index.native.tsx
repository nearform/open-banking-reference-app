import React from 'react'
import Svg, { G, Ellipse, Path } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <Svg width="25" height="25" viewBox="0 0 25 25" {...props}>
    <G
      transform="translate(1 1)"
      stroke="#FFF"
      stroke-width="2"
      fill="none"
      fill-rule="evenodd"
      opacity=".49839565"
      stroke-linecap="square"
    >
      <Path d="M0 6.5h23v16H0z" />
      <Ellipse cx="11.5" cy="14.5" rx="3.13636364" ry="3" stroke-width="2" />
      <Path d="M3.13636364 3.5H19.8636364M7.31818182.5h8.36363638" />
    </G>
  </Svg>
)

export default SvgComponent
