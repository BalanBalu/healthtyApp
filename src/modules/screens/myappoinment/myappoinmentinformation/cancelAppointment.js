import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Radio, Button, Card, Grid, View, Text,CardItem, Body, Content, Input, Item, Row, Col } from 'native-base';
import { appointmentStatusUpdate } from '../../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../../setup/helpers';

import { Loader } from '../../../../components/ContentLoader'


class CancelAppointment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: '',
            doctorId: '',
            appointmentId: '',
            statusUpdateReason: '',
            appointmentStatus: '',
            isLoading: false,
            radioStatus: [true, false, false, false, false],
            reason:[]
        }
     

    }
    toggleRadio = (radioSelect, reasonSelect) => {
      console.log(radioSelect+reasonSelect)
        let tempArray = [false, false, false, false, false];
        tempArray[radioSelect] = true;
        this.setState({ radioStatus: tempArray });

        this.setState({ reason: reasonSelect });
    }
    async componentDidMount() {
       
        const { navigation } = this.props;
        const cancelData = navigation.getParam('appointmentDetail');
       let doctorId = cancelData.doctor_id;
        let appointmentId = cancelData._id;
        await this.setState({ doctorId: doctorId, appointmentId: appointmentId, data: cancelData });
        console.log(this.state.data);

    }
    doCancel= async(data, status)=> {
       this.updateAppointmentStatus(data, status)
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
           //console.log(requestData);
            let userId = await AsyncStorage.getItem('userId');
            console.log('userId' + userId);
            let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
            this.setState({ isLoading: false })
            //console.log(result);
            //console.log('update result' + JSON.stringify(result));
            let appointmentStatus = result.appointmentData.appointment_status;
            //console.log(appointmentStatus);
            await this.setState({data:result, appointmentStatus: appointmentStatus , isLoading: true});
            console.log('1'+JSON.stringify(this.state.data));
            this.props.navigation.navigate('AppointmentInfo', { cancelDetails: this.state.appointmentStatus})

          }
        catch (e) {
            console.log(e);
        }
    }
    // backNavigation(){
    //   console.log('2'+JSON.stringify(this.state.data));

    //      this.props.navigation.navigate('AppointmentInfo', { cancelDetails: this.state.data})
    //      console.log('3'+JSON.stringify(this.state.data));

    //   }
    render() {
        const { data, isLoading } = this.state;

        return (

    <Container style={styles.container}>
    {isLoading == true ? <Loader style={'list'} /> :
    <Content style={styles.bodycontent}>
 
    <Card style={{ borderRadius: 5, padding: 10, height: 'auto' }}>
        <Card>
      <CardItem style={styles.text}>
        <Body>
          <Text > we understand life can get in the way! cancelling or missing your appointment too many times will result in your account being locked!</Text>
        </Body>
      </CardItem>
      <CardItem>
        <Body>
          <Text style={{ marginTop: 15, }}>
            <Text style={{ fontWeight: "bold" }}>
            {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " + 
             formatDate(data[0] && data[0].appointment_starttime, 'hh:mm A')}
            </Text> with {'Dr.' + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)}</Text>
            <Text style={{ marginTop: 20, }}>What is the reason for Cancellation?</Text>
          <Row style={{ marginLeft: 20, marginTop: 10 }}>
          <Radio borderColor='black' selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio("0", "I am feeling better")} 
           
            
            selectedColor={"#775DA3"} />
            <Col>
              <Text style={{
                marginLeft: 10, fontFamily: 'OpenSans',
              }}>I am feeling better</Text>
            </Col>

          </Row>


          <Row style={{ marginLeft: 20, marginTop: 10 }}>
          <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio(1, "Iam looking for sooner or faster")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Col>
              <Text style={{
                marginLeft: 10, fontFamily: 'OpenSans',
              }}>Iam looking for sooner or faster</Text>
            </Col>

          </Row>


          <Row style={{ marginLeft: 20, marginTop: 10 }}>
          <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio("2", "I will not be able to make this on the time")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Col>
              <Text style={{
                marginLeft: 10, fontFamily: 'OpenSans',
              }}>I will not be able to make this on the time</Text>
            </Col>

          </Row>

          <Row style={{ marginLeft: 20, marginTop: 10 }}>
          <Radio selected={this.state.radioStatus[3]} onPress={() => this.toggleRadio("3", "I want to reshedule with different type")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Col>
              <Text style={{
                marginLeft: 10, fontFamily: 'OpenSans',
              }}>I want to reshedule with different type</Text>

            </Col>

          </Row>

          <Row style={{ marginLeft: 20, marginTop: 10 }}>
          <Radio selected={this.state.radioStatus[4]} onPress={() => this.toggleRadio("4", "Other")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Col>
              <Text style={{
                marginLeft: 10, fontFamily: 'OpenSans',
              }}>Other</Text>
            </Col>
          </Row>

          <Text style={{ fontSize: 16, marginTop: 20 }}>
            Write your reason
              </Text>
            <TextInput 
            style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 }}
            placeholder="Write your reason here"
            onChangeText={(statusUpdateReason) => this.setState({ statusUpdateReason })}
               />
          
          <Row style={{ marginTop: 25 }}><Col>
            <Button style={styles.button1} onPress={() => this.doCancel(data, 'CLOSED')}>
                <Text> SUBMIT</Text>
                </Button>
          </Col>
            <Col>
              <Button style={styles.button2} onPress={() => this.props.navigation.navigate('AppointmentInfo')}>
                  <Text>CANCEL</Text>
                  </Button>
            </Col></Row>

        </Body>

      </CardItem>
    </Card>
  </Card>
</Content>
            }
</Container>
);
}
}
export default CancelAppointment


const styles = StyleSheet.create({
container: {
backgroundColor: 'gray',
padding: 5

},

card: {
width: 'auto',
borderRadius: 100

},
title: {
paddingLeft: 40, paddingTop: 10

},
grid: {
backgroundColor: '#f5f5f5',
marginBottom: 5,
marginTop: 5,
height: 'auto',
width: 'auto',
marginLeft: 5,
marginRight: 5
},
card: {
backgroundColor: '#f5f5f5',
marginBottom: 10,
marginTop: 10,
height: 540,
width: 'auto',
marginLeft: 10,
marginRight: 10

},
text: {
backgroundColor: "grey",
color: "white",
fontSize: 14
},

subcard: {
backgroundColor: 'grey',
marginBottom: 10,
marginTop: 10,
height: 50,
width: 'auto',
marginLeft: 15
},

button1: {
backgroundColor: "#7459a0",
marginLeft: 'auto',
marginRight: 'auto',
borderRadius: 5,
justifyContent: 'center',
padding: 30,
marginTop: 15,
},

button2: {
backgroundColor: "#7459a0",
marginLeft: 'auto',
marginRight: 'auto',
borderRadius: 5,
justifyContent: 'center',
padding: 30,
marginTop: 15,
}

})

