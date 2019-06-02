import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
//import { routes } from './appRouterConfig';
import AuthLoadingScreen from './AuthLoadingScreen';

import Home from "../../modules/screens/Home";
import Profile from "../../modules/screens/userprofile";
import finddoctor from "../../modules/screens/auth/finddoctor";
import { Icon, View } from 'native-base';
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
import MyAppointments from '../../modules/screens/myappoinment';
import AppointmentDetails from '../../modules/screens/myappoinment/myappoinmentinformation';
import MyAppoinmentList from '../../modules/screens/myappoinmentdetail';


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
  }
}
const AuthStack = createStackNavigator(AuthRoutes, {
  initialRouteName: 'login',
  headerMode: "none",
  navigationOptions: { headerVisible: false }
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
  "Book Appointment": {
    screen: BookAppoinment,
    navigationOptions: {
      title: 'Book Appointment'
    }
  },
  paymentpage: {
    screen: PaymentPage
  },
  // paymentreview: {
  //   screen: PaymentReview
  // },
  "Payment Review": {
    screen: PaymentReview,
    navigationOptions: {
      title: 'Payment Review'
    }
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: {
      title: 'Success'
    }
  },
  "Reviews" : {
    screen: Reviews,
    navigationOptions: {
      title: 'Reviews'
    }
  }
 },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });

  const myAppointmentsStack = createStackNavigator({
    "My Appointments": {
      screen: MyAppoinmentList,
      navigationOptions: ({ navigation }) => ({
        title: 'Appointments',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
          </TouchableOpacity>
        ),
      })
    },
    "AppointmentInfo": {
      screen: AppointmentDetails,
      navigationOptions: {
        title: 'Appointment Info'
      }
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
        <Grid>

          <Col>
            <TouchableOpacity onPress={() => { console.log('clicking'); navigation.navigate('Profile')}} >
            <Icon name="contact" style={{ color: '#fff', marginRight: 10, fontFamily: 'opensans-semibold' }}></Icon>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity onPress={() => { logout(); navigation.navigate('login') }}>
              <Icon name="log-out" style={{ marginRight: 5, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
            </TouchableOpacity>
          </Col>
        </Grid>
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
  "My Appointments": myAppointmentsStack,
  
},
  {
    initialRouteName: 'Home'
  })


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DrawerNavigator,
    Auth: AuthStack,
    categoryStack,
    Appointments: AppointMentstack1
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none'

  }
));

// export const appStack = createStackNavigator(AppRoutes, {
//   initialRouteName: 'Home',
//   headerMode: 'none',
//   navigationOptions: { headerVisible: false }
// })
// const stack = createStackNavigator({ AppTabs, appStack }, { headerMode: "none" });
//export default createAppContainer(stack)


