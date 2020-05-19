import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Link } from 'routing'

import Icon from 'components/atoms/icon'

import { screenNormalizer } from 'utils'

interface Props {
  pathname?: string
}

const Header: React.FC<Props> = ({ pathname }) => (
  <View style={styles.header}>
    <View style={styles.logo}>
      {pathname ? (
        <Link to="/overview">
          <Icon name="ic-logo" width="135" height="35" />
        </Link>
      ) : (
        <Icon name="ic-logo" width="135" height="35" />
      )}
    </View>
  </View>
)

export default Header

const styles = StyleSheet.create({
  header: {
    padding: 0,
    paddingTop: screenNormalizer.top,
    backgroundColor: 'white',
    position: 'relative'
  },
  logo: {
    paddingTop: 33,
    marginBottom: 14,
    alignSelf: 'center'
  }
})
