import React, { Component } from 'react';
import { View, Container, Content, Button, Text, Form, Item, Input, Footer, FooterTab, H3, Toast } from 'native-base';
import { generateOTP, changePassword, LOGOUT } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { StyleSheet, Image } from 'react-native'
import styles from '../../screens/auth/styles';
import { store } from '../../../setup/store';

//import console = require('console');


class Forgotpassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otpCode: '',
            type: '',
            password: '',
            isOTPGenerated: false,
            errorMessage: '',
            userEntry: ''
        }
    }
    requestOTP = async () => {
        try {
            let reqData = {
                userEntry: this.state.userEntry,
                type: 'user'
            };
            await generateOTP(reqData)
            console.log(this.props.user);
            if (this.props.user.isOTPGenerated) {
                this.setState({ isOTPGenerated: true });
                console.log('coming to true for otp generated :' + this.props.user.isOTPGenerated);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    changePassword = async () => {
        try {
            let reqData = {
                userId: this.props.user.userId,
                otp: this.state.otpCode,
                password: this.state.password,
                type: 'user'
            };
            await changePassword(reqData);
            console.log(this.props.user);
            if (this.props.user.isPasswordChanged === true) {
                store.dispatch({
                    type: LOGOUT
                })
                Toast.show({
                    text: this.props.user.message,
                    timeout: 3000
                });
                this.props.navigation.navigate('login');
            }
            else {
                Toast.show({
                    text: this.props.user.message,
                    timeout: 3000
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    renderEnterEmail() {
        const { user: { isLoading } } = this.props;
        return (
            <View>
                <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="Email Or Phone" style={styles.transparentLabel}
                        value={this.state.userEntry}
                        keyboardType={'email-address'}
                        onChangeText={userEntry => this.setState({ userEntry })}
                        autoFocus={true}
                        autoCapitalize='none'
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.requestOTP(); }}
                    />
                </Item>

                <Button style={styles.loginButton} block primary onPress={() => this.requestOTP()}>
                    <Text>Send OTP</Text>
                </Button>
            </View>
        )
    }
    renderAfterOtpGenerated() {
        const { user: { isLoading } } = this.props;
        return (
            <View>
                <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="Enter OTP" style={styles.transparentLabel}
                        keyboardType={'email-address'}
                        autoFocus={true}
                        autoCapitalize='none'
                        value={this.state.otpCode}
                        onChangeText={otpCode => this.setState({ otpCode })}
                        returnKeyType={'next'}
                        onSubmitEditing={() => { this.otpCode._root.focus(); }}
                        blurOnSubmit={false}
                    />
                </Item>

                <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="New Password" style={styles.transparentLabel}
                        ref={(input) => { this.otpCode = input; }}
                        //getRef={(input) => { this.otpCode = input; }}
                        secureTextEntry={true}
                        returnKeyType={'done'}
                        autoCapitalize='none'
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        blurOnSubmit={false}
                        onSubmitEditing={() => { this.changePassword(); }}

                    />
                </Item>

                <Button style={styles.loginButton} block primary onPress={() => this.changePassword()}>
                    <Text>Reset Password</Text>
                </Button>
            </View>
        )
    }
    render() {
        const { user: { isLoading, isOTPGenerated } } = this.props;
        const { errorMessage } = this.state;

        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                    <H3 style={styles.welcome}>Forgot Password</H3>
                    <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />

                    <Form>
                        {/* <View style={styles.errorMessage}>
                         <Text style={{textAlign:'center',color:'#775DA3'}}> Invalid Credentials</Text>
                  </View>                */}


                        {isOTPGenerated == true ? this.renderAfterOtpGenerated() : this.renderEnterEmail()}

                    </Form>

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
