import React, { Component } from 'react';
import { StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Radio, Button, Card, Grid, ListItem, List, View, Text, Toast, CardItem, Right, Body, Content, Input, Item, Row, Col } from 'native-base';
import { updateDocHomeTestappointment } from '../../../providers/homeHelthCare/action';
import { formatDate } from '../../../../setup/helpers';
import { onlySpaceNotAllowed } from '../../../common';
import { Loader } from '../../../../components/ContentLoader'
import Spinner from '../../../../components/Spinner';


class CancelAppointment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: '',
            statusUpdateReason: '',
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
        await this.setState({ data: cancelData });

    }

    /* Cancel Appoiontment Status */
    cancelAppointment = async (data, updatedStatus) => {

        try {
            if (onlySpaceNotAllowed(this.state.statusUpdateReason) == true) {
                this.setState({ isLoading: true });
                let requestData = {
                    doctorId: data.doctor_id,
                    userId: data.user_id,
                    appointment_date: data.appointment_date,
                    status: updatedStatus,
                    statusUpdateReason: this.state.statusUpdateReason,
                    status_by: 'USER'
                };

                let result = await updateDocHomeTestappointment(data._id, requestData);
                this.setState({ isLoading: false })

                if (result.success) {
                    Toast.show({
                        text: 'Your appointment has been canceled',
                        duration: 3000,
                        type: 'success'
                    })
                    let temp = this.state.data;
                    temp.appointment_status = result.appointmentData.appointment_status;
                    temp.status_update_reason = result.appointmentData.status_update_reason;

                    this.setState({ data: temp });
                    this.props.navigation.navigate('HomeHealthcareAppointmentDetail', { data: this.state.data });
                }
                else {

                    Toast.show({
                        text: result.message,
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
                    <Spinner visible={isLoading} />
                    <Card style={{ borderRadius: 5, padding: 5, height: '200%' }}>
                        <Card>
                            <CardItem style={styles.text}>
                                <Body>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15 }}> We understand life can get in the way! Cancelling or missing your appointment too many times will result in your account being locked!</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={{ marginTop: 2, fontFamily: 'OpenSans', fontSize: 15 }}>
                                        <Text style={{ fontWeight: "bold", fontFamily: 'OpenSans', fontSize: 15 }}>
                                            {/* {formatDate(data.appointment_date, 'MMMM-DD-YYYY')}                                                */}
                                        </Text>with {(data && data.prefix || '') + " " + (data && data.doctorInfo.first_name) + " " + (data && data.doctorInfo.last_name)}</Text>
                                    <Text style={{ marginTop: 20, fontFamily: 'OpenSans', fontSize: 15 }}>What is the reason for Cancellation?</Text>

                                    <Row onPress={() => this.toggleRadio(0, "I am feeling better")} style={{ marginTop: 10 }}>
                                        <Radio borderColor='black' selected={this.state.radioStatus[0]} onPress={() => this.toggleRadio(0, "I am feeling better")}
                                            selectedColor={"#775DA3"} testID='checkOption_1Selected' />
                                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, marginTop: 3 }}>I am feeling better</Text>
                                    </Row>

                                    <Row onPress={() => this.toggleRadio(1, " am looking for an earlier slot/appointment")} style={{ marginTop: 10 }}>
                                        <Radio selected={this.state.radioStatus[1]} onPress={() => this.toggleRadio(1, "Iam looking for an earlier slot/appointment")} color={"#775DA3"}
                                            selectedColor={"#775DA3"} testID='checkOption_2Selected' />
                                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, width: '95%', marginTop: 3 }}>I am looking for an earlier slot/appointment</Text>

                                    </Row>


                                    <Row onPress={() => this.toggleRadio(2, "I won't be able to make it today")} style={{ marginTop: 10 }}>

                                        <Radio selected={this.state.radioStatus[2]} onPress={() => this.toggleRadio(2, "I won't be able to make it today")} color={"#775DA3"}
                                            selectedColor={"#775DA3"} testID='checkOption_3Selected' />

                                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, width: '95%', marginTop: 3 }}>I won't be able to make it today</Text>


                                    </Row>



                                    <Row onPress={() => this.toggleRadio(3, "I want to reschedule with different type")} style={{ marginTop: 10 }}>
                                        <Radio selected={this.state.radioStatus[3]} color="red" selectedColor="green" onPress={() => this.toggleRadio(3, "I want to reschedule with different type")} color={"#775DA3"}
                                            selectedColor={"#775DA3"} testID='checkOption_4Selected' />
                                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, width: '95%', marginTop: 3 }}>I want to reschedule with different type</Text>
                                    </Row>

                                    <Row onPress={() => this.toggleRadio(4, null)} style={{ marginTop: 10 }}>
                                        <Radio selected={this.state.radioStatus[4]} onPress={() => this.toggleRadio(4, null)} color={"#775DA3"}
                                            selectedColor={"#775DA3"} testID='checkOption_5Selected' />
                                        <Text style={{ marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15, marginTop: 3 }}>Others</Text>
                                    </Row>

                                    {this.state.radioStatus[4] === true ?
                                        <Col>
                                            <Text style={{ fontSize: 15, marginTop: 20, fontFamily: 'OpenSans' }}> Write your reason </Text>
                                            <TextInput style={{ height: 100, borderWidth: 1, marginTop: 20, width: 300, fontSize: 15 }}
                                                placeholder="Write your reason here"
                                                multiline={true}
                                                textAlignVertical={'top'}
                                                onChangeText={statusUpdateReason => this.setState({ statusUpdateReason })}
                                                testID='addToEditReason' />
                                        </Col>
                                        : null}

                                    <Row style={{ marginTop: 10 }}>
                                        <Button style={styles.button1} onPress={() => this.props.navigation.navigate('HomeHealthcareAppointmentDetail')} testID='appointment_cancel'>
                                            <Text style={{ color: '#000', fontFamily: 'OpenSans', fontSize: 13 }}>Back</Text>
                                        </Button>


                                        <Button danger style={styles.button2} onPress={() => this.cancelAppointment(data, 'CANCELED')} testID='iconToEditContact'>
                                            <Text style={{ color: '#FFF', fontFamily: 'OpenSans', fontSize: 13 }}>Cancel</Text>
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


