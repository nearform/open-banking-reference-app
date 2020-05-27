import React from 'react'
import { ScrollView, View, Animated, TouchableOpacity, Text, StyleSheet, Platform, FlatList, Image } from 'react-native'
import { useTranslation } from 'react-i18next'

import Icon from 'components/atoms/icon'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { Institution } from 'src/types'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

interface Props {
  institutions: Institution[]
  onContinue(institution: Institution): void
}

const Step2: React.FC<Props> = ({ institutions, onContinue }) => {
  const {t} = useTranslation()
  const opacity = useFadeIn()

  return (
    <Animated.View style={{ flex: 1, opacity, width: '100%' }}>
      <ScrollView>
        <View style={styles.view}>
          <Subheader hideBackButton title={t('connect:step2:title')} />

          <View style={styles.container}>
            <Text style={styles.subtitle}>{t('connect:step2:subtitle')}</Text>
            <FlatList
              style={styles.listContainer}
              data={institutions}
              keyExtractor={(item: Institution) => item.id}
              renderItem={({ item, index }) => {
                const icon = item.media.find(media => media.type === 'icon')

                return (
                  <TouchableOpacity onPress={() => onContinue(item)}>
                    <View style={[styles.item, index === 0 && styles.itemFirst]}>
                      {icon && <Image source={{ uri: icon.source }} style={[styles.itemLogo]} />}
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <Icon name="ic-chevron" width={30} height={30} />
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: screenNormalizer.top,
    paddingBottom: screenNormalizer.bottom,
    ...Platform.select({
      android: {
        paddingTop: 0
      },
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%'
      }
    })
  },
  container: {
    paddingTop: 20
  },
  subtitle: {
    marginLeft: 16,
    marginRight: 16,
    fontFamily: 'fira-sans-semi-bold',
    color: colors.lightBlue,
    fontSize: 16
  },
  listContainer: {
    marginTop: 18
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 6,
    paddingLeft: 16,
    paddingRight: 16
  },
  itemFirst: {
    marginTop: 6
  },
  itemLogo: { width: 36, height: 36 },
  itemTitle: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'fira-sans',
    fontSize: 18
  }
})

export default Step2
