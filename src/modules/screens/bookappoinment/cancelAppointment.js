import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Radio, Button, Card, Grid, View, Text, Content, Input, Item, Row, Col } from 'native-base';
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
            isLoading: false
          
        }
    }
   
    async componentDidMount() {
              const { navigation } = this.props;
          const cancelData = navigation.getParam('appointmentDetail');
       let doctorId = cancelData.doctor_id;
        let appointmentId = cancelData._id;
        await this.setState({ doctorId: doctorId, appointmentId: appointmentId, data: cancelData });
        console.log(this.state.data);

    }
    cancel(data, status) {
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
            console.log(requestData);

            let userId = await AsyncStorage.getItem('userId');
            console.log('userId' + userId);
            let result = await appointmentStatusUpdate(this.state.doctorId, this.state.appointmentId, requestData);
            this.setState({ isLoading: false })
            console.log(result);
            console.log('update result' + JSON.stringify(result));
            // console.log(JSON.stringify(result.appointmentData.appointment_status));
            let appointmentStatus = result.appointmentData.appointment_status;
            console.log(appointmentStatus);
            //this.setState({ appointmentStatus: appointmentStatus });

        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        const { data, isLoading } = this.state;

        return (
            <Container style={{ backgroundColor: "grey", width: 'auto', height: 'auto' }}>
                {isLoading == true ? <Loader style={'list'} /> :
                    <Content>

                        <Grid style={styles.grid}>
                            <Card style={styles.card}>

                                <Text style={styles.text}>
                                    we understand life can get in the way! cancelling or missing your appointment too many times will result in your account being locked!
                                  </Text>

                                <Text style={{ marginTop: 30 }}>  <Text style={{ fontWeight: "bold" }}>
                                    {formatDate(data.appointment_starttime, 'MMMM-DD-YYYY') + "   " + 
                                    formatDate(data[0] && data[0].appointment_starttime, 'hh:mm A')}
                                    </Text> with {'Dr.' + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)}</Text>

                                <Text style={{ marginTop: 20, textAlign: "center" }}>What is the reason for Cancellation?</Text>
                               
                                <Row style={{ marginLeft: 20, marginTop: 10 }}>
                                    <Radio selected={false} color={"#8a2be2"}selectedColor={"#8a2be2"} />
                                    <Col>
                                       <Text style={styles.customText}>I am feeling better</Text>
                                     </Col>
                                </Row>


                                <Row style={{ marginLeft: 20 }}>
                                    <Radio selected={false} color={"#8a2be2"} selectedColor={"#8a2be2"} />
                                    <Col>
                                    <Text style={styles.customText}>
                                    Iam looking for sooner or faster</Text>
                                    </Col>
                                </Row>


                                <Row style={{ marginLeft: 20 }}>
                                    <Radio selected={false} color={"#8a2be2"} selectedColor={"#8a2be2"} />
                                    <Col>
                                    <Text style={styles.customText}>
                                        I will not be able to make this on the time</Text>
                                    </Col>
                                </Row>

                                <Row style={{ marginLeft: 20 }}>
                                    <Radio selected={false} color={"#8a2be2"} selectedColor={"#8a2be2"} />
                                    <Col>
                                    <Text style={styles.customText}>                                           
                                    I want to reshedule with different type</Text>
                                    </Col>
                                </Row>

                                <Row style={{ marginLeft: 20 }}>
                                    <Radio selected={false} color={"#8a2be2"} selectedColor={"#8a2be2"}/>
                                    <Col>
                                    <Text style={styles.customText}>Other</Text>
                                    </Col>
                                </Row>


                                <View style={{ marginTop: 0, paddingLeft: 18 }}>
                                    <Text style={{ fontSize: 16 }}>
                                        Write your Reason
                      </Text>
                                </View>
                                <View style={{ marginTop: 10, paddingLeft: 18, padding: 10, }}>
                                    <TextInput
                                        style={{ height: 80, borderWidth: 1, width: 'auto' }}
                                        placeholder="Write your reason here"
                                        onChangeText={(statusUpdateReason) => this.setState({ statusUpdateReason })}
                                    />
                                </View>


                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                    <Button style={styles.button2} onPress={() => this.cancel(data, 'REJECTED')}>
                                        <Text> SUBMIT </Text></Button>
                                    <Button style={styles.button1} >
                                        <Text> CANCEL</Text></Button>

                                </View>
                            </Card>



                        </Grid>

                    </Content>
                }
            </Container>
        );
    }
}
export default CancelAppointment

const styles = StyleSheet.create({
    header:
    {
        backgroundColor: "#7459a0",
        height: 50,
        width: 'auto'

    },
    title: {
        paddingLeft: 40,
        paddingTop: 10

    },
    grid: {
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
        marginTop: 5,
        height: 800,
        width: 'auto',
        marginLeft: 5,
        marginRight: 5
    },
    card: {
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
        marginTop: 5,
        height: 'auto',
        width: 'auto',
        marginLeft: 10,
        marginRight: 10

    },
    text: {
        backgroundColor: "grey",
        color: "white",
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 5,
        paddingLeft: 5
    },

    subcard: {
        backgroundColor: 'grey',
        marginBottom: 10,
        marginTop: 5,
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
        padding: 20,
        marginTop: 10,

    },
    button2: {
        backgroundColor: "#7459a0",
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        justifyContent: 'center',
        padding: 20,
        marginTop: 10,
    },
    customText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 15,
    marginLeft: 10,
   
  },

})




