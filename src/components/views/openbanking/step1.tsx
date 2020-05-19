import React from 'react'
import { View, Animated, TouchableOpacity, Text, StyleSheet, Platform, FlatList, Image } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppState } from 'store'
import ProviderLogos from 'services/provider-logos'
import { useHistory } from 'routing'

import Icon from 'components/atoms/icon'
import { IconButton, RoundButton } from 'components/atoms/button'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

type Provider = AppState['providers']['providers'][0]

interface Props {
  loadProviders(): void
  providers: Provider[]
  onContinue(item: Partial<Provider>): void
}

const Step1: React.FC<Props> = ({ loadProviders, providers, onContinue }) => {
  const opacity = useFadeIn()
  const { t } = useTranslation()
  const history = useHistory()
  const allProviders: Partial<Provider>[] = [...providers, { title: 'Not found message' }]

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader title={t('openbanking:step1:title')} />

        <View style={styles.container}>
          <View style={styles.subtitleWrap}>
            <View>
              <Text style={styles.subtitle}>{t('openbanking:step1:subtitle')}</Text>
            </View>
            <IconButton
              action={loadProviders}
              icon={<Icon name="ic-transfer-5" width="20" height="20" />}
              style={styles.subtitleIcon}
            />
          </View>
          <View style={styles.invite}>
            <RoundButton
              icon={<Icon name="open-banking" width="20" height="20" />}
              onPress={() => history.push('/openbanking/invite')}
              background={colors.orange}
              textColor={colors.white}
            >
              {t('openbanking:invite:button')}
            </RoundButton>
          </View>
          <FlatList
            style={styles.listContainer}
            data={allProviders}
            keyExtractor={(item: Provider) => item.title}
            renderItem={({ item, index }) =>
              index === allProviders.length - 1 ? (
                <View style={styles.notFound}>
                  <Text style={[styles.subtitle, styles.notFoundTitle]}>{t('openbanking:step1:notFound:title')}</Text>
                  <Text style={styles.notFoundText}>{t('openbanking:step1:notFound:text')}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => onContinue(item)}>
                  <View style={[styles.item, index === 0 && styles.itemFirst]}>
                    {!item.logo || !ProviderLogos[item.logo] ? null : (
                      <Image source={ProviderLogos[item.logo]} style={[styles.itemLogo]} />
                    )}
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Icon name="ic-chevron" width={30} height={30} />
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>
      </View>
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
        bottom: 0
      }
    })
  },
  container: {
    paddingTop: 10
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.VERY_LIGHT_GREY,
    paddingBottom: 11,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  logo: {
    marginBottom: 14,
    alignSelf: 'center'
  },
  lead: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    left: 8,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonIcon: {
    transform: [{ rotate: '-180deg' }, { scaleY: 0.8 }, { scaleX: 0.8 }]
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'fira-sans-semi-bold'
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'fira-sans-semi-bold',
    fontStyle: 'normal',
    letterSpacing: -0.51,
    textAlign: 'center',
    color: colors.lightBlue
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
  },
  notFound: {
    borderRadius: 8,
    backgroundColor: colors.orange,
    padding: 12,
    marginTop: 10,
    marginBottom: 11,
    marginLeft: 11,
    marginRight: 11,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1
  },
  notFoundTitle: {
    color: colors.white,
    margin: 0,
    marginLeft: 0,
    marginRight: 0
  },
  notFoundText: {
    color: colors.white,
    fontFamily: 'fira-sans-semi-bold',
    fontSize: 16,
    lineHeight: 22
  },
  subtitleIcon: {
    marginRight: 16
  },
  subtitleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10
  },
  invite: { marginHorizontal: 11 }
})

export default Step1
