import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage ,TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';
import { viewUserReviews, bindDoctorDetails, appointmentStatusUpdate, appointmentDetails } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, dateDiff } from '../../../setup/helpers';

import { Loader } from '../../../components/ContentLoader'

import { renderProfileImage , RenderHospitalAddress,getAllEducation,getAllSpecialist} from '../../common'
class AppointmentDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      appointmentId: '',
      doctorId: '',
      userId: '',
      reviewData: {},
      doctorData: {},
      isLoading: true,

      appointmentStatus: '',
      statusUpdateReason: ' ',
      education: '',
      specialist: '',
      hospital: [],
      selectedTab:null,


    }

  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem('userId');
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
    console.log(appointmentData)


    if (appointmentData == undefined) {
      const appointmentId = navigation.getParam('appointmentId');
      this.props.navigation.setParams({reportedId:appointmentId});
      await this.setState({ appointmentId: appointmentId });

      await this.appointmentDetailsGetById()
    }
    else {

      let doctorId = appointmentData.doctor_id;
      let appointmentId = appointmentData._id;
      const selectedTab = navigation.getParam('selectedIndex');
      this.props.navigation.setParams({reportedId:appointmentId});
      await this.setState({
        doctorId: doctorId, appointmentId: appointmentId,
        userId: userId, data: appointmentData,selectedTab
      })

      await new Promise.all([
        this.getDoctorDetails(),
        this.getUserReviews()
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

        await this.setState({ doctorData: resultDetails.data });



        let educationDetails = '';
        if (resultDetails.data.education != undefined) {
          educationDetails =getAllEducation(resultDetails.data.education)
          
        }
        this.setState({ education: educationDetails })
        let specialistDetails = '';
        if (resultDetails.data.specialist != undefined) {
          specialistDetails = getAllSpecialist(resultDetails.data.specialist) 
          
        }
        this.setState({ specialist: specialistDetails.toString() })
        if (resultDetails.data.hospital != undefined) {
          resultDetails.data.hospital.map(hospital_id => {
            if (hospital_id.hospital_id == this.state.data.hospital_id)
              this.setState({ hospital: hospital_id })
          }

          )

        }
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
      console.log(e);
    }

  }

  appointmentDetailsGetById = async () => {

    let result = await appointmentDetails(this.state.appointmentId);

    this.getUserReviews();
    if (result.success) {

      await new Promise.all([
        this.setState({ doctorId: result.data[0].doctor_id, data: result.data[0] }),

        this.getDoctorDetails()
      ])


    }






  }

  navigateAddReview() {
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

    this.props.navigation.push('InsertReview', { appointmentDetail: this.state.data })





  }

  /* Update Appoiontment Status */

  updateAppointmentStatus = async (data, updatedStatus) => {
    try {
      this.setState({ isLoading: true });
      let requestData = {
        doctorId: data.doctor_id,
        userId: data.user_id,
        startTime: data.appointment_starttime,
        endTime: data.appointment_endtime,
        status: updatedStatus,
        statusUpdateReason: this.state.statusUpdateReason,
        status_by: 'USER'
      };
      debugger
      let userId = await AsyncStorage.getItem('userId');
      let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
     
      this.setState({ isLoading: false })
      let appointmentStatus = result.appointmentData.appointment_status;

      if (result.success) {
        let temp= this.state.data
    temp.doctor_id=result.appointmentData.doctor_id;
    temp.appointment_starttime=result.appointmentData.appointment_starttime;
    temp.appointment_endtime=result.appointmentData.appointment_endtime;
        Toast.show({
          text: result.message,
          duration: 3000
        })


        this.setState({ appointmentStatus: appointmentStatus, data: temp });
        
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




  render() {




    const { data, reviewData, doctorData, education, specialist, hospital, isLoading ,selectedTab} = this.state;

    return (

      <Container style={styles.container}>

        {isLoading == true ? <Loader style={'appointment'} /> :

          <Content style={styles.bodyContent}>
            <NavigationEvents
              onWillFocus={payload => { this.componentDidMount() }}

            />
            <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>
            </Grid>

            <Card style={styles.customCard}>
              <List>
                <ListItem thumbnail noBorder>
                  <Left>

                    <Thumbnail square source={renderProfileImage(doctorData)} style={{ height: 86, width: 86 }} />
                  </Left>
                  <Body>

                    <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold' }}>{(doctorData && doctorData.prefix != undefined ? doctorData && doctorData.prefix : '') +(  doctorData && doctorData.first_name )+ " " + (doctorData && doctorData.last_name)},
                      <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>{education}</Text>

                    </Text>
                    <Text note style={styles.customText}>{specialist} </Text>
                  </Body>

                </ListItem>

                <Grid>
                  <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', justifyContent: 'center' }}>
                    <Text style={styles.topValue}> {data.fee != undefined && data.fee != 0 ? data.fee : 'N/A'} </Text>
                    <Text note style={styles.bottomValue}> Fee </Text>
                  </Col>
                  <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', justifyContent: 'center' }}>
                    {doctorData.experience.isPrivate == true ?
                      <Text style={styles.topValue}>  N/A </Text> :
                      <Text style={styles.topValue}> {doctorData.calulatedExperience.year != 0 ? doctorData.calulatedExperience.year + ' yrs' : 'N/A'} </Text>
                    }
                    <Text note style={styles.bottomValue}> Experience</Text>
                  </Col>
                  <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={styles.topValue}>Card </Text>
                    <Text note style={styles.bottomValue}> Paid Method </Text>
                  </Col>
                </Grid>

                <Grid style={{ marginTop: 5 }}>
                  <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Col style={{ width: 300, }}>
                      <Button disabled={true} block style={{ borderRadius: 10, backgroundColor: '#D7BDE2' }}>
                        <Text style={{ color: 'black', fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold' }}>
                          {this.state.appointmentStatus == 'APPROVED' ? 'APPROVED' :
                            data.appointment_status == 'PROPOSED_NEW_TIME' ? 'PROPOSED NEW TIME' :
                              data.appointment_status == 'PENDING_REVIEW' ? 'COMPLETED' :
                                data.appointment_status || this.state.appointStatus}
                        </Text>
                      </Button>

                    </Col>

                  </View>
                </Grid>
                <Grid style={{ marginTop: 5 }}>
                { selectedTab==0?
                  data.appointment_status == 'APPROVED' || this.state.appointmentStatus === 'APPROVED' || data.appointment_status == 'PENDING'  ?
                    <Col style={width = 'auto'}>
                      <Button block danger style={{ margin: 1, marginTop: 10, marginLeft: 1, borderRadius: 30, padding: 15, height: 40, width: "auto" }} onPress={() => this.navigateCancelAppoointment()} testID='cancelAppointment'>
                        <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>CANCEL APPOINTMENT</Text>
                      </Button>
                    </Col> :
                    data.appointment_status == 'PROPOSED_NEW_TIME' ?
                      <Item style={{ borderBottomWidth: 0, justifyContent: 'center' }}>
                        <Button success style={styles.statusButton} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')} testID='approvedAppointment'>
                          <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', color: '#000', fontSize: 15, fontWeight: 'bold' }}>ACCEPT</Text>
                        </Button>
                        <Button danger style={styles.Button2} onPress={() => this.navigateCancelAppoointment()} testID='appointmentCancel'>
                          <Text style={{ textAlign: 'center', fontFamily: 'OpenSans', color: '#000', fontSize: 15, fontWeight: 'bold' }}> CANCEL </Text></Button>
                      </Item> : null:null }
                </Grid>

              </List>
            </Card>

            <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>
              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
                <Grid style={{ margin: 5 ,justifyContent:'center'}}>
                  
                    <Text style={{ fontSize: 15, fontFamily: 'OpenSans',textAlign:'center' }}>
                      {formatDate(data.appointment_starttime, "dddd,MMMM DD-YYYY  hh:mm a")}
                    </Text>
                 

                </Grid>

                <List>
                  <ListItem avatar >
                    {doctorData.hospital ?
                      <RenderHospitalAddress gridStyle={{ width: '10%' }}
                        hospotalNameTextStyle={styles.customText}
                        textStyle={styles.customText}
                        hospitalAddress={hospital}
                      /> : null}
                  </ListItem>
                </List>
              </Card>
              {data.appointment_status == 'CANCELED'||data.appointment_status == 'CLOSED'|| data.appointment_status == 'APPROVED' || data.appointment_status == 'PENDING' || data.appointment_status == 'PROPOSED_NEW_TIME' ? null :
                (data.appointment_status == 'PENDING_REVIEW' || reviewData.length === 0) ?
                  <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>
                    <List>
                      <Text style={styles.titlesText}>Review</Text>
                      
                        
                         <View style={{justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity block success style={styles.reviewButton} onPress={() => this.navigateAddReview()} testID='addFeedBack'>
                              {/* <Icon name='add' /> */}
                              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold',textAlign:'center',marginTop:5 }}> ADD FEEDBACK </Text>
                              <Icon name="create" style={styles.editProfilePencil}></Icon>

                            </TouchableOpacity>
                            </View>
                     
                    </List>
                  </Card>
                  : (data.appointment_status == 'COMPLETED' || reviewData.length !== 0) ?

                    <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>
                      <List>
                        <Text style={styles.titlesText}>Review</Text>
                        {reviewData[0] && reviewData[0].is_anonymous == true ?

                          <ListItem avatar>
                            <Left>
                              <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                              <Text>Medflic User</Text>
                              <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                disabled={false}
                                maxStars={5}
                                rating={reviewData[0] && reviewData[0].overall_rating}

                              />
                              <Text note style={styles.customText}>{reviewData[0] && reviewData[0].comments} </Text>
                            </Body>
                          </ListItem>
                          :
                          <ListItem avatar>
                            <Left>
                              <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                            </Left>
                            <Body>
                              <Text style={{ fontFamily: 'OpenSans', fontSize: 20 }}>{(reviewData[0] && reviewData[0].userInfo.first_name) + " " + (reviewData[0] && reviewData[0].userInfo.last_name)}</Text>
                              <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                disabled={false}
                                maxStars={5}
                                rating={reviewData[0] && reviewData[0].overall_rating}

                              />
                              <Text note style={styles.customText}>{reviewData[0] && reviewData[0].comments} </Text>
                            </Body>
                          </ListItem>}
                      </List>
                    </Card> : null}

              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>
                <Grid style={{ margin: 5 }}>
                  <Col style={{ width: '10%' }}>
                    <Icon name="apps" style={styles.customIcon}></Icon>
                  </Col>
                  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                    <Text style={styles.titlesText}>Disease</Text></Col>

                </Grid>


                <List>
                  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                    <Left >
                    </Left>
                    <Body>
                      <Text style={styles.customText}>

                        {data.disease_description}

                      </Text>

                    </Body>

                  </ListItem>

                </List>

              </Card>
              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


                <Grid style={{ margin: 5 }}>
                  <Col style={{ width: '10%' }}>
                    <Icon name="apps" style={styles.customIcon}></Icon>
                  </Col>
                  <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                    <Text style={styles.titlesText}>Personal Details</Text></Col>

                </Grid>
                <List>
                  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                    <Body>
                      <Text style={styles.customText}>Email</Text>
                      <Text style={styles.customText}>{doctorData && doctorData.email} </Text>
                    </Body>
                  </ListItem>

                  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                    <Body>
                      <Text style={styles.customText}>Contact</Text>
                      <Text note style={styles.customText}>{doctorData && doctorData.mobile_no} </Text>
                    </Body>
                  </ListItem>

                </List>
              </Card>
            
              {doctorData.language .length!= 0 ?
                <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                  <Grid style={{ margin: 5 }}>
                    <Col style={{ width: '10%' }}>
                      <Icon name="apps" style={styles.customIcon}></Icon>
                    </Col>
                    <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                      <Text style={styles.titlesText}>Languages speaks By Doctor</Text></Col>
                  </Grid>

                  <List>
                    <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                      <Left >
                      </Left>
                      <Body>
                        <Text style={styles.customText}>
                          {doctorData.language && doctorData.language.toString()}
                        </Text>
                      </Body>
                    </ListItem>
                  </List>
                </Card> : null}
              
                <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                  <Grid style={{ margin: 5 }}>
                    <Col style={{ width: '10%' }}>
                      <Icon name="apps" style={styles.customIcon}></Icon>
                    </Col>
                    <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                      <Text style={styles.titlesText}> Payment Report </Text></Col>
                  </Grid>
                
                
                  <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                    <Body>
                    <View style={{ alignItems:'center',justifyContent:'center',marginTop: 5}}>
                      <TouchableOpacity onPress={() => { this.props.navigation.navigate('ReportIssue',{issueFor:'Appointment',reportedId:data._id })} } block success  style={styles.reviewButton}  >
                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'OpenSans', fontWeight: 'bold',textAlign:'center',marginTop:5 }}>
                          Report Issue
                        </Text>
                      </TouchableOpacity>
                      </View>
                      </Body>
                    </ListItem>

                 
              
                
                </Card> 
            </Card>
          </Content>
        }
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
    // paddingLeft: 20,
    // paddingRight: 20,

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
    padding: 15,
    marginTop: -180,
    marginLeft: 20,
    marginRight: 20,

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
    fontSize: 13,
    fontWeight: 'bold'

  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 13,
    fontFamily: 'OpenSans',

  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: '#775DA3',
    borderRadius: 10,
    height: 40,
    color: 'white',
    paddingLeft:20,
    paddingRight:20,
    paddingBottom:5,
    paddingTop:5,
    flexDirection:'row'
  },
  customText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 15,


  },
  subtitlesText: {
    fontSize: 15,
    margin: 10,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',
    fontWeight: 'bold'

  },
  titlesText: {
    fontSize: 15,
    color: '#F2889B',
    fontFamily: 'opensans-semibold'

  },
  customIcon:
  {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: 8,
    fontSize: 19,
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 6,
    paddingBottom: 6

  },
  rowText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 16,
    margin: 10
  },
  statusButton: {
    // margin: 1,
    // marginLeft: 20,
    // marginTop: 10,
    // borderRadius: 30,
    // padding: 15,
    // height: 35,
    // width: "auto"



    borderRadius: 10,

    justifyContent: 'center',
    padding: 30,
    marginTop: 15,
    width: '70%',


  },
  Button2: {
    borderRadius: 10,
    marginLeft: 5,
    justifyContent: 'center',
    padding: 1,
    marginTop: 15,
    width: '30%',

  },
  editProfilePencil: {
    color: 'white',
    marginLeft: 2,
    fontSize: 20,
    marginTop:5
  }


});
