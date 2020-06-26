import React, { PureComponent } from 'react';
import { Container, Content, Text, Toast, Button, Card, Input, Left, Right, Icon } from 'native-base';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { getUserAppointments, getMultipleDoctorDetails,getappointmentDetails } from "../../providers/bookappointment/bookappointment.action";
import { getName, getAllEducation, getAllSpecialist } from '../../common'
import { formatDate, addTimeUnit, getAllId } from "../../../setup/helpers";
import moment from 'moment';
import { NavigationEvents } from 'react-navigation'

class NextAppoinmentPreparation extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            AppoinmentData: [],
            updatedDate: '',
            AppointmentId: '',
            doctorInfo: {},
            isLoading: false,
            appointmentDetails: []
        }

    }
    async componentDidMount() {
        try {
            await this.upCommingNextAppointment()
             this.getUserProfile();
        } catch (ex) {
            console.log(ex)
        }
    }

    upCommingNextAppointment = async () => {
        try {

            this.setState({ isLoading: true })

            let userId = await AsyncStorage.getItem("userId");

            let filters = {
                startDate: new Date().toUTCString(),
                endDate: addTimeUnit(new Date(), 1, "years").toUTCString(),
                on_going_appointment: true
            };

            // alert(JSON.stringify(userId))
            let upCommingAppointmentResult = await getUserAppointments(userId, filters);
            console.log('upcomming==================================');
            console.log(upCommingAppointmentResult)
            if (upCommingAppointmentResult.success) {
                let doctorInfo = new Map();
                upCommingAppointmentResult = upCommingAppointmentResult.data;

                let doctorIds = getAllId(upCommingAppointmentResult)
                let speciallistResult = await getMultipleDoctorDetails(doctorIds, "specialist,education,prefix,profile_image,gender");

                speciallistResult.data.forEach(doctorData => {
                    let educationDetails = ' ';
                    let speaciallistDetails = '';

                    if (doctorData.education != undefined) {
                        educationDetails = getAllEducation(doctorData.education)
                    }
                    if (doctorData.specialist != undefined) {
                        speaciallistDetails = getAllSpecialist(doctorData.specialist)
                    }

                    doctorInfo.set(doctorData.doctor_id, {
                        degree: educationDetails,
                        specialist: speaciallistDetails,
                        prefix: doctorData.prefix,
                        profile_image: doctorData.profile_image,
                        gender: doctorData.gender
                    })
                });

                let upcommingInfo = [];
                upCommingAppointmentResult.map(doctorData => {
                    let details = doctorInfo.get(doctorData.doctor_id)
                    upcommingInfo.push({
                        appointmentResult: doctorData,
                        specialist: details.specialist,
                        degree: details.degree,
                        prefix: details.prefix,
                        profile_image: details.profile_image
                    });
                })
                upcommingInfo.sort(function (firstVarlue, secandValue) {
                    return firstVarlue.appointmentResult.appointment_starttime < secandValue.appointmentResult.appointment_starttime ? -1 : 0
                })

                let getSingleData = upcommingInfo.slice(0, 1)
                this.setState({
                    upComingData: upcommingInfo,
                    AppoinmentData: getSingleData,
                    isLoading: false
                });

                const { AppoinmentData, updatedDate } = this.state

                //alert(JSON.stringify(this.state.AppoinmentData))
                let time = [...AppoinmentData]
                time.map((t) => {
                    let appointmentId = t.appointmentResult._id;
                    this.setState({ AppointmentId: appointmentId })
                    let doctorInfo = t.appointmentResult.doctorInfo
                    this.setState({ doctorInfo: doctorInfo })
                    let dateData = formatDate(t.appointmentResult.appointment_starttime, "dddd,MMMM DD-YYYY")
                    let currentDate = new Date();
                    let currentDataFormat = formatDate(currentDate.toISOString(), "dddd,MMMM DD-YYYY")
                    currentDate.setDate(currentDate.getDate() + 1);
                    let tomorrowDate = formatDate(currentDate.toISOString(), "dddd,MMMM DD-YYYY")
                    if (currentDataFormat == dateData) {
                        console.log("currentDate")
                        this.setState({ updatedDate: "Today" })
                    } else if (tomorrowDate == dateData) {
                        console.log("tomorrowDate")
                        this.setState({ updatedDate: "Tomorrow" })
                    } else {
                        console.log("how")
                        this.setState({ updatedDate: dateData })
                    }
                })

            }
        } catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    };



    getUserProfile = async () => {
        try {
          // const {data} = this.state
          let result = await getappointmentDetails(this.state.AppointmentId, prepareAppointment = 1);
          const resultData = result.data
         
          if (result) {
            this.setState({ appointmentDetails: resultData[0] });
         
    
          }
        }
        catch (e) {
          console.log(e);
        }
        finally {
          this.setState({ isLoading: false });
        }
      }





    render() {
        const { AppoinmentData, updatedDate, AppointmentId, doctorInfo,appointmentDetails } = this.state
        const { navigation} = this.props;
        return (
            <View>
                 {AppoinmentData.length != 0 ? 
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
                {appointmentDetails.agreed_for_send_forms != true ?
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
                        <FlatList
                            data={AppoinmentData}
                            extraData={AppoinmentData}
                            renderItem={({ item, index }) => (
                                <Row style={{ width: '100%', overflow: 'hidden', backgroundColor: "#fff", marginBottom: 10, marginTop: 10 }}>
                                    <Col style={{ width: '100%', justifyContent: 'center', }}>
                                        <Text style={{
                                            color: 'gray',
                                            fontSize: 14,
                                            lineHeight: 20,
                                            marginLeft: 15,
                                            marginRight: 15,
                                            fontWeight: '500',
                                        }}>You  have  an  Appointment   with   {(item.prefix != undefined ? item.prefix + ' ' : '') + getName(item.appointmentResult.doctorInfo)}  and  is  scheduled  at {formatDate(item.appointmentResult.appointment_starttime, "hh:mm a")}.Please  prepare  for  the  Appointment</Text>
                                      
                                    </Col>
                                </Row>
                            )} />
                    </TouchableOpacity>
                    :
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
                    <FlatList
                        data={AppoinmentData}
                        extraData={AppoinmentData}
                        renderItem={({ item, index }) => (
                            <Row style={{ width: '100%', overflow: 'hidden', backgroundColor: "#fff", marginBottom: 10, marginTop: 10 }}>
                                <Col style={{ width: '100%', justifyContent: 'center', }}>
                                    <Text style={{
                                        color: 'gray',
                                        fontSize: 14,
                                        lineHeight: 20,
                                        marginLeft: 15,
                                        marginRight: 15,
                                        fontWeight: '500',
                                    }}>You  have  an  Appointment   with   {(item.prefix != undefined ? item.prefix + ' ' : '') + getName(item.appointmentResult.doctorInfo)}  and  is  scheduled  at {formatDate(item.appointmentResult.appointment_starttime, "hh:mm a")}.Get ready for your Appointment</Text>
                                
                                </Col>
                            </Row>
                        )} />
                </TouchableOpacity>
    }
                </Card>
                </View>:
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