import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Button, Text, Toast, Content, Container, Row, Left, Right, Card, Item } from 'native-base';
import { connect } from 'react-redux';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import { login, generateOtpCodeForCreateAccount, verifyOtpCodeForCreateAccount, generateOtpForEmailAndMobile, verifyOtpForEmailAndMobileNo } from '../../providers/auth/auth.actions';
import Spinner from '../../../components/Spinner';
import {primaryColor} from '../../../setup/config'

class RenderOtpInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            requestData: {},
            errorMsg: '',
            isVerifyingEmail: false,
            isGeneratedOtp: false,
            isLoading: false,
            verifyData:''
        };
    }
    async componentDidMount() {
        const loginData = this.props.navigation.getParam("loginData");
        const fromProfile = this.props.navigation.getParam('fromProfile') || false
        const verifyData = this.props.navigation.getParam("verifyData")||null
        if (fromProfile) {
            this.setState({ fromProfile: true, verifyData })
        }
        // this.setState({ isLoading: true });
   
        if(loginData.userEntry  === null && this.props.user && this.props.user.details) {
            loginData.userEntry = this.props.user.details.email
        }
    
        let requestData = {
            appType: 'user',
            userEntry: loginData.userEntry 
        }
        
        await this.setState({ requestData });
        await this.generateOtpCode();
        this.setState({ isLoading: false });
    }

    getEnteredOtpCode = async (otp) => {
        await this.setState({ otp });
        if (this.state.otp.length === 6)
            this.verifyOtpCode();
    }
    /*  Generate OTP code for Created Account  */
    generateOtpCode = async () => {
        const { requestData } = this.state;
        try {
            let reqOtpResponse;
            let userId = await AsyncStorage.getItem('userId');
            this.setState({ errorMsg: '', isLoading: true })
            let reqDataForGenerateOtpCode = {
                appType: 'user',
                userEntry: requestData.userEntry
            }
            let isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
            if(isCorporateUser) {
                reqDataForGenerateOtpCode.is_corporate_user = true;
            }
            if (this.state.fromProfile) {
            
                reqOtpResponse = await generateOtpForEmailAndMobile(reqDataForGenerateOtpCode, userId)
            } else {
                reqOtpResponse = await generateOtpCodeForCreateAccount(reqDataForGenerateOtpCode) //  Generate OTP code for Create DR medflic Account
            }
            if (reqOtpResponse.success == true) {
            
                await this.setState({ isGeneratedOtp: true, reqOtpResponseObject: reqOtpResponse });
            } else {
                this.setState({ errorMsg: JSON.stringify(reqOtpResponse.error) + "  Go Back to Sign In Page", reqOtpResponseObject: reqOtpResponse })
            }
        } catch (e) {
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    /*  verify Email using Entered OTP Code   */
    verifyOtpCode = async () => {
        const { otp, reqOtpResponseObject } = this.state;
        try {
            this.setState({ isVerifyingEmail: true, isLoading: true, errorMsg: '' });
            let reqDataForVerifyOtpCode, reqOtpVerifiedResponse;
            let userId = await AsyncStorage.getItem('userId');

            if (this.state.fromProfile) {
                if (this.state.verifyData){
                    reqDataForVerifyOtpCode = {
                        appType: 'user',
                        userId: userId,
                        "otp": otp,
                        verifyData: 'mobileNo'
                    } 
                }
                else{
                    reqDataForVerifyOtpCode = {
                    appType: 'user',
                    userId: userId,
                    "otp": otp,
                    verifyData: 'email'
                }
            }
                reqOtpVerifiedResponse = await verifyOtpForEmailAndMobileNo(reqDataForVerifyOtpCode)

            } else {
                reqDataForVerifyOtpCode = {
                    appType: 'user',
                    userId: reqOtpResponseObject.userId,
                    "otp": otp
                }

                reqOtpVerifiedResponse = await verifyOtpCodeForCreateAccount(reqDataForVerifyOtpCode)
            }

            if (reqOtpVerifiedResponse.success == true) {
                Toast.show({
                    text: reqOtpVerifiedResponse.message,
                    type: "success",
                    duration: 4000
                });
                if (this.props.navigation.getParam("navigateBackToHome") || (this.state.verifyData == 'mobileNo')) {
                    this.props.navigation.navigate('Home');
                }
                else if(this.state.fromProfile){
                    this.props.navigation.navigate('Profile');

                } else {
                    this.doLoginAndContinueBasicDetailsUpdate();
                }
            }
            else {
                this.setState({ errorMsg: reqOtpVerifiedResponse.error, isLoading: false })
            }
        } catch (e) {
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    async doLoginAndContinueBasicDetailsUpdate() {
        try {
            this.setState({ isLoading: true });
            const loginData = this.props.navigation.getParam("loginData");
            await login(loginData);  // Do SignIn Process after SignUp is Done
            if (this.props.user.isAuthenticated) {
                this.props.navigation.navigate('userdetails');
            }
            else {
                this.setState({ errorMsg: this.props.user.message });
            }
        } catch (error) {
            Toast.show({
                text: 'Something Went Wrong' + error,
                duration: 3000
            })
        } finally {
            this.setState({ isLoading: false });
        }
    }


    render() {
        const { otp, requestData, isVerifyingEmail, isGeneratedOtp, reqOtpResponseObject, isLoading, errorMsg } = this.state;

        return (
            <Container>
                {isVerifyingEmail == true ? <Spinner
                    visible={isLoading}
                /> : <Spinner
                        visible={isLoading}
                    />}
                <Content padder style={{ backgroundColor: '#fff' }}>
                    <View style={styles.container}>
                        <Row>
                            <Left>
                                <Text style={{ color: 'black', fontFamily: 'OpenSans', fontSize: 20 }}>VERIFY DETAILS</Text>
                            </Left>
                        </Row>
                        {isGeneratedOtp == true ? <Text style={{ color: 'gray', fontSize: 15 }}>{reqOtpResponseObject.message}</Text> : <Text style={{ color: 'gray', fontSize: 15 }}>OTP couldn't sent to {requestData.email} Please Contact Our @Support_Team!</Text>}
                        <Text style={{ marginTop: 10, fontSize: 13 }}>Enter OTP</Text>
                        <OtpInputs getOtp={(otp) => this.getEnteredOtpCode(otp)} />
                        <TouchableOpacity onPress={() => this.generateOtpCode()}>
                            <Text style={{ color: '#1caed6', marginLeft: 10, fontSize: 13, textAlign: 'right' }}>RESEND OTP</Text>
                        </TouchableOpacity>
                        <Button
                            style={otp.length != 6 ? styles.loginButtonDisable : styles.loginButton}
                            block success disabled={otp.length != 6} onPress={() => this.verifyOtpCode()}>
                            {otp.length != 6 ? <Text style={styles.ButtonText}>Enter OTP</Text> : <Text style={styles.ButtonText}>Verify OTP</Text>}
                        </Button>
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMsg}</Text>
                    </View>
                    {/* <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10, marginTop: 10 }}>
                        <Text uppercase={false} style={{ color: '#000', fontSize: 16, fontFamily: 'OpenSans', color: primaryColor }}>Go Back To</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignInButton}>
                            <Text uppercase={true} style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#fff' }}> Sign In</Text>
                        </TouchableOpacity>
                    </Item> */}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
        marginTop: 10
    },
    loginButton: {
        marginTop: 20,
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 5,
    },
    loginButtonDisable: {
        marginTop: 20,
        backgroundColor: '#9777c7',
        marginLeft: 15,
        borderRadius: 5,
    },
    smallSignInButton: {
        backgroundColor: primaryColor,
        marginLeft: 15,
        borderRadius: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingTop: 10
    },
});

function RenderOtpInputState(state) {
    return {
        user: state.user
    }
}
export default connect(RenderOtpInputState)(RenderOtpInput)
