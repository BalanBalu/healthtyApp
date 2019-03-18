import { createStackNavigator,  createAppContainer } from 'react-navigation';
import { routes } from './appRouterConfig';

const AppNavigator = createStackNavigator((routes), {
    initialRouteName: 'home',
    headerMode: 'none',
    navigationOptions: { headerVisible: false }
})
  export default createAppContainer(AppNavigator)
  
  