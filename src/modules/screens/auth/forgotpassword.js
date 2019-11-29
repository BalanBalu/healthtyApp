import React, { Component } from 'react';
import { View, Container, Content, Button, Text, Form, Item, Input, Footer, FooterTab, H3, Toast, Icon, Spinner } from 'native-base';
import { generateOTP, changePassword, LOGOUT } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { StyleSheet, Image } from 'react-native'
import styles from '../../screens/auth/styles';
import { store } from '../../../setup/store';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce, validateEmailAddress } from '../../common';

class Forgotpassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otpCode: '',
            type: '',
            password: '',
            isOTPGenerated: false,
            errorMessage: '',
            userEntry: '',
            showPassword: true,
            isPasswordMatch:false
        }
        this.checkMatchPasswords = debounce(this.checkMatchPasswords, 500);
    }
    checkEnteredPasswords = async (confirmPassword) => {
        await this.setState({ confirmPassword: confirmPassword });
        this.checkMatchPasswords();
    }
    checkMatchPasswords = async () => {   // Check Entered the Both Password Match Or Not
        const { password, confirmPassword } = this.state;
        if (password == confirmPassword) await this.setState({ isPasswordMatch: true })
        else await this.setState({ isPasswordMatch: false })
    }

    /*  Generate OTP Code for Reset Password   */
    generateOtpCode = async () => {
        const { userEntry } = this.state;
        try {
            let reqData = {
                userEntry: userEntry,
                type: 'user'
            };
            if (validateEmailAddress(userEntry) == true) {
                this.setState({ isLoading: true })
                let reqOtpResponse = await generateOTP(reqData)
                console.log('reqOtpResponse::::' + JSON.stringify(reqOtpResponse))
                if (reqOtpResponse.success == true)
                    await this.setState({ isOTPGenerated: true });
                else
                    this.setState({ errorMessage: reqOtpResponse.error });
            }
            else {
                this.setState({ errorMessage: 'Email address is not valid' });
            }
            this.setState({ isLoading: false })
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMessage: '' });
            }, 3000);
        }
        catch (e) {
            this.setState({ isLoading: false })
            console.log(e);
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }
    
    /*  Change the New Password using Generated OTP Code  */
    changePassword = async () => {
        const { otpCode, password, isPasswordMatch } = this.state;
        try {
            let reqData = {
                userId: this.props.user.userId,
                otp: otpCode,
                password: password,
                type: 'user'
            };
            if (isPasswordMatch == true) {
                this.setState({ isLoading: true })
                let reqOtpVerifyResponse = await changePassword(reqData);
                if (reqOtpVerifyResponse.success === true) {
                    Toast.show({
                        text: reqOtpVerifyResponse.message,
                        type: "success",
                        duration: 3000
                    })
                    this.props.navigation.navigate('login');
                }
                else {
                    this.setState({ errorMessage: reqOtpVerifyResponse.error });
                }
            } else {
                this.setState({ errorMessage: 'Passwords do not match' });
            }
            this.setState({ isLoading: false })
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMessage: '' });
            }, 3000);
        } catch (e) {
            console.log(e);
            this.setState({ isLoading: false })
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }

    renderEnterEmail() {
        const { user: { isLoading } } = this.props;
        const { userEntry } = this.state;

        return (
            <View>
                <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="Enter your email" style={styles.transparentLabel2}
                        value={userEntry}
                        keyboardType={'email-address'}
                        onChangeText={userEntry => this.setState({ userEntry })}
                        onSubmitEditing={() => { userEntry!==''?this.generateOtpCode():null }}
                    />
                </Item>
                {isLoading ? <Spinner color='blue' /> : null}
                <Button
                    style={userEntry == '' ? styles.loginButtonDisable : styles.loginButton}
                    block success disabled={userEntry == ''} onPress={() => this.generateOtpCode()}>
                    <Text style={styles.ButtonText}>Generate OTP</Text>
                </Button>
            </View>
        )
    }
    renderAfterOtpGenerated() {
        const { user: { isLoading } } = this.props;
        const { otpCode, password, confirmPassword } = this.state;

        return (
            <View>
                <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="Enter your OTP" style={styles.transparentLabel2}
                        keyboardType="numeric"
                        value={otpCode}
                        onChangeText={otpCode => this.setState({ otpCode })}
                        returnKeyType={'next'}
                        onSubmitEditing={() => { this.enterOtpTextInput._root.focus(); }}
                        blurOnSubmit={false}
                    />
                </Item>

                <Item success style={styles.transparentLabel3}>
                    <Input placeholder="Enter new password" style={{ fontSize: 15, paddingLeft: 20, }}
                        ref={(input) => { this.enterOtpTextInput = input; }}
                        secureTextEntry={this.state.showPassword}
                        returnKeyType={'go'}
                        value={password}
                        onChangeText={password => this.setState({ password })}
                        onSubmitEditing={() => { this.enterNewPassTextInput._root.focus(); }}
                    />
                    {password.length >= 6 ? <Icon active name='ios-checkmark' style={{ fontSize: 34 }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
                </Item>
                <Item success style={styles.transparentLabel3}>
                    <Input placeholder="Retype new password" style={{ fontSize: 15, paddingLeft: 20, }}
                        ref={(input) => { this.enterNewPassTextInput = input; }}
                        secureTextEntry={this.state.showPassword}
                        returnKeyType={'go'}
                        value={confirmPassword}
                        onChangeText={confirmPassword => this.checkEnteredPasswords(confirmPassword)}
                        onSubmitEditing={() => { this.changePassword() }}
                    />
                    {this.state.isPasswordMatch == true ? <Icon active name='ios-checkmark' style={{ fontSize: 34 }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
                </Item>
                {isLoading ? <Spinner color='blue' /> : null}
                <Button
                    style={(otpCode && password && confirmPassword) == '' ? styles.loginButtonDisable : styles.loginButton}
                    block success disabled={(otpCode && password && confirmPassword) == ''} onPress={() => this.changePassword()}>
                    <Text style={styles.ButtonText}>Reset Password</Text>
                </Button>
            </View>
        )
    }
    render() {
        const { user: { message } } = this.props;
        const { errorMessage, isOTPGenerated } = this.state;

        return (
            <Container style={styles.container}>
                <Content contentContainerStyle={styles.bodyContent}>
                    <ScrollView>
                        <View >
                            <Text style={styles.welcome}>Forgot Password</Text>
                            <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />

                            <Form>
                                {/* <View style={styles.errorMessage}>
                         <Text style={{textAlign:'center',color:'#775DA3'}}> Invalid Credentials</Text>
                  </View>                */}
                                {isOTPGenerated == true ? this.renderAfterOtpGenerated() : this.renderEnterEmail()}
                            </Form>
                            <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMessage}</Text>
                        </View>
                    </ScrollView>
                </Content>

                <Footer >
                    <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
                        <Button full onPress={() => this.props.navigation.navigate('login')}>
                            <Text uppercase={false} style={{
                                color: '#000', fontSize: 15, fontFamily: 'OpenSans',
                            }}>Go Back To SignIn</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

function forgotpasswordState(state) {
    return {
        user: state.user
    }
}
export default connect(forgotpasswordState)(Forgotpassword)

