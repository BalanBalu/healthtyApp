
import React, { Component } from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import Profile from "../../modules/screens/userprofile";
import UpdateEmail from "../../modules/screens/userprofile/UpdateEmail";
import UpdateContact from "../../modules/screens/userprofile/UpdateContact";
import {primaryColor} from '../../setup/config'

import UpdatePassword from "../../modules/screens/userprofile/UpdatePassword";
import Updateheightweight from "../../modules/screens/userprofile/Updateheightweight";
import UpdateFamilyMembers from "../../modules/screens/userprofile/UpdateFamilyMembers";
import UpdateInsurance from "../../modules/screens/userprofile/UpdateInsurance";
import UpdateUserDetails from "../../modules/screens/userprofile/UpdateUserDetails";
import { Icon, View, Thumbnail, Item, Input, Left, Right } from 'native-base';
import IndividualChat from '../../modules/screens/chat/individualChat'
import Categories from "../../modules/screens/categories";

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


import { TouchableOpacity, Image, Text, Platform, TouchableNativeFeedback, Picker } from 'react-native'

import menuIcon from '../../../assets/images/menu.png';
import BookAppoinment from "../../modules/screens/bookappoinment";
import Mapbox from "../../modules/screens/bookappoinment/Mapbox";
import AppointmentDetails from '../../modules/screens/MyAppointments/AppointmentDetails';
import MyAppoinmentList from '../../modules/screens/MyAppointments/MyAppointmentList';
import EmrDetails from '../../modules/screens/MyAppointments/EmrDetails'
import CancelAppointment from "../../modules/screens/MyAppointments/cancelAppointment";


import Locations from '../../modules/screens/Home/Locations';
import LocationDetail from '../../modules/screens/Home/LocationDetail';
import Insurance from '../../modules/screens/Insurance/Insurance';
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
import MedicineRecords from '../../modules/screens/medicalRecords';
import EmrInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/emrInfo'
import UploadEmr from '../../modules/screens/medicalRecords/uploadEmr'

// import PublicForumDetail from '../../modules/screens/publicForum/publicForumDetail'
import DropDownMenu from '../../modules/screens/chat/dropDownMenu';
import Ecard from '../../modules/screens/Ecard/Ecard'
import TextTicker from 'react-native-text-ticker';
import { IS_ANDROID } from '../config';
import ZoomImageViewer from '../../modules/elements/ImageViewer/ZoomImageViewer';
import HospitalList from '../../modules/screens/hospitalBookAppointmentFlow/hospitalList/hospitalList';
import CorporateHome from '../../modules/screens/Home/corporateHome'
import LanguagePopUp from './languagePopUp'
import PolicyCoverage from '../../modules/screens/PolicyCoverage'
import PolicyStatus from '../../modules/screens/policyStatus'
import TpaList from '../../modules/screens/NetworkHospitalsFlow/tpaList';
import NetworkHospitals from '../../modules/screens/NetworkHospitalsFlow/NetworkHospitalList/networkHospitals';
import ClaimIntimationSubmission from '../../modules/screens/ClaimIntimation/claimIntimationSubmission/claimIntimationSubmission';
import FamilyInfoList from '../../modules/screens/ClaimIntimation/familyInfoList';
import ClaimIntimationSuccess from '../../modules/screens/ClaimIntimation/claimIntimationSubmission/claimIntimationSuccess';
import ClaimIntimationList from '../../modules/screens/ClaimIntimation/claimintimationList'
import DocumentList from '../../modules/screens/ClaimIntimation/documentList'
import ContactUs from '../../modules/screens/contactUs'
import AddInsurance from '../../modules/screens/Insurance/addInsurance'
import BuyInsurance from '../../modules/screens/Insurance/buyInsurance'

import PreAuthSubmission from '../../modules/screens/PreAuth/PreAuthSubmission/preAuthSubmission';
import PreAuthList from '../../modules/screens/PreAuth/PreAuthList/preAuthList';

export const smartHealthStack=createStackNavigator({
  CorporateHome: {
    screen: CorporateHome,

    navigationOptions: ({ navigation }) => ({
      title: 'CorporateHome',
      headerTitleStyle: { fontFamily: "Roboto",},

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
                  <Icon name="location-sharp" style={{ color: '#fff', fontSize: 25, paddingLeft: 10, }} />
                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: 15 }}>
                    <TextTicker style={{ marginLeft: 5, color: '#fff', fontSize: 14, fontFamily: 'opensans-bold',  }} duration={10000}
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

              <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end', marginLeft: 10 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
                  <View>
                    <Icon name="notifications" style={{ color: '#fff', marginRight: 5, fontFamily: 'Roboto',fontSize:25 }}></Icon>
                    {navigation.getParam('notificationBadgeCount') ?
                      <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10, textAlign: 'center',fontFamily: 'Roboto', }}>{navigation.getParam('notificationBadgeCount') >= 100 ? '99+' : navigation.getParam('notificationBadgeCount')}</Text> : null}
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
  },
  EarnReward: {
    screen: EarnReward,
    navigationOptions: {
      title: 'Refer and Earn',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  NextAppoinmentPreparation: {
    screen: NextAppoinmentPreparation,
    navigationOptions: {
      title: 'Next Appoinment Preparation',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  // ================Categories  ===============
  Locations: {
    screen: Locations,
    navigationOptions: ({ navigation }) => ({
      title: 'Locations',
      headerTitleStyle: { fontFamily: "Roboto",}

    })
  },
  LocationDetail: {
    screen: LocationDetail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('cityData') ? navigation.getParam('cityData').city_name : 'Areas',
      headerTitleStyle: { fontFamily: "Roboto",}

    })
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
      title: 'Specialists',
      headerTitleStyle: { fontFamily: "Roboto",}

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
      headerTitleStyle: { fontFamily: "Roboto",}
    })
  },

 
  ///  =============Appointments Stack ==================
  "My Appointments": {
    screen: MyAppoinmentList,
    navigationOptions: {
      title: 'Appointments',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "AppointmentInfo": {
    screen: AppointmentDetails,
    navigationOptions: {
      title: "Appointment info",
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  "EmrDetails": {
    screen: EmrDetails,
    navigationOptions: {
      title: "EMR Details",
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  ReportIssue: {
    screen: ReportIssue,
    navigationOptions: {
      title: 'Report issue',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  ReportDetails: {
    screen: ReportDetails,
    navigationOptions: {
      title: 'Report details',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PreAuthSubmission: {
    screen: PreAuthSubmission,
    navigationOptions: {
      title: 'Pre Authorization',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "CancelAppointment": {
    screen: CancelAppointment,
    navigationOptions: {
      title: 'Cancel Appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "InsertReview": {
    screen: InsertReview,
    navigationOptions: {
      title: 'Rate and Review',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PrepareAppointmentWizard: {
    screen: PrepareAppointmentWizard,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  BasicInfo: {
    screen: BasicInfo,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  MedicalHistory: {
    screen: MedicalHistory,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PhysicianInfo: {
    screen: PhysicianInfo,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PastMedicalConditions: {
    screen: PastMedicalConditions,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PatientInfo: {
    screen: PatientInfo,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  AllergiesAndMedications: {
    screen: AllergiesAndMedications,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  FamilyMedicalConditions: {
    screen: FamilyMedicalConditions,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  AllergicDisease: {
    screen: AllergicDisease,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  HospitalizationAndSurgeries: {
    screen: HospitalizationAndSurgeries,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  SocialHistory: {
    screen: SocialHistory,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PrepareAppointmentLastStep: {
    screen: PrepareAppointmentLastStep,
    navigationOptions: {
      title: 'Prepare for the appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  CancelService: {
    screen: CancelService,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("tittle"),
      headerTitleStyle: { fontFamily: "Roboto",}

    }),
  },
  // ================Profile Stack =================
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UpdateEmail: {
    screen: UpdateEmail,
    navigationOptions: {
      title: 'Update Email',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UpdateContact: {
    screen: UpdateContact,
    navigationOptions: {
      title: 'Update Contact',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {
      title: 'Update Password',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  Updateheightweight: {
    screen: Updateheightweight,
    navigationOptions: {
      title: 'Update height and weight',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UpdateFamilyMembers: {
    screen: UpdateFamilyMembers,
    navigationOptions: {
      title: 'Update family details',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  UpdateInsurance: {
    screen: UpdateInsurance,
    navigationOptions: {
      title: 'Update Insurance',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UpdateUserDetails: {
    screen: UpdateUserDetails,
    navigationOptions: {
      title: 'Update User Details',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  UserAddress: {
    screen: UserAddress,
    navigationOptions: {
      title: 'Search Location',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  MapBox: {
    screen: MapBox,
    navigationOptions: {
      title: 'Search Location',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: {
      headerLeft: null,
      title: 'Success',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  //================ Lab Test ===============
  LabAppointmentInfo: {
    screen: LabAppointmentInfo,
    navigationOptions: {
      title: 'Lab Test Appointment Details',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  'My Lab Test Appointments': {
    screen: LabAppointmentList,
    navigationOptions: {
      title: 'My Lab Test Appointments',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  LabCancelAppointment: {
    screen: LabCancelAppointment,
    navigationOptions: {
      title: 'Lab Test Cancel Appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
 
  //================  Ecard  ===============
  "E Card": {
    screen: Ecard,
    navigationOptions: {
      title: 'Ecard Details',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  //================  MedicineRecords ===============

  EmrInfo: {
    screen: EmrInfo,
    navigationOptions: {
      title: 'EmrInfo',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  UploadEmr: {
    screen: UploadEmr,
    navigationOptions: {
      title: 'Upload Emr',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Health Records": {
    screen: MedicineRecords,
    navigationOptions: {
      title: 'Health Records',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
   ///  =============Contact Us ==================
   ContactUs: {
    screen: ContactUs,
    navigationOptions: {
      title: 'ContactUs',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  //================  Appoinment Booking Through Hospitals ===============
  HospitalList: {
    screen: HospitalList,
    navigationOptions: {
      title: 'Hospital List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  TpaList: {
    screen: TpaList,
    navigationOptions: {
      title: 'Tpa List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  NetworkHospitals: {
    screen: NetworkHospitals,
    navigationOptions: {
      title: 'Network Hospitals',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  ClaimIntimationSubmission: {
    screen: ClaimIntimationSubmission,
    navigationOptions: {
      title: 'Claim Intimation',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  FamilyInfoList: {
    screen: FamilyInfoList,
    navigationOptions: {
      title: 'Family List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  ClaimIntimationSuccess: {
    screen: ClaimIntimationSuccess,
    navigationOptions: {
      title: 'Success page',
      headerTitleStyle: { fontFamily: "Roboto"},
      headerLeft: null
    }
  },
  ClaimIntimationList: {
    screen: ClaimIntimationList,
    navigationOptions: {
      title: 'ClaimIntimation List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  DocumentList: {
    screen: DocumentList,
    navigationOptions: {
      title: 'Document List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  // ========Appointment stack ==========
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: {
      title: 'Doctor List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Doctor Search List": {
    screen: doctorList,
    navigationOptions: {
      title: 'Doctor List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Doctor Details Preview": {
    screen: doctorDetailsPreview,
    navigationOptions: {
      title: 'Book Appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  "Filter Doctor Info": {
    screen: filterDocInfo,
    navigationOptions: {
      title: 'Filter Page',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  Filters: {
    screen: FilterList,
    navigationOptions: {
      title: 'Filters',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Book Appointment": {
    screen: BookAppoinment,
    navigationOptions: {
      title: 'Book Appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Mapbox": {
    screen: Mapbox,
    navigationOptions: {
      title: 'Mapbox',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  Reviews: {
    screen: Reviews,
    navigationOptions: {
      title: 'Reviews',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  "Payment Review": {
    screen: PaymentReview,
    navigationOptions: {
      title: 'Payment Review',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  paymentPage: {
    screen: PaymentPage,
    navigationOptions: {
      title: 'Payment Page',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  PromoCode: {
    screen: PromoCode,
    navigationOptions: {
      title: 'Promo  codes',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: {
      headerLeft: null,
      title: 'Success',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  labConfirmation: {
    screen: labConfirmation,
    navigationOptions: {
      title: 'Lab Confirmation',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PolicyCoverage: {
    screen: PolicyCoverage,
    navigationOptions: {
      title: 'Policy Coverage',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  
  
  PreAuthList: {
    screen: PreAuthList,
    navigationOptions: {
      title: 'Pre Auth List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  PolicyStatus: {
    screen: PolicyStatus,
    navigationOptions: {
      title: 'Claim Status',
      headerTitleStyle: { fontFamily: "Roboto",}

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
      title: 'HomeHealthcare DoctorList',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  HomeHealthcareFilterPage: {
    screen: HomeHealthcareFilterPage,
    navigationOptions: {
      title: ' Home Filter Page',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },

  HomeHealthcareConfirmation: {
    screen: HomeHealthcareConfirmation,
    navigationOptions: {
      title: 'Home Healthcare Confirmation',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  'My Home Healthcare Appointments': {
    screen: HomeHealthcareAppointmentList,
    navigationOptions: {
      title: 'My Home Healthcare Appointments',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  HomeHealthcareAppointmentDetail: {
    screen: HomeHealthcareAppointmentDetail,
    navigationOptions: {
      title: 'Home Healthcare Appointment info',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Home Healthcare Cancel Appointment": {
    screen: HomeHealthcareCancelAppointment,
    navigationOptions: {
      title: 'Home Healthcare Cancel Appointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Home Healthcare Doctor Details Preview": {
    screen: HomeHealthcareDoctorDetailsPreview,
    navigationOptions: {
      title: 'Home Healthcare Doctor Details Preview',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "Home Healthcare Address List": {
    screen: HomeHealthcareAddressList,
    navigationOptions: {
      title: 'Home Healthcare Address List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },


  // ============Chat ========================
  "Chat Service": {
    screen: AvailableDoctors4Chat,
    navigationOptions: {
      title: 'Available Doctors',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  "My Chats": {
    screen: MyChats,
    navigationOptions: ({ navigation }) => ({
      title: 'Chats',
      headerTitleStyle: { fontFamily: "Roboto",},
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate('CorporateHome')}>
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
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#FFF', marginLeft: 5,  }}>Back</Text> : null}
          </Row>
        </TouchableOpacity>
      ),
    })
  },
  "SuccessChat": {
    screen: SuccessChatPaymentPage,
    navigationOptions: {
      title: 'Success',
      headerTitleStyle: { fontFamily: "Roboto",}

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
      title: 'Tele consult services ',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  'My Video Consultations': {
    screen: VideoConsultaions,
    navigationOptions: {
      title: 'My Video Consultations',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  /**** Get Suggestion list from Search Bar ****/
  RenderSuggestionList: {
    screen: RenderSuggestionList,
    navigationOptions: ({ navigation }) => ({
      title: 'Find & Book',
      headerTitleStyle: { fontFamily: "Roboto",}


    })
  },
  
  /* ========>  Lab Test  <========== */
  'Lab Test': {
    screen: LabCategory,
    navigationOptions: {
      title: 'Lab Category',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  LabSearchList: {
    screen: LabSearchList,
    navigationOptions: {
      title: 'Lab List',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  LabBookAppointment: {
    screen: LabBookAppointment,
    navigationOptions: {
      title: 'Lab BookAppointment',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  Insurance: {
    screen: Insurance,
    navigationOptions: {
      title: 'My Insurance Policies',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  AddInsurance: {
    screen: AddInsurance,
    navigationOptions: {
      title: 'Add Insurance',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  BuyInsurance: {
    screen: BuyInsurance,
    navigationOptions: {
      title: 'Buy Insurance',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: primaryColor },
      headerTintColor: 'white',
    })
  })

