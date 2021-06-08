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
// import styles from '../../screens/auth/styles';
import {RESET_REDIRECT_NOTICE} from '../../providers/auth/auth.actions';
import {
  storeBasicProfile,
} from '../../providers/profile/profile.action';

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
  onFocus() {
    this.setState({
      backgroundColor: '#48b4a5'
    });
  }

  onBlur() {
    this.setState({
      backgroundColor: '#dddddd'
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
    return (

      isOTPGenerated ? (<ImageBackground
        style={{flex: 1}}
        source={require('../../../../assets/images/loginBG.jpeg')}
        blurRadius={15}>
          
     <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
     <View style={styles.outerContainer}>
          <View style={styles.container}>
          <Text style={styles.heading1}>OTP Verification</Text>
          <Text style={{marginVertical:20, color: '#C2CCCC', lineHeight: 30}}>Enter the OTP you received to <Text style={{fontFamily: 'opensans-bold'}}>{userEntry}</Text> </Text>
                    <OtpInputs
                    userEntry={userEntry}
                    noOfDigits={4}
                    getOtp={(otp) => this.getEnteredotp(otp)}
                  />
                    
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 100, justifyContent: 'space-between'}}>
          <Pressable onPress={() => this.generateotp()} style={{marginTop: 30 }}>
              <Text style={{color: '#39B0E5'}}>
  
  RESEND OTP <MaterialIcons name="arrow-forward-ios" style={{  color: '#39B0E5' }} /></Text>
      </Pressable>
      <Pressable onPress={() => this.props.navigation.navigate('loginWithOtp')} style={{marginTop: 30 }}>
              <Text style={{color: '#39B0E5'}}>
  
  BACK <MaterialIcons name="arrow-back-ios" style={{  color: '#39B0E5' }} /></Text>
      </Pressable>
          </View>
         
         
        </View>
        <LinearGradient start={{x: 0, y: 0}} end={{x: 0.5, y: 0}}  colors={['#0390e8', '#48b4a5']} style={styles.createAccount}>
         <Pressable onPress={() => this.generateotp()} S style={{ }}>
              <Text style={styles.createAccountText}>Continue</Text>
      </Pressable>
      </LinearGradient>
        </View>
          </View>
  </ImageBackground>) :
     
      <ImageBackground
      style={{flex: 1}}
      source={require('../../../../assets/images/loginBG.jpeg')}
      blurRadius={15}>
        
   <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
   <View style={styles.outerContainer}>
        <View style={styles.container}>
        <Text style={styles.heading1}>Login With OTP</Text>
        <Text style={{ color: 'black', fontFamily: 'opensans-semibold', fontSize: 16, justifyContent: 'center', marginTop: 15 }}>Phone No or Email</Text>
        <Item 
        style={{marginTop: 15, borderBottomColor: this.state.backgroundColor, borderBottomWidth: 1,
         width: '88%', marginRight: 50, marginLeft: 0}}>
                      <Input
                       placeholderTextColor={'##A1A1A1'} 
                        placeholder={'Mobile Number / Email'}
                        ref={(input) => {
                          this.enterTextInputEmail = input;
                        }}
                        onFocus={ () => this.onFocus() }
                        onBlur={ () => this.onBlur() }
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
                    <Text style={{marginVertical: 30, color: '#C2CCCC'}}>A 4-digit OTP will be sent to your mobile / email to verify your mobile number or email provided</Text>
        <Pressable onPress={() => this.props.navigation.navigate('login')} style={{ }}>
            <Text style={{color: '#39B0E5'}}><MaterialIcons name="arrow-back-ios" style={{  color: '#39B0E5' }} />

Go Back</Text>
    </Pressable>
       
       
      </View>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0.5, y: 0}}  colors={['#0390e8', '#48b4a5']} style={styles.createAccount}>
       <Pressable onPress={() => this.generateotp()} S style={{ }}>
            <Text style={styles.createAccountText}>Send OTP</Text>
    </Pressable>
    </LinearGradient>
      </View>
        </View>
</ImageBackground>

      
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {display: 'flex', justifyContent: 'center'},
  container: {height: 'auto', flex: 0 , width : width - 40,
  paddingHorizontal: 20, paddingVertical: 40, marginHorizontal: 40, 
  backgroundColor: '#fff', borderRadius: 24, fontWeight: 'bold', fontSize: 20},
  heading1: {
    fontFamily:'opensans-bold',
    fontSize: 20.5
  },
  createAccount: {display: 'flex', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 30, elevation: 8,
        backgroundColor: "#48b4a5",
        borderColor: '#48b4a5',
        borderWidth: 0,
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 67},
        createAccountText: {  fontSize: 18,
          color: "#fff",
          fontFamily: 'opensans-bold',
          alignSelf: "center",
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
})

function LoginWithOtpState(state) {
  return {
    user: state.user,
  };
}
export default connect(LoginWithOtpState)(LoginWithOtp);
