import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'

import { compose } from 'store'
import { withRouter, RouteComponentProps } from 'routing'

import QuickAction from 'components/molecules/quick-action'

import { Connection } from 'src/types'

interface Props extends WithTranslation, RouteComponentProps {
  actionsCount?: number
  onQuickAction?: Function
  connection?: Connection
}

const QuickActions: React.FC<Props> = ({ t, history, onQuickAction, actionsCount = 0, connection }) => {
  const navigate = (location: string) => {
    onQuickAction && onQuickAction()
    history.push(location)
  }

  return (
    <View style={styles.quickActions}>
      <QuickAction
        disabled={!connection}
        onPress={() => navigate(`/transfers/${connection?.id}`)}
        actionsCount={actionsCount}
        spacer={12}
        title={t('accounts:transfer')}
      />
      <QuickAction
        disabled={!connection}
        onPress={() => navigate(`/actions/${connection?.id}`)}
        actionsCount={actionsCount}
        title={t('accounts:actions')}
      />
    </View>
  )
}

export default compose(withRouter, withTranslation())(QuickActions)

const styles = StyleSheet.create({
  quickActions: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 0
  }
})
