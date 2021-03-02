import React, { PureComponent } from 'react';
import {
    Container, Content, Text, View, Badge, Toast, Radio, DatePicker, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, Image, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { acceptNumbersOnly } from '../../../common';
import { bloodGroupList } from './constants';
import { connect } from 'react-redux';
import { prepareAppointmentUpdate, } from '../../../providers/bookappointment/bookappointment.action'
import styles from '../styles';
import { formatDate } from "../../../../setup/helpers";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {primaryColor} from '../../../../setup/config';



class PatientInfo extends PureComponent {
    constructor(props) {
        super(props)
        const { profile: { first_name, dob, gender, marital_status, blood_group, secondary_mobile } } = this.props

        this.state = {
            user_name: first_name,
            mobile_no: secondary_mobile,
            date_of_birth: formatDate(dob,'YYYY/MM/DD'),
            gender: gender,
            marital_status: marital_status,
            selectedBloodGroup: blood_group,
            isLoading: false,
            appointmentId: props.navigation.getParam('AppointmentId'),
            isOnlyDateTimePickerVisible: false,

        }
    }


    skippingButton = async (hasSkip = true) => {
        try {
            const { appointmentId } = this.state

            let data = {
                has_skip_personal_info: hasSkip
            }
            let result = await prepareAppointmentUpdate(appointmentId, data);
            if (result.success) {
                Toast.show({
                    text: result.message,
                    type: "success",
                    duration: 3000,
                })
            }else{
                Toast.show({
                    text: 'Please fill all the fields',
                    type: "danger",
                    duration: 3000,
                })  
            }

        }
        catch (e) {
            console.error(e);
        }
    }

    addPatientInfo = async () => {
        try {
            const { user_name, mobile_no, date_of_birth, selectedBloodGroup, gender, marital_status, appointmentId } = this.state;

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                first_name: user_name,
                dob: date_of_birth,
                secondary_mobile: mobile_no,
                gender: gender,
                blood_group: selectedBloodGroup,
                marital_status: marital_status
            }
        
            this.setState({ isLoading: true })

            if(data.first_name != "" || data.dob  != "" || data.secondary_mobile  != "" || data.gender != undefined  || data.blood_group != undefined  || data.marital_status != undefined){
            let response = await userFiledsUpdate(userId, data)
         
        
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                
                this.skippingButton(false)
                this.props.navigation.navigate('AllergiesAndMedications', { AppointmentId: appointmentId });
            }
        }else{
            Toast.show({
                text: 'Please fill atleast one of the  field',
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
    showOnlyDateTimePicker = () => {
        this.setState({ isOnlyDateTimePickerVisible: true })
      }
      hideOnlyDateTimePicker = () => {
        this.setState({ isOnlyDateTimePickerVisible: false })
      }
      handleOnlyDateTimePicker = (date) => {
        try {
          this.setState({ isOnlyDateTimePickerVisible: false, date_of_birth : date })
        } catch (error) {
          console.error('Error on Date Picker: ', error);
        }
      }

    render() {
        const { user_name, mobile_no,date_of_birth, selectedBloodGroup, gender, marital_status } = this.state;
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Personal Information</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Name</Text>
                            <Form style={styles.formStyle5}>
                                <TextInput
                                    placeholder="Enter your name"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={user_name}
                                    onChangeText={(enteredText) => this.setState({ user_name: enteredText })}
                                />

                            </Form>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Date of birth</Text>
                            <TouchableOpacity onPress={() => { this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible }) }} style={[styles.formStyle2,{flexDirection:'row'}]}>
                                {/* <Item > */}
                            <Icon name='md-calendar' style={{ padding: 5, fontSize: 20, marginTop: 1, color: primaryColor }} />
                            <Text style={this.state.date_of_birth != null ?{ marginTop: 7, marginBottom: 7, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', }:{color:'#909090'}}>{this.state.date_of_birth != null ?formatDate(this.state.date_of_birth, 'DD/MM/YYYY'):'Date of Birth'}</Text>
                            <DateTimePicker
                              mode={'date'}
                              minimumDate={new Date(1940, 0, 1)}
                              value={this.state.date_of_birth}
                              isVisible={this.state.isOnlyDateTimePickerVisible}
                              onConfirm={this.handleOnlyDateTimePicker}
                              onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
                            />
                                {/* </Item> */}
                                </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Sex</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        onPress={() => this.setState({ gender: "M" })}
                                        selected={gender === "M" ? true : false}
                                    />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Male</Text>
                                </Col>
                                <Col style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        onPress={() => this.setState({ gender: "F" })}
                                        selected={gender === "F" ? true : false}
                                    />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Female</Text>
                                </Col>
                                <Col style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        onPress={() => this.setState({ gender: "O" })}
                                        selected={gender === "O" ? true : false}
                                    />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Other</Text>
                                </Col>
                            </View>
                        </View>

                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Marital status</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={6}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            onPress={() => this.setState({ marital_status: "MARRIED" })}
                                            selected={marital_status === "MARRIED" ? true : false}
                                        />
                                        <Text style={[styles.innersubTexts, { color: '#909090' }]}>Married</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            onPress={() => this.setState({ marital_status: "UNMARRIED" })}
                                            selected={marital_status === "UNMARRIED" ? true : false}
                                        />
                                        <Text style={[styles.innersubTexts, { color: '#909090' }]}>Unmarried</Text>
                                    </Col>
                                </Col>
                                <Col size={4}>
                                </Col>
                            </View>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Blood group</Text>


                            <Form style={styles.formStyle6}>
                                <Picker style={styles.userDetailLabel}
                                    mode="dropdown"
                                    placeholder='Select Blood Group'
                                    placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                    iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                    textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                    note={false}
                                    itemStyle={{
                                        paddingLeft: 10,
                                        fontSize: 16,
                                    }}
                                    itemTextStyle={{ color: '#5cb85c', }}
                                    style={{ width: undefined }}
                                    onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                                    selectedValue={selectedBloodGroup}
                                    testID="editBloodGroup"
                                >
                                    {bloodGroupList.map((value, key) => {
                                        return <Picker.Item label={String(value)} value={String(value)} key={key}
                                        />
                                    })
                                    }
                                </Picker>

                            </Form>







                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Mobile number</Text>
                            <Form style={styles.formStyle5}>
                                <TextInput
                                    placeholder="Enter your mobile number"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={mobile_no}
                                    onChangeText={mobile_no => acceptNumbersOnly(mobile_no) == true || mobile_no === '' ? this.setState({ mobile_no }) : null}
                                />
                            </Form>
                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton}
                                    onPress={() => {
                                        prepareAppointmentUpdate(this.state.appointmentId, { has_skip_personal_info: true });
                                        this.props.navigation.navigate('AllergiesAndMedications', { AppointmentId: this.state.appointmentId });
                                    }}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addPatientInfo()}>
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
export default connect(profileState)(PatientInfo)
