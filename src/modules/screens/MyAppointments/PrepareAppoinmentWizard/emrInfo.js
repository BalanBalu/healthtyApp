import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { NavigationEvents } from 'react-navigation';
import { prepareAppointmentUpdate } from '../../../providers/bookappointment/bookappointment.action'
import { connect } from 'react-redux';
import styles from '../styles'
import {  getName, toastMeassage} from '../../../common'
import { data } from 'react-native-connectycube';



class EmrInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            itemSelected: true,
            isLoading: false,
            userVisited: true,
            appointmentId: props.navigation.getParam('AppointmentId'),
            doctorData: props.navigation.getParam('DoctorData'),
            doctorName:props.navigation.getParam("Data"),
            data:[]


        }
    }

    navigateToMedicalRecords = async () => {
        try {
       

          
                this.props.navigation.navigate('MedicineRecords',{fromNavigation:'APPOINTMENT_PREPARE',prevState:this.props.navigation.state});
            
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    saveEmrDetails = async () => {
        try {
            const { appointmentId,data } = this.state
                 if(data.length!==0){
            let reqData = {
                emr_detail_ids: data,
            
            }
            console.log(data);
            this.setState({ isLoading: true })
            let response = await prepareAppointmentUpdate(appointmentId, reqData)

            
            console.log(response);
            if (response.success) {
                toastMeassage(response.message,'success',3000)
              
                this.props.navigation.navigate('MedicalHistory',{fromNavigation:'emrInfo',prevState:this.props.navigation.state,AppointmentId: appointmentId});  
                // this.props.navigation.navigate('EmrInfo', { AppointmentId: appointmentId });
            }else{
                toastMeassage(response.message,'dangers',3000)   
            }
        }else{
            toastMeassage('kindly select documents','dangers',3000)
        }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }
    }


  
    backNavigation = async (navigationData) => {
    let data=	this.props.navigation.getParam('emrData')||[]
    this.setState({data})
    
		
	}

    render() {
        const {doctorData,doctorName,data} = this.state;
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                <NavigationEvents
					onWillFocus={payload => { this.backNavigation(payload) }}
				/>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>

                        <Text style={styles.subHead}>Have you Emr  before?</Text>
       {data.length===0?null: <Text style={styles.subHead}>{data.length +'emr uploadded'}</Text>}
                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => {
                                    prepareAppointmentUpdate(this.state.appointmentId, { has_skipped_user_meet_doctor_before: true });
                                    this.props.navigation.navigate('MedicalHistory', { AppointmentId: this.state.appointmentId });
                                }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            {data.length===0?
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.navigateToMedicalRecords()}>
                                    <Text style={styles.touchText}>ADD EMR</Text>
                                </TouchableOpacity>
                            </View>: <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.saveEmrDetails()}>
                                    <Text style={styles.touchText}>save and Continue</Text>
                                </TouchableOpacity>
                            </View>}
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

