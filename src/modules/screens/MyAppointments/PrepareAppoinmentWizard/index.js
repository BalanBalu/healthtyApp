import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import { fetchUserProfile, setUserDataForPreparation } from '../../../providers/profile/profile.action';
import styles from '../styles';
import { CURRENT_APP_NAME } from "../../../../setup/config";
class PrepareAppointmentWizard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            doctorData: props.navigation.getParam('DoctorData'),
            appointmentId: props.navigation.getParam('AppointmentId'),
            doctorName: props.navigation.getParam("Data")
        }
    }
    getUserProfile = async () => {
        try {
            let fields = "first_name,dob,blood_group,secondary_mobile,primary_care_physician_info,general_health_info,marital_status,allergy_info,past_health_condition,having_any_allergies,taking_medications,family_conditions,hospitalized,medical_procedure,social_history,is_user_meet_doctor_before,any_other_concerns,description,gender,smoke,use_recreational_drugs,drink_alcohol,sexually_active,use_caffeinated_drink,physically_or_verbally_hurt_you,exercise,social_history"
            let userId = await AsyncStorage.getItem('userId');
            let result = await fetchUserProfile(userId, fields);
            if (result) {
                setUserDataForPreparation(result);
            }
        }
        catch (e) {
            console.error('Error while Fetching User profile' + e);
        }
    }

    render() {
        const { Question, appointmentId, doctorData, doctorName } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>

                    <View style={styles.mainView}>
                        <View>
                            <View style={styles.centerContent}>
                                <Image source={require('../../../../../assets/images/formpaper.png')} style={{ height: 200, width: 200, }} />
                            </View>
                            <Text style={styles.textContent}>No more paper forms!</Text>
                            <Text style={styles.subText1}>{`Check-in online and your information will be send directly to  ${CURRENT_APP_NAME}`}</Text>
                        </View>
                        <View style={[styles.centerContent, { marginTop: 50 }]}>
                            <TouchableOpacity style={styles.touchStyle} onPress={() => {
                                this.props.navigation.navigate("BasicInfo", { AppointmentId: appointmentId, DoctorData: doctorData, Data: doctorName })
                                this.getUserProfile()
                            }}>
                                <Text style={styles.touchText}>I Agree Start check-in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </Content>
            </Container>
        )
    }
}

export default PrepareAppointmentWizard
