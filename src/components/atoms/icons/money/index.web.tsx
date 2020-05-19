import React from 'react'
import { colors } from 'constants/colors'
import { IconProps } from '../common'

const SvgComponent = ({ fill1 = colors.darkBlue, fill2 = colors.lightBlue, ...props }: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <g strokeWidth={2} fill="none" stroke={fill2} strokeLinecap="square" strokeMiterlimit={10}>
      <path d="M1 7h22v16H1z" />
      <circle cx={12} cy={15} r={3} stroke={fill1} />
      <path data-color="color-2" d="M4 4h16M8 1h8" />
    </g>
  </svg>
)

export default SvgComponent
