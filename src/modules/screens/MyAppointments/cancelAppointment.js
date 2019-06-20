import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Radio, Button, Card, Grid, ListItem,List, View, Text,CardItem,Right, Body, Content, Input, Item, Row, Col } from 'native-base';
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
        await this.setState({ radioStatus: tempArray , statusUpdateReason: reasonSelect});
        console.log(tempArray);
        
    }
    async componentDidMount() {
       
        const { navigation } = this.props;
        const cancelData = navigation.getParam('appointmentDetail');
       let doctorId = cancelData.doctor_id;
        let appointmentId = cancelData._id;
        await this.setState({ doctorId: doctorId, appointmentId: appointmentId, data: cancelData });
        console.log(this.state.data);

    }
    
    /* Cancel Appoiontment Status */
    cancelAppointment = async (data, updatedStatus) => {
        try {
          if(this.state.statusUpdateReason != null){
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
            console.log('result'+ result) 
            if(result.success){
            let temp = this.state.data;          
            temp.appointment_status = result.appointmentData.appointment_status;   
            temp.status_update_reason = result.appointmentData.status_update_reason;
           this.setState({data:temp});  
           this.props.navigation.navigate('AppointmentInfo',{data:this.state.data});
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
    <Content style={styles.bodycontent}> 
    {isLoading  ? <Loader style={'list'} /> :

    <Card style={{ borderRadius: 5, padding: 15, height: 'auto' }}>
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
        <Text style={{ marginTop: 40, }}>What is the reason for Cancellation?</Text>
        
        
          <ListItem onPress={() => this.toggleRadio(0, "I am feeling better")}>
          <Radio borderColor='black' selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio(0, "I am feeling better")}       
          selectedColor={"#775DA3"} />
                <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>I am feeling better</Text>
            </ListItem>
           
         <ListItem onPress={() => this.toggleRadio(1, " am looking for sooner or faster")}>
          <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio(1, "Iam looking for sooner or faster")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Text style={{ marginLeft: 10, fontFamily: 'OpenSans'}}>I am looking for sooner or faster</Text>

            </ListItem>
        
         
          <ListItem onPress={() => this.toggleRadio(2, "I will not be able to make this on the time")}>
          <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio(2, "I will not be able to make this on the time")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
             <Text style={{ marginLeft: 10, fontFamily: 'OpenSans'}}>I will not be able to make this on the time</Text>
           </ListItem>
         

          
          <ListItem onPress={() => this.toggleRadio(3, "I want to reshedule with different type")}>
          <Radio selected={this.state.radioStatus[3]} color="red" selectedColor="green" onPress={() => this.toggleRadio(3, "I want to reshedule with different type")} color={"#775DA3"}
              selectedColor={"#775DA3"} />
            <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>I want to reshedule with different type</Text>
          </ListItem>
         
          <ListItem onPress={() => this.toggleRadio(4, null)}>
          <Radio selected={this.state.radioStatus[4]} onPress={() => this.toggleRadio(4, null)} color={"#775DA3"}
              selectedColor={"#775DA3"} />
              <Text style={{marginLeft: 10, fontFamily: 'OpenSans'}}>Others</Text>
              </ListItem>
             
     {this.state.radioStatus[4] === true?
         <Col> 
          <Text style={{ fontSize: 16, marginTop: 20 }}> Write your reason </Text>
            <TextInput style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300 }}
            placeholder="Write your reason here"
             onChangeText ={statusUpdateReason => this.setState({ statusUpdateReason })}
             />
          </Col>
           : null} 
          
          <Row style={{ marginTop: 45 }}><Col>
            <Button style={styles.button1} onPress={() => (this.cancelAppointment(data, 'CLOSED'))}>
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
  }
</Content>
   
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



title: {
paddingLeft: 40, paddingTop: 10

},
// grid: {
// backgroundColor: '#f5f5f5',
// marginBottom: 5,
// marginTop: 5,
// height: 'auto',
// width: 'auto',
// marginLeft: 5,
// marginRight: 5
// },
// card: {
// backgroundColor: '#f5f5f5',
// marginBottom: 10,
// marginTop: 10,
// height: 'auto',
// width: 'auto',
// marginLeft: 10,
// marginRight: 10

// },

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


