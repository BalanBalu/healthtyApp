import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  ImageBackground,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  Toast,
  Content,
  Container,
  Left,
  Icon,
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
  verifyMemberLoginWithOtp,
  getMemberDetailsByEmail,
  resendActivateLink,
} from '../../providers/corporate/corporate.actions';
import Spinner from '../../../components/Spinner';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Col, Grid, Row} from 'react-native-easy-grid';
import ModalPopup from '../../../components/Shared/ModalPopup';
import {primaryColor} from '../../../setup/config';
const mainBg = require('../../../../assets/images/MainBg.jpg');
// import styles from '../../screens/auth/styles';
import {RESET_REDIRECT_NOTICE} from '../../providers/auth/auth.actions';
import {storeBasicProfile} from '../../providers/profile/profile.action';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

class LoginWithOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      isOTPGenerated: false,
      requestData: {},
      errorMsg: '',
      isLoading: false,
      backgroundColor: '#dddddd',
      userEntry: '',
      userId: '',
      isModalVisible: false,
    };
    this.isRegister = false;
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
      if (getOtpResp.success == true) {
        this.setState({
          isOTPGenerated: true,
          requestData: getOtpResp,
        });
      } else {
       
        if (getOtpResp.error.response.data.message == 'USER_NOT_FOUND') {
          this.setState({errorMsg: 'User Not Found, Please try again..',isModalVisible:true});
        } else if (getOtpResp.error.response.data.message == 'ACTIVATE_LINK_ERROR') {
          this.setState({
            errorMsg:
              'User not registered with us. Please click on activation link if you received member creation mail or contact administrator.',
              isModalVisible:true});
        } else if (
          getOtpResp.error.response.data.message == 'MEMBER_NOT_REGISTERED'
        ) {
          this.isRegister = true;
          this.setState({
            errorMsg:
              'User not registered with us. Please click on activation link if you received member creation mail or contact administrator.',
              isModalVisible:true });
        } else {
          this.setState({
            errorMsg: 'Something Went Wrong, Go Back to Sign In Page',
            isModalVisible:true });
        }
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
        userId: userEntry,
        otp: otp,
      };
      let reqOtpVerifiedResponse = await verifyMemberLoginWithOtp(
        reqDataForVerifyotp,
      );
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
          text: this.props.user.message || 'OTP you have entered is Invalid',
          type: 'danger',
          duration: 4000,
        });
      }
    } catch (e) {
      // Toast.show({
      //   text: 'Something Went Wrong' + e,
      //   duration: 3000,
      // });
    } finally {
      this.setState({isLoading: false});
    }
  };

  onResendActivateLink = async () => {
    try {
      const {userEntry} = this.state;
      if (!userEntry) {
        this.setState({errorMsg: 'Please enter Email Or Mobile number',isModalVisible:true});
        return false;
      }
      this.setState({errorMsg: '', isLoading: true});
      const response = await resendActivateLink(userEntry);
      if (response.success == true) {
        this.setState({errorMsg:'Activation link has been sent to registered email. Please click on activation link on email and continue.',isModalVisible:true})
      
      } else {
        this.setState({
          errorMsg: 'Something Went Wrong, Go Back to Sign In Page',isModalVisible:true
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

  onFocus() {
    this.setState({
      backgroundColor: '#48b4a5',
    });
  }

  onBlur() {
    this.setState({
      backgroundColor: '#dddddd',
    });
  }

  render() {
    const {
      otp,
      isOTPGenerated,
      userEntry,
      isLoading,
      errorMsg,
      isModalVisible,
    } = this.state;
    return isOTPGenerated ? (
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../../assets/images/loginBG.jpeg')}
        blurRadius={15}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.outerContainer}>
            <View style={styles.container}>
              <Text style={styles.heading1}>OTP Verification</Text>
              <Text
                style={{marginVertical: 20, color: '#C2CCCC', lineHeight: 30}}>
                Enter the OTP you received to{' '}
                <Text style={{fontFamily: 'opensans-bold'}}>{userEntry}</Text>{' '}
              </Text>
              <OtpInputs
                userEntry={userEntry}
                noOfDigits={4}
                getOtp={(otp) => this.getEnteredotp(otp)}
              />

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 100,
                  justifyContent: 'space-between',
                }}>
                <Pressable
                  onPress={() => this.generateotp()}
                  style={{marginTop: 30}}>
                  <Text style={{color: '#39B0E5'}}>
                    RESEND OTP{' '}
                    <MaterialIcons
                      name="arrow-forward-ios"
                      style={{color: '#39B0E5'}}
                    />
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => this.setState({isOTPGenerated: false})}
                  style={{marginTop: 30}}>
                  <Text style={{color: '#39B0E5'}}>
                    BACK{' '}
                    <MaterialIcons
                      name="arrow-back-ios"
                      style={{color: '#39B0E5'}}
                    />
                  </Text>
                </Pressable>
              </View>
              {errorMsg ? (
                <Text
                  style={{
                    color: 'red',
                    fontSize: 15,
                    marginLeft: 5,
                    marginTop: 5,
                  }}>
                  {errorMsg}
                </Text>
              ) : null}
            </View>

            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.5, y: 0}}
              colors={['#0390e8', '#48b4a5']}
              style={styles.createAccount}>
              <Pressable onPress={() => this.verifyotp()} style={{}}>
                <Text style={styles.createAccountText}>Continue</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </ImageBackground>
    ) : (
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../../assets/images/loginBG.jpeg')}
        blurRadius={15}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.outerContainer}>
            <View style={styles.container}>
              <Text style={styles.heading1}>Login With OTP</Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'opensans-semibold',
                  fontSize: 16,
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                Phone No or Email
              </Text>
              <Item
                style={{
                  marginTop: 15,
                  borderBottomColor: this.state.backgroundColor,
                  borderBottomWidth: 1,
                  width: '88%',
                  marginRight: 50,
                  marginLeft: 0,
                }}>
                <Input
                  placeholderTextColor={'#A1A1A1'}
                  placeholder={'Mobile Number / Email'}
                  ref={(input) => {
                    this.enterTextInputEmail = input;
                  }}
                  onFocus={() => this.onFocus()}
                  onBlur={() => this.onBlur()}
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
                />
              </Item>
             
              <Text style={{marginVertical: 30, color: '#C2CCCC'}}>
                A 4-digit OTP will be sent to your mobile / email to verify your
                mobile number or email provided
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'space-between',
                }}>
                <Pressable
                  onPress={() => this.props.navigation.navigate('login')}
                  style={{}}>
                  <Text style={{color: '#39B0E5'}}>
                    <MaterialIcons
                      name="arrow-back-ios"
                      style={{color: '#39B0E5'}}
                    />
                    Go Back
                  </Text>
                </Pressable>
                {this.isRegister ? (
                  <Pressable onPress={() => this.onResendActivateLink()}>
                    {/* // style={{marginTop: 30}}> */}
                    <Text style={{color: '#39B0E5'}}>
                      <MaterialIcons
                        name="arrow-back-ios"
                        style={{color: '#39B0E5'}}
                      />
                      Resend Activation Link{' '}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0.5, y: 0}}
              colors={['#0390e8', '#48b4a5']}
              style={styles.createAccount}>
              <Pressable onPress={() => this.generateotp()} S style={{}}>
                <Text style={styles.createAccountText}>Send OTP</Text>
              </Pressable>
            </LinearGradient>
          </View>
          <View>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({isModalVisible: !isModalVisible})
              }
              visible={isModalVisible}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {display: 'flex', justifyContent: 'center'},
  container: {
    height: 'auto',
    flex: 0,
    width: width - 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginHorizontal: 40,
    backgroundColor: '#fff',
    borderRadius: 24,
    fontWeight: 'bold',
    fontSize: 20,
  },
  heading1: {
    fontFamily: 'opensans-bold',
    fontSize: 20.5,
  },
  createAccount: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 8,
    backgroundColor: '#48b4a5',
    borderColor: '#48b4a5',
    borderWidth: 0,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 67,
  },
  createAccountText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'opensans-bold',
    alignSelf: 'center',
  },
  authTransparentLabel: {
    borderBottomColor: 'transparent',
    backgroundColor: '#F1F1F1',
    height: 45,
    marginTop: 10,
    borderRadius: 5,
    paddingLeft: 15,
    fontFamily: 'Roboto',
    fontSize: 15,
  },
});

function LoginWithOtpState(state) {
  return {
    user: state.user,
  };
}
export default connect(LoginWithOtpState)(LoginWithOtp);
