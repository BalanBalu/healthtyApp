import React, { Component } from 'react';
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
import { TouchableOpacity, Image, Text, AppRegistry, AsyncStorage } from 'react-native'

import menuIcon from '../../../assets/images/menu.png';
import BookAppoinment from "../../modules/screens/bookappoinment";
import Mapbox from "../../modules/screens/bookappoinment/Mapbox";
import AppointmentDetails from '../../modules/screens/MyAppointments/AppointmentDetails';
import MyAppoinmentList from '../../modules/screens/MyAppointments/MyAppointmentList';
import CancelAppointment from "../../modules/screens/MyAppointments/cancelAppointment";

import PharmacyHome from '../../modules/screens/Pharmacy/PharmacyHome/PharmacyHome';
import MyOrdersList from '../../modules/screens/Pharmacy/MyOrdersList/MyOrdersList';
import OrderDetails from '../../modules/screens/Pharmacy/OrderDetails/OrderDetails';
import OrderPayment from '../../modules/screens/Pharmacy/OrderPayment/OrderPayment';
import PharmacyCart from '../../modules/screens/Pharmacy/PharmacyCart/PharmacyCart';
import OrderPaymentSuccess from '../../modules/screens/Pharmacy/OrderPaymentSuccess/OrderPaymentSuccess';
import UploadPrescription from '../../modules/screens/Pharmacy/PharmacyHome/UploadPrescription';
import OrderPaymentAddress from '../../modules/screens/Pharmacy/OrderPaymentAddress/OrderPaymentAddress';
import OrderPaymentPreview from '../../modules/screens/Pharmacy/OrderPaymentPreview/OrderPaymentPreview';
import OrderMedicineDetails from '../../modules/screens/Pharmacy/OrderMedicineDetails/OrderMedicineDetails';
import MedicineSearchList from '../../modules/screens/Pharmacy/MedicineSearchList/MedicineSearchList';
import MedicineCheckout from '../../modules/screens/Pharmacy/MedicineCheckout/MedicineChekout';
import { store } from '../store';
import { fetchUserNotification, UpDateUserNotification } from '../../modules/providers/notification/notification.actions'
import { Badge } from '../../../src/modules/common'
// const data = store.getState().notification.notificationCount;

// console.log(data)
const routes = {
  Home: {
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
      tabBarIcon: ({ tintColor }) =>

        <Icon
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
  paymentPage: {
    screen: PaymentPage,
    navigationOptions: {
      title: 'Payment Page'
    }
  },

  

  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: {
      headerLeft: null,

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
              <View>
                <Icon name="notifications" style={{ color: '#fff', marginRight: 10, fontFamily: 'opensans-semibold' }}></Icon>
               
                <Badge/>
              </View>
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
    navigationOptions: {
      title: 'Update Email'
    }
  },
  UpdateContact: {
    screen: UpdateContact,
    navigationOptions: {
      title: 'Update Contact'
    }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {
      title: 'Update Password'
    }
  },
  UpdateInsurance: {
    screen: UpdateInsurance,
    navigationOptions: {
      title: 'Update Insurance'
    }
  },

  UpdateUserDetails: {
    screen: UpdateUserDetails,
    navigationOptions: {
      title: 'Update User Details'
    }
  },

  UpdateAddress: {
    screen: UpdateAddress,
    navigationOptions: {
      title: 'Update Address'
    }
  },
  "Book Appointment": {
    screen: BookAppoinment,
    navigationOptions: {
      title: 'Book Appointment'
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
  Pharmacy: {
    screen: PharmacyHome,
    navigationOptions: ({ navigation }) => ({
      title: 'Medflic Pharmacy',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
        </TouchableOpacity>
      ),
    })
  },
  UploadPrescription: {
    screen: UploadPrescription,
    navigationOptions: {
      title: 'Upload Prescription'
    }
  },
  medicineSearchList: {
    screen: MedicineSearchList,
    navigationOptions: {
      title: 'Search List'
    }
  },
  MedicineCheckout: {
    screen: MedicineCheckout,
    navigationOptions: {
      title: 'Checkout'
    }
  },
  OrderPaymentPreview: {
    screen: OrderPaymentPreview,
    navigationOptions: {
      title: 'Payment Preview'
    }
  },
  OrderPayment: {
    screen: OrderPayment,
    navigationOptions: {
      title: 'Payment Page'
    }
  },
  PharmacyCart: {
    screen: PharmacyCart,
    navigationOptions: {
      title: 'Pharmacy Cart'
    }
  },
  OrderPaymentSuccess: {
    screen: OrderPaymentSuccess,
    navigationOptions: {
      title: 'Payment Success'
    }
  },

  OrderPaymentAddress: {
    screen: OrderPaymentAddress,
    navigationOptions: {
      title: 'Order Payment Address'
    }
  }
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' },
      headerTintColor: 'white',
    })
  });


const OrdersStack = createStackNavigator({
  Orders: {
    screen: MyOrdersList,
    navigationOptions: ({ navigation }) => ({
      title: 'Orders List',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" style={{ marginLeft: 18, color: '#fff', fontFamily: 'opensans-semibold' }}></Icon>
        </TouchableOpacity>
      ),
    })
  },
  MyOrdersList: {
    screen: MyOrdersList,
    navigationOptions: {
      title: 'Order List'
    }
  },

  OrderDetails: {
    screen: OrderDetails,
    navigationOptions: {
      title: 'My Order'
    }
  },

  OrderMedicineDetails: {
    screen: OrderMedicineDetails,
    navigationOptions: {
      title: 'Medicine Details'
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



const paymentStack = createStackNavigator({

  paymentpage: {
    screen: PaymentPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Payment Page',

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
  Pharmacy: PharmacyStack,
  Orders: OrdersStack
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
    Pharmacy: PharmacyStack,
    Orders: OrdersStack
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
