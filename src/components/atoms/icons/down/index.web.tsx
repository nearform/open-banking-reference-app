import React from 'react'
import { IconProps } from '../common'

const SvgComponent: React.FC<IconProps> = props => {
  const width = typeof props.width === 'string' ? parseInt(props.width) : props.width || 20
  const height = typeof props.height === 'string' ? parseInt(props.height) : props.height || 20
  const points = `0,0, ${width},0 ${width / 2},${width}`
  const viewBox = `0 0 ${width} ${width}`
  return (
    <svg width={width} height={height} viewBox={viewBox}>
      <polygon points={points} />
    </svg>
  )
}

export default SvgComponent
