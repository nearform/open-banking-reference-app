import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#000000', ...props }: IconProps) => (
  <Svg width={80} height={80} viewBox="0 0 80 80" {...props}>
    <Defs>
      <Path id="prefix__a" d="M49.148 6L15 40.5 49.148 75 61.1 62.925 38.904 40.5 61.1 18.075z" />
      <Mask id="prefix__b" fill="#fff" x={0} y={0} width="100%" height="100%">
        <Use href="#prefix__a" />
      </Mask>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Use fill={fill} stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} href="#prefix__a" />
      <G fill={fill} fillRule="nonzero" mask="url(#prefix__b)">
        <Path d="M0 0h86v86H0z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
