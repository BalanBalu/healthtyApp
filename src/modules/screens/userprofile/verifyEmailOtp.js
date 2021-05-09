import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Button, Text, Toast, Content, Container, Row, Left, Right, Card, Item } from 'native-base';
import { connect } from 'react-redux';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import { serviceOfGenerateOtp4UpdateMemberEmail, serviceOfVerifyOtpCode4UpdateEmail } from '../../providers/corporate/corporate.actions';
import Spinner from '../../../components/Spinner';
import { primaryColor } from '../../../setup/config';
import {  logout } from '../../providers/auth/auth.actions';


class RenderEmailOtpInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            emailId: null,
            _id: null,
            errorMsg: '',
            isVerifyingEmail: false,
            isGeneratedOtp: false,
            isLoading: false,
            verifyData: ''
        };
    }
    async componentDidMount() {
        const requestData = this.props.navigation.getParam("requestData");
        await this.setState({ emailId: requestData && requestData.emailId || null, _id: requestData && requestData._id || null });
        await this.generateOtpCode();
        this.setState({ isLoading: false });
    }

    getEnteredOtpCode = async (otp) => {
        await this.setState({ otp });
        if (this.state.otp.length === 4)
            this.verifyOtpCode();
    }
    /*  Generate OTP code for Member email update */
    generateOtpCode = async () => {
        const { emailId, _id } = this.state;
        try {
            this.setState({ errorMsg: '', isLoading: true })
            let reqDataForGenerateOtpCode = {
                _id,
                emailId
            }
            // let isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
            const reqOtpResponse = await serviceOfGenerateOtp4UpdateMemberEmail(reqDataForGenerateOtpCode)
            if (reqOtpResponse && reqOtpResponse.otp) {
                await this.setState({ isGeneratedOtp: true, reqOtpResponseObject: reqOtpResponse });
            } else {
                this.setState({ errorMsg: "Something Went Wrong   Go Back to Profile Page", reqOtpResponseObject: reqOtpResponse })
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
        const { _id, emailId, otp } = this.state;
        try {
            this.setState({ isVerifyingEmail: true, isLoading: true, errorMsg: '' });
            const reqDataForVerifyOtpCode = {
                _id,
                emailId,
                otp,
                userType: "MEMBER"
            }
            const reqOtpVerifiedResponse = await serviceOfVerifyOtpCode4UpdateEmail(reqDataForVerifyOtpCode)
            if (reqOtpVerifiedResponse === "SUCCESS") {
                Toast.show({
                    text: "Email updated successfully",
                    type: "success",
                    duration: 4000
                });
                await logout();
                this.props.navigation.navigate('login');
            }
            else if (reqOtpVerifiedResponse === "INVALID") {
                this.setState({ errorMsg: "OTP is Invalid" })
            }
            else {
                this.setState({ errorMsg: "Something Went Wrong" })
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



    render() {
        const { otp, emailId,  isVerifyingEmail, isGeneratedOtp,  isLoading, errorMsg } = this.state;

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
                                <Text style={{ color: 'black', fontFamily: 'Roboto', fontSize: 20 }}>VERIFY DETAILS</Text>
                            </Left>
                        </Row>
                        {isGeneratedOtp == true ? <Text style={{ color: 'gray', fontSize: 15 }}>{`OTP is successfully sent to ${emailId}`}</Text> : <Text style={{ color: 'gray', fontSize: 15 }}>OTP couldn't sent to {emailId} Please Contact Our @Support_Team!</Text>}
                        <Text style={{ marginTop: 10, fontSize: 13 }}>Enter OTP</Text>
                        <OtpInputs noOfDigits={4} getOtp={(otp) => this.getEnteredOtpCode(otp)} />
                        {/* <TouchableOpacity onPress={() => this.generateOtpCode()}>
                            <Text style={{ color: '#1caed6', marginLeft: 10, fontSize: 13, textAlign: 'right' }}>RESEND OTP</Text>
                        </TouchableOpacity> */}
                        <Button
                            style={otp.length != 4 ? styles.loginButtonDisable : styles.loginButton}
                            block success disabled={otp.length != 4} onPress={() => this.verifyOtpCode()}>
                            {otp.length != 4 ? <Text style={styles.ButtonText}>Enter OTP</Text> : <Text style={styles.ButtonText}>Verify OTP</Text>}
                        </Button>
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMsg}</Text>
                    </View>
                    {/* <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10, marginTop: 10 }}>
                        <Text uppercase={false} style={{ color: '#000', fontSize: 16, fontFamily: 'Roboto', color: primaryColor }}>Go Back To</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignInButton}>
                            <Text uppercase={true} style={{ color: '#000', fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: '#fff' }}> Sign In</Text>
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
        backgroundColor: primaryColor,
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
export default connect(RenderOtpInputState)(RenderEmailOtpInput)
