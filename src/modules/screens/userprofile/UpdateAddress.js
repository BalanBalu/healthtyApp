import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker, View
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, TouchableHighlight, ScrollView } from 'react-native';
import styles from './style.js';
import Spinner from '../../../components/Spinner';
class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            no_and_street: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            pin_code: '',
            isLoading: false,
            userData: '',
            isFocusKeyboard: false,
            updateButton: false

        }
    }
    componentDidMount() {

        this.bindValues();

    }
    async bindValues() {
        const { navigation } = this.props;
        const userData = navigation.getParam('updatedata');
        if (userData.address != undefined) {
            await this.setState({
                no_and_street: userData.address.address.no_and_street,
                address_line_1: userData.address.address.address_line_1,
                address_line_2: userData.address.address.address_line_2,
                city: userData.address.address.city,
                pin_code: userData.address.address.pin_code,
                userData: userData
            })
        }
    }

    //Common method to update address
    commonUpdateAddressMethod = async () => {
        const userId = await AsyncStorage.getItem('userId')
        let requestData = {
            address: {
                address: {
                    no_and_street: this.state.no_and_street,
                    address_line_1: this.state.address_line_1,
                    address_line_2: this.state.address_line_2,
                    city: this.state.city,
                    pin_code: this.state.pin_code
                }
            }
        };
        let response = await userFiledsUpdate(userId, requestData);
        console.log(response);

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
    }

    validateCity = () => {
        const regex = new RegExp('^[\ba-zA-Z ]+$')  //Support letter with space
        //this.setState({ updateButton: false });
        if (regex.test(this.state.city) === false) {
            //this.setState({ updateButton: true });
            if (this.state.city !== '') {
                Toast.show({
                    text: 'The entered city is invalid',
                    type: "danger",
                    duration: 3000
                });
            }
            return false;
        } else {
            return true;
        }
    }
     
    validatePincode(){
        const regex = new RegExp('^[0-9]+$')  //Support numbers
        if (regex.test(this.state.pin_code) === false) {
            //this.setState({ updateButton: true });
            if (this.state.pin_code !== '') {
                Toast.show({
                    text: 'The entered pin_code is invalid',
                    type: "danger",
                    duration: 3000
                });
            }
            return false;
        } else {
            return true;
        }
    }
//!/^[0-9]+$/.test(z)
    async userUpdate() {
        try {
            const { userData, no_and_street, address_line_1, address_line_2, city, pin_code } = this.state
            this.setState({ isLoading: true });
            if (userData.address !== undefined && this.validateCity() == true && this.validatePincode() == true) {
                if (no_and_street != userData.address.address.no_and_street || address_line_1 != userData.address.address.address_line_1 ||
                    address_line_2 != userData.address.address.address_line_2 || city != userData.address.address.city ||
                    pin_code != userData.address.address.pin_code) {
                    this.commonUpdateAddressMethod();     //Common method to update address                    
                } else {
                    this.props.navigation.navigate('Profile');
                }
            } else if (this.validateCity() == true && this.validatePincode() == true) {
                this.commonUpdateAddressMethod();
            }
        } catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }





    render() {
        return (
            <Container style={styles.Container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                    <View>
                        <Text style={styles.addressHeaderText}>Update User Details</Text>

                        <Form style={{marginTop:15}}>
                           
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={styles.subText}>Door_no</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Door no"
                                        style={styles.transparentLabel2}
                                        value={this.state.no_and_street}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={no_and_street => this.setState({ no_and_street })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.no_and_street._root.focus(); }}
                                        testID="enterNo&Street"

                                    />
                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={styles.subText}>Address Line 1</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Address Line1"
                                        style={styles.transparentLabel2}
                                        ref={(input) => { this.no_and_street = input; }}
                                        value={this.state.address_line_1}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={address_line_1 => this.setState({ address_line_1 })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.address_line_1._root.focus(); }}
                                        testID="enterAddressLine1"
                                    />
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={styles.subText}>Address Line 2</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Address Line2"
                                        style={styles.transparentLabel2}
                                        ref={(input) => { this.address_line_1 = input; }}
                                        value={this.state.address_line_2}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={address_line_2 => this.setState({ address_line_2 })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.address_line_2._root.focus(this.setState({ isFocusKeyboard: true })); }}
                                        testID="enterAddressLine2"


                                    />
                                </Item>


                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={styles.subText}>City</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter City"
                                        style={styles.transparentLabel2}
                                        autoFocus={this.state.isFocusKeyboard}
                                        ref={(input) => { this.address_line_2 = input; }}
                                        value={this.state.city}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={text => this.setState({ city: text })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.city._root.focus(this.setState({ isFocusKeyboard: true })); }}
                                        testID="enterCity"
                                    />
                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={styles.subText}>Pincode</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Pincode"
                                        style={styles.transparentLabel2}
                                        value={this.state.pin_code}
                                        // autoFocus={this.state.isFocusKeyboard}
                                        ref={(input) => { this.city = input; }}
                                        keyboardType="numeric"
                                        returnKeyType={'done'}
                                        onChangeText={pin => this.setState({ pin_code: pin })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.userUpdate() }}
                                        testID="enterPincode"
                                    />
                                </Item>






                                <Button disabled={this.state.updateButton} style={styles.addressButton} ref={(input) => { this.pin_code = input; }} block onPress={() => this.userUpdate()} testID="updateAddressButton">
                                    <Text style={styles.buttonText}>Update</Text>
                                </Button>
                           

                        </Form>
                        </View>
                    </ScrollView>
                </Content>
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please wait Loading...'}
                />

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


