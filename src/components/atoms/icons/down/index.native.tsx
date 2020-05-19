import React from 'react'
import Svg, { Polygon } from 'react-native-svg'
import { IconProps } from '../common'

const SvgComponent: React.FC<IconProps> = props => {
  const width = typeof props.width === 'string' ? parseInt(props.width) : props.width || 20
  const height = typeof props.height === 'string' ? parseInt(props.height) : props.height || 20
  const points = `0,0, ${width},0 ${width / 2},${width}`

  return (
    <Svg width={width} height={height}>
      <Polygon points={points} />
    </Svg>
  )
}

export default SvgComponent
