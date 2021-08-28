import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container, Radio, Button, Card, Grid, ListItem, List, View, Text, Toast, CardItem, Right, Body, Content, Input, Item, Row, Col } from 'native-base';
import { appointmentStatusUpdate } from '../../providers/bookappointment/bookappointment.action';
import { formatDate } from '../../../setup/helpers';
import {reomveEvent} from '../../../setup/calendarEvent'
import{onlySpaceNotAllowed ,getName,getHospitalHeadeName} from '../../common';
import { Loader } from '../../../components/ContentLoader'
import Spinner from '../../../components/Spinner';
import {primaryColor} from '../../../setup/config'


class CancelAppointment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: '',
      doctorId: '',
      appointmentId: '',
      statusUpdateReason:'',
      isLoading: false,
      radioStatus: [false, false, false, false, false],

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
  
    let doctorId = cancelData.doctorId;
    let appointmentId = cancelData._id;
    await this.setState({ doctorId: doctorId, appointmentId: appointmentId, data: cancelData });

  }

  /* Cancel Appoiontment Status */
  cancelAppointment = async (data, updatedStatus) => {
    try {
      let memberId = await AsyncStorage.getItem('memberId');
 
      if (onlySpaceNotAllowed(this.state.statusUpdateReason) == true) {
        this.setState({ isLoading: true });
        let requestData = {
          _id:data._id,
          doctorId: data.doctorId||null,
          userId: memberId,
          startTime: data.startTime,
          endTime: data.endTime,
          status: updatedStatus,
          statusUpdateReason: this.state.statusUpdateReason,
          statusBy: 'USER',
          bookedFor:data.bookedFor||'DOCTOR'
        };
        // if(data.bookedFor==='HOSPITAL'){
        //   delete requestData.doctorId
        //   requestData.hospitalAdminId=data.hospitalInfo.hospitalAdminId
        // }

   
        let result = await appointmentStatusUpdate( requestData);
        
        if (result&&result._id) {
          //Need To Discuss
        // await reomveEvent(data.userAppointmentEventId)
      
          Toast.show({
            text: 'Your appointment has been canceled',
            duration: 3000,
            type: 'success'
          })
          let temp = this.state.data;
          temp.status = result.status;
          temp.statusUpdateReason = result.statusUpdateReason;
          temp.statusBy=result.statusBy;
          
         await this.setState({ data: temp });
          this.props.navigation.navigate('AppointmentInfo', { data: this.state.data });
        }
        else {
          
          Toast.show({
            text: 'Somthing went worng please try again..',
            type: "danger",
            duration: 3000
          })
        }
      }
      else {
        Toast.show({
          text: 'Write a reason for Appointment Cancellation',
          type: "danger",
          duration: 3000
        })
      }


    }
    catch (e) {
      console.log(e);
    }
    finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { data, isLoading } = this.state;

    return (

      <Container style={styles.container}>
        <Content>
          
          <Spinner visible={isLoading}/>
          

            <Card style={{ borderRadius: 5, padding: 5, height: '200%' }}>
              <Card>
                <CardItem style={styles.text}>
                  <Body>
                    <Text style={{fontFamily:'Roboto',fontSize:15}}> We understand life can get in the way! Cancelling or missing your appointment too many times will result in your account being locked!</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={{ marginTop: 2,fontFamily:'Roboto',fontSize:15 }}>
                      <Text style={{fontFamily:'opensans-bold',fontSize:15}}>
                        {formatDate(data.startTime, 'MMMM-DD-YYYY') + "   " +
                          formatDate(data.starTtime, 'hh:mm A')}
                     
                      </Text> with {data.bookedFor==='HOSPITAL'?getHospitalHeadeName(data.hospitalInfo):(data &&data.doctorInfo&& data.doctorInfo.prefix || '') + " " + getName(data.doctorInfo)}</Text>
                    <Text style={{ marginTop: 20,fontFamily:'Roboto',fontSize:15 }}>What is the reason for Cancellation?</Text>


                    <Row onPress={() => this.toggleRadio(0, "I am feeling better")} style={{marginTop:10}}>
                      <Radio borderColor='black' selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio(0, "I am feeling better")}
                          color={primaryColor} selectedColor={primaryColor} testID='checkOption_1Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto',fontSize:15,marginTop:3}}>I am feeling better</Text>
                    </Row>

                    <Row onPress={() => this.toggleRadio(1, " am looking for an earlier slot/appointment")} style={{marginTop:10}}>
                      <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio(1, "Iam looking for an earlier slot/appointment")} color={primaryColor}
                         color={primaryColor} selectedColor={primaryColor} testID='checkOption_2Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto',fontSize:15,width:'95%',marginTop:3}}>I am looking for an earlier slot/appointment</Text>

                    </Row>


                    <Row onPress={() => this.toggleRadio(2, "I won't be able to make it today")} style={{marginTop:10}}>
                     
                      <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio(2, "I won't be able to make it today")} color={primaryColor}
                          color={primaryColor} selectedColor={primaryColor} testID='checkOption_3Selected' />
                     
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto',fontSize:15,width:'95%',marginTop:3}}>I won't be able to make it today</Text>

                      
                    </Row>



                    <Row onPress={() => this.toggleRadio(3, "I want to reschedule with different type")} style={{marginTop:10}}>
                      <Radio selected={this.state.radioStatus[3]} color="red" selectedColor="green" onPress={() => this.toggleRadio(3, "I want to reschedule with different type")} color={primaryColor}
                         color={primaryColor} selectedColor={primaryColor} testID='checkOption_4Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto',fontSize:15,width:'95%',marginTop:3}}>I want to reschedule with different type</Text>
                    </Row>

                    <Row onPress={() => this.toggleRadio(4, null)} style={{marginTop:10}}>
                      <Radio selected={this.state.radioStatus[4]} onPress={() => this.toggleRadio(4, null)} color={primaryColor}
                         color={primaryColor}  selectedColor={primaryColor} testID='checkOption_5Selected' />
                      <Text style={{ marginLeft: 10, fontFamily: 'Roboto',fontSize:15,marginTop:3 }}>Others</Text>
                    </Row>

                    {this.state.radioStatus[4] === true ?
                      <Col>
                        <Text style={{ fontSize: 15, marginTop: 20 ,fontFamily:'Roboto'}}> Write your reason </Text>
                        <TextInput style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 ,fontSize:15}}
                          placeholder="Write your reason here"
                          multiline={true}
                          textAlignVertical={'top'}
                          onChangeText={statusUpdateReason => this.setState({ statusUpdateReason })}
                          testID='addToEditReason' />
                      </Col>
                      : null}

                    <Row style={{ marginTop: 10 }}>
                      <Button style={styles.button1} onPress={() => this.props.navigation.navigate('AppointmentInfo')}  testID='appointment_cancel'>
                        <Text style={{ color: '#000',fontFamily:'Roboto',fontSize:13 }}>Back</Text>
                      </Button>


                      <Button danger style={styles.button2} onPress={() => this.cancelAppointment(data, 'CANCELED')} testID='iconToEditContact'>
                        <Text style={{ color: '#FFF' ,fontFamily:'Roboto',fontSize:13 }}>Cancel</Text>
                      </Button>
                    </Row>

                  </Body>

                </CardItem>
              </Card>
            </Card>
          
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
    fontSize: 15
  },
  button1: {
    backgroundColor: "#c9cdcf",
    borderRadius: 10,
    justifyContent: 'center',
    padding: 1,
    marginTop: 15,
    width: '40%',


  },

  button2: {

    borderRadius: 10,
    marginLeft: 5,
    justifyContent: 'center',
    padding: 30,
    marginTop: 15,
    width: '60%',

  }

})


