import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, Image, TextInput, FlatList, TouchableOpacity, Share, Platform, Alert } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import { connect } from 'react-redux';
import styles from '../styles'
import {primaryColor} from '../../../../setup/config'
class MedicalHistory extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { general_health_info } } = this.props

        this.state = {
            radioButton: general_health_info,
            checkBoxClick: [],
            reason_description: '',
            any_other_concerns: '',
            isLoading: false,
            appointmentId: props.navigation.getParam('AppointmentId')


        }
    }



    addgeneralHealthInfo = async () => {
        try {
            const { radioButton, appointmentId } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                general_health_info: radioButton,
            }


            this.setState({ isLoading: true })
    
            let response = await userFiledsUpdate(userId, data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('PhysicianInfo', { AppointmentId: this.state.appointmentId });
            }
        }
        
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }



    addMedicalHistory = async () => {
        try {
            const { radioButton,reason_description, any_other_concerns, appointmentId } = this.state
          

            let data = {
                reason_for_visit: {
                    description: reason_description,
                    any_other_concerns: any_other_concerns,
                },
                has_skip_general_health_info: false
            }

            this.setState({ isLoading: true })
           
            if( data.reason_for_visit.description != "" || data.reason_for_visit.any_other_concerns != "" || radioButton != undefined ){
            this.addgeneralHealthInfo()
            let response = await prepareAppointmentUpdate(appointmentId, data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })

                this.props.navigation.navigate('PhysicianInfo', { AppointmentId: this.state.appointmentId });
            }
        }
        else{
            Toast.show({
                text: 'Please fill atleast one of the  field',
                type: 'danger',
                duration: 3000
              });
        }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    render() {
        const { reason_description, any_other_concerns } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Reason for visit</Text>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "Roboto", fontSize: 15, }}>Why are you booking this appointment ?</Text>
                            <Form style={styles.formText}>
                                <TextInput
                                    placeholder="Enter reason"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={reason_description}
                                    onChangeText={(enteredText) => this.setState({ reason_description: enteredText })}
                                
                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>Do you have any other concerns you would like to address ?</Text>
                            <Form style={{
                                borderColor: '#909090',
                                borderWidth: 0.5, height: 80, borderRadius: 5, marginTop: 10,
                            }}>
                                <TextInput
                                    placeholder="Enter reason"
                                    style={Platform == "ios" ? styles.bigTextInput : styles.textInputAndroid}

                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={any_other_concerns}
                                    onChangeText={(enteredText) => this.setState({ any_other_concerns: enteredText })}
                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "Roboto", fontSize: 15 }}>How is your general health?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={this.state.radioButton === "EXCELLENT" ? true : false}
                                        onPress={() => this.setState({ radioButton: "EXCELLENT" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Excellent</Text>
                                </Col>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={this.state.radioButton === "GOOD" ? true : false}
                                        onPress={() => this.setState({ radioButton: "GOOD" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Good</Text>
                                </Col>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={this.state.radioButton === "FAIR" ? true : false}
                                        onPress={() => this.setState({ radioButton: "FAIR" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Fair</Text>
                                </Col>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                    
                                      color={primaryColor}
                                        standardStyle={true}
                                        selected={this.state.radioButton === "POOR" ? true : false}
                                        onPress={() => this.setState({ radioButton: "POOR" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Poor</Text>
                                </Col>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_general_health_info: true });
                                        this.props.navigation.navigate('PhysicianInfo', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addMedicalHistory()}>
                                    <Text style={styles.touchText}>Save and continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

function profileState(state) {
    return {
        profile: state.profile
    }
}
export default connect(profileState)(MedicalHistory)




