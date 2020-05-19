import React from 'react'
import icons from '../icons'
import { Platform } from 'react-native'
import { IconProps } from '../icons/common'

type Props = {
  name: string
  accessible?: boolean | string
} & IconProps

const Icon: React.FC<Props> = ({ name, ...props }) => {
  if (Platform.OS === 'web' && typeof props.accessible === 'boolean') {
    props.accessible = props.accessible + ''
  }
  delete props.style
  const icon = icons.find(icon => icon.name === name)

  if (icon) {
    const { icon: Icon } = icon
    return <Icon {...props} />
  }

  return null
}

export default Icon
