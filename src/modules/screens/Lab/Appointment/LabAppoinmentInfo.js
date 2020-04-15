import React, { Component } from 'react';
import {
  Container, Content, Text, Button, Item, Card, List, ListItem, Left, Right,
  Thumbnail, Body, Icon, Toast, View, CardItem
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, TouchableOpacity, Modal } from 'react-native';
import StarRating from 'react-native-star-rating';
import { FlatList } from 'react-native-gesture-handler';
import { formatDate, addTimeUnit, subTimeUnit, statusValue } from "../../../../setup/helpers";

class LabAppointmentInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      appointmentId: '',
      doctorId: '',
      userId: '',
      reviewData: [],
      reportData: null,
      doctorData: {},
      isLoading: true,
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    const appointmentData = navigation.getParam('data');
        console.log("appointmentData", appointmentData)
    if (appointmentData != undefined) {
      this.setState({ data: appointmentData })
    }
  }
labTestCategoryOfferedPrice(item){
  console.log("item", item)
  
  // (parseInt(data.available_lab_test_categories && data.available_lab_test_categories.price) - ((parseInt(data.available_lab_test_categories && data.available_lab_test_categories.offer) / 100) * parseInt(data.available_lab_test_categories && data.available_lab_test_categories.price)))
}
  render() {
    const patientInfo = [{ name: 'S. Mukesh Kannan [Male]', age: 26 }, { name: 'U. Ajay Kumar [Male]', age: 30 }]
    const { data}=this.state
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <View style={{ marginBottom: 20 }}>
            <Card style={{
              borderRadius: 10,
            }}>
              <CardItem header style={styles.cardItem}>
                <Grid>
                  {/* <Text style={{ textAlign: 'right', fontSize: 14, marginTop: -15 }}>{"Ref no :" + data.token_no}</Text> */}
                  <Row>
                    <Col style={{ width: '25%', }}>
                      <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                    </Col>
                    <Col style={{ width: '80%', marginTop: 10 }}>
                      <Row>
                        <Col size={9}>
                          <Text style={styles.Textname} >{data.labInfo && data.labInfo.lab_name}</Text>
                          <Text style={{ fontSize: 12, fontFamily: 'OpenSans', fontWeight: 'normal' }}>{data.lab_test_descriptiion}</Text>
                        </Col>
                        <Col size={1}>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
              <Grid>
                <Row>
                  <Col size={6}>
                    <Row style={{ marginLeft: 5 }} >
                      <Text style={styles.subText1}>Consultation Fee</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>{this.labTestCategoryOfferedPrice(data.available_lab_test_categories)}</Text>
                    </Row>
                    <Row style={{ marginTop: 10, marginLeft: 5 }}>
                      <Text style={styles.subText1}>Payment Method</Text>
                      <Text style={styles.subText2}>-</Text>
                      <Text note style={styles.subText2}>Card</Text>
                    </Row>
                  </Col>
                  <Col size={4}>

                    <Row >
                      <TouchableOpacity style={[styles.postponeButton, { backgroundColor: '#6FC41A' }]} onPress={() => this.updateAppointmentStatus(data, 'APPROVED')}>
                        <Text style={styles.ButtonText}>CONFIRM</Text>
                      </TouchableOpacity>
                    </Row>


                    <Row style={{ marginTop: 10 }}>
                      <TouchableOpacity style={[styles.postponeButton2, { backgroundColor: '#4865FF' }]} onPress={() => this.navigateCancelAppoointment()}>
                        <Text capitalise={true} style={styles.ButtonText}>POSTPONE</Text>
                      </TouchableOpacity>
                    </Row>
                  </Col>
                </Row>

              </Grid>

              <CardItem footer style={styles.cardItem2}>
                <Grid>
                  <Row style={{ height: 25, marginRight: 5, justifyContent: 'center' }} >
                    <Col style={{ width: '50%', justifyContent: 'center' }}>
                      <Row style={{ alignItems: 'center' }}>
                        <Icon name='md-calendar' style={styles.iconStyle} />
                        <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'DD MMM,YYYY')}</Text>
                      </Row>
                    </Col>
                    <Col style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                      <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="md-clock" style={styles.iconStyle} />
                        <Text style={styles.timeText}>{formatDate(data.appointment_starttime, 'hh:mm a') + '-' + formatDate(data.appointment_endtime, 'hh:mm a')}</Text>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>

            </Card>


            <Grid>

              <View style={{ marginTop: 10 }}>
                <Row style={styles.rowSubText}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-flask" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Patient Details</Text>
                  </Col>
                </Row>
                <FlatList
                  data={data.patient_data}
                  renderItem={({ item }) =>
                    <View style={styles.commonView}>
                      <Row>
                        <Col size={1.5}>
                          <Text style={styles.commonText}>Name </Text>

                        </Col>
                        <Col size={0.5}>
                          <Text style={styles.commonText}>-</Text>

                        </Col>
                        <Col size={8}>
                          <Text note style={styles.commonText}>{item.patient_name}</Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col size={1.5}>
                          <Text style={styles.commonText}>Age</Text>

                        </Col>
                        <Col size={0.5}>
                          <Text style={styles.commonText}>-</Text>

                        </Col>
                        <Col size={8}>
                          <Text note style={styles.commonText}>{item.patient_age} years</Text>
                        </Col>
                      </Row>
                    </View>

                  } />
                <Row style={[styles.rowSubText, { borderTopColor: '#909090', borderTopWidth: 0.3, paddingTop: 10 }]}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-flask" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Lab Test</Text>
                    <Text note style={styles.subTextInner1}>Full body check up test</Text>
                  </Col>
                </Row>

                <Row style={[styles.rowSubText, { borderTopColor: '#909090', borderTopWidth: 0.3, paddingTop: 10 }]}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-pin" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Pick Up at Lab</Text>
                    <Text style={[styles.commonText, { color: '#4c4c4c', marginTop: 5 }]}>{data.labInfo && data.labInfo.lab_name}</Text>
                    <Text note style={[styles.subTextInner1, { marginTop: 10 }]}></Text>
                  </Col>
                </Row>


                <Row style={styles.rowStyles}>
                  <Col style={{ width: '8%', paddingTop: 5 }}>
                    <Icon name="ios-cash" style={{ fontSize: 18, }} />
                  </Col>
                  <Col style={{ width: '92%', paddingTop: 5 }}>
                    <Text style={styles.innerSubText}>Payment Info</Text>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Total Fee
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>100</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Made
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>23</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Due
                </Text>
                      </Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>123</Text>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col style={{ width: '60%' }}>
                        <Text style={styles.downText}>Payment Method
              </Text></Col>
                      <Col style={{ width: '15%' }}>
                        <Text style={styles.downText}>-</Text>
                      </Col>
                      <Col style={{ width: '25%' }}>
                        <Text note style={styles.downText}>cash</Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
            </Grid>
          </View>
        </Content>
      </Container>


    )

  }
}

export default LabAppointmentInfo


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 10

  },

  cardItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    height: 100,
  },
  cardItemText2: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    marginTop: 5,
    fontStyle: 'italic',
    width: '90%'
  },
  Textname: {
    fontSize: 14,
    fontFamily: 'OpenSans',
    fontWeight: 'bold'
  },
  specialistTextStyle: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: 'normal',
    marginTop: 5

  },
  subText1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 'bold'
  },
  subText2: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    marginLeft: 5
  },
  subText3: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginLeft: 5
  },
  confirmButton: {
    backgroundColor: '#6FC41A',
    height: 30,
    padding: 17,
    borderRadius: 5
  },
  ButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textApproved: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postponeButton: {
    // backgroundColor:'#4765FF',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5
  },
  postponeButton2: {
    // backgroundColor:'#4765FF',
    paddingLeft: 26.5,
    paddingRight: 26.5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5
  },
  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: -10
  },
  iconStyle: {
    fontSize: 20,
    color: '#FFF'
  },
  rowStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  touchableStyle: {
    borderColor: '#4765FF',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8
  },
  touchableText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4765FF',
    marginTop: 4,
    marginLeft: 5
  },
  rowSubText: {
    marginLeft: 10,
    // borderBottomColor:'gray',
    // borderBottomWidth:0.5,
    marginRight: 10,
    marginTop: 10
  },
  innerSubText: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  subTextInner1: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    marginTop: 5
  },
  subTextInner2: {
    fontSize: 10,
    color: "red",
    fontFamily: 'OpenSans',
    marginBottom: 5
  },

  downText: {
    fontSize: 12,
    fontFamily: 'OpenSans',
  },
  cardItemText3: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    height: 30,
    fontWeight: 'bold',
    color: '#FFF', paddingBottom: -10
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
  innerCard: {
    marginTop: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5
  },
  diseaseText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 10,
    fontStyle: 'italic',
    marginTop: -5
  },
  hospitalText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 15,
    width: "80%"
  },
  hosAddressText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    marginLeft: 15,
    fontStyle: 'italic',
    width: "80%",
    marginTop: 5
  },
  cardItem2: {
    backgroundColor: '#784EBC',
    marginBottom: -10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: "center",
    height: 35,
    marginTop: 10
  },
  cardItem3: {
    backgroundColor: '#784EBC',
    marginBottom: -10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginLeft: -10,
    marginBottom: -10,
    marginRight: -10,
    //  justifyContent:'center',
    //  alignItems:"center",ss
    height: 35,
    marginTop: -10
  },
  cardItemText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF'
  },
  subText: {
    fontFamily: 'Opensans',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 5
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
  },
  rowSubText1: {
    marginLeft: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,

    marginTop: 10
  },
  innerSubText1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    color: '#7558e5',
    marginTop: 5
    // marginBottom: 5
  },
  commonView: {
    borderRadius: 5,
    borderColor: '#909090',
    borderWidth: 0.3,
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  rowStyles: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderTopColor: '#909090',
    borderTopWidth: 0.3,
    paddingTop: 10
  }


})

