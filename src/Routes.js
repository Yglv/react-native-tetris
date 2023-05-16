import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import GameMenu from './GameMenu'
import Game from './Game'
import { Header } from './Header'

const MainNavigator = createStackNavigator({
  GameMenu: { screen: GameMenu, name: 'Menu'},
  Game: { screen: Game }
})

// Hide the header from GameMenu stack
GameMenu.navigationOptions = {
  header: null
}

// Hide the header from Game stack
Game.navigationOptions = {
  headerTitle: () => <Header name=''/>,
  headerStyle: {
    height: 79,
    backgroundColor: 'blue',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: 'white',
  headerBackTitle: 'Menu'
}

const App = createAppContainer(MainNavigator)

export default App
