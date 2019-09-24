import React, { Component } from 'react';
import { Container, Toast, Content, Text, Title,Form, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View,TextInput } from 'react-native';
import { validateBooking } from '../../providers/bookappointment/bookappointment.action';
import { formatDate , isOnlyLetter} from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { RenderHospitalAddress,renderDoctorImage, getDoctorEducation, getDoctorSpecialist, getAllSpecialist } from '../../common';
//import RazorpayCheckout from 'react-native-razorpay';
import { ScrollView } from 'react-native-gesture-handler';
//import appIcon from '../../../../assets/Icon.png';

import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';

export default class PaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookSlotDetails: {},
            isLoading: false,
             
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
        let { diseaseDescription } = this.state.bookSlotDetails;
        if(!isOnlyLetter(diseaseDescription)) {
            Toast.show({
                text: 'Please enter valid Reason',
                duration: 3000
            })
            return
        }
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
        let { diseaseDescription } = this.state.bookSlotDetails;
        if(!isOnlyLetter(diseaseDescription)) {
            Toast.show({
                text: 'Please enter valid Reason',
                duration: 3000
            })
            return
        }
        console.log(this.state.bookSlotDetails);
        const userId = await AsyncStorage.getItem('userId');
        this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
        let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', this.state.bookSlotDetails, 'APPOINTMENT', userId);
        console.log('Book Appointment Payment Update Response ');
        console.log(response);
        if (response.success) {
            this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: this.state.bookSlotDetails, paymentMethod: 'Cash' });
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

            <Container>
                <Content style={{padding:15}}>
                    <View style={{marginBottom:20}}>
                 <Card transparent>
                    <CardItem header style={styles.cardItem}>
                     <Grid>
                      {/* <Col style={{alignItems:'center'}}>
                      <Thumbnail square source={ renderDoctorImage(bookSlotDetails) } style={{width:100,height:100,marginTop:-60}}/>
                       <Text style={styles.cardItemText}>{bookSlotDetails.prefix || ''} {bookSlotDetails.doctorName} {getDoctorEducation(bookSlotDetails.education)}</Text>
                       <Text style={styles. cardItemText2}>{getAllSpecialist(bookSlotDetails.specialist)}</Text>
                      </Col> */}
                       <Row>
                         <Col style={{width:'25%',}}>
                            <Thumbnail square source={renderDoctorImage(bookSlotDetails)}   style={{ height: 70, width: 70, borderRadius: 10 }} />
                         </Col> 
                         <Col style={{width:'80%',marginTop:10}}>
                            <Text style={styles.cardItemText}>{bookSlotDetails.prefix || ''} {bookSlotDetails.doctorName} {getDoctorEducation(bookSlotDetails.education)}</Text>
                            <Text style={styles. cardItemText2}>{getAllSpecialist(bookSlotDetails.specialist)}</Text>
                          </Col>
                       </Row>
                     </Grid>
                    </CardItem>
                 </Card>
                <Card style={styles.innerCard}>
                <Grid>
                  {/* <Row style={{marginTop:10,marginLeft:10}} >
                   <Icon name="ios-medkit" style={{fontSize:20,marginTop:-5}}/>
                   <Text note style={styles.diseaseText}>Typhoid</Text>
                  </Row> */}
                  {bookSlotDetails.slotData ? 
            <View style={{marginTop:10,marginLeft:10}} >
              <Row>
                <Icon name="ios-pin" style={{fontSize:20}}/>
                <Col>
                <Text  style={styles.hospitalText}>{bookSlotDetails.slotData.location.name}</Text>
                <Text note style={styles.hosAddressText}>{bookSlotDetails.slotData.location.location.address.no_and_street + ', '}
                    {bookSlotDetails.slotData.location.location.address.city + ', '} 
                    {bookSlotDetails.slotData.location.location.address.state + '-'} {bookSlotDetails.slotData.location.location.address.pin_code}.</Text>
                </Col>
                </Row>
              </View> : null}
              <Row style={{ borderTopColor:'gray', borderTopWidth:1,marginTop:10}}>
               <Col style={{ borderRightColor:'gray', borderRightWidth:1,marginTop:5,alignItems:'center'}}>
                <Icon name='md-calendar' style={{color:'#0055A5',fontSize:40}} />
                <Text style={{color:'#0055A5'}}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'Do MMMM, YYYY')}</Text>
               </Col>
               <Col style={{alignItems:'center',marginTop:5}}>
                <Icon name="md-clock" style={{color:'green',fontSize:40}}/>
                <Text style={{color:'green'}}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm A')} - {bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotEndDateAndTime, 'hh:mm A')}</Text>
                </Col>
              </Row>
            </Grid>
           <CardItem footer style={styles.cardItem2}>
             <Text style={styles.cardItemText3} >Total Fees - {'\u20B9'}{bookSlotDetails.slotData && bookSlotDetails.slotData.fee}</Text>
            </CardItem>
            </Card>
              <View>
                  <Row>
                  <Icon name="create" style={{fontSize:20,marginLeft:10, marginTop:15,}}/>
                  <Text style={styles.subText}> Your Reason For Checkup</Text>
                  </Row>
                 <Form style={{marginRight:1,marginLeft:-13}}>
                    <Item>
                      <TextInput 
                        onChangeText={(diseaseDescription)=> { 
                            var bookSlotDetails = {...this.state.bookSlotDetails}
                            bookSlotDetails.diseaseDescription = diseaseDescription;
                            this.setState({bookSlotDetails})  
                        }}
                      multiline={true} placeholder="Write Reason...." 
                      style={styles.textInput} />
                    </Item>
                    </Form>
                  </View>
                  <Row style={{justifyContent:'center',}}>
                <Button  style={styles.payButton} 
                    onPress={() => this.confirmProceedPayment()} >
                    <Text style={styles.payButtonText}>Pay Now</Text>
                </Button>
                 <Button  style={styles.payButton1} onPress={() => this.processToPayLater()}>
                 <Text style={styles.payButtonText}>Pay Later</Text>
                 </Button>
             </Row>
            </View>
          </Content>
      </Container>
           
        )
    }

}

const styles = StyleSheet.create({

    cardItem:{
         backgroundColor:'#784EBC',
         marginTop:0,
         borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent:'center',
        height:100,
         marginTop:50
         },
         cardItemText:{
         fontFamily:'OpenSans',
         fontSize:20,
        height:30,
        fontWeight:'bold',
         color:'#FFF',paddingBottom:-10
         },
         cardItemText2:{
             fontFamily:'OpenSans',
             fontSize:14,
            height:30,
            fontWeight:'bold',
             color:'#FFF',
            paddingBottom:-10
             },
             cardItemText3:{
                 fontFamily:'OpenSans',
                 fontSize:22,
                height:30,
                fontWeight:'bold',
                 color:'#FFF',paddingBottom:-10
                 },
        card: {
          padding: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 10,
          paddingRight: 10,
          paddingLeft: 10,
          borderColor: 'gray',
          borderWidth: 0.5,
          margin: 5,
          width: '98%',
          justifyContent: 'center',
          alignItems: 'center'
    
      },
      innerCard:{
        marginTop:-5,  
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        padding:5
      },
      diseaseText:{
        fontFamily:'OpenSans',
        fontSize:16,
        marginLeft:10,
        fontStyle:'italic',
        marginTop:-5
    },
    hospitalText:{
        fontFamily:'OpenSans',
        fontSize:16,
        marginLeft:15,
        width:"80%"
    },
    hosAddressText:{
        fontFamily:'OpenSans',
        fontSize:16,
        marginLeft:15,
        fontStyle: 'italic',
        width:"80%",
        marginTop:5
    },
    cardItem2:{
         backgroundColor:'#784EBC',
         marginLeft:-5,
         marginBottom:-10,
         marginRight:-5,
         borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        justifyContent:'center',
        height:40,
         marginTop:10
         },
    cardItemText:{
        fontFamily:'OpenSans',
        fontSize:16,
        fontWeight:'bold',
        color:'#FFF'
         },
        subText:{
            fontFamily:'Opensans',
            fontSize:18,
            fontWeight:'bold',
            marginTop:15,
            marginLeft:5
          },
          textInput:{
            borderColor:'gray',
            borderRadius:10,
            borderWidth:0.5,
            height:80,
            fontSize:14,
            textAlignVertical: 'top',
            width:'100%',
            padding: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 10,
            paddingRight: 10,
            marginTop:10
          },
          payButton:{
            borderRadius:10,
            height:40,
            marginTop:20,
            padding:30,
            backgroundColor:'#149C00'
          },
          payButton1:{
            borderRadius:10,
            height:40,
            marginTop:20,
            padding:20,
            marginLeft:20,
            backgroundColor:'#0055A5'
          },
          payButtonText:{
            fontFamily:'OpenSans',
            fontSize:18,
            color:'#fff',
            textAlign:'center',
            fontWeight:'bold'
          }
        
    
});