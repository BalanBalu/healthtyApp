import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, H3, Button, Item, Card, CardItem, List, ListItem, Left, Right, Thumbnail, Body, Icon, locations, ScrollView, ProgressBar } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, FlatList, Image, TouchableOpacity, View, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { appointmentDetails, viewUserReviews, bindDoctorDetails } from '../../../providers/bookappointment/bookappointment.action';
import { formatDate, addTimeUnit } from '../../../../setup/helpers';

class AppointmentDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      appointmentId: '',
      doctorId: '',
      userId: '',
      reviewdata: {},
      doctorData: {}

    }

  }
  async componentDidMount() {
    console.log('coming to component did mount');
    const userId = await AsyncStorage.getItem('userId');
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
    console.log(appointmentData);
    let doctorId = appointmentData.doctor_id;
    let appointmentId = appointmentData._id;
    await this.setState({ doctorId: doctorId, appointmentId: appointmentId, userId: userId })
    this.getAppointmentDetails(doctorId, appointmentId);
    this.getDoctorDetails(doctorId);
    this.getUserReviews(userId);

  }

  /* get Doctor appointment */

  getAppointmentDetails = async (doctorId, appointmentId) => {
    try {
      //let doctorId = await AsyncStorage.getItem('doctorId');
      let result = await appointmentDetails(doctorId, appointmentId);
      console.log(JSON.stringify(result) + 'result');
      if (result.success) {
        this.setState({ data: result.data });
        console.log(JSON.stringify(this.state.data));
      }

    } catch (e) {
      console.log(e);
    }
  }
  /* Get Doctor Details */
  getDoctorDetails = async (doctorId) => {
    try {
      let fields = 'first_name,last_name,education,specialist,email,mobile_no,experience,hospital,language';
      let resultDetails = await bindDoctorDetails(doctorId, fields);
      console.log(JSON.stringify(resultDetails) + 'result');
      if (resultDetails.success) {
        await this.setState({ doctorData: resultDetails.data });
        console.log(JSON.stringify(this.state.doctorData));

      }
    }
    catch (e) {
      console.log(e);
    }
  }
  /* get User reviews */
  getUserReviews = async (userId) => {
    console.log("reviews");
    let resultReview = await viewUserReviews('user', userId);
    console.log(resultReview.data);
    if (resultReview.success) {
      this.setState({ reviewdata: resultReview.data });
    }
    console.log('reviewdata' + JSON.stringify(this.state.reviewdata));
  }

  render() {
    const { data, reviewdata, doctorData } = this.state;

    return (

      <Container style={styles.container}>
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
                  <Text style={styles.customHead}>{(doctorData && doctorData.first_name) + " " + (doctorData && doctorData.last_name) + "," + (doctorData.education && doctorData.education[0].degree)}</Text>
                  <StarRating fullStarColor='#FF9500' starSize={25}
                    disabled={false}
                    maxStars={5}
                    rating={reviewdata[0] && reviewdata[0].overall_rating}
                  />

                </Body>

              </ListItem>

              <Grid>
                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}> Rs 45.. </Text>
                  <Text note style={styles.bottomValue}> Hourly Rate </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', borderRightWidth: 0.5, borderRightColor: 'gray', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>{reviewdata[0] && reviewdata[0].overall_rating}  </Text>
                  <Text note style={styles.bottomValue}> Reviews </Text>
                </Col>

                <Col style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                  <Text style={styles.topValue}>824 </Text>
                  <Text note style={styles.bottomValue}> patients </Text>
                </Col>
              </Grid>

              <Grid style={{ marginTop: 5 }}>

                <Col style={{ width: 270, }}>
                  <Button block success style={{ borderRadius: 10 }}>
                    <Text uppercase={false}>{data[0] && data[0].appointment_status}</Text>
                  </Button>

                </Col>
                <Col style={{ marginLeft: 5, justifyContent: 'center' }} >

                  <Icon name="heart" style={{ color: 'red', fontSize: 25, borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' }} />


                </Col>
              </Grid>
            </List>

          </Card>


          <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>


            <Card style={{ margin: 10, padding: 10, borderRadius: 10 }}>

              <List>
                <Text style={styles.titleText}>Reviews</Text>

                <ListItem avatar>
                  <Left>
                    <Thumbnail square source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={{ height: 40, width: 40 }} />
                  </Left>
                  <Body>
                    <Text>Kumar Pratik</Text>

                    <Text note>3hrs.</Text>
                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                      disabled={false}
                      maxStars={5}
                      rating={reviewdata[0] && reviewdata[0].overall_rating}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}

                    />
                    <Text note style={styles.customText}>{reviewdata[0] && reviewdata[0].comments} </Text>
                  </Body>

                </ListItem>

                <Button iconRight transparent block>
                  <Icon name='add' />
                  <Text style={styles.customText}>More Reviews</Text>
                </Button>
              </List>
            </Card>

            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

              <Grid style={{ margin: 5 }}>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Day of the Appointment</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>
                      {formatDate(data[0] && data[0].appointment_starttime, 'MMMM-DD-YYYY') + " " + formatDate(data[0] && data[0].appointment_starttime, 'hh:mm A')}
                    </Text>
                    <Text style={styles.rowText}>
                      {formatDate(data[0] && data[0].appointment_starttime, 'MMMM-DD-YYYY') + " " + formatDate(data[0] && data[0].appointment_endtime, 'hh:mm A')}

                    </Text>
                  </Body>
                </ListItem>
              </List>
            </Card>

            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>

              <Text style={styles.subtitlesText}>Professional Statement</Text>
              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: 10 }}>
                  <Left >

                  </Left>
                  <Body>

                    <Text style={styles.customText}>
                      The medical doctor CV example below is designed to show you how to properly format and organize your CV, as well as what information to include, such as your hobbies and interests, work history, and a professional summary. Once you’ve familiarized yourself with the structure, you can draft your own tailored CV.
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
                  <Text style={styles.titlesText}>Email</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>

                      {doctorData && doctorData.email}

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
                  <Text style={styles.titlesText}>Contact No</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>

                      {doctorData && doctorData.mobile_no}

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
                  <Text style={styles.titlesText}>Year of Experience</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>

                      {doctorData.experience && doctorData.experience.year}

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
                  <Text style={styles.titlesText}>Disease</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderLeftWidth: 8, borderColor: "#F29727", marginBottom: -5 }}>
                  <Left >
                  </Left>
                  <Body>
                    <Text style={styles.rowText}>

                      {data[0] && data[0].disease_description}

                    </Text>

                  </Body>

                </ListItem>

              </List>

            </Card>




            <Card style={{ backgroundColor: '#ffffff', borderRadius: 10, padding: 10 }}>


              <Grid>
                <Col style={{ width: '10%' }}>
                  <Icon name="apps" style={styles.customIcon}></Icon>
                </Col>
                <Col style={{ width: '90%', alignItems: 'flex-start' }}>
                  <Text style={styles.titlesText}>Hospital Network</Text></Col>

              </Grid>


              <List>
                <ListItem avatar noBorder style={{ borderRightWidth: 8, borderColor: "#8C4F2B", marginBottom: 10, marginRight: 15 }}>
                  <Left >
                  </Left>
                  <Body>

                    <Grid>
                      <Col style={{ width: '40%' }}>
                        <Text style={styles.rowText}>
                          {doctorData.hospital && doctorData.hospital[0].name}

                        </Text>
                      </Col>
                      <Col style={{ width: '30%' }}>
                      </Col>
                      <Col style={{ width: '30%' }}>

                      </Col>
                    </Grid>

                    <Grid>
                      <Col style={{ width: '90%', alignItems: 'center', borderColor: 'gray', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                        <Text style={styles.rowText}>
                          {doctorData.hospital && doctorData.hospital[0].location.address.no_and_street}
                        </Text>

                        <Text style={styles.rowText}>
                          {doctorData.hospital && doctorData.hospital[0].location.address.address_line_1}
                        </Text>


                        <Text style={styles.rowText}>
                          {doctorData.hospital && doctorData.hospital[0].location.address.address_line_2}
                        </Text>
                      </Col>
                      <Col style={{ width: '10%' }}></Col>
                    </Grid>

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
  customText:
  {

    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,

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
    fontFamily: 'opensans-semibold',

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
    fontSize: 14,
    margin: 5
  }

});