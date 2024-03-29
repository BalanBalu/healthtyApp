import React, { Component } from 'react';
import { createAppContainer, createSwitchNavigator, NavigationBackAction } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from './AuthLoadingScreen';
import SideBar from './SideBar';
import Home from "../../modules/screens/Home";
import Profile from "../../modules/screens/userprofile";
import UpdateEmail from "../../modules/screens/userprofile/UpdateEmail";
import UpdateContact from "../../modules/screens/userprofile/UpdateContact";
import UpdatePassword from "../../modules/screens/userprofile/UpdatePassword";
import Updateheightweight from "../../modules/screens/userprofile/Updateheightweight";
import UpdateFamilyMembers from "../../modules/screens/userprofile/UpdateFamilyMembers";
import UpdateInsurance from "../../modules/screens/userprofile/UpdateInsurance";
import UpdateUserDetails from "../../modules/screens/userprofile/UpdateUserDetails";
import { Icon, View, Thumbnail, Item, Input, Left, Right } from 'native-base';
import IndividualChat from '../../modules/screens/chat/individualChat'
import Categories from "../../modules/screens/categories";
import login from "../../modules/screens/auth/login";
import loginWithOtp from "../../modules/screens/auth/loginWithOtp";

import signup from "../../modules/screens/auth/signup";
import forgotpassword from "../../modules/screens/auth/forgotpassword";
import renderOtpInput from "../../modules/screens/auth/renderOtpInput";
import RenderVerifyEmailOtp from "../../modules/screens/userprofile/verifyEmailOtp";
import userdetails from "../../modules/screens/auth/userdetails";
import UserAddress from "../../modules/screens/auth/UserAddress";
import MapBox from "../../modules/screens/auth/UserAddress/MapBox";
import Reviews from "../../modules/screens/Reviews";
import doctorSearchList from "../../modules/screens/doctorSearchList";
import doctorList from "../../modules/screens/DoctorBookAppointmentFlow/doctorList";
import doctorDetailsPreview from "../../modules/screens/DoctorBookAppointmentFlow/doctorDetailsPreview/doctorDetailsPreview";

import FilterList from "../../modules/screens/FilterList";
import PaymentPage from "../../modules/screens/PaymentPage";
import PaymentReview from "../../modules/screens/PaymentReview";
import PaymentSuccess from "../../modules/screens/PaymentSuccess";
import PromoCode from "../../modules/screens/PaymentPage/PromoCode"
import InsertReview from '../../modules/screens/Reviews/InsertReview';
import WishList from "../../modules/screens/wishList";
import Notification from "../../modules/screens/Notification";
import { Col, Grid, Row } from 'react-native-easy-grid';
import { logout } from '../../modules/providers/auth/auth.actions';
import termsAndConditions from '../../components/termsAndConditions'

import { TouchableOpacity, Image, Text, Platform, TouchableNativeFeedback, Picker } from 'react-native'

import menuIcon from '../../../assets/images/menu.png';
import BookAppoinment from "../../modules/screens/bookappoinment";
import Mapbox from "../../modules/screens/bookappoinment/Mapbox";
import AppointmentDetails from '../../modules/screens/MyAppointments/AppointmentDetails';
import MyAppoinmentList from '../../modules/screens/MyAppointments/MyAppointmentList';
import EmrDetails from '../../modules/screens/MyAppointments/EmrDetails'
import CancelAppointment from "../../modules/screens/MyAppointments/cancelAppointment";
import { Badge, onPopupEvent } from '../../../src/modules/common'
import Locations from '../../modules/screens/Home/Locations';
import LocationDetail from '../../modules/screens/Home/LocationDetail';
import Insurance from '../../modules/screens/Insurance/Insurance';
import InsuranceHistory from '../../modules/screens/Insurance/InsuranceHistory';
import MyChats from '../../modules/screens/chat/MyChats';
import AvailableDoctors4Chat from '../../modules/screens/chat/AvailableDoctor';
import SuccessChatPaymentPage from '../../modules/screens/chat/successMsg';
import ReportIssue from '../../modules/screens/ReportIssue';
import ReportDetails from '../../modules/screens/ReportIssue/reportIssueDetails'
import EarnReward from '../../modules/screens/Home/EarnReward';
import ImageView from '../../modules/shared/ImageView'
import VideoScreen from '../../modules/screens/VideoConsulation/components/VideoScreen';
import AvailableDoctors4Video from '../../modules/screens/VideoConsulation/components/AvailableDoctors';
import VideoConsultaions from '../../modules/screens/VideoConsulation/components/MyConsultations';
import CancelService from '../../modules/screens/commonScreen/cancelService'

import LabSearchList from '../../modules/screens/LabTest/labSearchList';
import LabCategory from '../../modules/screens/LabTest/categories'

import { primaryColor } from '../../setup/config';

import MedicineRecords from '../../modules/screens/medicalRecords/index';
import labConfirmation from '../../modules/screens/LabTest/labConfirmation/index'
import LabAppointmentList from '../../modules/screens/LabTest/Appointment/LabAppointmentList'
import LabAppointmentInfo from '../../modules/screens/LabTest/Appointment/LabAppoinmentInfo'
import LabCancelAppointment from '../../modules/screens/LabTest/Appointment/LabCancelAppointment'
import LabBookAppointment from '../../modules/screens/LabTest/labBookAppointment';
import PrepareAppointmentWizard from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard'
import BasicInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/BasicInfo'
import MedicalHistory from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/MedicalHistory'
import PhysicianInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/PhysicianInfo'
import PastMedicalConditions from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/PastMedicalConditions'
import PatientInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/PatientInfo'
import AllergiesAndMedications from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/AllergiesAndMedications'
import FamilyMedicalConditions from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/FamilyMedicalConditions'
import AllergicDisease from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/AllergicDisease'
import HospitalizationAndSurgeries from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/HospitalizationAndSurgeries'
import SocialHistory from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/SocialHistory'
import PrepareAppointmentLastStep from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/PrepareAppointmentLastStep'
import RenderSuggestionList from '../../modules/screens/Home/RenderSuggestionList';
import NextAppoinmentPreparation from '../../modules/screens/Home/nextAppoinmentPreparation'

import filterDocInfo from '../../modules/screens/DoctorBookAppointmentFlow/filterDocInfo';

import HomeHealthcareDoctorList from '../../modules/screens/HomeHealthCare/DoctorList/doctorList';
import HomeHealthcareFilterPage from '../../modules/screens/HomeHealthCare/filterHomeDocInfo';
import HomeHealthcareConfirmation from '../../modules/screens/HomeHealthCare/Confirmation/confirmation';
import HomeHealthcareAppointmentList from '../../modules/screens/HomeHealthCare/Appointments/appointmentList';
import HomeHealthcareAppointmentDetail from '../../modules/screens/HomeHealthCare/Appointments/appointmentDetails';
import HomeHealthcareCancelAppointment from '../../modules/screens/HomeHealthCare/Appointments/cancelAppointment';
import HomeHealthcareDoctorDetailsPreview from '../../modules/screens/HomeHealthCare/doctorDetailsPreview/doctorDetailsPreview';
import HomeHealthcareAddressList from '../../modules/screens/HomeHealthCare/homeDeliveryAddressPage';
import EmrInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/emrInfo'
import UploadEmr from '../../modules/screens/medicalRecords/uploadEmr'

import DropDownMenu from '../../modules/screens/chat/dropDownMenu';
import Ecard from '../../modules/screens/Ecard/Ecard'
import TextTicker from 'react-native-text-ticker';
import { IS_ANDROID, CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from '../config';
import ZoomImageViewer from '../../modules/elements/ImageViewer/ZoomImageViewer';
import HospitalList from '../../modules/screens/hospitalBookAppointmentFlow/hospitalList/hospitalList';
import CorporateHome from '../../modules/screens/Home/corporateHome'
import LanguagePopUp from './languagePopUp'
import { smartHealthStack } from './smartHealtStack'
import ContactUs from '../../modules/screens/contactUs'
import PolicyStatus from '../../modules/screens/policyStatus'
import SmartHealthLogin from '../../modules/screens/auth/corporateLogin'
import DoctorConsultation from '../../modules/screens/DoctorConsultation';

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
  renderOtpInput: {
    screen: renderOtpInput,
  },
  loginWithOtp:{
    screen:loginWithOtp
  },
  RenderVerifyEmailOtp: {
    screen: RenderVerifyEmailOtp,
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
  termsAndConditions: {
    screen: termsAndConditions,
  },
  SmartHealthLogin: {
    screen: SmartHealthLogin
  }


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
      title: 'Home',
      header: (

        <View
          style={{
            height: IS_ANDROID ? 60 : 90,
            backgroundColor: primaryColor,
            justifyContent: 'center',
          }}>
          <View
            style={{
              marginTop: IS_ANDROID ? 0 : 30,
              height: 60,
              justifyContent: 'center',
            }}>
            <Row size={12} style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
              <Col size={10} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ flexDirection: 'row', }}>
                  <Image
                    style={{ marginLeft: 18, tintColor: '#fff' }}
                    source={menuIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('Locations')}>
                  <Icon name="location-sharp" style={{ color: '#fff', fontSize: 18, paddingLeft: 10, }} />
                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: 15 }}>
                    <TextTicker style={{ marginLeft: 5, color: '#fff', fontSize: 14, fontFamily: 'opensans-bold', }} duration={10000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}>
                      {navigation.getParam('appBar', { locationName: ' ' }).locationName}
                    </TextTicker>
                    <TextTicker style={{ alignSelf: 'flex-start', color: '#fff', fontSize: 12, fontFamily: 'Roboto', marginTop: 2 }} duration={10000}
                      loop
                      bounce
                      repeatSpacer={200}
                      marqueeDelay={1000}>
                      {navigation.getParam('appBar', { locationCapta: 'Searching Near by Hospitals' }).locationCapta}

                    </TextTicker>


                  </View>
                </TouchableOpacity>
              </Col>

              <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
                  <View>
                    <Icon name="notifications" style={{ color: '#fff', marginRight: 5, fontFamily: 'Roboto', fontSize: 25 }}></Icon>
                    {navigation.getParam('notificationBadgeCount') ?
                      <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10, textAlign: 'center' }}>{navigation.getParam('notificationBadgeCount') >= 100 ? '99+' : navigation.getParam('notificationBadgeCount')}</Text> : null}
                  </View>
                </TouchableOpacity>
              </Col>
              <TouchableOpacity style={{ marginRight: 5, paddingLeft: 5, paddingRight: 5 }}>
                {/* <LanguagePopUp /> */}

              </TouchableOpacity>
            </Row>


          </View>
        </View>

      ),

      /*  headerLeft: (
  
          
          <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ flexDirection: 'row', }}>
              <Image
                style={{ marginLeft: 18, tintColor: '#fff' }}
                source={menuIcon}
              />
            </TouchableOpacity>
  
            <Row style={{ marginBottom: 5, marginTop: 5, marginLeft: 5 }}>
              <Col size={10}>
                <TouchableOpacity onPress={() => navigation.navigate('Locations')}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="location-sharp" style={{ color: '#fff', fontSize: 18, paddingLeft: 10, }} />
                   
                    <Text uppercase={false} style={{ marginLeft: 5, color: '#fff', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold' }}>{navigation.getParam('appBar', { locationName: ' ' }).locationName}</Text>
                    <Icon name="ios-arrow-down" style={{ color: '#fff', fontSize: 18, paddingLeft: 10, marginTop: 2 }} />
                  </View>
                </TouchableOpacity>
                <Text uppercase={false} style={{ paddingLeft: 10, color: '#fff', fontSize: 12, fontFamily: 'Roboto', marginTop: 2 }}>{navigation.getParam('appBar', { locationCapta: 'You are searching Near by Hospitals' }).locationCapta}</Text>
              </Col>
            </Row>
  
  
           </Row>
        ),
        headerRight: (
  
          <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
              <View>
                <Icon name="notifications" style={{ color: '#fff', marginRight: 5, fontFamily: 'Roboto' }}></Icon>
                {navigation.getParam('notificationBadgeCount') != null ?
                  <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10, textAlign: 'center' }}>{navigation.getParam('notificationBadgeCount') >= 100 ? '99+' : navigation.getParam('notificationBadgeCount')}</Text>
                  : null}
                
              </View>
  
             
            </TouchableOpacity>
            {Platform.OS != "ios" ?
              <TouchableOpacity style={{ marginRight: 5, paddingLeft: 5, paddingRight: 5 }}>
                <PopupMenu actions={['English', 'Tamil', 'Malayalam']} onPress={onPopupEvent} navigation={navigation} />
              </TouchableOpacity>
              :
              null
            }
  
  
          </Row>
  
  
  
        ), */
      headerStyle: {
        backgroundColor: primaryColor,
      },
    })
  },
  /* CorporateHome: {
    screen: CorporateHome,

    navigationOptions: ({ navigation }) => ({
      title: 'CorporateHome',
      header: (

        <View
          style={{
            height: IS_ANDROID ? 60 : 90,
            backgroundColor: primaryColor,
            justifyContent: 'center',
          }}>
          <View
            style={{
              marginTop: IS_ANDROID ? 0 : 30,
              height: 60,
              justifyContent: 'center',
            }}>
            <Row size={12} style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
              <Col size={10} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ flexDirection: 'row', }}>
                  <Image
                    style={{ marginLeft: 18, tintColor: '#fff' }}
                    source={menuIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('Locations')}>
                  <Icon name="location-sharp" style={{ color: '#fff', fontSize: 18, paddingLeft: 10, }} />
                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: 15 }}>
                    <TextTicker style={{ marginLeft: 5, color: '#fff', fontSize: 14, fontFamily: 'Roboto', fontWeight: 'bold' }} duration={10000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}>
                      {navigation.getParam('appBar', { locationName: ' ' }).locationName}
                    </TextTicker>
                    <TextTicker style={{ alignSelf: 'flex-start', color: '#fff', fontSize: 12, fontFamily: 'Roboto', marginTop: 2 }} duration={10000}
                      loop
                      bounce
                      repeatSpacer={200}
                      marqueeDelay={1000}>
                      {navigation.getParam('appBar', { locationCapta: 'Searching Near by Hospitals' }).locationCapta}

                    </TextTicker>


                  </View>
                </TouchableOpacity>
              </Col>

              <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
                  <View>
                    <Icon name="notifications" style={{ color: '#fff', marginRight: 5, fontFamily: 'Roboto',fontSize:25 }}></Icon>
                    {navigation.getParam('notificationBadgeCount') ?
                      <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10, textAlign: 'center' }}>{navigation.getParam('notificationBadgeCount') >= 100 ? '99+' : navigation.getParam('notificationBadgeCount')}</Text> : null}
                  </View>
                </TouchableOpacity>
              </Col>
              <TouchableOpacity style={{ marginRight: 5, paddingLeft: 5, paddingRight: 5 }}>
                <LanguagePopUp />

              </TouchableOpacity>
            </Row>


          </View>
        </View>

      ),


      headerStyle: {
        backgroundColor: primaryColor,
      },
    })
   },*/
  EarnReward: {
    screen: EarnReward,
    navigationOptions: {
      title: 'Refer and Earn'
    }
  },
  NextAppoinmentPreparation: {
    screen: NextAppoinmentPreparation,
    navigationOptions: {
      title: 'Next Appoinment Preparation'
    }
  },
  // ================Categories  ===============
  Locations: {
    screen: Locations,
    navigationOptions: ({ navigation }) => ({
      title: 'Locations',
    })
  },
  LocationDetail: {
    screen: LocationDetail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('cityData') ? navigation.getParam('cityData').city_name : 'Areas',
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
      title: "Appointment info"
    }
  },

  "EmrDetails": {
    screen: EmrDetails,
    navigationOptions: {
      title: "EMR Details"
    }
  },
  ReportIssue: {
    screen: ReportIssue,
    navigationOptions: {
      title: 'Report issue'
    }
  },
  ReportDetails: {
    screen: ReportDetails,
    navigationOptions: {
      title: 'Report details'
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
  PrepareAppointmentWizard: {
    screen: PrepareAppointmentWizard,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  BasicInfo: {
    screen: BasicInfo,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  MedicalHistory: {
    screen: MedicalHistory,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  PhysicianInfo: {
    screen: PhysicianInfo,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  PastMedicalConditions: {
    screen: PastMedicalConditions,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  PatientInfo: {
    screen: PatientInfo,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  AllergiesAndMedications: {
    screen: AllergiesAndMedications,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  FamilyMedicalConditions: {
    screen: FamilyMedicalConditions,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  AllergicDisease: {
    screen: AllergicDisease,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  HospitalizationAndSurgeries: {
    screen: HospitalizationAndSurgeries,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  SocialHistory: {
    screen: SocialHistory,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },
  PrepareAppointmentLastStep: {
    screen: PrepareAppointmentLastStep,
    navigationOptions: {
      title: 'Prepare for the appointment'
    }
  },

  CancelService: {
    screen: CancelService,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("tittle"),
    }),
  },
  ///  =============Contact Us ==================
  ContactUs: {
    screen: ContactUs,
    navigationOptions: {
      title: 'ContactUs',
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

  Updateheightweight: {
    screen: Updateheightweight,
    navigationOptions: {
      title: 'Update height and weight'
    }
  },
  UpdateFamilyMembers: {
    screen: UpdateFamilyMembers,
    navigationOptions: {
      title: 'Update family details'
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
  UserAddress: {
    screen: UserAddress,
    navigationOptions: {
      title: 'Search Location'
    }
  },
  MapBox: {
    screen: MapBox,
    navigationOptions: {
      title: 'Search Location'
    }
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: {
      headerLeft: null,
      title: 'Success'
    }
  },

  //================ Lab Test ===============
  LabAppointmentInfo: {
    screen: LabAppointmentInfo,
    navigationOptions: {
      title: 'Lab Test Appointment Details'
    }
  },
  'My Lab Test Appointments': {
    screen: LabAppointmentList,
    navigationOptions: {
      title: 'My Lab Test Appointments'
    }
  },
  LabCancelAppointment: {
    screen: LabCancelAppointment,
    navigationOptions: {
      title: 'Lab Test Cancel Appointment'
    }
  },

  //================  Ecard  ===============
  "E Card": {
    screen: Ecard,
    navigationOptions: {
      title: 'Ecard Details'
    }
  },
  PolicyStatus: {
    screen: PolicyStatus,
    navigationOptions: {
      title: 'Claim Status'
    }
  },

  //================  Appoinment Booking Through Hospitals ===============
  HospitalList: {
    screen: HospitalList,
    navigationOptions: {
      title: 'Hospital List'
    }
  },
  // ========Appointment stack ==========
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: {
      title: 'Doctor List',
    }
  },
  "Doctor Search List": {
    screen: doctorList,
    navigationOptions: {
      title: 'Doctor List',
    }
  },
  "Doctor Details Preview": {
    screen: doctorDetailsPreview,
    navigationOptions: {
      title: 'Book Appointment'
    }
  },

  "Filter Doctor Info": {
    screen: filterDocInfo,
    navigationOptions: {
      title: 'Filter Page'
    }
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

  PromoCode: {
    screen: PromoCode,
    navigationOptions: {
      title: 'Promo  codes'
    }
  },

  labConfirmation: {
    screen: labConfirmation,
    navigationOptions: {
      title: 'Lab Confirmation'
    }
  },

  // ============Zoom image ========================
  ImageView: {
    screen: ImageView,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("title"),
    }),
  },
  ZoomImageViewer: {
    screen: ZoomImageViewer,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("title") || 'Image',
    })
  },


  // ============Home Test ========================
  "Home Health Care": {
    screen: HomeHealthcareDoctorList,
    navigationOptions: {
      title: 'HomeHealthcare DoctorList'
    }
  },
  HomeHealthcareFilterPage: {
    screen: HomeHealthcareFilterPage,
    navigationOptions: {
      title: ' Home Filter Page'
    }
  },

  HomeHealthcareConfirmation: {
    screen: HomeHealthcareConfirmation,
    navigationOptions: {
      title: 'Home Healthcare Confirmation'
    }
  },
  'My Home Healthcare Appointments': {
    screen: HomeHealthcareAppointmentList,
    navigationOptions: {
      title: 'My Home Healthcare Appointments'
    }
  },
  HomeHealthcareAppointmentDetail: {
    screen: HomeHealthcareAppointmentDetail,
    navigationOptions: {
      title: 'Home Healthcare Appointment info'
    }
  },
  "Home Healthcare Cancel Appointment": {
    screen: HomeHealthcareCancelAppointment,
    navigationOptions: {
      title: 'Home Healthcare Cancel Appointment'
    }
  },
  "Home Healthcare Doctor Details Preview": {
    screen: HomeHealthcareDoctorDetailsPreview,
    navigationOptions: {
      title: 'Home Healthcare Doctor Details Preview'
    }
  },
  "Home Healthcare Address List": {
    screen: HomeHealthcareAddressList,
    navigationOptions: {
      title: 'Home Healthcare Address List'
    }
  },


  // ============Chat ========================
  "Chat Service": {
    screen: AvailableDoctors4Chat,
    navigationOptions: {
      title: 'Available Doctors'
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
                  ? { marginBottom: -4, width: 25, marginLeft: 9, color: "#FFF" }
                  : { marginBottom: -4, width: 25, marginLeft: 20, color: "#FFF" }
              }
              size={Platform.OS === "ios" ? 35 : 24}
              name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            />
            {Platform.OS === "ios" ?
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#FFF', marginLeft: 5, }}>Back</Text> : null}
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
    navigationOptions: ({ navigation }) => ({
      headerTitle: null,
      headerLeft: (
        <Grid style={{ justifyContent: 'center' }}>
          <Col style={{ justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Icon name="ios-arrow-back" style={{ color: '#fff', marginLeft: 15, justifyContent: 'center', fontSize: 30 }} />
            </TouchableOpacity>
          </Col>
          <Col style={{ justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Thumbnail source={navigation.getParam('appBar', { profile_image: { uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' } }).profile_image} style={{ width: 45, height: 45, }} />
            </TouchableOpacity>
          </Col>
          <Col style={{ marginLeft: 15, justifyContent: 'center', }}>
            <Text style={{ fontFamily: 'Roboto', fontSize: 16, fontFamily: 'opensans-bold', color: '#fff' }}>{navigation.getParam('appBar', { title: '' }).title}</Text>
            {/* <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: '#fff', }}>{navigation.getParam('appBar', { isOnline: '' }).isOnline}</Text> */}
          </Col>

        </Grid>
      ),
      headerRight: (
        <Grid style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Col style={{ justifyContent: 'flex-end' }}>
            <DropDownMenu />
          </Col>
        </Grid>
      )
    })
  },
  /* Video Consultation */
  VideoScreen: {
    screen: VideoScreen,
    navigationOptions: {
      title: 'Video Calling',
      headerLeft: null,
      gesturesEnabled: false
    }
  },
  'Video and Chat Service': {
    screen: AvailableDoctors4Video,
    navigationOptions: {
      title: 'Tele consult services '
    }
  },
  'My Video Consultations': {
    screen: VideoConsultaions,
    navigationOptions: {
      title: 'My Video Consultations'
    }
  },
  /**** Get Suggestion list from Search Bar ****/
  RenderSuggestionList: {
    screen: RenderSuggestionList,
    navigationOptions: ({ navigation }) => ({
      title: 'Find & Book',

    })
  },
  /* ========>  Lab Test  <========== */
  'Lab Test': {
    screen: LabCategory,
    navigationOptions: {
      title: 'Lab Category'
    }
  },
  LabSearchList: {
    screen: LabSearchList,
    navigationOptions: {
      title: 'Lab List'
    }
  },
  LabBookAppointment: {
    screen: LabBookAppointment,
    navigationOptions: {
      title: 'Lab BookAppointment'
    }
  },
  Insurance: {
    screen: Insurance,
    navigationOptions: {
      title: 'Insurance'
    }
  },
  InsuranceHistory: {
    screen: InsuranceHistory,
    navigationOptions: {
      title: 'Insurance History'
    }
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#7E49C3' },
      headerTintColor: 'white',
    })
  })


const drawerNavigatorRoutes = {
  Home: {
    screen: CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? smartHealthStack : HomeStack,
    routeName: CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? 'CorporateHome' : 'Home'
  },
  'Video and Chat Service': {
    screen: AvailableDoctors4Video,
    routeName: 'Video and Chat Service'
  },

  "My Appointments": {
    screen: MyAppoinmentList,
    routeName: 'My Appointments'
  },
  "My Chats": {
    screen: MyChats,
    routeName: 'My Chats',
  },
  "MedicineRecords": {
    screen: MedicineRecords,
    routeName: 'MedicineRecords',
  },
  PolicyStatus: {
    screen: PolicyStatus,
    routeName: 'PolicyStatus'
  },
  'My Video Consultations': {
    screen: VideoConsultaions,
    routeName: 'My Video Consultations'
  },
  'My Lab Test Appointments': {
    screen: LabAppointmentList,
    routeName: 'My Lab Test Appointments'
  },
  'My Home Healthcare Appointments': {
    screen: HomeHealthcareAppointmentList,
    routeName: 'My Home Healthcare Appointments'
  },
  "Insurance": {
    screen: Insurance,
    routeName: 'Insurance'
  },
  "InsuranceHistory": {
    screen: InsuranceHistory,
    routeName: 'InsuranceHistory'
  },

  "E Card": {
    screen: Ecard,
    routeName: 'E Card'
  },
  "Home Health Care": {
    screen: HomeHealthcareDoctorList,
    routeName: "Home Health Care"
  },

  "ContactUs": {
    screen: ContactUs,
    routeName: "ContactUs"
  },
  "Categories": {
    screen: Categories,
    routeName: "Categories"
  },
  "DoctorConsultation": {
    screen: DoctorConsultation,
    routeName: "DoctorConsultation"
  },
  'Lab Test': {
    screen: LabCategory,
    routeName: "Lab Test"
  },
  "Home Healthcare Address List": {
    screen: HomeHealthcareAddressList,
    routeName: "Home Healthcare Address List"
  },


}
export const corporateUserSideBarMenuList = [
  {
    menuName: 'Insurance Services',
    menuForCorporateUser: true,
    subMenus: [
      {
        name: 'Home',
        routeName: drawerNavigatorRoutes.Home.routeName,
        icon: require('../../../assets/images/drawerIcons/Home.png'),
        largeIcon: { height: 20, width: 20, marginRight: 16 },
        appoinmentSubMenus: []
      },
      {
        name: 'E Card',
        routeName: drawerNavigatorRoutes['E Card'].routeName,
        icon: require('../../../assets/images/drawerIcons/EcardDesign.png'),
        largeIcon: { height: 15, width: 28, marginRight: 10, marginTop: 5 },
        appoinmentSubMenus: []
      },
      {
        name: 'Insurance',
        routeName: [],
        icon: require('../../../assets/images/drawerIcons/Insurance.png'),
        largeIcon: { height: 20, width: 20, },
        appoinmentSubMenus: [
          {
            name: 'My Insurance Policies',
            routeName: drawerNavigatorRoutes['Insurance'].routeName,
            icon: require('../../../assets/images/drawerIcons/Insurance.png'),
            largeIcon: { height: 20, width: 20 },
          },
          {
            name: 'Insurance History',
            routeName: drawerNavigatorRoutes['InsuranceHistory'].routeName,
            icon: require('../../../assets/images/drawerIcons/Insurance.png'),
            largeIcon: { height: 20, width: 20 },
          }]
      },

      {
        name: 'Claim Status',
        routeName: drawerNavigatorRoutes['PolicyStatus'].routeName,
        icon: require('../../../assets/images/drawerIcons/Appointments.png'),
        largeIcon: { height: 20, width: 20, marginRight: 16 },
        appoinmentSubMenus: []
      },
      {
        name: 'Consultation',
        routeName: [],
        icon: require('../../../assets/images/drawerIcons/Appointments.png'),
        largeIcon: { height: 20, width: 20, },
        appoinmentSubMenus: [
          {
            name: 'Doctor Consultation',
            routeName: drawerNavigatorRoutes["Categories"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },
          {
            name: 'Home Consultation',
            routeName: drawerNavigatorRoutes["Home Healthcare Address List"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },


          {
            name: 'Lab Consultation',
            routeName: drawerNavigatorRoutes["Lab Test"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },
          {
            name: 'Tele Consultation',
            routeName: drawerNavigatorRoutes["Categories"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
            largeIcon: { height: 20, width: 20, }
          },
        ]
      },
      {
        name: 'Health Records',
        routeName: drawerNavigatorRoutes["MedicineRecords"].routeName,
        icon: require('../../../assets/images/drawerIcons/Appointments.png'),
        largeIcon: { height: 20, width: 20, marginRight: 16 },
        appoinmentSubMenus: []
      },

      {
        name: 'Contact Us',
        routeName: drawerNavigatorRoutes["ContactUs"].routeName,
        icon: require('../../../assets/images/drawerIcons/ContactUsIcon.png'),
        largeIcon: 'Contact Us',
        largeIcon: { height: 14, width: 20, marginRight: 16, marginTop: 5 },
        appoinmentSubMenus: []
      },]
  },
  {
    menuName: 'Insurance Services',
    menuForCorporateUser: true,
    subMenus: [
    ]
  },
]

export const userSideBarMenuList = [

  {
    menuName: 'Insurance Services',
    menuForUser: true,
    subMenus: [
      {
        name: 'Home',
        routeName: drawerNavigatorRoutes.Home.routeName,
        icon: require('../../../assets/images/drawerIcons/Home.png'),
        largeIcon: { height: 20, width: 20, marginRight: 16 },
        appoinmentSubMenus: []
      },
      {
        name: 'Consultation',
        routeName: [],
        icon: require('../../../assets/images/drawerIcons/Appointments.png'),
        largeIcon: { height: 20, width: 20, },
        appoinmentSubMenus: [
          {
            name: 'Doctor Consultation',
            routeName: drawerNavigatorRoutes["Categories"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },
          {
            name: 'Home Consultation',
            routeName: drawerNavigatorRoutes["Home Healthcare Address List"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },


          {
            name: 'Lab Consultation',
            routeName: drawerNavigatorRoutes["Lab Test"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
            largeIcon: { height: 20, width: 20, }
          },
          {
            name: 'Tele Consultation',
            routeName: drawerNavigatorRoutes["Video and Chat Service"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
            largeIcon: { height: 20, width: 20, }
          },
        ]
      },
      {
        name: 'Health Records',
        routeName: drawerNavigatorRoutes["MedicineRecords"].routeName,
        icon: require('../../../assets/images/drawerIcons/Appointments.png'),
        largeIcon: { height: 20, width: 20, marginRight: 16 },
        appoinmentSubMenus: []
      },

      {
        name: 'Contact Us',
        routeName: drawerNavigatorRoutes["ContactUs"].routeName,
        icon: require('../../../assets/images/drawerIcons/ContactUsIcon.png'),
        largeIcon: 'Contact Us',
        largeIcon: { height: 14, width: 20, marginRight: 16,marginTop: 5 },
        appoinmentSubMenus: []
      },]
  },
]

const DrawerNavigator = createDrawerNavigator(drawerNavigatorRoutes, {
  overlayColor: 'rgba(0, 0, 0, 0.7)',
  contentComponent: props => <SideBar
    menuSubMenus={[
      {
        menuName: 'Home',
        routeName: drawerNavigatorRoutes.Home.routeName,
        icon: require('../../../assets/images/drawerIcons/Home.png'),
        subMenus: []
      },
      {
        menuName: 'Insurance Services',
        menuForCorporateUser: true,
        subMenus: [
          {
            name: 'E Card',
            routeName: drawerNavigatorRoutes['E Card'].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),

          },
          {
            name: 'Insurance',
            routeName: drawerNavigatorRoutes['Insurance'].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          }]
      },
      {
        menuName: 'Services',
        subMenus: [
          {
            name: 'Home Health Care',
            routeName: 'Home Healthcare Address List', // drawerNavigatorRoutes["Home Health Care"].routeName,
            icon: require('../../../assets/images/drawerIcons/homeTest.png'),
            params: {
              fromNavigation: "HOME_HEALTH_CARE"
            }

          },
          {
            name: 'Video and Chat',
            routeName: drawerNavigatorRoutes["Video and Chat Service"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),

          }

        ]
      },
      {
        menuName: 'Orders and Consultations',
        subMenus: [
          {
            name: 'My Appointments',
            routeName: drawerNavigatorRoutes["My Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'My Home Healthcare Appointments',
            routeName: drawerNavigatorRoutes["My Home Healthcare Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'My Chat Consultations',
            routeName: drawerNavigatorRoutes["My Chats"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
          },
          {
            name: 'My Video Consultations',
            routeName: drawerNavigatorRoutes["My Video Consultations"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
          },
          {
            name: 'My Lab Test Appointments',
            routeName: drawerNavigatorRoutes["My Lab Test Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'Contact Us',
            routeName: drawerNavigatorRoutes["ContactUs"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
        ]
      }
    ]}
    {...props} />
},
  {
    initialRouteName: CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ? 'CorporateHome' : 'Home'
  })

export const DragwerLogos = {
  Home: require('../../../assets/images/drawerIcons/Home.png'),
  Profile: require('../../../assets/images/drawerIcons/Profile.png'),
  "My Appointments": require('../../../assets/images/drawerIcons/Appointments.png'),
  "My Chats": require('../../../assets/images/drawerIcons/Chat.png'),
  'My Video Consultations': require('../../../assets/images/drawerIcons/Appointments.png'),
  'Video and Chat Service': require('../../../assets/images/drawerIcons/Appointments.png'),
  'My Lab Test Appointments': require('../../../assets/images/drawerIcons/Appointments.png'),
  'My Home Healthcare Appointments': require('../../../assets/images/drawerIcons/Appointments.png'),
}
const SmDrawerNavigator = createDrawerNavigator(drawerNavigatorRoutes, {
  overlayColor: 'rgba(0, 0, 0, 0.7)',
  contentComponent: props => <SideBar
    menuSubMenus={[

      {
        menuName: 'Insurance Services',
        menuForCorporateUser: true,
        subMenus: [
          {
            name: 'E Card',
            routeName: drawerNavigatorRoutes['E Card'].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'Insurance',
            routeName: drawerNavigatorRoutes['Insurance'].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          }]
      },
      {
        menuName: 'Services',
        subMenus: [
          {
            name: 'Home Health Care',
            routeName: 'Home Healthcare Address List',
            icon: require('../../../assets/images/drawerIcons/homeTest.png'),
            params: {
              fromNavigation: "HOME_HEALTH_CARE"
            }

          },
          {
            name: 'Consultation',
            routeName: 'Categories',
            icon: require('../../../assets/images/drawerIcons/homeTest.png'),
          },
          {
            name: 'Lab Test',
            routeName: 'Lab Test',
            icon: require('../../../assets/images/drawerIcons/homeTest.png'),
          },
          {
            name: 'Network Hospital',
            routeName: 'TpaList',
            icon: require('../../../assets/images/drawerIcons/homeTest.png'),
          },
          {
            name: 'Video and Chat',
            routeName: drawerNavigatorRoutes["Video and Chat Service"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),

          },

        ]
      },
      {
        menuName: 'Orders and Consultations',
        subMenus: [
          {
            name: 'My Appointments',
            routeName: drawerNavigatorRoutes["My Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'My Home Healthcare Appointments',
            routeName: drawerNavigatorRoutes["My Home Healthcare Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'My Chat Consultations',
            routeName: drawerNavigatorRoutes["My Chats"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
          },
          {
            name: 'My Video Consultations',
            routeName: drawerNavigatorRoutes["My Video Consultations"].routeName,
            icon: require('../../../assets/images/drawerIcons/Chat.png'),
          },
          {
            name: 'My Lab Test Appointments',
            routeName: drawerNavigatorRoutes["My Lab Test Appointments"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
          {
            name: 'Contact Us',
            routeName: drawerNavigatorRoutes["ContactUs"].routeName,
            icon: require('../../../assets/images/drawerIcons/Appointments.png'),
          },
        ]
      }
    ]}
    {...props} />
},
  {
    initialRouteName: 'CorporateHome'
  })

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DrawerNavigator,
    SmApp: SmDrawerNavigator,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none'
  }
));