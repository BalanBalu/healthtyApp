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
import {  getName, } from '../../../common'



class EmrInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            itemSelected: true,
            isLoading: false,
            userVisited: true,
            appointmentId: props.navigation.getParam('AppointmentId'),
            doctorData: props.navigation.getParam('DoctorData'),
            doctorName:props.navigation.getParam("Data")


        }
    }

    addBasicInfo = async () => {
        try {
       

          
                this.props.navigation.navigate('MedicineRecords');
            
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }


    render() {
        const {doctorData,doctorName} = this.state;
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>

                        <Text style={styles.subHead}>Have you Emr  {(doctorData && doctorData.prefix != undefined ? doctorData.prefix + ' ' : '') + (getName(doctorName)) + ' '} before?</Text>
                     
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
                                    <Text style={styles.touchText}>Add emr</Text>
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
export default connect(profileState)(EmrInfo)

