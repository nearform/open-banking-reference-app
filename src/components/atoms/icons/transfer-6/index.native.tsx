import React from 'react'
import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <G fillRule="nonzero" fill="none">
      <Path
        d="M2.423 11.905c.005-4.719 3.354-8.777 7.999-9.693 4.644-.916 9.291 1.565 11.1 5.926 1.808 4.361.274 9.388-3.664 12.007-3.938 2.62-9.185 2.102-12.531-1.237l-1.08 1.077c3.86 3.852 9.914 4.45 14.459 1.427 4.545-3.022 6.315-8.823 4.228-13.856-2.087-5.032-7.45-7.895-12.809-6.838C4.765 1.775.901 6.458.895 11.904l1.528.001z"
        fill="#111"
      />
      <Path fill="#2165E2" d="M13.118 4.29H11.59v8.376h8.403v-1.523h-6.875z" />
      <Path d="M1.958 23.342l6.744-6.721L0 14.666l1.958 8.676zm.063-6.661l3.64.818-2.82 2.81-.82-3.628z" fill="#111" />
    </G>
  </Svg>
)

export default SvgComponent
