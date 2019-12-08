import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon, Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast, Card, Label
} from 'native-base';
import { signUp } from '../../providers/auth/auth.actions';
import { validateEmailAddress } from '../../common';
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
            userEmail: '',
            password: '',
            gender: 'M',
            radioStatus: [true, false, false],
            errorMsg: '',
            checked: false,
            showPassword: true,
            isLoading: false
        }
    }
    toggleRadio = async (radioSelect, genderSelect) => {
        let tempArray = [false, false, false];
        tempArray[radioSelect] = true;
        await this.setState({ radioStatus: tempArray, gender: genderSelect });
    }
    doSignUp = async () => {
        const { userEmail, password, checked, gender } = this.state;
        try {
            if (checked === false) {
                this.setState({ errorMsg: 'Please agree to the terms and conditions to continue' });
                return false;
            }
            if (validateEmailAddress(userEmail) == false) {
                this.setState({ errorMsg: 'Please enter the valid Email address' })
                return false;
            }
            this.setState({ errorMsg: '', isLoading: true });
            let requestData = {
                email: userEmail,
                password: password,
                gender: gender,
                type: 'user'
            };
            await signUp(requestData);        // Do SignUp Process
            if (this.props.user.success) {
                let loginData = {
                    userEntry: userEmail,
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

    render() {
        const { user: { isLoading } } = this.props;
        const { userEmail, password, showPassword, checked, gender, errorMsg } = this.state;
        return (
            <Container style={styles.container}>
                <ImageBackground source={mainBg} style={{ width: '100%', height: '100%' }}>
                    <Content contentContainerStyle={styles.authBodyContent}>
                        <View >
                            <Text style={[styles.signUpHead, { color: '#fff' }]}>List Your Practice to Reach millions of Peoples</Text>
                            <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>
                                <View style={{ marginLeft: 10, marginRight: 10 }}>
                                    <Text uppercase={true} style={[styles.cardHead, { color: '#775DA3' }]}>Signup</Text>
                                    <Form>
                                        <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>Email / Phone</Label>
                                        <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Input placeholder="Email Or Phone" style={styles.authTransparentLabel}
                                                returnKeyType={'next'}
                                                keyboardType={'email-address'}
                                                value={userEmail}
                                                onChangeText={userEmail => this.setState({ userEmail })}
                                                blurOnSubmit={false}
                                                onSubmitEditing={() => { this.userEmail._root.focus(); }}
                                            />
                                        </Item>
                                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Password</Label>

                                        <Item style={[styles.authTransparentLabel1, { marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }]}>
                                            <Input placeholder="Password" style={{ fontSize: 15, paddingLeft: 15, }}
                                                ref={(input) => { this.userEmail = input; }}
                                                returnKeyType={'done'}
                                                value={password}
                                                secureTextEntry={showPassword}
                                                keyboardType={'default'}
                                                onChangeText={password => this.setState({ password })}
                                                // blurOnSubmit={false}
                                                maxLength={16} />

                                            {showPassword == true ? <Icon active name='eye' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                                                : <Icon active name='eye-off' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                                            }
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
                                        <Item style={{ borderBottomWidth: 0, marginTop: 5, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <Checkbox color="#775DA3"
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked: !checked }); }}
                                            />
                                            <Text style={{ marginLeft: 2, color: 'gray', fontFamily: 'OpenSans', fontSize: 13, }}>I Accept the Medflic Terms And Conditions</Text>
                                        </Item>
                                        <Spinner color='blue'
                                            visible={isLoading}
                                            textContent={'Loading...'}
                                        />
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                            <TouchableOpacity small
                                                style={(userEmail && password) == '' ? styles.loginButton1Disable : styles.loginButton1}
                                                block success disabled={(userEmail && password) == ''} onPress={() => this.doSignUp()}>
                                                <Text uppercase={true} style={styles.ButtonText}>Sign Up</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans' }}>{errorMsg} </Text>
                                        </View>
                                    </Form>
                                </View>
                                <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10 }}>
                                    <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans', color: '#775DA3' }}>Already Have An Account ?</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
                                        <Text uppercase={true} style={{ color: '#fff', fontSize: 10, fontFamily: 'OpenSans', fontWeight: 'bold' }}>SignIn</Text>
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

