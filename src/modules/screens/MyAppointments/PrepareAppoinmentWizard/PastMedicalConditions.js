import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, Image, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { disease } from './constants';
import { connect } from 'react-redux';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles'

class PastMedicalConditions extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { past_health_condition } } = this.props

        this.state = {
            checkBoxClick: past_health_condition || [],
            isLoading: false,
            lists: [],
            refreshCount: 0,
            appointmentId: props.navigation.getParam('AppointmentId')

        }
    }
    skippingButton = async (hasSkip = true) => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_past_health_condition: hasSkip
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
    addPastMedicalConditions = async () => {
        try {
            const { checkBoxClick, appointmentId } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                past_health_condition: checkBoxClick
            }
            this.setState({ isLoading: true })
            if(checkBoxClick.length !==0){
            let response = await userFiledsUpdate(userId, data)

         
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.skippingButton(false)
                this.props.navigation.navigate('PatientInfo', { AppointmentId: appointmentId });
            }
        }
        else{
            Toast.show({
                text: 'select atleast one',
                type: "danger",
                duration: 3000,
            })  
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
        const { checkBoxClick, refreshCount } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Past Conditions</Text>
                        <Text style={{ fontFamily: "OpenSans", fontSize: 15, marginTop: 10 }}>Have you ever had any of these conditions?</Text>
                        <FlatList
                            data={disease}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={[checkBoxClick, refreshCount]}
                            renderItem={({ item, index }) => (
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                    <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}
                                        checked={checkBoxClick.includes(item.disease)}
                                        onPress={() => {
                                            if (checkBoxClick.includes(item.disease)) {
                                                checkBoxClick.splice(checkBoxClick.indexOf(item.disease), 1)

                                            } else {
                                                checkBoxClick.push(item.disease)
                                            }
                                            this.setState({ checkBoxClick, refreshCount: refreshCount + 1 })

                                        }}
                                        testID='diseaseCheckbox'

                                    />
                                    <Text style={styles.flatlistText}>{item.disease}</Text>
                                </View>
                            )} />
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_past_health_condition: true });
                                        this.props.navigation.navigate('PatientInfo', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addPastMedicalConditions()}>
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
export default connect(profileState)(PastMedicalConditions)
