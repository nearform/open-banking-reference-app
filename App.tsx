import React, { Component } from 'react'
import { initialState, Provider, AppState } from './src/store'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { AsyncStorage, Image, Text, YellowBox } from 'react-native'

import App from './src/app'

// Mute multiple known warnings to display on device. Those warning messages coming from React Native components and need to be fixed by RN team
YellowBox.ignoreWarnings(['Animated', 'Warning: componentWill', 'Possible Unhandled Promise'])

function cacheImages(images: any[]) {
  return images.map((image: any) => {
    // network only
    if (typeof image === 'string' && image.startsWith('http')) {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}

type State = typeof state

const state = {
  pin: null as string | null,
  fontLoaded: false
}

class PolarisBank extends Component<{}, State> {
  state: State = state

  async componentDidMount() {
    const pin = await AsyncStorage.getItem('@PolarisBank:pin')

    const fonts = Font.loadAsync({
      NB: require('./src/assets/fonts/FiraSans-Regular.ttf'),
      'fira-sans-bold': require('./src/assets/fonts/FiraSans-SemiBold.ttf'),
      'fira-sans-light': require('./src/assets/fonts/FiraSans-Light.ttf'),
      'fira-sans': require('./src/assets/fonts/FiraSans-Regular.ttf'),
      'fira-sans-semi-bold': require('./src/assets/fonts/FiraSans-SemiBold.ttf')
    })

    const images = cacheImages([
      require('./src/assets/images/ic-screen1.png'),
      require('./src/assets/images/ic-screen2.png'),
      require('./src/assets/images/ic-screen3.png'),
      require('./src/assets/avatars/avi1.png'),
      require('./src/assets/avatars/avi2.png'),
      require('./src/assets/avatars/avi3.png'),
      require('./src/assets/avatars/avi4.png'),
      require('./src/assets/avatars/avi3.png'),
      require('./src/assets/logos/appicon.png'),
      require('./src/assets/logos/appicon2.png'),
      require('./src/assets/logos/appicon3.png'),
      require('./src/assets/logos/edp.png'),
      require('./src/assets/logos/naturgy.png'),
      require('./src/assets/logos/vodafone.png'),
      require('./src/assets/logos/amazon.png'),
      require('./src/assets/logos/tap.png'),
      require('./src/assets/logos/starbucks.png'),
      require('./src/assets/logos/spotify.png'),
      require('./src/assets/logos/abanca.png'),
      require('./src/assets/logos/bbva.png'),
      require('./src/assets/logos/bnm.png'),
      require('./src/assets/logos/bancamarch.png'),
      require('./src/assets/logos/bancopastor.png'),
      require('./src/assets/logos/santander.png'),
      require('./src/assets/logos/santander-red.png'),
      require('./src/assets/logos/santander-big.png'),
      require('./src/assets/logos/caixa.png'),
      require('./src/assets/logos/deutsche.png'),
      require('./src/assets/logos/ING.png'),
      require('./src/assets/logos/ibercaja.png'),
      require('./src/assets/logos/forgerock.png'),
      require('./src/assets/logos/polaris.png'),
      require('./src/assets/icons/icClothing.png'),
      require('./src/assets/icons/fitness.png'),
      require('./src/assets/icons/coffee.png'),
      require('./src/assets/icons/icCamera.png'),
      require('./src/assets/icons/ic-menu.png'),
      require('./src/assets/icons/ic-menu-off.png'),
      require('./src/assets/icons/ic-home.png'),
      require('./src/assets/icons/ic-home-off.png'),
      require('./src/assets/icons/ic-messages.png'),
      require('./src/assets/icons/ic-messages-off.png')
    ])

    await Promise.all([...images, fonts])

    this.setState({ pin, fontLoaded: true })
  }

  render() {
    return this.state.fontLoaded ? <App /> : null
  }
}

interface RootState {
  store?: AppState
}

export default class PolarisBankApp extends Component<{}, RootState> {
  state: RootState = {}

  async componentDidMount() {
    let localState: AppState | undefined
    try {
      const stateFromStorage = await AsyncStorage.getItem('@PolarisBank:state')
      if (stateFromStorage) {
        localState = JSON.parse(stateFromStorage)
      }
    } catch (_) {}
    this.setState({ store: initialState(localState) })
  }

  render() {
    const { store } = this.state

    if (!store) {
      return <Text>Loading...</Text>
    }

    return (
      <Provider initialState={store}>
        <PolarisBank />
      </Provider>
    )
  }
}
