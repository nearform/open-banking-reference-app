import React from 'react'
import { Animated, View, StyleSheet, ScrollView, Text, Image, Platform, ImageSourcePropType } from 'react-native'
import { Link } from 'routing'
import { useTranslation } from 'react-i18next'

import Icon from 'components/atoms/icon'
import EditButton from 'components/atoms/edit-button'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'
import { screenNormalizer } from 'utils'
import { useFadeIn } from 'utils/hooks'

interface Destination {
  icon: string
  name: string
}

interface ListItem {
  iconSource: ImageSourcePropType
  name: string
}

interface ListWithTitleProps {
  title: string
  list: ListItem[]
}

const destinationRows: Array<Array<Destination>> = [
  [
    { icon: 'ic-transfer-1', name: 'transfers:step1:item1' },
    { icon: 'ic-transfer-2', name: 'transfers:step1:item2' }
  ],
  [
    { icon: 'ic-transfer-3', name: 'transfers:step1:item3' },
    { icon: 'ic-transfer-4', name: 'transfers:step1:item4' }
  ],
  [
    { icon: 'ic-transfer-5', name: 'transfers:step1:item5' },
    { icon: 'ic-transfer-6', name: 'transfers:step1:item6' }
  ]
]

const utilities: ListItem[] = [
  { iconSource: require('assets/logos/vodafone.png'), name: 'Vodafone' },
  { iconSource: require('assets/logos/edp.png'), name: 'Edp' },
  { iconSource: require('assets/logos/naturgy.png'), name: 'Naturgy' }
]

const contacts: ListItem[] = [
  { iconSource: require('assets/avatars/avi1.png'), name: 'João' },
  { iconSource: require('assets/avatars/avi2.png'), name: 'Edite' },
  { iconSource: require('assets/avatars/avi3.png'), name: 'Inês' }
]

const ListWithTitle: React.FC<ListWithTitleProps> = ({ title, list }) => (
  <>
    <View style={[styles.row, styles.reducedRow]}>
      <Text style={styles.extraHeading}>{title}</Text>
    </View>
    <View style={[styles.row]}>
      {list.map(({ iconSource, name }, i) => (
        <View style={styles.item} key={i}>
          <View style={styles.figure}>
            <Image source={iconSource} style={styles.figureContent} />
          </View>
          <Text style={styles.transferTitle}>{name}</Text>
        </View>
      ))}
      <View style={styles.item}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <EditButton fill={colors.lightBlue} />
        </View>
        <Text style={[styles.transferTitle, { opacity: 0 }]}>Plus</Text>
      </View>
    </View>
  </>
)

export const Transfer: React.FC = () => {
  const {t} = useTranslation()
  const opacity = useFadeIn()

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View style={styles.view}>
        <Subheader title={t('transfers:step1:title')} />
        <View style={styles.container}>
          <ScrollView>
            {destinationRows.map((destinations, i) => (
              <View style={styles.row} key={i}>
                {destinations.map(({ icon, name }, j) => (
                  <Link to="/transfers/between-accounts" key={j}>
                    <View style={styles.item}>
                      <View style={styles.iconContainer}>
                        <Icon name={icon} width={39} height={39} />
                      </View>
                      <Text style={styles.transferTitle}>{t(name)}</Text>
                    </View>
                  </Link>
                ))}
              </View>
            ))}
            <ListWithTitle title={t('transfers:step1:utilities')} list={utilities} />
            <ListWithTitle title={t('transfers:step1:contacts')} list={contacts} />
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  )
}

export default Transfer

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'column',
    paddingTop: screenNormalizer.top,
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
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 20
  },
  header: {
    marginBottom: 40,
    flex: 0
  },
  backButton: {
    position: 'absolute',
    left: 21,
    top: 3,
    zIndex: 2,
    transform: [{ rotate: '-180deg' }]
  },
  headerTitle: {
    fontFamily: 'NB',
    fontSize: 21,
    fontStyle: 'normal',
    letterSpacing: -0.51,
    textAlign: 'center',
    color: colors.black
  },
  row: {
    flexDirection: 'row',
    marginBottom: 34,
    justifyContent: 'space-around'
  },
  reducedRow: {
    marginBottom: 12
  },
  link: {
    display: 'flex'
  },
  item: {
    flex: 1,
    minHeight: 85,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 64 / 2,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 12
  },
  figure: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 1
  },
  figureContent: {
    width: 48,
    height: 48
  },
  extraHeading: {
    fontFamily: 'NB',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.51,
    color: colors.darkBlue
  },
  transferTitle: {
    fontFamily: 'fira-sans-bold',
    fontSize: 14,
    letterSpacing: -0.34,
    textAlign: 'center',
    color: colors.black,
    margin: 6,
    width: 90
  }
})
