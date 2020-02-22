import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon, Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast, Card, Label
} from 'native-base';
import { signUp } from '../../providers/auth/auth.actions';
import { acceptNumbersOnly } from '../../common';
import { connect } from 'react-redux'
import { StyleSheet, Image, View, TouchableOpacity, ImageBackground } from 'react-native';
import styles from '../../screens/auth/styles';
import { RadioButton, Checkbox } from 'react-native-paper';
import Spinner from '../../../components/Spinner'
const mainBg = require('../../../../assets/images/MainBg.jpg')

class Signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mobile_no: '',
            password: '',
            gender: 'M',
            radioStatus: [true, false, false],
            errorMsg: '',
            checked: false,
            showPassword: true,
            isLoading: false,
            referralCode: null
        }
    }
    toggleRadio = async (radioSelect, genderSelect) => {
        let tempArray = [false, false, false];
        tempArray[radioSelect] = true;
        await this.setState({ radioStatus: tempArray, gender: genderSelect });
    }
    doSignUp = async () => {
        const { mobile_no, password, checked, gender, referralCode } = this.state;
        try {
            if (checked === false) {
                this.setState({ errorMsg: 'Please agree to the terms and conditions to continue' });
                return false;
            }
           
            if (password.length < 6) {
                this.setState({ errorMsg: "Password is required Min 6 Characters" });
                return false;
            }
            if (password.length > 16) {
                this.setState({ errorMsg: "Password Accepted Max 16 Characters only" });
                return false
            }
            this.setState({ errorMsg: '', isLoading: true });
            let requestData = {
                mobile_no: mobile_no,
                password: password,
                gender: gender,
                type: 'user'
            };
            if (referralCode) {
                requestData.refer_code = referralCode
            }
            await signUp(requestData);        // Do SignUp Process
            if (this.props.user.success) {
                let loginData = {
                    userEntry: mobile_no,
                    password: password,
                    type: 'user'
                }
                this.props.navigation.navigate('renderOtpInput', { loginData: loginData });
            } else {
                this.setState({ errorMsg: this.props.user.message })
            }
        } catch (e) {
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false })
        }
    }
    onPasswordTextChanged(value) {
        // code to remove White Spaces from text field
        this.setState({ password: value.replace(/\s/g, "") });
    }
    render() {
        const { user: { isLoading } } = this.props;
        const { mobile_no, password, showPassword, checked, gender, errorMsg, referralCode } = this.state;
        return (
            <Container style={styles.container}>
                <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
                    <Content contentContainerStyle={styles.authBodyContent}>
                        <View >
                            <Text style={[styles.signUpHead, { color: '#fff' }]}>List Your Practice to Reach millions of Peoples</Text>
                            <Card style={{ borderRadius: 10, padding: 5, marginTop: 15 }}>
                                <View style={{ marginLeft: 10, marginRight: 10 }}>
                                    <Text uppercase={true} style={[styles.cardHead, { color: '#775DA3' }]}>Sign up</Text>
                                    <Form>
                                        <Label style={{ marginTop: 10, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Mobile Number</Label>
                                        <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Input placeholder="Mobile Number" style={styles.authTransparentLabel}
                                                returnKeyType={'next'}
                                                value={mobile_no}
                                                keyboardType={"number-pad"}
                                                onChangeText={mobile_no => acceptNumbersOnly(mobile_no) == true || mobile_no === '' ? this.setState({ mobile_no }) : null}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.mobile_no._root.focus(); }}
                                            />
                                        </Item>
                                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Password</Label>

                                        <Item style={[styles.authTransparentLabel1, { marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }]}>
                                            <Input placeholder="Password" style={{ fontSize: 15, paddingLeft: 15, }}
                                                ref={(input) => { this.mobile_no = input; }}
                                                returnKeyType={'next'}
                                                value={password}
                                                secureTextEntry={showPassword}
                                                keyboardType={'default'}
                                                onChangeText={password => this.onPasswordTextChanged(password)}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.userPassword._root.focus(); }}
                                            // maxLength={16}
                                            />
                                            {showPassword == true ? <Icon active name='eye' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                                                : <Icon active name='eye-off' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                                            }
                                        </Item>

                                        <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Referral Code</Label>
                                        <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Input placeholder="Referral Code (Optional)" style={styles.authTransparentLabel}
                                                ref={(input) => { this.userPassword = input; }}
                                                returnKeyType={'done'}
                                                keyboardType={'default'}
                                                autoCapitalize={'characters'}
                                                value={referralCode}
                                                onChangeText={referralCode => this.setState({ referralCode })}
                                            />
                                        </Item>


                                        <View style={{ marginTop: 10, borderBottomWidth: 0, flexDirection: 'row' }}>

                                            <RadioButton.Group
                                                onValueChange={value => this.setState({ gender: value })}
                                                value={gender}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <RadioButton value="M" />
                                                    <Text style={{
                                                        fontFamily: 'OpenSans', fontSize: 15, marginTop: 8
                                                    }}>Male</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                                    <RadioButton value="F" />
                                                    <Text style={{
                                                        fontFamily: 'OpenSans', fontSize: 15, marginTop: 8
                                                    }}>Female</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                                    <RadioButton value="O" />
                                                    <Text style={{
                                                        fontFamily: 'OpenSans', fontSize: 15, marginTop: 8
                                                    }}>Others</Text>
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <Item style={{ borderBottomWidth: 0, marginTop: 5,marginLeft:-1}}>
                                            <Checkbox color="#775DA3"
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked: !checked }); }}
                                            />
                                            <Text style={{ color: 'gray', fontFamily: 'OpenSans', fontSize: 12, }}>I Accept the Medflic </Text>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('termsAndConditions')}>
                                                <Text style={{ color: '#5055d7', fontFamily: 'OpenSans', fontSize: 13, }}>Terms And Conditions</Text>
                                            </TouchableOpacity>
                                        </Item>
                                        <Spinner color='blue'
                                            visible={isLoading}
                                            textContent={'Loading...'}
                                        />
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                            <TouchableOpacity small
                                                style={(mobile_no && password) == '' ? styles.loginButton1Disable : styles.loginButton1}
                                                block success disabled={(mobile_no && password) == ''} onPress={() => this.doSignUp()}>
                                                <Text uppercase={true} style={styles.ButtonText}>Sign Up</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans' }}>{errorMsg} </Text>
                                        </View>
                                    </Form>
                                </View>
                                <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10 }}>
                                    <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans', color: '#775DA3' }}>Already Have An Account ?</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
                                        <Text uppercase={true} style={{ color: '#fff', fontSize: 10, fontFamily: 'OpenSans', fontWeight: 'bold' }}>Sign In</Text>
                                    </TouchableOpacity>
                                </Item>
                            </Card>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>
        )
    }
}

function signUpState(state) {
    return {
        user: state.user
    }
}
export default connect(signUpState)(Signup)

