import React, { Component } from 'react';
import { Container, Content, Text, Button, FooterTab, Card, Footer, Icon, Input,Toast, Form,Right} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, View, AsyncStorage,TextInput} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { RadioButton ,Checkbox} from 'react-native-paper';

import { getAvailableNetBanking, getAvailableWallet, luhnCheck, getPayCardType } from '../../../setup/paymentMethods';
import { bookAppointment, createPaymentRazor } from '../../providers/bookappointment/bookappointment.action';
import { putService , getService} from '../../../setup/services/httpservices';
import Razorpay from '../../../components/Razorpay';
import { RAZOR_KEY , BASIC_DEFAULT} from '../../../setup/config';
import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';
import { TouchableOpacity } from 'react-native-gesture-handler';

class PaymentPage extends Component {
    availableNetBankingData = [];
    availableWallets = [];
    userId = null;
    userBasicData = null;
    constructor(props) {
        super(props)
        this.state = {
            selectedItems: [],
            userEntry: '',
            password: '',
            loginErrorMsg: '',
            paymentOption: null, //'CREDIT_CARD', // setting default option to be card
            selectedSavedCardId: null,
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
            selectedItems: [],
            savedCards: [],
            saveCardCheckbox: true,
             checked:false,
            bookSlotDetails: null,
            isLoading: false,
            isHidden: false,
            coupenCodeText: null,
            paymentMethodTitleCase : null
        }
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
    }
    async componentDidMount() {
         this.userId = await AsyncStorage.getItem('userId');
       
        const { navigation } = this.props;
        
        const bookSlotDetails = navigation.getParam('bookSlotDetails');
        const serviceType = navigation.getParam('service_type');
        const amount = navigation.getParam('amount');
        this.setState({ bookSlotDetails: bookSlotDetails, serviceType: serviceType, amount: amount });

        this.availableNetBankingData = getAvailableNetBanking();
        this.availableWallets = getAvailableWallet();
        this.getSavedCards() 
        let userBasicData = await AsyncStorage.getItem('basicProfileData')
        
        if(userBasicData !== null) {
           this.userBasicData = JSON.parse(userBasicData);
           if(!this.userBasicData.email) {
               this.userBasicData.email = BASIC_DEFAULT.email 
           }
           if(!this.userBasicData.mobile_no) {
              this.userBasicData.mobile_no = BASIC_DEFAULT.mobile_no 
           }
        } else {
            this.userBasicData = BASIC_DEFAULT
        }
    }
   
    async getSavedCards() {
      const userId = await AsyncStorage.getItem('userId');
      const endPointForGetCards = `payer/${userId}/type/user`;
      const response = await getService(endPointForGetCards);
      const respData = response.data;
       if(respData.success === true) {
            this.setState({ savedCards : respData.data});   
      }
    }
    

    
    makePaymentMethod() {
        let data;
        if(this.state.selectedSavedCardId !== null) {
            var savedCards = this.state.savedCards;
            var selectedSavedCardId = this.state.selectedSavedCardId;
            var selectedSavedCardArr = savedCards.filter(function(savedCards) {
                return savedCards.card_id === selectedSavedCardId;
            });
            console.log(this.state);
            data = {
                method: 'card',
                'card[name]': selectedSavedCardArr[0].card_holder_name ? selectedSavedCardArr[0].card_holder_name : 'default', 
                'card[number]': selectedSavedCardArr[0].card_number,
                'card[cvv]': this.state[selectedSavedCardId + '-savedCardCVV'],
                'card[expiry_month]': selectedSavedCardArr[0].expiry_m_y.split('/')[0],
                'card[expiry_year]': selectedSavedCardArr[0].expiry_m_y.split('/')[1],
            }
            let paymentMethodTitleCase = selectedSavedCardArr[0].card_type === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card'
            this.setState({ paymentMethodTitleCase: paymentMethodTitleCase });
           
            if(selectedSavedCardArr[0].card_holder_name) {
                //data['card[name]'] = selectedSavedCardArr[0].card_holder_name;
            }
             
            this.razorpayChekout(data)
        }
        else if(this.state.paymentOption !== null) {
          if (this.state.paymentOption === 'CREDIT_CARD' || this.state.paymentOption === 'DEBIT_CARD') {
            if (!luhnCheck(this.state.cardPaymentDetails.number)) {
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
                'card[number]': this.state.cardPaymentDetails.number.replace(/ /g, ''),
                'card[cvv]': this.state.cardPaymentDetails.cvv,
                'card[expiry_month]': this.state.cardPaymentDetails.monthyear.split('/')[0],
                'card[expiry_year]': this.state.cardPaymentDetails.monthyear.split('/')[1],
            }
           
            let paymentMethodTitleCase = this.state.paymentOption === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card'
            this.setState({ pay_card_type: getPayCardType(this.state.cardPaymentDetails.number) , paymentMethodTitleCase: paymentMethodTitleCase });
        } else if (this.state.paymentOption === 'NET_BANKING') {
            data = {
                method: 'netbanking',
                bank: this.state.selectedNetBank
            }
            this.setState({ paymentMethodTitleCase: 'Net Banking' });
        } else if (this.state.paymentOption === 'WALLET') {
            debugger
            data = {
                method: 'wallet',
                wallet: this.state.selectedWallet
            }
            this.setState({ paymentMethodTitleCase: this.state.selectedWallet });
        } else if (this.state.paymentOption === 'UPI') {
            data = {
                method: 'upi',
                vpa: this.state.upiVPA
            }
            this.setState({ paymentMethodTitleCase: 'UPI' });
        }
           this.razorpayChekout(data)
        }   
    }

    razorpayChekout(paymentMethodData) {
        
        const options = {
            description: 'Pay for your Health',
            currency: 'INR',
            key_id: RAZOR_KEY,
            amount: this.state.amount * 100, // here the value is consider as paise so, we have to multiply to 100 
            email: this.userBasicData.email,
            contact: this.userBasicData.mobile_no,
            ...paymentMethodData
        }
        console.log(options);
        Razorpay.open(options).then((data) => {
            // handle success
            this.updatePaymentDetails(true, data, 'online');
            if(this.state.saveCardCheckbox) {
                this.storeCardData();
            }
        }).catch((error) => {
            // handle failure 
             this.updatePaymentDetails(false, error, 'online');
        });
    }
   async updatePaymentDetails(isSuccess, data, modeOfPayment) {
    this.setState({ isLoading: true  })
    let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(isSuccess, data, modeOfPayment, this.state.bookSlotDetails, 'APPOINTMENT', this.userId);
    console.log(response);
    if(response.success) {
        let paymentMethod; 
        if(this.state.paymentOption) {

        }
        this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: this.state.bookSlotDetails, paymentMethod : this.state.paymentMethodTitleCase });
    } else {
        Toast.show({
            text: response.message,
            type: 'warning',
            duration: 3000
        })
    }
    this.setState({ isLoading: false });  
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
   
    async storeCardData() {
      try {
       if (this.state.paymentOption === 'CREDIT_CARD' || this.state.paymentOption === 'DEBIT_CARD') {
        var cardRequestData = {
          card_holder_name: this.state.cardPaymentDetails.name,
          card_number:  this.state.cardPaymentDetails.number.replace(/ /g, ''),
          expiry_m_y: this.state.cardPaymentDetails.monthyear,
          card_type: this.state.paymentOption,
          pay_card_type: this.state.pay_card_type,
          user_type: 'user',
          active: true
       }
        const userId = await AsyncStorage.getItem('userId');
        let endPoint = 'user/payment/ ' + userId;
        putService(endPoint, cardRequestData);
       }
      } catch (error) {
        console.log(error)      
      }

    }
    
    onSelectedItemsChange = (selectedItems) => {
        console.log(selectedItems)
        // this.setState({ selectedItems: [ selectedItems[selectedItems.length - 1] ] });
        this.setState({ selectedItems: selectedItems, selectedNetBank : selectedItems[0] });
    } 
    onCouponPress(coupenCodeText) {
        this.setState({isHidden: true, coupenCodeText : coupenCodeText.toUpperCase()})
      }

    render() {

        const { savedCards } = this.state;
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <Row style={{ marginTop: 10, marginLeft: 15 }}>
                        <Col style={{ width: '60%' }}>
                            <Text style={{ fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold', }}>Select Options To Pay</Text>
                        </Col>
                        <Col style={{ width: '50%' }}>
                            <Text style={{ marginLeft: 40, fontSize: 20, fontFamily: 'OpenSans', fontWeight: 'bold' }}>{'  '}{'\u20B9'}{this.state.amount}</Text>
                        </Col>
                    </Row>

                    <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>Apply Coupons</Text>
                    </Row>
                    <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.6 }}>
                    <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>
                                <Col>
                                
                                    <Form>
                                        
                                    <Input underlineColorAndroid='gray' placeholder="Enter Your 'Coupon' Code here" style={styles.transparentLabel}
                                        getRef={(input) => { this.enterCouponCode = input; }}
                                        keyboardType={'default'}
                                        returnKeyType={'go'}
                                        multiline={false}
                                        value={this.state.coupenCodeText}
                                        onChangeText={enterCouponCode => this.onCouponPress(enterCouponCode)}
                                    />
                                      
                                    </Form>
                                     
                                    <Row>
                                    <Right>
                                    {this.state.isHidden ? 
                                        <Button  style={{marginTop:10,backgroundColor:'#2ecc71',color:'#fff',borderRadius:10}}><Text style={{fontSize:15,fontFamily:'OpenSans',fontWeight:'bold'}}>submit</Text></Button>
                                        :null}
                                        </Right>
                                    </Row>
                                </Col>
                            </Grid>
                            </View>
                            </View>
                            </View>
                   
                   {savedCards.length !== 0 ? <Row>
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: 'gray', marginTop: 40, marginLeft: 15 }}>SAVED CARDS</Text>
                    </Row> : null }

                    <RadioButton.Group
                        onValueChange={value => this.setState({ selectedSavedCardId: value, paymentOption: null })}
                        value={this.state.selectedSavedCardId}>
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
                        onValueChange={value => { 
                            this.setState({ paymentOption: value , selectedSavedCardId : null })
                            if((this.state.paymentOption === 'CREDIT_CARD' && value === 'DEBIT_CARD') || (this.state.paymentOption === 'DEBIT_CARD' && value === 'CREDIT_CARD') ) {
                                this.setState({
                                    cardPaymentDetails : {
                                     name: null,
                                     number: null,
                                     cvv: null,
                                     monthyear: ''
                                   }
                                })
                            }    
                        }}
                        value={this.state.paymentOption}>
                        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                            <RadioButton value="CREDIT_CARD" />
                            <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>Credit Card</Text>
                        </Row>
                        {this.state.paymentOption === "CREDIT_CARD" ? this.renderCreditDebitCard('Credit') : null}

                        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                            <RadioButton value="DEBIT_CARD" />
                            <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>Debit Card</Text>
                        </Row>

                        {this.state.paymentOption === "DEBIT_CARD" ? this.renderCreditDebitCard('Debit') : null}

                        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                            <RadioButton value="NET_BANKING" />
                            <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>Net Banking</Text>
                        </Row>
                        {this.state.paymentOption === "NET_BANKING" ? this.renderNetBanking() : null}

                        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                            <RadioButton value="UPI" />
                            <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>UPI</Text>
                        </Row>
                        {this.state.paymentOption === "UPI" ? this.renderUPI() : null}



                        <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>

                            <Col style={{ width: '80%', flexDirection: 'row' }}>
                                <RadioButton value="WALLET" />
                                <Text style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 15 }}>Wallet</Text>
                            </Col>

                            {/* <Col style={{ width: '20%' }}>
                                <Text style={{ marginTop: 8, fontSize: 16, fontFamily: 'OpenSans', fontWeight: 'bold', color: 'red', marginLeft: 10 }}>{'\u20B9'}1000</Text>
                            </Col> */}


                        </Row>
                        {this.state.paymentOption === "WALLET" ? this.renderWallet() : null}
                    </RadioButton.Group>
                    
                        

                </Content>

                <Footer style={{
                    backgroundColor: '#fff'
                }}>
                    <FooterTab style={{ backgroundColor: '#fff', }}>
                        <Button block onPress={() => this.makePaymentMethod()} block style={styles.paymentButton}><Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold' }}>Pay</Text></Button>
                    </FooterTab>
                </Footer>
            </Container >
        )
    }

    renderCreditDebitCard(cardType) {
        const { cardPaymentDetails } = this.state;
        const { checked } = this.state;
        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.6 }}>
                    <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>
                                <Col>
                                    <Text style={styles.labelTop}>{cardType} Card Holder Name (Optional)</Text>
                                    <Form>
                                   
                                        <Input placeholder="Card Holder Name"
                                         returnKeyType={'next'}
                                         keyboardType={'default'}
                                         
                                            value={cardPaymentDetails ? cardPaymentDetails.name : ''}
                                            onChangeText={(text) => {
                                               var cardPaymentDetails = { ...this.state.cardPaymentDetails }
                                                cardPaymentDetails.name = text;
                                                this.setState({ cardPaymentDetails })
                                            }}
                                            style={styles.transparentLabel} />

                                    </Form>
                                </Col>
                            </Grid>

                            <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                                <Col>
                                    <Text style={styles.labelTop}>Card Number</Text>
                                    <Form>

                                        <Input placeholder="Card Number"
                                            maxLength={19}
                                            returnKeyType={'next'}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.handlingCardNumber(text)}
                                            value={cardPaymentDetails ? cardPaymentDetails.number : ''}
                                            style={styles.transparentLabel} />

                                    </Form>
                                </Col>
                            </Grid>
                            <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>

                                <Col>
                                    <Text style={styles.labelTop}>Expired Date</Text>
                                    <Form>

                                        <Input placeholder='MM/YY'
                                        returnKeyType={'next'}
                                            keyboardType={'numeric'}
                                            value={cardPaymentDetails ? cardPaymentDetails.monthyear : ''}
                                            onChangeText={(text) => this.handlingCardExpiry(text)}
                                            style={styles.transparentLabel} />

                                    </Form>
                                </Col>
                                <Col>
                                    <Text style={styles.labelTop}>CVV</Text>
                                    <Form>

                                        <Input placeholder="CVV"
                                            maxLength={4}
                                            returnKeyType={'next'}
                                            keyboardType={'numeric'}
                                            secureTextEntry={true}
                                            value={cardPaymentDetails ? cardPaymentDetails.cvv : ''}
                                            onChangeText={(text) => {
                                                var cardPaymentDetails = { ...this.state.cardPaymentDetails }
                                                cardPaymentDetails.cvv = text;
                                                this.setState({ cardPaymentDetails })
                                            }}
                                            style={styles.transparentLabel} />

                                    </Form>
                                </Col>

                            </Grid>

                            <Grid style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                                <Row>
                                    <Col>
                                        <Row>
                                        <Checkbox color="green"
                   borderStyle={{ borderColor: '#F44336', 
                   backfaceVisibility: 'visible',
                   borderRadius: 18,
                   borderWidth: 1,
                   padding: 2,}}
                    status={this.state.saveCardCheckbox ? 'checked' : 'unchecked'}
                    onPress={()=> this.setState({ saveCardCheckbox : !this.state.saveCardCheckbox })}        />
                                            {/* <CheckBox checked={} color="grey" onPress={()=> this.setState({ saveCardCheckbox : !this.state.saveCardCheckbox })} ></CheckBox> */}
                                            <Text style={{ marginLeft: 10, color: 'gray', fontFamily: 'OpenSans',marginTop:8 }}>Save creditcard Information</Text>
                                        </Row>
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    </View>
                </View>
            </Content>
        )
    }

    renderNetBanking() {
        const { selectedNetBank } = this.state;
        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.6 }}>
                    <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>
                                <Row>

                                    <Col style={{ width: '50%', alignItems: 'center',justifyContent:'center'}} onPress={() => this.setState({ selectedNetBank: 'SBIN', selectedItems:[] })}>
                                      <TouchableOpacity style={selectedNetBank === 'SBIN' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>
                                        <Image source={require('../../../../assets/images/statebank.png')} style={{ width: 50, height: 50, }} />
                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>State Bank</Text>
                                      </TouchableOpacity> 
                                    </Col>

                                    <Col style={{ width: '50%', alignItems: 'center' }} onPress={() => this.setState({ selectedNetBank: 'UTIB', selectedItems:[] })}>
                                    <TouchableOpacity style={selectedNetBank === 'UTIB' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>

                                        <Image source={require('../../../../assets/images/Axisbank.jpg')} style={{ width: 50, height: 50, }} />
                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>Axis Bank</Text>
                                    </TouchableOpacity>
                                    </Col>
                                    
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                   <Col style={{ width: '50%', alignItems: 'center' }}
                                        onPress={() => this.setState({ selectedNetBank: 'ICIC', selectedItems:[] })}>
                                       <TouchableOpacity style={selectedNetBank === 'ICIC' ? {borderColor:'red',borderWidth:1,padding:15}: { padding:15 } }>

                                        <Image source={require('../../../../assets/images/ICICI.jpg')} style={{ width: 50, height: 50, }}/>
                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>ICICI Bank</Text>
                                    </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '50%', alignItems: 'center' }}
                                         onPress={() => this.setState({ selectedNetBank: 'HDFC', selectedItems: [] })}>
                                       <TouchableOpacity style={selectedNetBank === 'HDFC' ?  {borderColor:'red',borderWidth:1,padding:15} : {padding:15}}>
                                          <Image source={require('../../../../assets/images/HDFCbank.png')} style={{ width: 50, height: 50, }} />
                                          <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>HDFC Bank</Text>
                                    </TouchableOpacity>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col style={{ width: '50%', alignItems: 'center' }}
                                         onPress={() => this.setState({ selectedNetBank: 'IDIB', selectedItems: [] })}>
                                      <TouchableOpacity style={selectedNetBank === 'IDIB' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>
                                        <Image source={require('../../../../assets/images/Indianbank.png')} style={{ width: 50, height: 50, }} />
                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>Indian Bank</Text>
                                    </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '50%' }}>

                                    </Col>
                                </Row>
                                <Card style={{ marginTop: 15, backgroundColor: '#fff', height: 60 }}>
                                    <View>
                                        <SectionedMultiSelect
                                            items={this.availableNetBankingData.filter((ele, index)=> { return index >= 5 })}
                                            uniqueKey="code"
                                            selectText="Other Banks"
                                            color={{ primary: '#3f51b5' }}
                                            showDropDowns={true}
                                            single={true}
                                            onSelectedItemsChange={this.onSelectedItemsChange}
                                            selectedItems={this.state.selectedItems}
                                            hideConfirm={true}
                                            showChips={false}
                                            onCancel={() => this.setState({ selectedItems: [] })}
                                        />
                                    </View>
                                </Card>
                            </Grid>
                        </View>
                    </View>
                </View>
            </Content>
        )
    }

    renderUPI() {
        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.6 }}>
                    <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>
                                <Col>
                                    <Card style={{ padding: 20, borderRadius: 2 }}>
                                        <Form>

                                            <Input
                                            

                                                value={this.state.upiVPA}
                                                onChangeText={(value) => this.setState({ upiVPA: value })}
                                                placeholder="Yourid@upi" placeholderTextColor="#000" style={styles.transparentLabelUpi} />

                                        </Form>
                                        <Text style={{ marginTop: 1, fontSize: 13, fontFamily: 'OpenSans', color: '#000', marginLeft: 5 }}>
                                            Please enter a valid upi id
                      </Text>
                                    </Card>
                                    <View style={{ marginBottom: 10 }} >
                                        <Text style={{ marginTop: 10, fontSize: 13, fontFamily: 'OpenSans', }}>Please enter your VPA and Tap on PAY.You need to approve the request on your UPI App to complete the payment</Text>
                                    </View>
                                </Col>
                            </Grid>
                        </View>
                    </View>
                </View>
            </Content>
        )
    }

    renderWallet() {
        const { selectedWallet} = this.state;
        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.6 }}>
                    <View style={{ borderColor: '#000', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10, alignItems: 'center' }}>
                                <Row >
                                    <Col style={{ width: '50%', alignItems: 'center' }}
                                        onPress={() => this.setState({ selectedWallet: 'olamoney' })}>
                                        <TouchableOpacity style={selectedWallet === 'olamoney' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>
                                            <Image source={require('../../../../assets/images/Ola.jpg')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>Ola Wallet</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '50%', alignItems: 'center' }}
                                         onPress={() => this.setState({ selectedWallet: 'payzapp' })}>
                                         <TouchableOpacity style={selectedWallet === 'payzapp' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>
                                       
                                        <Image source={require('../../../../assets/images/payzapp.png')} style={{ width: 50, height: 50, }} />
                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>PayZapp</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10, }}>
                                    <Col style={{ width: '55%', alignItems: 'center' }}
                                         onPress={() => this.setState({ selectedWallet: 'freecharge' })}>
                                       <TouchableOpacity style={selectedWallet === 'freecharge' ? {borderColor:'red',borderWidth:1,padding:15} : {padding:15} }>
                                          <Image source={require('../../../../assets/images/freecharge.png')} style={{ width: 50, height: 50, }} />
                                          <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>FreeCharge</Text>
                                       </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '50%', alignItems: 'center' }}>
                                      
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    </View>
                </View>
            </Content>
        )
    }

    renderSavedCards(valueOfCreditCard) {
        return (
            <View key={valueOfCreditCard.card_id}> 
                <Row style={{ borderBottomColor: '#000', borderBottomWidth: 0.6, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                    <RadioButton value={valueOfCreditCard.card_id} />
                    <Col style={{ width: '90%', }}>
                        <Row>
                            {/* <Text style={{ color: '#000', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15, marginTop: 8, }}
                            >SBI</Text> */}
                        </Row>
                        <Row>
                            <Text style={{ fontSize: 15, marginTop: 5 }}>{valueOfCreditCard.card_number.substring(0, 4)} **** **** {valueOfCreditCard.card_number.substring(12, 16)}</Text>
                            <Text style={{ fontSize: 15 }}></Text>
                            <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5, color: 'blue', fontWeight: 'bold' }}>{valueOfCreditCard.pay_type_card}</Text>
                        </Row>

                        <Row>
                            <Text style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>provide Valid CVV</Text>
                            <View style={{ width: '25%', alignItems: 'center' }}>
                                <Form>

                                    <Input placeholder="CVV"
                                        maxLength={3}
                                        keyboardType={'numeric'}
                                        secureTextEntry={true}
                                        value={this.state[valueOfCreditCard.card_id + '-savedCardCVV']}
                                        onChangeText={(text) => {
                                           this.setState({ [valueOfCreditCard.card_id + '-savedCardCVV'] : text })
                                        }}
                                        style={{ borderColor: '#000', borderWidth: 1, height: 30, paddingTop: 6, paddingBottom: 6, borderRadius: 5 }} />
                            </Form>
                            </View>
                            <Icon style={{ fontSize: 20, marginTop: 5 }} name="ios-information-circle-outline" />
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

        backgroundColor: '#775DA3',

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
    transparentLabelCpn:
    {

        borderBottomColor: 'transparent',
        backgroundColor: 'gray',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 35,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13
    },
    transparentLabelUpi:
    {

        borderBottomColor: '#000',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        height: 30,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 13,
        paddingTop: 6,
        paddingBottom: 6,
    },

    paymentText: {
        fontFamily: 'OpenSans',
        color: 'gray',
        textAlign: 'center',
        fontSize: 15,

    },
    customizedText:{
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',
        marginLeft: 20

    }
});