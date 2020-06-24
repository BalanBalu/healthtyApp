import React, { Component } from 'react';
import { Container, Toast, Content, Text, Form, Button, Item, Card, CardItem, Thumbnail, Icon, CheckBox, Input, Radio } from 'native-base';
import { hasLoggedIn } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { validateBooking } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, isOnlyLetter, toTitleCase } from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { renderDoctorImage, getDoctorEducation, getAllSpecialist,getUserGenderAndAge } from '../../common';
import { SERVICE_TYPES } from '../../../setup/config';
import BookAppointmentPaymentUpdate from '../../providers/bookappointment/bookAppointment';
import { fetchUserProfile } from '../../providers/profile/profile.action';
import { dateDiff } from '../../../setup/helpers';
let patientDetails= []
export default class PaymentReview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bookSlotDetails: {
        diseaseDescription: ''
      },
      isLoading: false,
      othersChecked: false,
      selfChecked: false,
      gender: 'M',
      full_name: '',
      age: '',
      defaultPatientDetails: [],
     


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
    await this.getUserProfile();
  }
  async confirmProceedPayment() {
    let { diseaseDescription } = this.state.bookSlotDetails;
    if (!diseaseDescription || String(diseaseDescription).trim() === '') {
      Toast.show({
        text: 'Please enter valid Reason',
        duration: 3000,
        type: 'warning'
      })
      return
    }
    this.setState({ isLoading: true, spinnerText: "Please Wait" });
    const bookingSlotData = this.state.bookSlotDetails
    const reqData = {
      doctorId: bookingSlotData.doctorId,
      startTime: bookingSlotData.slotData.slotStartDateAndTime,
      endTime: bookingSlotData.slotData.slotEndDateAndTime,
    }
    validationResult = await validateBooking(reqData)
    this.setState({ isLoading: false, spinnerText: ' ' });
    if (validationResult.success) {
      const amount = this.state.bookSlotDetails.slotData.fee;
      this.props.navigation.navigate('paymentPage', { service_type: SERVICE_TYPES.APPOINTMENT, bookSlotDetails: this.state.bookSlotDetails, amount: amount })
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
    let { diseaseDescription } = this.state.bookSlotDetails;
    if (!diseaseDescription || String(diseaseDescription).trim() === '') {
      Toast.show({
        text: 'Please enter valid Reason',
        duration: 3000,
        type: 'warning'
      })
      return
    }
    this.setState({ isLoading: true, spinnerText: "We are Booking your Appoinmtent" })
    console.log(this.state.bookSlotDetails);
    const userId = await AsyncStorage.getItem('userId');
    this.BookAppointmentPaymentUpdate = new BookAppointmentPaymentUpdate();
    let response = await this.BookAppointmentPaymentUpdate.updatePaymentDetails(true, {}, 'cash', this.state.bookSlotDetails, SERVICE_TYPES.APPOINTMENT, userId, 'cash');
    console.log('Book Appointment Payment Update Response ');

    if (response.success) {
      this.props.navigation.navigate('paymentsuccess', { successBookSlotDetails: this.state.bookSlotDetails, paymentMethod: 'Cash', tokenNo: response.tokenNo });
    } else {
      Toast.show({
        text: response.message,
        type: 'warning',
        duration: 3000
      })
    }
    this.setState({ isLoading: false, spinnerText: ' ' });
  }



  getUserProfile = async () => {
    try {
      let fields = "first_name,last_name,gender,dob,mobile_no,address,delivery_address"
      let userId = await AsyncStorage.getItem('userId');
      let result = await fetchUserProfile(userId, fields);
      let patientAddress = [], patientDetails = [];
     

      this.defaultPatientDetails = {
          type: 'self',
          full_name: result.first_name + " " + result.last_name,
          gender: result.gender,
          age: parseInt(dateDiff(result.dob, new Date(), 'years'))
      }

    
  }
  catch (e) {
      console.log(e);
  }
  finally {
      this.setState({ isLoading: false });
  }
}


onChangeSelf = async () => {
  console.log("Start:::", this.state.patientDetails.length);
  if (this.state.selfChecked == true && this.state.patientDetails.length==0) {
      this.state.patientDetails.unshift(this.defaultPatientDetails)
  }
  else if (this.state.selfChecked == false) {
      this.state.patientDetails.shift(this.defaultPatientDetails)
  }
 this.setState({patientDetails:this.state.patientDetails})
  console.log("self:::", this.state.patientDetails);
  
}


addPatientData = async () => {
  if (!this.state.name || !this.state.age || !this.state.gender) {
      this.setState({ errMsg: '* Kindly fill all the fields' })
  } else {
      let temp;
      this.setState({ errMsg: '' })
      temp = this.state.patientDetails;

      temp.push({
          type: 'others',
          full_name: this.state.name,
          age: parseInt(this.state.age),
          gender: this.state.gender
      });
      await this.setState({ patientDetails: temp, updateButton: false });
      await this.setState({ name: null, age: null, gender: null });

  }
}
onChangeCheckBox = async () => {
  if (this.state.othersChecked == true) {
      this.addPatientData()
  }
  if (this.state.othersChecked == false) {
      this.state.patientDetails.map(ele => {
          if (ele.type == 'others') {
              this.state.patientDetails.pop(this.state.patientDetails)
          }
      })
   this.setState({ errMsg:'' })

  }
  await this.setState({ patientDetails })
}

removePatientData(item, index) {
  let temp = this.state.patientDetails
  temp.splice(index, 1);
  this.setState({ patientDetails: temp });
}


  render() {
    const { bookSlotDetails, isLoading, spinnerText, othersChecked, name, age, gender,patientDetails } = this.state;
    // const patientDetails = [{ name: 'Marie Curie', Age: 26, gender: 'Female' }]
    // alert(JSON.stringify( this.state.defaultPatientDetails))
   
    return (

      <Container>
        <Content style={{ padding: 15 }}>
          <Spinner
            visible={isLoading}
            textContent={spinnerText}
          />
          <View style={{ marginBottom: 20 }}>
            <Card transparent >
              <CardItem header style={styles.cardItem}>
                <Grid>
                  {/* <Col style={{alignItems:'center'}}>
                      <Thumbnail square source={ renderDoctorImage(bookSlotDetails) } style={{width:100,height:100,marginTop:-60}}/>
                       <Text style={styles.cardItemText}>{bookSlotDetails.prefix || ''} {bookSlotDetails.doctorName} {getDoctorEducation(bookSlotDetails.education)}</Text>
                       <Text style={styles. cardItemText2}>{getAllSpecialist(bookSlotDetails.specialist)}</Text>
                      </Col> */}
                  <Row>
                    <Col style={{ width: '25%', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderDoctorImage(bookSlotDetails), title: 'Profile photo' })}>
                        <Thumbnail source={renderDoctorImage(bookSlotDetails)} style={{ height: 70, width: 70, borderRadius: 70 / 2 }} />
                      </TouchableOpacity>
                    </Col>
                    <Col style={{ width: '80%', marginTop: 10 }}>
                      <Text style={styles.cardItemText}>{bookSlotDetails.prefix || ''} {bookSlotDetails.doctorName} {getDoctorEducation(bookSlotDetails.education)}</Text>
                      <Text style={styles.cardItemText2}>{getAllSpecialist(bookSlotDetails.specialist)}</Text>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
            </Card>
            <Card style={styles.innerCard}>
              <Grid>
                {/* <Row style={{marginTop:10,marginLeft:10}} >
                   <Icon name="ios-medkit" style={{fontSize:20,marginTop:-5}}/>
                   <Text note style={styles.diseaseText}>Typhoid</Text>
                  </Row> */}
                {bookSlotDetails.slotData ?
                  <View style={{ marginTop: 10, marginLeft: 10 }} >
                    <Row>
                      <Icon name="ios-pin" style={{ fontSize: 20 }} />
                      <Col>
                        <Text style={styles.hospitalText}>{bookSlotDetails.slotData.location.name}</Text>
                        <Text note style={styles.hosAddressText}>{bookSlotDetails.slotData.location.location.address.no_and_street + ', '}
                          {bookSlotDetails.slotData.location.location.address.city + ', '}
                          {bookSlotDetails.slotData.location.location.address.state + '-'} {bookSlotDetails.slotData.location.location.address.pin_code}.</Text>
                      </Col>
                    </Row>
                  </View> : null}
                <Row style={{ borderTopColor: 'gray', borderTopWidth: 1, marginTop: 10 }}>
                  <Col style={{ borderRightColor: 'gray', borderRightWidth: 1, marginTop: 5, alignItems: 'center' }}>
                    <Icon name='md-calendar' style={{ color: '#0055A5', fontSize: 30 }} />
                    <Text style={{ color: '#0055A5', fontFamily: 'OpenSans', fontSize: 12 }}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'Do MMMM, YYYY')}</Text>
                  </Col>
                  <Col style={{ alignItems: 'center', marginTop: 5 }}>
                    <Icon name="md-clock" style={{ color: 'green', fontSize: 30 }} />
                    <Text style={{ color: 'green', fontFamily: 'OpenSans', fontSize: 12 }}>{bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotStartDateAndTime, 'hh:mm A')} - {bookSlotDetails.slotData && formatDate(bookSlotDetails.slotData.slotEndDateAndTime, 'hh:mm A')}</Text>
                  </Col>
                </Row>
              </Grid>
              <CardItem footer style={styles.cardItem2}>
                <Text style={styles.cardItemText3} >Total Fees - {'\u20B9'}{bookSlotDetails.slotData && bookSlotDetails.slotData.fee}</Text>
              </CardItem>
            </Card>
            <View>

              <View style={{ backgroundColor: '#fff', marginTop: 10, marginLeft: 8 }}>
                <Text style={styles.subHead}>For Whom do you need to take up the Checkup?</Text>

                <Row style={{ marginTop: 5 }}>
                  <Col size={10}>
                    <Row>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>

                          <CheckBox style={{ borderRadius: 5 }}
                            checked={this.state.selfChecked}
                            onPress={async () => { await this.setState({ selfChecked: !this.state.selfChecked }),this.onChangeSelf() }}
                          />
                          <Text style={styles.firstCheckBox}>Self</Text>
                        </Row>
                      </Col>
                      <Col size={3}>
                        <Row style={{ alignItems: 'center' }}>
                          <CheckBox style={{ borderRadius: 5 }}

                            checked={this.state.othersChecked}
                            onPress={async () => { await this.setState({ othersChecked: !this.state.othersChecked }),this.onChangeCheckBox() }}
                          />
                          <Text style={styles.firstCheckBox}>Others</Text>
                        </Row>
                      </Col>
                      <Col size={4}>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
              {othersChecked == true ?
                <View style={{ marginTop: 10, marginLeft: 8 }}>
                  <Text style={styles.subHead}>Add other patient's details</Text>
                  <Row style={{ marginTop: 10 }}>
                    <Col size={6}>
                      <Row>
                        <Col size={2}>
                          <Text style={styles.nameAndAge}>Name</Text>
                        </Col>
                        <Col size={8} >
                          <Input placeholder="Enter patient's name" style={styles.inputText}
                            returnKeyType={'next'}
                            keyboardType={"default"}
                            value={name}
                            onChangeText={(name) => this.setState({ name })}
                            blurOnSubmit={false}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col size={4} style={{ marginLeft: 5 }}>
                      <Row>
                        <Col size={2}>
                          <Text style={styles.nameAndAge}>Age</Text>
                        </Col>
                        <Col size={7}>
                          <Input placeholder="Enter patient's age" style={styles.inputText}
                            returnKeyType={'done'}
                            keyboardType="numeric"
                            value={age}
                            onChangeText={(age) => this.setState({ age })}
                            blurOnSubmit={false}
                          />
                        </Col>
                        <Col size={1}>
                        </Col>
                      </Row>
                    </Col>
                  </Row>


                  <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>
                    <Text style={{
                      fontFamily: 'OpenSans', fontSize: 12, marginTop: 3
                    }}>Gender</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                      <Radio
                        standardStyle={true}
                        selected={gender === "M" ? true : false}
                        onPress={() => this.setState({ gender: "M" })} />
                      <Text style={styles.genderText}>Male</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={gender === "F" ? true : false}
                        onPress={() => this.setState({ gender: "F" })} />
                      <Text style={styles.genderText}>Female</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                      <Radio
                        standardStyle={true}
                        selected={gender === "O" ? true : false}
                        onPress={() => this.setState({ gender: "O" })} />
                      <Text style={styles.genderText}>Others</Text>
                    </View>
                  </View>


                </View> : null}

              {othersChecked == true ?
                <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                  <TouchableOpacity style={styles.touchStyle} onPress={() => this.addPatientData()}>
                    <Text style={styles.touchText}>Add patient</Text>
                  </TouchableOpacity>
                </Row> : null}



              <View style={{ backgroundColor: '#fff', marginTop: 10, marginLeft: 8 }}>
                <Text style={styles.subHead}>Patient Details</Text>
                <FlatList
                 data={patientDetails}
                 extraData={patientDetails}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item, index }) =>
                    <View>
                      <Row style={{ marginTop: 10, }}>
                        <Col size={8}>
                          <Row>
                            <Col size={2}>
                              <Text style={styles.commonText}>Name</Text>
                            </Col>
                            <Col size={.5}>
                              <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={7}>
                              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{item.full_name}</Text>

                            </Col>
                          </Row>
                        </Col>
                        <Col size={0.5}>
                          <TouchableOpacity onPress={() => this.removePatientData(item, index)}>
                            <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 18 }} />
                          </TouchableOpacity>
                        </Col>
                      </Row>

                      <Row>
                        <Col size={10}>
                          <Row>
                            <Col size={2}>
                              <Text style={styles.commonText}>Age</Text>
                            </Col>
                            <Col size={.5}>
                              <Text style={styles.commonText}>-</Text>
                            </Col>
                            <Col size={7.5}>
                              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#000' }}>{(item.age) + ' - ' + getUserGenderAndAge(item)}</Text>

                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </View>
                  } />

              </View>














              <Row>
                <Icon name="create" style={{ fontSize: 20, marginLeft: 10, marginTop: 20, color: '#7F49C3' }} />
                <Text style={styles.subText}> Your Reason For Checkup</Text>
              </Row>
              <Form style={{ marginRight: 1, marginLeft: -13 }}>
                <Item style={{ borderBottomWidth: 0 }}>
                  <TextInput
                    onChangeText={(diseaseDescription) => {
                      var bookSlotDetails = { ...this.state.bookSlotDetails }
                      bookSlotDetails.diseaseDescription = diseaseDescription;
                      this.setState({ bookSlotDetails })
                    }}
                    multiline={true} placeholder="Write Reason...."
                    style={styles.textInput} />
                </Item>
              </Form>
            </View>
            <Row style={{ justifyContent: 'center', }}>
              <Button style={styles.payButton1} onPress={() => this.processToPayLater()}>
                <Text style={styles.payButtonText}>Pay at {bookSlotDetails.slotData && toTitleCase(bookSlotDetails.slotData.location.type)}</Text>
              </Button>

              <Button style={styles.payButton}
                onPress={() => this.confirmProceedPayment()} >
                <Text style={styles.payButtonText}>Pay Online</Text>
              </Button>

            </Row>
          </View>
        </Content>
      </Container>

    )
  }

}

const styles = StyleSheet.create({

  cardItem: {
    backgroundColor: '#784EBC',
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    marginTop: 20,

  },
  cardItemText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardItemText2: {
    marginTop: 5,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#FFF',
    lineHeight: 15,
    width: '90%'
  },
  cardItemText3: {
    fontFamily: 'OpenSans',
    fontSize: 16,
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
    fontSize: 14,
    marginLeft: 10,
    fontStyle: 'italic',
    marginTop: -5
  },
  hospitalText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    marginLeft: 15,
    width: "80%"
  },
  hosAddressText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    marginLeft: 15,
    fontStyle: 'italic',
    width: "80%",
    marginTop: 5
  },
  cardItem2: {
    backgroundColor: '#784EBC',
    marginLeft: -5,
    marginBottom: -10,
    marginRight: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    height: 40,
    marginTop: 10,
    alignItems: 'center'
  },
  cardItemText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF'
  },
  subText: {
    fontFamily: 'Opensans',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 5,
    color: '#7F49C3'
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 0.5,
    height: 100,
    fontSize: 14,
    textAlignVertical: 'top',
    width: '100%',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingRight: 10,
    marginTop: 15
  },
  payButton: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    marginLeft: 25,
    padding: 10,
    backgroundColor: '#149C00'
  },
  payButton1: {
    borderRadius: 10,
    height: 40,
    marginTop: 20,
    backgroundColor: '#0055A5'
  },
  payButtonText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  touchStyle: {
    backgroundColor: '#7F49C3',
    borderRadius: 3,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 5,
    paddingTop: 5
  },
  touchText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center'
  },
  subHead: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#7F49C3',
    fontWeight: 'bold'
  },
  firstCheckBox: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#000',
    marginLeft: 20
  },
  nameAndAge: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#000',
    marginTop: 5
  },
  genderText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginLeft: 10
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#000',
    fontWeight: '500'
  },
  inputText: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    fontSize: 10,
    height: 33,
  }


});