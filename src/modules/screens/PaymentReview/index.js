import React, { Component } from 'react';
import { Container, Toast, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { bookAppointment, createPaymentRazor } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { RenderHospitalAddress}  from '../../common';
import RazorpayCheckout from 'react-native-razorpay';
//import appIcon from '../../../../assets/Icon.png';



class PaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookSlotDetails: {},
            isLoading:false
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
        try {
        this.setState({isLoading:true})
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
        this.setState({isLoading:false})
        if (resultData.success) {
            Toast.show({
                text: resultData.message,
                type: "success",
                duration: 3000,
            })
            this.props.navigation.navigate('paymentsuccess',{successBookSlotDetails: this.state.bookSlotDetails});

        } else{
            Toast.show({
                text: resultData.message,
                type: "warning",
                duration: 3000,
            })
        }
    } catch(ex) {
        Toast.show({
            text: 'Exception Occured ' + ex,
            type: "warning",
            duration: 3000,
        })
    } finally {
        this.setState({ isLoading: false })
    }
}

    async updatePaymentDetails(isSuccess, data, modeOfPayment) {
        try {
            console.log('is it comign ?') 
            this.setState({isLoading:true});
            const userId = await AsyncStorage.getItem('userId');
            let paymentData = {
              payer_id: userId,
              payer_type: 'user',
              payment_id: data.razorpay_payment_id || modeOfPayment === 'cash' ? 'cash_' +  new Date().getTime() : 'pay_err_' + new Date().getTime(), 
              amount: this.state.bookSlotDetails.slotData.fee,
              amount_paid : !isSuccess || modeOfPayment === 'cash' ? 0 : this.state.bookSlotDetails.slotData.fee,
              amount_due: !isSuccess || modeOfPayment === 'cash' ?  this.state.bookSlotDetails.slotData.fee : 0,
              currency: 'INR',
              service_type: 'APPOINTMENT',
              booking_from: 'APPLICATION',
              is_error: !isSuccess,
              error_message: data.description || null,
              payment_mode : modeOfPayment, 
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
            if(isSuccess) {
                this.confirmPayLater();   
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
     }  catch (error) {
         this.setState({isLoading: false});
          Toast.show({
            text: error,
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
                    
          <Spinner color='blue'
            visible={this.state.isLoading}
            textContent={'Loading...'}
          />

                    <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>

                                <Text style={styles.customizedText} note>Date And Time</Text>
                                <Text style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'DD MMMM, YYYY')}</Text>
                                <Text  style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'HH:mm A')} to {bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotEndDateAndTime, 'DD MMM,YYYY HH:mm A')}</Text>
                                <Text note style={styles.customizedText}></Text>

                            </Col>
                           
                        </Row>
                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text note style={styles.customizedText}>Doctor</Text>

                                <Text style={styles.customizedText}>{bookSlotDetails.doctorName}</Text>

                            </Col>
                           
                        </Row>
                    </Grid>

                    {bookSlotDetails.slotData ? 
                    <RenderHospitalAddress gridStyle={{ padding: 10, marginLeft: 10 , width: '100%'}} 
                        textStyle={styles.customizedText} 
                        hospotalNameTextStyle= {{fontFamily: 'OpenSans-SemiBold'}}
                        hospitalAddress={bookSlotDetails.slotData && bookSlotDetails.slotData.location}
                    />
                    : null }

                                                
                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                       
                    </Grid>

                    <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                        <Row>
                            <Col style={{ width: '90%' }}>
                                <Text style={styles.customizedText}>Apply Coupons</Text>
                                <Input underlineColorAndroid='gray' placeholder="Enter Your 'Coupon' Code here" style={styles.transparentLabel}
                getRef={(input) => { this.enterCouponCode = input; }}
                secureTextEntry={true}
                returnKeyType={'go'}
                value={this.state.password}
                onChangeText={enterCouponCode => this.setState({ enterCouponCode })}
              />
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
                    </Grid>
                    <Button block success style={{ borderRadius: 6, margin: 6 }} onPress={()=> this.updatePaymentDetails(true, {}, 'cash')}>
                        <Text uppercase={false}>payLater</Text>
                    </Button>
                    <Button block success style={{ padding: 10, borderRadius: 6, margin: 6 }} onPress={() => {
                        var options = {
                            description: 'Pay for your Health',
                            image: 'https://png.pngtree.com/svg/20170309/c730f2b69f.svg',
                            currency: 'INR',
                            key: 'rzp_test_1DP5mmOlF5G5ag',
                            amount: '5000',
                            name: 'Sathish Krishnan',
                            prefill: {
                              email: 'sathishkrish20@razorpay.com',
                              contact: '919164932823',
                              name: 'Sathish Krishnan',
                            },
                            theme: {color: '#775DA3'}
                          }
                          RazorpayCheckout.open(options).then((data) => {
                            console.log(data);
                            this.updatePaymentDetails(true, data, 'razor');
                           // alert(`Success: ${data.razorpay_payment_id}`);
                          }).catch((error) => {
                            // handle failure
                            this.updatePaymentDetails(false, error, 'razor');
                            console.log(error);
                            //alert(`Error: ${error.code} | ${error.description}`);
                          });
                      }}>
                        <Text uppercase={false} >Pay Now</Text>
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