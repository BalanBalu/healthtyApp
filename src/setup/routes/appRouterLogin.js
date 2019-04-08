import { createStackNavigator,  createAppContainer } from 'react-navigation';
import { AppRoutes } from './appRouterConfig'

const AppNavigator = createStackNavigator((AppRoutes), {
    initialRouteName: 'login',
    headerMode: 'none',
    navigationOptions: { headerVisible: false }
})
export default createAppContainer(AppNavigator)
  
  