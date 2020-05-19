import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#029FD6', ...props }: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M21.14 4.225l-8.74 8.65-4.8-4.75L4 11.688 12.4 20 23.6 8.917c.261.983.4 2.017.4 3.083 0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0c3.661 0 6.94 1.64 9.14 4.225z"
      />
      <Mask x={0} y={0} width="100%" height="100%" id="prefix__b" fill="#fff">
        <Use href="#prefix__a" />
      </Mask>
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Use fill={fill} fillRule="nonzero" href="#prefix__a" />
      <G fill={fill} fillRule="nonzero" mask="url(#prefix__b)">
        <Path d="M-23-30h86v76h-86z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
