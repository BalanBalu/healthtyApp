import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View,CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import { viewUserReviews, bindDoctorDetails, appointmentStatusUpdate, appointmentDetails, getPaymentInfomation,getUserRepportDetails } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, dateDiff } from '../../../setup/helpers';

import { Loader } from '../../../components/ContentLoader'
import { InsertReview } from '../Reviews/InsertReview'
import { renderDoctorImage, RenderHospitalAddress, getAllEducation, getAllSpecialist, getName, getDoctorExperience,getHospitalHeadeName,getHospitalName } from '../../common'
class AppointmentDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      appointmentId: '',
      doctorId: '',
      userId: '',
      reviewData: [],
      reportData:[],
      doctorData: {},
      isLoading: true,

      // appointmentStatus: '',
      statusUpdateReason: ' ',
      education: '',
      specialist: '',
      hospital: [],
      selectedTab: 0,
      paymentDetails: {},
      modalVisible: false,


    }

  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem('userId');
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');

    if (appointmentData == undefined) {
      const appointmentId = navigation.getParam('appointmentId');
      this.props.navigation.setParams({ reportedId: appointmentId });
      await this.setState({ appointmentId: appointmentId });
      await new Promise.all([
        this.appointmentDetailsGetById(),
        this.getUserReviews(),
        this.getUserReport(),
      ]);
    }
    else {
      let doctorId = appointmentData.doctor_id;
      let appointmentId = appointmentData._id;
      const selectedTab = navigation.getParam('selectedIndex');
      this.props.navigation.setParams({ reportedId: appointmentId });

      if (appointmentData.appointment_status == 'COMPLETED' && appointmentData.is_review_added == undefined) {
        await this.setState({ modalVisible: true })
      }
      await this.setState({
        doctorId: doctorId, appointmentId: appointmentId,
        userId: userId, data: appointmentData, selectedTab
      })

      await new Promise.all([
        this.getPaymentInfo(appointmentData.payment_id),
        this.getDoctorDetails(),
        this.getUserReviews(),
        this.getUserReport(),
      ])

    }

    await this.setState({ isLoading: false })
  }

  /* Get Doctor Details */
  getDoctorDetails = async () => {
    try {

      let fields = 'first_name,last_name,prefix,education,specialist,email,mobile_no,experience,hospital,language,professional_statement,fee,profile_image';
      let resultDetails = await bindDoctorDetails(this.state.doctorId, fields);

      if (resultDetails.success) {
        let educationDetails = '';
        if (resultDetails.data.education != undefined) {
          educationDetails = getAllEducation(resultDetails.data.education)
        }
        let specialistDetails = '';
        if (resultDetails.data.specialist != undefined) {
          specialistDetails = getAllSpecialist(resultDetails.data.specialist)
        }
        let hospitalData = [];
        if (resultDetails.data.hospital != undefined) {
          resultDetails.data.hospital.map(hospital_ele => {
            if (hospital_ele.hospital_id == this.state.data.hospital_id)
              hospitalData = hospital_ele;
          })
        }
        this.setState({
          education: educationDetails,
          doctorData: resultDetails.data,
          specialist: specialistDetails.toString(),
          hospital: hospitalData
        })
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  /* get User reviews */
  getUserReviews = async () => {
    try {
      let resultReview = await viewUserReviews('appointment', this.state.appointmentId, '?skip=0');
      if (resultReview.success) {
        this.setState({ reviewData: resultReview.data });
      }
    }
    catch (e) {
      console.error(e);
    }


  }
  getUserReport = async () => {
    try {
      let resultReport = await getUserRepportDetails('appointment', this.state.appointmentId, '?skip=1');

      if (resultReport.success) {
        
        this.setState({ reportData: resultReport.data });
      }
    }
    catch (e) {
      console.error(e);
    }


  }

  appointmentDetailsGetById = async () => {
    try {
      let result = await appointmentDetails(this.state.appointmentId);
      if (result.success) {
        this.setState({ doctorId: result.data[0].doctor_id, data: result.data[0] }),
          await new Promise.all([
            this.getDoctorDetails(),
            this.getPaymentInfo(result.data[0].payment_id)])
      }
      if (result.data[0].appointment_status == 'COMPLETED' && result.data[0].is_review_added == undefined) {
        await this.setState({ modalVisible: true })
      }
    } catch (error) {
      console.error(error);
    }

  }
  getPaymentInfo = async (paymentId) => {
    try {
      let result = await getPaymentInfomation(paymentId);
      if (result.success) {
        this.setState({ paymentDetails: result.data[0] })
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  navigateAddReview() {
    this.setState({
      modalVisible: true
    });
  
  }

  /* Update Appoiontment Status */

  updateAppointmentStatus = async (data, updatedStatus) => {
    try {
      this.setState({ isLoading: true });
      let userId = await AsyncStorage.getItem('userId');
      let requestData = {
        doctorId: data.doctor_id,
        userId: userId,
        startTime: data.appointment_starttime,
        endTime: data.appointment_endtime,
        status: updatedStatus,
        statusUpdateReason: this.state.statusUpdateReason,
        status_by: 'USER'
      };

      let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
      this.setState({ isLoading: false })
      // let appointmentStatus = result.appointmentData.appointment_status;
      if (result.success) {
        let temp = this.state.data
        temp.doctor_id = result.appointmentData.doctor_id;
        temp.appointment_starttime = result.appointmentData.appointment_starttime;
        temp.appointment_endtime = result.appointmentData.appointment_endtime;
        temp.appointment_status=result.appointmentData.appointment_status
        Toast.show({
          text: result.message,
          duration: 3000
        })
        // this.setState({ appointmentStatus: appointmentStatus, data: temp });
        this.setState({data: temp });
      }
    }
    catch (e) {
      console.log(e);
    }
  }


  navigateCancelAppoointment() {
    this.state.data.prefix = this.state.doctorData.prefix;
    const { navigation } = this.props;
    const fromNotification = navigation.getParam('fromNotification');

    if (fromNotification == true || fromNotification != undefined) {
      let doctorInfo = {
        first_name: this.state.doctorData.first_name,
        last_name: this.state.doctorData.last_name
      }
      this.state.data.doctorInfo = doctorInfo;
    }

    this.props.navigation.navigate('CancelAppointment', { appointmentDetail: this.state.data })

  }

  async backNavigation() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      if (navigation.state.params.hasReloadReportIssue) {
        this.getUserReport();  // Reload the Reported issues when they reload
      }
    };
  }

  async  getvisble(val) {
    try {
      await this.setState({ isLoading: true, modalVisible : false })
      if(val.updatedVisible==true) {
          this.getUserReviews()
      }
    } catch (e) {
      console.log(e)
    }
    finally {
      await this.setState({ isLoading: false })
    }
  }


  render() {
    const { data, reviewData,reportData, doctorData, education, specialist, hospital, isLoading, selectedTab, paymentDetails } = this.state;

    return (
 <Container style={styles.container}>
        <Content style={styles.bodyContent}>
        {isLoading == true ? <Loader style={'appointment'} /> :
             <View style={{marginBottom:20}}>
               <Card  style={{
	                  borderRadius:10,
			            }}>   
                    <NavigationEvents
					            onWillFocus={payload => { this.backNavigation(payload) }}
				            />   
                
                    <CardItem header style={styles.cardItem}>
                  
                     <Grid>
                       <Row>
                         <Col style={{width:'25%',}}>
                             <Thumbnail square source={renderDoctorImage(doctorData)}   style={{ height: 70, width: 70, borderRadius: 10 }} /> 
                         </Col> 
                         <Col style={{width:'80%',marginTop:10}}>
                             <Text  style={styles.Textname} >{(doctorData && doctorData.prefix != undefined ? doctorData && doctorData.prefix + ' ' : '') + (getName(doctorData)) + ','}</Text>
                            {/* <Text style={styles. cardItemText2}>{getUserGenderAndAge(data && data.userInfo)}</Text>  */}
                         </Col>
                       </Row>
                     </Grid>
                    </CardItem>
                   
                   <Grid>
                  <Row>
                    <Col size={6}>
                     <Row style={{marginTop:10,marginLeft:5}}>
                      <Text style={styles.subText1}>Experience</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>{getDoctorExperience(doctorData.calulatedExperience)}</Text>
                     </Row>
                    <Row style={{marginTop:10,marginLeft:5}}>
                      <Text style={styles.subText1}>Payment Method</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>{paymentDetails.payment_method||0}</Text>
                    </Row>
                  </Col>
                {data.appointment_status=='APPROVED'||data.appointment_status == 'PENDING' ?
                  <Col size={4}>
                     <Row style={{marginTop:10 }}>
                       <Button  style={styles.confirmButton} onPress={() => this.doAccept(data, 'APPROVED')}>
                        <Text  style={styles.ButtonText}>CANCEL APPOINTMENT </Text>
                       </Button>
                     </Row>
                     <Row style={{marginTop:10 }}>
                       <Button style={styles.postponeButton}  onPress={() => { 	this.props.navigation.push('proposeNewTime', { data:data})}}>
                          <Text capitalise={true} style={styles.ButtonText}>POSTPONE</Text>
                       </Button>
                     </Row>
                  </Col>:  data.appointment_status == 'PROPOSED_NEW_TIME' ?
                  <Col size={4}>
                  <Row style={{marginTop:10 }}>
                    <Button  style={styles.confirmButton} onPress={() => this.doAccept(data, 'APPROVED')}>
                     <Text  style={styles.ButtonText}>ACCEPT</Text>
                    </Button>
                  </Row>
                  <Row style={{marginTop:10 }}>
                    <Button style={styles.postponeButton}  onPress={() => { 	this.props.navigation.push('proposeNewTime', { data:data})}}>
                       <Text capitalise={true} style={styles.ButtonText}>POSTPONE</Text>
                    </Button>
                  </Row>
               </Col>
                  : data.appointment_status == 'APPROVED' &&  formatDate(data.appointment_endtime, 'YYYY-MM-DD hh:mm') <formatDate(new Date(), 'YYYY-MM-DD hh:mm') ?

                     <Col size={4}>
                       <Row style={{marginTop:10 }}>
                   <Button  style={[styles.confirmButton, { backgroundColor : '#08BF01'}]}   onPress={() => this.doAccept(data, 'COMPLETED')}>
                 <Text style={styles.ButtonText}>COMPLETED</Text>
                       </Button>
                       </Row>
                  </Col>: data.appointment_status == 'APPROVED'&& data.onGoingAppointment === true && 
                  <Text style={{marginLeft:20, fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold',color:'green' }}>ONGOING</Text>
                  }
              </Row>
            </Grid>
           <CardItem footer style={styles.cardItem2}>
             <Grid>
              <Row style={{height:25,marginRight:5}} >
                <Col style={{width:'50%',}}>
                  <Row>
                    <Icon name='md-calendar' style={styles.iconStyle}/>
                    <Text style={styles.timeText}>{formatDate(data.appointment_starttime,'Do MMM,YYYY')}</Text>
                    
                  </Row>
                </Col>
                <Col style={{width:'50%',marginLeft:5,}}>
                 <Row>
                   <Icon name="md-clock" style={styles.iconStyle}/>
                   <Text style={styles.timeText}>{formatDate(data.appointment_starttime,'hh:mm a') +'-' + formatDate(data.appointment_endtime,'hh:mm a')}</Text>
                  
                 </Row>
                </Col>
                </Row>
               </Grid>
             </CardItem>
           
          </Card>


            <Grid>
            {formatDate(data.appointment_starttime,'DD/MM/YYYY')==formatDate(new Date(),'DD/MM/YYYY')&&data.appointment_status=='APPROVED'?
            <Row style={styles.rowStyle}>
              <TouchableOpacity style={styles.touchableStyle}>
                <Row>
                <Icon name='md-cloud-upload' style={{color:'#4765FF',fontSize:25}}/>
                <Text style={styles.touchableText}>Upload Your Prescription</Text>
                </Row>
              </TouchableOpacity>
            </Row>:null}
            <View style={{marginTop:10}}>
            <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-medkit" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Diesease</Text>
              <Text note style={styles.subTextInner1}>{data.disease_description||''}</Text>
              </Col>
            </Row>
           
            {data.patient_statment!=undefined?
            <Row  style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                <Icon name="ios-create" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Patient Stament</Text>
                 <Text note style={styles.subTextInner1}>{data.disease_description}</Text>
              </Col>
            </Row>:null}
            <Row  style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-pin" style={{fontSize:20,}}/>
               </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Hospital</Text>
                 <Text  style={styles.subTextInner1}>{getHospitalHeadeName(hospital)}</Text>
                 <Text note style={styles.subTextInner1}>{getHospitalName(hospital)}</Text>
              </Col>
            </Row>
            <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-contact" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Personal Details</Text>
                 <Row style={{marginTop:10}}>
              <Col style={{width:'25%'}}>
                  <Text style={styles.downText}>Email
                  </Text>
              </Col>
              <Col  style={{width:'10%'}}>
                <Text style={styles.downText}>:</Text>
              </Col>
              <Col  style={{width:'65%'}}>
            <Text note style={styles.downText}>{doctorData && doctorData.email}</Text>
              </Col>
            </Row>
            <Row style={{marginTop:10}}>
              <Col style={{width:'25%'}}>
                  <Text style={styles.downText}>Contact
                  </Text>
              </Col>
              <Col  style={{width:'10%'}}>
                <Text style={styles.downText}>:</Text>
              </Col>
              <Col  style={{width:'65%'}}>
            <Text note style={styles.downText}>{doctorData && doctorData.mobile_no||'N/A'} </Text>
              </Col>
            </Row>
              </Col>
            </Row>
            
            {doctorData.language != undefined && doctorData.language.length != 0 ?
            <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-book" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Languages speaks By Doctor</Text>
              <Text note style={styles.subTextInner1}>{doctorData.language && doctorData.language.toString()}</Text>
              </Col>
            </Row>:null}
            <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-document" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Payment Report</Text>
                 {reportData.length!=0?
              <Text note style={styles.subTextInner1}>{reportData[reportData.length-1] && reportData[reportData.length-1].complaint||' '}</Text>:null}
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                      <TouchableOpacity 
                        onPress={() => { 
                          this.props.navigation.push('ReportIssue', { 
                            issueFor: 'Appointment', reportedId: data._id, 
                            prevState: this.props.navigation.state }) 
                          }} 
                        block success 
                        style={styles.reviewButton
                      }>
                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                          Report Issue
                        </Text>
                      </TouchableOpacity>
                    </View>
              </Col>
            </Row>
            {data.appointment_status == 'COMPLETED' && reviewData.length !== 0 ?
            <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-medkit" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Review</Text>
                 
                 <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                 disabled={false}
                 maxStars={5}
                 rating={reviewData[0] && reviewData[0].overall_rating}
               /></Col>
               </Row>:
               data.appointment_status == 'COMPLETED' && reviewData.length == 0 ? 
               <Row style={styles.rowSubText}>
               <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-add-circle" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                 <Text style={styles.innerSubText}>Add feedback</Text>
               <View style={{ justifyContent: 'center', alignItems: 'center' }}>
               <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>
                
                 <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}> ADD FEEDBACK </Text>
                 <Icon name="create" style={styles.editProfilePencil}></Icon>

               </TouchableOpacity>
             </View>
              {/* <Text note style={styles.subTextInner1}>{reviewData[0] && reviewData[0].comments||''}</Text> */}
              
              </Col>
            </Row>:null
  }
          
          
            <Row style={{marginLeft:10,marginRight:10,marginTop:10}}>
              <Col style={{width:'8%',paddingTop:5}}>
                 <Icon name="ios-cash" style={{fontSize:20,}}/>
              </Col>
              <Col style={{width:'92%',paddingTop:5}}>
                <Text style={styles.innerSubText}>Payment Info</Text>
               <Row style={{marginTop:10}}>
                <Col style={{width:'60%'}}>
                  <Text style={styles.downText}>Total Fee
                  </Text>
                </Col>
                <Col  style={{width:'25%'}}>
                    <Text style={styles.downText}>-</Text>
                </Col>
                <Col  style={{width:'15%'}}>
                   <Text note style={styles.downText}>{"Rs."+(paymentDetails.amount!=undefined?paymentDetails.amount:0)+"/-"}</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
              <Col style={{width:'60%'}}>
                  <Text style={styles.downText}>Payment Made
                  </Text>
              </Col>
              <Col  style={{width:'25%'}}>
                <Text style={styles.downText}>-</Text>
              </Col>
              <Col  style={{width:'15%'}}>
                <Text note style={styles.downText}>{"Rs."+(paymentDetails.amount_paid!=undefined?paymentDetails.amount_paid:0 )+"/-"}</Text>
              </Col>
            </Row>
            <Row style={{marginTop:10}}>
              <Col style={{width:'60%'}}>
                 <Text style={styles.downText}>Payment Due
                  </Text>
              </Col>
              <Col  style={{width:'25%'}}>
                <Text style={styles.downText}>-</Text>
              </Col>
              <Col  style={{width:'15%'}}>
                <Text note style={styles.downText}>{"Rs."+(paymentDetails.amount_due!=undefined?paymentDetails.amount_due:0 )+"/-"}</Text>
              </Col>
            </Row>
            <Row style={{marginTop:10}}>
              <Col style={{width:'60%'}}>
                <Text style={styles.downText}>Payment Method
                </Text></Col>
              <Col  style={{width:'25%'}}>
                <Text style={styles.downText}>-</Text>
              </Col>
              <Col  style={{width:'15%'}}>
                <Text note style={styles.downText}>{paymentDetails.payment_method|| 0 }</Text>
              </Col>
            </Row>
           </Col>
          </Row>
        </View>
       </Grid>
     </View>}
     <View style={{ height: 300, position: 'absolute', bottom: 0 }}>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    containerStyle={{ justifyContent: 'flex-end' }}
                    visible={this.state.modalVisible}
                  >
                    <InsertReview
                      data={this.state.data}
                      popupVisible={(data) => this.getvisble(data)}

                    >

                    </InsertReview>
                  </Modal>
                </View>

     </Content>
              </Container>
     
    )

  }
}

export default AppointmentDetails


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding:10

  },

  cardItem:{
     borderTopLeftRadius:10,
     borderTopRightRadius:10,
     justifyContent:'center',
     height:100,
  },
     cardItemText2:{
         fontFamily:'OpenSans',
         fontSize:13,
         marginTop: 5,
         fontStyle:'italic',
         width:'90%'
    },
Textname:{
   fontSize:14,
  fontFamily:'OpenSans',
  fontWeight:'bold'
},
    subText1:{
      fontSize:13,
      fontFamily:'OpenSans',
      fontWeight:'bold'
    },
    subText2:{
      fontSize:13,
      fontFamily:'OpenSans',
      marginLeft:5
    },
    confirmButton:{
      backgroundColor:'#6FC41A',
      height:30,
      padding:17,
      borderRadius:5
    },
    ButtonText:{
      color:'#fff',
      fontSize:10,
      fontWeight:'bold',
    },
    textApproved:{
      fontSize:12,
      fontWeight:'bold',
    },
    postponeButton:{
      backgroundColor:'#4765FF',
      height:30,
      padding:11,
      borderRadius:5
    },
    timeText:{
      fontFamily:'OpenSans',
      fontSize:15,
      fontWeight:'bold',
      color:'#FFF',
      marginLeft:-10
    },
    iconStyle:{
      fontSize:20,
      color:'#FFF'
    },
    rowStyle:{
      justifyContent:'center',
      alignItems:'center',
      marginTop:20
    },
    touchableStyle:{
     borderColor:'#4765FF',
     borderWidth:2,
     borderRadius:5,
     padding:8

    },
    touchableText:{
      fontFamily:'OpenSans',
      fontSize:15,
      fontWeight:'bold',
      color:'#4765FF',
      marginTop:4,
      marginLeft:5
    },
    rowSubText:{
      marginLeft:10,
      borderBottomColor:'gray',
      borderBottomWidth:0.5,
      marginRight:10,
      marginTop:10
    },
 innerSubText:{
  fontSize:13,
  fontFamily:'OpenSans',
  fontWeight:'bold',
  marginBottom:5
 },
 subTextInner1:{
  fontSize:12,
  fontFamily:'OpenSans',
  marginBottom:5
 },

 downText:{
  fontSize:12,fontFamily:'OpenSans',
 },
         cardItemText3:{
             fontFamily:'OpenSans',
             fontSize:18,
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
     marginBottom:-10,
     borderBottomLeftRadius:10,
     borderBottomRightRadius:10,
     justifyContent:'center',
     alignItems:"center",
     height:35,
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
  customHead:
  {
    fontFamily: 'OpenSans',
  },
  customText:
  {

    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,

  },

  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },

  customCard: {
    borderRadius: 20,
    padding: 7,
    marginTop: -150,
    marginLeft: 15,
    marginRight: 15,
    fontFamily: 'OpenSans',

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
    fontSize: 12
  },


  subtitlesText: {
    fontSize: 15,
    padding: 4,
    margin: 10,
    backgroundColor: '#FF9500',
    color: '#fff',
    width: 160,
    fontFamily: 'opensans-semibold',
    textAlign: 'center',
    borderRadius: 10

  },

  customIcons:
  {
    backgroundColor: 'red',
    borderRadius: 20,
    justifyContent: 'center',
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    // borderColor: 'red',
    // borderWidth: 2,
    fontSize: 25,
    height: 25,
    width: 25,
    fontWeight: 'bold'

  },
  leftButton:
  {
    height: 45,
    width: '98%',
    backgroundColor: '#23D972',
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 15
  },
  rightButton: {
    height: 45,
    width: '98%',
    backgroundColor: '#745DA6',
    borderRadius: 5,
    marginLeft: 2,
    marginRight: 2,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 10
  },
  customPadge: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 10,
    padding: 5,
  },
  customTouch: {
    borderRadius: 5,
    height: 45,
    width: '30%',
    backgroundColor: '#775DA3',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5
  },
  customSelectedTouch: {
    backgroundColor: '#A9A9A9',
    borderRadius: 5,
    height: 45,
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5
  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: '#775DA3',
    borderRadius: 10,
    height: 40,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row'
  }


})

