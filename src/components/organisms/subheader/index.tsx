import React from 'react'
import { withRouter, RouteComponentProps } from 'src/routing'
import { StyleSheet, View } from 'react-native'
import { History } from 'history'
import { colors } from 'constants/colors'
import SubheaderStandard from 'components/molecules/subheader/standard'

interface Props extends RouteComponentProps {
  title?: string
  hideBackButton?: boolean
  onBackPress?({ history }: { history: History }): void
  CustomHeader?: React.ComponentType
}

const Subheader: React.FC<Props> = ({ CustomHeader, ...props }) => (
  <View style={styles.container}>{CustomHeader ? <CustomHeader /> : <SubheaderStandard {...props} />}</View>
)

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.VERY_LIGHT_GREY,
    width: '100%'
  }
})

export default withRouter(Subheader)
