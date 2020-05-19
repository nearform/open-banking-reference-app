import React from 'react'

import { RoundButton } from 'components/atoms/button'
import Badge from 'components/atoms/badge'

import { colors } from 'constants/colors'

interface Props {
  actionsCount?: number
  onPress: () => void
  title: string
  spacer?: number
  disabled: boolean
}

const QuickAction: React.FC<Props> = ({ actionsCount = 0, disabled = false, onPress, spacer = 0, title }) => {
  return (
    <RoundButton
      disabled={disabled}
      onPress={onPress}
      stretch
      spacer={spacer}
      background={colors.lightGrey}
      textColor={colors.orange}
      badge={actionsCount ? <Badge background={colors.orange}>{actionsCount}</Badge> : null}
    >
      {title}
    </RoundButton>
  )
}

export default QuickAction
