import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, ScrollView } from 'react-native';
import styles from './style.js';
import {
    formatDate,subTimeUnit
} from "../../../setup/helpers";
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
            userData:'',
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
        this.setState({ userData})    
            await this.setState({
                    dob: userData.dob,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    gender: userData.gender,
                    selectedBloodGroup:userData.blood_group||null                   
                })           
        }
        
    validateFirstNameLastName=(text,type)=>{
        if(type==="Firstname" || type ==="Lastname"){
        const regex=new RegExp('^[A-Z ]+$')  //Support Capital letter with space
        if(regex.test(text) === false){ 
            Toast.show({
                    text: 'Accepts only UpperCase Letters',
                    type: "danger",
                    duration: 3000
            });            
        }
        if(type==="Firstname"){
        this.setState({firstName:text});
        }else{
        this.setState({lastName:text});
        }
    }                
    }

    userUpdate = async () => {
        const { userData, firstName, lastName, dob, gender, selectedBloodGroup } = this.state
        try {
            this.setState({ isLoading: true });
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
                    this.setState({isLoading:false});
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



                <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center', marginTop: 100 }}>
                    <ScrollView>
                        <H3 style={styles.welcome}>Update User Details</H3>
                        <Form>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input placeholder="First Name" style={styles.transparentLabel}
                                    value={this.state.firstName}
                                    keyboardType={'default'}
                                    returnKeyType={"next"}
                                    onChangeText={text => this.validateFirstNameLastName(text,"Firstname")}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.firstName._root.focus(); }}
                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0 }}>
                                <Input placeholder="Last Name" style={styles.transparentLabel}
                                    ref={(input) => { this.firstName = input; }}
                                    value={this.state.lastName}
                                    keyboardType={'default'}
                                    returnKeyType={"next"}
                                    onChangeText={text => this.validateFirstNameLastName(text,"Lastname")}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.lastName._root.focus(this.setState({ focus: true })); }}
                                />
                            </Item>

                            <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                                <Icon name='calendar' style={{ paddingLeft: 20, color: '#775DA3' }} />
                                <DatePicker style={styles.transparentLabel}
                                    defaultDate={this.state.dob}
                                    timeZoneOffsetInMinutes={undefined}
                                    returnKeyType={'next'}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    minimumDate={new Date(1940, 0, 1)}
                                    maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                    androidMode={"default"}
                                    placeHolderText={formatDate(this.state.dob, "DD/MM/YYYY")}
                                    textStyle={{ color: "#5A5A5A" }}
                                    value={this.state.dob}
                                    placeHolderTextStyle={{ color: "#5A5A5A" }}
                                    onDateChange={dob => { console.log(dob); this.setState({ dob }) }}
                                    disabled={false}
                                />

                            </Item>
                            <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                                <Picker style={{ fontFamily: 'OpenSans' }}
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    textStyle={{ color: "#5cb85c" }}
                                    note={false}
                                    itemStyle={{
                                        backgroundColor: "gray",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                    }}
                                    itemTextStyle={{ color: '#5cb85c' }}
                                    style={{ width: undefined }}
                                    onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                                    selectedValue={this.state.selectedBloodGroup}
                                >

                                    {bloodGroupList.map((value, key) => {

                                        return <Picker.Item label={String(value)} value={String(value)} key={key}
                                        />
                                    })
                                    }

                                </Picker>
                            </Item>

                            <ListItem noBorder>

                                <Radio selected={this.state.gender === 'M'} onPress={() => this.onPressRadio('M')} style={{ marginLeft: 2, }} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>Male</Text>

                                <Radio selected={this.state.gender === 'F'} onPress={() => this.onPressRadio('F')} style={{ marginLeft: 10 }} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{ marginLeft: 10, fontFamily: 'OpenSans' }}>Female</Text>

                                <Radio selected={this.state.gender === 'O'} onPress={() => this.onPressRadio('O')} style={{ marginLeft: 10 }} color={"#775DA3"}
                                    selectedColor={"#775DA3"} />
                                <Text style={{ marginLeft: 10 }}>Other</Text>

                            </ListItem>

                            <Spinner color='blue'
                                visible={this.state.isLoading}
                                textContent={'Please wait Loading'}
                            />


                            <Button style={{ height: 45, width: 'auto',color:'gray',borderRadius: 10, textAlign: 'center',marginTop: 20, padding: 85, marginLeft: 15 }} primary onPress={() => this.userUpdate()}>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 15, }}>Update</Text>
                            </Button>

                        </Form>

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
