import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { prepareAppointmentUpdate } from '../../../providers/bookappointment/bookappointment.action'
import { connect } from 'react-redux';
import styles from '../styles'



class BasicInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            itemSelected: true,
            radioButton: false,
            checkBoxClick: false,
            isLoading: false,
            userVisited: true,
            appointmentId: props.navigation.getParam('AppointmentId')

        }
    }

    addBasicInfo = async () => {
        try {
            const { appointmentId, itemSelected, userVisited } = this.state
            let data = {
                is_user_meet_doctor_before: itemSelected,
                has_skipped_user_meet_doctor_before: false
            }
            this.setState({ isLoading: true })
            let response = await prepareAppointmentUpdate(appointmentId, data)


            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('MedicalHistory', { AppointmentId: appointmentId });
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
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>

                        <Text style={styles.subHead}>Have you ever visited Dr.Balasubramanian before?</Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>

                            <Radio
                                standardStyle={true}
                                selected={this.state.itemSelected}
                                onPress={() => this.setState({
                                    itemSelected: this.state.itemSelected
                                })} />

                            <Text style={styles.innersubTexts}>Yes,I've seen this doctor before</Text>
                        </View>

                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                            <Radio
                                standardStyle={true}
                                selected={!this.state.itemSelected}
                                onPress={() => this.setState({ itemSelected: !this.state.itemSelected })} />
                            <Text style={styles.innersubTexts}>No.I'm a new patient</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => {
                                    prepareAppointmentUpdate(this.state.appointmentId, { has_skipped_user_meet_doctor_before: true });
                                    this.props.navigation.navigate('MedicalHistory', { AppointmentId: this.state.appointmentId });
                                }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addBasicInfo()}>
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
        profile: state.profile,
    }
}
export default connect(profileState)(BasicInfo)

