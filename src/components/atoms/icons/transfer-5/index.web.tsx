import React from 'react'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <svg width="22" height="24" viewBox="0 0 22 24" {...props}>
    <g transform="translate(0 .55)" fillRule="nonzero" fill="none">
      <path
        d="M2 11.45c0-4.97 4.03-9 9-9 3.434 0 6.521 1.94 8.04 4.952l1.786-.9C18.97 2.821 15.196.45 11 .45c-6.075 0-11 4.925-11 11h2zM20 11.45c0 4.972-4.03 9-9 9-3.434 0-6.521-1.939-8.04-4.95l-1.786.9c1.856 3.68 5.63 6.05 9.826 6.05 6.075 0 11-4.924 11-11h-2z"
        fill="#2165E2"
      />
      <circle fill="#111" cx="11" cy="11.451" r="2" />
      <path
        fill="#111"
        d="M13.19 5.151l-.266 1.982 7.93 1.062 1.06-7.93L19.934 0l-.796 5.947zM8.81 17.75l.266-1.982-7.93-1.061-1.06 7.93 1.981.265.796-5.947z"
      />
    </g>
  </svg>
)

export default SvgComponent
