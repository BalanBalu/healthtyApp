
import React, { Component } from 'react';
import { StyleSheet, Image, TextInput, Dimensions, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Container, Header, Title, Left, Right, Body, Button, Card, Grid, View, Text, Thumbnail, Content } from 'native-base';
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/FontAwesome';
import { addReview } from '../../providers/bookappointment/bookappointment.action'



class InsertReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      doctorId: '',
      appointmentId: '',
      is_anonymous: null,
      cleanness_rating: 0,
      staff_rating: 0,
      wait_time_rating: 0,
      comments: ''
    }
  }

  doSubmit = async () => {
    let userId = await AsyncStorage.getItem('userId');
    try {
      let insertReviewData = {
        userId: this.state.userId,
        doctorId: this.state.doctorId,
        appointmentId: this.state.appointmentId,
        is_anonymous: this.state.is_anonymous,
        wait_time_rating: this.state.wait_time_rating,
        staff_rating: this.state.staff_rating, // 1 to 5
        cleanness_rating: this.state.cleanness_rating,
        // overall_rating: ,
        comments: this.state.comments,
        // is_doctor_recommended: Joi.boolean().valid(true, false).optional(),
      };
      let respons = await addReview(userId, insertReviewData);
      console.log(respons.data);

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
    return (

      <Container style={{ height: 'auto' }}>
        <Content style={styles.bodyContent}>
          <Container style={{
            backgroundColor: "grey", height: 605,
            borderBottomWidth: 0, width: 'auto'
          }}>
            <Grid style={styles.grid}>
              <Card style={styles.card}>
                <Text style={styles.text}>
                  we understand life can get in the way! cancelling or missing your appointment too many times will result in your account being locked!

  </Text>
                <View style={{ marginTop: 20 }}>
                  <Text>  <Text style={{ fontWeight: "bold" }}>saturday,April 13 - 10:15AM</Text> with Dr,Ravi</Text>
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 30,
                  marginLeft: 20
                }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Cleanliness</Text>
                  </View>

                  <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 50 }}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.cleanness_rating}
                    selectedStar={(rating) => this.CleanlinessStarRating(rating)}

                  />

                </View>

                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginBottom: 5,
                  marginLeft: 20

                }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Staff</Text>
                  </View>

                  <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 95 }}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.staff_rating}
                    selectedStar={(rating) => this.staffStarRating(rating)}

                  />

                </View>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginBottom: 5,
                  marginLeft: 20
                }}>
                  <View>
                    <Text style={{ fontSize: 16 }}>Wait Time</Text>
                  </View>

                  <StarRating fullStarColor='#FF9500' starSize={20} containerStyle={{ width: 110, marginLeft: 58 }}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.wait_time_rating}
                    selectedStar={(rating) => this.waittimeStarRating(rating)}

                  />

                </View>
                <View style={{ marginTop: 5, paddingLeft: 18 }}>
                  <Text style={{ fontSize: 16 }}>
                    Write your review
                      </Text>
                </View>
                <View style={{ marginTop: 5, paddingLeft: 18, padding: 10, }}>
                  <TextInput
                    style={{ height: 80, borderWidth: 1, width: 'auto' }}
                    placeholder="Write your reviews here"
                    onChangeText={(comments) => this.setState({ comments })}
                  />
                </View>
                <View style={{ width: 'auto' }}>
                  <Button style={styles.button1}
                    //  disabled={isLoading}
                    onPress={() => this.doSubmit()}
                  >
                    <Text>SUBMIT</Text></Button>
                </View>




              </Card>

            </Grid>

          </Container>

        </Content>
      </Container>
    );
  }
}



const styles = StyleSheet.create({
  bodyContent: {
    width: 'auto',
    height: 'auto'
  },
  header:
  {
    backgroundColor: "#7459a0",
    height: 50,
    width: 'auto',
    borderBottomWidth: 0

  },
  title: {
    paddingLeft: 40, paddingTop: 10

  },
  grid: {
    backgroundColor: '#f5f5f5', marginBottom: 5, marginTop: 5, marginLeft: 5, borderBottomWidth: 0, width: 'auto', marginRight: 5, height: 'auto'

  },
  card: {
    backgroundColor: '#f5f5f5', marginBottom: 10, marginTop: 10, height: 500, width: 330, marginLeft: 10, borderBottomWidth: 0,
    width: 'auto', marginRight: 10, height: 'auto'


  },
  text: {
    backgroundColor: "grey", color: "white", fontSize: 14, paddingTop: 5, paddingBottom: 5, paddingRight: 5, paddingLeft: 5
  },


  button1: {
    backgroundColor: "#7459a0", marginLeft: 'auto', borderRadius: 10, padding: 2, marginTop: 5, height: 35, width: 'auto', justifyContent: "center", marginBottom: 50, marginRight: 10

  }


})

function reviewState(state) {
  return {
    user: state.user
  }

}
export default connect(reviewState)(InsertReview)
