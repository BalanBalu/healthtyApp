import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform, Alert } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import { acceptNumbersOnly } from '../../../common';
import { connect } from 'react-redux';
import styles from '../styles'

class PhysicianInfo extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { primary_care_physician_info } } = this.props
        this.state = {
            isLoading: false,
            hospital_name: primary_care_physician_info && primary_care_physician_info.hospital_name,
            physician_name: primary_care_physician_info && primary_care_physician_info.physician_name,
            contact_number: primary_care_physician_info && primary_care_physician_info.mobile_no,
            appointmentId: props.navigation.getParam('AppointmentId')

        }
    }


    skippingButton = async (hasSkip = true) => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_primary_care_physician_info: hasSkip
            }
            let result = await prepareAppointmentUpdate(appointmentId, data);
            if (result.success) {
                Toast.show({
                    text: result.message,
                    type: "success",
                    duration: 3000,
                })
            }

        }
        catch (e) {
            console.error(e);
        }
    }



    addPhysicianInfo = async () => {
        try {
            const { contact_number, physician_name, hospital_name, appointmentId } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                primary_care_physician_info: {
                    physician_name: physician_name,
                    hospital_name: hospital_name,
                    mobile_no: contact_number
                }
            }

            this.setState({ isLoading: true })
            let response = await userFiledsUpdate(userId, data)
            console.log(JSON.stringify(response))
            if (response.success && data.primary_care_physician_info.physician_name != undefined && data.primary_care_physician_info.hospital_name != undefined && data.primary_care_physician_info.mobile_no != undefined) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.skippingButton(false);
                this.props.navigation.navigate('PastMedicalConditions', { AppointmentId: appointmentId });
            }else{
                Toast.show({
                    text: 'Kindly fill all the fields',
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
        const { contact_number, physician_name, hospital_name } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>

                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Primary care physician information</Text>

                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Name</Text>
                            <Form style={styles.formStyle2}>
                                <TextInput
                                    placeholder="Enter physician name"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={physician_name}
                                    onChangeText={(enteredText) => this.setState({ physician_name: enteredText })}

                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Hospital name</Text>
                            <Form style={styles.formStyle2}>
                                <TextInput
                                    placeholder="Enter hospital name"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={hospital_name}
                                    onChangeText={(enteredText) => this.setState({ hospital_name: enteredText })}

                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Contact number</Text>
                            <Form style={styles.formStyle2}>
                                <TextInput
                                    placeholder="Enter contact number"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={"number-pad"}
                                    returnKeyType={'go'}
                                    value={contact_number}
                                    onChangeText={contact_number => acceptNumbersOnly(contact_number) == true || contact_number === '' ? this.setState({ contact_number }) : null}
                                />
                            </Form>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_primary_care_physician_info: true });
                                        this.props.navigation.navigate('PastMedicalConditions', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addPhysicianInfo()}>
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
export default connect(profileState)(PhysicianInfo)
