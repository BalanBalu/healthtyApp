import React, { Component } from 'react';
import { Container, Toast, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { validateBooking } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { RenderHospitalAddress } from '../../common';
//import RazorpayCheckout from 'react-native-razorpay';
import { ScrollView } from 'react-native-gesture-handler';
//import appIcon from '../../../../assets/Icon.png';

import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';

export default class PaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookSlotDetails: {},
            isLoading: false
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        console.log(navigation.state);
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            navigation.navigate('login');
            return
        }

        const bookSlotDetails = navigation.getParam('resultconfirmSlotDetails');
        await this.setState({ bookSlotDetails: bookSlotDetails });
    }
    async confirmProceedPayment() {
        this.setState({ isLoading: true });
        const bookingSlotData = this.state.bookSlotDetails
        const reqData = {
            doctorId: bookingSlotData.doctorId,
            startTime: bookingSlotData.slotData.slotStartDateAndTime,
            endTime: bookingSlotData.slotData.slotEndDateAndTime,
        }
        validationResult = await validateBooking(reqData)
        this.setState({ isLoading: false });
        if (validationResult.success) {
            const amount = this.state.bookSlotDetails.slotData.fee;
            this.props.navigation.navigate('paymentPage', { service_type: 'APPOINTMENT', bookSlotDetails: this.state.bookSlotDetails, amount: amount })
        } else {
            console.log(validationResult);
            Toast.show({
                text: validationResult.message,
                type: 'warning',
                duration: 3000
            })
        }

    }
    async processToPayLater() {
        const userId = await AsyncStorage.getItem('userId');
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
        let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', this.state.bookSlotDetails, 'APPOINTMENT', userId);
        console.log('Book Appointment Payment Update Response ');
        console.log(response);
        if (response.success) {
            this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: this.state.bookSlotDetails });
        } else {
            Toast.show({
                text: response.message,
                type: 'warning',
                duration: 3000
            })
        }

    }

    render() {
        const { bookSlotDetails } = this.state;
        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                    <ScrollView>
                        <Spinner color='blue'
                            visible={this.state.isLoading}
                            textContent={'Loading...'}
                        />

                        <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '90%' }}>

                                    <Text style={styles.customizedText} note>Date And Time</Text>
                                    <Text style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'DD MMMM, YYYY')}</Text>
                                    <Text style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm A')} to {bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotEndDateAndTime, 'hh:mm A')}</Text>
                                    <Text note style={styles.customizedText}></Text>

                                </Col>

                            </Row>
                        </Grid>

                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '90%' }}>
                                    <Text note style={styles.customizedText}>Doctor</Text>
                                    <Text style={styles.customizedText}>{bookSlotDetails.prefix ? bookSlotDetails.prefix : 'Dr'}. {bookSlotDetails.doctorName}</Text>
                                </Col>

                            </Row>
                        </Grid>

                        {bookSlotDetails.slotData ?
                            <RenderHospitalAddress gridStyle={{ padding: 10, marginLeft: 10, width: '100%' }}
                                textStyle={styles.customizedText}
                                hospotalNameTextStyle={{ fontFamily: 'OpenSans-SemiBold' }}
                                hospitalAddress={bookSlotDetails.slotData && bookSlotDetails.slotData.location}
                            />
                            : null}

                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>

                        </Grid>

                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>fee</Text>
                                </Col>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.fee}</Text>
                                </Col>
                            </Row>
                        </Grid>
                        <Button block success style={{ borderRadius: 6, margin: 6 }} onPress={() => this.processToPayLater()}>
                            <Text uppercase={false}>payLater</Text>
                        </Button>
                        <Button block success style={{ padding: 10, borderRadius: 6, margin: 6, marginBottom: 20 }} onPress={() =>
                            this.confirmProceedPayment()}>
                            <Text uppercase={false} >Pay Now</Text>
                        </Button>
                    </ScrollView>
                </Content>

            </Container>

        )
    }

}

const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {

    },

    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 15
    }
});