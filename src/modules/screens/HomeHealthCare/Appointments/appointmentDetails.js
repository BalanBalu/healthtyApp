import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon, CardItem } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Modal } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid'
import StarRating from 'react-native-star-rating';
import styles from '../Styles'
import { viewUserReviews, bindDoctorDetails, appointmentStatusUpdate, appointmentDetails, getPaymentInfomation } from '../../../providers/bookappointment/bookappointment.action';
import { renderDoctorImage, getUserGenderAndAge, getAllEducation, getAllSpecialist, getName, getDoctorExperience, getUserLocation, getAddress } from '../../../common'
import { formatDate, dateDiff, statusValue, getMoment } from '../../../../setup/helpers';
import { getUserRepportDetails } from '../../../providers/reportIssue/reportIssue.action';
import { getHomeTestappointmentByID, updateDocHomeTestappointment } from '../../../providers/homeHelthCare/action';
import Spinner from "../../../../components/Spinner";

class AppointmentDetails extends PureComponent {
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
            await this.setState({ appointmentId: appointmentId });
            await new Promise.all([
                this.appointmentDetailsGetById(),
                this.getUserReport(),
            ]);
        }
        else {
            let doctorId = appointmentData.doctor_id;
            let appointmentId = appointmentData._id;
            const selectedTab = navigation.getParam('selectedIndex');
            // this.props.navigation.setParams({ reportedId: appointmentId });


            await this.setState({
                data: appointmentData, doctorId: doctorId, appointmentId: appointmentId,
                userId: userId, selectedTab, isLoading: false
            })

            await new Promise.all([
                this.getPaymentInfo(appointmentData.payment_id),
                this.getDoctorDetails(),
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

    getDoctorDetails = async () => {
        try {
            this.setState({ isLoading: true })
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
            this.setState({ isLoading: false })
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false })
        }
    }

    getUserReport = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            let resultReport = await getUserRepportDetails('homeTestAppointment', userId, this.state.appointmentId);

            if (resultReport.success) {

                this.setState({ reportData: resultReport.data });
            }
        }

        catch (e) {
            console.error(e);
        }

    }
    updateAppointmentStatus = async (data, updatedStatus) => {
        try {
           
            this.setState({ isLoading: true });
            let requestData = {
                doctorId: data.doctor_id,
                userId: data.user_id,
                appointment_date: data.appointment_date,
                status: updatedStatus,
                statusUpdateReason: this.state.statusUpdateReason,
                status_by: 'USER'
            };
            let result = await updateDocHomeTestappointment(data._id, requestData);
            console.log("result", result);
           
            this.setState({ isLoading: false })

            if (result.success) {
                let temp = this.state.data
                temp.appointment_status = result.appointmentData.appointment_status
                Toast.show({
                    text: result.message,
                    duration: 3000
                })
                if (this.state.proposedVisible == true) {
                    this.setState({ proposedVisible: false });
                }

               await this.setState({ data: temp });
            }
        }
        catch (e) {
            console.log(e);
        }
    }


    appointmentDetailsGetById = async () => {
        try {
            this.setState({ isLoading: true })
            let result = await getHomeTestappointmentByID(this.state.appointmentId);
            if (result.success) {
                await this.setState({ doctorId: result.data[0].doctor_id, data: result.data[0] }),
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
            this.setState({ isLoading: false })
        }
        finally {
            this.setState({ isLoading: false })
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
    async navigateCancelAppoointment() {
        try {
            this.state.data.prefix = this.state.doctorData.prefix;
            await this.setState({ proposedVisible: false })
            this.props.navigation.navigate('Home Healthcare Cancel Appointment', { appointmentDetail: this.state.data })
        }
        catch (e) {
            console.log(e)
        }
    }
    async SkipAction() {
        await AsyncStorage.setItem(this.state.appointmentId, 'SKIP')

        this.setState({ proposedVisible: false })
    }


    render() {

        const { data, reviewData, reportData, doctorData, education, specialist, isLoading, selectedTab, paymentDetails, appointmentId } = this.state;
        const patDetailsData = data.patient_data;
        return (
            <Container>
                <Content style={{ margin: 10 }}>
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
                                            <Text style={{ textAlign: 'right', fontSize: 14, }} >{"Ref no :" + data.token_no}</Text> : null}
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
                                            <Text note style={styles.subTextInner1}>{data.disease_description}</Text>
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

                                    {patDetailsData && Object.keys(patDetailsData).length ?
                                        <Row style={styles.rowSubText}>
                                            <Col style={{ width: '8%', paddingTop: 5 }}>
                                                <Icon name="ios-pin" style={{ fontSize: 20, }} />
                                            </Col>
                                            <Col style={{ width: '92%', paddingTop: 5 }}>
                                                <Text style={styles.innerSubText}>Patient Details</Text>
                                                <FlatList
                                                    data={patDetailsData}
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
                                    {/* <Row style={styles.rowSubText}>
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
                                                style={styles.reviewButton} onPress={() => { this.props.navigation.navigate('ReportDetails', { reportedId: data._id, serviceType: 'HOME_TEST' }) }}>
                                                    <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                                                        Report Issue
                                                </Text>
                                                </TouchableOpacity>
                                            </View>}
                                        </Col>
                                    </Row> */}
                                    {/* <Row style={styles.rowSubText}>
                                        <Col style={{ width: '8%', paddingTop: 5 }}>
                                            <Icon name="ios-medkit" style={{ fontSize: 20, }} />
                                        </Col>
                                        <Col style={{ width: '92%', paddingTop: 5 }}>
                                            <Text style={styles.innerSubText}>Review</Text>

                                            <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                                disabled={false}
                                                maxStars={5}
                                            //   rating={reviewData[0] && reviewData[0].overall_rating}
                                            />
                                            <Text note style={styles.subTextInner1}>0</Text>
                                        </Col>
                                    </Row> */}
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount != undefined ? paymentDetails.amount : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount_paid != undefined ? paymentDetails.amount_paid : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{"Rs." + (paymentDetails.amount_due != undefined ? paymentDetails.amount_due : 0) + "/-"}</Text>
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
                                                    <Text note style={styles.downText}>{paymentDetails.payment_method || 0}</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </View>
                            </Grid>
                        </View>}
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
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.appointment_date, "DD/MM/YYYY") : null}</Text>
                                    </Col>
                                    {/* <Col style={{ width: '75%' }}>
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'red', textDecorationLine: 'line-through', textDecorationStyle: 'double', textDecorationColor: 'gray' }}>{data.previous_data ? formatDate(data.previous_data.startDateTime, "hh:mm a") + formatDate(data.previous_data.endDateTime, "-hh:mm a") : null}</Text>
                                    </Col> */}

                                </Row>
                                <Row style={{ justifyContent: 'center' }}>
                                    <Col style={{ width: '30%' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_date, "DD/MM/YYYY")}</Text>
                                    </Col>
                                    {/* <Col style={{ width: '70%' }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'OpenSans', textAlign: 'center', marginTop: 10, color: 'green' }}>{formatDate(data.appointment_starttime, "hh:mm a") + formatDate(data.appointment_endtime, "-hh:mm a")}</Text>
                                    </Col> */}

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