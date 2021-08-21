import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { primaryColor } from '../../../setup/config'

import { NavigationEvents } from 'react-navigation';
import { viewUserReviews, bindDoctorDetails, appointmentStatusUpdate, appointmentDetails, getPaymentInfomation, getAppointmentCode } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, dateDiff, statusValue, getMoment, isTimeAfter } from '../../../setup/helpers';
import { getUserRepportDetails } from '../../providers/reportIssue/reportIssue.action';
import { Loader } from '../../../components/ContentLoader'
import { InsertReview } from '../Reviews/InsertReview'
import { renderDoctorImage, RenderHospitalAddress, getDoctorEducation, getAllEducation, getAllSpecialist, getName, getDoctorExperience, getHospitalHeadeName, getHospitalAddress, getDoctorNameOrHospitalName, toastMeassage } from '../../common'
import { translate } from "../../../setup/translator.helper";
import { updateEvent } from "../../../setup/calendarEvent";
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const hasReviewButtonShow = true

class AppointmentDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      appointmentId: '',
      doctorId: null,
      userId: '',
      reviewData: [],
      reportData: null,
      doctorData: {},
      isLoading: true,

      // appointmentStatus: '',
      statusUpdateReason: ' ',
      education: '',
      specialist: '',
      selectedTab: 0,
      paymentDetails: {},
      modalVisible: false,
      proposedVisible: false,


    }

  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem('userId');
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
    if (appointmentData == undefined) {
      const appointmentId = navigation.getParam('appointmentId');
      console.log(appointmentId)
      // this.props.navigation.setParams({ reportedId: appointmentId });
      await this.setState({ appointmentId: appointmentId });
      // await new Promise.all([
      this.appointmentDetailsGetById()
      //   this.getUserReviews(),
      //   this.getUserReport(),
      // ]);
    }
    else {
      let doctorId = appointmentData.doctorId || null;
      let appointmentId = appointmentData._id;
      const selectedTab = navigation.getParam('selectedIndex');
      // this.props.navigation.setParams({ reportedId: appointmentId });


      await this.setState({
        doctorId: doctorId, appointmentId: appointmentId,
        userId: userId, data: appointmentData, selectedTab
      })

      // await new Promise.all([
      //   this.getPaymentInfo(appointmentData.payment_id),
      //   this.getDoctorDetails(),
      //   this.getUserReviews(),
      //   this.getUserReport(),
      // ])

// Need To Discuss For REview

      // if (appointmentData.status == 'COMPLETED') {
      //   await this.setState({ modalVisible: true })
      // }
      let checkProposedNewTime = await AsyncStorage.getItem(this.state.appointmentId)
      if (appointmentData.status == 'PROPOSED_NEW_TIME' && checkProposedNewTime != 'SKIP') {
        await this.setState({ proposedVisible: true })
      }

    }

    await this.setState({ isLoading: false })
  }

  /* Get Doctor Details */
  // getDoctorDetails = async () => {
  //   try {

  //     let fields = 'prefix,education,specialist,experience,language,professional_statement,profile_image';
  //     if (this.state.doctorId !== null) {
  //       let resultDetails = await bindDoctorDetails(this.state.doctorId, fields);

  //       if (resultDetails.success) {
  //         let educationDetails = '';
  //         if (resultDetails.data.education != undefined) {
  //           educationDetails = getAllEducation(resultDetails.data.education)
  //         }
  //         let specialistDetails = '';
  //         if (resultDetails.data.specialist != undefined) {
  //           specialistDetails = getAllSpecialist(resultDetails.data.specialist)
  //         }


  //         this.setState({
  //           education: educationDetails,
  //           doctorData: resultDetails.data,
  //           specialist: specialistDetails.toString(),
  //         })
  //       }
  //     }

  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }

  
  /* get User reviews */
  getUserReviews = async () => {
    try {

      let resultReview = await viewUserReviews('appointment', this.state.appointmentId, '?skip=0');
      if (resultReview.success) {
        this.setState({ reviewData: resultReview.data });
      }

    }
    catch (e) {
      console.error(e);
    }


  }
  getUserReport = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      let resultReport = await getUserRepportDetails('appointment', userId, this.state.appointmentId);

      if (resultReport.success) {

        this.setState({ reportData: resultReport.data });
      }
    }

    catch (e) {
      console.error(e);
    }

  }

  // appointmentDetailsGetById = async () => {
  //   try {
  //     let result = await appointmentDetails(this.state.appointmentId);
  //     if (result.success) {
  //       this.setState({ doctorId: result.data[0].doctor_id, data: result.data[0] }),
  //         await new Promise.all([
  //           this.getDoctorDetails(),
  //           this.getPaymentInfo(result.data[0].payment_id)])


  //       if (result.data[0].appointment_status == 'COMPLETED' && result.data[0].is_review_added == undefined) {
  //         await this.setState({ modalVisible: true })
  //       }
  //       let checkProposedNewTime = await AsyncStorage.getItem(this.state.appointmentId)
  //       if (result.data[0].appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime !== 'SKIP') {
  //         await this.setState({ proposedVisible: true })
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  // }


  getPaymentInfo = async (paymentId) => {
    try {
      let result = await getPaymentInfomation(paymentId);

      if (result.success) {
        this.setState({ paymentDetails: result.data[0] })
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  navigateAddReview() {
    this.setState({
      modalVisible: true
    });

  }

  /* Update Appoiontment Status */

  updateAppointmentStatus = async (data, updatedStatus) => {
    try {
      this.setState({ isLoading: true });
      let memberId = await AsyncStorage.getItem("memberId");
      let requestData = {
        _id:data._id,
        userId: memberId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: updatedStatus,
        statusUpdateReason: data.statusUpdateReason,
        statusBy: 'USER'
      };
      // if (data.bookedFor === 'HOSPITAL') {
      //   requestData.hospitalAdminId = data.hospitalInfo.hospitalAdminId
      // } else {
      //   requestData.doctorId = data.doctorInfo.doctorId
      // }

      let result = await appointmentStatusUpdate(requestData);
      this.setState({ isLoading: false })

      if (result._id) {
        let temp = this.state.data
        let startTime = getMoment(data.startTime).toISOString();
        let endTime = getMoment(data.endTime).toISOString();
        let address = ''
        // if (temp.location[0]) {
        //   address = temp.location[0].location.address.city || temp.location[0].location.address.state
        // }

        //Event Update Need To Discuss

        // let doctorName=temp.doctorInfo!==undefined? temp.doctorInfo.prefix+' '+temp.doctorInfo.firstName+' '+temp.doctorInfo.lastName: '';
        // let tittle=temp.bookedFor==='HOSPITAL'?temp.hospitalInfo.hospitalName:temp.bookedFor==='DOCTOR'?doctorName:'';
        // await updateEvent(temp.userAppointmentEventId, "Appointment booked with " + tittle,startTime, endTime, address, temp.description)

        temp.status = result.status;
        temp.statusBy=result.statusBy;
        temp.statusUpdateReason=result.statusUpdateReason;
        Toast.show({
            text: 'Your appointment has been updated',
            duration: 3000,
            type: 'success'
        })
        if (this.state.proposedVisible == true) {
          this.setState({ proposedVisible: false });
        }

        this.setState({ data: temp });
        this.props.navigation.setParams({ 'refreshPage': true });
      }else{
        Toast.show({
          text: 'Somthing went worng please try again..',
          type: "danger",
          duration: 3000
        })
      }
    }
    catch (e) {
      console.log(e);
      Toast.show({
        text: 'Somthing went worng please try again..',
        type: "danger",
        duration: 3000
      })
    }
  }


  async navigateCancelAppoointment() {
    try {
      // this.state.data.prefix = this.state.doctorData.prefix;


      await this.setState({ proposedVisible: false })
      this.props.navigation.navigate('CancelAppointment', { appointmentDetail: this.state.data })
    }
    catch (e) {
      console.log(e)
    }
  }



  async onPressToGetAppointmentCode() {
    if (data && data.appointmentCode) {
      toastMeassage('Your Appoinment Code:' + data.appointmentCode, 'success', 3000)
    }
    else {
      toastMeassage('Failed To Get Appoinment Code!!', 'danger', 3000)

    }
  }
  async backNavigation() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      if (navigation.state.params.hasReloadReportIssue) {
        this.getUserReport();  // Reload the Reported issues when they reload
      }
    };
  }

  async getvisble(val) {
    try {

      await this.setState({ isLoading: true, modalVisible: false })
      if (val.updatedVisible == true) {
        toastMeassage('Thank you for your valuable feedback', 'success', 3000)
        this.props.navigation.setParams({ 'refreshPage': true });
        this.getUserReviews()
      }
    } catch (e) {
      console.log(e)
    }
    finally {
      await this.setState({ isLoading: false })
    }
  }
  async SkipAction() {
    await AsyncStorage.setItem(this.state.appointmentId, 'SKIP')

    this.setState({ proposedVisible: false })
  }

  navigateToBookAppointmentPage() {
    const { data } = this.state
    // let doctorId = data.doctorId;
    this.props.navigation.navigate('DoctorConsultation', {
      reqData4HistoryPage: data,
      fromHistoryPage: true
    })
  }

  doctorLanguage(data) {

    return (
      data ?
        <Row style={styles.rowSubText}>
          <Col style={{ width: '8%', paddingTop: 5 }}>
            <Icon name="ios-book" style={{ fontSize: 20, }} />
          </Col>
          <Col style={{ width: '92%', paddingTop: 5 }}>
            <Text style={styles.innerSubText}>{translate("Doctor spoken language")}</Text>
            <Text note style={styles.subTextInner1}>{data && data.language && data.language.toString()}</Text>
          </Col>
        </Row> : null
    )

  }





  render() {
    const { data, reviewData, reportData, education, specialist, isLoading, selectedTab, paymentDetails, appointmentId } = this.state;
    const patientData = data.patientData, doctorInfo = data.doctorInfo;

    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          {isLoading == true ? <Loader style={'appointment'} /> :
            <View style={{ marginBottom: 20 }}>
              <Card style={{
                borderRadius: 10,
              }}>
                <NavigationEvents
                  onWillFocus={payload => { this.backNavigation(payload) }}
                />




                <Grid style={styles.cardItem}>
                  <Row style={{ justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}>
                    {data.tokenNo ?
                      <Text style={{ textAlign: 'right', fontSize: 14, }} >{"Ref no :" + data.tokenNo}</Text>
                      : null}
                  </Row>

                  <Row style={{ marginLeft: 10, marginRight: 10 }}>
                    <Col style={{ width: '22%', justifyContent: 'center', marginTop: 10 }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(data.doctorInfo), title: 'Profile photo' })}>
                        <Thumbnail circular source={renderDoctorImage(data.doctorInfo)} style={{ height: 60, width: 60 }} />
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '77%', marginTop: 10 }}>
                      <Row>
                        <Col size={9}>
                          <Text style={styles.Textname} >{getDoctorNameOrHospitalName(data)}</Text>
                          <Text note style={{ fontSize: 13, fontFamily: 'Roboto', color: '#4c4c4c' }}>{getDoctorEducation(data.doctorInfo)}</Text>
                          <Text style={styles.specialistTextStyle} >{getAllSpecialist(data.specialist)} </Text>
                        </Col>
                        <Col size={1}>
                        </Col>
                      </Row>
                      <Row style={{ alignSelf: 'flex-start' }}>

                      </Row>
                      {/* <Text style={styles. cardItemText2}>{getUserGenderAndAge(data && data.userInfo)}</Text>  */}
                    </Col>
                  </Row>
                </Grid>


                <Grid style={{ marginTop: 10 }}>
                  <Row>
                    <Col size={6}>
                      <Row style={{ marginTop: 10, marginLeft: 5 }} >
                        <Text style={styles.subText1}>{translate("Experience")}</Text>
                        <Text style={styles.subText2}>-</Text>
                        <Text note style={styles.subText2}>{getDoctorExperience(data.doctorInfo.experience)}</Text>
                      </Row>
                      <Row style={{ marginTop: 10, marginLeft: 5 }}>
                        <Text style={styles.subText1}>{translate("Payment Method")}</Text>
                        <Text style={styles.subText2}>-</Text>
                        <Text note style={styles.subText2}>{paymentDetails.payment_method || 0}</Text>
                      </Row>
                    </Col>
                    {data.status == 'APPROVED' ?
                      <Col size={3}>
                        <Text style={{ marginLeft: 16, fontSize: 15, fontFamily: 'opensans-bold', color: 'green' }}>{translate("ONGOING")}</Text>
                      </Col>
                      :
                      data.status != undefined &&
                      <Col size={3}>

                        <View style={{ alignItems: 'center', marginLeft: -25 }}>
                          <Icon name={statusValue[data.status].icon}
                            style={{
                              color: statusValue[data.status].color,
                              fontSize: 35
                            }} />

                          <Text capitalise={true} style={[styles.textApproved, { color: statusValue[data.status].color }]}>{data.status == 'PROPOSED_NEW_TIME' ? 'PROPOSED NEW TIME' : data.status}</Text>
                        </View>
                      </Col>
                    }
                  </Row>

                  {selectedTab == 0 ? (data.status == 'APPROVED' || data.status == 'PENDING') ?
                    <Row>
                      <Col size={7}>
                        <Row style={{ marginTop: 10 }}>

                          <Text note style={styles.subText3}>{translate("Do you want to cancel this appointment ?")}</Text>

                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ marginTop: 10 }}>
                          <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                            <Text style={styles.ButtonText}>{translate("CANCEL")}</Text>
                          </Button>
                        </Row>
                      </Col>
                    </Row> :
                    data.status == 'PROPOSED_NEW_TIME' ?
                      <Row>
                        <Col size={4}>
                          <Row style={{ marginTop: 10 }}>

                            <Text note style={styles.subText3}>{translate("Do you want to accept ?")}</Text>

                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')}>
                              <Text style={styles.ButtonText}>{translate("ACCEPT")}</Text>
                            </Button>
                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                              <Text capitalise={true} style={styles.ButtonText}>{translate("CANCEL")}</Text>
                            </Button>
                          </Row>
                        </Col></Row> : null : data.status == 'APPROVED' && isTimeAfter(new Date().toISOString(), data.startTime) ?

                    <Row>
                      <Col size={5}>
                        <Row style={{ marginTop: 10 }}>
                          <Text note style={styles.subText3}>{translate("Do you need to get code ?")}</Text>
                        </Row>
                      </Col>
                      <Col size={5}>
                        <Row style={{ marginTop: 10 }}>
                          <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.onPressToGetAppointmentCode(data)}>
                            <Text style={styles.ButtonText}>{translate("Get appointment Code")}</Text>
                          </Button>
                        </Row>
                      </Col>
                    </Row> : null}
                </Grid>
                <CardItem footer style={styles.cardItem2}>
                  <Grid>
                    <Row style={{ marginRight: 5 }} >
                      <Col style={{ width: '50%', }}>
                        <Row>
                          <Icon name='md-calendar' style={styles.iconStyle} />
                          <Text style={styles.timeText}>{formatDate(data.startTime, 'Do MMM,YYYY')}</Text>

                        </Row>
                      </Col>
                      <Col style={{ width: '50%', marginLeft: 5, }}>
                        <Row>
                          <AntDesign name='clockcircleo' style={styles.iconStyle} />
                          <Text style={styles.timeText}>{formatDate(data.startTime, 'hh:mm a') + '-' + formatDate(data.endTime, 'hh:mm a')}</Text>
                        </Row>
                      </Col>
                    </Row>
                  </Grid>
                </CardItem>

              </Card>


              <Grid>
                {/* {formatDate(data.appointment_starttime,'DD/MM/YYYY')==formatDate(new Date(),'DD/MM/YYYY')&&data.appointment_status=='APPROVED'?
            <Row style={styles.rowStyle}>
              <TouchableOpacity style={styles.touchableStyle}>
                <Row>
                <Icon name='md-cloud-upload' style={{color:'#4765FF',fontSize:25}}/>
                <Text style={styles.touchableText}>Upload Your Prescription</Text>
                </Row>
              </TouchableOpacity>
            </Row>:null} */}

                <Row style={styles.rowStyle}>
                  {/* {data.status == 'APPROVED' || data.status == 'PENDING' || data.status == 'PROPOSED_NEW_TIME' ?
                    <Col size={6}>
                      <TouchableOpacity style={styles.appoinmentPrepareStyle} onPress={() => { this.props.navigation.navigate('PrepareAppointmentWizard', { AppointmentId: appointmentId,Data: data.doctorInfo }) }}>

                        <Text style={styles.touchableText1}>{translate("Appointment Preparation")}</Text>

                      </TouchableOpacity>
                    </Col>
                    : null
                  } */}
                  <Col size={4} style={{ marginLeft: 5 }}>
                    <TouchableOpacity style={styles.appoinmentPrepareStyle2} onPress={() => this.navigateToBookAppointmentPage()} testID='navigateBookingPage'>
                      <Text style={styles.touchableText1}>{translate("Book Again")}	</Text>
                    </TouchableOpacity>
                  </Col>


                </Row>

                <View style={{ marginTop: 10 }}>
                  {data.status === 'CANCELED' || data.status === 'PROPOSED_NEW_TIME' ? data.statusUpdateReason != undefined &&
                    <View style={styles.rowSubText1}>
                      <Row style={styles.rowSubText}>
                        <Col style={{ width: '8%', paddingTop: 5 }}>
                          <Icon name="ios-document" style={{ fontSize: 20, }} />
                        </Col>

                        <Col style={{ width: '92%', paddingTop: 5 }}>
                          {data.status == 'PROPOSED_NEW_TIME' ?
                            <Text style={styles.innerSubText1}>
                              {data.statusBy.toLowerCase() === 'user' ? translate('Proposed a new time by You') : translate('Rescheudled a new Time by doctor')}</Text>
                            : null}
                          {data.status == 'CANCELED' ?
                            <Text style={styles.innerSubText1}>
                              {data.statusBy.toLowerCase() === 'user' ? translate('Canceled by You') : translate(' Canceled by doctor')}</Text>
                            : null}
                          {/* <Text style={styles.innerSubText1}>{data.appointment_status=='PROPOSED_NEW_TIME'?'Reschedule by '+data.status_updated_by.toLowerCase():'Canceled by '+data.status_updated_by.toLowerCase()}</Text> */}
                          <Text note style={styles.subTextInner1}>{data.statusUpdateReason}</Text>
                        </Col>
                      </Row>

                      {/* Need Previous data */}

                      {/* {data.previous_data != undefined && data.statusUpdateReason === 'PROPOSED_NEW_TIME' &&
                        <Row style={styles.rowSubText}>
                          <Col style={{ width: '8%', paddingTop: 5 }}>
                          <AntDesign name='clockcircleo' style={{ fontSize: 20, }} />
                          </Col>
                          <Col style={{ width: '92%', paddingTop: 5 }}>
                            <Text style={styles.innerSubText1}>{translate("Previous Time")}</Text>

                            <Text note style={styles.subTextInner1}>{formatDate(data.previous_data.startDateTime, 'DD/MM/YYYY')}</Text>
                            <Text note style={styles.subTextInner1}>{formatDate(data.previous_data.startDateTime, 'hh:mm a') + formatDate(data.previous_data.endDateTime, '-hh:mm a')}</Text>
                          </Col>
                        </Row>
                      } */}
                    </View> : null}
                  {patientData && Object.keys(patientData).length ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-home" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Patient  Details")}</Text>
                        <View >
                          <Row style={{ marginTop: 8, }}>
                            <Col size={8}>
                              <Row>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>1.</Text>
                                </Col>
                                <Col size={2}>
                                  <Text style={styles.commonText}>{translate("Name")}</Text>
                                </Col>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#4c4c4c' }}>{patientData.patientName}</Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col size={10}>
                              <Row>
                                <Col size={.5}>
                                </Col>
                                <Col size={2}>
                                  <Text style={styles.commonText}>{translate("Age")}</Text>
                                </Col>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text style={{ fontFamily: 'Roboto', fontSize: 12, color: '#4c4c4c' }}>{(patientData.patientAge) + ' - ' + (patientData.gender)}</Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </View>
                      </Col>
                    </Row>
                    : null}
                  <Row style={styles.rowSubText}>
                    <Col style={{ width: '8%', paddingTop: 5 }}>
                      <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                    </Col>
                    <Col style={{ width: '92%', paddingTop: 5 }}>
                      <Text style={styles.innerSubText}>{translate("Disease")}</Text>
                      <Text note style={styles.subTextInner1}>{data.description || ''}</Text>
                    </Col>
                  </Row>

                  {data.patientStatment != undefined ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-create" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Patient Stament")}</Text>
                        <Text note style={styles.subTextInner1}>{data.patientStatment}</Text>
                      </Col>
                    </Row> : null}
                  {data.hospitalInfo != undefined &&
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="location-sharp" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Hospital")}</Text>
                        <Text style={styles.subTextInner1}>{getHospitalHeadeName(data.hospitalInfo)}</Text>
                        <Text note style={styles.subTextInner1}>{getHospitalAddress(data.hospitalInfo)}</Text>
                      </Col>
                    </Row>}
                  {/* <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-contact" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Personal Details</Text>
                 <Row style={{marginTop:10}}>
              <Col style={{width:'25%'}}>
                  <Text style={styles.downText}>Email
                  </Text>
              </Col>
              <Col  style={{width:'10%'}}>
                <Text style={styles.downText}>:</Text>
              </Col>
              <Col  style={{width:'65%'}}>
            <Text note style={styles.downText}>{doctorData && doctorData.email}</Text>
              </Col>
            </Row> 
            <Row style={{marginTop:10}}>
              <Col style={{width:'25%'}}>
                  <Text style={styles.downText}>Contact
                  </Text>
              </Col>
              <Col  style={{width:'10%'}}>
                <Text style={styles.downText}>:</Text>
              </Col>
              <Col  style={{width:'65%'}}>
            <Text note style={styles.downText}>{doctorData && doctorData.mobile_no||'N/A'} </Text>
              </Col>
            </Row>
              </Col>
            </Row>*/}

                  {doctorInfo&&doctorInfo.language != undefined && doctorInfo.language.length != 0 ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-book" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Doctor spoken language")}</Text>
                        <Text note style={styles.subTextInner1}>{doctorInfo.language && doctorInfo.language.toString()}</Text>
                      </Col>
                    </Row> : null}








                  {/* Need EMR Data */}

                  {/* {data.is_emr_recorded !== undefined ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-document" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>EMR Report</Text>

                        <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                          <TouchableOpacity onPress={() => { this.props.navigation.navigate('EmrDetails', { appointmentId: data._id }) }}>
                            <Text note style={[styles.subTextInner2, { marginLeft: 10 }]}>"You get EMR from doctor more details click here"</Text>
                            <Row>
                              <Col size={9}>


                              </Col>
                              <Col size={1}>
                                <Icon name='ios-arrow-forward' style={{ fontSize: 20, color: 'grey' }} />
                              </Col>
                            </Row>
                          </TouchableOpacity>
                        </View>

                      </Col>
                    </Row> : null} */}

                  {/* PAYMENT REPORT */}

                  {/* <Row style={styles.rowSubText}>
                    <Col style={{ width: '8%', paddingTop: 5 }}>
                      <Icon name="ios-document" style={{ fontSize: 20, }} />
                    </Col>
                    <Col style={{ width: '92%', paddingTop: 5 }}>
                      <Text style={styles.innerSubText}>{translate("Payment Report")}</Text>
                      {reportData != null ?
                        <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                          <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: data._id, serviceType: 'appointment' }) }}>
                            <Text note style={[styles.subTextInner2, { marginLeft: 10 }]}>{translate("You have raised Report for this appointment")}</Text>
                            <Row>
                              <Col size={9}>
                                <Text note style={[styles.subTextInner1, { marginLeft: 10 }]}>{reportData.issue_type || ' '}</Text>

                              </Col>
                              <Col size={1}>
                                <Icon name='ios-arrow-forward' style={{ fontSize: 20, color: 'grey' }} />
                              </Col>
                            </Row>
                          </TouchableOpacity>
                        </View> :

                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 10 }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.push('ReportIssue', {
                                issueFor: { serviceType: 'APPOINTMENT', reportedId: data._id, status: data.status },
                                prevState: this.props.navigation.state
                              })
                            }}
                            block success
                            style={styles.reviewButton
                            }>
                            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'opensans-bold', textAlign: 'center', marginTop: 5 }}>
                              {translate("Report Issue")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                    </Col>
                  </Row> */}

                  {/* Review Card  */}

                  {/* {(data.status == 'COMPLETED' && reviewData.length !== 0) || reviewData.length !== 0 ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>Review</Text>

                        <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                          disabled={false}
                          maxStars={5}
                          rating={reviewData[0] && reviewData[0].overall_rating}
                        />
                        <Text note style={styles.subTextInner1}>{reviewData[0] && reviewData[0].comments || ''}</Text>
                      </Col>
                    </Row> :
                    (data.status == 'COMPLETED' && reviewData.length == 0) || hasReviewButtonShow == true ?
                      <Row style={styles.rowSubText}>
                        <Col style={{ width: '8%', paddingTop: 5 }}>
                          <Icon name="ios-add-circle" style={{ fontSize: 20, }} />

                        </Col>
                        <Col style={{ width: '92%', paddingTop: 5 }}>
                          <Text style={styles.innerSubText}>{translate("Add Feedback")}</Text>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>

                              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'opensans-bold', textAlign: 'center', marginTop: 5 }}>{translate("Add Feedback")} </Text>
                              <MaterialIcons name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></MaterialIcons>
                            </TouchableOpacity>
                          </View>
                        </Col>
                      </Row> : null
                  } */}

                  {/* PAYMENT INFO */}

                  {/* <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                    <Col style={{ width: '8%', paddingTop: 5 }}>
                      <Icon name="ios-cash" style={{ fontSize: 20, }} />
                    </Col>
                    <Col style={{ width: '92%', paddingTop: 5 }}>
                      <Text style={styles.innerSubText}>{translate("Payment Info")}</Text>
                      <Row style={{ marginTop: 10 }}>
                        <Col style={{ width: '60%' }}>
                          <Text style={styles.downText}>{translate("Total Fee")}
                          </Text>
                        </Col>
                        <Col style={{ width: '15%' }}>
                          <Text style={styles.downText}>-</Text>
                        </Col>
                        <Col style={{ width: '25%' }}>
                          <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount != undefined ? paymentDetails.amount : 0) + "/-"}</Text>
                        </Col>
                      </Row>
                      {
                      paymentDetails.coupon_code_discount_amount ?
                        <Row style={{ marginTop: 10 }}>
                          <Col style={{ width: '60%' }}>
                            <Text style={styles.downText}>{translate("coupon code discount amount")}
                </Text>
                          </Col>
                          <Col style={{ width: '15%' }}>
                            <Text style={styles.downText}>-</Text>
                          </Col>
                          <Col style={{ width: '25%' }}>
                            <Text note style={styles.downText}>{"Rs." + paymentDetails.coupon_code_discount_amount}</Text>
                          </Col>
                        </Row> : null
                    }
                    {
                      paymentDetails.credit_point_discount_amount ?
                        <Row style={{ marginTop: 10 }}>
                          <Col style={{ width: '60%' }}>
                            <Text style={styles.downText}>{translate("credit point discount amount")}
                </Text>
                          </Col>
                          <Col style={{ width: '15%' }}>
                            <Text style={styles.downText}>-</Text>
                          </Col>
                          <Col style={{ width: '25%' }}>
                            <Text note style={styles.downText}>{"Rs." + paymentDetails.credit_point_discount_amount}</Text>
                          </Col>
                        </Row> : null
                    }

                      <Row style={{ marginTop: 10 }}>
                        <Col style={{ width: '60%' }}>
                          <Text style={styles.downText}>{translate("Payment Made")}
                          </Text>
                        </Col>
                        <Col style={{ width: '15%' }}>
                          <Text style={styles.downText}>-</Text>
                        </Col>
                        <Col style={{ width: '25%' }}>
                          <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount_paid != undefined ? paymentDetails.amount_paid : 0) + "/-"}</Text>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Col style={{ width: '60%' }}>
                          <Text style={styles.downText}>{translate("Payment Due")}
                          </Text>
                        </Col>
                        <Col style={{ width: '15%' }}>
                          <Text style={styles.downText}>-</Text>
                        </Col>
                        <Col style={{ width: '25%' }}>
                          <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount_due != undefined ? paymentDetails.amount_due : 0) + "/-"}</Text>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Col style={{ width: '60%' }}>
                          <Text style={styles.downText}>{translate("Payment Method")}
                          </Text></Col>
                        <Col style={{ width: '15%' }}>
                          <Text style={styles.downText}>-</Text>
                        </Col>
                        <Col style={{ width: '25%' }}>
                          <Text note style={styles.downText}>{paymentDetails.payment_method || 0}</Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}
                </View>
              </Grid>
            </View>}
          {this.state.modalVisible === true ?
            <InsertReview
              data={this.state.data}
              popupVisible={(data) => this.getvisble(data)}

            /> : null}


          <Modal
            visible={this.state.proposedVisible}
            transparent={true}
            animationType={'fade'}
          >
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={{
                width: '95%',
                height: '25%',
                backgroundColor: '#fff',
                borderColor: 'gray',
                borderWidth: 3,
                padding: 10,
                borderRadius: 10
              }}>

                <CardItem header style={styles.cardItem3}>
                  <Text style={{ fontSize: 13, fontFamily: 'opensans-bold', marginTop: -5, color: '#FFF', marginLeft: -5 }}>{translate('Doctor has Rescheduled the appointment !')}</Text></CardItem>
                {/* <Row style={{ justifyContent: 'center' }}>
                  <Col style={{ width: '25%' }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Roboto', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "DD/MM/YYYY") : null}</Text>
                  </Col>
                  <Col style={{ width: '75%' }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Roboto', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "hh:mm a") + formatDate(data.previous_data.endDateTime, "-hh:mm a") : null}</Text>
                  </Col>

                </Row> */}
                <Row style={{ justifyContent: 'center' }}>
                  <Col style={{ width: '30%' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Roboto', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.startTime, "DD/MM/YYYY")}</Text>
                  </Col>
                  <Col style={{ width: '70%' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Roboto', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.startTime, "hh:mm a") + formatDate(data.endTime, "-hh:mm a")}</Text>
                  </Col>

                </Row>
                <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>
                  <Col size={2}></Col>
                  <Col size={8} >
                    <Row>

                      <Col size={3} style={{ marginRight: 3 }}>
                        <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: primaryColor }}
                          onPress={() => this.SkipAction()} testID='confirmButton'>

                          <Text style={{ fontFamily: 'Roboto', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'SKIP'}</Text>
                        </TouchableOpacity>
                      </Col>
                      <Col size={3.4} style={{ marginRight: 3 }} >
                        <TouchableOpacity style={{ backgroundColor: '#6FC41A', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, }} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')} testID='confirmButton'>
                          <Text style={{ fontFamily: 'Roboto', fontSize: 12, textAlign: 'center', color: '#fff' }}>{'ACCEPT'}</Text>
                        </TouchableOpacity>
                      </Col>
                      <Col size={3.6}>
                        <TouchableOpacity danger style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: 'red' }} onPress={() => this.navigateCancelAppoointment()} testID='cancelButton'>
                          <Text style={{ fontFamily: 'Roboto', fontSize: 12, textAlign: 'center', color: '#fff' }}> {'CANCEL'}</Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>





                  </Col>

                </Row>
              </View>

            </View>
          </Modal>

        </Content>
      </Container>

    )

  }
}

export default AppointmentDetails


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 10

  },

  cardItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',

  },
  cardItemText2: {
    fontFamily: 'Roboto',
    fontSize: 13,
    marginTop: 5,
    fontStyle: 'italic',
    width: '90%'
  },
  Textname: {
    fontSize: 14,
    fontFamily: 'opensans-bold',
  },
  specialistTextStyle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginTop: 5

  },
  subText1: {
    fontSize: 13,
    fontFamily: 'opensans-bold',
  },
  subText2: {
    fontSize: 13,
    fontFamily: 'Roboto',
    marginLeft: 5,
    color: '#4c4c4c'
  },
  subText3: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginLeft: 5
  },
  confirmButton: {
    backgroundColor: '#6FC41A',
    height: 30,
    padding: 17,
    borderRadius: 5
  },
  ButtonText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'opensans-bold'
  },
  textApproved: {
    fontSize: 12,
    fontFamily: 'opensans-bold'
  },
  postponeButton: {
    // backgroundColor:'#4765FF',
    height: 25,
    padding: 8,
    borderRadius: 5
  },
  timeText: {
    fontFamily: 'opensans-bold',
    fontSize: 13,
    color: '#FFF',
    marginLeft: 10

  },
  iconStyle: {
    fontSize: 20,
    color: '#FFF'
  },
  rowStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  touchableStyle: {
    borderColor: '#4765FF',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8
  },
  touchableText: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    color: '#4765FF',
    marginTop: 4,
    marginLeft: 5
  },
  touchableText1: {
    fontFamily: 'opensans-bold',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center'
  },
  appoinmentPrepareStyle: {
    backgroundColor: '#8EC63F',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5
  },
  rowSubText: {
    marginLeft: 10,
    // borderBottomColor:'gray',
    // borderBottomWidth:0.5,
    marginRight: 10,
    marginTop: 10
  },
  innerSubText: {
    fontSize: 13,
    fontFamily: 'opensans-bold',
    marginBottom: 5
  },
  subTextInner1: {
    fontSize: 12,
    fontFamily: 'Roboto',
    marginBottom: 5,
    color: '#4c4c4c'
  },
  subTextInner2: {
    fontSize: 10,
    color: "red",
    fontFamily: 'Roboto',
    marginBottom: 5
  },

  downText: {
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  cardItemText3: {
    fontFamily: 'opensans-bold',
    fontSize: 18,
    height: 30,
    color: '#FFF', paddingBottom: -10
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
    alignItems: 'center'

  },
  innerCard: {
    marginTop: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5
  },
  diseaseText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginLeft: 10,
    fontStyle: 'italic',
    marginTop: -5
  },
  hospitalText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginLeft: 15,
    width: "80%"
  },
  hosAddressText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginLeft: 15,
    fontStyle: 'italic',
    width: "80%",
    marginTop: 5
  },
  cardItem2: {
    backgroundColor: primaryColor,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 10
  },
  cardItem3: {
    backgroundColor: primaryColor,
    marginBottom: -10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginLeft: -10,
    marginBottom: -10,
    marginRight: -10,
    //  justifyContent:'center',
    //  alignItems:"center",ss
    height: 35,
    marginTop: -10
  },
  cardItemText: {
    fontFamily: 'opensans-bold',
    fontSize: 16,
    color: '#FFF'
  },
  subText: {
    fontFamily: 'opensans-bold',
    fontSize: 18,
    marginTop: 15,
    marginLeft: 5
  },
  customHead:
  {
    fontFamily: 'Roboto',
  },
  customText:
  {

    fontFamily: 'Roboto',
    color: '#000',
    fontSize: 14,

  },

  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },

  customCard: {
    borderRadius: 20,
    padding: 7,
    marginTop: -150,
    marginLeft: 15,
    marginRight: 15,
    fontFamily: 'Roboto',

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto',
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto',
    fontSize: 12
  },


  subtitlesText: {
    fontSize: 15,
    padding: 4,
    margin: 10,
    backgroundColor: '#FF9500',
    color: '#fff',
    width: 160,
    fontFamily: 'Roboto-semibold',
    textAlign: 'center',
    borderRadius: 10

  },

  customIcons:
  {
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    // borderColor: 'red',
    // borderWidth: 2,
    fontSize: 25,
    height: 25,
    width: 25,
    fontFamily: 'opensans-bold'

  },
  leftButton:
  {
    height: 45,
    width: '98%',
    backgroundColor: '#23D972',
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 15
  },
  rightButton: {
    height: 45,
    width: '98%',
    backgroundColor: '#745DA6',
    borderRadius: 5,
    marginLeft: 2,
    marginRight: 2,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 10
  },
  customPadge: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 5,
  },
  customTouch: {
    borderRadius: 5,
    height: 45,
    width: '30%',
    backgroundColor: primaryColor,
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5
  },
  customSelectedTouch: {
    backgroundColor: '#A9A9A9',
    borderRadius: 5,
    height: 45,
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5
  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: primaryColor,
    borderRadius: 10,
    height: 40,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row'
  },
  rowSubText1: {
    marginLeft: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,

    marginTop: 10
  },
  innerSubText1: {
    fontSize: 13,
    fontFamily: 'opensans-bold',
    color: primaryColor,
    // marginBottom: 5
  },
  commonText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#4c4c4c',
  },
  bookAgain1: {
    fontSize: 13,
    fontFamily: 'opensans-bold',
  },
  bookingButton: {
    marginTop: 10,
    backgroundColor: primaryColor,
    marginRight: 1,
    borderRadius: 10,
    width: "auto",
    height: 30,
    color: "white",
    fontSize: 12,
    textAlign: "center"
  },
  appoinmentPrepareStyle2: {
    backgroundColor: primaryColor,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5
  },


})

