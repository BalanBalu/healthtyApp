import React, { Component } from 'react';
import { Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right, Thumbnail, Body, Icon, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import moment from 'moment';

import { viewUserReviews, bindDoctorDetails, acceptAppointment } from '../../../providers/bookappointment/bookappointment.action';
import { formatDate, dateDiff } from '../../../../setup/helpers';
import { Loader } from '../../../../components/ContentLoader'
import { RenderHospitalAddress } from '../../../common';

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
      isLoading: false,
      yearOfExperience: '',
      appointStatus: ''

    }

  }

  async componentDidMount() {
    console.log('coming to component did mount');
    const userId = await AsyncStorage.getItem('userId');
    console.log(userId);
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
    console.log(appointmentData);
    let doctorId = appointmentData.doctor_id;
    let appointmentId = appointmentData._id;
    await this.setState({ doctorId: doctorId, appointmentId: appointmentId, userId: userId, data: appointmentData })
    this.getDoctorDetails(doctorId);
    this.getUserReviews(appointmentId);

    console.log('state data : ' + JSON.stringify(this.state.data));
  }

  /* Get Doctor Details */
  getDoctorDetails = async (doctorId) => {
    try {
      this.setState({ isLoading: true });
      let fields = 'first_name,last_name,education,specialist,email,mobile_no,experience,hospital,language,professional_statement';
      let resultDetails = await bindDoctorDetails(doctorId, fields);
      //console.log(JSON.stringify(resultDetails));
      if (resultDetails.success) {
        await this.setState({ doctorData: resultDetails.data, isLoading: false });
        //console.log(JSON.stringify(this.state.doctorData));
        let updatedDate = moment(this.state.doctorData.experience.updated_date);
        let experienceInYear = dateDiff(updatedDate, new Date(), 'year');
        let experienceInMonth = dateDiff(updatedDate, new Date(), 'months');
        //console.log(experienceInYear + 'experience');
        //console.log(experienceInMonth + 'experience');
        let year = (moment(this.state.doctorData.experience.year) + experienceInYear);
        let month = (moment(this.state.doctorData.experience.month)) + experienceInMonth;
       // console.log(year + 'year');
        //console.log(month + 'month');
        let experience = experienceInYear + year;
        if (month >= 12) {
          experience++;
        }
       // console.log(experience)
        await this.setState({ yearOfExperience: experience, isLoading: false });
       // console.log(this.state.yearOfExperience)

      }
    }
    catch (e) {
      console.log(e);
    }
  }

  /* get User reviews */
  getUserReviews = async (appointmentId) => {
    this.setState({ isLoading: true });
    let resultReview = await viewUserReviews('appointment', appointmentId);
    //console.log(resultReview.data);
    if (resultReview.success) {
      this.setState({ reviewData: resultReview.data, isLoading: false });
    }
   // console.log(JSON.stringify(JSON.stringify(this.state.reviewData)));
  }

  /* Update Appoiontment Status */

  accept(data, status) {
    this.updateAppointmentStatus(data, status)
  }
  updateAppointmentStatus = async (data, updatedStatus) => {
    try {
      this.setState({ isLoading: true });
      let requestData = {
        doctorId: data.doctor_id,
        userId: data.user_id,
        startTime: data.appointment_starttime,
        endTime: data.appointment_endtime,
        status: updatedStatus,
        status_by: 'USER',
      };
      console.log(requestData);

     let userId = await AsyncStorage.getItem('userId');
      console.log('userId'+userId);
      let result = await acceptAppointment(this.state.doctorId, this.state.appointmentId, requestData);
      console.log(result);
      console.log(JSON.stringify(result.appointmentData.appointment_status));
      let appointStatus = result.appointmentData.appointment_status;
      console.log('update result' +JSON.stringify(result));
      if (result.success) {
        Toast.show({
          text: result.message,
          duration: 3000
        })
        this.setState({ appointStatus: appointStatus });

      }
    }
    catch (e) {
       console.log(e);
    }
  }

  render() {

    const { data, reviewData, doctorData, yearOfExperience, isLoading } = this.state;

    return (

      <Container style={styles.container}>
        {isLoading == true ? <Loader style={'list'} /> :

          <Content style={styles.bodyContent}>
            <Grid style={{ backgroundColor: '#7E49C3', height: 200 }}>
            </Grid>

            <Card style={styles.customCard}>
              <List>
                <ListItem thumbnail noBorder>
                  <Left>
                    <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 86, width: 86 }} />
                  </Left>
                  <Body>
                    <Text style={fontSize = 13}>{(doctorData && doctorData.first_name) + " " + (doctorData && doctorData.last_name) + "," + (doctorData.education && doctorData.education[0].degree)}</Text>
                    <Text note style={styles.customText}>{doctorData.specialist && doctorData.specialist[0].category} </Text>
                  </Body>

                </ListItem>

                <Grid>
                  <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={styles.topValue}> Rs 45.. </Text>
                    <Text note style={styles.bottomValue}> Hourly Rate </Text>
                  </Col>
                  <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={styles.topValue}> {yearOfExperience} </Text>
                    <Text note style={styles.bottomValue}> Experience</Text>
                  </Col>
                  <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Text style={styles.topValue}>Card </Text>
                    <Text note style={styles.bottomValue}> Paid Method </Text>
                  </Col>
                </Grid>

                <Grid style={{ marginTop: 5 }}>

                  <Col style={{ width: 300, }}>
                    <Button disabled={true} block style={{ borderRadius: 10, backgroundColor: '#D7BDE2' }}>
                      <Text style={{ color: 'black', fontSize: 16 }}>{data.appointment_status == 'PROPOSED_NEW_TIME' ?
                        'PROPOSED NEW TIME' : data.appointment_status == 'PENDING_REVIEW' ? 'COMPLETED' : data.appointment_status}
                      </Text>
                    </Button>

                  </Col>

                </Grid>
                <Grid style={{ marginTop: 5 }}>
                {data.appointment_status == 'APPROVED' ?
                    <Col style={width = 'auto'}>
                      <Button block danger style={{ margin: 1, marginTop: 10, marginLeft: 1, borderRadius: 30, padding: 15, height: 40, width: "auto" }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'OpenSans' }}>CANCEL APPOINTMENT</Text>
                      </Button>
                    </Col> :  
               
                    data.appointment_status == 'PROPOSED_NEW_TIME' ?
                     <Item style={{ borderBottomWidth: 0, justifyContent: 'center' }}>
                        <Button success style={styles.statusButton} onPress={() => this.accept( data, 'APPROVED')}>
                          <Text style={{ textAlign: 'center', fontFamily: 'OpenSans' }}>ACCEPT</Text>
                        </Button>
                        <Button danger style={styles.statusButton}>
                          <Text style={{ textAlign: 'center', fontFamily: 'OpenSans' }}> CANCEL </Text></Button>
                      </Item> : 
                    //   this.state.appointStatus == 'APPROVED' ?
                    //   <Col style={width = 'auto'}>
                    //   <Button block danger style={{ margin: 1, marginTop: 10, marginLeft: 1, borderRadius: 30, padding: 15, height: 40, width: "auto" }}>
                    //     <Text style={{ textAlign: 'center', fontFamily: 'OpenSans' }}>CANCEL APPOINTMENT</Text>
                    //   </Button>
                    // </Col>:
                    null}
                </Grid>

              </List>
            </Card>

            <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>
              <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

                <Grid style={{ margin: 5 }}>

                  <Right>
                    <Text>
                      {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " + formatDate(data[0] && data[0].appointment_starttime, 'hh:mm A')}
                    </Text>
                  </Right>

                </Grid>

                <List>
                  <ListItem avatar >
                    {doctorData.hospital ?
                      <RenderHospitalAddress gridStyle={{ width: '10%' }}
                        hospotalNameTextStyle={styles.customText}
                        textStyle={styles.customText}
                        hospitalAddress={doctorData.hospital[0]}
                      /> : null}

                    {/* <Left>
                    <Icon name="locate" style={{ color: '#7E49C3', fontSize: 25 }}></Icon>
                  </Left>
                  <Body>
                    <Text style={styles.customText}>
                      {doctorData.hospital && doctorData.hospital[0].name}
                    </Text>
                    <Text style={styles.customText}>
                      {(doctorData.hospital && doctorData.hospital[0].location.address.no_and_street) + "," +
                        (doctorData.hospital && doctorData.hospital[0].location.address.address_line_1) + ", " +
                        (doctorData.hospital && doctorData.hospital[0].location.address.address_line_2)}
                    </Text>

                  </Body> */}
                  </ListItem>
                </List>
              </Card>




              {data.appointment_status == 'PENDING_REVIEW' ?
                <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>
                  <List>
                    <Text style={styles.titlesText}>Review</Text>
                    <ListItem>
                      <Grid>
                        <Col style={{ width: '50%' }}>
                          <Button block success style={styles.reviewButton}>
                            {/* <Icon name='add' /> */}
                            <Text style={styles.customText}> ADD FEEDBACK </Text>
                          </Button>
                        </Col>
                      </Grid>
                    </ListItem>
                  </List>
                </Card>

                : data.appointment_status == 'CLOSED' ?
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
                              selectedStar={(rating) => this.onStarRatingPress(rating)}
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
                            <Text>{(reviewData[0] && reviewData[0].userInfo.first_name) + " " + (reviewData[0] && reviewData[0].userInfo.last_name)}</Text>
                            <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                              disabled={false}
                              maxStars={5}
                              rating={reviewData[0] && reviewData[0].overall_rating}
                              selectedStar={(rating) => this.onStarRatingPress(rating)}
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
                      <Text style={styles.rowText}>

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
                      <Text style={styles.rowText}>
                        {doctorData.language && doctorData.language.toString()}
                      </Text>
                    </Body>
                  </ListItem>
                </List>
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
    marginRight: 'auto'
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: '#775DA3',
    marginLeft: 75,
    borderRadius: 10,
    width: 170,
    height: 40,
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
  customText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 16,
    // alignItems: 'flex-start'
    // marginRight: 45 

  },
  subtitlesText: {
    fontSize: 15,
    margin: 10,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

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
    margin: 1,
    marginLeft: 20,
    marginTop: 10,
    borderRadius: 30,
    padding: 15,
    height: 35,
    width: "auto"
  }
});
