import React, { Component } from 'react';

import { StyleSheet, Image, TextInput, Dimensions, AsyncStorage, Modal, TouchableOpacity, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import {
  Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, Col,
  Text, Thumbnail, Content, CheckBox, Item, Input
} from 'native-base';
import { Checkbox } from 'react-native-paper';
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
      comments: '',
      doctorRecommended: false,
      data: '',
      doctorId: '',
      appointmentId: '',
      isRefresh: 'false',
      ratingIndicatePopUp: false,
      checked: false,
    }
  }

  async componentDidMount() {

    const { navigation } = this.props;
    const reviewData = navigation.getParam('appointmentDetail');
    console.log('reviewData:')
    console.log(reviewData);

    // let reviewData=finalReviewData.data.appointmentResult;


    let userId = reviewData.user_id;

    let doctorId = reviewData.doctor_id;
    let appointmentId = reviewData._id;
    await this.setState({ userId: userId, doctorId: doctorId, appointmentId: appointmentId, data: reviewData });

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

    } catch (e) {
      console.log(e);
    }
  }

  submitReview = async () => {
    try {
      console.log('cpme submit review')
      let userId = this.state.data.user_id;
      if (this.state.wait_time_rating != 0 || this.state.staff_rating != 0 || this.state.cleanness_rating != 0) {
        let overallrating = (this.state.cleanness_rating + this.state.staff_rating + this.state.wait_time_rating) / 3;
        console.log('condition true')

        let insertReviewData = {
          user_id: userId,
          doctor_id: this.state.data.doctor_id,
          appointment_id: this.state.appointmentId,
          is_anonymous: this.state.isAnonymous,
          wait_time_rating: this.state.wait_time_rating,
          staff_rating: this.state.staff_rating, // 1 to 5
          cleanness_rating: this.state.cleanness_rating,
          overall_rating: overallrating,
          comments: this.state.comments,
          is_doctor_recommended: this.state.doctorRecommended,
        };

        let result = await addReview(userId, insertReviewData);
        console.log(JSON.stringify(result))

        if (result.success) {

          const { navigation } = this.props;
          const { routeName, key } = navigation.getParam('prevState');
          if (routeName === 'AppointmentInfo') {
            navigation.navigate({ routeName, key, params: { hasReloadReview: true } });
          } else {
            navigation.pop()
          }
        }
      } else {
        this.setState({ ratingIndicatePopUp: true })
        // Toast.show({
        //   text: 'Kindly add a comment for your Review',
        //   duration: 3000
        // })
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
    const { data, checked } = this.state;
    return (
      < Container style={styles.container} >
        <Content>

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
            >
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '50%',
                transparent: 'rgba(0,0,0,0.7)',
                overlayColor: 'rgba(0, 0, 0, 0.7)',
                backgroundColor: 'rgba(0,0,0,0.2)'

              }}>
                <View style={{
                  width: '95%',
                  height: '55%', backgroundColor: '#fff',


                  borderRadius: 5,

                }}>
                  <Content>
                    <Grid>
                      <Row style={{ backgroundColor: '#7F49C3', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                        <Left>
                          <Text style={{ color: '#fff', fontSize: 16 }}>Mukesh Kumar</Text>
                        </Left>
                        <Right>
                          <Text style={{ color: '#fff', fontSize: 12 }}>January 2,2020 - 05.30 PM</Text>
                        </Right>
                      </Row>
                      <View>

                        <Row style={{ marginTop: 20 }}>
                          <Left style={{ marginLeft: 20 }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Cleanliness</Text>
                          </Left>
                          <Right style={{ marginRight: 20 }}>
                            <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 50 }}
                              disabled={false}
                              maxStars={5}
                              rating={this.state.cleanness_rating}
                              selectedStar={(rating) => this.CleanlinessStarRating(rating)}

                            />
                          </Right>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                          <Left style={{ marginLeft: 20 }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Staff</Text>
                          </Left>
                          <Right style={{ marginRight: 20 }}>
                            <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 97 }}
                              disabled={false}
                              maxStars={5}
                              rating={this.state.staff_rating}
                              selectedStar={(rating) => this.staffStarRating(rating)}

                            />
                          </Right>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                          <Left style={{ marginLeft: 20 }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16 }}>Wait Time</Text>
                          </Left>
                          <Right style={{ marginRight: 20 }}>
                            <StarRating fullStarColor='#FF9500' starSize={15} containerStyle={{ width: 110, marginLeft: 60 }}
                              disabled={false}
                              maxStars={5}
                              rating={this.state.wait_time_rating}
                              selectedStar={(rating) => this.waittimeStarRating(rating)}

                            />
                          </Right>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                          <Col style={{ marginLeft: 10, flexDirection: 'row', width: '49%' }}>
                            <Checkbox color="#3C98EC" size={5}
                              status={checked ? 'checked' : 'unchecked'}
                              onPress={() => { this.setState({ checked: !checked }); }}
                              style={{ height: 5, width: 5 }} />
                            <Text style={{ color: '#3C98EC', marginTop: 10, fontSize: 12 }}>Anonymous</Text>
                          </Col>
                          <Col style={{ flexDirection: 'row', width: '51%' }}>

                            <Checkbox color="#3C98EC" size={5}
                              status={checked ? 'checked' : 'unchecked'}
                              onPress={() => { this.setState({ checked: !checked }); }}
                            />

                            <Text style={{ color: '#3C98EC', fontSize: 12, marginTop: 10 }}>Recommend this Doctor</Text>
                          </Col>
                        </Row>
                        <View style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
                          <TextInput
                            style={{ height: 80, borderWidth: 1, marginTop: 10, width: "100%", borderRadius: 5, fontSize: 14 }}
                            returnKeyType={'next'}
                            placeholder="Write Your Reviews"
                            multiline={true}
                            keyboardType={'default'}
                            textAlignVertical={'top'}
                            onChangeText={(comments) => {
                              this.setState({ comments })
                            }
                            } />
                        </View>
                      </View>
                      <Row style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>

                        <Col style={{ width: '48%' }}>
                        </Col>
                        <Col style={{ width: '52%', flexDirection: 'row' }}>
                          <TouchableOpacity style={{ backgroundColor: '#959595', paddingLeft: 20, paddingRight: 20, paddingTop: 1, paddingBottom: 3, borderRadius: 2 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12, }} >Cancel</Text></TouchableOpacity>
                          <TouchableOpacity style={{ backgroundColor: '#349631', paddingLeft: 20, paddingRight: 20, paddingTop: 1, paddingBottom: 3, borderRadius: 2, marginLeft: 10 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12 }}>Submit</Text></TouchableOpacity>
                        </Col>


                      </Row>
                    </Grid>
                  </Content>


                </View>
              </View>
            </Modal>
          </View>




















          {/* 
          <Card style={{ borderRadius: 5, padding: 5, }}>
            <Card>
              <CardItem style={styles.text}>
                <Body>
                  <Text > How was your visit with {(data && data.prefix != undefined ? data && data.prefix : '') + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)} ? help other patients by leaving a Review </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={{ marginTop: 5, }}>
                    Your appointment with {(data && data.prefix != undefined ? data && data.prefix : '') + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)} on <Text style={{ fontWeight: "bold" }}>
                      {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " +
                        formatDate(data.appointment_starttime, 'hh:mm A')}
                    </Text> </Text>
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
                    <Checkbox status={this.state.isAnonymous ? 'checked' : 'unchecked'} color="green" onPress={() => this.setState({ isAnonymous: !this.state.isAnonymous })} />
                    <Text style={{ marginLeft: 5, marginTop: 7 }}>Would you like to give as Anonymous</Text>
                  </Row>
                  <Row style={{ marginTop: 10, marginLeft: -10 }} >
                    <Checkbox status={this.state.doctorRecommended ? 'checked' : 'unchecked'} color="green" onPress={() => this.setState({ doctorRecommended: !this.state.doctorRecommended })} />
                    <Text style={{ marginLeft: 5, marginTop: 7 }}>Do you recommend this doctor</Text>
                  </Row>

                  <Text style={{ fontSize: 16, marginTop: 20 }}>
                    Write your review
                      </Text>
                  <Input
                    style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 }}
                    returnKeyType={'next'}
                    multiline={true}
                    keyboardType={'default'}
                    textAlignVertical={'top'}
                    onChangeText={(comments) => {
                      this.setState({ comments })}
                    }/>

                  <Row style={{ marginTop: 10 }}>
                    <Right>
                      <Button style={styles.button1}
                        onPress={() => this.submitReview()}>
                        <Text>SUBMIT </Text></Button>
                    </Right></Row>

                </Body>
                <Modal
                  visible={this.state.ratingIndicatePopUp}
                  transparent={true}
                  animationType={'fade'}
                >
                  <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}>
                    <View style={{
                      width: '100%',
                      // Dimensions.get('screen').width,
                      height: '15%', backgroundColor: '#fff',
                      borderColor: 'gray',
                      borderWidth: 3,
                      padding: 10,
                      borderRadius: 5
                    }}> */}

          {/* <Item regular rounded style={{ borderColor: '#000', borderWidth: 2, marginTop: 20 }}> */}

          {/* </Item> */}
          {/* <Row style={{ marginTop: 10,justifyContent:'center' }}>
                        <Col style={{justifyContent:'center',width:'80%',marginTop:-30}}>
                        <Text style={{ fontFamily: 'OpenSans',textAlign:'center', }}> Kindly give rating for your Review! </Text>

                        </Col>
                        <Col style={{width:'20%',marginTop: 30,justifyContent:'center'}}>
                          <Button  success style={{ borderRadius: 10,height:35,paddingLeft:5,paddingRight:5}} onPress={() => this.setState({ ratingIndicatePopUp: false })} testID='okButton'>
                            <Text style={{ fontFamily: 'OpenSans',}}> Ok</Text>
                          </Button>
                        </Col>
                        </Row>
                    </View>

                  </View>
                </Modal>

              </CardItem>
            </Card>
          </Card> */}
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

