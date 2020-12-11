import React, { Component } from 'react';
import { Container, Content, Text, Button, FooterTab, Card, Footer, Item, Icon, Input, Toast, Form, Right, Left, Radio, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, View, AsyncStorage, TextInput } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { getAvailableNetBanking, getAvailableWallet, luhnCheck, getPayCardType } from '../../../setup/paymentMethods';
import { putService, getService } from '../../../setup/services/httpservices';
import Razorpay from 'react-native-customui';
import { RAZOR_KEY, BASIC_DEFAULT, SERVICE_TYPES, MAX_PERCENT_APPLY_BY_CREDIT_POINTS } from '../../../setup/config';
import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';
import { getReferalPoints } from '../../providers/profile/profile.action';
import { deleteCartByIds } from '../../providers/pharmacy/pharmacy.action'
import { validatePromoCode, applyPromoCode } from '../../providers/PromoCode/promo.action'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from '../../../components/Spinner';
import { NavigationEvents } from 'react-navigation';


import { connect } from 'react-redux';
import { AuthService } from '../VideoConsulation/services';
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

            bookSlotDetails: null,
            isLoading: false,
            isHidden: false,
            coupenCodeText: null,
            paymentMethodTitleCase: null,
            isPaymentSuccess: false,
            creditPointsApplied: false,
            creditPointDiscountAmount: 0,
            couponCodeDiscountAmount: 0,
            promoCodeErrorMsg: ''

        }
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
    }
    async componentDidMount() {
        this.userId = await AsyncStorage.getItem('userId');

        const { navigation } = this.props;
        const bookSlotDetails = navigation.getParam('bookSlotDetails');
        const serviceType = navigation.getParam('service_type');
        const amount = navigation.getParam('amount');
        debugger
        this.setState({ bookSlotDetails: bookSlotDetails, serviceType: serviceType, amount: amount });

        this.availableNetBankingData = getAvailableNetBanking();
        this.availableWallets = getAvailableWallet();
        this.getSavedCards()
        let userBasicData = await AsyncStorage.getItem('basicProfileData')

        if (userBasicData !== null) {
            this.userBasicData = JSON.parse(userBasicData);
            if (!this.userBasicData.email) {
                this.userBasicData.email = BASIC_DEFAULT.email
            }
            if (!this.userBasicData.mobile_no) {
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
        if (respData.success === true) {
            this.setState({ savedCards: respData.data });
        }
    }



    makePaymentMethod() {
        let data;
        debugger
        if (this.state.selectedSavedCardId === null && this.state.paymentOption === null) {
            Toast.show({
                text: 'Select your Payment Option',
                duration: 3000,
                type: 'warning'
            })
            return false;
        }
        console.log('Selected Saved Card Id ' + this.state.selectedSavedCardId);
        if (this.state.selectedSavedCardId !== null) {
            var savedCards = this.state.savedCards;
            var selectedSavedCardId = this.state.selectedSavedCardId;
            var selectedSavedCardArr = savedCards.filter(function (savedCards) {
                return savedCards.card_id === selectedSavedCardId;
            });
            if (!this.checkCVV(this.state[selectedSavedCardId + '-savedCardCVV'])) {
                Toast.show({
                    text: 'Please enter Valid CVV',
                    duration: 3000,
                    type: 'warning'
                });
                return false;
            }
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

            if (selectedSavedCardArr[0].card_holder_name) {
                //data['card[name]'] = selectedSavedCardArr[0].card_holder_name;
            }

            this.razorpayChekout(data)
        }
        else if (this.state.paymentOption !== null) {
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
                if (!this.checkCVV(this.state.cardPaymentDetails.cvv)) {
                    Toast.show({
                        text: 'Please enter Valid CVV',
                        duration: 3000,
                        type: 'warning'
                    });
                    return false;
                }
                data = {
                    method: 'card',
                    'card[name]': this.state.cardPaymentDetails.name,
                    'card[number]': this.state.cardPaymentDetails.number.replace(/ /g, ''),
                    'card[cvv]': this.state.cardPaymentDetails.cvv,
                    'card[expiry_month]': this.state.cardPaymentDetails.monthyear.split('/')[0],
                    'card[expiry_year]': this.state.cardPaymentDetails.monthyear.split('/')[1],
                }

                let paymentMethodTitleCase = 'Card'  // this.state.paymentOption === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card'
                this.setState({ pay_card_type: getPayCardType(this.state.cardPaymentDetails.number), paymentMethodTitleCase: paymentMethodTitleCase });
            } else if (this.state.paymentOption === 'NET_BANKING') {
                if (this.state.selectedNetBank === null) {
                    Toast.show({
                        text: 'Choose the Bank and Continue',
                        duration: 3000,
                        type: 'warning'
                    })
                    return false;
                }
                data = {
                    method: 'netbanking',
                    bank: this.state.selectedNetBank
                }
                this.setState({ paymentMethodTitleCase: 'Net Banking' });
            } else if (this.state.paymentOption === 'WALLET') {
                if (this.state.selectedWallet === null) {
                    Toast.show({
                        text: 'Choose the Wallet and Continue',
                        duration: 3000,
                        type: 'warning'
                    })
                    return false;
                }
                data = {
                    method: 'wallet',
                    wallet: this.state.selectedWallet
                }
                this.setState({ paymentMethodTitleCase: this.state.selectedWallet });
            } else if (this.state.paymentOption === 'UPI') {
                const re = /[a-zA-Z0-9\.\-]{2,256}\@[a-zA-Z][a-zA-Z]{2,64}/;
                var result = re.test(this.state.upiVPA);
                if (result === false) {
                    Toast.show({
                        text: 'Enter the valid UPI and Continue',
                        duration: 3000,
                        type: 'warning'
                    })
                    return false;
                }
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
        const { amount, creditPointDiscountAmount, couponCodeDiscountAmount } = this.state;
        let finalAmountToPayByOnline = amount - (creditPointDiscountAmount + couponCodeDiscountAmount);
        const options = {
            description: this.state.bookSlotDetails.diseaseDescription || 'Pay for your Health',
            currency: 'INR',
            key_id: RAZOR_KEY,
            amount: finalAmountToPayByOnline * 100, // here the value is consider as paise so, we have to multiply to 100 
            email: this.userBasicData.email,
            contact: this.userBasicData.mobile_no,
            ...paymentMethodData,
            'notes[message]': 'New Appointment Booking: ' + this.userId
        }
        console.log(JSON.stringify(options));
        Razorpay.open(options).then((data) => {
            // handle success
            console.log(data);
            this.updatePaymentDetails(true, data, 'online', finalAmountToPayByOnline);

            if (this.state.saveCardCheckbox) {
                this.storeCardData();
            }

        }).catch((error) => {
            console.log(error);
            this.updatePaymentDetails(false, error, 'online', finalAmountToPayByOnline);
        });
    }

    async updatePaymentDetails(isSuccess, data, modeOfPayment, finalAmountToPayByOnline) {
        this.setState({ isLoading: true, isPaymentSuccess: isSuccess })
        const { serviceType, bookSlotDetails, paymentMethodTitleCase, creditPointDiscountAmount, couponCodeDiscountAmount } = this.state;
        const bookSlotDetailsWithDiscoutData = {
            ...bookSlotDetails,
            creditPointDiscountAmount,
            couponCodeDiscountAmount,
            finalAmountToPayByOnline
        }
        let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(isSuccess, data, modeOfPayment, bookSlotDetailsWithDiscoutData, serviceType, this.userId, paymentMethodTitleCase);
        console.log(response);
        if (response.success) {
            if (this.state.coupenCodeText !== null) {
                this.applyPromoCode()

            }
            if (serviceType === SERVICE_TYPES.APPOINTMENT) {
                const fromNavigation = this.props.navigation.getParam('fromNavigation') || null
                const { creditPointsApplied } = this.state;
                if (creditPointsApplied === true) {
                    setTimeout(() => {
                        getReferalPoints(this.userId);
                    }, 1000)
                }
                this.props.navigation.navigate('paymentsuccess', {
                    successBookSlotDetails: bookSlotDetails,
                    paymentMethod: paymentMethodTitleCase,
                    tokenNo: response.tokenNo,
                    fromNavigation: fromNavigation
                });
            } else if (serviceType === SERVICE_TYPES.CHAT) {
                this.props.navigation.navigate('SuccessChat');
                Toast.show({
                    text: 'Payment Success',
                    type: 'success',
                    duration: 3000
                })
            }
            else if (serviceType === SERVICE_TYPES.PHARMACY) {

                const orderOption = this.props.navigation.getParam('orderOption') || null
                if (orderOption === 'pharmacyCart') {
                    let cart = await AsyncStorage.getItem('cartItems-' + this.userId) || []
                    if (cart.length != 0) {
                        let cartData = JSON.parse(cart)
                        let cartIds = []
                        cartData.forEach(ele => {
                            cartIds.push(ele.id)
                        })
                        deleteCartByIds(cartIds)


                    }

                    await AsyncStorage.removeItem('cartItems-' + this.userId);

                }
                this.props.navigation.navigate('OrderDetails', { serviceId: response.orderNo, prevState: 'CREATE_ORDER' })
                Toast.show({
                    text: 'Payment Success',
                    type: 'success',
                    duration: 3000
                })
            } else if (serviceType === SERVICE_TYPES.VIDEO_CONSULTING) {
                this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: 'Home' });
                Toast.show({
                    text: 'Payment Success',
                    type: 'success',
                    duration: 3000
                })
                if (isSuccess) {
                    AuthService.signup(this.userId);
                }
            }
            else if (serviceType === SERVICE_TYPES.LAB_TEST) {
                this.props.navigation.navigate('SuccessChat', { manualNaviagationPage: 'Home' });
                Toast.show({
                    text: 'Payment Success for Lab Test',
                    type: 'success',
                    duration: 3000
                })
            }
            else if (serviceType === SERVICE_TYPES.HOME_HEALTHCARE) {
                const reqHomeHealthCare = {
                    successBookSlotDetails: bookSlotDetails,
                    paymentMethod: paymentMethodTitleCase,
                    tokenNo: response.tokenNo,
                    isFromHomeHealthCareConfirmation: true,
                }
                this.props.navigation.navigate('paymentsuccess', reqHomeHealthCare);
            }
        }
        else {
            if (serviceType === SERVICE_TYPES.PHARMACY) {
                this.props.navigation.navigate('Home');
                Toast.show({
                    text: 'Payment Failed',
                    type: 'danger',
                    duration: 5000
                })
            } else {
                Toast.show({
                    text: response.message,
                    type: 'warning',
                    duration: 3000
                })
            }
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
    checkCVV(cvvNo) {
        if (!cvvNo) {
            return false;
        }
        const cvv = String(cvvNo);
        if (isNaN(cvv)) {
            return false;
        }
        if (cvv.length === 3 || cvv.length === 4) {
        } else {
            return false;
        }
        return true;
    }
    async storeCardData() {
        try {
            debugger
            if (this.state.paymentOption === 'CREDIT_CARD' || this.state.paymentOption === 'DEBIT_CARD') {
                let savedCards = this.state.savedCards;
                var saveCard = savedCards.find(savedCards => {
                    return savedCards.card_number === this.state.cardPaymentDetails.number.replace(/ /g, '');
                });
                console.log(saveCard)

                var cardRequestData = {
                    card_holder_name: this.state.cardPaymentDetails.name,
                    card_number: this.state.cardPaymentDetails.number.replace(/ /g, ''),
                    expiry_m_y: this.state.cardPaymentDetails.monthyear,
                    card_type: this.state.paymentOption,
                    pay_card_type: this.state.pay_card_type,
                    user_type: 'user',
                    active: true
                }
                if (saveCard) {
                    cardRequestData.card_id = saveCard.card_id;
                }
                console.log('cardRequestData ==> ', cardRequestData)
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
        this.setState({ selectedItems: selectedItems, selectedNetBank: selectedItems[0] });
    }
    onCouponPress(coupenCodeText) {
        if (this.state.promoCodeErrorMsg) {
            this.setState({ coupenCodeText: coupenCodeText, promoCodeErrorMsg: ' ' })
        } else {
            this.setState({ coupenCodeText: coupenCodeText })
        }
    }
    async validatePromoCode() {
        let userId = await AsyncStorage.getItem('userId');
        await this.setState({ isLoading: true })
        if (this.state.coupenCodeText !== null) {
            let reqData = {
                promo_code: this.state.coupenCodeText,
                user_type: "USER",
                service_type: this.state.serviceType,
                consumer_id: userId,
                amount_to_apply_promo_code: this.state.amount
            }
            console.log(JSON.stringify(reqData))
            let result = await validatePromoCode(reqData)
            console.log(JSON.stringify(result))
            if (result.success) {

                this.setState({ couponCodeDiscountAmount: Number(result.data.promoCodeDiscountAmount), promoCodeApplyMsg: result.message, promoCodeErrorMsg: '', isLoading: false })
            } else {
                this.setState({ promoCodeErrorMsg: result.message, promoCodeApplyMsg: '', isLoading: false })
            }
        } else {
            this.setState({ promoCodeErrorMsg: "please enter the promo code", isLoading: false })
        }
    }
    async applyPromoCode() {
        let userId = await AsyncStorage.getItem('userId');

        if (this.state.coupenCodeText !== null) {
            let reqData = {
                promo_code: this.state.coupenCodeText,
                user_type: "USER",
                service_type: this.state.serviceType,
                consumer_id: userId,
                amount_to_apply_promo_code: this.state.amount
            }

            applyPromoCode(reqData)
        }



    }
    async setPaymentByCreditApplied() {
        const hasCreditApplied = !this.state.creditPointsApplied;
        if (hasCreditApplied === true) {
            const maxDicountAmountByCreditPoints = this.getMaximumAmountToBeDiscountByCreditPoints();
            this.setState({ creditPointDiscountAmount: maxDicountAmountByCreditPoints, creditPointsApplied: hasCreditApplied });
        } else {
            this.setState({ creditPointDiscountAmount: 0, creditPointsApplied: hasCreditApplied });
        }
    }
    getMaximumAmountToBeDiscountByCreditPoints() {
        const { amount } = this.state;
        const { profile: { availableCreditPoints } } = this.props;

        let maxDicountAmountByCreditPoints = (amount * MAX_PERCENT_APPLY_BY_CREDIT_POINTS) / 100;
        if (availableCreditPoints < maxDicountAmountByCreditPoints) {
            maxDicountAmountByCreditPoints = availableCreditPoints;
        }
        return Math.round(maxDicountAmountByCreditPoints);
    }
    async backNavigation(payload) {
        let hasReload = this.props.navigation.getParam('hasReload') || false
        if (hasReload) {
            let coupenCodeText = this.props.navigation.getParam('coupenCodeText') || null;
            await this.setState({ coupenCodeText })
            this.validatePromoCode()
        }
    }
    render() {

        const { savedCards, isLoading, isPaymentSuccess, amount, couponCodeDiscountAmount, creditPointDiscountAmount } = this.state;
        const maxDicountAmountByCreditPoints = this.getMaximumAmountToBeDiscountByCreditPoints();
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }} />
                    <Spinner
                        visible={isLoading}
                    // textContent={isPaymentSuccess ? "We are Booking your Appoinmtent" : "Please wait..."}
                    />

                    <View style={{ backgroundColor: '#f2f2f2' }}>
                        <View style={{ marginTop: 10, marginBottom: 10, paddingBottom: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', marginLeft: 15, }}>Select Options To Pay</Text>
                            <Grid style={{ marginRight: 15, marginLeft: 15, marginTop: 5 }}>
                                <Col>
                                    <Form>
                                        <Item style={styles.transparentLabel1}>
                                            <Input placeholder="Enter Your Coupon Code here" style={styles.firstTransparentLabel}
                                                placeholderTextColor="#C1C1C1"
                                                getRef={(input) => { this.enterCouponCode = input; }}
                                                keyboardType={'default'}
                                                returnKeyType={'go'}
                                                multiline={false}
                                                value={this.state.coupenCodeText}
                                                onChangeText={enterCouponCode => this.onCouponPress(enterCouponCode)}
                                            />
                                            <TouchableOpacity onPress={() => this.validatePromoCode()} style={{ marginRight: 15, alignItems: 'center', justifyContent: 'center' }} >
                                                <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#775DA3', textAlign: 'center' }}>APPLY</Text>
                                            </TouchableOpacity>
                                        </Item>
                                    </Form>
                                </Col>
                            </Grid>

                            <Text style={{ color: 'green', marginLeft: 15, marginTop: 10 }}>{this.state.promoCodeApplyMsg}</Text>
                            <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{this.state.promoCodeErrorMsg}</Text>
                            <Row style={{ marginRight: 15, marginLeft: 15, marginTop: 10 }}>
                                <Right style={{ marginRight: 5 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("PromoCode")}>
                                        <Text style={{ fontSize: 12, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#775DA3', borderBottomColor: '#775DA3', borderBottomWidth: 0.5, borderStyle: 'dotted', }}>Available Promo Codes</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Row>
                        </View>
                    </View>
                    <Grid style={{ marginTop: 10, marginLeft: 15, backgroundColor: '#FFF' }}>

                        <Row style={{ marginTop: 10, marginLeft: -3 }}>

                            <Text style={{
                                fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold',
                            }}> Payment Info</Text>

                        </Row>
                        <Row style={{ marginTop: 10, marginLeft: -3 }}>
                            <Col style={{ width: '70%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: '#333333', fontSize: 13, }}> Amount </Text>
                            </Col>
                            <Col style={{ width: '30%' }}>
                                <Text style={{ marginLeft: 40, fontFamily: 'OpenSans', fontSize: 13, color: '#333333' }}>{'  '}{'\u20B9'}{amount}</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10, marginLeft: -3 }}>
                            <Col style={{ width: '70%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: '#333333', fontSize: 13 }}> Credit Points </Text>
                            </Col>
                            <Col style={{ width: '30%' }}>
                                <Text style={{ marginLeft: 40, fontFamily: 'OpenSans', fontSize: 13, color: '#333333' }}>{'  '}{'\u20B9'}{creditPointDiscountAmount}</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: 10, marginLeft: -3 }}>
                            <Col style={{ width: '70%' }}>
                                <Text style={{ fontFamily: 'OpenSans', color: '#333333', fontSize: 13 }}> Coupon Discount </Text>
                            </Col>
                            <Col style={{ width: '30%' }}>
                                <Text style={{ marginLeft: 40, fontFamily: 'OpenSans', fontSize: 13, color: '#333333' }}>{'  '}{'\u20B9'}{couponCodeDiscountAmount}</Text>
                            </Col>
                        </Row>


                        <Row style={{ borderTopColor: '#C1C1C1', borderTopWidth: 0.3, marginTop: 10, marginBottom: 5, marginRight: 15, marginLeft: -3 }}>
                            <Col style={{ width: '70%', marginTop: 5 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 13 }}> Final Amount </Text>
                            </Col>
                            <Col style={{ width: '30%', marginTop: 5 }}>
                                <Text style={{ marginLeft: 40, fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 13 }}>{'  '}{'\u20B9'}{amount - (creditPointDiscountAmount + couponCodeDiscountAmount)}</Text>
                            </Col>
                        </Row>
                    </Grid>

                    {maxDicountAmountByCreditPoints > 0 ?
                        <Grid style={{ backgroundColor: '#fff' }}>
                            <Row style={{ marginTop: 15 }}>
                                <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', marginLeft: 15, }}>CREDIT POINTS</Text>

                            </Row>
                            <Row style={{ paddingLeft: 5, alignItems: 'center', marginTop: 10 }}>


                                <CheckBox style={{ borderRadius: 5 }}
                                    status={this.state.creditPointsApplied ? true : false}
                                    checked={this.state.creditPointsApplied}
                                    onPress={() => this.setPaymentByCreditApplied()}
                                />
                                <Text style={{ fontFamily: 'OpenSans', color: '#333333', fontSize: 13, width: '90%', marginLeft: 20 }}>Apply your {maxDicountAmountByCreditPoints} credit points to pay your appointment</Text>
                            </Row>
                        </Grid> : null}

                    {/* <Grid style={{ backgroundColor: '#fff'}}>       
                        <Row style={{ padding: 1, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: 'gray', marginTop: 10, }}>COUPONS</Text>
                        </Row>
                        
                        <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#000', borderBottomWidth: 0.3 }}>
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
                                            <Button style={{marginTop:10,backgroundColor:'#2ecc71',color:'#fff',borderRadius:10}}><Text style={{fontSize:15,fontFamily:'OpenSans',fontWeight:'bold'}}>submit</Text></Button>
                                        </Right>
                                    </Row>
                                </Col>
                            </Grid>
                            </View>
                            </View>
                            </View>
                        </Grid> */}



                    {savedCards.length !== 0 ? <Row>
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: 'gray', marginTop: 40, marginLeft: 15 }}>SAVED CARDS</Text>
                    </Row> : null}

                    <Grid>
                        <View style={{ marginTop: 10, justifyContent: 'center' }}>
                            {savedCards.map(element => {
                                return this.renderSavedCards(element)
                            })}
                        </View>
                    </Grid>
                    <Row style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold' }}>Payment Options</Text>
                    </Row>

                    {/* <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', paddingLeft: 15, paddingBottom: 15, paddingRight: 15, marginLeft: 10, marginRight: 10 }}>
                            <Col style={{ width: '90%', }}>
                                <TouchableOpacity onPress={() => this.setState({ paymentOption: 'CREDIT_CARD' })} style={{ flexDirection: 'row' }}>
                                    <RadioButton value="CREDIT_CARD" />
                                    <Text //onPress={()=> this.setState({ paymentOption : 'CREDIT_CARD' })}
                                        style={{ marginTop: 8, fontFamily: 'OpenSans', fontSize: 14 }}>Credit Card</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        {this.state.paymentOption === "CREDIT_CARD" ? this.renderCreditDebitCard('Credit') : null} */}

                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                        <Col style={{ width: '90%', }}>
                            <TouchableOpacity onPress={() => this.setState({ paymentOption: 'DEBIT_CARD', selectedSavedCardId: null })} style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Radio
                                    standardStyle={true}
                                    selected={this.state.paymentOption === "DEBIT_CARD" ? true : false}
                                    onPress={() => this.setState({ paymentOption: "DEBIT_CARD", selectedSavedCardId: null })} />
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, marginLeft: 10 }}>Debit/Credit Card</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>

                    {this.state.paymentOption === "DEBIT_CARD" ? this.renderCreditDebitCard('Debit') : null}

                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                        <Col style={{ width: '90%', }}>
                            <TouchableOpacity onPress={() => this.setState({ paymentOption: 'NET_BANKING', selectedSavedCardId: null })} style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Radio
                                    standardStyle={true}
                                    selected={this.state.paymentOption === "NET_BANKING" ? true : false}
                                    onPress={() => this.setState({ paymentOption: "NET_BANKING", selectedSavedCardId: null })} />
                                <Text
                                    //onPress={()=> this.setState({ paymentOption : 'NET_BANKING' })}
                                    style={{ fontFamily: 'OpenSans', fontSize: 14, marginLeft: 10 }}>Net Banking</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    {this.state.paymentOption === "NET_BANKING" ? this.renderNetBanking() : null}

                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                        <Col style={{ width: '90%', }}>
                            <TouchableOpacity onPress={() => this.setState({ paymentOption: 'UPI', selectedSavedCardId: null })} style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <Radio
                                    standardStyle={true}
                                    selected={this.state.paymentOption === "UPI" ? true : false}
                                    onPress={() => this.setState({ paymentOption: "UPI", selectedSavedCardId: null })} />
                                <Text
                                    //onPress={()=> this.setState({ paymentOption : 'UPI' })}
                                    style={{ fontFamily: 'OpenSans', fontSize: 14, marginLeft: 10 }}>UPI</Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    {this.state.paymentOption === "UPI" ? this.renderUPI() : null}



                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>

                        <Col style={{ width: '90%', }}>
                            <TouchableOpacity onPress={() => this.setState({ paymentOption: 'WALLET', selectedSavedCardId: null })} style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <Radio
                                    standardStyle={true}
                                    selected={this.state.paymentOption === "WALLET" ? true : false}
                                    onPress={() => this.setState({ paymentOption: "WALLET", selectedSavedCardId: null })} />
                                <Text
                                    //onPress={()=> this.setState({ paymentOption : 'WALLET' })}
                                    style={{ fontFamily: 'OpenSans', fontSize: 13, marginLeft: 10 }}>Wallet</Text>
                            </TouchableOpacity>
                        </Col>

                        {/* <Col style={{ width: '20%' }}>
                                <Text style={{ marginTop: 8, fontSize: 16, fontFamily: 'OpenSans', fontWeight: 'bold', color: 'red', marginLeft: 10 }}>{'\u20B9'}1000</Text>
                            </Col> */}


                    </Row>
                    {this.state.paymentOption === "WALLET" ? this.renderWallet() : null}



                </Content>

                <Footer style={{
                    backgroundColor: '#fff'
                }}>
                    <FooterTab style={{ backgroundColor: '#fff', }}>
                        <Button block onPress={() => this.makePaymentMethod()} block style={styles.paymentButton}>
                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold' }}>Pay</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container >
        )
    }

    renderCreditDebitCard(cardType) {
        const { cardPaymentDetails } = this.state;

        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                    <View style={{ borderColor: '#C1C1C1', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>

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
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>
                                <Col>
                                    <Text style={styles.labelTop}>Card Holder Name (Optional)</Text>
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


                            <Grid style={{ marginTop: 10, marginLeft: 10 }}>
                                <Row>
                                    <Col>
                                        <Row>
                                            <CheckBox style={{ borderRadius: 5 }}
                                                status={this.state.saveCardCheckbox ? true : false}
                                                checked={this.state.saveCardCheckbox}
                                                onPress={() => this.setState({ saveCardCheckbox: !this.state.saveCardCheckbox })}
                                            />
                                            <Text style={{ color: 'gray', fontFamily: 'OpenSans', marginLeft: 20 }}>Save card for faster transaction</Text>
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
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                    <View style={{ borderColor: '#C1C1C1', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10 }}>



                                <Row>
                                    <Col style={selectedNetBank === 'SBIN' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedNetBank: 'SBIN', selectedItems: [] })}>
                                            <Image source={require('../../../../assets/images/statebank.png')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, }}>State Bank</Text>
                                        </TouchableOpacity>
                                    </Col>

                                    <Col style={selectedNetBank === 'UTIB' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedNetBank: 'UTIB', selectedItems: [] })}>
                                            <Image source={require('../../../../assets/images/Axisbank.jpg')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>Axis Bank</Text>
                                        </TouchableOpacity>
                                    </Col>

                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col style={selectedNetBank === 'ICIC' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedNetBank: 'ICIC', selectedItems: [] })}>

                                            <Image source={require('../../../../assets/images/ICICI.jpg')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>ICICI Bank</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={selectedNetBank === 'HDFC' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedNetBank: 'HDFC', selectedItems: [] })}>
                                            <Image source={require('../../../../assets/images/HDFCbank.png')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>HDFC Bank</Text>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col style={selectedNetBank === 'IDIB' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedNetBank: 'IDIB', selectedItems: [] })}>
                                            <Image source={require('../../../../assets/images/Indianbank.png')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>Indian Bank</Text>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col style={{ width: '50%', marginLeft: 5 }}>

                                    </Col>
                                </Row>
                                <Card style={{ marginTop: 15, backgroundColor: '#fff', height: 60 }}>
                                    <View>
                                        <SectionedMultiSelect
                                            items={this.availableNetBankingData.filter((ele, index) => { return index >= 5 })}
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
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                    <View style={{ borderColor: '#C1C1C1', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
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
        const { selectedWallet } = this.state;
        return (
            <Content>
                <View style={{ backgroundColor: '#fff', marginLeft: 10, marginRight: 10, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                    <View style={{ borderColor: '#C1C1C1', borderWidth: 1, backgroundColor: '#f2f2f2', borderRadius: 5, marginLeft: 10, marginRight: 10, marginTop: 10, marginBottom: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <Grid style={{ marginRight: 10, marginLeft: 10, alignItems: 'center' }}>
                                <Row>
                                    <Col style={selectedWallet === 'freecharge' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedWallet: 'freecharge' })}>
                                            <Image source={require('../../../../assets/images/freecharge.png')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>FreeCharge</Text>
                                        </TouchableOpacity>
                                    </Col>

                                    <Col style={selectedWallet === 'payzapp' ? { width: '50%', alignItems: 'center', borderColor: 'red', borderWidth: 1, } : { width: '50%', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity style={{ padding: 15 }} onPress={() => this.setState({ selectedWallet: 'payzapp' })}>

                                            <Image source={require('../../../../assets/images/payzapp.png')} style={{ width: 50, height: 50, }} />
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans', marginTop: 5, textAlign: 'center' }}>PayZapp</Text>
                                        </TouchableOpacity>
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
                <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, backgroundColor: '#fff', padding: 15, marginLeft: 10, marginRight: 10 }}>
                    <Col style={{ width: '10%', marginTop: 5 }}>
                        <Radio
                            standardStyle={true}
                            status={valueOfCreditCard.card_id === this.state.selectedSavedCardId && this.state.paymentOption === null ? true : false}
                            selected={this.state.selectedSavedCardId === valueOfCreditCard.card_id ? true : false}
                            onPress={() => this.setState({ selectedSavedCardId: valueOfCreditCard.card_id, paymentOption: null })}
                        />
                    </Col>

                    <Col style={{ width: '90%', marginLeft: 5, justifyContent: 'center' }}>
                        <Row>
                            {/* <Text style={{ color: '#000', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15, marginTop: 8, }}
                            >SBI</Text> */}
                        </Row>
                        <Row onPress={() => this.setState({ selectedSavedCardId: valueOfCreditCard.card_id, paymentOption: null })}>
                            <Text style={{ fontSize: 15, marginTop: 5 }}>{valueOfCreditCard.card_number.substring(0, 4)} **** **** {valueOfCreditCard.card_number.substring(12, 16)}</Text>
                            <Text style={{ fontSize: 15 }}></Text>
                            <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5, color: 'blue', fontWeight: 'bold' }}>{valueOfCreditCard.pay_type_card}</Text>
                        </Row>

                        <Row onPress={() => this.setState({ selectedSavedCardId: valueOfCreditCard.card_id, paymentOption: null })}
                        >
                            <Text
                                style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>provide Valid CVV</Text>
                            <View style={{ width: '25%', alignItems: 'center' }}>
                                <Form>

                                    <Input placeholder="CVV"
                                        maxLength={4}
                                        onFocus={() => this.setState({ selectedSavedCardId: valueOfCreditCard.card_id, paymentOption: null })}
                                        keyboardType={'numeric'}
                                        secureTextEntry={true}
                                        value={this.state[valueOfCreditCard.card_id + '-savedCardCVV']}
                                        onChangeText={(text) => {
                                            this.setState({ [valueOfCreditCard.card_id + '-savedCardCVV']: text })
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
function propState(state) {
    return {
        profile: state.profile
    }
}
export default connect(propState)(PaymentPage)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0,

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
        fontSize: 13,
        color: '#000',
        marginLeft: 10


    },
    transparentLabel:
    {
        borderBottomColor: 'transparent',
        color: '#000',
        backgroundColor: '#fff',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 12
    },
    firstTransparentLabel:
    {
        color: '#000',
        fontFamily: 'OpenSans',
        fontSize: 12
    },
    transparentLabel1:
    {
        borderBottomColor: 'transparent',
        color: '#000',
        backgroundColor: '#fff',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 12
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

        borderBottomColor: '#C1C1C1',
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
    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',
        marginLeft: 20

    }
});