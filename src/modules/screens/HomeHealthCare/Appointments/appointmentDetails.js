import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon, CardItem } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Modal } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
import StarRating from 'react-native-star-rating';
import styles from '../Styles'
import { NavigationEvents } from 'react-navigation';
import { viewUserReviews, bindDoctorDetails, getPaymentInfomation } from '../../../providers/bookappointment/bookappointment.action';
import { renderDoctorImage, getUserGenderAndAge, getAllEducation, getAllSpecialist, getName, getDoctorExperience, getUserLocation, getAddress } from '../../../common'
import { formatDate, dateDiff, statusValue, getMoment } from '../../../../setup/helpers';
import { getUserRepportDetails } from '../../../providers/reportIssue/reportIssue.action';
import { getHomeTestappointmentByID, updateDocHomeTestappointment } from '../../../providers/homeHelthCare/action';
import Spinner from "../../../../components/Spinner";
import InsertReview from '../Reviews/insertReviews';
import { RenderProposeNewPopPage } from '../../CommonAll/components';
const DOCTOR_FIELDS = 'prefix,education,specialist,experience,language,professional_statement,profile_image';

class AppointmentDetails extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            reviewData: [],
            reportData: null,
            doctorData: {},
            isLoading: true,
            education: '',
            specialist: '',
            selectedTab: 0,
            paymentDetailsObj: {},
            isVisibleAddReviewPop: false,
            isVisibleProposePop: false,
        }
        this.appointmentId = '';
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const appointmentData = navigation.getParam('data');
        if (appointmentData == undefined) {
            const appointmentId = navigation.getParam('serviceId');
            this.appointmentId = appointmentId;
            await new Promise.all([
                this.appointmentDetailsGetById(appointmentId),
                this.getUserReport(),
                this.getUserReviews(),
            ]);
        }
        else {
            this.exeWhenHaveAppointmentData(appointmentData);
        }
        this.setState({ isLoading: false });
    }

    exeWhenHaveAppointmentData = async (appointmentData) => {
        const doctorId = appointmentData.doctor_id;
        this.appointmentId = appointmentData._id;
        const selectedTab = this.props.navigation.getParam('selectedIndex');
        // this.props.navigation.setParams({ reportedId: appointmentId });
        await this.setState({ data: appointmentData, selectedTab });
        await new Promise.all([
            this.getPaymentInfo(appointmentData.payment_id),
            this.getDoctorDetails(doctorId),
            this.getUserReport(),
            this.getUserReviews(),
        ])
        if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
            this.setState({ isVisibleAddReviewPop: true })
        }
        const checkProposedNewTime = await AsyncStorage.getItem(this.appointmentId);
        if (appointmentData.appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime != 'SKIP') {
            this.setState({ isVisibleProposePop: true })
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

    getDoctorDetails = async (doctorId) => {
        try {
            const docDetailsResp = await bindDoctorDetails(doctorId, DOCTOR_FIELDS);
            if (docDetailsResp.success) {
                if (docDetailsResp.data.education != undefined) {
                    var educationData = getAllEducation(docDetailsResp.data.education)
                }
                if (docDetailsResp.data.specialist != undefined) {
                    var specialistData = getAllSpecialist(docDetailsResp.data.specialist)
                }
                this.setState({
                    education: educationData || '',
                    doctorData: docDetailsResp.data,
                    specialist: specialistData.toString() || '',
                })
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    getUserReport = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const reportResp = await getUserRepportDetails('homeTestAppointment', userId, this.appointmentId);
            if (reportResp.success) {
                this.setState({ reportData: reportResp.data });
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    getUserReviews = async () => {
        try {
            const reviewsResp = await viewUserReviews('appointment', this.appointmentId, '?skip=0');
            if (reviewsResp.success) {
                this.setState({ reviewData: reviewsResp.data });
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    insertReviewPopVisible = async (data) => {
        this.setState({ isVisibleAddReviewPop: false });
        if (data.updatedVisible == true) await this.getUserReviews();
    }
    onPressUpdateAppointmentStatus = async (data, updatingStatus) => {
        try {
            this.setState({ isLoading: true });
            const reqAppointmentData = {
                doctorId: data.doctor_id,
                userId: data.user_id,
                appointment_date: data.appointment_date,
                status: updatingStatus,
                statusUpdateReason: data.status_update_reason,
                status_by: 'USER'
            };
            const updateResp = await updateDocHomeTestappointment(data._id, reqAppointmentData);
            alert(JSON.stringify(updateResp));
            if (updateResp.success) {
                const baCupOfAppointmentData = this.state.data;
                baCupOfAppointmentData.appointment_status = updateResp.appointmentData.appointment_status;
                Toast.show({
                    text: updateResp.message,
                    duration: 3000
                })
                if (this.state.isVisibleProposePop == true) {
                    this.setState({ isVisibleProposePop: false });
                }
                await this.setState({ data: baCupOfAppointmentData });
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false })
        }
    }


    appointmentDetailsGetById = async (appointmentId) => {
        try {
            let appointmentResp = await getHomeTestappointmentByID(appointmentId);
            if (appointmentResp.success) {
                const appointmentData = appointmentResp.data[0];
                const doctorId = appointmentData.doctor_id;
                await this.setState({ data: appointmentData }),
                    await new Promise.all([
                        this.getDoctorDetails(doctorId),
                        this.getPaymentInfo(appointmentData.payment_id)])


                if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
                    await this.setState({ isVisibleAddReviewPop: true })
                }
                let checkProposedNewTime = await AsyncStorage.getItem(this.appointmentId)
                if (appointmentData.appointment_status == 'PROPOSED_NEW_TIME' && checkProposedNewTime !== 'SKIP') {
                    await this.setState({ isVisibleProposePop: true })
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    getPaymentInfo = async (paymentId) => {
        try {
            const paymentResp = await getPaymentInfomation(paymentId);
            if (paymentResp.success) {
                this.setState({ paymentDetailsObj: paymentResp.data[0] });
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async onPressNavigateToCancelAppointment() {
        try {
            this.state.data.prefix = this.state.doctorData.prefix;
            await this.setState({ isVisibleProposePop: false });
            this.props.navigation.navigate('Home Healthcare Cancel Appointment', { appointmentDetail: this.state.data });
        }
        catch (e) {
            console.log(e)
        }
    }
    async skipAction() {
        await AsyncStorage.setItem(this.appointmentId, 'SKIP');
        this.setState({ isVisibleProposePop: false })
    }


    render() {
        const { data, reviewData, reportData, doctorData, education, specialist, isLoading, selectedTab, paymentDetailsObj, appointmentId } = this.state;
        return (
            <Container>
                <Content style={{ margin: 10 }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }}
                    />
                    {isLoading == true ?
                        (
                            <Spinner
                                color="blue"
                                style={[styles.containers, styles.horizontal]}
                                visible={true}
                                size={"large"}
                                overlayColor="none"
                                cancelable={false}
                            />
                        ) :
                        <View style={{ marginBottom: 20 }}>
                            <Card style={{
                                borderRadius: 10,
                            }}>
                                <Grid style={styles.cardItem}>
                                    <Row style={{ justifyContent: 'flex-end', marginRight: 10, marginTop: 10 }}>
                                        {data.token_no ?
                                            <Text style={{ textAlign: 'right', fontSize: 14, }} >{"Ref no : " + data.token_no}</Text> : null}
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
                                                    <Text style={styles.specialistTextStyle}>{specialist}</Text>
                                                </Col>
                                                <Col size={1}>
                                                </Col>
                                            </Row>
                                            <Row style={{ alignSelf: 'flex-start' }}>
                                            </Row>
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
                                                <Text note style={styles.subText2}>{paymentDetailsObj.payment_method || 0}</Text>
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
                                    {selectedTab == 0 ? data.onGoingAppointment !== true && (data.appointment_status == 'APPROVED' || data.appointment_status == 'PENDING') ?
                                        <Row>
                                            <Col size={7}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Text note style={styles.subText3}>Do you need to cancel this appointment ?</Text>
                                                </Row>
                                            </Col>
                                            <Col size={3}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Button danger style={[styles.postponeButton]} onPress={() => this.onPressNavigateToCancelAppointment()}>
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
                                                        <Button style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.onPressUpdateAppointmentStatus(data, 'APPROVED')}>
                                                            <Text style={styles.ButtonText}>ACCEPT</Text>
                                                        </Button>
                                                    </Row>
                                                </Col>
                                                <Col size={3}>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <Button danger style={[styles.postponeButton]} onPress={() => this.onPressNavigateToCancelAppointment()}>
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
                                                    <Text style={styles.timeText}>{formatDate(data.appointment_date, "dddd,MMMM DD-YYYY")}</Text>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </CardItem>
                            </Card>
                            <Grid>
                                {/* <Row style={styles.rowStyle}>
                                    <Col size={6}>
                                        <TouchableOpacity style={styles.appoinmentPrepareStyle} onPress={() => { this.props.navigation.navigate('PrepareAppointmentWizard', { AppointmentId: appointmentId, DoctorData: doctorData, Data: data.doctorInfo }) }}>
                                            <Text style={styles.touchableText1}>Appointment Preparation</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col size={4} style={{ marginLeft: 5 }}>
                                        <TouchableOpacity style={styles.appoinmentPrepareStyle2} onPress={() => this.navigateToBookAppointmentPage()} testID='navigateBookingPage'>
                                            <Text style={styles.touchableText1}>Book Again</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row> */}
                                <View style={{ marginTop: 10 }}>
                                    <Row style={styles.rowSubText}>
                                        <Col style={{ width: '8%', paddingTop: 5 }}>
                                            <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                                        </Col>
                                        <Col style={{ width: '92%', paddingTop: 5 }}>
                                            <Text style={styles.innerSubText}>Disease</Text>
                                            <Text note style={styles.subTextInner1}>{data.disease_description || ''}</Text>
                                        </Col>
                                    </Row>
                                    <Row style={styles.rowSubText}>
                                        <Col style={{ width: '8%', paddingTop: 5 }}>
                                            <Icon name="ios-pin" style={{ fontSize: 20, }} />
                                        </Col>
                                        <Col style={{ width: '92%', paddingTop: 5 }}>
                                            <Text style={styles.innerSubText}>Patient Address</Text>
                                            <Text note style={styles.subTextInner1}>{getUserLocation(data.userInfo)}</Text>
                                        </Col>
                                    </Row>
                                    {data.patient_data.length ?
                                        <Row style={styles.rowSubText}>
                                            <Col style={{ width: '8%', paddingTop: 5 }}>
                                                <Icon name="ios-pin" style={{ fontSize: 20, }} />
                                            </Col>
                                            <Col style={{ width: '92%', paddingTop: 5 }}>
                                                <Text style={styles.innerSubText}>Patient Details</Text>
                                                <FlatList
                                                    data={data.patient_data}
                                                    renderItem={({ item, index }) =>
                                                        <View style={styles.PatientDetailList} >
                                                            <Row >
                                                                <Col size={8}>
                                                                    <Row>
                                                                        <Col size={2}>
                                                                            <Text style={styles.commonText}>Name</Text>
                                                                        </Col>
                                                                        <Col size={.5}>
                                                                            <Text style={styles.commonText}>-</Text>
                                                                        </Col>
                                                                        <Col size={8}>
                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{item.patient_name}</Text>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col size={10}>
                                                                    <Row>
                                                                        <Col size={2}>
                                                                            <Text style={styles.commonText}>Age</Text>
                                                                        </Col>
                                                                        <Col size={.5}>
                                                                            <Text style={styles.commonText}>-</Text>
                                                                        </Col>
                                                                        <Col size={8}>
                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#4c4c4c' }}>{(item.patient_age) + ' - ' + getUserGenderAndAge(item)}</Text>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </View>
                                                    } />
                                            </Col>
                                        </Row> : null}
                                    <Row style={styles.rowSubText}>
                                        <Col style={{ width: '8%', paddingTop: 5 }}>
                                            <Icon name="ios-document" style={{ fontSize: 20, }} />
                                        </Col>
                                        <Col style={{ width: '92%', paddingTop: 5 }}>
                                            <Text style={styles.innerSubText}>Payment Report</Text>
                                            {reportData != null ?
                                                <View style={{ borderRadius: 5, borderColor: 'grey', borderWidth: 0.5, padding: 5 }} >
                                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: data._id, serviceType: 'HOME_TEST' }) }}>
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
                                                    <TouchableOpacity block success
                                                        style={styles.reviewButton} onPress={() => {
                                                            this.props.navigation.push('ReportIssue', {
                                                                issueFor: { serviceType: 'HOME_TEST', reportedId: data._id, status: data.appointment_status },
                                                                prevState: this.props.navigation.state
                                                            })
                                                        }}>
                                                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>Report Issue</Text>
                                                    </TouchableOpacity>
                                                </View>}
                                        </Col>
                                    </Row>
                                    {reviewData.length ?
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
                                        <Row style={styles.rowSubText}>
                                            <Col style={{ width: '8%', paddingTop: 5 }}>
                                                <Icon name="ios-add-circle" style={{ fontSize: 20, }} />
                                            </Col>
                                            <Col style={{ width: '92%', paddingTop: 5 }}>
                                                <Text style={styles.innerSubText}>Add Feedback"</Text>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.setState({ isVisibleAddReviewPop: true })}
                                                        testID='addFeedBack'>
                                                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>Add Feedback</Text>
                                                        <Icon name="create" style={{ fontSize: 20, marginTop: 3, marginLeft: 5, color: '#fff' }}></Icon>
                                                    </TouchableOpacity>
                                                </View>
                                            </Col>
                                        </Row>
                                    }
                                    <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                                        <Col style={{ width: '8%', paddingTop: 5 }}>
                                            <Icon name="ios-cash" style={{ fontSize: 20, }} />
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetailsObj.amount ? paymentDetailsObj.amount : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetailsObj.amount_paid ? paymentDetailsObj.amount_paid : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetailsObj.amount_due ? paymentDetailsObj.amount_due : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{paymentDetailsObj.payment_method || 0}</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </View>
                            </Grid>
                        </View>}
                    {this.state.isVisibleAddReviewPop === true ?
                        <InsertReview
                            data={data}
                            popupVisible={(data) => this.insertReviewPopVisible(data)}
                        /> : null}
                    <Modal
                        visible={this.state.isVisibleProposePop}
                        transparent={true}
                        animationType={'fade'}
                    >
                        <RenderProposeNewPopPage
                            data={data}
                            skipAction={() => { this.skipAction() }}
                            onPressUpdateAppointmentStatus={(data, updatingStatus) => { this.onPressUpdateAppointmentStatus(data, updatingStatus) }}
                            onPressNavigateToCancelAppointment={() => { this.onPressNavigateToCancelAppointment() }}
                        />
                    </Modal>
                </Content>
            </Container>
        )
    }
}

export default AppointmentDetails