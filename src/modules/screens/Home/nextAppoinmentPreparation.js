import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, Card, Input, Left, Right, Icon } from 'native-base';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { getUserAppointments, getMultipleDoctorDetails, getappointmentDetails } from "../../providers/bookappointment/bookappointment.action";
import { getName, getAllEducation, getAllSpecialist } from '../../common'
import { formatDate, addTimeUnit, getAllId } from "../../../setup/helpers";
import moment from 'moment';
import { NavigationEvents } from 'react-navigation'

class NextAppoinmentPreparation extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            AppoinmentData: {},
            updatedDate: '',
            AppointmentId: '',
            doctorInfo: {},
            appointmentDetails: [],
            skip: 0,
            limit: 1

        }

    }
    async componentDidMount() {
        try {
            await this.upCommingNextAppointment()
        } catch (ex) {
            console.log(ex)
        }
    }

    upCommingNextAppointment = async () => {
        try {

            let userId = await AsyncStorage.getItem("userId");
            let filters = {
                startDate: new Date().toUTCString(),
                endDate: addTimeUnit(new Date(), 1, "years").toUTCString(),
                skip: this.state.skip,
                limit: this.state.limit,
                sort: 1,
                prepareAppointment: 1
            };
            let upCommingAppointmentResult = await getUserAppointments(userId, filters);
            if (upCommingAppointmentResult.success) {
                upCommingAppointmentResult = upCommingAppointmentResult.data;
                let fullResult = upCommingAppointmentResult[0]
                let appointmentId = fullResult._id;
                let doctorInfo = fullResult.doctorInfo
                let dateData = formatDate(fullResult.doctorInfo.appointment_starttime, "dddd,MMMM DD-YYYY")
                let currentDate = new Date();
                let currentDataFormat = formatDate(currentDate.toISOString(), "dddd,MMMM DD-YYYY")
                currentDate.setDate(currentDate.getDate() + 1);
                let tomorrowDate = formatDate(currentDate.toISOString(), "dddd,MMMM DD-YYYY")
               let updatedDate = '';
                if (currentDataFormat == dateData) {
                    updatedDate =  "Today";
                } else if (tomorrowDate == dateData) {
                    updatedDate =  "Tomorrow";
                } else {
                    updatedDate = dateData;
                }
                this.setState({ 
                    AppoinmentData: upCommingAppointmentResult[0],
                    doctorInfo: doctorInfo, 
                    AppointmentId: appointmentId,
                    updatedDate: updatedDate
                })
            }
        } catch (e) {
            console.log(e);
        }
    };


    render() {
        const { AppoinmentData, updatedDate, AppointmentId, doctorInfo, appointmentDetails } = this.state
        const { navigation } = this.props;
        return (
            <View>
                {Object.keys(AppoinmentData).length != 0 ?
                    <View>
                        <Row style={{ marginTop: 10, marginBottom: 5 }}>
                            <Left>
                                <Text style={{

                                    fontFamily: 'OpenSans',
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }
                                }>You have an Appointment on {updatedDate}</Text>
                            </Left>
                        </Row>

                        <Card style={{ marginTop: 10 }}>
                            {AppoinmentData.agreed_for_send_forms === true ?
                                <TouchableOpacity>
                                    <Row style={{ height: 30, width: '100%', overflow: 'hidden', backgroundColor: "#8EC63F", }}>
                                        <Col style={{ width: '90%', justifyContent: 'center' }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 14,
                                                lineHeight: 20,
                                                marginLeft: 15,
                                                fontWeight: '500',
                                            }}>Your Appointment Schedule</Text>
                                        </Col>
                                        <Col style={{ width: '10%', justifyContent: 'center' }}>
                                            <Icon name="ios-information-circle-outline" style={{ color: '#fff', fontSize: 25 }} />
                                        </Col>
                                    </Row>

                                    <Row style={{ width: '100%', overflow: 'hidden', backgroundColor: "#fff", marginBottom: 10, marginTop: 10 }}>
                                        <Col style={{ width: '100%', justifyContent: 'center', }}>
                                            <Text style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                lineHeight: 20,
                                                marginLeft: 15,
                                                marginRight: 15,
                                                fontWeight: '500',
                                            }}>
                                                You  have  an  Appointment   with   {(AppoinmentData.prefix != undefined ? AppoinmentData.prefix + ' ' : '') + getName(AppoinmentData.doctorInfo)}  and  is  scheduled  at {formatDate(AppoinmentData.appointment_starttime, "hh:mm a")}.Get ready for your Appointment
                           </Text>

                                        </Col>
                                    </Row>

                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => { navigation.navigate('PrepareAppointmentWizard', { AppointmentId: AppointmentId, DoctorData: AppoinmentData, Data: doctorInfo }) }}>
                                    <Row style={{ height: 30, width: '100%', overflow: 'hidden', backgroundColor: "#8EC63F", }}>
                                        <Col style={{ width: '90%', justifyContent: 'center' }}>
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: 14,
                                                lineHeight: 20,
                                                marginLeft: 15,
                                                fontWeight: '500',
                                            }}>Your Appointment Schedule</Text>
                                        </Col>
                                        <Col style={{ width: '10%', justifyContent: 'center' }}>
                                            <Icon name="ios-information-circle-outline" style={{ color: '#fff', fontSize: 25 }} />
                                        </Col>
                                    </Row>

                                    <Row style={{ width: '100%', overflow: 'hidden', backgroundColor: "#fff", marginBottom: 10, marginTop: 10 }}>
                                        <Col style={{ width: '100%', justifyContent: 'center', }}>
                                            <Text style={{
                                                color: 'gray',
                                                fontSize: 14,
                                                lineHeight: 20,
                                                marginLeft: 15,
                                                marginRight: 15,
                                                fontWeight: '500',
                                            }}>
                                                You  have  an  Appointment   with   {(AppoinmentData.prefix != undefined ? AppoinmentData.prefix + ' ' : '') + getName(AppoinmentData.doctorInfo)}  and  is  scheduled  at {formatDate(AppoinmentData.appointment_starttime, "hh:mm a")}.Please  prepare  for  the  Appointment
                    </Text>

                                        </Col>
                                    </Row>

                                </TouchableOpacity>
                            }
                        </Card>
                    </View> :
                    null
                }
            </View>
        )
    }
}


function NextAppoinmentPreparationState(state) {

    return {
        bookappointment: state.bookappointment
    }
}
export default connect(NextAppoinmentPreparationState)(NextAppoinmentPreparation)