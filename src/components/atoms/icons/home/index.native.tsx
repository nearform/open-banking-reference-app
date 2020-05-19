import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#FA775E', ...props }: IconProps) => (
  <Svg width={36} height={36} viewBox="0 0 36 36" {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M23.843 9.968L12.287.106a.442.442 0 0 0-.574 0L.157 9.968A.45.45 0 0 0 0 10.31v13.897C0 25.197.796 26 1.778 26H8c.245 0 .444-.2.444-.448V17.93h7.112v7.62c0 .248.199.449.444.449h6.222c.982 0 1.778-.803 1.778-1.793V10.31a.45.45 0 0 0-.157-.342z"
      />
      <Mask x={0} y={0} width="100%" height="100%" id="prefix__b" fill="#fff">
        <Use href="#prefix__a" />
      </Mask>
    </Defs>
    <G fill="none" fillRule="evenodd" transform="translate(6 4)">
      <Use fill={fill} href="#prefix__a" />
      <G fill={fill} fillRule="nonzero" mask="url(#prefix__b)">
        <Path d="M-31-24h86v76h-86z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
