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
            paymentOption: 'card', // setting default option to be card
            cardPaymentDetails: {
                name: null,
                number: null,
                cvv: null,
                monthyear: ''
            },
            selectedNetBank: null,
            selectedWallet: null,
            upiVPA: null,
            amount: 100,
            starCount: 3.5
        }
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
           if(!this.valid_credit_card(this.state.cardPaymentDetails.number)){
                Toast.show({
                    text: 'Please Enter valid Card number',
                    type: 'danger',
                    duration: 3000
                })
                return false;
           };
           if(this.state.cardPaymentDetails.monthyear.length !== 5) {
            Toast.show({
                text: 'Please Enter valid Expiry Date',
                type: 'danger',
                duration: 3000
            })
            return false;
          };
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
                vpa: this.state.upiVPA
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


    handlingCardNumber(number) {
        var cardPaymentDetails = {...this.state.cardPaymentDetails}
        cardPaymentDetails.number = number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
        this.setState({cardPaymentDetails})
    }
    handlingCardExpiry(text) {
        if (text.indexOf('.') >= 0 || text.length > 5) {
            // Since the keyboard will have a decimal and we don't want
            // to let the user use decimals, just exit if they add a decimal
            // Also, we only want 'MM/YY' so if they try to add more than
            // 5 characters, we want to exit as well
            return;
        }
        if(text.length === 5) {
            if(Number(text.split('/')[1]) > 31) {
                return;
            }
        }
        var cardPaymentDetails = {...this.state.cardPaymentDetails}
       
        if (text.length === 2 && cardPaymentDetails.monthyear.length === 1) {
            if(Number(text) > 12) {
                return;
            }
            // This is where the user has typed 2 numbers so far
            // We can manually add a slash onto the end
            // We check to make sure the current value was only 1 character
            // long so that if they are backspacing, we don't add on the slash again
            text += '/'
        }

        cardPaymentDetails.monthyear = text;
        console.log(cardPaymentDetails);

        this.setState({cardPaymentDetails})
        // Update the state, which in turns updates the value in the text field
        
    }
     valid_credit_card(value) {
        // Accept only digits, dashes or spaces
          if (/[^0-9-\s]+/.test(value)) return false;
      
          // The Luhn Algorithm. It's so pretty.
          let nCheck = 0, bEven = false;
          value = value.replace(/\D/g, "");
      
          for (var n = value.length - 1; n >= 0; n--) {
              var cDigit = value.charAt(n),
                    nDigit = parseInt(cDigit, 10);
      
              if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
      
              nCheck += nDigit;
              bEven = !bEven;
          }
      
          return (nCheck % 10) == 0;
      }
    render() {
       
        const { cardPaymentDetails, paymentOption} = this.state;

        return (
            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                    <Card transparent style={{ padding: 5, }}>
                        
                       <Card style={{ padding: 20, marginTop: 20, borderRadius: 5 }}>
                                        
                            <Grid style={{ padding: 5, margin: 10, backgroundColor: '#f2f2f2', }}>
                                    <Text style={styles.paymentText}>Choose Your Payment Method</Text>
                                            <Row>
                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}
                                                     onPress={()=> this.setState({ paymentOption: 'card' })}>
                                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                                </Col>


                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10, backgroundColor: '#82ccdd' }} 
                                                     onPress={()=> this.setState({ paymentOption: 'netbanking' })}>
                                                    <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} />
                                                </Col>


                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }} 
                                                            onPress={()=> this.setState({ paymentOption: 'wallet' })}>
                                                    <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }}  />
                                                </Col>

                                                <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }} 
                                                            onPress={()=> this.setState({ paymentOption: 'upi' })}>
                                                    <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }}  />
                                                </Col>
                                            </Row>

                                        </Grid>
                                    { paymentOption === 'card' ? 
                                        <Content> 
                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>Card Holder Name</Text>
                                                <Input placeholder="Card Holder Name" 
                                                       value={cardPaymentDetails ? cardPaymentDetails.name : ''}
                                                       onChangeText={(text) => { 
                                                        var cardPaymentDetails = {...this.state.cardPaymentDetails}
                                                        cardPaymentDetails.name =text;
                                                        this.setState({cardPaymentDetails}) 
                                                       }}
                                                       style={styles.transparentLabel} />
                                            </Col>
                                        </Grid>

                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>Card Number</Text>
                                                <Input placeholder="Card Number" 
                                                       maxLength={19}
                                                       keyboardType={'numeric'}
                                                       onChangeText={(text) => this.handlingCardNumber(text)}
                                                       value={cardPaymentDetails ? cardPaymentDetails.number : ''} 
                                                       style={styles.transparentLabel} />
                                            </Col>
                                        </Grid>
                                        <Grid style={{ marginTop: 10 }}>
                                           
                                            <Col>
                                                <Text style={styles.labelTop}>Expired Date</Text>
                                                <Input placeholder='MM/YY'
                                                       keyboardType={'numeric'}
                                                       value={cardPaymentDetails ? cardPaymentDetails.monthyear : ''}
                                                       onChangeText={(text) => this.handlingCardExpiry(text)}
                                                       style={styles.transparentLabel} />
                                            </Col>
                                            <Col>
                                                <Text style={styles.labelTop}>CVV</Text>
                                                <Input placeholder="CVV" 
                                                       maxLength={3}
                                                       keyboardType={'numeric'}
                                                       secureTextEntry={true}
                                                       value={cardPaymentDetails ? cardPaymentDetails.cvv : ''}
                                                       onChangeText={(text) => { 
                                                            var cardPaymentDetails = {...this.state.cardPaymentDetails}
                                                            cardPaymentDetails.cvv =text;
                                                            this.setState({cardPaymentDetails}) 
                                                       }}
                                                       style={styles.transparentLabel} />
                                            </Col>

                                        </Grid>

                                        <Grid style={{ marginTop: 15 }}>
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <CheckBox checked={true} color="green"></CheckBox>
                                                        <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans', }}>Save creditcard Information</Text>
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Grid>
                                        </Content> : null }
                                        

                                    { paymentOption === 'netbanking' ? 
                                        <Content> 
                                            {/* Code for Netbanking */}       
                                        </Content> : null } 

                                    { paymentOption === 'wallet' ? 
                                        <Content> 
                                           {/* Code for wallet */}     
                                        </Content> : null } 
                                                         
                                    { paymentOption === 'upi' ? 
                                        <Content> 
                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={styles.labelTop}>UPI ID</Text>
                                                <Input placeholder="Enter your UPI ID" 
                                                       value={this.state.upiVPA}
                                                       onChangeText={(text) =>  this.setState({ upiVPA : text})}
                                                       style={styles.transparentLabel} />
                                            </Col>
                                        </Grid>
                                      </Content> : null } 


                                        <Button onPress={() => this.makePaymentMethod()} block style={styles.paymentButton}><Text>Continue</Text></Button>
                                    </Card>
                          
                    </Card>
                </Content>

            </Container>

        )
    }

}





export default (PaymentPage)


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