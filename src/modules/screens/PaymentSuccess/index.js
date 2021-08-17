import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAppointmentDetailsById} from '../../providers/bookappointment/bookappointment.action';
import { ScrollView } from 'react-native-gesture-handler';
import { RenderHospitalAddress, renderDoctorImage, getAllSpecialist, getDoctorEducation } from '../../common';
import { ActivityIndicator} from "react-native";
import {primaryColor, secondaryColor} from '../../../setup/config'



class PaymentSuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            successBookSlotDetails: {

            },
            paymentMethod: null,
            tokenNo: null,
            fromNavigation: null,
            CorporateUser: false,
            data:{},
        }
        this.isFromHomeHealthCareConfirmation = false;
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        // const { navigation } = this.props;
        // const successBookSlotDetails = navigation.getParam('successBookSlotDetails');
       
        // const paymentMethod = navigation.getParam('paymentMethod');
        // const fromNavigation = navigation.getParam('fromNavigation') || null
        // const tokenNo = navigation.getParam('tokenNo');
        // this.isFromHomeHealthCareConfirmation = navigation.getParam('isFromHomeHealthCareConfirmation') || false;
        // await this.setState({ successBookSlotDetails: successBookSlotDetails, paymentMethod: paymentMethod, tokenNo, fromNavigation });
        this.getAppointmentDetails();
    }
    getAppointmentDetails =async ()=>{
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }
    onBackButtonPressed() {
        return true;
    }
    renderHospitalLocation(hospitalInfo) {
        return (
            <Row style={styles.rowDetail1}>
                <Text style={styles.mainText}>Address</Text>
                <Right>
                    <Text style={styles.subText}>{hospitalInfo.hospitalName}</Text>
                    <Text style={styles.address}>{hospitalInfo.address,',',hospitalInfo.address1}, {hospitalInfo.city}</Text>
                    <Text style={styles.address}>{hospitalInfo.state}, {hospitalInfo.pinCode}</Text>
                </Right>
            </Row>
        )
    }
    renderPatientLocation() {
        const { data } = this.state;
        co
        const p = successBookSlotDetails && successBookSlotDetails.patient_location && successBookSlotDetails.patient_location.address;
        if (patientAddress && Object.keys(patientAddress).length) {
            return (
                <Row style={styles.rowDetail1}>
                    <Text style={styles.mainText}>Address</Text>
                    <Right>
                        <Text style={styles.address}>{patientAddress.no_and_street ? patientAddress.no_and_street + ' ,' : ''} {patientAddress.city}</Text>
                        <Text style={styles.address}>{patientAddress.state}, {patientAddress.pin_code}</Text>
                    </Right>
                </Row>
            )
        }
        return null
    }

    async homePageRedirect() {
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
       
        this.setState({ CorporateUser: isCorporateUser })
        const { CorporateUser } = this.state
        if (CorporateUser === true) {
            this.props.navigation.navigate('CorporateHome');
        } else {
            this.props.navigation.navigate('Home');
        }
    }
    render() {
        const { navigation } = this.props;
        const data = navigation.getParam('appointmentDetails');
        const { successBookSlotDetails, paymentMethod, tokenNo, fromNavigation,isLoading } = this.state;
        return (
            <Container style={styles.container}>
                <ScrollView>
                    <Content style={styles.bodyContent}>
                        <Card style={styles.mainCard}>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <Icon name="checkmark-circle" style={styles.circleIcon} />
                            </View>
                            <Text style={styles.successHeading}>SUCCESS</Text>
                            <Text style={styles.subText}>Thank you for choosing our service ! We are grateful for the pleasure of serving you!</Text>

                            <Row style={{ borderTopColor: 'gray', borderTopWidth: 0.5, marginTop: 10, marginLeft: 10, padding: 15, marginRight: 10 }}>
                                <Col style={{ width: '25%', }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(data.doctorInfo), title: 'Profile photo' })}>
                                        <Thumbnail source={renderDoctorImage(data.doctorInfo)} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ width: '75%', marginTop: 10 }}>
                                    {data&&data.bookedFor === 'HOSPITAL' ?
                                        <Row style={styles.rowDetail1}>

                                            <Right>
                                                <Text style={styles.subText}>{data.hospitalInfo.hospitalName || ' '}</Text>
                                                <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{data.hospitalInfo.address,',',data.hospitalInfo.address1}, {data.hospitalInfo.city}</Text>
                                                <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{data.hospitalInfo.state}, {data.hospitalInfo.pinCode}</Text>
                                            </Right>
                                        </Row> :
                                        <Row>
                                            <Text style={styles.docHeading}>{data.doctorInfo.prefix ? data.doctorInfo.prefix : ''}.{data.doctorInfo.doctorName}{' '}
                                                <Text style={styles.Degree}>{getDoctorEducation(data.doctorInfo.education)}</Text> </Text>
                                        </Row>
                                    }
                                    <Row>
                                        <Text style={{ fontFamily: 'Roboto', fontSize: 14, color: '#535353', fontStyle: 'italic' }}>{getAllSpecialist(data.doctorInfo.specialist)}</Text>

                                    </Row>
                                </Col>
                            </Row>
                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Token Number</Text>
                                <Right>
                                    <Text style={styles.subText2 }> {data.tokenNo} </Text>
                                </Right>
                            </Row>
                            {data && this.isFromHomeHealthCareConfirmation === false ? this.renderHospitalLocation(data.hospitalInfo) : this.renderPatientLocation()}
                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Date</Text>
                                <Right>
                                    <Text style={styles.subText}> {
                                        this.isFromHomeHealthCareConfirmation === false ?
                                            formatDate(data.startTime, 'Do MMMM, YYYY') : data.startTime && formatDate(data.startTime, 'Do MMMM, YYYY')} </Text>
                                </Right>
                            </Row>
                            {this.isFromHomeHealthCareConfirmation === false ?
                                <Row style={styles.rowDetail}>
                                    <Text style={styles.mainText}>Time</Text>
                                    <Right>
                                        <Text style={styles.subText}> {data && formatDate(data.startTime, 'hh:mm A')} </Text>
                                    </Right>
                                </Row>
                                : null}
                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Doctor Fee</Text>
                                <Right>
                                    <Text style={styles.subText}>{'\u20B9'}{data && data.fee} </Text>

                                </Right>

                            </Row>

                            {/* Need To Discuss For Payment Details */}


                            {/* <Row style={{ marginTop: 15, marginLeft: 10, marginRight: 10, marginBottom: 10 }}>

                                <Text style={styles.mainText}>Payment Method </Text>

                                <Right>
                                    <Text style={styles.subText}>{paymentMethod||'Unknown'}</Text>

                                </Right>

                            </Row> */}
                        </Card>
                        <Button onPress={() => this.homePageRedirect()}
                            block style={{ marginTop: 5, borderRadius: 10, marginBottom: 10, backgroundColor: '#5bb85d' }}>
                            <Text style={styles.customizedText}> Home </Text>
                        </Button>

                    </Content>
                </ScrollView>
            </Container>

        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(PaymentSuccess)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 10

    },
    customizedText: {
        fontFamily: 'opensans-bold',
        fontSize: 20,
        color: '#fff'
    },
    userImage:
    {
        height: 60,
        width: 60,
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        borderColor: '#f1f1f1',
        borderWidth: 5,

    },
    mainCard: {
        borderRadius: 10,
    },
    circleIcon: {
        color: '#5cb75d',
        fontSize: 60
    },
    successHeading: {
        textAlign: 'center',
        fontFamily: 'opensans-bold',
        fontSize: 18,
    },
    subText: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 14,
        marginTop: 0,
        color: '#535353',
        marginLeft: 20,
        marginRight: 20
    },
    address:{   
        marginTop: -5,
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'center', 
        fontFamily: 'Roboto', 
        fontSize: 14, 
        color: '#7B7B7B', 
        fontStyle: 'italic' 
    },
    docHeading: {
        fontFamily: 'opensans-bold',
        fontSize: 16,

    },
    Degree: {
        fontFamily: 'opensans-bold',
        fontSize: 14,
        marginTop: 8,

    },
    rowDetail: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    rowDetail1: {
        marginLeft: 10,
        marginRight: 10
    },
    mainText: {
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
        fontSize: 16,
    },
    subText2: {
        textAlign: 'center',
        fontFamily: 'opensans-bold',
        fontSize: 14,
        marginTop: 0,
        color: '#535353',
        marginLeft: 20,
        marginRight: 20
    },

});