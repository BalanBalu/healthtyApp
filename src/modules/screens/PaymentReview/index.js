import React, {Component} from 'react';
import {
  Container,
  Toast,
  Content,
  Text,
  Form,
  Button,
  Item,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  CheckBox,
  Input,
  Radio,
  Footer,
  FooterTab,
} from 'native-base';
import {hasLoggedIn} from '../../providers/auth/auth.actions';
import {Col, Row, Grid} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Pressable
} from 'react-native';
import {validateBooking} from '../../providers/bookappointment/bookappointment.action';
import {formatDate, isOnlyLetter, toTitleCase} from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import {GlobalStyles} from '../../../Constants/GlobalStyles';
import {
  renderDoctorImage,
  getDoctorEducation,
  getAllSpecialist,
  getUserGenderAndAge,
  toastMeassage,
  familyMemAgeCal,
  arrangeFullName
} from '../../common';
import {SERVICE_TYPES} from '../../../setup/config';
import {primaryColor} from '../../../setup/config';
import {translate} from '../../../setup/translator.helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../Constants/GlobalStyles';

import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';
import {fetchUserProfile} from '../../providers/profile/profile.action';
import {dateDiff} from '../../../setup/helpers';
import {TestDetails, POSSIBLE_FAMILY_MEMBERS} from './testDeatils';
import {PayBySelection, POSSIBLE_PAY_METHODS} from './PayBySelection';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getHospitalById,createAppointment} from '../../providers/BookAppointmentFlow/action';
import {
  getMemberDetailsByEmail,
  getFamilyMemDetails,
  deleteFamilyMembersDetails,
} from '../../providers/corporate/corporate.actions';

const bookSlotDetails = {
  slotDate: '2021-08-27',
  slotStartDateAndTime: '2021-08-27T01:10:01Z',
  slotEndDateAndTime: '2021-08-27T01:20:01Z',
  slotTimeUnit: 'minutes',
  slotDuration: 10,
  fee: 9,
  offerPercent: 10,
  feeWithoutOffer: 10,
  isSlotBooked: false,
  location: null,
};

const doctorDetails = {
  doctorId: '60deb4d937d7495cccd4aa18',
  hospitalId: '60deb53137d7495cccd4aa20',
  prefix: 'Dr',
  status: null,
  education: [
    {
      degree: 'B.D.S',
      institute: 'Christian Medical College',
      location: '122',
    },
    {
      degree: 'M.Surg',
      institute: 'Christian Medical College',
      location: 'we',
    },
    {
      degree: 'DPhil',
      institute: 'Christian Medical College',
      location: 'we',
    },
    {
      degree: 'M.B.B.S',
      institute: 'Christian Medical College',
      location: 'dsf',
    },
  ],
  specialist: [
    {
      "_id": "5dab9c65f680781894d6efa2",
      "category": "Primary Care Doctor",
      "categoryId": 1,
      "service": "Illness",
      "serviceId": 1
    }
  ],
  doctorIdHostpitalId: '60deb4d937d7495cccd4aa18-60deb53137d7495cccd4aa20',
  doctorName: 'pradeep pradeep',
  email: 'spradeepmp007@gmail.com',
  dob: '1995-10-01T18:30:00.000Z',
  profileImage: {
    image_id: '60e46b585acaff2ac0e9cb55',
    original_file_name: 'photo.jpg',
    type: 'image/jpeg',
    file_name: 'profileImage_1625582423857_photo.jpg',
    original_imageURL:
      'http://192.168.1.5:3000/smarthealth/profileImage/profileImage_1625582423857_photo.jpg',
    imageURL:
      'http://192.168.1.5:3000/images/profileImage_1625582423857_photo.jpg',
    updated_date: '2021-07-06T14:40:23.810Z',
    active: true,
  },
  yearOfExp: {year: 6, month: 6, isPrivate: null},
  slotData: {
    '2021-07-27': [
      {
        slotDate: '2021-07-27',
        slotStartDateAndTime: '2021-07-27T01:00:01Z',
        slotEndDateAndTime: '2021-07-27T01:10:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
      {
        slotDate: '2021-07-27',
        slotStartDateAndTime: '2021-07-27T01:10:01Z',
        slotEndDateAndTime: '2021-07-27T01:20:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
      {
        slotDate: '2021-07-27',
        slotStartDateAndTime: '2021-07-27T01:20:01Z',
        slotEndDateAndTime: '2021-07-27T01:30:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
      {
        slotDate: '2021-07-27',
        slotStartDateAndTime: '2021-07-27T01:30:01Z',
        slotEndDateAndTime: '2021-07-27T01:40:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
    ],
    '2021-08-01': [
      {
        slotDate: '2021-08-01',
        slotStartDateAndTime: '2021-07-31T18:30:01Z',
        slotEndDateAndTime: '2021-07-31T18:40:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
      {
        slotDate: '2021-08-01',
        slotStartDateAndTime: '2021-07-31T18:40:01Z',
        slotEndDateAndTime: '2021-07-31T18:50:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
      {
        slotDate: '2021-08-01',
        slotStartDateAndTime: '2021-07-31T18:50:01Z',
        slotEndDateAndTime: '2021-07-31T19:00:01Z',
        slotTimeUnit: 'minutes',
        slotDuration: 10,
        fee: 9,
        offerPercent: 10,
        feeWithoutOffer: 10,
        isSlotBooked: false,
        location: null,
      },
    ],
  },
};

export default class PaymentReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookSlotDetails: {},
      isLoading: true,
      gender: 'M',
      full_name: '',
      age: '',
      isSelected: 'self',
      patientDetailsObj: {},
      addPatientDataPoPupEnable: false,
      isCorporateUser: false,
      selectedPayBy: POSSIBLE_PAY_METHODS.SELF,
      familyMembersSelections: [],
      fromNavigation: null,
      familyMembersSelections: [],
      selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF],
      familyDetailsData: [],
      bookAppointment: [],
      doctorDetails: {},
      familyMembers: [],
    };
    this.defaultPatDetails = {};
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const isLoggedIn = await hasLoggedIn(this.props);

    const isCorporateUser =
      (await AsyncStorage.getItem('is_corporate_user')) === 'true';

    if (!isLoggedIn) {
      this.setState({isLoading: false});
      navigation.navigate('login');
      return;
    }
    
    // let bookAppointment=navigation.getParam('bookAppointment')
    // if(bookAppointment){
    // await this.setState({
    //     doctorDetails:bookAppointment.doctorDetails,
    //     bookSlotDetails:bookAppointment.selectedSlot,
    //     isLoading: false,
    //   })
    //   console.log("bookSlotDetails",this.state.bookSlotDetails)

    //   console.log("doctorDetails",this.state.doctorDetails)
    // }
    this.getSelfDatails();
    this.getFamilyInfo();
  }
  getSelfDatails = async () => {
    try {
      this.setState({isLoading: true});
      let basicProfileData = await AsyncStorage.getItem('basicProfileData');
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let basicData = JSON.parse(basicProfileData);
      if (basicData) {
        basicData.policyNumber=memberPolicyNo;
        this.defaultPatDetails = {
          type: 'self',
          full_name:arrangeFullName(basicData&&basicData.first_name,basicData&&basicData.last_name) ,
          gender: basicData.gender?basicData.gender:'N/A',
          age: parseInt(dateDiff(basicData.dob, new Date(), 'years')),
          phone_no: basicData.mobile_no?basicData.mobile_no:'N/A'
      } 
        this.setState({selfData:basicData}) 
     }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };
  async confirmProceedPayment() {

    const {patientDetailsObj,selfData} = this.state;
        // const {bookSlotDetails,patientDetailsObj,selfData} = this.state;

    let {diseaseDescription} = bookSlotDetails;
    // if (!Object.keys(patientDetailsObj).length) {
    //   Toast.show({
    //     text: translate('Kindly select Self or Add other patient details'),
    //     type: 'warning',
    //     duration: 3000,
    //   });
    //   return false;
    // }
    // if (diseaseDescription==undefined || String(diseaseDescription).trim() === '') {
    //   Toast.show({
    //     text: translate('Please enter valid Reason'),
    //     duration: 3000,
    //     type: 'warning',
    //   });
    //   return;
    // }
    this.setState({isLoading: true, spinnerText: translate('Please Wait')});
    const bookingSlotData = bookSlotDetails;
    let validationResult;
    // if (this.state.fromNavigation === 'HOSPITAL') {
    //   validationResult = {
    //     success: true,
    //   };
    // } else {
      console.log("bookingSlotData",bookingSlotData)
      const reqData = {
        startTime: bookingSlotData.slotStartDateAndTime,
        endTime: bookingSlotData.slotEndDateAndTime,
        "patientData": {
          "patientName": selfData[0].first_name,
          "patientAge": dateDiff(selfData[0].dob, new Date(), 'years'),
          "policyNumber": selfData[0].policyNumber,
          "gender": selfData[0].gender,
          "mobileNo": selfData&&selfData.mobileNo?selfData[0].mobileNo:null,
          "emailId": selfData[0].email,
          "dob": selfData[0].dob,
          "patientImage": selfData[0].profileImage
        },
       
        fee: bookingSlotData.fee||0,
        hospitalId: doctorDetails.hospitalId,
        doctorId: doctorDetails.doctorId,
        status:'PENDING',
        paymentId: "cash_1574318269541",
        bookedFor: "DOCTOR",
        // "categoryId": "string",
        // "bookedFrom": "string",
        statusUpdateReason: "NEW_BOOKING",
        description: bookSlotDetails.diseaseDescription?bookSlotDetails.diseaseDescription:'',
        // "tokenNo": "string",
        // "appointmentCode": "string",
        appointmentTakenDate:new Date()
      };
      validationResult = await createAppointment(reqData);
      console.log("validationResult",validationResult)
    // }
    this.setState({isLoading: false, spinnerText: ' '});
      if (validationResult.success) {
        Toast.show({
              text: "Your Appointment Booked Sucessfully",
              type: 'success',
              duration: 3000,
            });
            this.props.navigation.navigate('CorporateHome');
      }else{
        Toast.show({
              text: validationResult.message,
              type: 'warning',
              duration: 3000,
            });
      }
    // if (validationResult.success) {
    //   const patientDataObj = {
    //     patient_name: patientDetailsObj.full_name,
    //     patient_age: patientDetailsObj.age,
    //     gender: patientDetailsObj.gender,
    //   };
    //   if (patientDetailsObj.policy_no) {
    //     patientDataObj.policy_number = patientDetailsObj.policy_no;
    //   }
    //   bookSlotDetails.patient_data = patientDataObj;

    //   const amount = this.state.bookSlotDetails.slotData.fee;
    //   this.props.navigation.navigate('paymentPage', {
    //     service_type: SERVICE_TYPES.APPOINTMENT,
    //     bookSlotDetails: this.state.bookSlotDetails,
    //     amount: amount,
    //     fromNavigation: this.state.fromNavigation,
    //   });
    // } else {
    //   Toast.show({
    //     text: validationResult.message,
    //     type: 'warning',
    //     duration: 3000,
    //   });
    // }
  }
  async processToPayLater(paymentMethod) {
    const {
      bookSlotDetails,
      patientDetailsObj,
      fromNavigation,
      isCorporateUser,
    } = this.state;
    let {diseaseDescription} = bookSlotDetails;

    if (
      !patientDetailsObj ||
      (patientDetailsObj && !Object.keys(patientDetailsObj).length)
    ) {
      Toast.show({
        text: translate('Kindly select Self or Add other patient details'),
        type: 'warning',
        duration: 3000,
      });
      return false;
    }
    if (!diseaseDescription || String(diseaseDescription).trim() === '') {
      Toast.show({
        text: translate('Please enter valid Reason'),
        duration: 3000,
        type: 'warning',
      });
      return;
    }

    this.setState({
      isLoading: true,
      spinnerText: translate('We are Booking your Appointment'),
    });

    const patientDataObj = {
      patient_name: patientDetailsObj.full_name,
      patient_age: patientDetailsObj.age,
      gender: patientDetailsObj.gender,
    };
    if (patientDetailsObj.policy_no) {
      patientDataObj.policy_number = patientDetailsObj.policy_no;
    }

    bookSlotDetails.patient_data = patientDataObj;

    const userId = await AsyncStorage.getItem('userId');
    this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();

    let modesOfPayment = 'cash';

    if (paymentMethod === POSSIBLE_PAY_METHODS.CORPORATE) {
      modesOfPayment = 'corporate';
    } else if (paymentMethod === POSSIBLE_PAY_METHODS.INSURANCE) {
      modesOfPayment = 'insurance';
    }
    let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(
      true,
      {},
      modesOfPayment,
      bookSlotDetails,
      SERVICE_TYPES.APPOINTMENT,
      userId,
      modesOfPayment,
    );

    if (response.success) {
      this.props.navigation.navigate('paymentsuccess', {
        successBookSlotDetails: bookSlotDetails,
        paymentMethod: paymentMethod,
        tokenNo: response.tokenNo,
        fromNavigation: fromNavigation,
      });
    } else {
      Toast.show({
        text: response.message,
        type: 'warning',
        duration: 3000,
      });
    }
    this.setState({isLoading: false, spinnerText: ' '});
  }

  getFamilyInfo = async () => {
    try {
      this.setState({isLoading: true});
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let employeeCode = await AsyncStorage.getItem('employeeCode');
      let result = await getFamilyMemDetails(memberPolicyNo, employeeCode);
      console.log('result', result);
      if (result) {
        this.setState({familyMembers: result, isLoading: false});
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  addPatientList = async (patientData) => {
    this.setState({errMsg: ''});
    const othersDetailsObj = patientData[0];
    await this.setState({
      patientDetailsObj: othersDetailsObj,
      updateButton: false,
      addPatientDataPoPupEnable: false,
    });
  };

  renderPatientDetails(data, index, enableSelectionBox, patientSelectionType) {
    // const {isCorporateUser, payBy} = this.props;
    return (
      <View
        style={{
          borderColor: 'gray',
          borderWidth: 0.3,
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}>
       
        <Row>
          <Col size={5}>
            <Text style={styles.subText}>
              {(data.first_name ? data.first_name + ' ' : '') + (data.last_name ? data.last_name + ' ' : '')}
            </Text>
          </Col>
          <Col size={5}>
            <Text style={styles.subText}>{formatDate(data.dob,'DD/MM/YY')}</Text>
          </Col>
        </Row>
        <Row style={{marginTop: 10}}>
          <Col size={4}>
            <Row>
              <Col size={3}>
                <Text style={styles.subText}>Gender</Text>
              </Col>
              <Col size={2}>
                <Text style={styles.subText}>-</Text>
              </Col>
              <Col size={5}>
                <Text style={[styles.subText, {color: '#909498'}]}>
                  {data.gender? data.gender:'N/A'}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: 10}}>
          <Col size={4}>
            <Row>
              <Col size={3}>
                <Text style={styles.subText}>RelationShip</Text>
              </Col>
              <Col size={2}>
                <Text style={styles.subText}>-</Text>
              </Col>
              <Col size={5}>
                <Text style={[styles.subText, {color: '#909498'}]}>
                  {data.relationship? data.relationship:'N/A'}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </View>
    );
  }

  render() {
    const {
      // bookSlotDetails,
      isCorporateUser,
      patientDetailsObj,
      addPatientDataPoPupEnable,
      errMsg,
      isLoading,
      spinnerText,
      isSelected,
      name,
      age,
      gender,
      fromNavigation,
      familyMembers,
      selfData,
      // doctorDetails
    } = this.state;
    // console.log("bookSlotDetails",bookSlotDetails)
    return (
      <Container>
        <Content style={{padding: 15, backgroundColor: '#F5F5F5'}}>
          <Spinner visible={isLoading} textContent={spinnerText} />
          <View style={{paddingBottom: 50}}>
            <View style={{backgroundColor: '#fff', padding: 10}}>
              {fromNavigation === 'HOSPITAL' ? (
                <Row>
                  <Col size={1.6}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('ImageView', {
                          passImage: renderDoctorImage(doctorDetails),
                          title: 'Profile photo',
                        })
                      }>
                      <Image
                        source={renderDoctorImage(doctorDetails)}
                        style={{height: 50, width: 50}}
                      />
                    </TouchableOpacity>
                  </Col>
                  <Col size={8.4}>
                    <Text style={styles.docName}>
                      {doctorDetails.doctorName ? doctorDetails.doctorName : ''}
                    </Text>
                    <Text style={styles.hosAddress}>
                      {bookSlotDetails.slotData.location.location.address
                        .no_and_street + ', '}
                      {bookSlotDetails.slotData.location.location.address.city +
                        ', '}
                      {bookSlotDetails.slotData.location.location.address
                        .state + '-'}{' '}
                      {
                        bookSlotDetails.slotData.location.location.address
                          .pin_code
                      }
                      .
                    </Text>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col size={1.6}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('ImageView', {
                          passImage: renderDoctorImage(doctorDetails),
                          title: 'Profile photo',
                        })
                      }>
                      <Image
                        source={renderDoctorImage(doctorDetails)}
                        style={{height: 50, width: 50, borderRadius: 50 / 2}}
                      />
                    </TouchableOpacity>
                  </Col>
                  <Col size={8.4}>
                    <Text style={styles.docName}>
                      {doctorDetails.prefix ? doctorDetails.prefix : '' || ''}{' '}
                      {doctorDetails.doctorName ? doctorDetails.doctorName : ''}{' '}
                      {getDoctorEducation(doctorDetails.education)}
                    </Text>
                    <Text style={styles.specialist}>
                      {doctorDetails.specialist?getAllSpecialist(doctorDetails.specialist):''}
                    </Text>
                  </Col>
                </Row>
              )}
              {fromNavigation !== 'HOSPITAL' && bookSlotDetails.slotData ? (
                <View style={{marginTop: 10}}>
                  <Row>
                    <Icon
                      name="location-sharp"
                      style={{fontSize: 20, marginLeft: 2}}
                    />
                    <Text style={styles.hospName}>
                      {bookSlotDetails.slotData.location.name}
                    </Text>
                  </Row>
                  <Text style={styles.hosAddress}>
                    {bookSlotDetails.slotData.location.location.address
                      .no_and_street + ', '}
                    {bookSlotDetails.slotData.location.location.address.city +
                      ', '}
                    {bookSlotDetails.slotData.location.location.address.state +
                      '-'}{' '}
                    {
                      bookSlotDetails.slotData.location.location.address
                        .pin_code
                    }
                    .
                  </Text>
                </View>
              ) : null}
              <Row style={{marginTop: 10}}>
                <Col size={5} style={{flexDirection: 'row'}}>
                  <Icon
                    name="md-calendar"
                    style={{fontSize: 20, color: '#0054A5'}}
                  />
                  <Text style={styles.calDate}>
                    {bookSlotDetails &&
                      formatDate(
                        bookSlotDetails.slotStartDateAndTime,
                        'Do MMMM, YYYY',
                      )}
                  </Text>
                </Col>
                <Col size={5} style={{flexDirection: 'row'}}>
                  <AntDesign
                    name="clockcircleo"
                    style={{fontSize: 18, color: '#8EC63F'}}
                  />
                  <Text style={styles.clockTime}>
                    {bookSlotDetails &&
                      formatDate(
                        bookSlotDetails.slotStartDateAndTime,
                        'hh:mm A',
                      )}{' '}
                    -{' '}
                    {bookSlotDetails &&
                      formatDate(bookSlotDetails.slotEndDateAndTime, 'hh:mm A')}
                  </Text>
                </Col>
              </Row>
            </View>

            {/* <View style={{paddingBottom: 50}}>
      <View style={{backgroundColor: '#fff', padding: 10}}>
              <Text style={{fontSize: 16, fontFamily: 'opensans-bold'}}>
                {translate('Patient Details')}
              </Text>
              <FlatList
                data={selfData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) =>
                  this.renderPatientDetails(
                    item,
                    index,
                    true,
                    POSSIBLE_FAMILY_MEMBERS.FAMILY_WITHOUT_PAY,
                  )
                }
              />
            </View>
            </View> */}
            {/* <PayBySelection
              isCorporateUser={isCorporateUser}
              selectedPayBy={this.state.selectedPayBy}
              onSelectionChange={(mode) => {
                this.setState({
                  selectedPayBy: mode,
                  selectedPatientTypes: [POSSIBLE_FAMILY_MEMBERS.SELF],
                  patientDetailsObj: selfData,
                  familyMembersSelections: [],
                });
              }}
            /> */}

            <TestDetails
              isCorporateUser={isCorporateUser}
              navigation={this.props.navigation}
              singlePatientSelect={true}
              selfData={this.defaultPatDetails}
              onSelectionChange={(patientType) => {
                if (patientType === POSSIBLE_FAMILY_MEMBERS.SELF) {
                  this.setState({
                    patientDetailsObj: this.defaultPatDetails,
                    selectedPatientTypes: [patientType],
                    familyMembersSelections: [],
                  });
                } else {
                  this.setState({
                    patientDetailsObj: {},
                    selectedPatientTypes: [patientType],
                  });
                }
              }}
              familyDetailsData={this.state.familyDetailsData}
              setFamilyDetailsData={(familyDetailsData) =>
                this.setState({familyDetailsData: familyDetailsData})
              }
              selectedPatientTypes={this.state.selectedPatientTypes}
              payBy={this.state.selectedPayBy}
              addPatientDetails={(data, setDefaultPatentData) => {
                if (setDefaultPatentData === true) {
                  this.defaultPatDetails = data[0];
                }
                this.addPatientList(data);
              }}
            />
            <View style={{backgroundColor: '#fff', padding: 10, marginTop: 10}}>
              <Row>
                <Icon name="create" style={{fontSize: 15, color: '#000'}} />
                <Text style={styles.subText}>
                  {translate('Your reason for checkup')}
                </Text>
              </Row>
              <Form style={{marginRight: 1, marginLeft: -13}}>
                <Item style={{borderBottomWidth: 0}}>
                  <TextInput
                    onChangeText={(diseaseDescription) => {
                      var bookSlotDetails = {...this.state.bookSlotDetails};
                      bookSlotDetails.diseaseDescription = diseaseDescription;
                      this.setState({bookSlotDetails});
                    }}
                    multiline={true}
                    placeholder={translate('Write Reason')}
                    placeholderTextColor={'#909498'}
                    style={styles.textInput}
                  />
                </Item>
              </Form>
            </View>
            <View style={{backgroundColor: '#fff', padding: 10, marginTop: 10}}>
              <Row>
                <Icon
                  name="ios-cash"
                  style={{fontSize: 15, color: primaryColor}}
                />
                <Text style={styles.subText}>
                  {translate('Billing Details')}
                </Text>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Roboto',
                      color: '#909498',
                    }}>
                    {translate('Consultation Fees')}
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.rupeesText}>
                    {'\u20B9'}
                    {bookSlotDetails && bookSlotDetails.fee}
                  </Text>
                </Col>
              </Row>
              {/* <Row style={{marginTop: 10}}>
                <Col>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Roboto',
                      color: '#909498',
                    }}>
                    {translate('Charges')}{' '}
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.redRupesText}>{'\u20B9'} 0.00</Text>
                </Col>
              </Row> */}
              <Row style={{marginTop: 10}}>
                <Col>
                  <Text style={{fontSize: 14, fontFamily: 'Roboto'}}>
                    {translate('Amount to be Paid')}
                  </Text>
                </Col>
                <Col>
                  <Text style={styles.rupeesText}>
                    {'\u20B9'}{' '}
                    {((bookSlotDetails && bookSlotDetails.fee) || 0) + 0}
                  </Text>
                </Col>
              </Row>
            </View>
          </View>
        </Content>
        
        <Footer style={Platform.OS === 'ios' ? {height: 30} : {height: 45}}>
          <FooterTab>
          <Row style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0054A5',
                    }}>
           
                  <TouchableOpacity
                      onPress={() => this.confirmProceedPayment()}
                      style={styles.buttonTouch1}>
                      <Text style={styles.footerButtonText}>Book Appointment</Text>
                    </TouchableOpacity>
            
          </Row>
            {/* <Row>
              {this.state.selectedPayBy === POSSIBLE_PAY_METHODS.SELF ? (
                <>
                  <Col
                    size={5}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0054A5',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.processToPayLater('cash')}
                      style={styles.buttonTouch}>
                      <Text style={styles.footerButtonText}>
                        Pay at{' '}
                        {bookSlotDetails.slotData &&
                          toTitleCase(bookSlotDetails.slotData.location.type)}
                      </Text>
                    </TouchableOpacity>
                  </Col>
                  <Col
                    size={5}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#8EC63F',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.confirmProceedPayment()}
                      style={styles.buttonTouch1}>
                      <Text style={styles.footerButtonText}>Pay Online</Text>
                    </TouchableOpacity>
                  </Col>
                </>
              ) : (
                <Col
                  size={5}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0054A5',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.processToPayLater(this.state.selectedPayBy)
                    }
                    style={styles.buttonTouch}>
                    <Text style={styles.footerButtonText}>
                      {translate('Book an Appointment')}{' '}
                    </Text>
                  </TouchableOpacity>
                </Col>
              )}
            </Row> */}
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: primaryColor,
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
  },
  cardItemText: {
    fontFamily: 'opensans-bold',
    fontSize: 14,
    color: '#FFF',
  },
  cardItemText2: {
    marginTop: 5,
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#FFF',
    lineHeight: 15,
    width: '90%',
  },
  cardItemText3: {
    fontFamily: 'opensans-bold',
    fontSize: 16,
    height: 30,
    color: '#FFF',
    paddingBottom: -10,
  },
  card: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    margin: 5,
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCard: {
    marginTop: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  callNowButton: {
    height: heightPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('4.5%'),
    minWidth: widthPercentageToDP('80%'),
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:  heightPercentageToDP('5%'),
  },
  callNowButtonText: {
    color: "#128283",
   textAlign: 'center',
   paddingTop: heightPercentageToDP('5%'),
   paddingBottom: heightPercentageToDP('5%'),
   fontSize: widthPercentageToDP('4%'),
   fontFamily: 'opensans-bold',
  },

  diseaseText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 10,
    fontStyle: 'italic',
    marginTop: -5,
  },
  hospitalText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 15,
    width: '80%',
  },
  hosAddressText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 15,
    fontStyle: 'italic',
    width: '80%',
    marginTop: 5,
  },
  cardItem2: {
    backgroundColor: primaryColor,
    marginLeft: -5,
    marginBottom: -10,
    marginRight: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    height: 40,
    marginTop: 10,
    alignItems: 'center',
  },
  cardItemText: {
    fontFamily: 'opensans-bold',
    fontSize: 14,
    color: '#FFF',
  },
  subText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  textInput: {
    borderColor: '#909498',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 100,
    fontSize: 14,
    textAlignVertical: 'top',
    width: '100%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop: 15,
  },
  payButton: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    marginLeft: 25,
    padding: 10,
    backgroundColor: '#149C00',
  },
  payButton1: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    backgroundColor: '#0055A5',
  },
  payButtonText: {
    fontFamily: 'opensans-bold',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  touchStyle: {
    backgroundColor: primaryColor,
    borderRadius: 3,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 5,
    paddingTop: 5,
  },
  touchText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  subHead: {
    fontFamily: 'opensans-bold',
    fontSize: 14,
    color: primaryColor,
  },
  firstCheckBox: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#000',
    marginLeft: 20,
  },
  nameAndAge: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  genderText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    marginLeft: 10,
  },
  commonText: {
    fontFamily: 'opensans-bold',
    fontSize: 14,
    color: '#000',
  },
  inputText: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    fontSize: 14,
    height: 33,
  },
  buttonTouch: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 20,
    borderRadius: 10,
  },
  buttonTouch1: {
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 10,
  },
  docName: {
    fontSize: 15,
    marginLeft: 10,
    fontFamily: 'Roboto',
    color: primaryColor,
  },
  specialist: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#909498',
    marginLeft: 10,
  },
  hospName: {
    fontSize: 14,
    fontFamily: 'Roboto',
    marginLeft: 10,
  },
  hosAddress: {
    fontSize: 13,
    fontFamily: 'Roboto',
    color: '#909498',
    marginLeft: 23,
  },
  calDate: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#0054A5',
    marginLeft: 5,
  },
  clockTime: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#8EC63F',
    marginLeft: 5,
  },
  rupeesText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    textAlign: 'right',
    color: '#8EC63F',
  },
  redRupesText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    textAlign: 'right',
    color: 'red',
  },
  footerButtonText: {
    fontSize: 16,
    fontFamily: 'opensans-bold',
    color: '#fff',
  },
});
