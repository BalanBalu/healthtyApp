import React, { Component } from 'react';
import {
    Container, Content, Button, Text, Form, Item, Input, Header, Footer,
    FooterTab, Icon, Right, Body, Left, CheckBox, Radio, H3, H2, H1, Toast, Spinner
} from 'native-base';
import { generateOtpCodeForCreateAccount } from '../../providers/auth/auth.actions';
import { validateEmailAddress } from '../../common';
import { connect } from 'react-redux'
import { StyleSheet, Image, View } from 'react-native';
import styles from '../../screens/auth/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton, Checkbox } from 'react-native-paper';

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
    toggleRadio = (radioSelect, genderSelect) => {
        let tempArray = [false, false, false];
        tempArray[radioSelect] = true;
        this.setState({ radioStatus: tempArray });
        this.setState({ gender: genderSelect });
    }

    /*  Generate OTP code for Create DR medflic Account  */
    generateOtpCode = async () => {
        const { userEmail, password, gender } = this.state;
        try {
            this.setState({ isLoading: true });
            let requestData = {
                email: userEmail,
                password: password,
                gender: gender,
                // mobile_no: mobileNum,
                type: 'user'
            };
            let reqGenerateOtpCodeData = {
                appType: 'user',
                email: userEmail
            }
            let reqOtpResponse = await generateOtpCodeForCreateAccount(reqGenerateOtpCodeData)
            if (reqOtpResponse.success == true) {
                this.props.navigation.navigate('renderOtpInput', { requestData: requestData });
            } else {
                this.setState({ errorMsg: reqOtpResponse.error })
            }
            this.setState({ isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false })
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }

    doSignUp = async () => {
        const { userEmail, checked } = this.state;
        try {
            if (checked === true) {
                if (validateEmailAddress(userEmail) == true) this.generateOtpCode()  // Generate OTP code process
                else this.setState({ errorMsg: 'Please enter the valid Email address' })
            } else {
                this.setState({ errorMsg: 'agree to the terms and conditions to continue' })
            }
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMsg: '' });
            }, 3000);
        } catch (e) {
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000,
                type: "danger"
            })
        }
    }

    render() {
        const { user: { isLoading } } = this.props;
        const { userEmail, password, showPassword, checked, errorMsg } = this.state;
        return (

            <Container style={styles.container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        <View >
                            <H3 style={styles.welcome}>List Your Practice to Reach millions of Peoples</H3>
                            <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
                            <Form style={{ marginBottom: 50 }}>
                                <Item style={{ borderBottomWidth: 0, marginTop: 20 }}>
                                    <Input placeholder="Enter your email " style={styles.transparentLabel}
                                        returnKeyType={'next'}
                                        keyboardType={'email-address'}
                                        value={userEmail}
                                        onChangeText={userEmail => this.setState({ userEmail })}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.userEmail._root.focus(); }}
                                    />
                                </Item>

                                <Item success style={styles.transparentLabel1}>
                                    <Input placeholder="Password" style={{ fontSize: 15, paddingLeft: 20, }}
                                        ref={(input) => { this.userEmail = input; }}
                                        returnKeyType={'done'}
                                        value={password}
                                        secureTextEntry={showPassword}
                                        keyboardType={'default'}
                                        onChangeText={password => this.setState({ password })}
                                        // blurOnSubmit={false}
                                        maxLength={16}
                                    />
                                    <Icon active name='eye' style={{ fontSize: 20 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                                </Item>
                                <Item style={{ marginTop: 20, borderBottomWidth: 0, marginLeft: 20 }}>
                                    <RadioButton.Group
                                        onValueChange={value => this.setState({ gender: value })}
                                        value={this.state.gender}>
                                        <RadioButton value="M" />
                                        <Text style={{
                                            marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15
                                        }}>Male</Text>
                                        <RadioButton value="F" />
                                        <Text style={{
                                            marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15
                                        }}>Female</Text>
                                        <RadioButton value="O" />
                                        <Text style={{
                                            marginLeft: 10, fontFamily: 'OpenSans', fontSize: 15
                                        }}>Others</Text>

                                    </RadioButton.Group>
                                </Item>
                                <Item style={{ borderBottomWidth: 0, marginTop: 5, marginLeft: 20 }}>
                                    <Checkbox color="green"
                                        status={checked ? 'checked' : 'unchecked'}
                                        onPress={() => { this.setState({ checked: !checked }); }}
                                    />
                                    <Text style={{ marginLeft: 5, color: 'gray', fontFamily: 'OpenSans', fontSize: 13, }}>I Accept the Medflic Terms And Conditions</Text>
                                </Item>
                                {isLoading ? <Spinner color='blue' /> : null}
                                <Button
                                    style={(userEmail && password) == '' ? styles.loginButtonDisable : styles.loginButton}
                                    block success disabled={(userEmail && password) == ''} onPress={() => this.doSignUp()}>
                                    <Text style={styles.ButtonText}>Sign Up</Text>
                                </Button>
                                <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMsg}</Text>
                            </Form>
                        </View>
                    </ScrollView>
                </Content>
                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans' }}>Already Have An Account ? SignIn</Text>
                        </Button>
                    </FooterTab>
                </Footer>
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

