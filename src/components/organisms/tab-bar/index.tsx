import React, { useRef, useEffect, useMemo } from 'react'
import { View, StyleSheet, Animated, Image, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

import { useLocation, Link } from 'routing'

import Badge from 'components/atoms/badge'

import { screenNormalizer } from 'utils'
import { colors } from 'constants/colors'

const TabBar: React.FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const badgeAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (pathname !== '/messages') {
      Animated.spring(badgeAnimation, {
        toValue: 1,
        bounciness: 15,
        useNativeDriver: true
      }).start()
    } else {
      badgeAnimation.setValue(0)
    }
  }, [pathname, badgeAnimation])

  const { homeOn, messageOn, menuOn } = useMemo(
    () => ({
      homeOn: !pathname.startsWith('/messages') && !pathname.startsWith('/menu'),
      messageOn: pathname.startsWith('/messages'),
      menuOn: pathname.startsWith('/menu')
    }),
    [pathname]
  )

  return (
    <View style={styles.view}>
      <View style={styles.item}>
        <Link to="/overview" style={{ textDecorationLine: 'none' }}>
          <View>
            <Image
              source={homeOn ? require('assets/icons/ic-home.png') : require('assets/icons/ic-home-off.png')}
              style={{ width: 36, height: 36 }}
            />
            <Text>{t('tabBar:home')}</Text>
          </View>
        </Link>
      </View>
      <View style={styles.item}>
        <Link to="messages" style={{ textDecorationLine: 'none' }}>
          <View>
            <Image
              source={messageOn ? require('assets/icons/ic-messages.png') : require('assets/icons/ic-messages-off.png')}
              style={styles.icon}
            />
            <Animated.View style={[styles.badge, { transform: [{ scale: badgeAnimation }] }]}>
              <Badge>1</Badge>
            </Animated.View>
            <Text>{t('tabBar:messages')}</Text>
          </View>
        </Link>
      </View>
      <View style={styles.item}>
        <Link to="/menu" style={{ textDecorationLine: 'none' }}>
          <View>
            <Image
              source={menuOn ? require('assets/icons/ic-menu.png') : require('assets/icons/ic-menu-off.png')}
              style={{ width: 36, height: 36 }}
            />
            <Text>{t('tabBar:menu')}</Text>
          </View>
        </Link>
      </View>
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1,
    paddingBottom: screenNormalizer.bottom,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8
  },
  icon: {
    width: 36,
    height: 36,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
