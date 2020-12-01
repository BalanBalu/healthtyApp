import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, BackHandler, AsyncStorage } from 'react-native';
import { formatDate } from '../../../setup/helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { RenderHospitalAddress, renderDoctorImage, getDoctorSpecialist, getDoctorEducation } from '../../common'


class PaymentSuccess extends Component {
    constructor(props) {
        super(props)

        this.state = {
            successBookSlotDetails: {

            },
            paymentMethod: null,
            tokenNo: null,
            fromNavigation: null,
            CorporateUser: false


        }
        this.isFromHomeHealthCareConfirmation = false;
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        const { navigation } = this.props;
        const successBookSlotDetails = navigation.getParam('successBookSlotDetails');
        console.log(successBookSlotDetails);
        const paymentMethod = navigation.getParam('paymentMethod');
        const fromNavigation = navigation.getParam('fromNavigation') || null
        const tokenNo = navigation.getParam('tokenNo');
        this.isFromHomeHealthCareConfirmation = navigation.getParam('isFromHomeHealthCareConfirmation') || false;
        this.patientInfo = navigation.getParam('patientInfo') || null;
        await this.setState({ successBookSlotDetails: successBookSlotDetails, paymentMethod: paymentMethod, tokenNo, fromNavigation });
        console.log(paymentMethod);

    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }
    onBackButtonPressed() {
        return true;
    }
    renderHospitalLocation(hospitalAddress) {

        return (
            <Row style={styles.rowDetail1}>
                <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 16 }}>Address</Text>
                <Right>
                    <Text style={styles.subText}>{hospitalAddress.name}</Text>
                    <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{hospitalAddress.location.address.no_and_street}, {hospitalAddress.location.address.city}</Text>
                    <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{hospitalAddress.location.address.state}, {hospitalAddress.location.address.pin_code}</Text>
                </Right>
            </Row>
        )
    }
    renderPatientLocation() {
        const patientAddress = this.patientInfo && this.patientInfo.address && this.patientInfo.address.address;
        if (patientAddress && Object.keys(patientAddress).length) {
            return (
                <Row style={styles.rowDetail1}>
                    <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 16 }}>Address</Text>
                    <Right>
                        <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{patientAddress.no_and_street ? patientAddress.no_and_street + ' ,' : ''} {patientAddress.city}</Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{patientAddress.state}, {patientAddress.pin_code}</Text>
                    </Right>
                </Row>
            )
        }
        return null
    }

    async homePageRedirect() {
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
        console.log("isCorporateUserBBB", isCorporateUser)
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
        const { successBookSlotDetails, paymentMethod, tokenNo, fromNavigation } = this.state;
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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(successBookSlotDetails), title: 'Profile photo' })}>
                                        <Thumbnail source={renderDoctorImage(successBookSlotDetails)} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ width: '75%', marginTop: 10 }}>
                                    {fromNavigation === 'HOSPITAL' ?
                                        <Row style={styles.rowDetail1}>

                                            <Right>
                                                <Text style={styles.subText}>{successBookSlotDetails.name || ' '}</Text>
                                                <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{successBookSlotDetails.slotData.location.location.address.no_and_street}, {successBookSlotDetails.slotData.location.location.address.city}</Text>
                                                <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 14, color: '#7B7B7B', fontStyle: 'italic' }}>{successBookSlotDetails.slotData.location.location.address.state}, {successBookSlotDetails.slotData.location.location.address.pin_code}</Text>
                                            </Right>
                                        </Row> :
                                        <Row>
                                            <Text style={styles.docHeading}>{successBookSlotDetails.prefix ? successBookSlotDetails.prefix : ''} {successBookSlotDetails.doctorName} {' '}
                                                <Text style={styles.Degree}>{getDoctorEducation(successBookSlotDetails.education)}</Text> </Text>
                                        </Row>
                                    }
                                    <Row>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#535353', fontStyle: 'italic' }}>{getDoctorSpecialist(successBookSlotDetails.specialist)}</Text>

                                    </Row>
                                </Col>
                            </Row>
                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Token Number</Text>
                                <Right>
                                    <Text style={[styles.subText, { fontWeight: 'bold' }]}> {tokenNo} </Text>
                                </Right>
                            </Row>
                            {successBookSlotDetails.slotData && fromNavigation === null && this.isFromHomeHealthCareConfirmation === false ? this.renderHospitalLocation(successBookSlotDetails.slotData.location) : this.renderPatientLocation()}


                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Date</Text>
                                <Right>
                                    <Text style={styles.subText}> {
                                        this.isFromHomeHealthCareConfirmation === false ?
                                            successBookSlotDetails.slotData && formatDate(successBookSlotDetails.slotData.slotStartDateAndTime, 'Do MMMM, YYYY') : successBookSlotDetails.slotData && formatDate(successBookSlotDetails.slotData.slotDate, 'Do MMMM, YYYY')} </Text>
                                </Right>
                            </Row>
                            {this.isFromHomeHealthCareConfirmation === false ?
                                <Row style={styles.rowDetail}>
                                    <Text style={styles.mainText}>Time</Text>
                                    <Right>
                                        <Text style={styles.subText}> {successBookSlotDetails.slotData && formatDate(successBookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm A')} </Text>
                                    </Right>
                                </Row>
                                : null}
                            <Row style={styles.rowDetail}>
                                <Text style={styles.mainText}>Doctor Fee</Text>
                                <Right>
                                    <Text style={styles.subText}>{'\u20B9'}{successBookSlotDetails.slotData && successBookSlotDetails.slotData.fee} </Text>

                                </Right>

                            </Row>
                            <Row style={{ marginTop: 15, marginLeft: 10, marginRight: 10, marginBottom: 10 }}>

                                <Text style={styles.mainText}>Payment Method </Text>

                                <Right>
                                    <Text style={styles.subText}>{paymentMethod}</Text>

                                </Right>

                            </Row>
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
        fontFamily: 'OpenSans',
        fontSize: 20,
        fontWeight: 'bold',
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
        fontFamily: 'OpenSans',
        fontSize: 18,
        fontWeight: 'bold'
    },
    subText: {
        textAlign: 'center',
        fontFamily: 'OpenSans',
        fontSize: 14,
        marginTop: 5,
        color: '#535353',
        marginLeft: 20,
        marginRight: 20
    },
    docHeading: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        fontWeight: 'bold',

    },
    Degree: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        marginTop: 8,
        fontWeight: 'bold',

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
        fontFamily: 'OpenSans',
        fontSize: 16,
    },

});