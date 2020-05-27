import React from 'react'
import { View, Text, StyleSheet, Animated, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { colors } from 'constants/colors'
import Subheader from 'components/organisms/subheader'
import { useFadeIn } from 'utils/hooks'

const Step3: React.FC = () => {
  const { t } = useTranslation()
  const opacity = useFadeIn()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader hideBackButton title={t('transfers:step4:title')} />
        <View style={[styles.container, styles.completeContainer]}>
          <View>
            <Text style={styles.completeText}>{t('transfers:step4:message')}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    })
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  completeText: {
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black
  }
})

export default Step3
