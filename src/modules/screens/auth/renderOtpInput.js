import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Button, Text, Toast, Content, Container, Row, Left, Right } from 'native-base'; import { connect } from 'react-redux';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import { generateOtpCodeForCreateAccount, verifyOtpCodeForCreateAccount } from '../../providers/auth/auth.actions';
import Spinner from '../../../components/Spinner'

class RenderOtpInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            requestData: {},
            errorMsg: '',
            isVerifyingEmail: false,
            isGeneratedOtp: false,
            isLoading: false
        };
    }
    async componentDidMount() {
        let requestData = this.props.navigation.getParam("reqDataForGenerateOtpCode")
        await this.setState({ requestData })
        console.log('requestData::::::::::::::' + JSON.stringify(requestData));
        await this.generateOtpCode();
    }

    getEnteredOtpCode = async (otp) => {
        await this.setState({ otp });
        if (this.state.otp.length == 6)
            this.verifyOtpCode();
    }

    generateOtpCode = async () => {
        const { requestData } = this.state;
        try {
            this.setState({ isLoading: true });
            let reqDataForGenerateOtpCode = {
                appType: 'user',
                email: requestData.email
            }
            let reqOtpResponse = await generateOtpCodeForCreateAccount(reqDataForGenerateOtpCode) //  Generate OTP code for Create DR medflic Account
            if (reqOtpResponse.success == true) {
                await this.setState({ isGeneratedOtp: true });
            } else {
                this.setState({ errorMsg: JSON.stringify(reqOtpResponse.error) + "  Skip to Continue" })
            }
            this.setState({ isLoading: false });
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMsg: '' });
            }, 3000);
        } catch (e) {
            this.setState({ isLoading: false });
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }

    /*  verify Email using Entered OTP Code   */
    verifyOtpCode = async () => {
        const { requestData, otp } = this.state;
        try {
            this.setState({ isVerifyingEmail: true, isLoading: true });
            let reqDataForVerifyOtpCode = {
                appType: 'user',
                userId: requestData.userId,
                "otp": otp
            }
            let reqOtpVerifiedResponse = await verifyOtpCodeForCreateAccount(reqDataForVerifyOtpCode)
            if (reqOtpVerifiedResponse.success == true) {
                Toast.show({
                    text: reqOtpVerifiedResponse.message,
                    type: "success",
                    duration: 4000
                })
                this.props.navigation.navigate('userdetails');
            }
            else {
                this.setState({ errorMsg: reqOtpVerifiedResponse.error })
            }
            this.setState({ isLoading: false,isVerifyingEmail:false });
            setTimeout(async () => {   // set Time out for Disable the Error Messages
                await this.setState({ errorMsg: '' });
            }, 4000);
        } catch (e) {
            this.setState({ isLoading: false });
            Toast.show({
                text: 'Something Went Wrong' + e,
                duration: 3000
            })
        }
    }




    render() {
        const { otp, requestData, isVerifyingEmail, isGeneratedOtp, isLoading, errorMsg } = this.state;

        return (
            <Container>
                {isVerifyingEmail == true ? <Spinner
                    visible={isLoading}
                    textContent={'Please Wait Email is Verifying ....'}
                /> : <Spinner
                        visible={isLoading}
                        textContent={'Generating OTP....'}
                    />}
                <Content padder style={{ backgroundColor: '#fff' }}>
                    <View style={styles.container}>
                        <Row>
                            <Left>
                                <Text style={{ color: 'black', fontFamily: 'OpenSans', fontSize: 20 }}>VERIFY DETAILS</Text>
                            </Left>
                            <Right>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('userdetails')}>
                                    <Text style={{ color: '#6888f2', fontSize: 15, textAlign: 'right' }}>SKIP</Text>
                                </TouchableOpacity>
                            </Right>
                        </Row>
                        {isGeneratedOtp == true ? <Text style={{ color: 'gray', fontSize: 15 }}>OTP sent to {requestData.email}</Text> : <Text style={{ color: 'gray', fontSize: 15 }}>OTP couldn't sent to {requestData.email} Please Contact Our @Support_Team!</Text>}
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
