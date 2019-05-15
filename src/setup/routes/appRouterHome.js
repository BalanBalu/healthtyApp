import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
//import { routes } from './appRouterConfig';
import AuthLoadingScreen from './AuthLoadingScreen';

import Home from "../../modules/screens/home";
import Profile from "../../modules/screens/userprofile";
import finddoctor from "../../modules/screens/auth/finddoctor";
import { Icon } from 'native-base';
import Categories from "../../modules/screens/categories";


import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import userdetails from "../../modules/screens/auth/userdetails";
import Reviews from "../../modules/screens/Reviews";
import doctorSearchList from "../../modules/screens/doctorSearchList";
import FilterList from "../../modules/screens/FilterList";
import PaymentPage from "../../modules/screens/PaymentPage";
import PaymentReview from "../../modules/screens/PaymentReview";
import PaymentSuccess from "../../modules/screens/PaymentSuccess";


import { Col, Grid, Row } from 'react-native-easy-grid';
import { logout } from '../../modules/providers/auth/auth.actions';
import { TouchableOpacity, Image } from 'react-native'


import menuIcon from '../../../assets/images/menu.png';
import profileAvatar from '../../../assets/images/profileAvatar.png';


import { HeaderBackButton } from 'react-navigation';
import BookAppoinment from "../../modules/screens/bookappoinment";


const routes = {
  Home: {
    name: 'Home',
    path: 'Home',
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon
        name={'apps'}
        size={20}
        color={tintColor}
      />,

    }
  },
  Profile: {
    name: 'Profile',
    path: 'Profile',
    screen: Profile,
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
  initialRouteName: 'Home',
  defaultNavigationOptions: { tabBarVisible: true },
  tabBarOptions: {
    activeTintColor: '#0000FF',
    inactiveTintColor: '#D3D3D3',

    style: {
      backgroundColor: "#FFFFFF",
      paddingVertical: 25,
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


const AuthRoutes = {
  login: {
    screen: login,
  },
  signup: {
    screen: signup,
  },
  forgotpassword: {
    screen: forgotpassword,
  },
  userdetails: {
    screen: userdetails,
  },
  BookAppoinment: {
    screen: BookAppoinment
  }
}
const AuthStack = createStackNavigator(AuthRoutes, {
  initialRouteName: 'login',
  headerMode: "none",
  navigationOptions: { headerVisible: false }
})

const AppointMentstack = createStackNavigator({
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: ({ navigation }) => ({
      title: 'Doctor List',
      headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Home') }} />)
    })
  },
  "Book Appoinment": {
    screen: BookAppoinment,
    navigationOptions: {
      title: 'Book Appoinment'
    }
  },
  Filters: {
    screen: FilterList,
    navigationOptions: {
      title: 'Filters'
    }
  },
  paymentpage: {
    screen: PaymentPage
  },
  paymentreview: {
    screen: PaymentReview
  },
  paymentsuccess: {
    screen: PaymentSuccess
  },
  reviews: {
    screen: Reviews
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  })


const AppointMentstack1 = createStackNavigator({
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: ({ navigation }) => ({
      title: 'Doctor List',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
        </TouchableOpacity>
      ),
    })
  },
  Filters: {
    screen: FilterList,
    navigationOptions: {
      title: 'Filters'
    }
  },
  paymentpage: {
    screen: PaymentPage
  },
  paymentreview: {
    screen: PaymentReview
  },
  paymentsuccess: {
    screen: PaymentSuccess
  },
  reviews: {
    screen: Reviews
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      title: 'DashBoard',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image
            style={{ marginLeft: 18, tintColor: 'white' }}
            source={menuIcon}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <Row>
          <Col>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                style={{ marginRight: 18, height: 35, width: 35, borderColor: '#f5f5f5', borderWidth: 2, borderRadius: 50 }}
                source={profileAvatar}
              />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity onPress={() => { logout(); navigation.navigate('login') }}>
              <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
            </TouchableOpacity>
          </Col>
        </Row>
      ),
    })
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
      title: 'Specialists',
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
    })
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3' },
      headerTintColor: 'white',
    })
  })

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'Profile',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
        </TouchableOpacity>
      ),
    })
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });

const categoryStack = createStackNavigator({
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
      title: 'Specialists',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
        </TouchableOpacity>
      ),
    })
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });
const DrawerNavigator = createDrawerNavigator({
  Home: HomeStack,
  Profile: ProfileStack,
  categoryStack,
  Appointments: AppointMentstack1
},
  {
    initialRouteName: 'Home'
  })


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DrawerNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading'

  }
));

// export const appStack = createStackNavigator(AppRoutes, {
//   initialRouteName: 'Home',
//   headerMode: 'none',
//   navigationOptions: { headerVisible: false }
// })
// const stack = createStackNavigator({ AppTabs, appStack }, { headerMode: "none" });
//export default createAppContainer(stack)

