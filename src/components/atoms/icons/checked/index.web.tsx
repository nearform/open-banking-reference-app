import React from 'react'
import { IconProps } from '../common'

const SvgComponent = ({ fill = '#029FD6', ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <defs>
      <path
        id="ic-checked-a"
        d="M21.1409409,4.22511055 L12.4,12.875 L7.6,8.125 L4,11.6875 L12.4,20 L23.6001406,8.91652755 C23.8610017,9.90046315 24,10.9339992 24,12 C24,18.627417 18.627417,24 12,24 C5.372583,24 8.11624501e-16,18.627417 0,12 C-8.11624501e-16,5.372583 5.372583,1.21743675e-15 12,0 C15.6614317,-6.72594096e-16 18.9398628,1.63982091 21.1409409,4.22511055 Z"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="ic-checked-b" fill="#fff">
        <use xlinkHref="#ic-checked-a" />
      </mask>
      <use fill={fill} fillRule="nonzero" xlinkHref="#ic-checked-a" />
      <g fill={fill} fillRule="nonzero" mask="url(#ic-checked-b)">
        <rect width="86" height="76" transform="translate(-23 -30)" />
      </g>
    </g>
  </svg>
)

export default SvgComponent
