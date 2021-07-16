
import React, { Component } from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import Profile from "../../modules/screens/userprofile";
import UpdateEmail from "../../modules/screens/userprofile/UpdateEmail";
import UpdateContact from "../../modules/screens/userprofile/UpdateContact";
import { primaryColor } from '../../setup/config'
import MedicineRecords from '../../modules/screens/medicalRecords/index'
import UpdatePassword from "../../modules/screens/userprofile/UpdatePassword";
import Updateheightweight from "../../modules/screens/userprofile/Updateheightweight";
import UpdateFamilyMembers from "../../modules/screens/userprofile/UpdateFamilyMembers";
import UpdateInsurance from "../../modules/screens/userprofile/UpdateInsurance";
import UpdateUserDetails from "../../modules/screens/userprofile/UpdateUserDetails";
import { Icon, View, Thumbnail, Item, Input, Left, Right } from 'native-base';
import IndividualChat from '../../modules/screens/chat/individualChat'
import Categories from "../../modules/screens/categories";
import InsuranceHistory from "../../modules/screens/Insurance/InsuranceHistory"

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
import EmrInfo from '../../modules/screens/MyAppointments/PrepareAppoinmentWizard/emrInfo'
import UploadEmr from '../../modules/screens/medicalRecords/uploadEmr'

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
import { translate } from '../translator.helper';
import PreAuthSubmission from '../../modules/screens/PreAuth/PreAuthSubmission/preAuthSubmission';
import PreAuthList from '../../modules/screens/PreAuth/PreAuthList/preAuthList';
import SubmitClaim from '../../modules/screens/ClaimIntimation/submitClaim';
import SubmitClaimPageTwo from '../../modules/screens/ClaimIntimation/SubmitClaimPageTwo'
import DoctorConsultation from '../../modules/screens/DoctorConsultation';
export const smartHealthStack=createStackNavigator({
  CorporateHome: {
    screen: CorporateHome,

    navigationOptions: ({ navigation }) => ({
      title: 'CorporateHome',
      headerTitleStyle: { fontFamily: "Roboto", },

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
                      {navigation.getParam('appBar', { locationCapta: 'Searching near by hospitals' }).locationCapta}

                    </TextTicker>


                  </View>
                </TouchableOpacity>
              </Col>

              <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end', marginLeft: 10 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} >
                  <View>
                    <Icon name="notifications" style={{ color: '#fff', marginRight: 5, fontFamily: 'Roboto', fontSize: 25 }}></Icon>
                    {navigation.getParam('notificationBadgeCount') ?
                      <Text style={{ position: 'absolute', backgroundColor: 'red', color: 'white', borderRadius: 20 / 2, marginTop: -7, width: undefined, height: undefined, padding: 2, fontSize: 10, textAlign: 'center', fontFamily: 'Roboto', }}>{navigation.getParam('notificationBadgeCount') >= 100 ? '99+' : navigation.getParam('notificationBadgeCount')}</Text> : null}
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
    navigationOptions: ({ navigation }) => ({
      title: translate('Refer and Earn'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  NextAppoinmentPreparation: {
    screen: NextAppoinmentPreparation,
    navigationOptions: ({ navigation }) => ({
      title: translate('Next Appoinment Preparation'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  // ================Categories  ===============
  Locations: {
    screen: Locations,
    navigationOptions: ({ navigation }) => ({
      title: translate('Locations'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  LocationDetail: {
    screen: LocationDetail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam('cityData') ? navigation.getParam('cityData').city_name : 'Areas',
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
      title: translate('Specialty'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  DoctorConsultation: {
    screen: DoctorConsultation,
    navigationOptions: ({ navigation }) => ({
      title: translate('Doctor Consultation'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  WishList: {
    screen: WishList,
    navigationOptions: ({ navigation }) => ({
      title: translate('WishList'),
    })
  },
  Notification: {
    screen: Notification,
    navigationOptions: ({ navigation }) => ({
      title: translate('Notification'),
      headerTitleStyle: { fontFamily: "Roboto", }
    })
  },


  ///  =============Appointments Stack ==================
  "My Appointments": {
    screen: MyAppoinmentList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Appointments'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "AppointmentInfo": {
    screen: AppointmentDetails,
    navigationOptions: ({ navigation }) => ({
      title: translate("Appointment info"),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  "EmrDetails": {
    screen: EmrDetails,
    navigationOptions: ({ navigation }) => ({
      title: translate("EMR Details"),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  ReportIssue: {
    screen: ReportIssue,
    navigationOptions: ({ navigation }) => ({
      title: translate('Report issue'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  ReportDetails: {
    screen: ReportDetails,
    navigationOptions: ({ navigation }) => ({
      title: translate('Report details'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PreAuthSubmission: {
    screen: PreAuthSubmission,
    navigationOptions: ({ navigation }) => ({
      title: translate('Pre Authorization'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "CancelAppointment": {
    screen: CancelAppointment,
    navigationOptions: ({ navigation }) => ({
      title: translate('Cancel Appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "InsertReview": {
    screen: InsertReview,
    navigationOptions: ({ navigation }) => ({
      title: translate('Rate and Review'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PrepareAppointmentWizard: {
    screen: PrepareAppointmentWizard,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  BasicInfo: {
    screen: BasicInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  MedicalHistory: {
    screen: MedicalHistory,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PhysicianInfo: {
    screen: PhysicianInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PastMedicalConditions: {
    screen: PastMedicalConditions,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PatientInfo: {
    screen: PatientInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  AllergiesAndMedications: {
    screen: AllergiesAndMedications,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  FamilyMedicalConditions: {
    screen: FamilyMedicalConditions,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  AllergicDisease: {
    screen: AllergicDisease,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  HospitalizationAndSurgeries: {
    screen: HospitalizationAndSurgeries,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  SocialHistory: {
    screen: SocialHistory,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PrepareAppointmentLastStep: {
    screen: PrepareAppointmentLastStep,
    navigationOptions: ({ navigation }) => ({
      title: translate('Prepare for the appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  CancelService: {
    screen: CancelService,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("tittle"),
      headerTitleStyle: { fontFamily: "Roboto", }

    }),
  },
  // ================Profile Stack =================
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: translate('Profile'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UpdateEmail: {
    screen: UpdateEmail,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update Email'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UpdateContact: {
    screen: UpdateContact,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update Contact'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update Password'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  Updateheightweight: {
    screen: Updateheightweight,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update height and weight'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UpdateFamilyMembers: {
    screen: UpdateFamilyMembers,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update family details'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  UpdateInsurance: {
    screen: UpdateInsurance,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update Insurance'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UpdateUserDetails: {
    screen: UpdateUserDetails,
    navigationOptions: ({ navigation }) => ({
      title: translate('Update User Details'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  UserAddress: {
    screen: UserAddress,
    navigationOptions: ({ navigation }) => ({
      title: translate('Search Location'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  MapBox: {
    screen: MapBox,
    navigationOptions: ({ navigation }) => ({
      title: translate('Search Location'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: ({ navigation }) => ({
      headerLeft: null,
      title: translate('Success'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  //================ Lab Test ===============
  LabAppointmentInfo: {
    screen: LabAppointmentInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab Test Appointment Details'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  'My Lab Test Appointments': {
    screen: LabAppointmentList,
    navigationOptions: ({ navigation }) => ({
      title: translate('My Lab Test Appointments'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  LabCancelAppointment: {
    screen: LabCancelAppointment,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab Test Cancel Appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  //================  Ecard  ===============
  "E Card": {
    screen: Ecard,
    navigationOptions: ({ navigation }) => ({
      title: translate('Ecard Details'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  //================  MedicineRecords ===============
  MedicineRecords: {
    screen: MedicineRecords,
    navigationOptions: {
      title: "Health Records",
      headerTitleStyle: { fontFamily: "Roboto", }

    }
  },
  EmrInfo: {
    screen: EmrInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('EmrInfo'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  UploadEmr: {
    screen: UploadEmr,
    navigationOptions: ({ navigation }) => ({
      title: translate('Upload Emr'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  ///  =============Contact Us ==================
  ContactUs: {
    screen: ContactUs,
    navigationOptions: ({ navigation }) => ({
      title: translate('ContactUs'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  //================  Appoinment Booking Through Hospitals ===============
  HospitalList: {
    screen: HospitalList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Hospital List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  TpaList: {
    screen: TpaList,
    navigationOptions: ({ navigation }) => ({
      title: translate('TPA List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  NetworkHospitals: {
    screen: NetworkHospitals,
    navigationOptions: ({ navigation }) => ({
      title: translate('Network Hospitals'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  ClaimIntimationSubmission: {
    screen: ClaimIntimationSubmission,
    navigationOptions: ({ navigation }) => ({
      title: translate('Claim Intimation'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  SubmitClaim:{
    screen: SubmitClaim,
    navigationOptions: {
      title: 'Submit Claim',
      headerTitleStyle: { fontFamily: "Roboto",}

    }
  },
  SubmitClaimPageTwo:{
        screen: SubmitClaimPageTwo,
        navigationOptions: {
          title: 'Submit Claim',
          headerTitleStyle: { fontFamily: "Roboto",}
       }
   },

  FamilyInfoList: {
    screen: FamilyInfoList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Family List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  ClaimIntimationSuccess: {
    screen: ClaimIntimationSuccess,
    navigationOptions: ({ navigation }) => ({
      title: translate('Success Page'),
      headerTitleStyle: { fontFamily: "Roboto" },
      headerLeft: null
    })
  },
  ClaimIntimationList: {
    screen: ClaimIntimationList,
    navigationOptions: ({ navigation }) => ({
      title: translate('ClaimIntimation List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  DocumentList: {
    screen: DocumentList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Document List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  // ========Appointment stack ==========
  "Doctor List": {
    screen: doctorSearchList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Doctor List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Doctor Search List": {
    screen: doctorList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Doctor List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Doctor Details Preview": {
    screen: doctorDetailsPreview,
    navigationOptions: ({ navigation }) => ({
      title: translate('Book Appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  "Filter Doctor Info": {
    screen: filterDocInfo,
    navigationOptions: ({ navigation }) => ({
      title: translate('Filter Page'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  Filters: {
    screen: FilterList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Filters'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Book Appointment": {
    screen: BookAppoinment,
    navigationOptions: ({ navigation }) => ({
      title: translate('Book Appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Mapbox": {
    screen: Mapbox,
    navigationOptions: ({ navigation }) => ({
      title: translate('Mapbox'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  Reviews: {
    screen: Reviews,
    navigationOptions: ({ navigation }) => ({
      title: translate('Reviews'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  "Payment Review": {
    screen: PaymentReview,
    navigationOptions: ({ navigation }) => ({
      title: translate('Payment Review'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  paymentPage: {
    screen: PaymentPage,
    navigationOptions: ({ navigation }) => ({
      title: translate('Payment Page'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  PromoCode: {
    screen: PromoCode,
    navigationOptions: ({ navigation }) => ({
      title: translate('Promo  codes'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  paymentsuccess: {
    screen: PaymentSuccess,
    navigationOptions: ({ navigation }) => ({
      headerLeft: null,
      title: translate('Success'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  labConfirmation: {
    screen: labConfirmation,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab Confirmation'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  PolicyCoverage: {
    screen: PolicyCoverage,
    navigationOptions: ({ navigation }) => ({
      title: translate('Policy Coverage'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },


  PreAuthList: {
    screen: PreAuthList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Pre Auth List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  PolicyStatus: {
    screen: PolicyStatus,
    navigationOptions: ({ navigation }) => ({
      title: translate('Claim Status'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
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
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Care DoctorList'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  HomeHealthcareFilterPage: {
    screen: HomeHealthcareFilterPage,
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Filter Page'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },

  HomeHealthcareConfirmation: {
    screen: HomeHealthcareConfirmation,
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Care Confirmation'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  'My Home Healthcare Appointments': {
    screen: HomeHealthcareAppointmentList,
    navigationOptions: ({ navigation }) => ({
      title: translate('My Home Care Appointments'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  HomeHealthcareAppointmentDetail: {
    screen: HomeHealthcareAppointmentDetail,
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Care Appointment info'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Home Healthcare Cancel Appointment": {
    screen: HomeHealthcareCancelAppointment,
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Care Cancel Appointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Home Healthcare Doctor Details Preview": {
    screen: HomeHealthcareDoctorDetailsPreview,
    navigationOptions: ({ navigation }) => ({
      title: translate('Doctor Details Preview'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "Home Healthcare Address List": {
    screen: HomeHealthcareAddressList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Home Care Address List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },


  // ============Chat ========================
  "Chat Service": {
    screen: AvailableDoctors4Chat,
    navigationOptions: ({ navigation }) => ({
      title: translate('Available Doctors'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  "My Chats": {
    screen: MyChats,
    navigationOptions: ({ navigation }) => ({
      title: translate('Chats'),
      headerTitleStyle: { fontFamily: "Roboto", },
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
              <Text style={{ fontFamily: 'Roboto', fontSize: 16, color: '#FFF', marginLeft: 5, }}>{translate("Back")}</Text> : null}
          </Row>
        </TouchableOpacity>
      ),
    })
  },
  "SuccessChat": {
    screen: SuccessChatPaymentPage,
    navigationOptions: ({ navigation }) => ({
      title: translate('Success'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
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
    navigationOptions: ({ navigation }) => ({
      title: translate('Video Calling'),
      headerLeft: null,
      gesturesEnabled: false
    })
  },
  'Video and Chat Service': {
    screen: AvailableDoctors4Video,
    navigationOptions: ({ navigation }) => ({
      title: translate('Tele consult services'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  'My Video Consultations': {
    screen: VideoConsultaions,
    navigationOptions: ({ navigation }) => ({
      title: translate('My Video Consultations'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  /**** Get Suggestion list from Search Bar ****/
  RenderSuggestionList: {
    screen: RenderSuggestionList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Find & Book'),
      headerTitleStyle: { fontFamily: "Roboto", }


    })
  },

  /* ========>  Lab Test  <========== */
  'Lab Test': {
    screen: LabCategory,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab Category'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  LabSearchList: {
    screen: LabSearchList,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab List'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  LabBookAppointment: {
    screen: LabBookAppointment,
    navigationOptions: ({ navigation }) => ({
      title: translate('Lab BookAppointment'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  Insurance: {
    screen: Insurance,
    navigationOptions: ({ navigation }) => ({
      title: translate('My Insurance Policies'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  InsuranceHistory: {
    screen: InsuranceHistory,
    navigationOptions: ({ navigation }) => ({
      title: translate('Insurance History'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  AddInsurance: {    screen: AddInsurance,
    navigationOptions: ({ navigation }) => ({
      title: translate('Add Insurance'),
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
  BuyInsurance: {
    screen: BuyInsurance,
    navigationOptions: ({ navigation }) => ({
      title: 'Buy Insurance',
      headerTitleStyle: { fontFamily: "Roboto", }

    })
  },
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: primaryColor },
      headerTintColor: 'white',
    })
  })

