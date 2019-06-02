import React, { Component } from 'react';
import { Container, Toast, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { bookAppointment } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../setup/helpers';



class PaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookSlotDetails: {},
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        console.log(navigation.state);
        const isLoggedIn = await hasLoggedIn(this.props);
        if(!isLoggedIn) {
            navigation.navigate('login');
            return
        }
        
        const bookSlotDetails = navigation.getParam('resultconfirmSlotDetails');
        await this.setState({ bookSlotDetails: bookSlotDetails });
    }
    confirmPayLater = async () => {

        const userId = await AsyncStorage.getItem('userId');
        let bookAppointmentData = {
            userId: userId,
            doctorId: this.state.bookSlotDetails.doctorId,
            description: "something",
            startTime: formatDate(this.state.bookSlotDetails.slotData.slotStartDateAndTime, 'YYYY-MM-DD HH:mm:ss'),
            endTime: formatDate(this.state.bookSlotDetails.slotData.slotEndDateAndTime, 'YYYY-MM-DD HH:mm:ss'),
            status: "PENDING",
            status_by: "Patient",
            statusUpdateReason: "something",
            hospital_id: this.state.bookSlotDetails.slotData.location.hospital_id,
            booked_from: "Mobile"
        }
        //    console.log(JSON.stringify(bookAppointmentData) + 'response for bookAppointmentData ');
        let resultData = await bookAppointment(bookAppointmentData);
        // console.log(JSON.stringify(resultData) + 'response for confirmPayLater ');
        if (resultData.success) {
            Toast.show({
                text: resultData.message,
                type: "success",
                duration: 3000,
            })
            this.props.navigation.navigate('paymentsuccess');
        } else{
            Toast.show({
                text: resultData.message,
                type: "warning",
                duration: 3000,
            })
        }
    }

    render() {
        const { bookSlotDetails } = this.state;
        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>

                                <Text style={styles.customizedText} note>Date And Time</Text>
                                <Text style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.slotDate}</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.slotTime} to {bookSlotDetails.slotData && bookSlotDetails.slotData.slotEndTime}</Text>
                                <Text note style={styles.customizedText}></Text>

                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>
                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text note style={styles.customizedText}>Doctor</Text>

                                <Text style={styles.customizedText}>{this.state.bookSlotDetails.doctorName}</Text>

                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>
                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Address</Text>
                                <Text note style={styles.customizedText}>
                                    {bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.no_and_street},</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.address_line_1},</Text>
                                <Text note style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.location.location.address.address_line_2}</Text>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>

                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Apply Coupons</Text>

                                <ListItem noBorder>
                                    <Left>
                                        <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '80%', height: 50, borderRadius: 10 }} />
                                    </Left>
                                    {/* <Body>
                                        <Text style={styles.customizedText}>Paypal</Text>
                                    </Body> */}
                                </ListItem>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Icon name="ios-arrow-dropright" />
                            </Col>
                        </Row>

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

                        <Row style={{ marginTop: 10 }}>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Total fee</Text>
                            </Col>
                            <Col style={{ width: '10%' }}>
                                <Text style={styles.customizedText}>300</Text>

                            </Col>
                        </Row>
                    </Grid>
                    <Button block success style={{ borderRadius: 6, marginLeft: 6 }} onPress={this.confirmPayLater}>
                        <Text uppercase={false} >payLater</Text>
                    </Button>
                </Content>

            </Container>

        )
    }

}

export default PaymentReview


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