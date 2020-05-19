import React from 'react'
import Svg, { Defs, Path, Use } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#2165E2', ...props }: IconProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" {...props}>
    <Defs>
      <Path
        d="M7.148 9.855L2 4.8 4.852 2 10 7.055 15.148 2 18 4.8l-5.148 5.055L13 10l-.148.145L18 15.2 15.148 18 10 12.945 4.852 18 2 15.2l5.148-5.055L7 10l.148-.145z"
        id="prefix__a"
      />
    </Defs>
    <Use fill={fill} href="#prefix__a" fillRule="evenodd" />
  </Svg>
)

export default SvgComponent
