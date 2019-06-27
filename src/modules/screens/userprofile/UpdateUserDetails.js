import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio,Picker
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage,TouchableHighlight } from 'react-native';
import styles from './style.js';
import {
    formatDate,
} from "../../../setup/helpers";


import Spinner from '../../../components/Spinner';
import { ScrollView } from 'react-native-gesture-handler';
const bloodGroupList = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-']

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
            selectedBloodGroup:null


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
        console.log(userData);
        const fromProfile = navigation.getParam('fromProfile') || false
        if (fromProfile) {
            if (userData.dob) {
                await this.setState({
                    dob: userData.dob,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    gender: userData.gender,
                    selectedBloodGroup:userData.blood_group
                    
                })
            }

        }
    }



    userUpdate = async () => {
        

        try {
        
                this.setState({ isLoading: true });
                let requestData = {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    dob: this.state.dob,
                    gender: this.state.gender,
                    blood_group: this.state.selectedBloodGroup
                };
                console.log(requestData)
                const userId = await AsyncStorage.getItem('userId')
                let response = await userFiledsUpdate(userId, requestData);
                if (response.success) {
                    Toast.show({
                        text: 'Your Profile has been Updated',
                        type: "success",
                        duration: 3000
                    });
                    this.props.navigation.navigate('Profile');                }
                else {
                    Toast.show({
                        text: response.message,
                        type: "danger",
                        duration: 3000
                    });
                }
                this.setState({ isLoading: false })
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

            <Container style={styles.container}>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please wait updating...'}
                />


                <Content style={styles.bodyContent} contentContainerStyle={{ justifyContent: 'center', flex: 1, height: '75%' }}>

                    <H3 style={styles.welcome}>Update User Details</H3>
                    <Form>
                    
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input placeholder="First Name" style={styles.transparentLabel}
                                value={this.state.firstName}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                onChangeText={firstName => this.setState({ firstName })}
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

                                onChangeText={lastName => this.setState({ lastName })}
                                autoCapitalize='none'
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.lastName._root.focus(); }}
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
                                androidMode={"default"}
                                    placeHolderText={formatDate(this.state.dob, "DD/MM/YYYY")}
                                textStyle={{ color: "#5A5A5A" }}
                                value={this.state.dob}
                                placeHolderTextStyle={{ color: "#5A5A5A" }}
                                onDateChange={dob => { console.log(dob); this.setState({ dob }) }}

                                onSubmitEditing={() => { this.dob._root.focus(); }}
                                disabled={false}
                            />

                        </Item>
                        <Item style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', marginTop: 10, borderRadius: 5 }}>
                        <Picker style={{ fontFamily: 'OpenSans' }}
                            mode="dropdown"
                            placeholder="Select blood group"
                            iosIcon={<Icon name="arrow-down" />}
                            textStyle={{ color: "#5cb85c" }}
                            itemStyle={{
                                backgroundColor: "gray",
                                marginLeft: 0,
                                paddingLeft: 10
                            }}
                            itemTextStyle={{ color: 'gray' }}
                            style={{ width: 25 }}
                            onValueChange={(sample) => { this.setState({ selectedBloodGroup: sample }) }}
                            selectedValue={this.state.selectedBloodGroup}
                        >
                            
                            {bloodGroupList.map((value,key) => {
                               
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




                        <Button style={styles.updateButton} block primary onPress={() => this.userUpdate()}>
                            <Text style={{ fontFamily: 'OpenSans' }}>Update</Text>
                            </Button>
                        
                    </Form>


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
