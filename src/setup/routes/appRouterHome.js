import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createDrawerNavigator, NavigationBackAction } from 'react-navigation';
import AuthLoadingScreen from './AuthLoadingScreen';
import SideBar from './SideBar';
import Home from "../../modules/screens/Home";
import Profile from "../../modules/screens/userprofile";
import UpdateEmail from "../../modules/screens/userprofile/UpdateEmail";
import UpdateContact from "../../modules/screens/userprofile/UpdateContact";
import UpdatePassword from "../../modules/screens/userprofile/UpdatePassword";
import UpdateInsurance from "../../modules/screens/userprofile/UpdateInsurance";
import UpdateUserDetails from "../../modules/screens/userprofile/UpdateUserDetails";
import { Icon, View,Thumbnail } from 'native-base';
import IndividualChat from '../../modules/screens/chat/individualChat'
import Categories from "../../modules/screens/categories";
import login from "../../modules/screens/auth/login";
import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import userdetails from "../../modules/screens/auth/userdetails";
import UserAddress from "../../modules/screens/auth/UserAddress";
import MapBox from "../../modules/screens/auth/UserAddress/MapBox";
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
import Chat from "../../modules/screens/chat";
import { Col, Grid, Row } from 'react-native-easy-grid';
import { logout } from '../../modules/providers/auth/auth.actions';
import { TouchableOpacity, Image, Text, Platform,TouchableNativeFeedback } from 'react-native'

import menuIcon from '../../../assets/images/menu.png';
import BookAppoinment from "../../modules/screens/bookappoinment";
import Mapbox from "../../modules/screens/bookappoinment/Mapbox";
import AppointmentDetails from '../../modules/screens/MyAppointments/AppointmentDetails';
import MyAppoinmentList from '../../modules/screens/MyAppointments/MyAppointmentList';
import CancelAppointment from "../../modules/screens/MyAppointments/cancelAppointment";
import AddReminder from '../../modules/screens/Reminder/AddReminder'
import Reminder from '../../modules/screens/Reminder/Reminders'
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
import { Badge } from '../../../src/modules/common'
import Locations from '../../modules/screens/Home/Locations';
import BloodDonersList from '../../modules/screens/bloodDonation/BloodDonersList';
import BloodDonerFilters from '../../modules/screens/bloodDonation/BloodDonerFilters';
import MyChats from '../../modules/screens/chat/MyChats';
import AvailableDoctors4Chat from '../../modules/screens/chat/AvailableDoctor';
import SuccessChatPaymentPage from '../../modules/screens/chat/successMsg';
import ReportIssue from '../../modules/screens/ReportIssue';
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
  UserAddress: {
    screen: UserAddress,
  },
    MapBox: {
    screen: MapBox,
  },

}

const AuthStack = createStackNavigator(AuthRoutes, {
  initialRouteName: 'login',
  headerMode: "none",
  navigationOptions: { headerVisible: false }

})
const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
   
      headerLeft: (
        <Row>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{flexDirection:'row',marginTop:10}}>
          <Image
            style={{ marginLeft: 18, tintColor: '#fff' }}
            source={menuIcon}
          />
        </TouchableOpacity>
      
        <Row style={{marginBottom: 5,marginTop:5,marginLeft:5}}>
                   <Col size={10}>  
                   <TouchableOpacity onPress={()=> this.props.navigation.navigate('Locations')}>
                   <View style={{flexDirection:'row'}}>
                   <Icon name="ios-pin" style={{color:'#fff',fontSize:18,paddingLeft: 10,}}/>
                     <Text uppercase={false} style={{ marginLeft:5, color: '#fff', fontSize: 14, fontFamily: 'OpenSans-SemiBold',fontWeight:'bold' }}>Ambattur</Text>
                     <Icon name="ios-arrow-down" style={{color:'#fff',fontSize:18,paddingLeft: 10,marginTop:2}}/>
                     </View>
                     </TouchableOpacity>
                      <Text uppercase={false} style={{ paddingLeft: 10, color: '#fff', fontSize: 12, fontFamily: 'OpenSans-SemiBold',marginTop:2 }}>You are searching Near by Hostpitals</Text>
                    </Col> 
                   </Row>   

       
        </Row>
      ),

      headerRight: (
        <Grid>
          <Col>
            <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
              <View>
                <Icon name="notifications" style={{ color: '#fff', marginRight: 15, fontFamily: 'opensans-semibold' }}></Icon>
                <Badge/>
              </View>
            </TouchableOpacity>
          </Col>
        
        </Grid>
      ),
      headerStyle: {
        backgroundColor: '#775DA3',
        height:60
      },
    })
  },
  // ================Categories  ===============
  Locations: {
    screen: Locations,
    navigationOptions: ({ navigation }) => ({
      title: 'Locations',
    })
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
      title: 'Specialists',
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
  BloodDonerFilters: {
    screen: BloodDonerFilters,
    navigationOptions: ({ navigation }) => ({
      title: 'Filter',
    })
  },
  BloodDonersList: {
    screen: BloodDonersList,
    navigationOptions:({ navigation }) => ({
      title: 'Blood Donors',
     
      headerRight: (
        <Grid>

          <Col>
            <TouchableOpacity onPress={() => { navigation.navigate('BloodDonerFilters') }} >
              <View>
                <Icon name="ios-funnel" style={{ color: '#fff', marginRight: 15, fontFamily: 'opensans-semibold' }}></Icon>
                <Badge/>
              </View>
            </TouchableOpacity>
          </Col>
        
        </Grid>
      ),
    })
  },
  
  ///  =============Appointments Stack ==================
  "My Appointments": {
    screen: MyAppoinmentList,
    navigationOptions: {
      title: 'Appointments',
    }
  },
  "AppointmentInfo": {
    screen: AppointmentDetails,
    navigationOptions: {
      title: 'Appointment Info'
    }
  },
  ReportIssue: {
    screen: ReportIssue,
    navigationOptions: {
      title: 'Report issue'
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
  // ================Profile Stack =================
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
    }
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
  MapBox: {
    screen: MapBox,
    navigationOptions: {
      title: 'Search Location'
    }
  },
  
  // ========Appointment stack ==========
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: {
      title: 'Doctor List',
    }
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
  },
  // ============Chat ========================
  Chat: {
    screen: Chat,
    navigationOptions: {
      title: 'Online Chat'
    }
  },
  "Chat Service": {
    screen: AvailableDoctors4Chat,
    navigationOptions: {
      title: 'Availabile Doctors'
    }
  },
  "My Chats": {
    screen: MyChats,
    navigationOptions: ({ navigation }) => ({
      title: 'Chats',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon 
            style={
              Platform.OS === "ios"
                  ? { marginBottom: -4, width: 25, marginLeft: 9,color: "#FFF" }
                  : { marginBottom: -4, width: 25, marginLeft: 20, color: "#FFF" }
            }
            size={Platform.OS === "ios" ? 35 : 24}
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
          /> 
          {Platform.OS === "ios" ?   
             <Text style={{fontFamily:'OpenSans',fontSize:16, color:'#FFF', marginLeft: 5, fontWeight:'300' }}>Back</Text> : null } 
        </Row> 
        </TouchableOpacity>
      ),
     })
  },
  "SuccessChat": {
    screen: SuccessChatPaymentPage,
    navigationOptions: {
      title: 'Success'
    }
  },
  
  IndividualChat: {
    screen: IndividualChat,
    navigationOptions:({ navigation }) => ({
    headerLeft: (
    <Grid>
      <Col>
        <TouchableOpacity onPress={()=> navigation.pop()}>
          <Icon name="ios-arrow-back" style={{ color: '#fff',marginLeft:15, justifyContent: 'center' , fontSize:30}}/>
        </TouchableOpacity>
      </Col>
      <Col>
        <TouchableOpacity style={{marginLeft:15}}>
           <Thumbnail source={navigation.getParam('appBar', { profile_image: { uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }}).profile_image} style={{width:45,height:45,}}/>
       </TouchableOpacity>
      </Col>
      <Col style={{marginLeft:15}}>
        <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',color:'#fff'}}>{navigation.getParam('appBar', {title: ''}).title}</Text>
        <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#fff',}}>{navigation.getParam('appBar', {isOnline: ''}).isOnline}</Text>
      </Col>
    </Grid>
    ),
    /*headerRight: (
      <Grid>
        <Col>
          <TouchableOpacity  >
            <View style={{flexDirection:'row',}}>
              <Icon name="ios-attach" style={{ color: '#fff',marginRight: 20,transform: [{ rotate: '45deg'}]}}/>
              <Icon name="md-more" style={{ color: '#fff', marginRight: 15,  }}></Icon>
            </View>
          </TouchableOpacity>
        </Col>
      </Grid>
     ),*/
    })
  },

  // ============== Pharmacy =================
  Pharmacy: {
    screen: PharmacyHome,
    navigationOptions:{
      title: 'Medflic Pharmacy',
    }
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
  },
   //=================== Medicine Order Details =============
   Orders: {
    screen: MyOrdersList,
    navigationOptions: {
      title: 'Orders List',
    }
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
  },
  // ============== Reminder =================

  Reminder: {
    screen: Reminder,
    navigationOptions: ({ navigation }) => ({
      title: 'Reminder',
      headerRight: (
       
            <TouchableOpacity onPress={() => { navigation.navigate('AddReminder') }} style={{backgroundColor:'#ffffff',borderRadius:10,height:30,paddingLeft:10,paddingRight:10,marginRight:10,}}>
              <Row>
                <Icon name="ios-add-circle" style={{ color: '#7E49C3', fontFamily: 'opensans-semibold',fontSize:20,marginTop:3}}></Icon>
                <Text style={{fontFamily:'OpenSans',fontSize:14,marginLeft:5,fontWeight:'bold',marginTop:5}}>Add</Text>
              </Row>
            </TouchableOpacity>
            
          
      ),
    })
  },
  AddReminder: {
    screen: AddReminder,
    navigationOptions: {
      title: 'Add Reminder'
    }
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3' },
      headerTintColor: 'white',
    })
  })
   

  

  const DrawerNavigator = createDrawerNavigator({
    Home: {
      screen: HomeStack,
    },
    BloodDonersList: {
      screen: BloodDonersList,
    },
    "My Appointments":{
     screen: MyAppoinmentList
    },
    Pharmacy: {
     screen : PharmacyHome,
    },
    Orders: {
      screen: MyOrdersList
    },
    "Chat Service": {
      screen: AvailableDoctors4Chat
    },
    "My Chats": {
      screen : MyChats
    },
    Reminder: {
      screen: Reminder
    }
  },
  {
    contentComponent: props => <SideBar {...props} />
  },
    {
      initialRouteName: 'Home'
    })
  
  export const DragwerLogos = {
    Home: require('../../../assets/images/drawerIcons/Home.png'),
    Profile: require('../../../assets/images/drawerIcons/Profile.png'),
    "My Appointments": require('../../../assets/images/drawerIcons/MyAppointments.png'),
    Pharmacy: require('../../../assets/images/drawerIcons/Pharmacy.png'),
    Orders: require('../../../assets/images/drawerIcons/Orders.png'),
    Reminder:require('../../../assets/images/drawerIcons/Orders.png'),
    Chat:require('../../../assets/images/drawerIcons/Orders.png')

  }
  export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: DrawerNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none'
  
    }
  ));
  
/*
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
*/

/*
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

*/


/*
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

*/
/*
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
*/
/*
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
*/
/*
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
*/

// export const appStack = createStackNavigator(AppRoutes, {
//   initialRouteName: 'Home',
//   headerMode: 'none',
//   navigationOptions: { headerVisible: false }
// })
// const stack = createStackNavigator({ AppTabs, appStack }, { headerMode: "none" });
//export default createAppContainer(stack)
