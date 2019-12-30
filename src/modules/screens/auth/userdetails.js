import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker, View, Picker,Card,Row,
    FooterTab, H3, Toast
} from 'native-base';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, ScrollView ,ImageBackground,TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles';
import Spinner from '../../../components/Spinner';
import { subTimeUnit } from "../../../setup/helpers";
import { bloodGroupList} from "../../common";

class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            dob: '',
            errorMsg: '',
            checked: false,
            selectedBloodGroup: null,
            isBloodDonor: false,
            isLoading: false

        }
    }

    validateFirstNameLastName = async (text, type) => {
        const regex = new RegExp('^[\ba-zA-Z ]+$')  //Support letter with space
        if (type === "firstName") {
            this.setState({ firstName: text });
        } else {
            this.setState({ lastName: text });
        }
        if (regex.test(text) === false) {
            this.setState({ errorMsg: "* Name can contain only alphabets" });
        } else {
            this.setState({ errorMsg: '' })
        }
    }

    userUpdate = async () => {
        try {
            if (this.state.errorMsg === '') {
                let requestData = {
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    dob: this.state.dob,
                    blood_group: this.state.selectedBloodGroup,
                    is_blood_donor: this.state.isBloodDonor

                };
                const userId = await AsyncStorage.getItem('userId')
                let response = await userFiledsUpdate(userId, requestData);
                // if (this.state.isBloodDonor){
                //     this.props.navigation.navigate('UpdateAddress') 

                // }

                if (response.success) {
                    if (this.state.isBloodDonor == true) {
                        this.props.navigation.navigate('MapBox')
                    }
                    else {
                       Toast.show({
                        text: 'Your Profile has been completed, Please Login to Continue',
                        type: "success",
                        duration: 3000
                      });
                      logout();
                      this.props.navigation.navigate('login');
                    }
                }
                else {
                    Toast.show({
                        text: response.message,
                        type: "danger",
                        duration: 3000
                    });
                }
            } else {
                Toast.show({
                    text: "Entered Data is not Valid. Kindly review them.",
                    type: "danger",
                    duration: 3000
                });
            }
        } catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                duration: 3000
            });
            console.log(e);
        }
    }


    render() {
        const { navigation, user: { isLoading } } = this.props;
        const { checked } = this.state;

        return (

            <Container style={styles.container}>
                                   <ImageBackground source={require('../../../../assets/images/MainBg.jpg')} style={{width: '100%', height: '100%', flex: 1 }}>

                <Content contentContainerStyle={styles.authBodyContent}>
                    <ScrollView>
                    <View >
                    <Text style={[styles.welcome,{color:'#fff'}]}>User Details</Text>
                     <Card style={{borderRadius:10,padding:5,marginTop:20}}>
                      <View style={{marginLeft:10,marginRight:10}}>
                            <Form>
                                <Item style={{ borderBottomWidth: 0 ,marginLeft:'auto',marginRight:'auto',}}>
                                    <Input placeholder="First Name" style={styles.authTransparentLabel}
                                        value={this.state.firstName}
                                        autoFocus={true}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={text => this.validateFirstNameLastName(text, "firstName")}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.firstName._root.focus(); }}
                                    />
                                </Item>

                                <Item style={{ borderBottomWidth: 0 ,marginLeft:'auto',marginRight:'auto',}} >
                                    <Input placeholder="Last Name" style={styles.authTransparentLabel}
                                        ref={(input) => { this.firstName = input; }}
                                        value={this.state.lastName}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={text => this.validateFirstNameLastName(text, "lastName")}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        // onSubmitEditing={() => { this.lastName.focus(); }}
                                    />
                                </Item>

                                <Row style={styles.authTransparentLabel}>
                                    <Icon name='calendar' style={{ color: '#775DA3',marginTop:8}} />
                                    <DatePicker style={styles.userDetailLabel}
                                        defaultDate={this.state.dob}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        minimumDate={new Date(1940, 0, 1)}
                                        maximumDate={subTimeUnit(new Date(), 1, 'year')}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        placeHolderText="Date Of Birth"
                                        textStyle={{ color: "#5A5A5A" }}
                                        value={this.state.dob}
                                        placeHolderTextStyle={{ color: "#5A5A5A" }}
                                        onDateChange={dob => { console.log(dob); this.setState({ dob }) }}

                                        disabled={false}
                                    /></Row>
                                <Item style={[styles.userDetailLabel,{borderBottomWidth: 0 }]}>
                                    <Picker style={styles.userDetailLabel}
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        textStyle={{ color: "#5cb85c", marginLeft: 35 }}
                                        note={false}
                                        itemStyle={{
                                            backgroundColor: "gray",

                                            paddingLeft: 10,
                                            fontSize: 10,
                                        }}
                                        itemTextStyle={{ color: '#5cb85c', marginLeft: 35 }}
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
                                <Row style={{marginTop:5}}>
                                    {/* <Checkbox color="green"
                                        status={checked ? 'checked' : 'unchecked'}
                                        onPress={() => { this.setState({ checked: !checked }); }}
                                    /> */}
                                    <Checkbox status={this.state.isBloodDonor ? 'checked' : 'unchecked'} color="#775DA3" onPress={() => this.setState({ isBloodDonor: !this.state.isBloodDonor })} testID='privateCheckbox'></Checkbox>
                                    <Text style={{ marginLeft: 2, color: '#775DA3', fontFamily: 'OpenSans', fontSize: 14,marginTop:10,fontWeight:'bold' }}>Are you blood donor</Text>
                                </Row>
                                <View>
                                <Text style={{ paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', color: 'red' }}> {this.state.errorMsg}</Text>
                                <Spinner color='blue'
                                    visible={this.state.isLoading}
                                    textContent={'Loading...'}
                                />
                                </View>

                            <View style={{alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity small style={styles.UserButton1}  onPress={() => this.userUpdate()}>
                                    <Text style={styles.ButtonText}>Submit</Text>
                                </TouchableOpacity>
                                </View>
                            </Form>
                            </View>
                            <Item style={{marginLeft:'auto',marginRight:'auto',borderBottomWidth:0,marginBottom:10,marginTop:10}}>
              <Text uppercase={false} style={{ color: '#000', fontSize: 14, fontFamily: 'OpenSans',color:'#775DA3' }}>Already Have An Account ?</Text>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
              <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans',fontWeight:'bold',color:'#fff' }}> Sign In</Text>
              </TouchableOpacity>
              </Item>
                            </Card>
                        </View>
                    </ScrollView>
                </Content>
              </ImageBackground>
            </Container>

        )
    }

}



function userDetailsState(state) {
    return {
        user: state.user
    }
}
export default connect(userDetailsState)(UserDetails)

