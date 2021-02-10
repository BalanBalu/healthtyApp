import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker, View
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Row, Col } from 'react-native-easy-grid';
import {primaryColor} from '../../../setup/config'

import { Image, BackHandler, AsyncStorage, ScrollView,Platform } from 'react-native';
import styles from './style.js';
import {
    formatDate, subTimeUnit
} from "../../../setup/helpers";
import Spinner from '../../../components/Spinner';
import { bloodGroupList, validateName } from "../../common";


class UpdateUserDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            dob: null,
            gender: 'M',
            radioStatus: [true, false, false],
            fromProfile: false,
            isLoading: false,
            selectedBloodGroup: null,
            userData: '',
            updateButton: true,
            errorMsg: '',
            firstNameMsg: '',
            lastNameMsg: ''

        }
    }
    componentDidMount() {
        this.bindValues();
    }

    onPressRadio(value) {
        this.setState({ gender: value })
    }

    toggleRadio = (radioSelect, genderSelect) => {
        let tempArray = [false, false, false];
        tempArray[radioSelect] = true;
        this.setState({ radioStatus: tempArray });
        this.setState({ gender: genderSelect });
    }

    async bindValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        const fromProfile = navigation.getParam('fromProfile') || false
        if (fromProfile) {
            await this.setState({
                dob: userData.dob || null,
                firstName: userData.first_name,
                lastName: userData.last_name,
                gender: userData.gender,
                selectedBloodGroup: userData.blood_group || null,
                updateButton: true,
                userData

            })
        }
    }

    onChangeFirstnameAndLastname = async (text, type) => {
        if (type === "Firstname") {
            await this.setState({ firstName: text });
        }
        if (type === "LastName") {
            await this.setState({ lastName: text });
        }

        if (this.state.firstName && validateName(this.state.firstName) == false) {
            this.setState({ firstNameMsg: 'Firstname must be a Characters' })
            return false;
        }
        if (this.state.lastName && validateName(this.state.lastName) == false) {
            this.setState({ lastNameMsg: 'Lastname must be a Characters' })
            return false;
        }
        else {
            this.setState({ firstNameMsg: '', lastNameMsg: '', updateButton: false });

        }

    }

    userUpdate = async () => {
        const { userData, firstName, lastName, dob, gender, selectedBloodGroup } = this.state
        try {
            if (firstName == undefined || lastName == undefined || dob == undefined || gender == undefined || selectedBloodGroup == undefined || selectedBloodGroup == 'Select Blood Group') {
                this.setState({ errorMsg: 'Kindly fill all the fields...' })
                return false;
            }

            this.setState({ errorMsg: '', firstNameMsg: '', lastNameMsg: '', isLoading: true, updateButton: false });
            let requestData = {
                first_name: firstName,
                last_name: lastName,
                dob: dob,
                gender: gender,
                blood_group: selectedBloodGroup
            };
            const userId = await AsyncStorage.getItem('userId')
            let isProfileCompleted = await AsyncStorage.getItem('ProfileCompletionViaHome');
            let response = await userFiledsUpdate(userId, requestData);
            if (response.success) {
                Toast.show({
                    text: 'Your Profile has been Updated',
                    type: "success",
                    duration: 3000
                });
                if (isProfileCompleted == '1') {
                    this.props.navigation.navigate('Home');
                    await AsyncStorage.removeItem('ProfileCompletionViaHome')
                }else{
                    this.props.navigation.navigate('Profile');
                }
            }
            else {
                Toast.show({
                    text: response.message,
                    type: "danger",
                    duration: 3000
                });
                this.setState({ isLoading: false });
            }

        }

        catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }


    render() {

        return (

            <Container >
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        {this.state.isLoading ? <Spinner color='blue'
                            visible={this.state.isLoading}
                        /> : null}

                        <Text style={styles.headerText}>Update Your Details</Text>
                        <View style={{ marginLeft: -10 }}>
                            <Form style={{ marginTop: 10 }}>

                                <Item style={{ borderBottomWidth: 0, }}>
                                    <Input placeholder="First Name" style={styles.transparentLabel2}
                                        value={this.state.firstName}
                                        keyboardType={'default'}
                                        returnKeyType={"next"}
                                        onChangeText={text => this.onChangeFirstnameAndLastname(text, 'Firstname')}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.firstName._root.focus(); }} testID="editFirstName"
                                    />
                                </Item>
                                {this.state.firstNameMsg ? <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}>{this.state.firstNameMsg}</Text> : null}
                                <Item style={{ borderBottomWidth: 0, }}>
                                    <Input placeholder="Last Name" style={styles.transparentLabel2}
                                        ref={(input) => { this.firstName = input; }}
                                        value={this.state.lastName}
                                        keyboardType={'default'}
                                        returnKeyType={"done"}
                                        onChangeText={text => this.onChangeFirstnameAndLastname(text, 'LastName')}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        // onSubmitEditing={() => { this.lastName._root.focus(this.setState({ focus: true })); }}
                                        testID="editLastName"
                                    />
                                </Item>
                                {this.state.lastNameMsg ? <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}>{this.state.lastNameMsg}</Text> : null}
                                <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', height: 45, marginRight: 15, marginTop: 10, borderRadius: 5, }}>
                                    <Icon name='calendar' style={{ marginLeft: 10, color: primaryColor }} />
                                    <DatePicker style={styles.transparentLabel2}
                                        defaultDate={this.state.dob}
                                        timeZoneOffsetInMinutes={undefined}
                                        returnKeyType={'next'}
                                        modalTransparent={false}
                                        animationType={"fade"}
                                        minimumDate={new Date(1940, 0, 1)}
                                        maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                        androidMode={"default"}
                                        placeHolderText={this.state.dob ? formatDate(this.state.dob, "DD/MM/YYYY") : "Date Of Birth"}
                                        textStyle={{ fontSize: 13, color: "#5A5A5A" }}
                                        value={this.state.dob}
                                        placeHolderTextStyle={{ fontSize: 13, color: "#5A5A5A" }}
                                        onDateChange={dob => {this.setState({ dob, updateButton: false }) }}
                                        disabled={false}
                                        testID="editDateOfBirth"
                                    />

                                </Item>
                                <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', height: 45, marginRight: 15, marginTop: 10, borderRadius: 5, }}>
                                    <Picker style={styles.transparentLabel2}
                                        mode="dropdown"
                                        placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: 'gray', fontSize: 20 }} />}
                                        textStyle={{ color: "gray", left: 0, marginLeft: -5 }}
                                        note={false}
                                        itemStyle={{
                                         
                                            paddingLeft: 10,
                                            fontSize: 16,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', }}
                                        style={{ width: "100%"  }}
                                        onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample, updateButton: false }) }}
                                        selectedValue={this.state.selectedBloodGroup}
                                        testID="editBloodGroup"
                                    >

                                        {bloodGroupList.map((value, key) => {

                                            return <Picker.Item label={String(value)} value={String(value)} key={key}
                                            />
                                        })
                                        }

                                    </Picker>
                                </Item>


                                <View style={{ marginTop: 20, borderBottomWidth: 0, marginLeft: 20,}}>
                                            <Row style={ Platform.OS === "ios" ? {marginLeft:10,marginRight:10}:null} >
                                                <Col size={3} style={{flexDirection:'row',alignItems:'center'}}>
                                                   
                                                    <Radio 
                                                        standardStyle={true}
                                                        onPress={() => this.setState({ gender: 'M', updateButton: false })}
                                                        selected={this.state.gender === 'M'}
                                                    />
                                                    <Text style={ Platform.OS === "ios" ? {  fontFamily: 'OpenSans', fontSize: 14, marginLeft:5 }:{  fontFamily: 'OpenSans', fontSize: 12,marginLeft:5 }}>Male</Text>
                                                    
                                                </Col>
                                                <Col size={3} style={{alignItems:'center',flexDirection:'row'}}>
                                                    <Radio 
                                                        standardStyle={true}
                                                        onPress={() => this.setState({ gender: 'F', updateButton: false })}
                                                        selected={this.state.gender === 'F'}
                                                       />
                                                    <Text style={ Platform.OS === "ios" ? {  fontFamily: 'OpenSans', fontSize: 14, marginLeft:5 }:{  fontFamily: 'OpenSans', fontSize: 12, marginLeft:5  }}>Female</Text>
                                            </Col>
                                            <Col size={3} style={{alignItems:'center',flexDirection:'row'}}>
                                                    <Radio
                                                        standardStyle={true}
                                                        selectedColor={primaryColor}
                                                        onPress={() => this.setState({ gender: 'O', updateButton: false })}
                                                        selected={this.state.gender === 'O'}/>
                                                    <Text style={ Platform.OS === "ios" ? {  fontFamily: 'OpenSans', fontSize: 14, marginLeft:5 }:{  fontFamily: 'OpenSans', fontSize: 12, marginLeft:5  }}>Others</Text>
                                            </Col>
                                            </Row>                              
                                </View>
                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{this.state.errorMsg}</Text>

                                <View>
                                    <Button primary disabled={this.state.updateButton} style={this.state.updateButton ? styles.addressButtonDisable : styles.addressButton} block onPress={() => this.userUpdate()} testID="updateBasicDetails">
                                        <Text style={styles.buttonText}>Update</Text>
                                    </Button>
                                </View>
                            </Form>

                        </View>
                    </ScrollView>
                </Content>


            </Container>

        )

    }
}


function userDetailsState(state) {
    return {
        user: state.user
    }
}
export default connect(userDetailsState)(UpdateUserDetails)
