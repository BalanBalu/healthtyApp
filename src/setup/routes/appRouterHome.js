import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import { routes } from './appRouterConfig';
import home from "../../modules/screens/home";
import userprofile from "../../modules/screens/userprofile";
import finddoctor from "../../modules/screens/auth/finddoctor";
import { Icon } from 'native-base';
import categories from "../../modules/screens/categories";
import { AppRoutes } from './appRouterConfig'
 const routes = {
  home: {
    name: 'home',
    path: 'home',
    screen: home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon
        name={'apps'}
        size={20}
        color={tintColor}
      />,
      
    }
  },
  userprofile: {
    name: 'userprofile',
    path: 'userprofile',
    screen: userprofile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon
        name={'person'}
        size={20}
        color={tintColor}
      />
    } 
  },
  finddoctor: {
    name: ' finddoctor',
    path: ' finddoctor',
    screen: finddoctor,
    navigationOptions: {
      tabBarLabel: 'doctor',
      tabBarIcon: ({ tintColor }) => <Icon
        name={'notifications'}
        size={20}
        color={tintColor}
      />
    }
  }
}
const AppTabs = createBottomTabNavigator((routes), {
  initialRouteName: 'home',
  navigationOptions: { tabBarVisible: true },
  tabBarOptions: {
    activeTintColor: '#0000FF',
    inactiveTintColor: '#D3D3D3',
    
    style: {
      backgroundColor: "#FFFFFF",
      paddingVertical:25,
      height: 2
    },
    tabStyle: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    labelStyle: {
      marginLeft: 0,
      marginTop: 10 
    }
  }
})


export const appStack = createStackNavigator(AppRoutes, {
  initialRouteName: 'categories',
  headerMode: 'none',
  navigationOptions: { headerVisible: false }
})
const stack = createStackNavigator({ AppTabs, appStack }, { headerMode: "none" });
export default createAppContainer(stack)
  
  