import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { hospitalizedFor } from './constants';
import { connect } from 'react-redux';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles'

class HospitalizationAndSurgeries extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { medical_procedure } } = this.props

        this.state = {
            checkBoxClick: medical_procedure,
            hospitalised_reason: [],
            hospitalised_date: [],
            isLoading: false,
            appointmentId: props.navigation.getParam('AppointmentId')

        }
    }
    skippingButton = async (hasSkip = true) => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_hospitalization_and_surgeries: hasSkip
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

    addHospitalizationAndSurgeries = async () => {
        try {
            const { appointmentId, checkBoxClick } = this.state

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                medical_procedure: checkBoxClick
            }

            this.setState({ isLoading: true })
            let response = await userFiledsUpdate(userId, data)
            console.log(JSON.stringify(response))
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.skippingButton(false);
                this.props.navigation.navigate('SocialHistory', { AppointmentId: appointmentId });
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
        const { hospitalised_reason1, hospitalised_reason2, hospitalised_date1, hospitalised_date2 } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>hospitalization and Surgeries</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have you ever had any of the following procedures?</Text>
                            <FlatList
                                data={hospitalizedFor}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state.checkBoxClick}
                                renderItem={({ item, index }) => (
                                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                        <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}
                                            checked={this.state.checkBoxClick === item.condition}
                                            onPress={() => this.setState({ checkBoxClick: item.condition })}

                                        />
                                        <Text style={styles.flatlistText}>{item.condition}</Text>
                                    </View>
                                )} />
                        </View>



                        <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_hospitalization_and_surgeries: true });
                                        this.props.navigation.navigate('SocialHistory', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addHospitalizationAndSurgeries()}>
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
export default connect(profileState)(HospitalizationAndSurgeries)
