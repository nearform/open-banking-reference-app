import React from 'react'
import Svg, { G, Rect, Path } from 'react-native-svg'
import { colors } from 'constants/colors'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <Svg width={36} height={36} viewBox="0 0 36 36" {...props}>
    <G fill="none" fillRule="evenodd">
      <Rect width={36} height={36} fill={colors.darkGrey} fillRule="nonzero" opacity={0.201} rx={6} />
      <G stroke={colors.black} strokeWidth={2}>
        <Path strokeLinecap="square" d="M17.5 12H29v15H10.182C7.872 27 6 25.081 6 22.714" />
        <Path d="M14 23c0-2.367-1.79-4.286-4-4.286S6 20.634 6 23V12.286C6 9.919 7.79 8 10 8s4 1.919 4 4.286V23z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
