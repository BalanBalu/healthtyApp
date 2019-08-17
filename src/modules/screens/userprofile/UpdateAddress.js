import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Footer, Icon, DatePicker,
    FooterTab, H3, Toast, ListItem, Radio, Picker, View
} from 'native-base';
import { userFiledsUpdate, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, BackHandler, AsyncStorage, TouchableHighlight } from 'react-native';
import styles from './style.js';
import { ScrollView } from 'react-native-gesture-handler';
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

    validateCity = (text) => {
        const regex = new RegExp('^[A-Z ]+$') //Support Capital letter with space
        this.setState({ city: text, updateButton: false });
        if (regex.test(text) === false) {
            this.setState({ updateButton: true });
            Toast.show({
                text: 'Kindly Enter UpperCase Letters',
                type: "danger",
                duration: 3000
            });
        }
    }

    userUpdate() {
        try {
            const { userData, no_and_street, address_line_1, address_line_2, city, pin_code } = this.state
            this.setState({ isLoading: true });
            if (userData.address !== undefined) {
                if (no_and_street != userData.address.address.no_and_street || address_line_1 != userData.address.address.address_line_1 ||
                    address_line_2 != userData.address.address.address_line_2 || city != userData.address.address.city ||
                    pin_code != userData.address.address.pin_code) {
                    this.commonUpdateAddressMethod();     //Common method to update address                    
                } else {
                    this.props.navigation.navigate('Profile');
                }
            } else {
                console.log("else")
                this.commonUpdateAddressMethod();
            }
        } catch (e) {
            console.log(e);

        }
    }





    render() {
        return (
            <Container style={styles.Container}>
                <Content style={styles.bodyContent} contentContainerStyle={{ flex: 1 }}>
                    <ScrollView>

                        <H3 style={{ fontSize: 20, fontFamily: 'opensans-semibold', marginTop: 20, marginLeft: '5%', fontWeight: 'bold', }}>Update User Details</H3>

                        <Form>
                            <ScrollView scrollEventThrottle={16} >
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginTop: 30 }}>Door_no</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Door no"
                                        style={styles.transparentLabel}
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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>Address Line1</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Address Line1"
                                        style={styles.transparentLabel}
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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>Address Line2</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Address Line2"
                                        style={styles.transparentLabel}
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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>City</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter City"
                                        style={styles.transparentLabel}
                                        autoFocus={this.state.isFocusKeyboard}
                                        ref={(input) => { this.address_line_2 = input; }}
                                        value={this.state.city}
                                        keyboardType={'default'}
                                        returnKeyType={'next'}
                                        onChangeText={text => this.validateCity(text)}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.city._root.focus(this.setState({ isFocusKeyboard: true })); }}
                                        testID="enterCity"
                                    />
                                </Item>

                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>Pincode</Text>
                                </Item>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input
                                        placeholder="Enter Pincode"
                                        style={styles.transparentLabel}
                                        value={this.state.pin_code}
                                        autoFocus={this.state.isFocusKeyboard}
                                        ref={(input) => { this.city = input; }}
                                        keyboardType="numeric"
                                        returnKeyType={'next'}
                                        onChangeText={pin_code => this.setState({ pin_code })}
                                        autoCapitalize='none'
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.userUpdate() }}
                                        testID="enterPincode"
                                    />
                                </Item>






                                <Button disabled={this.state.updateButton} style={styles.loginButton} ref={(input) => { this.pin_code = input; }} block primary onPress={() => this.userUpdate()} testID="updateAddressButton">
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>Update</Text>
                                </Button>
                            </ScrollView>

                        </Form>
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


