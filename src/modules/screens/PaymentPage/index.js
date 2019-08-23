import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, FooterTab, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox, Toast, Segment, Radio } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, Image, TouchableOpacity, View, AsyncStorage, Picker } from 'react-native';
import StarRating from 'react-native-star-rating';
import Razorpay from '../../../components/Razorpay';
import { RAZOR_KEY } from '../../../setup/config';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { bookAppointment, createPaymentRazor } from '../../providers/bookappointment/bookappointment.action';
import { getAvailableNetBanking, getAvailableWallet } from '../../../setup/paymentMethods';
import { FlatList } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';


class PaymentPage extends Component {
    availableNetBankingData = [];
    availableWallets = [];
    constructor(props) {
        super(props)



        this.state = {
            selectedItems: [],
            userEntry: '',
            password: '',
            loginErrorMsg: '',
            paymentOption: 'CREDIT_CARD', // setting default option to be card
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
            starCount: 3.5,
            isVisibleDebit: false,
            isVisibleCredit: false,
            isVisibleNetbanking: false,
            isVisibleUpi: false,
            language: 'java',
            value: 'credit',
            savedCardId: 1,
            selectedItems: []
        }
    }
     componentDidMount() {
         this.availableNetBankingData = getAvailableNetBanking();
         this.availableWallets = getAvailableWallet();
     }
   

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    
    makePaymentMethod() {
        let data;
        if (this.state.paymentOption === 'CREDIT_CARD' || this.state.paymentOption === 'DEBIT_CARD') {
            if (!this.valid_credit_card(this.state.cardPaymentDetails.number)) {
                Toast.show({
                    text: 'Please Enter valid Card number',
                    type: 'danger',
                    duration: 3000
                })
                return false;
            };
            if (this.state.cardPaymentDetails.monthyear.length !== 5) {
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
        } else if (this.state.paymentOption === 'NET_BANKING') {
            data = {
                method: 'netbanking',
                bank: this.state.selectedNetBank
            }
        } else if (this.state.paymentOption === 'WALLET') {
            data = {
                method: 'wallet',
                bank: this.selectedWallet
            }
        } else if (this.state.paymentOption === 'UPI') {
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
        var cardPaymentDetails = { ...this.state.cardPaymentDetails }
        cardPaymentDetails.number = number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
        this.setState({ cardPaymentDetails })
    }
    handlingCardExpiry(text) {
        if (text.indexOf('.') >= 0 || text.length > 5) {
            // Since the keyboard will have a decimal and we don't want
            // to let the user use decimals, just exit if they add a decimal
            // Also, we only want 'MM/YY' so if they try to add more than
            // 5 characters, we want to exit as well
            return;
        }
        if (text.length === 5) {
            if (Number(text.split('/')[1]) > 31) {
                return;
            }
        }
        var cardPaymentDetails = { ...this.state.cardPaymentDetails }

        if (text.length === 2 && cardPaymentDetails.monthyear.length === 1) {
            if (Number(text) > 12) {
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

        this.setState({ cardPaymentDetails })
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
    
    onSelectedItemsChange = (selectedItems) => {
       // this.setState({ selectedItems: [ selectedItems[selectedItems.length - 1] ] });
        this.setState({ selectedItems: selectedItems});
    };
     
    render() {

        const { cardPaymentDetails, paymentOption , checked} = this.state;
        var savedCards = [1,2]
        return (
            <Container style={styles.container}>
             <Content style={styles.bodyContent}>
                <Row style={{ marginTop: 10, marginLeft: 15 }}>
                    <Col style={{ width: '60%' }}>
                       <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold', }}>Select Options To Pay</Text>
                    </Col>
                    <Col style={{ width: '50%' }}>
                        <Text style={{ marginLeft: 40, fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }}>{'  '}{'\u20B9'}1000</Text>
                    </Col>
                </Row>
          <Row>
            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: 'gray', marginTop: 40, marginLeft: 15 }}>SAVED CARDS</Text>
         </Row>

        <RadioButton.Group
            onValueChange={value => this.setState({ savedCardId: value })}
            value={this.state.savedCardId}>
             <Grid>
               <View style={{ marginTop: 10, justifyContent: 'center' }}>
                 {savedCards.map(element => {
                    return this.renderSavedCards(element)
                 })}
              </View>
            </Grid>
        </RadioButton.Group>

     
      <Row style={{ marginBottom: 10, marginLeft: 15, marginRight: 15, marginTop: 10 }}>
          <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: 'gray', marginTop: 10, }}>PAYMENT OPTIONS</Text>
       </Row>
      
      <RadioButton.Group
        onValueChange={value => this.setState({ paymentOption: value })}
        value={this.state.paymentOption}>
      
      
        <View style={{flexDirection: 'row'}}>   
            <RadioButton value="CREDIT_CARD" />
            <Text>Credit Card</Text>
        </View>
        {this.state.paymentOption === "CREDIT_CARD" ? this.renderCreditDebitCard('Credit') : null}
       
        <View style={{flexDirection: 'row'}}>  
            <RadioButton value="DEBIT_CARD" />
            <Text>Debit Card</Text>
        </View>

        {this.state.paymentOption === "DEBIT_CARD" ? this.renderCreditDebitCard('Debit') : null}

        <View style={{flexDirection: 'row'}}>  
            <RadioButton value="NET_BANKING" />
            <Text>Net Banking</Text>
        </View>
        {this.state.paymentOption === "NET_BANKING" ? this.renderNetBanking() : null}
        
        <View style={{flexDirection: 'row'}}>  
            <RadioButton value="UPI" />
            <Text>UPI</Text>
        </View>
          {this.state.paymentOption === "UPI" ? this.renderUPI() : null}
        


        <View style={{flexDirection: 'row'}}>  
            <RadioButton value="WALLET" />
            <Text>Wallet</Text>
        </View>
           {this.state.paymentOption === "WALLET" ? this.renderWallet() : null}
        </RadioButton.Group>
       
      </Content>
     
      <Footer transparent>
      <FooterTab>
        <Button block onPress={() => this.makePaymentMethod()} block style={styles.paymentButton}><Text>Pay</Text></Button>
      </FooterTab>
           </Footer>
     </Container >
   )
}

    renderCreditDebitCard(cardType) {
        const { cardPaymentDetails } = this.state;
        return (
            <Card transparent style={{ padding: 20, borderRadius: 5 }}>
            <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5 }}>
               <Content>
                  <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                     <Col>
                       <Text style={styles.labelTop}>{cardType} Card Holder Name (Optional)</Text>
                         <Input placeholder="Card Holder Name"
                            value={cardPaymentDetails ? cardPaymentDetails.name : ''}
                                    onChangeText={(text) => {
                                        var cardPaymentDetails = { ...this.state.cardPaymentDetails }
                                        cardPaymentDetails.name = text;
                                        this.setState({ cardPaymentDetails })
                                    }}
                                    style={styles.transparentLabel} />
                            </Col>
                        </Grid>

                        <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
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
                        <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>

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
                                        var cardPaymentDetails = { ...this.state.cardPaymentDetails }
                                        cardPaymentDetails.cvv = text;
                                        this.setState({ cardPaymentDetails })
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
                       
                    </Content> 
            </View>
        </Card>
        )
    }

    renderNetBanking() {
        return (     
        <Card transparent style={{ padding: 20, borderRadius: 5 }}>
            <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, padding: 20 }}>
                <Row>
                    <Col style={{ width: '33%' }} onPress={()=> this.setState({ selectedNetBank: 'SBIN'})}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKuPIQiZ-73x4xDj522X2WR1wUvbZoT14N3Jl4wa92mOig4WkKg' }}
                            style={{ width: '100%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>State Bank</Text>

                    </Col>
                    <Col style={{ width: '33%' }} onPress={()=> this.setState({ selectedNetBank: 'UTIB'})}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYglTLQvQ3ei2O3btzByquzRPz8hcU4QgsBvfszrxfok18pH81Dg' }}
                            style={{ width: '100%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>Axis Bank</Text>
                    </Col>
                    <Col style={{ width: '33%' }}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2mkKNBtc1XJ0Z5y6SdfIAX244NFf7YG3pQt4Ei9fl3_6WdRSBHw' }}
                            style={{ width: '50%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>ICICI Bank</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    
                    <Col style={{ width: '33%', }}>

                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdpxq-0XbWJfCZ7bUyzCYXuTwFz9IwHH1q0EmUZCRb69XFCvKd' }}
                            style={{ width: '50%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>HDFC Bank</Text>

                    </Col>
                    <Col style={{ width: '33%' }}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQooe15-fhz1AfjPDUXh0gDJcDJQrCr73NwvFkV7N99jijYlIbk' }}
                            style={{ width: '50%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>Indian Bank</Text>
                    </Col>

                </Row>
                  <Card style={{ marginTop: 15, backgroundColor: '#fff', height: 50 }}>
                    <View>
                        <SectionedMultiSelect
                            items={this.availableNetBankingData}
                            uniqueKey="code"
                            selectText="Choose Other Banks"
                            color={{ primary: '#3f51b5' }}
                            showDropDowns={true}
                            single={true}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.selectedItems}
                            hideConfirm={true}
                            showChips={false}
                            onCancel={()=> this.setState({selectedItems : []})}
                        />
                    </View>
                </Card>
             </View>
          </Card>
       )
    }

    renderUPI() {
        return (
        <Card transparent style={{ padding: 20, borderRadius: 5 }}>
          <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5 }}>
              <Content>
                 <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                    <Col>
                     <Card style={{ padding: 20, borderRadius: 2 }}>
                     <Input underlineColorAndroid="red"
                            underlineColorIos="red"
                            value={this.state.upiVPA}
                            onChangeText={(value)=> this.setState({upiVPA: value})}
                            placeholder="Yourid@upi" placeholderTextColor="red" style={styles.transparentLabelUpi} />
                      <Text style={{ marginTop: 1, fontSize: 13, fontFamily: 'OpenSans', color: 'red', marginLeft: 5 }}>
                         Please enter a valid upi id
                      </Text>
                     </Card>
                      <View style={{ marginBottom: 10 }} >
                         <Text style={{ marginTop: 10, fontSize: 13, fontFamily: 'OpenSans', }}>Please enter your VPA and Tap on PAY.You need to approve the request on your UPI App to complete the payment</Text>
                      </View>
                    </Col>
                </Grid>
              </Content>
          </View>
        </Card>
        )
    }

    renderWallet() {
        return (     
        <Card transparent style={{ padding: 20, borderRadius: 5 }}>
            <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, padding: 20 }}>
                <Row>
                    <Col style={{ width: '33%' }}>
                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKuPIQiZ-73x4xDj522X2WR1wUvbZoT14N3Jl4wa92mOig4WkKg' }}
                            style={{ width: '80%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>State Bank</Text>
                    </Col>
                    <Col style={{ width: '33%', }}>

                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYglTLQvQ3ei2O3btzByquzRPz8hcU4QgsBvfszrxfok18pH81Dg' }}
                            style={{ width: '80%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>Axis Bank</Text>
                    </Col>
                    <Col style={{ width: '33%', }}>

                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYglTLQvQ3ei2O3btzByquzRPz8hcU4QgsBvfszrxfok18pH81Dg' }}
                            style={{ width: '80%', height: 50, }}
                        />
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, }}>Axis Bank</Text>
                    </Col>
                </Row>
             </View>
          </Card>
       )
    }

    renderSavedCards(valueOfCreditCard) {
        const { cardPaymentDetails } = this.state;
        return (
      <View>   
        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
         <RadioButton value={valueOfCreditCard} />
         <Col style={{ width: '90%', }}>
           <Row>
              <Text style={{ color: '#000', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>SBI</Text>
           </Row>
            <Row>
              <Text style={{ fontSize: 15, marginTop: 5 }} >******</Text>
              <Text style={{ fontSize: 15 }}>1111</Text>
              <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5, color: 'blue', fontWeight: 'bold' }}>VISA</Text>
            </Row>

             <Row>
               <Text style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>provide Valid CVV</Text>
                 <Input placeholder="CVV"
                   maxLength={3}
                   keyboardType={'numeric'}
                   secureTextEntry={true}
                   value={cardPaymentDetails ? cardPaymentDetails.cvv : ''}
                   onChangeText={(text) => {
                    var cardPaymentDetails = { ...this.state.cardPaymentDetails }
                    cardPaymentDetails.cvv = text;
                    this.setState({ cardPaymentDetails })
                   }}
                   style={styles.transparentLabel} />
                    <Icon style={{ marginLeft: 10, fontSize: 20, marginTop: 5 }} name="ios-information-circle-outline" />
                </Row>
              </Col>
            </Row>
        </View>
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
        padding: 0,
        backgroundColor: '#f2f2f2'
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
        marginLeft: 10


    },
    transparentLabel:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#fff',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },
    transparentLabelUpi:
    {

        borderBottomColor: 'transparent',
        backgroundColor: '#fff',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },

    paymentText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        textAlign: 'center',
        fontSize: 15,

    },
});