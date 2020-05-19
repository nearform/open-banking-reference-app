import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#2165E2', ...props }: IconProps) => (
  <Svg width={36} height={36} viewBox="0 0 36 36" {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M25.667 18c1.288 0 2.333.895 2.333 2s-1.045 2-2.333 2H2.333C1.045 22 0 21.105 0 20s1.045-2 2.333-2h23.334zm0-18C26.955 0 28 .895 28 2s-1.045 2-2.333 2H2.333C1.045 4 0 3.105 0 2s1.045-2 2.333-2h23.334zm0 9C26.955 9 28 9.895 28 11s-1.045 2-2.333 2H2.333C1.045 13 0 12.105 0 11s1.045-2 2.333-2h23.334z"
      />
      <Mask x={0} y={0} width="100%" height="100%" id="prefix__b" fill="#fff">
        <Use href="#prefix__a" />
      </Mask>
    </Defs>
    <G fill="none" fillRule="evenodd" transform="translate(4 5)">
      <Use fill={fill} href="#prefix__a" />
      <G fill={fill} fillRule="nonzero" mask="url(#prefix__b)">
        <Path d="M-30.074-25h89v76h-89z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
