import React, { Component } from 'react';
import { StyleSheet, Image, TextInput, Dimensions, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, 
  Text, Thumbnail, Content, CheckBox } from 'native-base';
//import {ScrollView} from 'react-native-gesture-handler';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { addReview } from '../../providers/bookappointment/bookappointment.action'
import { formatDate } from '../../../setup/helpers';
import { appointmentStatusUpdate } from '../../providers/bookappointment/bookappointment.action';

class InsertReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAnonymous: false,
      isAnonymousErrorMsg: '',
      cleanness_rating: 0,
      staff_rating: 0,
      wait_time_rating: 0,
      comments: null,
      doctorRecommended: false,
      data: '',
      doctorId: '',
      appointmentId: '',
    }
  }

  async componentDidMount() {

    const { navigation } = this.props;
    const reviewData = navigation.getParam('appointmentDetail');

    let userId = reviewData.user_id;
    let doctorId = reviewData.doctor_id;
    let appointmentId = reviewData._id;
    await this.setState({ userId: userId, doctorId: doctorId, appointmentId: appointmentId, data: reviewData });
    console.log(this.state.data.prefix)
  }

  updateAppointmentStatus = async (data, updatedStatus) => {
    try {
      let requestData = {
        doctorId: data.doctor_id,
        userId: data.user_id,
        startTime: data.appointment_starttime,
        endTime: data.appointment_endtime,
        status: updatedStatus,
        statusUpdateReason: ' ',
        status_by: 'USER'
      };

      let userId = await AsyncStorage.getItem('userId');
      let result = await appointmentStatusUpdate(data.doctor_id, data._id, requestData);
      console.log('result' + JSON.stringify(result))
    } catch (e) {
      console.log(e);
    }
  }

  submitReview = async () => {
    try {
      let userId = this.state.data.user_id;
      let overallrating = (this.state.cleanness_rating + this.state.staff_rating + this.state.wait_time_rating) / 3;

      if (this.state.comments != null) {
        let insertReviewData = {
          user_id: userId,
          doctor_id: this.state.data.doctor_id,
          appointment_id: this.state.data._id,
          is_anonymous: this.state.isAnonymous,
          wait_time_rating: this.state.wait_time_rating,
          staff_rating: this.state.staff_rating, // 1 to 5
          cleanness_rating: this.state.cleanness_rating,
          overall_rating: overallrating,
          comments: this.state.comments,
          is_doctor_recommended: this.state.doctorRecommended,
        };
        let result = await addReview(userId, insertReviewData);

        if (result.success) {
          this.state.data.appointment_status = 'COMPLETED';
          await this.updateAppointmentStatus(this.state.data, 'COMPLETED')
          this.props.navigation.navigate('AppointmentInfo', { reviewDetails: this.state.data })
        }
      } else {
        Toast.show({
          text: 'Kindly add a comment for your Review',
          duration: 3000
        })
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  CleanlinessStarRating(rating) {
    this.setState({
      cleanness_rating: rating
    });
  }
  staffStarRating(rating) {
    this.setState({
      staff_rating: rating
    });
  }
  waittimeStarRating(rating) {
    this.setState({
      wait_time_rating: rating
    });
  }

  render() {
    const { data } = this.state;
    return (
      < Container style={styles.container} >
        <Content>
          <Card style={{ borderRadius: 5, padding: 5, }}>
            <Card>
              <CardItem style={styles.text}>
                <Body>
                  <Text > How was your visit with Dr.Anil varma ? help other patients by leaving a Review </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{ marginTop: 5, }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " +
                        formatDate(data[0] && data[0].appointment_starttime, 'hh:mm A')}
                    </Text> with {(data && data.prefix) + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)}</Text>
                  <Row style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 16 }}>Cleanliness</Text>
                    <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 50 }}
                      disabled={false}
                      maxStars={5}
                      rating={this.state.cleanness_rating}
                      selectedStar={(rating) => this.CleanlinessStarRating(rating)}

                    />
                  </Row>
                  <Row style={{ marginTop: 30 }}>
                    <Text style={{ fontSize: 16 }}>Staff</Text>
                    <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 97 }}
                      disabled={false}
                      maxStars={5}
                      rating={this.state.staff_rating}
                      selectedStar={(rating) => this.staffStarRating(rating)}

                    />
                  </Row>
                  <Row style={{ marginTop: 30 }}>
                    <Text style={{ fontSize: 16 }}>Wait Time</Text>
                    <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 60 }}
                      disabled={false}
                      maxStars={5}
                      rating={this.state.wait_time_rating}
                      selectedStar={(rating) => this.waittimeStarRating(rating)}

                    />
                  </Row>
                  <Row style={{ marginTop: 20, marginLeft: -10 }}>
                    <CheckBox checked={this.state.isAnonymous} color="green" onPress={() => this.setState({ isAnonymous: !this.state.isAnonymous })} ></CheckBox>
                    <Text style={{ marginLeft: 20 }}>Would you like to give as Anonymous</Text>
                  </Row>
                  <Row style={{ marginTop: 10, marginLeft: -10 }} >
                    <CheckBox checked={this.state.doctorRecommended} color="green" onPress={() => this.setState({ doctorRecommended: !this.state.doctorRecommended })} ></CheckBox>
                    <Text style={{ marginLeft: 20 }}>Do you recommend this doctor</Text>
                  </Row>

                  <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Write your review
                      </Text>
                  <TextInput
                    style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 }}
                    multiline = {true}
                    placeholder="Write your reviews here"
                    textAlignVertical={'top'}
                    onChangeText={(comments) => this.setState({ comments })}
                  />
                  
                  {/* <TextInput
                    style={{ height: 80, borderWidth: 1, width: 'auto' }}
                   
                  /> */}
                  <Row style={{ marginTop: 10 }}>
                    <Right>
                      <Button style={styles.button1}
                        onPress={() => this.submitReview()}>
                        <Text>SUBMIT </Text></Button>
                    </Right></Row>

                </Body>

              </CardItem>
            </Card>
          </Card>
        </Content>
      </Container >
    );
  }
}

export default InsertReview


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    padding: 5

  },

  card: {
    width: 'auto',
    borderRadius: 100,

  },
  title: {
    paddingLeft: 40, paddingTop: 10

  },
  // grid: {
  //   backgroundColor: '#f5f5f5',
  //   marginBottom: 5,
  //   marginTop: 5,
  //   height: 'auto',
  //   width: 'auto',
  //   marginLeft: 5,
  //   marginRight: 5
  // },
  // card: {
  //   backgroundColor: '#f5f5f5',
  //   marginBottom: 10,
  //   marginTop: 10,
  //   height: 'auto',
  //   width: 'auto',
  //   marginLeft: 10,
  //   marginRight: 10

  // },
  text: {
    backgroundColor: "grey",
    color: "white",
    fontSize: 15
  },

  subcard: {
    backgroundColor: 'grey',
    marginBottom: 10,
    marginTop: 10,
    width: 'auto',
    marginLeft: 15
  },

  button1: {
    backgroundColor: "#7459a0",
    borderRadius: 15,
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
    fontSize: 15,
    marginBottom: 10,

  }

})

