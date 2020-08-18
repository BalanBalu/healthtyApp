import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import { FlatList } from 'react-native-gesture-handler';
import { formatDate, addTimeUnit, subTimeUnit, statusValue } from "../../../../setup/helpers";
import { getUserRepportDetails } from '../../../providers/reportIssue/reportIssue.action';
import { updateLapAppointment, getLapTestPaymentDetails, getLabAppointmentById, getUserReviews } from "../../../providers/lab/lab.action"
import InsertReview from '../Reviews/insertReviews';
import { renderLabProfileImage } from "../../CommonAll/components"

class LabAppointmentInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      labTestCategoryInfo: '',
      upcomingTap: 0,
      paymentData: {},
      reviewData: [],
      reportData: null,
      isLoading: true,
      isAddReviewPopVisible: false,
      isReschedulePopVisible: false,
    }
    this.appointmentId = '';
  }

  async componentDidMount() {

    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
    console.log("appointmentData", appointmentData);
    if (appointmentData == undefined) {
      let appointmentId = navigation.getParam('serviceId')
      await new Promise.all([
        this.getAppointmentById(appointmentId),
        this.getUserReviews(),
        this.getUserReport(),

      ])
    }
    else {
      this.initialFunction(appointmentData);
    }
    this.setState({ isLoading: false });
  }

  initialFunction = async (appointmentData) => {
    this.appointmentId = appointmentData._id;
    const upcomingTap = this.props.navigation.getParam('selectedIndex');
    this.setState({ data: appointmentData, upcomingTap })
    await new Promise.all([
      this.getLapTestPaymentInfo(appointmentData.payment_id),
      this.getUserReviews(),
      this.getUserReport(),

    ])

    if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
      this.setState({ isAddReviewPopVisible: true })
    }
    const checkProposedNewTime = await AsyncStorage.getItem(this.appointmentId);
    if (appointmentData.appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime != 'SKIP') {
      this.setState({ isReschedulePopVisible: true })
    }
  }

  getAppointmentById = async (appointmentId) => {

    try {
      let result = await getLabAppointmentById(appointmentId)
      if (result.success) {
        await this.setState({ data: result.data[0], isLoading: true });
        await this.getLapTestPaymentInfo(result.data[0].payment_id)

        if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
          this.setState({ isAddReviewPopVisible: true })
        }
        const checkProposedNewTime = await AsyncStorage.getItem(this.appointmentId);
        if (appointmentData.appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime != 'SKIP') {
          this.setState({ isReschedulePopVisible: true })
        }
      }
    }
    catch (e) {
      console.log(e)
    }
    finally {
      await this.setState({ isLoading: true });
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

  getUserReport = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      let resultReport = await getUserRepportDetails('labAppointment', userId, this.appointmentId);
      if (resultReport.success) {
        this.setState({ reportData: resultReport.data });
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  getUserReviews = async () => {
    try {
      let reviewResult = await getUserReviews('appointment', this.appointmentId)
      if (reviewResult.success) {
        this.setState({ reviewData: reviewResult.data });
      }

    }
    catch (e) {
      console.error(e);
    }
  }

  navigateAddReview() {
    this.setState({
      isAddReviewPopVisible: true
    });

  }

  async getvisble(val) {
    this.setState({ isAddReviewPopVisible: false });
    if (val.updatedVisible == true) {
      this.getUserReviews()
    }
  }
  async navigateCancelAppoointment() {
    try {
      await this.setState({ isReschedulePopVisible: false });
      this.props.navigation.navigate('LabCancelAppointment', { appointmentData: this.state.data })
    }
    catch (e) {
      console.log(e)
    }
  }
  async skipAction() {
    await AsyncStorage.setItem(this.appointmentId, 'SKIP');
    this.setState({ isReschedulePopVisible: false })
  }

  async navigateLabConfirmation() {
    try {
      const { data } = this.state;
      this.packageDetails = {
        appointment_id: data._id,
        availability_id: data.availability_id,
        lab_id: data.lab_id,
        lab_test_categories_id: data.lab_test_categories_id,
        lab_test_descriptiion: data.lab_test_descriptiion,
        fee: data.fee,
        lab_name: data.labInfo.lab_name,
        appointment_status: data.appointment_status,
        category_name: data.labCategoryInfo.category_name,
        extra_charges: data.labInfo.extra_charges,
        appointment_starttime: data.appointment_starttime,
        mobile_no: data.labInfo.mobile_no,
        location: data.labInfo.location
      }
      this.props.navigation.navigate('labConfirmation', { packageDetails: this.packageDetails })
    }
    catch (e) {
      console.log(e)
    }
  }


  updateLabAppointmentStatus = async (data, updatedStatus) => {
    try {
      this.setState({ isLoading: true });
      let userId = await AsyncStorage.getItem('userId');
      let requestData = {
        labId: data.lab_id,
        userId: userId,
        startTime: data.appointment_starttime,
        status: updatedStatus,
        statusUpdateReason: this.state.statusUpdateReason,
        status_by: 'USER'
      };

      let result = await updateLapAppointment(data._id, requestData);
      this.setState({ isLoading: false })
      if (result.success) {
        let temp = this.state.data
        temp.appointment_status = result.appointmentData.appointment_status
        Toast.show({
          text: result.message,
          duration: 3000
        })
        if (this.state.isReschedulePopVisible == true) {
          this.setState({ isReschedulePopVisible: false });
        }
        this.setState({ data: temp });
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  getLapTestPaymentInfo = async (paymentId) => {
    try {
      let result = await getLapTestPaymentDetails(paymentId);
      if (result.success) {
        this.setState({ paymentData: result.data[0] })
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  render() {
    const { data, upcomingTap, paymentData, reportData, reviewData } = this.state
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <View style={{ marginBottom: 20 }}>
            <Card style={{
              borderRadius: 10,
            }}>
              <NavigationEvents
                onWillFocus={payload => { this.backNavigation(payload) }}
              />
              <CardItem header style={styles.cardItem}>
                <Grid>
                  <Text style={{ textAlign: 'right', fontSize: 14, marginTop: -15 }}>{"Ref no :" + data.token_no}</Text>
                  <Row>
                    <Col style={{ width: '25%', }}>

                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderLabProfileImage(data.labInfo && data.labInfo), title: 'Profile photo' })}>
                        <Thumbnail circle source={renderLabProfileImage(data.labInfo && data.labInfo)} style={{ height: 60, width: 60 }} />
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '80%', marginTop: 10 }}>
                      <Row>
                        <Col size={9}>
                          <Text style={styles.Textname} >{data.labInfo && data.labInfo.lab_name}</Text>
                          <Text style={{ fontSize: 12, fontFamily: 'OpenSans', fontWeight: 'normal' }}>{data.labCategoryInfo && data.labCategoryInfo.category_name}</Text>
                        </Col>
                        <Col size={1}>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
              <Grid>
                <Row>
                  <Col size={6}>
                    <Row style={{ marginLeft: 5 }} >
                      <Text style={styles.subText1}>Consultation Fee</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>{data.fee}</Text>
                    </Row>
                    <Row style={{ marginTop: 10, marginLeft: 5 }}>
                      <Text style={styles.subText1}>Payment Method</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>{paymentData ? paymentData.payment_method : 0}</Text>
                    </Row>
                  </Col>
                  {data.appointment_status != undefined ?
                    <Col size={3}>

                      <View style={{ alignItems: 'center', marginLeft: -25 }}>
                        <Icon name={statusValue[data.appointment_status].icon}
                          style={{
                            color: statusValue[data.appointment_status].color,
                            fontSize: 35
                          }} />

                        <Text capitalise={true} style={[styles.textApproved, { color: statusValue[data.appointment_status].color }]}>{data.appointment_status == "PAYMENT_IN_PROGRESS" ? 'PAYMENT IN PROGRESS' : data.appointment_status == "PAYMENT_FAILED" ? 'PAYMENT FAILED' : data.appointment_status == "PROPOSED_NEW_TIME" ? "PROPOSED NEW TIME" : data.appointment_status}</Text>
                      </View>
                    </Col> : null
                  }
                </Row>

                {upcomingTap == 0 ? (data.appointment_status == 'APPROVED' || this.state.appointmentStatus === 'APPROVED' || data.appointment_status == 'PENDING') ?
                  <Row>
                    <Col size={7}>
                      <Row style={{ marginTop: 10 }}>
                        <Text note style={styles.subText3}>Do you need to cancel this appointment ?</Text>
                      </Row>
                    </Col>
                    <Col size={3}>
                      <Row style={{ marginTop: 10 }}>
                        <Button danger style={[styles.postponeButton]} onPress={() => this.navigateCancelAppoointment()}>
                          <Text capitalise={true} style={styles.ButtonText}>CANCEL</Text>
                        </Button>
                      </Row>
                    </Col>
                  </Row> :
                  data.appointment_status == 'PAYMENT_FAILED' || data.appointment_status == 'PAYMENT_IN_PROGRESS' ?
                    <Row>
                      <Col size={7}>
                        <Row style={{ marginTop: 10 }}>
                          <Text note style={styles.subText3}>Do you need to retry this appointment ?</Text>
                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ marginTop: 10 }}>
                          <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.navigateLabConfirmation()}>
                            <Text capitalise={true} style={styles.ButtonText}>RETRY</Text>
                          </Button>
                        </Row>
                      </Col>
                    </Row> :
                    data.appointment_status == 'PROPOSED_NEW_TIME' ?
                      <Row>
                        <Col size={4}>
                          <Row style={{ marginTop: 10 }}>

                            <Text note style={styles.subText3}>Do you want to accept ?</Text>

                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A',marginLeft:25 }]} onPress={() => this.updateLabAppointmentStatus(data, 'APPROVED')}>
                              <Text style={styles.ButtonText}>ACCEPT</Text>
                            </Button>
                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ marginTop: 10 }}>
                            <Button danger style={[styles.postponeButton, {marginLeft: 20 }]} onPress={() => this.navigateCancelAppoointment()}>
                              <Text capitalise={true} style={styles.ButtonText}>CANCEL</Text>
                            </Button>
                          </Row>
                        </Col></Row> : null : null}

              </Grid>

              <CardItem footer style={styles.cardItem2}>
                <Grid>
                  <Row style={{ height: 25, marginRight: 5, justifyContent: 'center' }} >
                    <Col style={{ width: '50%', justifyContent: 'center' }}>
                      <Row style={{ alignItems: 'center' }}>
                        <Icon name='md-calendar' style={styles.iconStyle} />
                        <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'DD MMM,YYYY')}</Text>
                      </Row>
                    </Col>
                    <Col style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="md-clock" style={styles.iconStyle} />
                        <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'hh:mm a')}</Text>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
            </Card>

            <Grid>
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
                            {data.status_updated_by.toLowerCase() === 'user' ? 'Proposed a new time by You' : 'Rescheudled a new Time by Lab'}</Text>
                          : null}
                        {data.appointment_status == 'CANCELED' ?
                          <Text style={styles.innerSubText1}>
                            {data.status_updated_by.toLowerCase() === 'user' ? 'Canceled by You' : ' Canceled by Lab'}</Text>
                          : null}
                       
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
                          <Text note style={styles.subTextInner1}>{formatDate(data.previous_data.startDateTime, 'hh:mm a')}</Text>
                        </Col>
                      </Row>
                    }
                  </View> : null}
                <Row style={styles.rowSubText}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-flask" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Patient Details</Text>
                  </Col>
                </Row>
                <FlatList
                  data={data.patient_data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) =>
                    <View style={styles.commonView}>
                      <Row>
                        <Col size={1.5}>
                          <Text style={styles.commonText}>Name </Text>

                        </Col>
                        <Col size={0.5}>
                          <Text style={styles.commonText}>-</Text>

                        </Col>
                        <Col size={8}>
                          <Text note style={styles.commonText}>{item.patient_name}</Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col size={1.5}>
                          <Text style={styles.commonText}>Age</Text>

                        </Col>
                        <Col size={0.5}>
                          <Text style={styles.commonText}>-</Text>

                        </Col>
                        <Col size={8}>
                          <Text note style={styles.commonText}>{item.patient_age} years</Text>
                        </Col>
                      </Row>
                    </View>

                  } />
                <Row style={[styles.rowSubText, { borderTopColor: '#909090', borderTopWidth: 0.3, paddingTop: 10 }]}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-flask" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Lab Test</Text>
                    <Text note style={styles.subTextInner1}>{data.labCategoryInfo && data.labCategoryInfo.category_name}</Text>
                  </Col>
                </Row>

                <Row style={[styles.rowSubText, { borderTopColor: '#909090', borderTopWidth: 0.3, paddingTop: 10 }]}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-pin" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Pick Up at Lab</Text>
                    <Text style={[styles.commonText, { color: '#4c4c4c', marginTop: 5 }]}>{data.labInfo && data.labInfo.lab_name}</Text>
                    <Text note style={[styles.subTextInner1, { marginTop: 10 }]}>{(data.labInfo && data.labInfo.location && data.labInfo.location.address.no_and_street) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.address_line_1) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.district) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.city) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.state) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.country) + ',' +
                      (data.labInfo && data.labInfo.location && data.labInfo.location.address.pin_code)}</Text>
                  </Col>
                </Row>

                <Row style={styles.rowSubText}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-document" style={{ fontSize: 20, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Payment Report</Text>
                    {reportData != null ?
                      <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: data._id, serviceType: 'LAB_TEST' }) }}>
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
                              issueFor: { serviceType: 'LAB_TEST', reportedId: data._id, status: data.appointment_status },
                              prevState: this.props.navigation.state
                            })
                          }}
                          block success
                          style={styles.reviewButton
                          }>
                          <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                            Report Issue
                        </Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </Col>
                </Row>

                {reviewData.length !== 0 ?
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
                  reviewData.length == 0 ?
                    <Row style={styles.rowSubText}>
                      <Col style={{ width: '8%', paddingTop: 5 }}>
                        <Icon name="ios-add-circle" style={{ fontSize: 20, }} />

                      </Col>
                      <Col style={{ width: '92%', paddingTop: 5 }}>
                        <Text style={styles.innerSubText}>Add Feedback</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                          <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>

                            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}> ADD FEEDBACK </Text>
                            <Icon name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></Icon>
                          </TouchableOpacity>
                        </View>
                      </Col>
                    </Row> : null
                }


                <Row style={styles.rowStyles}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-cash" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Payment Info</Text>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Total Fee
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>{"Rs." + (paymentData.amount != undefined ? paymentData.amount : 0)}</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Made
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>{"Rs." + (paymentData.amount_paid != undefined ? paymentData.amount_paid : 0)}</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Due
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>{"Rs." + (paymentData.amount_due != undefined ? paymentData.amount_due : 0)}</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Method
              </Text></Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>{paymentData ? paymentData.payment_method : 0}</Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
              {this.state.isVisibleAddReviewPop === true ?
                <InsertReview
                  data={this.state.data}
                  popupVisible={(data) => this.getvisble(data)}
                /> : null}
              <View style={{ height: 300, position: 'absolute', bottom: 0 }}>
                <Modal
                  visible={this.state.isReschedulePopVisible}
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
                        <Text style={{ fontSize: 13, fontFamily: 'OpenSans', fontWeight: 'bold', marginTop: -5, color: '#FFF', marginLeft: -5 }}>{'Lab has Rescheduled the appointment !'}</Text></CardItem>
                      <Row style={{ justifyContent: 'center' }}>
                        <Col style={{ width: '25%' }}>
                          <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "DD/MM/YYYY") : null}</Text>
                        </Col>
                        <Col style={{ width: '75%' }}>
                          <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "hh:mm a") : null}</Text>
                        </Col>

                      </Row>
                      <Row style={{ justifyContent: 'center' }}>
                        <Col style={{ width: '30%' }}>
                          <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_starttime, "DD/MM/YYYY")}</Text>
                        </Col>
                        <Col style={{ width: '70%' }}>
                          <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_starttime, "hh:mm a")}</Text>
                        </Col>

                      </Row>
                      <Row style={{ marginTop: 15, justifyContent: 'flex-end', marginBottom: 15 }}>
                        <Col size={2}></Col>
                        <Col size={8} >
                          <Row>

                            <Col size={3} style={{ marginRight: 3 }}>
                              <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, backgroundColor: '#775DA3' }}
                                onPress={() => this.skipAction()} testID='confirmButton'>

                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, textAlign: 'center', color: '#fff' }}>{'Skip'}</Text>
                              </TouchableOpacity>
                            </Col>
                            <Col size={3.4} style={{ marginRight: 3 }} >
                              <TouchableOpacity style={{ backgroundColor: '#6FC41A', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2, borderRadius: 5, }} onPress={() => this.updateLabAppointmentStatus(data, 'APPROVED')} testID='confirmButton'>
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

              </View>
            </Grid>
          </View>

        </Content>
      </Container>


    )

  }
}

export default LabAppointmentInfo


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
    height: 100,
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
    marginLeft: 5
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
  postponeButton2: {
    // backgroundColor:'#4765FF',
    paddingLeft: 26.5,
    paddingRight: 26.5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5
  },
  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
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
    marginTop: 20
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
  },
  subTextInner1: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 5
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
    marginBottom: -10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    height: 35,
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
    marginTop: 5
    // marginBottom: 5
  },
  commonView: {
    borderRadius: 5,
    borderColor: '#909090',
    borderWidth: 0.3,
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  rowStyles: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderTopColor: '#909090',
    borderTopWidth: 0.3,
    paddingTop: 10
  }


})

