import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, Toast, Segment } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import Razorpay from '../../../components/Razorpay';
import { RAZOR_KEY } from '../../../setup/config';
import { bookAppointment, createPaymentRazor } from '../../providers/bookappointment/bookappointment.action';
import { availableNetBanking, availableWallet } from '../../../setup/paymentMethods';
import { FlatList } from 'react-native-gesture-handler';

class PaymentPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: '',
            loginErrorMsg: '',
            paymentOption: null,
            cardPaymentDetails: {
                name: null,
                number: null,
                cvv: null,
                monthyear: null
            },
            selectedNetBank: null,
            selectedWallet: null,
            upiVPA: null,
            amount: null,
        }
        this.state = {
            starCount: 3.5
        };
    }
    componentDidMount() {
        availableNetBanking();
        availableWallet();
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    async payNow() {
        await this.setState({
            paymentOption: 'netbanking',
            selectedNetBank: 'HDFC',
            amount: 5 * 100 // equavlt to 5 RS. 5 is consider as a Paise
        });
        this.makePaymentMethod();
    }

    makePaymentMethod() {
        let data;
        if (this.state.paymentOption === 'card') {
            data = {
                method: 'card',
                'card[name]': this.state.cardPaymentDetails.name,
                'card[number]': this.state.cardPaymentDetails.number,
                'card[cvv]': this.state.cardPaymentDetails.cvv,
                'card[expiry_month]': this.state.cardPaymentDetails.monthyear.split('/')[0],
                'card[expiry_year]': this.state.cardPaymentDetails.monthyear.split('/')[1],
            }
        } else if (this.state.paymentOption === 'netbanking') {
            data = {
                method: 'netbanking',
                bank: this.state.selectedNetBank
            }
        } else if (this.state.paymentOption === 'wallet') {
            data = {
                method: 'wallet',
                bank: this.selectedWallet
            }
        } else if (this.state.paymentOption === 'upi') {
            data = {
                method: 'upi',
                bank: this.state.upiVPA
            }
        }
        this.razorpayChekout(data)
    }

    razorpayChekout(paymentMethodData) {

        const options = {
            description: 'Pay for your Health',
            currency: 'INR',
            key_id: RAZOR_KEY,
            amount: this.state.amount,
            email: 'gaurav.kumar@example.com',
            contact: '9123456780',
            ...paymentMethodData
        }
        Razorpay.open(options).then((data) => {
            // handle success
            alert(`Success: ${data.razorpay_payment_id}`);
            this.updatePaymentDetails(true, data, 'razor');
        }).catch((error) => {
            // handle failure 
            alert(`Error: ${error.code} | ${error.description}`);
            this.updatePaymentDetails(false, error, 'razor');
        });
    }

    async updatePaymentDetails(isSuccess, data, modeOfPayment) {
        try {
            debugger
            this.setState({ isLoading: true });
            const userId = await AsyncStorage.getItem('userId');
            let paymentData = {
                payer_id: userId,
                payer_type: 'user',
                payment_id: data.razorpay_payment_id || modeOfPayment === 'cash' ? 'cash_' + new Date().getTime() : 'pay_err_' + new Date().getTime(),
                amount: this.state.amount,
                amount_paid: !isSuccess || modeOfPayment === 'cash' ? 0 : this.state.amount,
                amount_due: !isSuccess || modeOfPayment === 'cash' ? this.state.amount : 0,
                currency: 'INR',
                service_type: 'APPOINTMENT',
                booking_from: 'APPLICATION',
                is_error: !isSuccess,
                error_message: data.description || null,
                payment_mode: modeOfPayment,
            }
            console.log('is congign')
            let resultData = await createPaymentRazor(paymentData);
            console.log(resultData);
            if (resultData.success) {
                Toast.show({
                    text: resultData.message,
                    type: "success",
                    duration: 3000,
                })
                if (isSuccess) {
                    // this.updateBookAppointmentData();
                } else {
                    Toast.show({
                        text: data.description,
                        type: "warning",
                        duration: 3000,
                    })
                }
            } else {
                Toast.show({
                    text: resultData.message,
                    type: "warning",
                    duration: 3000,
                })
            }
        } catch (error) {
            this.setState({ isLoading: false });
            Toast.show({
                text: error,
                type: "warning",
                duration: 3000,
            })
        }
    }

    updateBookAppointmentData = async () => {
        try {
            this.setState({ isLoading: true })
            const userId = await AsyncStorage.getItem('userId');
            let bookAppointmentData = {
                userId: userId,
                doctorId: this.state.bookSlotDetails.doctorId,
                description: "something",
                startTime: this.state.bookSlotDetails.slotData.slotStartDateAndTime,
                endTime: this.state.bookSlotDetails.slotData.slotEndDateAndTime,
                status: "PENDING",
                status_by: "Patient",
                statusUpdateReason: "something",
                hospital_id: this.state.bookSlotDetails.slotData.location.hospital_id,
                booked_from: "Mobile"
            }
            let resultData = await bookAppointment(bookAppointmentData);
            // console.log(JSON.stringify(resultData) + 'response for confirmPayLater ');
            this.setState({ isLoading: false })
            if (resultData.success) {
                Toast.show({
                    text: resultData.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: this.state.bookSlotDetails });

            } else {
                Toast.show({
                    text: resultData.message,
                    type: "warning",
                    duration: 3000,
                })
            }
        } catch (ex) {
            Toast.show({
                text: 'Exception Occured ' + ex,
                type: "warning",
                duration: 3000,
            })
        } finally {
            this.setState({ isLoading: false })
        }
    }

    render() {
        var payment = [{
            bankName: 'State Bank', number: '2344'

        }]
        const { user: { isLoading } } = this.props;
        const { loginErrorMsg } = this.state;


        return (
            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                    <Card transparent style={{ padding: 5, }}>
                        <Segment>
                            <Button first active>
                                <Text uppercase={false}>DefaultCard</Text>
                            </Button>
                            <Button>
                                <Text uppercase={false}>AddNewCard</Text>
                            </Button>

                        </Segment>
                        <FlatList
                            data={payment}
                            renderItem={
                                ({ item }) =>
                                    <Card style={{ padding: 20, marginTop: 20, borderRadius: 5 }}>
                                        {/* <Row>
                                            <Col style={{ width: '32%' }}>
                                                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKuPIQiZ-73x4xDj522X2WR1wUvbZoT14N3Jl4wa92mOig4WkKg' }}
                                                    style={{ width: '30%', height: 50, }}
                                                />
                                            </Col>
                                            <Col style={{ width: '58%', marginTop: 5, marginLeft: -20 }}>
                                                <Row>
                                                    <Text style={{ fontSize: 15, marginTop: 2 }} >******</Text>
                                                    <Text style={{ fontSize: 15 }}>{item.number}</Text>
                                                </Row>
                                                <Text style={{ color: 'blue', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>{item.bankName}</Text>
                                            </Col>
                                            <Col style={{ width: '10%', marginTop: 15, marginLeft: 20, }} >
                                                <Icon style={{ color: 'green', fontSize: 25 }} name="ios-checkmark-circle" />
                                            </Col>
                                        </Row> */}

                                        <Grid style={{ padding: 5, margin: 10, backgroundColor: '#f2f2f2', }}>
                                            <Text style={styles.paymentText}>Choose Your Payment Method</Text>
                                            <Row>
                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10, backgroundColor: '#82ccdd' }}>
                                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                                    <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>
                                            </Row>

                                        </Grid>

                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>Card Holder Name</Text>
                                                <Input placeholder="Card Holder Name" style={styles.transparentLabel} />

                                            </Col>
                                        </Grid>

                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>Card Number</Text>
                                                <Input placeholder="Card Number" style={styles.transparentLabel} />
                                            </Col>
                                        </Grid>
                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>CVV</Text>
                                                <Input placeholder="CVV" style={styles.transparentLabel} />
                                            </Col>
                                            <Col>
                                                <Text style={styles.labelTop}>Expired Date</Text>
                                                <Input placeholder="Expired Date" style={styles.transparentLabel} />
                                            </Col>

                                        </Grid>

                                        <Grid style={{ marginTop: 15 }}>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <CheckBox checked={true} color="green"  ></CheckBox>
                                                        <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans', }}>Save creditcard Information</Text>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Grid>
                                        <View style={{ flexDirection: 'row', margintop: 10 }}>

                                        </View>


                                        <Button onPress={() => this.updatePaymentDetails(true, {}, 'cash')} block style={styles.paymentButton}><Text>Continue</Text></Button>
                                    </Card>
                            } />
                    </Card>
                </Content>

            </Container>

        )
    }

}


function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(PaymentPage)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 50,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },


    curvedGrid: {
        borderRadius: 800,
        width: '200%',
        height: 690,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
    },

    paymentButton: {
        marginTop: 15,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },
    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


    },
    transparentLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
    },
    paymentText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        textAlign: 'center',
        fontSize: 15,

    },
});