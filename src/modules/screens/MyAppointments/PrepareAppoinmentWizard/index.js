import React, { PureComponent } from 'react';

import {
    Container, Content, Text, View, Badge, Toast, Radio, Form, CheckBox, Item, Picker, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Share, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import Spinner from '../../../../components/Spinner';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
import { prepareAppointmentUpdate } from '../../../providers/bookappointment/bookappointment.action'
import { acceptNumbersOnly } from '../../../common';
import { disease, bloodGroupList, allergic, numberList } from './constants'

export class PrepareAppointmentWizard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            Question: 0,
            radioButton: false,
            checkBoxClick: false
        }
    }

    render() {
        const { Question } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>

                    <View style={styles.mainView}>
                        <View>
                            <View style={styles.centerContent}>
                                <Image source={require('../../../../../assets/images/formpaper.png')} style={{ height: 200, width: 200, }} />
                            </View>
                            <Text style={styles.textContent}>No more paper forms!</Text>
                            <Text style={styles.subText1}>Check in online and your information will be send directly to the Medflic</Text>
                        </View>
                        <View style={[styles.centerContent, { marginTop: 50 }]}>
                            <TouchableOpacity style={styles.touchStyle} onPress={() => this.props.navigation.navigate("BasicInfo")}>
                                <Text style={styles.touchText}>I Agree,Start check-in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </Content>
            </Container>
        )
    }
}



export class BasicInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            itemSelected: true,
            radioButton: false,
            checkBoxClick: false,
            isLoading: false,
            appointmentId: ''

        }
    }

    // componentDidMount(){
    //     const { navigation } = this.props;
    //     const appointmentId = navigation.getParam('appointmentId');
    //     alert(appointmentId)
    //     this.setState({appointmentId:appointmentId})
    // }
    addBasicInfo = async () => {
        try {

            let data = {
                is_user_meet_doctor_before: this.state.itemSelected
            }
            this.setState({ isLoading: true })
            let response = await prepareAppointmentUpdate("5eb12fb614dc71158fe83a7f", data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('MedicalHistory');
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
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
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
export class MedicalHistory extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: "EXCELLENT",
            checkBoxClick: [],
            reason_description: '',
            any_other_concerns: ''



        }
    }



    addgeneralHealthInfo = async () => {
        try {

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                general_health_info: this.state.radioButton
            }
            this.setState({ isLoading: true })
            let response = await userFiledsUpdate(userId, data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('PhysicianInfo');
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

            let data = {
                description: this.state.reason_description,
                any_other_concerns: this.state.any_other_concerns

            }
            this.setState({ isLoading: true })
            this.addgeneralHealthInfo()
            let response = await prepareAppointmentUpdate("5eb12fb614dc71158fe83a7f", data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })

                this.props.navigation.navigate('PhysicianInfo');
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
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Reason for vist</Text>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Why are you booking this appointment ?</Text>
                            <Form style={styles.formText}>
                                <TextInput
                                    placeholder="Enter reason"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={reason_description}
                                    onChangeText={(enteredText) => this.setState({ reason_description: enteredText })}
                                    onSubmitEditing={() => { this.reason_description._root.focus(); }}
                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15 }}>Do you have any other concerns you would like to address ?</Text>
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
                                    onSubmitEditing={() => { this.any_other_concerns._root.focus(); }}
                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20 }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15 }}>How is your general health?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton === "EXCELLENT" ? true : false}
                                        onPress={() => this.setState({ radioButton: "EXCELLENT" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Excellent</Text>
                                </Col>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton === "GOOD" ? true : false}
                                        onPress={() => this.setState({ radioButton: "GOOD" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Good</Text>
                                </Col>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton === "FAIR" ? true : false}
                                        onPress={() => this.setState({ radioButton: "FAIR" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Fair</Text>
                                </Col>
                                <Col size={5} style={{ flexDirection: 'row' }}>
                                    <Radio
                                        standardStyle={true}
                                        selected={this.state.radioButton === "POOR" ? true : false}
                                        onPress={() => this.setState({ radioButton: "POOR" })} />
                                    <Text style={[styles.innersubTexts, { color: '#909090' }]}>Poor</Text>
                                </Col>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addgeneralHealthInfo()}>
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
export class PhysicianInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false,
            isLoading: false,
            hospital_name: '',
            physician_name: '',
            contact_number: ''

        }
    }

    addPhysicianInfo = async () => {
        try {
            const { contact_number, physician_name, hospital_name } = this.state

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
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('PastMedicalConditions');
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
                                    onSubmitEditing={() => { this.physician_name._root.focus(); }}

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
                                    onSubmitEditing={() => { this.hospital_name._root.focus(); }}

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
                                    onSubmitEditing={() => { this.contact_number._root.focus(); }}
                                />
                            </Form>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 200, height: 38 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
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
export class PastMedicalConditions extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            firstQuestion: 0,
            checkBoxClick: [],
            isLoading: false,
            lists: [],
            refreshCount: 0


        }
    }

    addPastMedicalConditions = async () => {
        try {

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                past_health_condition: [this.state.lists]
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
                this.props.navigation.navigate('PatientInfo');
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
                                        checked={checkBoxClick.includes(item.id)}
                                        onPress={() => {
                                            if (checkBoxClick.includes(item.id)) {
                                                checkBoxClick.splice(checkBoxClick.indexOf(item.id), 1)

                                            } else {
                                                checkBoxClick.push(item.id)
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
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
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
export class PatientInfo extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false,
            user_name: '',
            mobile_no: '',
            date_of_birth: '',
            gender: 'M',
            marital_status: 'MARRIED',
            selectedBloodGroup: null

        }
    }

    addPatientInfo = async () => {
        try {
            const { user_name, mobile_no, date_of_birth, selectedBloodGroup, gender, marital_status } = this.state;

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
            let response = await userFiledsUpdate(userId, data)
            console.log(JSON.stringify(response))
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('AllergiesAndMedications');
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
        const { user_name, mobile_no, date_of_birth, selectedBloodGroup, gender, marital_status } = this.state;
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
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
                                    onSubmitEditing={() => { this.user_name._root.focus(); }}
                                />
                            </Form>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Date of birth</Text>
                            <Form style={styles.formStyle2}>
                                <TextInput
                                    placeholder="Enter your date of birth"
                                    style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    returnKeyType={'go'}
                                    value={date_of_birth}
                                    onChangeText={(enteredText) => this.setState({ date_of_birth: enteredText })}
                                    onSubmitEditing={() => { this.date_of_birth._root.focus(); }}
                                />
                            </Form>
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

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Martial status</Text>
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
                                    onSubmitEditing={() => { this.mobile_no._root.focus(); }}
                                />
                            </Form>
                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
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
export class AllergiesAndMedications extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false,
            allergic_name: '',
            allergic_reaction: '',
            medicine_name: '',
            dosage: ''

        }
    }
    addAllergiesAndMedications = async () => {
        try {
            const { allergic_name, allergic_reaction, medicine_name, dosage } = this.state

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                have_any_allergies: {
                    allergy_name: allergic_name,
                    allergy_reaction: allergic_reaction,

                },
                currently_taking_medications: {
                    medicine_name: medicine_name,
                    medicine_dosage: dosage,
                }
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
                this.props.navigation.navigate('FamilyMedicalConditions');
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
        const { allergic_name, allergic_reaction, medicine_name, dosage } = this.state

        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <Spinner
                        color='blue'
                        visible={this.state.isLoading}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Allergies and Medications</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you have any allergies?</Text>
                            <Row style={{ marginTop: 15 }}>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Reaction</Text>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 5 }}>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle7}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={allergic_name}
                                            onChangeText={(text) => { this.handleAddMore(text, 'textInput1'); }}
                                            // onChangeText={(enteredText) => this.setState({allergic_name:enteredText})}
                                            onSubmitEditing={() => { this.allergic_name._root.focus(); }}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter reaction"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={allergic_reaction}
                                            onChangeText={(enteredText) => this.setState({ allergic_reaction: enteredText })}
                                            onSubmitEditing={() => { this.allergic_reaction._root.focus(); }}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={allergic_name}
                                            onChangeText={(enteredText) => this.setState({ allergic_name: enteredText })}
                                            onSubmitEditing={() => { this.allergic_name._root.focus(); }}
                                        />


                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                        <TextInput
                                            placeholder="Enter reaction"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={allergic_reaction}
                                            onChangeText={(enteredText) => this.setState({ allergic_reaction: enteredText })}
                                            onSubmitEditing={() => { this.allergic_reaction._root.focus(); }}
                                        />
                                    </Form>
                                </Col>
                            </Row>

                        </View>


                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>What medicines are you currently taking ?</Text>
                            <Row style={{ marginTop: 15 }}>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Dosage</Text>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 5 }}>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle7}>
                                        <TextInput
                                            placeholder="Enter medicine name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={medicine_name}
                                            onChangeText={(enteredText) => this.setState({ medicine_name: enteredText })}
                                            onSubmitEditing={() => { this.medicine_name._root.focus(); }}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter dosage"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={dosage}
                                            onChangeText={(enteredText) => this.setState({ dosage: enteredText })}
                                            onSubmitEditing={() => { this.dosage._root.focus(); }}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter medicine name"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={medicine_name}
                                            onChangeText={(enteredText) => this.setState({ medicine_name: enteredText })}
                                            onSubmitEditing={() => { this.medicine_name._root.focus(); }}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                        <TextInput
                                            placeholder="Enter dosage"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                            value={dosage}
                                            onChangeText={(enteredText) => this.setState({ dosage: enteredText })}
                                            onSubmitEditing={() => { this.dosage._root.focus(); }}
                                        />
                                    </Form>
                                </Col>
                            </Row>

                        </View>

                        <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addAllergiesAndMedications()}>
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
export class FamilyMedicalConditions extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false

        }
    }
    render() {
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Family conditions</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Please list any medical conditions in your family</Text>
                            <Row style={{ marginTop: 15 }}>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Name</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Who?</Text>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 5 }}>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle7}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform === "ios" ? { fontSize: 12, borderRadius: 5, paddingLeft: 2, paddingTop: 10, } : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter who?"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter who?"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter who?"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter  name"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter who?"
                                            style={Platform === "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 100 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 8 })}>
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

export class AllergicDisease extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            checkBoxClick: [],
            isLoading: false,
            lists: [],
            refreshCount: 0

        }
    }
    addAllergicDisease = async () => {
        try {

            let userId = await AsyncStorage.getItem('userId');
            let data = {
                allergy_info: [this.state.lists]
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
                this.props.navigation.navigate('HospitalizationAndSurgeries');
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
        const { checkBoxClick, refreshCount, lists, isLoading } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Allergies and Medications</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Are you allergic to any of the following?</Text>
                            <FlatList
                                data={allergic}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={[checkBoxClick, refreshCount]}
                                renderItem={({ item, index }) => (
                                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                        <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}
                                            checked={checkBoxClick.includes(item.id)}
                                            onPress={() => {
                                                if (checkBoxClick.includes(item.id)) {
                                                    checkBoxClick.splice(checkBoxClick.indexOf(item.id), 1)

                                                } else {
                                                    checkBoxClick.push(item.id)
                                                }
                                                this.setState({ checkBoxClick, refreshCount: refreshCount + 1 })

                                            }}
                                            testID='diseaseCheckbox'

                                        />
                                        <Text style={styles.flatlistText}>{item.disease}</Text>
                                    </View>
                                )} />
                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 20 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addAllergicDisease()}>
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

export class HospitalizationAndSurgeries extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false

        }
    }
    render() {
        const hospitalizedFor = [{ condition: 'Blood Transfusion' }, { condition: 'None of the above' }, { condition: 'Not sure' }]

        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>hospitalization and Surgeries</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have you ever had any of the folloing procedures?</Text>
                            <FlatList
                                data={hospitalizedFor}
                                renderItem={({ item, index }) => (
                                    <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
                                        <CheckBox style={{ borderRadius: 5, marginLeft: -10 }}

                                            checked={this.state.checkBoxClick}


                                            onPress={() => { this.setState({ checkBoxClick: true }); }}

                                        />
                                        <Text style={styles.flatlistText}>{item.condition}</Text>
                                    </View>
                                )} />
                        </View>

                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have you ever been hospitalized ?</Text>
                            <Row style={{ marginTop: 15 }}>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Reason</Text>

                                </Col>
                                <Col size={5}>
                                    <Text style={{ fontFamily: "OpenSans", fontSize: 12, }}>Date</Text>

                                </Col>
                            </Row>
                            <Row style={{ marginTop: 5 }}>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle7}>
                                        <TextInput
                                            placeholder="Enter reason"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{
                                }}>
                                    <Form style={styles.formStyle8}>
                                        <TextInput
                                            placeholder="Enter date"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col size={5} style={{}}>

                                    <Form style={styles.formStyle4}>
                                        <TextInput
                                            placeholder="Enter reason"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />

                                    </Form>
                                </Col>
                                <Col size={5} style={{}}>
                                    <Form style={[styles.formStyle3, { justifyContent: 'center' }]}>
                                        <TextInput
                                            placeholder="Enter date"
                                            style={Platform == "ios" ? styles.textInputStyle : styles.textInputAndroid}
                                            placeholderTextColor="#C1C1C1"
                                            keyboardType={'default'}
                                            returnKeyType={'go'}
                                        />
                                    </Form>
                                </Col>
                            </Row>

                        </View>

                        <View style={{ flexDirection: 'row', height: 38, marginTop: 50 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.setState({ firstQuestion: 10 })}>
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
export class SocialHistory extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            firstQuestion: 0,
            radioButton: false,
            checkBoxClick: false,
            sexuallyActive: true,
            drinkAlcohol: true,
            smoke: true,
            recreational_drugs: true,
            physically_or_verbally: true,
            selectnumber: '',
            exercise: true




        }
    }

    addSocialHistory = async () => {
        try {
            const { sexuallyActive, drinkAlcohol, smoke, recreational_drugs, physically_or_verbally, selectnumber, exercise } = this.state
            let userId = await AsyncStorage.getItem('userId');
            let data = {
                sexually_active: sexuallyActive,
                drink_alcohol: drinkAlcohol,
                smoke: smoke,
                use_recreational_drugs: recreational_drugs,
                use_caffeinated_drink: selectnumber,
                physically_or_verbally_hurt_you: physically_or_verbally,
                exercise: exercise
            }
            this.setState({ isLoading: true })
            let response = await userFiledsUpdate(userId, data)
            alert(JSON.stringify(response))
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('PrepareAppointmentLastStep');
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
        const { selectnumber } = this.state
        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.content}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.subHead, { textAlign: 'center' }]}>Social history</Text>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Are you sexually active?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.sexuallyActive}
                                            onPress={() => this.setState({ sexuallyActive: this.state.sexuallyActive })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.sexuallyActive}
                                            onPress={() => this.setState({ sexuallyActive: !this.state.sexuallyActive })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you drink alcohol?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.drinkAlcohol}
                                            onPress={() => this.setState({ drinkAlcohol: this.state.drinkAlcohol })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.drinkAlcohol}
                                            onPress={() => this.setState({ drinkAlcohol: !this.state.drinkAlcohol })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you smoke ?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.smoke}
                                            onPress={() => this.setState({ smoke: this.state.smoke })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.smoke}
                                            onPress={() => this.setState({ smoke: !this.state.smoke })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you use recreational drugs?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.recreational_drugs}
                                            onPress={() => this.setState({ recreational_drugs: this.state.recreational_drugs })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.recreational_drugs}
                                            onPress={() => this.setState({ recreational_drugs: !this.state.recreational_drugs })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>How many caffinated drinks do you have per day?</Text>
                            <Form style={styles.formStyle6}>
                                <Picker style={styles.userDetailLabel}
                                    mode="dropdown"
                                    placeholder='Select number'
                                    placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                                    iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20, marginLeft: 170 }} />}
                                    textStyle={{ color: "gray", left: 0, fontSize: 12, marginLeft: -5 }}
                                    note={false}
                                    itemStyle={{
                                        paddingLeft: 10,
                                        fontSize: 16,
                                        fontSize: 12,
                                    }}
                                    itemTextStyle={{ color: '#5cb85c', fontSize: 12, }}
                                    style={{ width: undefined }}
                                    onValueChange={(sample) => { this.setState({ selectnumber: sample }) }}
                                    selectedValue={selectnumber}
                                    testID="editBloodGroup"
                                >
                                    {numberList.map((value, key) => {
                                        return <Picker.Item label={value} value={value} key={key}
                                        />
                                    })
                                    }
                                </Picker>

                            </Form>
                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Have anyone in your home ever physically or verbally hurt you?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.physically_or_verbally}
                                            onPress={() => this.setState({ physically_or_verbally: this.state.physically_or_verbally })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.physically_or_verbally}
                                            onPress={() => this.setState({ physically_or_verbally: !this.state.physically_or_verbally })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ marginTop: 20, width: '100%', }}>

                            <Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Do you exercise ?</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <Col style={{ flexDirection: 'row' }} size={5}>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={this.state.exercise}
                                            onPress={() => this.setState({ exercise: this.state.exercise })} />
                                        <Text style={styles.radioText1}>Yes</Text>
                                    </Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Radio
                                            standardStyle={true}
                                            selected={!this.state.exercise}
                                            onPress={() => this.setState({ exercise: !this.state.exercise })} />
                                        <Text style={styles.radioText1}>No</Text>
                                    </Col>
                                </Col>
                                <Col size={5}>
                                </Col>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', height: 38, marginTop: 15 }}>
                            <View style={{ width: '40%', }}>
                                <TouchableOpacity style={styles.skipButton} onPress={() => this.setState({ firstQuestion: true })}>
                                    <Text style={styles.touchText}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '60%', marginLeft: 5 }}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => this.addSocialHistory()}>
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

export class PrepareAppointmentLastStep extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            agreed_for_send_forms: false

        }
    }
    addAppointmentLastStep = async () => {
        try {
            let data = {
                agreed_for_send_forms: this.state.agreed_for_send_forms
            }
            this.setState({ isLoading: true })
            let response = await prepareAppointmentUpdate("5eb12fb614dc71158fe83a7f", data)
            if (response.success) {
                Toast.show({
                    text: response.message,
                    type: "success",
                    duration: 3000,
                })
                this.props.navigation.navigate('Home');
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
                    <View style={styles.mainView}>
                        <View>
                            <View style={styles.centerContent}>
                                <Image source={require('../../../../../assets/images/FormComplete.png')} style={{ height: 200, width: 200, }} />

                            </View>
                            <Text style={styles.textContent}>Last Step!</Text>
                            <Text style={[styles.subText1, { lineHeight: 22 }]}>Confirm your information below,and then we'll send all your forms to your doctor</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
                            <CheckBox style={{ borderRadius: 5 }}
                                checked={this.state.agreed_for_send_forms}
                                onPress={() => this.setState({ agreed_for_send_forms: !this.state.agreed_for_send_forms })}
                            />
                            <Text style={[styles.flatlistText, { color: '#4c4c4c', lineHeight: 20 }]}>I verify that the information presented here is accurate,and i autorize Medflic to sen this
                                            information to my healthcare provider.</Text>
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


const styles = StyleSheet.create({
    container: {

    },
    touchStyle: {
        backgroundColor: '#8EC63F',
        borderRadius: 1,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        paddingTop: 10,
        justifyContent: 'center',

    },
    touchText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    userDetailLabel: {
        // backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: 'OpenSans',
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 8,

    },
    content: {
        padding: 30,
    },

    mainView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContent: {
        color: '#7F49C3',
        fontSize: 22,
        fontFamily: "OpenSans",
        fontWeight: '700',
        textAlign: 'center'
    },
    subText1: {
        fontFamily: "OpenSans",
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15
    },
    subHead: {
        color: '#000',
        fontSize: 16,
        fontFamily: "OpenSans",
        fontWeight: '700',
    },
    innersubTexts: {
        fontFamily: "OpenSans",
        fontSize: 15,
        marginLeft: 10
    },
    skipButton: {
        backgroundColor: '#4E85E9',
        paddingBottom: 10,
        paddingTop: 10,
    },
    saveButton: {
        backgroundColor: '#8EC63F',
        paddingBottom: 10,
        paddingTop: 10
    },
    formText: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center'
    },
    textInputStyle: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        marginTop: 8
    },
    textInputAndroid: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2
    },
    bigTextInput: {
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 2,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    formStyle2: {
        borderColor: '#909090',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center'
    },
    flatlistText: {
        fontFamily: "OpenSans",
        fontSize: 12,
        marginLeft: 20
    },
    formStyle3: {
        width: '100%',
        height: 35,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5
    },
    formStyle4: {
        width: '100%',
        height: 35,
        borderLeftColor: '#909090',
        borderLeftWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    formStyle5: {
        borderColor: '#909090',
        borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 35,
        justifyContent: 'center'
    },
    formStyle6: {
        borderColor: '#909090',
        borderWidth: 0.5,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        borderRadius: 5
    },
    formStyle7: {
        width: '100%',
        height: 35,
        borderLeftColor: '#909090',
        borderLeftWidth: 0.5,
        borderTopColor: '#909090',
        borderTopWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    formStyle8: {
        width: '100%',
        height: 35,
        borderTopColor: '#909090',
        borderTopWidth: 0.5,
        borderBottomColor: '#909090',
        borderBottomWidth: 0.5,
        borderRightColor: '#909090',
        borderRightWidth: 0.5,
        justifyContent: 'center'
    },
    radioText1: {
        fontFamily: "OpenSans",
        fontSize: 12,
        marginLeft: 10,
        color: '#909090'
    }
});
