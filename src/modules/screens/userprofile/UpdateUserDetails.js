import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker, View
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Row } from 'react-native-easy-grid';

import { Image, BackHandler, AsyncStorage, ScrollView } from 'react-native';
import styles from './style.js';
import {
    formatDate, subTimeUnit
} from "../../../setup/helpers";
import { RadioButton } from 'react-native-paper';
import Spinner from '../../../components/Spinner';
const bloodGroupList = ['Select Blood Group', 'A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']

class UpdateUserDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            dob: null,
            gender: '',
            fromProfile: false,
            isLoading: false,
            selectedBloodGroup: null,
            updateButton: false,
            userData: '',
        }
    }
    componentDidMount() {
        this.bindValues();
    }

    onPressRadio(value) {
        this.setState({ gender: value })
    }
    async bindValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        this.setState({ userData })
        await this.setState({
            dob: userData.dob,
            firstName: userData.first_name,
            lastName: userData.last_name,
            gender: userData.gender,
            selectedBloodGroup: userData.blood_group || null
        })
    }

    validateFirstNameLastName = async (text, type) => {
        const regex = new RegExp('^[\ba-zA-Z ]+$')  //Support letter with space
        if (type === "Firstname") {
            this.setState({ firstName: text, updateButton: false });
        } else {
            this.setState({ lastName: text, updateButton: false });
        }
        if (regex.test(text) === false) {
            this.setState({ updateButton: true });
            if(text!==''){
            Toast.show({
                text: 'Please enter only alphabets',
                type: "danger",
                duration: 3000
            });
        }        
        }
    }

    userUpdate = async () => {
        const { userData, firstName, lastName, dob, gender, selectedBloodGroup } = this.state
        try {
            this.setState({ isLoading: true, updateButton: false });
            if (userData.first_name != firstName || userData.last_name != lastName || userData.dob != dob || userData.gender != gender || userData.blood_group != selectedBloodGroup) {
                let requestData = {
                    first_name: firstName,
                    last_name: lastName,
                    dob: dob,
                    gender: gender,
                    blood_group: selectedBloodGroup
                };

                const userId = await AsyncStorage.getItem('userId')
                let response = await userFiledsUpdate(userId, requestData);
                if (response.success) {
                    Toast.show({
                        text: 'Your Profile has been Updated',
                        type: "success",
                        duration: 3000
                    });
                    this.props.navigation.navigate('Profile');
                }
                else {
                    Toast.show({
                        text: response.message,
                        type: "danger",
                        duration: 3000
                    });
                    this.setState({ isLoading: false });
                }
            } else {

                this.props.navigation.navigate('Profile');
            }

        }


        catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });


            console.log(e);
        }
    }


    render() {

        return (

            <Container >

              

                <Content contentContainerStyle={styles.bodyContent}>
                <ScrollView>
                        <Text style={styles.headerText}>Update Your Details</Text>
                        <View style={{marginLeft:-10}}>
                        <Form style={{marginTop: 10 }}>

                            <Item style={{ borderBottomWidth: 0, }}>
                                <Input placeholder="First Name" style={styles.transparentLabel2}
                                    value={this.state.firstName}
                                    keyboardType={'default'}
                                    returnKeyType={"next"}
                                    onChangeText={text => this.validateFirstNameLastName(text, "Firstname")}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.firstName._root.focus(); }} testID="editFirstName"
                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0, }}>
                                <Input placeholder="Last Name" style={styles.transparentLabel2}
                                    ref={(input) => { this.firstName = input; }}
                                    value={this.state.lastName}
                                    keyboardType={'default'}
                                    returnKeyType={"next"}
                                    onChangeText={text => this.validateFirstNameLastName(text, "Lastname")}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.lastName._root.focus(this.setState({ focus: true })); }}
                                    testID="editLastName"
                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1',height: 45, marginRight: 15, marginTop: 10, borderRadius: 5, }}>
                                <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                                <DatePicker style={styles.transparentLabel2}
                                    defaultDate={this.state.dob}
                                    timeZoneOffsetInMinutes={undefined}
                                    returnKeyType={'next'}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    minimumDate={new Date(1940, 0, 1)}
                                    maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                    androidMode={"default"}
                                    placeHolderText={formatDate(this.state.dob, "DD/MM/YYYY")}
                                    textStyle={{ fontSize:13,color: "#5A5A5A" }}
                                    value={this.state.dob}
                                    placeHolderTextStyle={{fontSize:13, color: "#5A5A5A" }}
                                    onDateChange={dob => { console.log(dob); this.setState({ dob }) }}
                                    disabled={false}
                                    testID="editDateOfBirth"
                                />

                            </Item>
                            <Item style={{ borderBottomWidth: 0, marginRight: 15,height: 45, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                                <Picker style={styles.transparentLabel2}
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    textStyle={{ color: "#5cb85c" }}
                                    note={false}
                                    itemStyle={{
                                        backgroundColor: "gray",

                                        paddingLeft: 10,
                                        fontSize: 10,
                                    }}
                                    itemTextStyle={{ color: '#5cb85c' }}
                                    style={{ width: undefined }}
                                    onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
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

                            
                            <Item style={{ marginTop: 20, borderBottomWidth: 0, marginLeft: 20 }}>

<RadioButton.Group>
      <RadioButton selected={this.state.gender === 'M'} onPress={() => this.onPressRadio('M')}/>
      <Text style={{
            marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
        }}>Male</Text>  
      <RadioButton selected={this.state.gender === 'F'} onPress={() => this.onPressRadio('F')} />
      <Text style={{
            marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
        }}>Female</Text>  
      <RadioButton selected={this.state.gender === 'O'} onPress={() => this.onPressRadio('O')}/>
      <Text style={{
            marginLeft: 10, fontFamily: 'OpenSans',fontSize:15
        }}>Others</Text>  
          
 </RadioButton.Group>  
 </Item>

                            <Spinner color='blue'
                                visible={this.state.isLoading}
                                textContent={'Please wait Loading'}
                            />

                            <View>
                                <Button disabled={this.state.updateButton} primary  style={styles.addressButton} block onPress={() => this.userUpdate()}>
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
