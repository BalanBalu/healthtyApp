import React from 'react';
import { Button } from 'native-base';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
//import { routes } from './appRouterConfig';
import AuthLoadingScreen from './AuthLoadingScreen';

import Home from "../../modules/screens/Home";
import Profile from "../../modules/screens/userprofile";
import UpdateEmail from "../../modules/screens/userprofile/UpdateEmail";
import UpdateContact from "../../modules/screens/userprofile/UpdateContact";
import UpdatePassword from "../../modules/screens/userprofile/UpdatePassword";
import UpdateInsurance from "../../modules/screens/userprofile/UpdateInsurance";
import UpdateUserDetails from "../../modules/screens/userprofile/UpdateUserDetails";
//import UploadImage from "../../modules/screens/userprofile/UploadImage";
import UpdateAddress from "../../modules/screens/userprofile/UpdateAddress";




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
import ServicesList from "../../modules/screens/FilterList/Services";
import PaymentPage from "../../modules/screens/PaymentPage";
import PaymentReview from "../../modules/screens/PaymentReview";
import PaymentSuccess from "../../modules/screens/PaymentSuccess";
import InsertReview from '../../modules/screens/Reviews/InsertReview';
import WishList from "../../modules/screens/wishList";
import Notification from "../../modules/screens/Notification";

import { Col, Grid, Row } from 'react-native-easy-grid';
import { logout } from '../../modules/providers/auth/auth.actions';
import { TouchableOpacity, Image } from 'react-native'


import menuIcon from '../../../assets/images/menu.png';
import profileAvatar from '../../../assets/images/profileAvatar.png';


import { HeaderBackButton } from 'react-navigation';
import BookAppoinment from "../../modules/screens/bookappoinment";
import Mapbox from "../../modules/screens/bookappoinment/Mapbox";

import AppointmentDetails from '../../modules/screens/MyAppointments/AppointmentDetails';
import MyAppoinmentList from '../../modules/screens/MyAppointments/MyAppointmentList';
import CancelAppointment from "../../modules/screens/MyAppointments/cancelAppointment";
import MedicineSearch from '../../modules/screens/Pharmacy/MedicineSearch/MedicineSearch';
import MedicineOrderList from '../../modules/screens/Pharmacy/MedicineOrderList/MedicineOrderList';
import MedicineMyOrders from '../../modules/screens/Pharmacy/MedicineMyOrders/MedicineMyOrders';
import MedicalOrderDetails from '../../modules/screens/Pharmacy/MedicalOrderDetails/MedicalOrderDetails'

import MedicineSearchList from '../../modules/screens/Pharmacy/MedicineSearchList/MedicineSearchList';
import MedicineCheckout from '../../modules/screens/Pharmacy/MedicineCheckout/MedicineChekout';
import MedicinePaymentPage from '../../modules/screens/Pharmacy/MedicinePaymentPage/MedicinePaymentPage';
import MedicinePaymentResult from '../../modules/screens/Pharmacy/MedicinePaymentResult/MedicinePaymentResult';
import MedicinePaymentSuccess from '../../modules/screens/Pharmacy/MedicinePaymentSuccess/MedicinePaymentSuccess';
import UploadPrescription from '../../modules/screens/Pharmacy/MedicineSearch/UploadPrescription';


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

 Services: {
      screen: ServicesList,
      navigationOptions: {
      title: 'ServicesList'
    }
   },
  "Book Appointment": {
    screen: BookAppoinment,
    navigationOptions: {
      title: 'Book Appointment'
    }
  },
  "Mapbox": {
    screen: Mapbox,
    navigationOptions: {
      title: 'Mapbox'
    }

  },
  paymentpage: {
    screen: PaymentPage
  },
  Reviews: {
     screen: Reviews,
     navigationOptions: {
      title: 'Reviews'
    }
  },
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
  "CancelAppointment": {
    screen: CancelAppointment,
    navigationOptions: {
      title: 'Cancel Appointment'
    }
  },
  "InsertReview": {
    screen: InsertReview,
    navigationOptions: {
      title: 'Rate and Review'
    }
  }

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
            <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
              <Icon name="notifications" style={{ color: '#fff', marginRight: 10, fontFamily: 'opensans-semibold' }}></Icon>
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

  WishList: {
    screen: WishList,
    navigationOptions: ({ navigation }) => ({
      title: 'WishList',
    })
  },
  Notification: {
    screen: Notification,
    navigationOptions: ({ navigation }) => ({
      title: 'Notification',
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
  UpdateEmail: {
    screen: UpdateEmail,
    navigationOptions:{
     title: 'UpdateEmail'
   }
  },
  UpdateContact: {
    screen: UpdateContact,
    navigationOptions:{
     title: 'UpdateContact'
   }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions:{
     title: 'UpdatePassword'
   }
  },
  UpdateInsurance: {
    screen: UpdateInsurance,
    navigationOptions:{
     title: 'UpdateInsurance'
   }
  },

  UpdateUserDetails: {
    screen: UpdateUserDetails,
    navigationOptions:{
     title: 'UpdateUserDetails'
   }
  },
 
  UpdateAddress: {
    screen: UpdateAddress,
    navigationOptions: {
      title: 'UpdateAddress'
    }
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });

  

  const PharmacyStack = createStackNavigator({
    MedicineList: {
      screen: MedicineSearch,
      navigationOptions: ({ navigation }) => ({
        title: 'Medicine List',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
          </TouchableOpacity>
        ),
      })
    },
    UploadPrescription:{
      screen: UploadPrescription,
      navigationOptions:{
       title: 'UploadPrescription'
     }

      
    },
    medicineSearchList: {
      screen: MedicineSearchList,
      navigationOptions:{
       title: 'Search List'
     }
    },

    MedicineOrderList: {
      screen: MedicineOrderList,
      navigationOptions:{
       title: 'Order List'
     }
    },
    MedicineMyOrders: {
      screen: MedicineMyOrders,
      navigationOptions:{
       title: 'My Order'
     }
    },
       MedicineCheckout: {
      screen: MedicineCheckout,
      navigationOptions:{
       title: 'Checkout'
     }
    },
    MedicinePaymentPage: {
      screen: MedicinePaymentPage,
      navigationOptions:{
       title: 'PaymentPage'
     }
    },
    MedicinePaymentResult: {
      screen: MedicinePaymentResult,
      navigationOptions:{
       title: 'MedicinePaymentResult'
     }
    },
    MedicinePaymentSuccess: {
      screen: MedicinePaymentSuccess,
      navigationOptions: {
       title: 'MedicinePaymentSuccess'
     }
    },
    
    MedicalOrderDetails: {
      screen: MedicalOrderDetails,
      navigationOptions: {
       title: 'MedicalOrderDetails'
     }
    }
  
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
    Appointments: AppointMentstack1,
    Pharmacy: PharmacyStack
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


