import React from 'react'
import Svg, { Path, G } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <G fill-rule="nonzero" fill="none">
      <Path fill="#2165E2" d="M22 8H2V6h20zM2 16h20v2H2z" />
      <Path
        fill="#111"
        d="M8.414 12L7 13.414.586 7 7 .586 8.414 2l-5 5zM15.586 12L17 10.586 23.414 17 17 23.414 15.586 22l5-5z"
      />
    </G>
  </Svg>
)

export default SvgComponent
