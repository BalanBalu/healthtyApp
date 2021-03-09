import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { prepareAppointmentUpdate } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles'
import { CURRENT_APP_NAME } from "../../../../setup/config";

class PrepareAppointmentLastStep extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            agreed_for_send_forms: false,
            isLoading: false,
            appointmentId: props.navigation.getParam('AppointmentId')

        }
    }
    addAppointmentLastStep = async () => {
        if (this.state.agreed_for_send_forms === true) {
            try {
                const { agreed_for_send_forms, appointmentId } = this.state
                let data = {
                    agreed_for_send_forms: agreed_for_send_forms
                }
                this.setState({ isLoading: true })

                let response = await prepareAppointmentUpdate(appointmentId, data)

                if (response.success) {
                    Toast.show({
                        text: response.message,
                        type: "success",
                        duration: 3000,
                    })
                    this.props.navigation.navigate('CorporateHome');
                }
            }
            catch (e) {
                console.log(e)
            }
            finally {
                this.setState({ isLoading: false })
            }
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
                    <View style={styles.mainView}>
                        <View>
                            <View style={styles.centerContent}>
                                <Image source={require('../../../../../assets/images/FormComplete.png')} style={{ height: 200, width: 200, }} />

                            </View>
                            <Text style={styles.textContent}>Last Step!</Text>
                            <Text style={[styles.subText1, { lineHeight: 22 }]}>Confirm your information below,and then we will send all your forms to your doctor</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                            <CheckBox style={{ borderRadius: 5 }}
                                checked={this.state.agreed_for_send_forms}
                                onPress={() => this.setState({ agreed_for_send_forms: !this.state.agreed_for_send_forms })}
                            />
                            <Text style={[styles.flatlistText, { color: '#4c4c4c', lineHeight: 22 }]}>{`I verify that the information presented here is accurate,and i authorize ${CURRENT_APP_NAME} to send this information to my healthcare provider.`}</Text>
                        </View>

                        <View style={[styles.centerContent, { marginTop: 50 }]}>
                            <TouchableOpacity style={styles.touchStyle} onPress={() => this.addAppointmentLastStep()}>
                                <Text style={styles.touchText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default PrepareAppointmentLastStep

