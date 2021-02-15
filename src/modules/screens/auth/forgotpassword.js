import React, { Component } from 'react';
import { View, Container, Content, Button, Text, Form, Item, Input, Card, Footer, FooterTab, Toast, Icon, Label, Row, Col, Radio } from 'native-base';
import { generateOTP, generateOTPForSmartHealth, changePassword, changePasswordForSmartHelath } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native'
import styles from '../../screens/auth/styles';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce, validateEmailAddress, acceptNumbersOnly } from '../../common';
import Spinner from '../../../components/Spinner';
import OTPTextInput from 'react-native-otp-textinput';
import { CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from "../../../setup/config";
const mainBg = require('../../../../assets/images/MainBg.jpg')

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
            isPasswordMatch: false,
            isCorporateUserSelected: false,
            corporateName: '',
            employeeId: '',

        }
        this.smartHealthOtpData = null
        this.checkMatchPasswords = debounce(this.checkMatchPasswords, 500);
    }
    checkEnteredPasswords = async (confirmPassword) => {
        this.setState({ confirmPassword: confirmPassword.replace(/\s/g, "") });
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

            await this.setState({ errorMessage: '', isLoading: true })
            if (this.state.isCorporateUserSelected && CURRENT_APP_NAME === MY_SMART_HEALTH_CARE) {
                let reqObject = {
                    userId: userEntry,
                    employeeId: this.state.employeeId,
                    corporate: this.state.corporateName
                }
                let smartHealthReqOtpResponse = await generateOTPForSmartHealth(reqObject)
      
                if (smartHealthReqOtpResponse && smartHealthReqOtpResponse.otp) {
                    this.smartHealthOtpData = smartHealthReqOtpResponse
                   
                    await this.setState({ isOTPGenerated: true });
                } else {
                    this.setState({ errorMessage: smartHealthReqOtpResponse.message==='INVALID_CORPORATE'?'Entered corporate name is incorrect':smartHealthReqOtpResponse.message==='INVALID_USERID'?'Entered Email name is incorrect':smartHealthReqOtpResponse.message==='INVALID_EMPLOYEEID'?'Entered Employee id is incorrect':'Invalid credentials'});
                }
            } else {
                let reqData = {
                    userEntry: userEntry,
                    type: 'user'
                };
                if (this.state.isCorporateUserSelected) {
                    reqData.is_corporate_user = true
                }
                let reqOtpResponse = await generateOTP(reqData)

                if (reqOtpResponse.success == true)
                    await this.setState({ isOTPGenerated: true });
                else
                    this.setState({ errorMessage: reqOtpResponse.error });
            }
        }
        catch (e) {

            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
        finally {
            this.setState({ isLoading: false })
        }
    }

    /*  Change the New Password using Generated OTP Code  */
    changePassword = async () => {
        const { otpCode, password, isPasswordMatch } = this.state;
        try {
            if (isPasswordMatch != true) {
                this.setState({ errorMessage: 'Passwords do not match' });
                return false;
            }
            await this.setState({ errorMessage: '', isLoading: true })
            let reqOtpVerifyResponse = {};
            if (CURRENT_APP_NAME === MY_SMART_HEALTH_CARE && this.state.isCorporateUserSelected) {
                if (this.smartHealthOtpData) {
                    let reqDataObj = {
                        userId: this.smartHealthOtpData.userId,
                        otp: otpCode,
                        newPassword: password,
                        userType: 'MEMBER'
                    };
                    let result = await changePasswordForSmartHelath(reqDataObj);

                    if (result === 'SUCCESS') {
                        reqOtpVerifyResponse.success = true,
                            reqOtpVerifyResponse.message = "password changed successfully"
                    } else {
                        reqOtpVerifyResponse.error = "invalid otp"
                    }
                }
            } else {

                let reqData = {
                    userId: this.props.user.userId,
                    otp: otpCode,
                    password: password,
                    type: 'user'
                };
                reqOtpVerifyResponse = await changePassword(reqData);
            }

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
        } catch (e) {
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 4000
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
    onChangeRemoveSpaces(value) {
        // code to remove White Spaces from text field
        this.setState({ userEntry: value.replace(/\s/g, "") });
    }
    renderEnterEmail() {
        const { user: { isLoading } } = this.props;
        const { userEntry, isCorporateUserSelected } = this.state;
        return (
            <View>
                {isCorporateUserSelected === false ?
                    <View>
                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Email / Phone</Label>
                        <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                            <Input placeholder="Email Or Phone" style={styles.transparentLabel2}
                                value={userEntry}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                onChangeText={userEntry => this.onChangeRemoveSpaces(userEntry)}
                                onSubmitEditing={() => { userEntry !== '' ? this.generateOtpCode() : null }}
                            />
                        </Item>
                    </View> :


                    <View>
                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Email </Label>

                        <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                            <Input placeholder="Email" style={styles.transparentLabel2}
                                value={userEntry}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                onChangeText={userEntry => this.onChangeRemoveSpaces(userEntry)}
                                onSubmitEditing={() => { this.employeeId._root.focus(); }}
                            // onSubmitEditing={() => { userEntry !== '' ? this.generateOtpCode() : null }}
                            />
                        </Item>
                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Employee Id</Label>
                        <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                            <Input placeholder="Employee Id" style={styles.transparentLabel2}
                                value={this.state.employeeId}
                                autoCapitalize={false}
                                ref={(input) => { this.employeeId = input; }}
                                keyboardType={'email-address'}
                                onChangeText={employeeId => this.setState({ employeeId: employeeId.replace(/\s/g, "") })}
                                onSubmitEditing={() => { this.corporateName._root.focus(); }}
                            // onSubmitEditing={() => { userEntry !== '' ? this.generateOtpCode() : null }}
                            />
                        </Item>
                        <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Corporate Name</Label>
                        <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                            <Input placeholder="Corporate Name" style={styles.transparentLabel2}
                                ref={(input) => { this.corporateName = input; }}
                                value={this.state.corporateName}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                onChangeText={corporateName => this.setState({ corporateName: corporateName })}
                                onSubmitEditing={() => { corporateName !== '' ? this.generateOtpCode() : null }}
                            />
                        </Item>
                    </View>

                }
                {CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ?
                    <Row style={{ marginTop: 10 }}>
                        <Col size={3}>
                            <Row style={{ alignItems: 'center' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={isCorporateUserSelected === false}
                                    onPress={() => this.setState({ isCorporateUserSelected: false })}
                                />
                                <Text style={styles.firstCheckBox}>User</Text>
                            </Row>
                        </Col>
                        <Col size={3}>
                            <Row style={{ alignItems: 'center' }}>
                                <Radio
                                    standardStyle={true}
                                    selected={isCorporateUserSelected === true}
                                    onPress={() => this.setState({ isCorporateUserSelected: true })}
                                />
                                <Text style={styles.firstCheckBox}>Corporate</Text>
                            </Row>
                        </Col>
                        <Col size={4}>
                        </Col>
                    </Row> : null}
                {isLoading ?
                    <Spinner
                        visible={isLoading}
                    /> : null}
                <Button
                    style={userEntry == '' ? styles.forgotButtonDisable : styles.forgotButton}
                    block success disabled={userEntry == ''} onPress={() => this.generateOtpCode()}>
                    <Text style={styles.ButtonText}>Generate OTP</Text>
                </Button>
            </View>
        )
    }
    renderAfterOtpGenerated() {
        const { user: { isLoading } } = this.props;
        const { otpCode, password, confirmPassword, showPassword, isPasswordMatch } = this.state;
        return (
            <View>
                <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>OTP</Label>
                <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
                    <OTPTextInput
                        ref={e => (this.otpInput = e)}
                        inputCount={6}
                        tintColor={'#775DA3'}
                        inputCellLength={1}
                        containerStyle={{
                            marginLeft: -1,
                        }}
                        textInputStyle={{
                            width: 38,
                            fontWeight: 'bold'
                        }}
                        handleTextChange={(otpCode) => acceptNumbersOnly(otpCode) == true || otpCode === '' ? this.setState({ otpCode }) : null}
                    />
                </Item>
                <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Password</Label>

                <Item style={styles.authTransparentLabel}>
                    <Input placeholder="Enter new password" style={{ fontSize: 15 }}
                        ref={(input) => { this.enterOtpTextInput = input; }}
                        secureTextEntry={this.state.showPassword}
                        returnKeyType={'go'}
                        value={password}
                        onChangeText={password => this.onPasswordTextChanged(password)}
                        onSubmitEditing={() => { this.enterNewPassTextInput._root.focus(); }}
                    />
                    {password.length >= 6 ? <Icon active name='ios-checkmark' style={{ fontSize: 34, color: '#329932' }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
                </Item>
                <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Conform Password</Label>

                <Item style={styles.authTransparentLabel}>
                    <Input placeholder="Retype new password" style={{ fontSize: 15 }}
                        ref={(input) => { this.enterNewPassTextInput = input; }}
                        secureTextEntry={showPassword}
                        returnKeyType={'go'}
                        value={confirmPassword}
                        onChangeText={confirmPassword => this.checkEnteredPasswords(confirmPassword)}
                        onSubmitEditing={() => { this.changePassword() }}
                    />
                    {isPasswordMatch == true ? <Icon active name='ios-checkmark' style={{ fontSize: 34, color: '#329932' }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
                </Item>
                {isLoading ?
                    <Spinner
                        visible={isLoading}
                    /> : null}
                <Button
                    style={(otpCode && password && confirmPassword) == '' ? styles.forgotButtonDisable : styles.forgotButton}
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
                <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
                    <Content contentContainerStyle={styles.authBodyContent}>
                        <ScrollView>
                            <Text style={[styles.welcome, { color: '#fff' }]}>Forgot Password</Text>
                            <Card style={{ borderRadius: 10, padding: 5, marginTop: 20, paddingTop: 5, paddingBottom: 5 }}>
                                <View style={{ marginLeft: 10, marginRight: 10 }}>
                                    <Form>
                                        {isOTPGenerated == true ? this.renderAfterOtpGenerated() : this.renderEnterEmail()}
                                    </Form>
                                </View>
                                <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10, marginTop: 10 }}>
                                    <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans', color: '#775DA3' }}>Go Back To</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
                                        <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#fff' }}> SignIn</Text>
                                    </TouchableOpacity>
                                </Item>
                                <Text style={{ color: 'red', marginLeft: 20, marginTop: 15 }}>{errorMessage}</Text>
                            </Card>
                        </ScrollView>
                    </Content>
                </ImageBackground>
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

