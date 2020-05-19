import React from 'react'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#000000', ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" {...props}>
    <defs>
      <polygon id="ic-pin-back-a" points="49.148 6 15 40.5 49.148 75 61.1 62.925 38.904 40.5 61.1 18.075" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="ic-pin-back-b" fill="#fff">
        <use xlinkHref="#ic-pin-back-a" />
      </mask>
      <use
        fill={fill}
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        xlinkHref="#ic-pin-back-a"
      />
      <g fill={fill} fillRule="nonzero" mask="url(#ic-pin-back-b)">
        <rect width="86" height="86" />
      </g>
    </g>
  </svg>
)

export default SvgComponent
