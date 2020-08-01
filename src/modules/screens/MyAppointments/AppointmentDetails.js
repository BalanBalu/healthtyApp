import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal, FlatList } from 'react-native';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import { viewUserReviews, bindDoctorDetails, appointmentStatusUpdate, appointmentDetails, getPaymentInfomation } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, dateDiff, statusValue,getMoment } from '../../../setup/helpers';
import { getUserRepportDetails } from '../../providers/reportIssue/reportIssue.action';
import { Loader } from '../../../components/ContentLoader'
import { InsertReview } from '../Reviews/InsertReview'
import { renderDoctorImage, RenderHospitalAddress, getAllEducation, getAllSpecialist, getName, getDoctorExperience, getHospitalHeadeName, getHospitalName } from '../../common'
import { translate } from "../../../setup/translator.helper";
import {updateEvent}from "../../../setup/calendarEvent";

const hasReviewButtonShow = true

class AppointmentDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      appointmentId: '',
      doctorId: '',
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
      // this.props.navigation.setParams({ reportedId: appointmentId });
      await this.setState({ appointmentId: appointmentId });
      await new Promise.all([
        this.appointmentDetailsGetById(),
        this.getUserReviews(),
        this.getUserReport(),
      ]);
    }
    else {
      let doctorId = appointmentData.doctor_id;
      let appointmentId = appointmentData._id;
      const selectedTab = navigation.getParam('selectedIndex');
      // this.props.navigation.setParams({ reportedId: appointmentId });


      await this.setState({
        doctorId: doctorId, appointmentId: appointmentId,
        userId: userId, data: appointmentData, selectedTab
      })

      await new Promise.all([
        this.getPaymentInfo(appointmentData.payment_id),
        this.getDoctorDetails(),
        this.getUserReviews(),
        this.getUserReport(),
      ])
      if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
        await this.setState({ modalVisible: true })
      }
      let checkProposedNewTime = await AsyncStorage.getItem(this.state.appointmentId)
      if (appointmentData.appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime != 'SKIP') {
        await this.setState({ proposedVisible: true })
      }

    }

    await this.setState({ isLoading: false })
  }

  /* Get Doctor Details */
  getDoctorDetails = async () => {
    try {

      let fields = 'prefix,education,specialist,experience,language,professional_statement,profile_image';
      let resultDetails = await bindDoctorDetails(this.state.doctorId, fields);

      if (resultDetails.success) {
        let educationDetails = '';
        if (resultDetails.data.education != undefined) {
          educationDetails = getAllEducation(resultDetails.data.education)
        }
        let specialistDetails = '';
        if (resultDetails.data.specialist != undefined) {
          specialistDetails = getAllSpecialist(resultDetails.data.specialist)
        }


        this.setState({
          education: educationDetails,
          doctorData: resultDetails.data,
          specialist: specialistDetails.toString(),
        })
      }

    }
    catch (e) {
      console.log(e);
    }
  }

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

  appointmentDetailsGetById = async () => {
    try {
      let result = await appointmentDetails(this.state.appointmentId);
      if (result.success) {
        this.setState({ doctorId: result.data[0].doctor_id, data: result.data[0] }),
          await new Promise.all([
            this.getDoctorDetails(),
            this.getPaymentInfo(result.data[0].payment_id)])


        if (result.data[0].appointment_status == 'COMPLETED' && result.data[0].is_review_added == undefined) {
          await this.setState({ modalVisible: true })
        }
        let checkProposedNewTime = await AsyncStorage.getItem(this.state.appointmentId)
        if (result.data[0].appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime !== 'SKIP') {
          await this.setState({ proposedVisible: true })
        }
      }
    } catch (error) {
      console.error(error);
    }

  }
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
      let userId = await AsyncStorage.getItem('userId');
      let requestData = {
        doctorId: data.doctor_id,
        userId: userId,
        startTime: data.appointment_starttime,
        endTime: data.appointment_endtime,
        status: updatedStatus,
        statusUpdateReason: this.state.statusUpdateReason,
        status_by: 'USER'
      };

      let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
      this.setState({ isLoading: false })

      if (result.success) {
        let temp = this.state.data
        let appointment_starttime=getMoment(data.appointment_starttime).toISOString();
       let appointment_endtime=getMoment(data.appointment_endtime).toISOString();
let   address=''
if(temp.location[0]){
  address=temp.location[0].location.address.city||temp.location[0].location.address.state
}

        await updateEvent(temp.user_appointment_event_id, "Appointment booked with "+temp.location[0].name+" "+temp.location[0].type,appointment_starttime,appointment_endtime,address,temp.disease_description)
           
        temp.appointment_status = result.appointmentData.appointment_status
        Toast.show({
          text: result.message,
          duration: 3000
        })
        if (this.state.proposedVisible == true) {
          this.setState({ proposedVisible: false });
        }

        this.setState({ data: temp });
        this.props.navigation.setParams({ 'refreshPage': true });
      }
    }
    catch (e) {
      console.log(e);
    }
  }


  async navigateCancelAppoointment() {
    try {
      this.state.data.prefix = this.state.doctorData.prefix;


      await this.setState({ proposedVisible: false })
      this.props.navigation.navigate('CancelAppointment', { appointmentDetail: this.state.data })
    }
    catch (e) {
      console.log(e)
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
    let doctorId = data.doctor_id;
    this.props.navigation.navigate('Book Appointment', {
      doctorId: doctorId,
      fetchAvailabiltySlots: true
    })
  }






  render() {
    const { data, reviewData, reportData, doctorData, education, specialist, isLoading, selectedTab, paymentDetails, appointmentId } = this.state;
    const patDetailsDataObj = data.patient_data;
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
                    {data.token_no ?
                      <Text style={{ textAlign: 'right', fontSize: 14, }} >{"Ref no :" + data.token_no}</Text>
                      : null}
                  </Row>

                  <Row style={{ marginLeft: 10, marginRight: 10 }}>
                    <Col style={{ width: '22%', justifyContent: 'center', marginTop: 10 }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(doctorData), title: 'Profile photo' })}>
                        <Thumbnail circular source={renderDoctorImage(doctorData)} style={{ height: 60, width: 60 }} />
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '77%', marginTop: 10 }}>
                      <Row>
                        <Col size={9}>
                          <Text style={styles.Textname} >{(doctorData && doctorData.prefix != undefined ? doctorData.prefix + ' ' : '') + (getName(data.doctorInfo)) + ' '}</Text>
                          <Text note style={{ fontSize: 13, fontFamily: 'OpenSans', fontWeight: 'normal', color: '#4c4c4c' }}>{education}</Text>
                          <Text style={styles.specialistTextStyle} >{specialist} </Text>
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
                        <Text style={styles.subText1}>Experience</Text>
                        <Text style={styles.subText2}>-</Text>
                        <Text note style={styles.subText2}>{getDoctorExperience(doctorData.calulatedExperience)}</Text>
                      </Row>
                      <Row style={{ marginTop: 10, marginLeft: 5 }}>
                        <Text style={styles.subText1}>Payment Method</Text>
                        <Text style={styles.subText2}>-</Text>
                        <Text note style={styles.subText2}>{paymentDetails.payment_method || 0}</Text>
                      </Row>
                    </Col>
                    {data.appointment_status == 'APPROVED' && data.onGoingAppointment === true ?
                      <Col size={3}>
                        <Text style={{ marginLeft: 16, fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', color: 'green' }}>ONGOING</Text>
                      </Col>
                      :
                      data.appointment_status != undefined &&
                      <Col size={3}>

                        <View style={{ alignItems: 'center', marginLeft: -25 }}>
                          <Icon name={statusValue[data.appointment_status].icon}
                            style={{
                              color: statusValue[data.appointment_status].color,
                              fontSize: 35
                            }} />

                          <Text capitalise={true} style={[styles.textApproved, { color: statusValue[data.appointment_status].color }]}>{data.appointment_status == 'PROPOSED_NEW_TIME' ? 'PROPOSED NEW TIME' : data.appointment_status}</Text>
                        </View>
                      </Col>
                    }
                  </Row>

                  {selectedTab == 0 ? data.onGoingAppointment !== true && (data.appointment_status == 'APPROVED' || this.state.appointmentStatus === 'APPROVED' || data.appointment_status == 'PENDING') ?
                    <Row>
                      <Col size={7}>
                        <Row style={{ marginTop: 10 }}>

                          <Text note style={styles.subText3}>Do you need to cancel this appointment ?</Text>

                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ marginTop: 10 }}>
                          <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                            <Text style={styles.ButtonText}>CANCEL</Text>
                          </Button>
                        </Row>
                      </Col>
                    </Row> :
                    data.onGoingAppointment !== true && data.appointment_status == 'PROPOSED_NEW_TIME' ?
                      <Row>
                        <Col size={4}>
                          <Row style={{ marginTop: 10 }}>

                            <Text note style={styles.subText3}>Do you want to accept ?</Text>

                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')}>
                              <Text style={styles.ButtonText}>ACCEPT</Text>
                            </Button>
                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                              <Text capitalise={true} style={styles.ButtonText}>CANCEL</Text>
                            </Button>
                          </Row>
                        </Col></Row> : null : null}
                </Grid>
                <CardItem footer style={styles.cardItem2}>
                  <Grid>
                    <Row style={{ marginRight: 5 }} >
                      <Col style={{ width: '50%', }}>
                        <Row>
                          <Icon name='md-calendar' style={styles.iconStyle} />
                          <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'Do MMM,YYYY')}</Text>

                        </Row>
                      </Col>
                      <Col style={{ width: '50%', marginLeft: 5, }}>
                        <Row>
                          <Icon name="md-clock" style={styles.iconStyle} />
                          <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'hh:mm a') + '-' + formatDate(data.appointment_endtime, 'hh:mm a')}</Text>
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
                  {data.appointment_status == 'APPROVED' || data.appointment_status == 'PENDING' || data.appointment_status == 'PROPOSED_NEW_TIME' ?
                    <Col size={6}>
                      <TouchableOpacity style={styles.appoinmentPrepareStyle} onPress={() => { this.props.navigation.navigate('PrepareAppointmentWizard', { AppointmentId: appointmentId, DoctorData: doctorData, Data: data.doctorInfo }) }}>

                        <Text style={styles.touchableText1}>{translate("Appointment Preparation")}</Text>

                      </TouchableOpacity>
                    </Col>
                    : null
                  }
                  <Col size={4} style={{ marginLeft: 5 }}>
                    <TouchableOpacity style={styles.appoinmentPrepareStyle2} onPress={() => this.navigateToBookAppointmentPage()} testID='navigateBookingPage'>
                      <Text style={styles.touchableText1}>{translate("Book Again")}	</Text>
                    </TouchableOpacity>
                  </Col>


                </Row>

                <View style={{ marginTop: 10 }}>
                  {data.appointment_status === 'CANCELED' || data.appointment_status === 'PROPOSED_NEW_TIME' ? data.status_update_reason != undefined &&
                    <View style={styles.rowSubText1}>
                      <Row style={styles.rowSubText}>
                        <Col style={{ width: '8%', paddingTop: 5 }}>
                          <Icon name="ios-document" style={{ fontSize: 20, }} />
                        </Col>

                        <Col style={{ width: '92%', paddingTop: 5 }}>
                          {data.appointment_status == 'PROPOSED_NEW_TIME' ?
                            <Text style={styles.innerSubText1}>
                              {data.status_updated_by.toLowerCase() === 'user' ? 'Proposed a new time by You' : 'Rescheudled a new Time by doctor'}</Text>
                            : null}
                          {data.appointment_status == 'CANCELED' ?
                            <Text style={styles.innerSubText1}>
                              {data.status_updated_by.toLowerCase() === 'user' ? 'Canceled by You' : ' Canceled by doctor'}</Text>
                            : null}
                          {/* <Text style={styles.innerSubText1}>{data.appointment_status=='PROPOSED_NEW_TIME'?'Reschedule by '+data.status_updated_by.toLowerCase():'Canceled by '+data.status_updated_by.toLowerCase()}</Text> */}
                          <Text note style={styles.subTextInner1}>{data.status_update_reason}</Text>
                        </Col>
                      </Row>
                      {data.previous_data != undefined && data.appointment_status === 'PROPOSED_NEW_TIME' &&
                        <Row style={styles.rowSubText}>
                          <Col style={{ width: '8%', paddingTop: 5 }}>
                            <Icon name="md-clock" style={{ fontSize: 20, }} />
                          </Col>
                          <Col style={{ width: '92%', paddingTop: 5 }}>
                            <Text style={styles.innerSubText1}>Previous Time</Text>

                            <Text note style={styles.subTextInner1}>{formatDate(data.previous_data.startDateTime, 'DD/MM/YYYY')}</Text>
                            <Text note style={styles.subTextInner1}>{formatDate(data.previous_data.startDateTime, 'hh:mm a') + formatDate(data.previous_data.endDateTime, '-hh:mm a')}</Text>
                          </Col>
                        </Row>
                      }
                    </View> : null}
                  {patDetailsDataObj && Object.keys(patDetailsDataObj).length ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-home" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>Patient  Details</Text>
                        <View >
                          <Row style={{ marginTop: 8, }}>
                            <Col size={8}>
                              <Row>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>1.</Text>
                                </Col>
                                <Col size={2}>
                                  <Text style={styles.commonText}>Name</Text>
                                </Col>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{patDetailsDataObj.patient_name}</Text>
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
                                  <Text style={styles.commonText}>Age</Text>
                                </Col>
                                <Col size={.5}>
                                  <Text style={styles.commonText}>-</Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{(patDetailsDataObj.patient_age) + ' - ' + (patDetailsDataObj.gender)}</Text>
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
                      <Text note style={styles.subTextInner1}>{data.disease_description || ''}</Text>
                    </Col>
                  </Row>

                  {data.patient_statment != undefined ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-create" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Patient Stament")}</Text>
                        <Text note style={styles.subTextInner1}>{data.disease_description}</Text>
                      </Col>
                    </Row> : null}
                  {data.location != undefined &&
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-pin" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Hospital")}</Text>
                        <Text style={styles.subTextInner1}>{getHospitalHeadeName(data.location[0])}</Text>
                        <Text note style={styles.subTextInner1}>{getHospitalName(data.location[0])}</Text>
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

                  {doctorData.language != undefined && doctorData.language.length != 0 ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-book" style={{ fontSize: 20, }} />
                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>{translate("Doctor spoken language")}</Text>
                        <Text note style={styles.subTextInner1}>{doctorData.language && doctorData.language.toString()}</Text>
                      </Col>
                    </Row> : null}
                  {data.is_emr_recorded !== undefined ?
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
                    </Row> : null}
                  <Row style={styles.rowSubText}>
                    <Col style={{ width: '8%', paddingTop: 5 }}>
                      <Icon name="ios-document" style={{ fontSize: 20, }} />
                    </Col>
                    <Col style={{ width: '92%', paddingTop: 5 }}>
                      <Text style={styles.innerSubText}>{translate("Payment Report")}</Text>
                      {reportData != null ?
                        <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                          <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: data._id, serviceType: 'appointment' }) }}>
                            <Text note style={[styles.subTextInner2, { marginLeft: 10 }]}>"You have raised Report for this appointment"</Text>
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
                                issueFor: { serviceType: 'APPOINTMENT', reportedId: data._id, status: data.appointment_status },
                                prevState: this.props.navigation.state
                              })
                            }}
                            block success
                            style={styles.reviewButton
                            }>
                            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                              {translate("Report Issue")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                    </Col>
                  </Row>
                  {(data.appointment_status == 'COMPLETED' && reviewData.length !== 0) || reviewData.length !== 0 ?
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
                    (data.appointment_status == 'COMPLETED' && reviewData.length == 0) || hasReviewButtonShow == true ?
                      <Row style={styles.rowSubText}>
                        <Col style={{ width: '8%', paddingTop: 5 }}>
                          <Icon name="ios-add-circle" style={{ fontSize: 20, }} />

                        </Col>
                        <Col style={{ width: '92%', paddingTop: 5 }}>
                          <Text style={styles.innerSubText}>{translate("Add Feedback")}</Text>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>

                              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>{translate("Add Feedback")} </Text>
                              <Icon name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></Icon>
                            </TouchableOpacity>
                          </View>
                        </Col>
                      </Row> : null
                  }


                  <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
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
                  </Row>
                </View>
              </Grid>
            </View>}
           { this.state.modalVisible===true?
              <InsertReview
                data={this.state.data}
                popupVisible={(data) => this.getvisble(data)}

              />:null}

              
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
                  <Text style={{ fontSize: 13, fontFamily: 'OpenSans', fontWeight: 'bold', marginTop: -5, color: '#FFF', marginLeft: -5 }}>{'Doctor has Rescheduled the appointment !'}</Text></CardItem>
                <Row style={{ justifyContent: 'center' }}>
                  <Col style={{ width: '25%' }}>
                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "DD/MM/YYYY") : null}</Text>
                  </Col>
                  <Col style={{ width: '75%' }}>
                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "hh:mm a") + formatDate(data.previous_data.endDateTime, "-hh:mm a") : null}</Text>
                  </Col>

                </Row>
                <Row style={{ justifyContent: 'center' }}>
                  <Col style={{ width: '30%' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_starttime, "DD/MM/YYYY")}</Text>
                  </Col>
                  <Col style={{ width: '70%' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_starttime, "hh:mm a") + formatDate(data.appointment_endtime, "-hh:mm a")}</Text>
                  </Col>

                </Row>
                <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>
                  <Col size={2}></Col>
                  <Col size={8} >
                    <Row>

                      <Col size={3} style={{ marginRight: 3 }}>
                        <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: '#775DA3' }}
                          onPress={() => this.SkipAction()} testID='confirmButton'>

                          <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'Skip'}</Text>
                        </TouchableOpacity>
                      </Col>
                      <Col size={3.4} style={{ marginRight: 3 }} >
                        <TouchableOpacity style={{ backgroundColor: '#6FC41A', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, }} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')} testID='confirmButton'>
                          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', color: '#fff' }}>{'ACCEPT'}</Text>
                        </TouchableOpacity>
                      </Col>
                      <Col size={3.6}>
                        <TouchableOpacity danger style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: 'red' }} onPress={() => this.navigateCancelAppoointment()} testID='cancelButton'>
                          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', color: '#fff' }}> {'CANCEL'}</Text>
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
    fontFamily: 'OpenSans',
    fontSize: 13,
    marginTop: 5,
    fontStyle: 'italic',
    width: '90%'
  },
  Textname: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    fontWeight: 'bold'
  },
  specialistTextStyle: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: 'normal',
    marginTop: 5

  },
  subText1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 'bold'
  },
  subText2: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    marginLeft: 5,
    color: '#4c4c4c'
  },
  subText3: {
    fontSize: 12,
    fontFamily: 'OpenSans',
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
    fontWeight: 'bold',
  },
  textApproved: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postponeButton: {
    // backgroundColor:'#4765FF',
    height: 25,
    padding: 8,
    borderRadius: 5
  },
  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: -10
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
    fontFamily: 'OpenSans',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4765FF',
    marginTop: 4,
    marginLeft: 5
  },
  touchableText1: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    fontWeight: 'bold',
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
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    marginBottom: 5
  },
  subTextInner1: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginBottom: 5,
    color: '#4c4c4c'
  },
  subTextInner2: {
    fontSize: 10,
    color: "red",
    fontFamily: 'OpenSans',
    marginBottom: 5
  },

  downText: {
    fontSize: 12,
    fontFamily: 'OpenSans',
  },
  cardItemText3: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    height: 30,
    fontWeight: 'bold',
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
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 10,
    fontStyle: 'italic',
    marginTop: -5
  },
  hospitalText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 15,
    width: "80%"
  },
  hosAddressText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 15,
    fontStyle: 'italic',
    width: "80%",
    marginTop: 5
  },
  cardItem2: {
    backgroundColor: '#784EBC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 10
  },
  cardItem3: {
    backgroundColor: '#784EBC',
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
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF'
  },
  subText: {
    fontFamily: 'Opensans',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 5
  },
  customHead:
  {
    fontFamily: 'OpenSans',
  },
  customText:
  {

    fontFamily: 'OpenSans',
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
    fontFamily: 'OpenSans',

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
    fontSize: 12
  },


  subtitlesText: {
    fontSize: 15,
    padding: 4,
    margin: 10,
    backgroundColor: '#FF9500',
    color: '#fff',
    width: 160,
    fontFamily: 'opensans-semibold',
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
    fontWeight: 'bold'

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
    fontFamily: 'OpenSans',
    fontSize: 10,
    padding: 5,
  },
  customTouch: {
    borderRadius: 5,
    height: 45,
    width: '30%',
    backgroundColor: '#775DA3',
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
    backgroundColor: '#775DA3',
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
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#7558e5',
    // marginBottom: 5
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#4c4c4c',
    fontWeight: '500'
  },
  bookAgain1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 'bold'
  },
  bookingButton: {
    marginTop: 10,
    backgroundColor: "#775DA3",
    marginRight: 1,
    borderRadius: 10,
    width: "auto",
    height: 30,
    color: "white",
    fontSize: 12,
    textAlign: "center"
  },
  appoinmentPrepareStyle2: {
    backgroundColor: "#775DA3",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5
  },


})

