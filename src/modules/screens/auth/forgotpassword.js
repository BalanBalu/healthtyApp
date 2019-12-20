import React, { Component } from 'react';
import { View, Container, Content, Button, Text, Form, Item, Input,Card, Footer, FooterTab, H3, Toast, Icon,Label } from 'native-base';
import { generateOTP, changePassword, LOGOUT } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { StyleSheet, Image,ImageBackground,TouchableOpacity} from 'react-native'
import styles from '../../screens/auth/styles';
import { store } from '../../../setup/store';
import { ScrollView } from 'react-native-gesture-handler';

//import console = require('console');
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
            showPassword: true
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
                   <Label style={{fontSize:15,marginTop:10,color:'#775DA3',fontWeight:'bold'}}>Email / Phone</Label>
                    <Item style={{ borderBottomWidth: 0,marginTop:10}}>
                        <Input placeholder="Email Or Phone" style={styles.transparentLabel2}
                            value={this.state.userEntry}
                            keyboardType={'email-address'}
                            onChangeText={userEntry => this.setState({ userEntry })}
                            autoFocus={true}
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.requestOTP(); }}
                        />
                    </Item>

                    <Button style={styles.forgotButton} block primary onPress={() => this.requestOTP()}>
                        <Text>Send OTP</Text>
                    </Button>
              
                    </View>
                   
        )
    }
    renderAfterOtpGenerated() {
        const { user: { isLoading } } = this.props;
        return (
          
           <View>
                 <Label style={{fontSize:15,marginTop:10,color:'#775DA3',fontWeight:'bold'}}>OTP</Label>

                    <Item style={{ borderBottomWidth: 0,marginTop:10 }}>
                        <Input placeholder="Enter OTP" style={styles.authTransparentLabel}
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
                    <Label style={{fontSize:15,marginTop:10,color:'#775DA3',fontWeight:'bold'}}>Password</Label>

                    <Item style={{ borderBottomWidth: 0,marginTop:10  }}>
                        <Input placeholder="New Password" style={styles.authTransparentLabel}
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
                        <Icon active name='eye' style={{ fontSize: 20, marginTop: 10 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                    </Item>

                    <Button style={styles.forgotButton} block primary onPress={() => this.changePassword()}>
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
                 <ImageBackground source={mainBg} style={{width: '100%', height: '100%', flex: 1 }}>

              <Content contentContainerStyle={styles.authBodyContent}>
                <ScrollView>
                        <Text style={[styles.welcome,{color:'#fff'}]}>Forgot Password</Text>
                        <Card style={{borderRadius:10,padding:5,marginTop:20,paddingTop:5,paddingBottom:5}}>
                     <View style={{marginLeft:10,marginRight:10}}>

                        <Form>
                            {/* <View style={styles.errorMessage}>
                         <Text style={{textAlign:'center',color:'#775DA3'}}> Invalid Credentials</Text>
                  </View>                */}


                            {isOTPGenerated == true ? this.renderAfterOtpGenerated() : this.renderEnterEmail()}

                        </Form>
                        </View>

                   
                    <Item style={{marginLeft:'auto',marginRight:'auto',borderBottomWidth:0,marginBottom:10,marginTop:10}}>
              <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans',color:'#775DA3' }}>Go Back To</Text>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('login')} style={styles.smallSignUpButton}>
              <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans',fontWeight:'bold',color:'#fff' }}> SignIn</Text>
              </TouchableOpacity>
              </Item>
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

