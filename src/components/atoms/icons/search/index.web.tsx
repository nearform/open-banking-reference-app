import React from 'react'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <svg width={36} height={36} viewBox="0 0 36 36" {...props}>
    <path
      fill="#2165E2"
      d="M29.56 25.94l-4.06-4.061A10.424 10.424 0 0 0 27 16.5C27 10.71 22.288 6 16.5 6 10.71 6 6 10.71 6 16.5S10.711 27 16.5 27c1.968 0 3.804-.553 5.379-1.5l4.06 4.06a1.496 1.496 0 0 0 2.121 0l1.5-1.5a1.498 1.498 0 0 0 0-2.12zM16.5 24a7.5 7.5 0 1 1 .002-15.002A7.5 7.5 0 0 1 16.5 24z"
    />
  </svg>
)

export default SvgComponent
