import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { compose, connect, Dispatch, AppState } from 'store'
import { View, StyleSheet, Platform, Dimensions, Animated } from 'react-native'
import SideMenu from 'react-native-side-menu'
import { Switch, RouteComponentProps } from 'src/routing'
import Header from 'components/organisms/header'
import TabBar from 'components/organisms/tab-bar'
import { screenNormalizer } from 'utils'
import { colors } from 'constants/colors'
import Accounts from 'components/views/accounts'
import { toggleSidebar as toggleSidebarAction, UIAction } from 'store/actions/ui'
import { loginRoutes } from 'constants/login-routes'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends RouteComponentProps, MapStateToProps, MapDispatchToProps {
  children: React.ReactElement[]
}

interface State {
  menuAnimation: Animated.Value
  menuOpen?: boolean
}

const LayoutBase: React.FC<Props> = props => {
  const [state, setState] = useState<State>({
    menuAnimation: new Animated.Value(0)
  })

  const {
    location: { pathname },
    children,
    toggleSidebar
  } = props

  const renderTabBar = () =>
    !pathname.startsWith('/transfers') &&
    !pathname.startsWith('/openbanking') &&
    !pathname.startsWith('/connect') &&
    !loginRoutes.includes(pathname)

  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <SideMenu
        menu={<Accounts closeMenu={toggleSidebar} menuAnimation={state.menuAnimation} />}
        openMenuOffset={Dimensions.get('window').width}
        onSliding={(animationState: number) => state.menuAnimation.setValue(animationState)}
        onChange={(menuOpen: boolean) =>
          setState({
            ...state,
            menuOpen
          })
        }
        isOpen={props.showSidebar}
        menuPosition="right"
      >
        <View style={[styles.layout, renderTabBar() && styles.tabBarSpacing]}>
          {Platform.OS === 'web' && !loginRoutes.includes(pathname) && <Header pathname={pathname} />}
          <Switch
            renderNavBar={() => <Header />}
            hideBackButton
            cardStyle={styles.cardStyle}
            renderLeftButton={() => null}
            navBarStyle={styles.navBarStyle}
          >
            {children}
          </Switch>
        </View>
        {renderTabBar() && <TabBar />}
      </SideMenu>
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: colors.white
  },
  tabBarSpacing: {
    paddingBottom: 72 + screenNormalizer.bottom
  },
  navBarStyle: {
    backgroundColor: colors.white
  },
  cardStyle: {
    backgroundColor: colors.white
  }
})

const mapStateToProps = (state: AppState) => ({
  showSidebar: state.ui.showSidebar
})

const mapDispatchToProps = (dispatch: Dispatch<UIAction>) => ({
  toggleSidebar: () => dispatch(toggleSidebarAction())
})

export default compose(
  withRouter,
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)
)(LayoutBase)
