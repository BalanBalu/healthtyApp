import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  View,
  Button,
  Text,
  Toast,
  Content,
  Container,
  Left,
  Right,
  Card,
  Item,
  Form,
  Label,
  Input,
} from 'native-base';
import {connect} from 'react-redux';
import {acceptNumbersOnly} from '../../common';
import {
  generateOTPForLoginWithOtp,
  verifyMemberLoginWithOtp,getMemberDetailsByEmail
} from '../../providers/corporate/corporate.actions';
import Spinner from '../../../components/Spinner';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Col, Grid, Row} from 'react-native-easy-grid';
import ModalPopup from '../../../components/Shared/ModalPopup';
import {primaryColor} from '../../../setup/config';
const mainBg = require('../../../../assets/images/MainBg.jpg');
import styles from '../../screens/auth/styles';
import {RESET_REDIRECT_NOTICE} from '../../providers/auth/auth.actions';
import {
  storeBasicProfile,
} from '../../providers/profile/profile.action';

class LoginWithOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      isOTPGenerated: false,
      requestData: {},
      errorMsg: '',
      isLoading: false,
      userEntry: '',
      userId: '',
    };
  }
  getEnteredotp = async (otp) => {
    await this.setState({otp});
    if (this.state.otp.length === 4) this.verifyotp();
  };

  /*  Generate OTP code for Login  Access  */
  generateotp = async () => {
    try {
      const {userEntry} = this.state;
      if (!userEntry) {
        this.setState({errorMsg: 'Please enter Email Or Mobile number'});
        return false;
      }
      this.setState({errorMsg: '', isLoading: true});
      const getOtpResp = await generateOTPForLoginWithOtp(userEntry);
      if (getOtpResp) {
        // Toast.show({
        //   text: (getOtpResp && getOtpResp.message) || '',
        //   type: 'success',
        //   duration: 4000,
        // });
        this.setState({
          isOTPGenerated: true,
          requestData: getOtpResp,
          userId: getOtpResp.userId,
        });
      } else {
        this.setState({
          errorMsg:
            getOtpResp && getOtpResp.error
              ? getOtpResp.error
              : getOtpResp && getOtpResp.message
              ? getOtpResp.message
              : '',
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  /*  verify Email using Entered OTP Code   */
  verifyotp = async () => {
    const {otp, userId, userEntry} = this.state;
    try {
      if (!otp) {
        this.setState({errorMsg: 'Please enter your OTP'});
        return false;
      }
      if (otp.length < 4) {
        this.setState({errorMsg: 'Please enter your 4 digit OTP code'});
        return false;
      }
      this.setState({isLoading: true, errorMsg: ''});
      let reqDataForVerifyotp = {
        userId,
        otp: otp,
      };
      let reqOtpVerifiedResponse = await verifyMemberLoginWithOtp(
        reqDataForVerifyotp,
      );
      console.log('reqOtpVerifiedResponse', reqOtpVerifiedResponse);
      if (this.props.user.isAuthenticated) {
        let memberEmailId =
          (await AsyncStorage.getItem('memberEmailId')) || null;
        let coorporateSideresult = await getMemberDetailsByEmail(memberEmailId);
        if (!coorporateSideresult.error) {
          storeBasicProfile(coorporateSideresult[0]);
        }
        if (this.props.user.needToRedirect === true) {
          let redirectNoticeData = this.props.user.redirectNotice;
          this.props.navigation.navigate(
            redirectNoticeData.routeName,
            redirectNoticeData.stateParams,
          );
          store.dispatch({
            type: RESET_REDIRECT_NOTICE,
          });
          return;
        }

        this.props.navigation.navigate('CorporateHome');
      } else {
        Toast.show({
          text: this.props.user.message || '',
          type: 'danger',
          duration: 4000,
        });
      }
    } catch (e) {
      Toast.show({
        text: 'Something Went Wrong' + e,
        duration: 3000,
      });
    } finally {
      this.setState({isLoading: false});
    }
  };

  render() {
    const {
      otp,
      isOTPGenerated,
      userEntry,
      isLoading,
      errorMsg,
      isModalVisible,
    } = this.state;
    return (
      <Container style={styles.container}>
        <ImageBackground
          source={mainBg}
          style={{width: '100%', height: '100%', flex: 1}}>
          <Content contentContainerStyle={styles.authBodyContent}>
            <ScrollView>
              {isLoading ? (
                <Spinner visible={isLoading} />
              ) : isOTPGenerated ? (
                <View style={styles.container}>
                  <Row>
                    <Left>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Roboto',
                          fontSize: 20,
                        }}>
                        VERIFY DETAILS
                      </Text>
                    </Left>
                  </Row>
                  {/* {isOTPGenerated == true ? <Text style={{ color: 'gray', fontSize: 15 }}>{`OTP is successfully sent to ${userEntry}`}</Text> : <Text style={{ color: 'gray', fontSize: 15 }}>OTP couldn't sent to {userEntry} Please Contact Our @Support_Team!</Text>} */}
                  <Text style={{marginTop: 10, fontSize: 13}}>
                    Enter Your OTP
                  </Text>
                  <OtpInputs
                    noOfDigits={4}
                    getOtp={(otp) => this.getEnteredotp(otp)}
                  />
                  <TouchableOpacity onPress={() => this.generateotp()}>
                    <Text
                      style={{
                        color: '#1caed6',
                        marginLeft: 10,
                        fontSize: 13,
                        textAlign: 'right',
                      }}>
                      RESEND OTP
                    </Text>
                  </TouchableOpacity>
                  <Button
                    style={
                      otp.length != 4
                        ? styles.loginButtonDisable
                        : styles.loginButton
                    }
                    block
                    success
                    disabled={otp.length != 4}
                    onPress={() => this.verifyotp()}>
                    {otp.length != 4 ? (
                      <Text style={styles.ButtonText}>Enter OTP</Text>
                    ) : (
                      <Text style={styles.ButtonText}>Verify OTP</Text>
                    )}
                  </Button>
                  <Text style={{color: 'red', marginLeft: 15, marginTop: 10}}>
                    {errorMsg}
                  </Text>

                  <Item
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderBottomWidth: 0,
                      marginBottom: 10,
                      marginTop: 10,
                    }}>
                    <Text
                      uppercase={false}
                      style={{
                        color: '#000',
                        fontSize: 16,
                        fontFamily: 'Roboto',
                        color: primaryColor,
                      }}>
                      Go Back To
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate('login')}
                      style={styles.smallSignInButton}>
                      <Text
                        uppercase={true}
                        style={{
                          color: '#000',
                          fontSize: 12,
                          fontFamily: 'Roboto',
                          fontWeight: 'bold',
                          color: '#fff',
                        }}>
                        {' '}
                        Sign In
                      </Text>
                    </TouchableOpacity>
                  </Item>
                </View>
              ) : (
                // <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
                // <Content contentContainerStyle={styles.authBodyContent}>
                //   <ScrollView>

                <Card style={{borderRadius: 10, padding: 5, marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <ModalPopup
                      errorMessageText={errorMsg}
                      closeButtonText={'CLOSE'}
                      closeButtonAction={() =>
                        this.setState({isModalVisible: !isModalVisible})
                      }
                      visible={isModalVisible}
                    />
                  </View>
                  <View style={{marginLeft: 10, marginRight: 10}}>
                    <Text
                      uppercase={true}
                      style={[styles.cardHead, {color: primaryColor}]}>
                      Login With OTP
                    </Text>

                    <Form>
                      <Label
                        style={{
                          marginTop: 20,
                          fontSize: 15,
                          color: primaryColor,
                          fontFamily: 'opensans-bold',
                        }}>
                        {'Mobile Number/ Email'}
                      </Label>
                      <Item
                        style={{
                          borderBottomWidth: 0,
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        <Input
                          placeholder={'Mobile Number / Email'}
                          style={styles.authTransparentLabel}
                          ref={(input) => {
                            this.enterTextInputEmail = input;
                          }}
                          returnKeyType={'next'}
                          value={userEntry}
                          keyboardType={'default'}
                          onChangeText={
                            (userEntry) =>
                              this.setState({
                                userEntry,
                              }) /*acceptNumbersOnly(userEntry) == true || userEntry === '' ? this.setState({ userEntry }) : null */
                          }
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          // onSubmitEditing={() => { this.userEntry._root.focus(); }}
                        />
                      </Item>

                      {isLoading ? <Spinner visible={isLoading} /> : null}
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          small
                          style={
                            userEntry == ''
                              ? styles.loginButton1Disable
                              : styles.loginButton1
                          }
                          disabled={isLoading}
                          block
                          success
                          disabled={userEntry == ''}
                          onPress={() => this.generateotp()}>
                          <Text uppercase={true} style={styles.ButtonText}>
                            Continue With OTP{' '}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Item
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          borderBottomWidth: 0,
                          marginBottom: 10,
                          marginTop: 10,
                        }}>
                        <Text
                          uppercase={false}
                          style={{
                            color: '#000',
                            fontSize: 15,
                            fontFamily: 'Roboto',
                            color: primaryColor,
                          }}>
                          Go Back To
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('login')
                          }
                          style={styles.smallSignUpButton}>
                          <Text
                            uppercase={true}
                            style={{
                              color: '#000',
                              fontSize: 10,
                              fontFamily: 'opensans-bold',
                              color: '#fff',
                            }}>
                            {' '}
                            SignIn
                          </Text>
                        </TouchableOpacity>
                      </Item>

                      <Item
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          borderBottomWidth: 0,
                          marginTop: 20,
                          marginBottom: 10,
                        }}>
                        <Text
                          uppercase={false}
                          style={{
                            color: '#000',
                            fontSize: 14,
                            fontFamily: 'Roboto',
                            color: primaryColor,
                          }}>
                          Don't Have An Account ?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('signup');
                          }}
                          style={styles.smallSignUpButton}>
                          <Text
                            uppercase={true}
                            style={{
                              color: '#000',
                              fontSize: 10,
                              fontFamily: 'opensans-bold',
                              color: '#fff',
                            }}>
                            {' '}
                            Sign Up
                          </Text>
                        </TouchableOpacity>
                      </Item>
                    </Form>
                  </View>
                </Card>
                // </ScrollView>
                // </Content>
                // </ImageBackground>
              )}
            </ScrollView>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 8,
//     marginTop: 10,
//   },
//   authBodyContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingLeft: 20,
//     paddingRight: 20,
//   },

//   loginButton: {
//     marginTop: 20,
//     backgroundColor: primaryColor,
//     marginLeft: 15,
//     borderRadius: 5,
//   },
//   loginButtonDisable: {
//     marginTop: 20,
//     backgroundColor: primaryColor,
//     marginLeft: 15,
//     borderRadius: 5,
//   },
//   smallSignInButton: {
//     backgroundColor: primaryColor,
//     marginLeft: 15,
//     borderRadius: 20,
//     paddingRight: 20,
//     paddingLeft: 20,
//     paddingBottom: 10,
//     paddingTop: 10,
//   },
//   updateButtonDisable: {
//     height: 40,
//     width: 'auto',
//     borderRadius: 10,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 10,
//     marginTop: 5,
//     justifyContent: 'center',
//     fontFamily: 'Helvetica-Light',
//     paddingLeft: 40,
//     paddingRight: 40,
//   },
//   updateButton1: {
//     height: 40,
//     width: 'auto',
//     borderRadius: 10,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 10,
//     marginTop: 5,
//     justifyContent: 'center',
//     backgroundColor: primaryColor,
//     fontFamily: 'Helvetica-Light',
//     paddingLeft: 40,
//     paddingRight: 40,
//   },
//   otpButton: {
//     height: 40,
//     width: 'auto',
//     borderRadius: 25,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 10,
//     marginTop: 25,
//     justifyContent: 'center',
//     backgroundColor: primaryColor,
//     fontFamily: 'Helvetica-Light',
//     paddingLeft: 40,
//     paddingRight: 40,
//   },
//   otpButtonDisable: {
//     height: 40,
//     width: 'auto',
//     borderRadius: 25,
//     textAlign: 'center',
//     color: 'white',
//     fontSize: 10,
//     marginTop: 25,
//     justifyContent: 'center',
//     fontFamily: 'Helvetica-Light',
//     paddingLeft: 40,
//     paddingRight: 40,
//   },
//   transparentLabel1: {
//     borderBottomColor: 'transparent',
//     backgroundColor: '#F1F1F1',
//     height: 45,
//     marginTop: 20,
//     borderRadius: 5,
//     paddingLeft: 20,
//     fontFamily: 'Helvetica-Light',
//     marginLeft: 15,
//     color: 'black',
//   },
// });

function LoginWithOtpState(state) {
  return {
    user: state.user,
  };
}
export default connect(LoginWithOtpState)(LoginWithOtp);
