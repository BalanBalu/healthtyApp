import React, { Component } from 'react';
import {
  Container, Content, Text, View, Button, H3, Item, Card,
  Input, Left, Right, Icon, Footer, Badge, Form, CardItem, Toast
} from 'native-base';
import { Checkbox } from 'react-native-paper';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import { InsertMedicineReviews } from '../../../providers/pharmacy/pharmacy.action'

export class MedInsertReview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      is_anonymous: false,
      rating: 0,
      comments: '',
      modalVisible: false,
      errorMsg: ''
    }
  }
  async componentDidMount() {

    const { data } = this.props;
    await this.setState({ data, userId: data.user_id, medicineId: data.medicine_id,modalVisible:data.modalVisible })
    console.log("data", this.state.data)
  }

  submitReview = async (reviewType) => {
    try {

      const {  medicineId, is_anonymous, rating, comments } = this.state;
      if (reviewType == 'ADD') {
        if (rating == 0) {
          this.setState({ errorMsg: 'Add Rating to Continue' })
          return false;
        }
        if (comments == '') {
          this.setState({ errorMsg: 'Kindly add your reviews' })
          return false;
        }

        this.setState({ errorMsg: '', isLoading: true });

        let data = {
          medicine_id: medicineId,
          is_anonymous: is_anonymous,
          rating: rating,
          comments: comments,

        };
        let userId = await AsyncStorage.getItem('userId');
        console.log("data", data)

        let result = await InsertMedicineReviews(userId, data);
        console.log("result", result)
        if (result.success) {
          Toast.show({
            text: result.message,
            type: "success",
            duration: 3000
          });
          this.props.popupVisible({
            visible: false,
          });
        }

        else {
          Toast.show({
            text: result.message,
            type: "danger",
            duration: 3000
          });
        }
        this.setState({ isLoading: false });
      } else {
        this.props.popupVisible({
          visible: false,
        });
        this.setState({  isLoading: false });
      }
    }
    catch (e) {
      console.log(e)
    }
    finally {
      this.setState({ isLoading: false });
    }
  }



  render() {
    const { errorMsg, is_anonymous } = this.state;
    return (
      <Container>
        <Content style={{ backgroundColor: '#EAE6E6', padding: 10 }}>
          {/* <View>
            <Row>
              <TouchableOpacity style={{ borderColor: '#8dc63f', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, height: 25, width: 65, backgroundColor: '#8dc63f' }}
                onPress={() => {
                  this.setModalVisible(true);
                }}>
                <Row style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Insert Reviews</Text>
                </Row>
              </TouchableOpacity>
            </Row>
          </View> */}
          <View style={{ height: 200, position: 'absolute', bottom: 0 }}>
            <Modal
              animationType="slide"
              transparent={true}
              backgroundColor='rgba(0,0,0,0.7)'
              containerStyle={{ justifyContent: 'flex-end', }}
              visible={this.state.modalVisible}
              animationType={'slide'}
            >
              <Grid style={{
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 0,
                marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: 'grey'
              }}>

                <Row style={{ backgroundColor: '#7F49C3', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                  <Left>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.data.medicine_name}</Text>
                  </Left>
                  <Right>
                    <Text style={{ color: '#fff', fontSize: 12 }}>January 2,2020 - 05.30 PM</Text>
                  </Right>
                </Row>

                <View>
                  <View>
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                      <StarRating fullStarColor='#FF9500' starSize={30} starStyle={{ marginLeft: 5 }} containerStyle={{}}
                        disabled={false}
                        maxStars={5}
                        rating={this.state.rating}
                        selectedStar={(rating) => this.setState({rating})}
                      />
                    </View>
                    <View style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
                      <TextInput
                        style={{ height: 80, borderWidth: 0.3, marginTop: 10, width: "100%", borderRadius: 5, fontSize: 14 }}
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
                  {errorMsg ?
                    <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{errorMsg}</Text> : null}
                  <Row style={{ marginTop: 20, marginLeft: 14, marginRight: 20 }}>

                    <Col style={{ flexDirection: 'row', width: '45%', alignItems: "flex-start", justifyContent: 'flex-start' }}>
                      <Checkbox color="#3C98EC" size={5}
                        status={is_anonymous ? 'checked' : 'unchecked'}
                        onPress={() => { this.setState({ is_anonymous: !is_anonymous }); }}
                        style={{ height: 5, width: 5 }} />
                      <Text style={{ color: '#3C98EC', marginTop: 10, fontSize: 12 }}>Anonymous</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginLeft: 20, marginTop: 10, marginRight: 20, marginBottom: 20 }}>

                    <Col style={{ width: '50%' }}>
                    </Col>
                    <Col style={{ width: '50%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <TouchableOpacity style={{ backgroundColor: '#959595', paddingLeft: 20, paddingRight: 20, paddingTop: 3, paddingBottom: 3, borderRadius: 2 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12, }} onPress={() => this.submitReview('CANCEL')} >Cancel</Text></TouchableOpacity>
                      <TouchableOpacity style={{ backgroundColor: '#349631', paddingLeft: 20, paddingRight: 20, paddingTop: 3, paddingBottom: 3, borderRadius: 2, marginLeft: 10 }}><Text uppercase={true} style={{ color: '#FFF', fontSize: 12 }} onPress={() => this.submitReview('ADD')}>Submit</Text></TouchableOpacity>
                    </Col>
                  </Row>
                </View>
              </Grid>
            </Modal>
          </View>
        </Content>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 0
  },
  customImage: {
    height: 90,
    width: 90,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 50
  },

  curvedGrid:
  {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginTop: -135,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#745DA6',
    transform: [
      { scaleX: 2 }
    ],
    position: 'relative',
    overflow: 'hidden',

  },

  normalText:
  {
    fontFamily: 'OpenSans',
    fontSize: 17,
    marginTop: 10
  },
  offerText:
  {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: 'green'

  },
  subText: {
    fontFamily: 'OpenSans',
    fontSize: 17,
    color: 'black'
  },
  transparentLabel1:
  {
    backgroundColor: "#fff",
    height: 35,
    borderRadius: 5
  },

  firstTransparentLabel: {
    fontSize: 12.5,
    marginLeft: 10

  }
});