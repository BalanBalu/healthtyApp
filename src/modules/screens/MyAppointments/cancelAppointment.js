import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Radio, Button, Card, Grid, ListItem, List, View, Text, Toast, CardItem, Right, Body, Content, Input, Item, Row, Col } from 'native-base';
import { appointmentStatusUpdate } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../setup/helpers';

import { Loader } from '../../../components/ContentLoader'


class CancelAppointment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: '',
      doctorId: '',
      appointmentId: '',
      statusUpdateReason: '',
      isLoading: false,
      radioStatus: [true, false, false, false, false],

    }


  }
  toggleRadio = async (radioSelect, reasonSelect) => {
    let tempArray = [false, false, false, false, false];
    tempArray[radioSelect] = true;
    await this.setState({ radioStatus: tempArray, statusUpdateReason: reasonSelect });
  }
  async componentDidMount() {

    const { navigation } = this.props;
    const cancelData = navigation.getParam('appointmentDetail');
    let doctorId = cancelData.doctor_id;
    let appointmentId = cancelData._id;
    await this.setState({ doctorId: doctorId, appointmentId: appointmentId, data: cancelData });

  }

  /* Cancel Appoiontment Status */
  cancelAppointment = async (data, updatedStatus) => {
    try {

      if (this.state.statusUpdateReason != null) {
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

        let userId = await AsyncStorage.getItem('userId');
        let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
        if (result.success) {
          let temp = this.state.data;
          temp.appointment_status = result.appointmentData.appointment_status;
          temp.status_update_reason = result.appointmentData.status_update_reason;
          this.setState({ data: temp });
          this.props.navigation.navigate('AppointmentInfo', { data: this.state.data });
        }
        else{
          Toast.show({
            text: 'Kindly add a reason for Appointment Cancellation',
            type: "danger",
            duration: 3000
          })
        }
      }
      this.setState({ isLoading: false });

    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    const { data, isLoading } = this.state;

    return (

      <Container style={styles.container}>
        <Content>
          {isLoading ? <Loader style={'list'} /> :

            <Card style={{ borderRadius: 5, padding: 5,height:'200%' }}>
              <Card>
                <CardItem style={styles.text}>
                  <Body>
                    <Text > We understand life can get in the way! cancelling or missing your appointment too many times will result in your account being locked!</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ marginTop: 2, }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " +
                          formatDate(data.appointment_starttime, 'hh:mm A')}
                      </Text> with {(data && data.prefix) + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)}</Text>
                    <Text style={{ marginTop: 20, }}>What is the reason for Cancellation?</Text>


                    <ListItem onPress={() => this.toggleRadio(0, "I am feeling better")}>
                      <Radio borderColor='black' selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio(0, "I am feeling better")}
                        selectedColor={"#775DA3"} testID='checkOption_1Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>I am feeling better</Text>
                    </ListItem>

                    <ListItem onPress={() => this.toggleRadio(1, " am looking for sooner or faster")}>
                      <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio(1, "Iam looking for sooner or faster")} color={"#775DA3"}
                        selectedColor={"#775DA3"} testID='checkOption_2Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>I am looking for sooner or faster</Text>

                    </ListItem>


                    <ListItem onPress={() => this.toggleRadio(2, "I will not be able to make this on the time")}>
                      <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio(2, "I will not be able to make this on the time")} color={"#775DA3"}
                        selectedColor={"#775DA3"} testID='checkOption_3Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>I will not be able to make this on the time</Text>
                    </ListItem>



                    <ListItem onPress={() => this.toggleRadio(3, "I want to reshedule with different type")}>
                      <Radio selected={this.state.radioStatus[3]} color="red" selectedColor="green" onPress={() => this.toggleRadio(3, "I want to reshedule with different type")} color={"#775DA3"}
                        selectedColor={"#775DA3"} testID='checkOption_4Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>I want to reshedule with different type</Text>
                    </ListItem>

                    <ListItem onPress={() => this.toggleRadio(4, null)}>
                      <Radio selected={this.state.radioStatus[4]} onPress={() => this.toggleRadio(4, null)} color={"#775DA3"}
                        selectedColor={"#775DA3"} testID='checkOption_5Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>Others</Text>
                    </ListItem>

                    {this.state.radioStatus[4] === true ?
                      <Col>
                        <Text style={{ fontSize: 16, marginTop: 20 }}> Write your reason </Text>
                        <TextInput style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 }}
                          placeholder="Write your reason here"
                          multiline={true}
                          textAlignVertical={'top'}
                          onChangeText={statusUpdateReason => this.setState({ statusUpdateReason })}
                          testID='addToEditReason' />
                      </Col>
                      : null}

                    <Row style={{ marginTop: 10 }}>
                      <Button style={styles.button1} onPress={() => (this.cancelAppointment(data, 'CLOSED'))} testID='appointment_cancel'>
                        <Text style={{ color: '#000' }}> SUBMIT</Text>
                      </Button>


                      <Button success style={styles.button2} onPress={() => this.props.navigation.navigate('AppointmentInfo')} testID='iconToEditContact'>
                        <Text style={{ color: '#000' }}>CANCEL</Text>
                      </Button>
                    </Row>

                  </Body>

                </CardItem>
              </Card>
            </Card>
          }
        </Content>

      </Container>
    );
  }
}
export default CancelAppointment


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c9cdcf',
    padding: 5

  },



  title: {
    paddingLeft: 40, paddingTop: 10

  },
  text: {
    backgroundColor: "#c9cdcf",
    fontSize: 14
  },
  button1: {
    backgroundColor: "#c9cdcf",
    borderRadius: 10,
    justifyContent: 'center',
    padding: 1,
    marginTop: 15,
    width: '30%',


  },

  button2: {

    borderRadius: 10,
    marginLeft: 5,
    justifyContent: 'center',
    padding: 30,
    marginTop: 15,
    width: '70%',

  }

})


