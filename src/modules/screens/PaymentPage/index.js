import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, Toast } from 'native-base';
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
import { availableNetBanking, availableWallet  } from '../../../setup/paymentMethods';
class PaymentPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userEntry: '',
            password: '',
            loginErrorMsg: '',
            paymentOption: null,
            cardPaymentDetails : {
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
        const { user: { isLoading } } = this.props;
        const { loginErrorMsg } = this.state;
        return (

            <Container style={styles.container}>
                <Header style={{ backgroundColor: '#7E49C3', fontFamily: 'opensans-semibold' }}>
                    <Left  >
                        <Button Button transparent onPress={() => this.props.navigation.navigate('home')}>
                            <Icon name="arrow-back" style={{ color: '#fff' }}></Icon>
                        </Button>

                    </Left>
                    <Body>
                        <Title style={{ fontFamily: 'opensans-semibold' }}>Payment</Title>

                    </Body>
                    <Right ><Text style={{ color: '#fff' }}> Add New</Text></Right>
                </Header>

                <Content style={styles.bodyContent}>
                    
                    <Button transparent
                      onPress={() => /*{
                        var options = {
                            description: 'Credits towards consultation',
                            image: 'https://i.imgur.com/3g7nmJC.png',
                            currency: 'INR',
                            key: 'rzp_test_1DP5mmOlF5G5ag',
                            amount: '5000',
                            name: 'foo',
                           
                            prefill: {
                              email: 'sathishkrish20@razorpay.com',
                              contact: '919164932823',
                              name: 'Razorpay Software',
                              method: 'netbaking',
                              bank: 'HDFC',
                            },
                            theme: {color: '#F37254'}
                          }
                          RazorpayCheckout.open(options).then((data) => {
                            // handle success
                            alert(`Success: ${data.razorpay_payment_id}`);
                          }).catch((error) => {
                            // handle failure
                            alert(`Error: ${error.code} | ${error.description}`);
                          });
                      }*/ this.payNow()}
                    ><Text style={{ color: '#66A3F2', fontSize: 15, fontFamily: 'OpenSans' }}>Pay Now</Text>
                    </Button>
                        
                    <H3 style={styles.paymentHeader}>Payment </H3>

                    <Grid style={styles.gridNew}>

                        <Text style={styles.paymentText}>Choose Your Payment Method</Text>


                        <Row >
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>

                            </Col>
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>
                            </Col>
                            <Col style={{ width: '33.33%', alignItems: 'center' }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                <ListItem noBorder>
                                    <CheckBox checked={true} color="#4ED963" style={{ marginTop: 10 }}></CheckBox>
                                </ListItem>
                            </Col>
                        </Row>

                    </Grid>



                    <Grid style={styles.gridEntry}>
                        <Row>
                            <Input placeholder="Card Number" style={styles.transparentLabel} />
                        </Row>
                        <Row>
                            <Input placeholder="Card Holder " style={styles.transparentLabel} />
                        </Row>

                        <Row>
                            <Col style={{ width: '50%', paddingRight: 5 }}>
                                <Input placeholder="Expired Date " style={styles.transparentLabel} />
                            </Col>
                            <Col style={{ width: '50%', paddingLeft: 5 }}>
                                <Input placeholder="CVV " style={styles.transparentLabel} />
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10 }}>

                            <Col style={{ width: '10%' }}>
                                <CheckBox checked={true} color="#4ED963" />

                            </Col>
                            <Col style={{ width: '90%' }}>

                                <Text style={{ fontFamily: 'OpenSans', color: 'gray' }}>Save Credit Information</Text>
                            </Col>






                        </Row>

                    </Grid>


                </Content>
                <Footer style={{ backgroundColor: '#fff' }}>
                    <Left></Left>
                    <Body></Body>
                    <Right>
                        <Button onPress={()=> this.updatePaymentDetails(true, {}, 'cash')} transparent><Text style={{ color: '#66A3F2', fontSize: 15, fontFamily: 'OpenSans' }}>Pay Later</Text></Button>
                    </Right>
                </Footer>
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

    },

    paymentHeader:
    {
        fontFamily: 'opensans-semibold',
        borderColor: '#000',
        backgroundColor: 'white',
        borderWidth: 1,
        width: 130,
        textAlign: 'center',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        color: 'gray',
        fontSize: 18

    },

    paymentText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        textAlign: 'center',
        fontSize: 15,
        padding: 10
    },

    gridNew: {
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        padding: 15,
        marginTop: 10
    },
    gridEntry:
    {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
    }

});