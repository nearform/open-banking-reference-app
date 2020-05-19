import React from 'react'
import Svg, { G, Path, Circle } from 'react-native-svg'
import { IconProps } from '../common'

const QuestionMark = (props: IconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <G fillRule="nonzero" fill="none">
      <Path
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
        fill="#111"
      />
      <Circle fill="#194CA9" cx="12" cy="18" r="1" />
      <Path
        d="M10.257 7.475c1.706-.754 3.651-.571 4.162.256.546.882.201 2.006-1.024 3.045C11.622 12.278 11 13.158 11 14.5v1h2v-1c0-.583.328-1.046 1.687-2.198 1.909-1.617 2.572-3.78 1.434-5.623-1.15-1.86-4.163-2.143-6.672-1.034l-.915.405.809 1.829.914-.404z"
        fill="#194CA9"
      />
    </G>
  </Svg>
)

export default QuestionMark
