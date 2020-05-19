import React from 'react'
import { View, Text, StyleSheet, SectionList, ScrollView } from 'react-native'
import { withTranslation, WithTranslation } from 'react-i18next'

import { compose, connect, AppState } from 'store'
import { withRouter, RouteComponentProps } from 'routing'

import Action from 'components/molecules/action'
import Subheader from 'components/organisms/subheader'
import { RoundButton } from 'components/atoms/button'

import { Action as ActionType, NavigateItem } from 'src/types'
import { colors } from 'constants/colors'

type RouteProps = RouteComponentProps<{ connection: string }>
type MapStateToProps = ReturnType<typeof mapStateToProps>

interface ActionsProps extends RouteProps, WithTranslation {
  actions: ActionType[]
}

export const Actions: React.FC<ActionsProps> = ({
  t,
  history,
  actions,
  match: {
    params: { connection }
  }
}) => {
  const transferTypes = [
    {
      type: 'scheduled',
      name: t('actions:scheduled')
    },
    {
      type: 'conditional',
      name: t('actions:conditional')
    }
  ]

  function navigate(item?: NavigateItem) {
    const operation = item ? (item.id ? `edit/${item.id}` : `create/${item.type}`) : 'create'
    history.push(`/actions/${connection}/${operation}`)
  }

  return (
    <>
      <View style={styles.view}>
        <Subheader title={t('actions:title')} />
        {!actions.length && (
          <>
            <Text style={styles.message}>{t('actions:noActions')}</Text>
            <Text style={styles.message}>{t('actions:mostPopular')}</Text>
          </>
        )}
        <ScrollView style={styles.listContainer}>
          <SectionList
            renderItem={({ item }) => <Action {...item} onPress={() => navigate(item)} />}
            sections={[{ data: actions.length ? actions : transferTypes }]}
            keyExtractor={(_, index) => `act-${index}`}
          />
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <RoundButton onPress={() => navigate()}>{t('actions:title')}</RoundButton>
      </View>
    </>
  )
}

const mapStateToProps = (state: AppState, props: RouteProps) => ({
  actions: state.actions.actions.filter(action => {
    return action.to && action.to.id === props.match.params.connection
  })
})

export default compose(
  withRouter,
  connect<MapStateToProps>(mapStateToProps),
  withTranslation(['common', 'transactions', 'overview', 'months'])
)(Actions)

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    position: 'relative'
  },
  listContainer: {
    width: '100%'
  },
  message: {
    paddingTop: 22,
    paddingHorizontal: 20,
    fontFamily: 'fira-sans',
    fontSize: 18,
    width: '100%',
    color: colors.black
  },
  buttonContainer: {
    padding: 12,
    marginBottom: 20
  }
})
