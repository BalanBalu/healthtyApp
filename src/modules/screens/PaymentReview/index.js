import React, { Component } from 'react';
import { Container, Toast, Content, Text, Title,Form, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Footer, Thumbnail, Body, Icon, Input, CheckBox } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, TouchableOpacity, View,TextInput } from 'react-native';
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
                         <Row>
                         <Col style={{width:'25%',}}>
                         <Thumbnail square source={{ uri: 'data:image/jpeg;base64,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' }}   style={{ height: 70, width: 70, borderRadius: 10 }} />
                       </Col> 
                       <Col style={{width:'80%',marginTop:10}}>
                        <Text style={styles.userName}>Reshma Guptha </Text>
                        <Text style={styles.userDisease}>Headache</Text>
                       </Col>
                         </Row>
                      {/* <Col style={{alignItems:'center'}}>
                      <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{width:100,height:100,marginTop:-60}}/>
                       <Text style={styles.cardItemText}>Reshma Guptha (M.B.B.S)</Text>
                       <Text style={styles. cardItemText2}>Heart Specialist</Text>
                      </Col> */}
                     </Grid>
                    </CardItem>
                 </Card>
                <Card style={styles.innerCard}>
                <Grid>
                  <Row style={{marginTop:10,marginLeft:10}} >
                   <Icon name="ios-medkit" style={{fontSize:20,marginTop:-5}}/>
                   <Text note style={styles.diseaseText}>Typhoid</Text>
                  </Row>
                 <View style={{marginTop:10,marginLeft:10}} >
                 <Row>
                <Icon name="ios-pin" style={{fontSize:20}}/>
                <Col>
                <Text  style={styles.hospitalText}>Mahatma Gandhi Hospital</Text>
                <Text note style={styles.hosAddressText}>Tonk Rd, near India International School,Ricco Industrial Area,Sitapura,Jaipur,Rajasthan- 600122.</Text>
                </Col>
                </Row>
              </View>
              <Row style={{ borderTopColor:'gray', borderTopWidth:1,marginTop:10}}>
               <Col style={{ borderRightColor:'gray', borderRightWidth:1,marginTop:5,alignItems:'center'}}>
                <Icon name='md-calendar' style={{color:'#0055A5',fontSize:40}} />
                <Text style={{color:'#0055A5'}}>15th November, 2019</Text>
               </Col>
               <Col style={{alignItems:'center',marginTop:5}}>
                <Icon name="md-clock" style={{color:'green',fontSize:40}}/>
                <Text style={{color:'green'}}>07.00 PM - 08.00 PM</Text>
                </Col>
              </Row>
            </Grid>
           <CardItem footer style={styles.cardItem2}>
             <Text style={styles.cardItemText3} >Total Fees - RS.500 /-</Text>
            </CardItem>
            </Card>
              <View>
                  <Row>
                  <Icon name="create" style={{fontSize:20,marginLeft:10, marginTop:15,}}/>
                  <Text style={styles.subText}> Your Reason For Checkup</Text>
                  </Row>
                 <Form style={{marginRight:1,marginLeft:-13}}>
                    <Item>
                      <TextInput multiline={true} placeholder="Write Reason...." style={styles.textInput} />
                    </Item>
                    </Form>
                  </View>
                  <Row style={{justifyContent:'center',}}>
                <Button  style={styles.payButton}>
                 <Text style={styles.payButtonText}>Pay Now</Text>
                 </Button>
                 <Button  style={styles.payButton1}>
                 <Text style={styles.payButtonText}>Pay Later</Text>
                 </Button>
             </Row>
            </View>
          </Content>
      </Container>
            // <Container style={styles.container}>

            //     <Content style={styles.bodyContent}>
            //         <ScrollView>
            //             <Spinner color='blue'
            //                 visible={this.state.isLoading}
            //                 textContent={'Loading...'}
            //             />

            //             <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
            //                 <Row>
            //                     <Col style={{ width: '90%' }}>

            //                         <Text style={styles.customizedText} note>Date And Time</Text>
            //                         <Text style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'DD MMMM, YYYY')}</Text>
            //                         <Text style={styles.customizedText}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm A')} to {bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotEndDateAndTime, 'hh:mm A')}</Text>
            //                         <Text note style={styles.customizedText}></Text>

            //                     </Col>

            //                 </Row>
            //             </Grid>

            //             <Grid style={{ borderBottomWidth: 0, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
            //                 <Row>
            //                     <Col style={{ width: '90%' }}>
            //                         <Text note style={styles.customizedText}>Doctor</Text>
            //                         <Text style={styles.customizedText}>{bookSlotDetails.prefix || ''} {bookSlotDetails.doctorName}</Text>
            //                     </Col>

            //                 </Row>
            //             </Grid>

            //             {bookSlotDetails.slotData ?
            //                 <RenderHospitalAddress gridStyle={{  marginLeft: 20, width: '100%'}}
            //                     textStyle={styles.customizedText}
            //                     hospotalNameTextStyle={{ fontFamily: 'OpenSans-SemiBold' }}
            //                     hospitalAddress={bookSlotDetails.slotData && bookSlotDetails.slotData.location}
            //                 />
            //                 : null}

            //             <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>

            //             </Grid>

            //             <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
            //                 <Row>
            //                     <Col style={{ width: '90%' }}>
            //                         <Text style={styles.customizedText}>fee</Text>
            //                     </Col>
            //                     <Col style={{ width: '90%' }}>
            //                         <Text style={styles.customizedText}>{bookSlotDetails.slotData && bookSlotDetails.slotData.fee}</Text>
            //                     </Col>
            //                 </Row>
            //             </Grid>
            //             <Button block success style={{ borderRadius: 6, margin: 6 }} onPress={() => this.processToPayLater()}>
            //                 <Text style={{fontSize:15,fontFamily:'OpenSans',fontWeight:"bold"}} uppercase={false}>Pay Later</Text>
            //             </Button>
            //             <Button block success style={{ padding: 10, borderRadius: 6, margin: 6, marginBottom: 20 }} onPress={() =>
            //                 this.confirmProceedPayment()}>
            //                 <Text style={{fontSize:15,fontFamily:'OpenSans',fontWeight:"bold"}} uppercase={false} >Pay Now</Text>
            //             </Button>
            //         </ScrollView>
            //     </Content>

            // </Container>

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
          },
          userName:{
            fontFamily:'OpenSans',
            fontSize:18,
            fontWeight:'bold',
            width:'60%',
            color:'#FFF'
          },
          userDisease:{
            fontFamily:'OpenSans',
            fontSize:14,
            color:'#FFF',
            fontStyle: 'italic',
            width:'60%'
          },
      
        
    
});