import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Button, Text, Toast, Content, Container } from 'native-base';
import { connect } from 'react-redux';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import { signUp, login, verifyOtpCodeForCreateAccount } from '../../providers/auth/auth.actions';
import Spinner from '../../../components/Spinner'

class RenderOtpInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            requestData: {},
            errorMsg: '',
            isLoading: false
        };
    }
    async componentDidMount() {
        let requestData = this.props.navigation.getParam("requestData")
        await this.setState({ requestData })
        console.log('requestData::::::::::::::' + JSON.stringify(requestData))
    }

    getEnteredOtpCode = async (otp) => {
        await this.setState({ otp });
        if (this.state.otp.length == 6)
            this.verifyOtpCode();
    }

    /*  verify Email using Entered OTP Code   */
    verifyOtpCode = async () => {
        const { requestData, otp } = this.state;
        try {
            this.setState({ isLoading: true });
            let loginData = {
                userEntry: requestData.email,
                password: requestData.password,
                type: 'user'
            };
            let reqVerifyOtpCodeData = {
                appType: 'user',
                email: requestData.email,
                "otp": otp
            }
            let reqOtpVerifiedResponse = await verifyOtpCodeForCreateAccount(reqVerifyOtpCodeData)
            if (reqOtpVerifiedResponse.success == true) {
                await signUp(requestData);        // Do SignUp Process
                if (!this.props.user.signUpSuccess)
                    // this.setState({ errorMsg: this.props.user.message })
                await login(loginData);  // Do SignIn Process after SignUp is Done
                if (this.props.user.isAuthenticated) {
                    Toast.show({
                        text: requestData.email + "  Email details successfully verified",
                        type: "success",
                        duration: 4000
                    });
                    this.props.navigation.navigate('userdetails');
                } else {
                    this.setState({ errorMsg: this.props.user.message })
                }
            }
            else {
                this.setState({ errorMsg: reqOtpVerifiedResponse.error })
            }
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMsg: '' });
            }, 3000);
            this.setState({ isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }

    render() {
        const { otp, requestData, isLoading, errorMsg } = this.state;

        return (
            <Container>
                <Spinner
                    visible={isLoading}
                    textContent={'Please Wait Loading....'}
                />
                <Content padder style={{ backgroundColor: '#fff' }}>
                    <View style={styles.container}>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans', fontSize: 20 }}>VERIFY DETAILS</Text>
                        <Text style={{ color: 'gray', fontSize: 15 }}>OTP sent to {requestData.email}</Text>
                        <Text style={{ marginTop: 10, fontSize: 13 }}>Enter OTP</Text>
                        <OtpInputs getOtp={(otp) => this.getEnteredOtpCode(otp)} />
                        <Button
                            style={otp.length != 6 ? styles.loginButtonDisable : styles.loginButton}
                            block success disabled={otp.length != 6} onPress={() => this.verifyOtpCode()}>
                            {otp.length != 6 ? <Text style={styles.ButtonText}>Enter OTP</Text> : <Text style={styles.ButtonText}>Verify OTP</Text>}
                        </Button>
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{errorMsg}</Text>
                    </View>
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
        backgroundColor: '#775DA3',
        marginLeft: 15,
        borderRadius: 5,
    },
    loginButtonDisable: {
        marginTop: 20,
        backgroundColor: '#9777c7',
        marginLeft: 15,
        borderRadius: 5,
    },
});

function RenderOtpInputState(state) {
    return {
        user: state.user
    }
}
export default connect(RenderOtpInputState)(RenderOtpInput)
