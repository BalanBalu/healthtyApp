import React, { Component } from 'react';
import { View, Container, Content, Button, Text, Form, Item, Input, Card, Footer, FooterTab, Toast, Icon, Label, Row, Col, Radio } from 'native-base';
import { generateOTP, generateOTPForSmartHealth, changePassword, changePasswordForSmartHelath, getAllCorporateNames } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { FlatList, Image, Pressable, ImageBackground, TabBarIOS, TouchableOpacity } from 'react-native'
import styles from '../../screens/auth/styles';
import LinearGradient from 'react-native-linear-gradient';
import OtpInputs from '../../../components/OtpInputText/OtpInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Svg, {Defs, Ellipse, G, Path, Stop,TSpan,Circle,Rect } from 'react-native-svg';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce, validateEmailAddress, acceptNumbersOnly ,validateMobileNumber} from '../../common';
import Spinner from '../../../components/Spinner';
import OTPTextInput from 'react-native-otp-textinput';
import { CURRENT_APP_NAME, MY_SMART_HEALTH_CARE, primaryColor } from "../../../setup/config";
import LoginWithOtp from './loginWithOtp';
const mainBg = require('../../../../assets/images/MainBg.jpg')

class Forgotpassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otpCode: '',
            type: '',
            password: '',
            isOTPGenerated: true,
            errorMessage: '',
            userEntry: '',
            showPassword: true,
            isPasswordMatch: false,
            isCorporateUserSelected: false,
            corporateName: '',
            employeeId: '',
            corporateNameList: [],
            isEnableCorporateItems: false

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
    generateOtpCode = async (isResendOtp) => {
        const { userEntry, employeeId, corporateName } = this.state;
        try {
            if (this.state.isCorporateUserSelected && CURRENT_APP_NAME === MY_SMART_HEALTH_CARE) {
                if (!corporateName) {
                    this.setState({ errorMessage: "kindly enter your Corporate Name" });
                    return false
                }
                if (!userEntry) {
                    this.setState({ errorMessage: 'Enter your Email' });
                    return false;
                }
                if (validateEmailAddress(userEntry) === false) {
                    this.setState({ errorMessage: 'You Entered Email is Not valid' });
                    return false;
                }
                if (!employeeId) {
                    this.setState({ errorMessage: "kindly enter your EmployeeId" });
                    return false
                }
            } else {
                if (!userEntry) {
                    this.setState({ errorMessage: 'Enter your Email Or Mobile' });
                    return false;
                }
                if (isNaN(userEntry)&&validateEmailAddress(userEntry) === false) {
                    this.setState({ errorMessage: 'You Entered Email is Not valid' });
                    return false;
                }
                if (!isNaN(userEntry)&&validateMobileNumber(userEntry) === false) {
                    this.setState({ errorMessage: 'You Entered Mobile number is not valid' });
                    return false;
                }
            }
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
                    if (isResendOtp) {
                        Toast.show({
                            text: 'OTP is Resent successfully',
                            duration: 3000,
                            type: "success"
                        })
                    }
                } else {
                    this.setState({ errorMessage: smartHealthReqOtpResponse.message === 'INVALID_CORPORATE' ? 'Entered corporate name is incorrect' : smartHealthReqOtpResponse.message === 'INVALID_USERID' ? 'Entered Email ID Is Incorrect' : smartHealthReqOtpResponse.message === 'INVALID_EMPLOYEEID' ? 'Entered Employee id is incorrect' : 'Invalid credentials' });
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
                    this.setState({ errorMessage: reqOtpResponse.error && reqOtpResponse.error.code ? reqOtpResponse.error.code : reqOtpResponse.error });
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
            if (!otpCode) {
                this.setState({ errorMessage: 'kindly enter received OTP' });
                return false;
            }
            if (!password) {
                this.setState({ errorMessage: 'kindly enter your Password' });
                return false;
            }
            if (password.length < 6) {
                this.setState({ errorMessage: "Password is required Min 6 Characters" });
                return false;
            }
            if (password.length > 16) {
                this.setState({ errorMessage: "Password Accepted Max 16 Characters only" });
                return false
            }
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

    onFocus(item) {
        if(item === 1) {
          this.setState({
            backgroundColor1: '#48b4a5'
          })
        } else {
          this.setState({
            backgroundColor2: '#48b4a5'
          })
        }
      }
    
      onBlur(item) {
        if(item === 1) {
          this.setState({
            backgroundColor1: '#dddddd'
          })
        } else {
          this.setState({
            backgroundColor2: '#dddddd'
          })
        }
      }
    onChangeRemoveSpaces(value) {
        // code to remove White Spaces from text field
        this.setState({ userEntry: value.replace(/\s/g, "") });
    }

    onPressChangeCorporateName = async (value) => {
        try {
            this.setState({ corporateName: value });
            if (value) {
                const getCorporateResp = await getAllCorporateNames(value);
                if (getCorporateResp && getCorporateResp.length) {
                    this.setState({ corporateNameList: getCorporateResp, isEnableCorporateItems: true });
                    return true;
                }
            }
                    this.setState({ corporateNameList: [], isEnableCorporateItems: false });
        } catch (error) {
            console.log('Error is getting on Get All Corporate items', error.message);
        }
    }
    itemSeparatedByListView = () => {
        return (
            <View
                style={{
                    padding: 4,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5
                }}
            />
        );
    };
    onSelectCorporateName(value) {
        this.setState({ corporateName: value, isEnableCorporateItems: false });
    }
    renderEnterEmail() {
        const { user: { isLoading } } = this.props;
        const { userEntry, isCorporateUserSelected, corporateNameList, isEnableCorporateItems } = this.state;
        return (
           <View style={{width: '100%'}}>
                {isCorporateUserSelected === false ?
                    <Item style={{marginTop: 40, borderBottomColor: this.state.backgroundColor1, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30}}>
                    <Input
                     onBlur={ () => this.onBlur(1) }
                     onFocus={ () => this.onFocus(1) }
                    placeholderTextColor={'#A1A1A1'} placeholder="Email" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                    value={userEntry}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                onChangeText={userEntry => this.onChangeRemoveSpaces(userEntry)}
                                onSubmitEditing={() => { userEntry !== '' ? this.generateOtpCode() : null }}
                    />
            
            
                   
                  </Item> :


                    <View style={{width: '100%'}}>
                         <Item style={{marginTop: 40, borderBottomColor: this.state.backgroundColor1, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30}}>
                    <Input
                     onBlur={ () => this.onBlur(1) }
                     onFocus={ () => this.onFocus(1) }
                    placeholderTextColor={'#A1A1A1'} placeholder="Enter Corporate Name" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                    value={this.state.corporateName}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                returnKeyType={'done'}
                                onChangeText={corporateName => this.onPressChangeCorporateName(corporateName)}
                    />
            
            
                   
                  </Item>
                                              
                            {isEnableCorporateItems && corporateNameList && corporateNameList.length ?
                                                    <Card  style={{position: 'absolute',top:85,width:'100%'}}>
                                <FlatList
                                    data={corporateNameList}
                                    ItemSeparatorComponent={this.itemSeparatedByListView}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={{ marginTop: 5, marginBottom: 5 }} onPress={() => this.onSelectCorporateName(item)}>
                                            <Text style={{
                                                color: '#775DA3',
                                                marginTop: 2,
                                                fontFamily: 'OpenSans',
                                                fontSize: 16,
                                                paddingLeft: 14
                                            }}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    enableEmptySections={true}
                                    style={{ marginTop: 10 }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                                        </Card>

                                : null}

<Item style={{marginTop: 40, borderBottomColor: this.state.backgroundColor1, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30}}>
                    <Input
                     onBlur={ () => this.onBlur(1) }
                     onFocus={ () => this.onFocus(1) }
                    placeholderTextColor={'#A1A1A1'} placeholder="Email" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                    value={userEntry}
                                autoCapitalize={false}
                                keyboardType={'email-address'}
                                onChangeText={userEntry => this.onChangeRemoveSpaces(userEntry)}
                                onSubmitEditing={() => { userEntry !== '' ? this.generateOtpCode() : null }}
                    />
            
            
                   
                  </Item>
                  <Item style={{marginTop: 40, borderBottomColor: this.state.backgroundColor1, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30}}>
                    <Input
                     onBlur={ () => this.onBlur(1) }
                     onFocus={ () => this.onFocus(1) }
                    placeholderTextColor={'#A1A1A1'} placeholder="Employee ID" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                    value={this.state.employeeId}
                    autoCapitalize={false}
                    ref={(input) => { this.employeeId = input; }}
                    keyboardType={'email-address'}
                    returnKeyType={'done'}
                    onChangeText={employeeId => this.setState({ employeeId: employeeId.replace(/\s/g, "") })}
                    />
            
            
                   
                  </Item>

                    </View>

                }
                {CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ?
                  <View>
                       <Container style={{width: '100%'}}>
                        <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                    <View style={{display: 'flex', marginTop: 25, marginLeft: 25, flexDirection: 'row'}}>
                              <Radio
                              
                               color={'#AAAAAA'}
                             selectedColor={'#AAAAAA'}
                             standardStyle={true}
                             selected={ isCorporateUserSelected === false}
                             onPress={() => this.setState({ isCorporateUserSelected: false })}
                             />
                             <Text style={{marginLeft: 8}}>User</Text>
                     </View>
                     <View style={{display: 'flex', marginTop: 25, marginLeft: 25, flexDirection: 'row'}}>
                              <Radio
                              
                               color={'#AAAAAA'}
                             selectedColor={'#AAAAAA'}
                                           standardStyle={true}
                               selected={ isCorporateUserSelected === true}
                               onPress={() => this.setState({ isCorporateUserSelected: true })}
                             />
                             <Text style={{marginLeft: 8}}>Corporate</Text>
                     </View>
                   
                    </View>
                    
                    
                    
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.5, y: 0}}  colors={['#0390e8', '#48b4a5']} style={[styles.createAccount, {marginBottom: 50, marginTop: 50, marginRight: 24}]}>
                   <Pressable  block success onPress={() => this.generateOtpCode()} style={{ }}>
                        <Text style={styles.createAccountText}>Generate OTP</Text>
                </Pressable>
                </LinearGradient>
                <View style={{display: 'flex', alignContent: 'center', alignItems: 'center'}}>

                </View>
                   </Container>
                   
                  </View>
                    : null}
                {isLoading ?
                    <Spinner
                        visible={isLoading}
                    /> : null}
                {/* <Button
                    style={styles.forgotButton}
                    block success onPress={() => this.generateOtpCode()}>
                    <Text style={styles.ButtonText}>Generate OTP</Text>
                </Button> */}
            </View>
        )
            
        
    }
    renderAfterOtpGenerated() {
        const { user: { isLoading } } = this.props;
        const { otpCode, password, confirmPassword, showPassword, isPasswordMatch } = this.state;
        return (
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
                <View style={styles.containerOTP}>
                  <Text style={styles.heading1}>OTP Verification</Text>
                  <Text
                    style={{marginVertical: 20, color: '#C2CCCC', lineHeight: 30}}>
                    Enter the OTP you received
                  </Text>
                  <OtpInputs
                    userEntry={''}
                    noOfDigits={4}
                    getOtp={(otp) => this.getEnteredotp(otp)}
                  />
              
                        
              <View style={{display: 'flex', flexDirection: 'row', marginTop: 100, justifyContent: 'space-between'}}>
              <Pressable onPress={() => this.generateOtpCode(true)} style={{marginTop: 30 }}>
                  <Text style={{color: '#39B0E5'}}>
      
      RESEND OTP <MaterialIcons name="arrow-forward-ios" style={{  color: '#39B0E5' }} /></Text>
          </Pressable>
          <Pressable onPress={() => this.setState({isOTPGenerated: false})} style={{marginTop: 30 }}>
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
          
          </ImageBackground>
            // <View>
            //     <Row>
            //         <Col size={5}>
            //             <Text style={{ fontSize: 15, marginTop: 10, color: primaryColor, fontFamily: 'opensans-bold' }}>OTP</Text>
            //         </Col>
            //         <Col size={5}>
            //             <TouchableOpacity onPress={() => this.generateOtpCode(true)} >
            //                 <Text style={{ fontSize: 15, marginTop: 10, color: primaryColor, fontFamily: 'opensans-bold', alignSelf: 'flex-end' }}>RESEND</Text>
            //             </TouchableOpacity>
            //         </Col>
            //     </Row>
            //     <Item style={{ borderBottomWidth: 0, marginTop: 10 }}>
            //         <OTPTextInput
            //             ref={e => (this.otpInput = e)}
            //             inputCount={CURRENT_APP_NAME === MY_SMART_HEALTH_CARE && this.state.isCorporateUserSelected ? 4 : 6}
            //             tintColor={primaryColor}
            //             inputCellLength={1}
            //             containerStyle={{
            //                 marginLeft: -1,
            //             }}
            //             textInputStyle={{
            //                 width: 38,
            //                 fontFamily: 'opensans-bold'
            //             }}
            //             handleTextChange={(otpCode) => acceptNumbersOnly(otpCode) == true || otpCode === '' ? this.setState({ otpCode }) : null}
            //         />
            //     </Item>
            //     <Label style={{ fontSize: 15, marginTop: 10, color: primaryColor, fontFamily: 'opensans-bold' }}>Password</Label>

            //     <Item style={styles.authTransparentLabel}>
            //         <Input placeholder="Enter new password" style={{ fontSize: 15 }}
            //             ref={(input) => { this.enterOtpTextInput = input; }}
            //             secureTextEntry={this.state.showPassword}
            //             returnKeyType={'go'}
            //             value={password}
            //             onChangeText={password => this.onPasswordTextChanged(password)}
            //             onSubmitEditing={() => { this.enterNewPassTextInput._root.focus(); }}
            //         />
            //         {password.length >= 6 ? <Icon active name='ios-checkmark' style={{ fontSize: 34, color: '#329932' }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
            //     </Item>
            //     <Label style={{ fontSize: 15, marginTop: 10, color: primaryColor, fontFamily: 'opensans-bold' }}>Conform Password</Label>

            //     <Item style={styles.authTransparentLabel}>
            //         <Input placeholder="Retype new password" style={{ fontSize: 15 }}
            //             ref={(input) => { this.enterNewPassTextInput = input; }}
            //             secureTextEntry={showPassword}
            //             returnKeyType={'go'}
            //             value={confirmPassword}
            //             onChangeText={confirmPassword => this.checkEnteredPasswords(confirmPassword)}
            //             onSubmitEditing={() => { this.changePassword() }}
            //         />
            //         {isPasswordMatch == true ? <Icon active name='ios-checkmark' style={{ fontSize: 34, color: '#329932' }} /> : <Icon active name='ios-close' style={{ color: '#d00729', fontSize: 34 }} />}
            //     </Item>
            //     {isLoading ?
            //         <Spinner
            //             visible={isLoading}
            //         /> : null}
            //     <Button
            //         style={styles.forgotButton}
            //         block success onPress={() => this.changePassword()}>
            //         <Text style={styles.ButtonText}>Reset Password</Text>
            //     </Button>
            // </View>
        )
    }
    render() {
        const { user: { message } } = this.props;
        const { errorMessage, isOTPGenerated } = this.state;

        return !isOTPGenerated ? (
            <Container style={styles.container}>
                <ScrollView>
                <ImageBackground source={require('../../../../assets/images/loginBG.jpeg')} style={{ minHeight: 270}}>

<View>
<View style={styles.imageContainer}>
  <Svg xmlns="http://www.w3.org/2000/Svgg" width="55" height="55" viewBox="0 0 299.83 282.06">
<G id="Layer_2" data-name="Layer 2" transform="translate(-0.021 0.007)">
<G id="Layer_1" data-name="Layer 1">
<Path id="Path_5445" data-name="Path 5445" d="M299.8,86c-.47,31.58-12.75,55.27-33.72,74.94a44.569,44.569,0,0,1-3.31,3c-7,5.39-9.58,11.55-6.8,20.79s-1.93,17.1-11.19,20.59c-6.74,2.54-9.29,6.55-9.53,13.83-.27,7.86-5.91,15.72-16.94,16.54-5.42.4-7.36,2.3-7.61,7.85-.49,10.59-10.87,18.78-21.57,17.19-4.88-.73-6.75.66-7.79,5.38-2.78,12.47-13.93,18.62-25.78,14.38a12.61,12.61,0,0,0-9.15.14C133.34,285.39,121,277.8,119.8,264c-.43-5-1.75-6.79-7.12-6.73-9.19.12-17.19-8.94-17.55-19.63-.14-4-2-4.72-5.06-5.17-13.26-2-17.69-6.35-19.16-19.3-.4-3.49-1.55-5.27-5.46-5.57-14.93-1.15-21.87-10.47-19.2-25.23,1-5.55-1-10.2-4.76-14.05C33.13,159.72,23.93,152,17,142.07c-32.1-46-17.23-107.59,32.34-132,32.43-16,63.72-12.37,93.11,8.58,6,4.25,9,4,14.78-.48C195.95-11.65,250.16-3.65,280.41,33.9,291.18,47.29,300.64,73.19,299.8,86Z" fill="#078282"/>
<Path id="Path_5446" data-name="Path 5446" d="M88.48,6.37c18.44-.54,34.11,5.53,48.74,14.69,7.06,4.41,7.49,8.31,1.46,13.87-19,17.5-36.34,36.65-54.83,54.66a67.751,67.751,0,0,0-7,7.76c-7.76,10.31-6.74,21.15,2.65,29.9,9,8.38,20.27,8.92,29.66.49,7.78-7,14.72-14.92,22.15-22.32,5.88-5.88,12-11.53,17.9-17.39,2.68-2.66,4.91-2.64,7.6.09q16.83,17.05,33.86,33.91c16.22,16,31.46,33,48.26,48.47,3.89,3.58,7.83,7.25,9.91,12.37,1.93,4.74,1.84,9-2.07,12.83-4.69,4.57-10.09,6.1-14.94,4a31.41,31.41,0,0,1-9.62-7Q201,171.15,179.8,149.58a15.661,15.661,0,0,0-2.26-2,3.82,3.82,0,0,0-5.39.49c-1.81,1.8-.85,3.44.42,4.82,4.17,4.52,8.38,9,12.74,13.36,11.33,11.28,22.8,22.41,34.1,33.72,3.74,3.75,7.28,7.73,9.31,12.8,1.95,4.84.71,8.81-3.09,12.08-4.11,3.55-8.68,5.64-14.18,3.51-5-1.93-8.5-5.72-12-9.57-13.94-15.46-28.43-30.41-43.66-44.61a13.751,13.751,0,0,0-2.65-2.26c-1.42-.76-2.65-3.22-4.64-1.13-1.6,1.67-2.3,3.75-.9,5.92a23.881,23.881,0,0,0,3.1,3.85c16.13,16.14,32.34,32.19,48.4,48.39,4.25,4.27,7.36,9.46,5.43,15.71-1.65,5.33-6,8.24-11.51,9.13-7.53,1.21-12.66-3.29-12.35-10.81.47-11.41-4-18.29-14.7-22.07-4.25-1.49-5.8-3.36-4.14-8.06,3.9-11-3.5-22.29-15.11-23.61-6.64-.76-6.64-.76-5.7-7.34,1.5-10.55-10.73-22.16-21.43-20.33a40.408,40.408,0,0,0-4.88,1.07c-4.09,1.21-6.39-.07-8-4.22-5.92-15.27-19.81-18.65-32.27-8-5.33,4.54-10,9.74-14.84,14.8-3.86,4.05-7.67,4.74-11.26.69-11.12-12.53-25-22.84-32.72-38.12C2.36,101.43,2.57,74.91,16.87,48.93,29,27,47.71,13.6,71.94,7.93,77.56,6.61,83.4,5.75,88.48,6.37Z" fill="#fefefe"/>
<Path id="Path_5447" data-name="Path 5447" d="M207.17,6.3c43,0,76.65,27.54,84.69,67,5.51,27-1.46,50.74-19.83,71.13-6.12,6.8-12.45,13.44-19,19.79-4.41,4.25-7.64,4.12-11.59-.24-20.89-23.11-44-44-65.58-66.42-5.76-6-11.16-12.33-17.89-17.33-3.78-2.81-6.85-2.84-10.5.62-12.7,12-24.24,25.18-36.66,37.48a53.86,53.86,0,0,1-7.3,6c-7.12,4.89-15.34,4.24-20.45-1.4-5.63-6.22-6.22-15.66-1.06-22a130.1,130.1,0,0,1,9.83-10.64q31-30.45,62.08-60.8C169.59,14,188.11,5.51,207.17,6.3Z" fill="#fefefe"/>
<Path id="Path_5448" data-name="Path 5448" d="M133.63,181.66a9.7,9.7,0,0,1-2.57,7.68c-10.39,12.1-20.88,24.17-33.79,33.71-6.16,4.56-11.23,4.08-16.7-.66s-6.33-10.64-2.34-16.92,10.45-10.64,15.43-16.22c5.85-6.56,11.74-13.18,19.1-18.15,7.71-5.2,16.09-3.16,19.8,4.55a12.07,12.07,0,0,1,1.07,6.01Z" fill="#fefefe"/>
<Path id="Path_5449" data-name="Path 5449" d="M101,237.26c0-3.61.89-7.2,3.38-9.68,9.88-9.87,18.84-20.7,30-29.24,7.25-5.55,13-5.13,18.49,1,5.31,5.87,5.14,13.08-.72,19.21q-11.55,12.09-23.41,23.9A60.173,60.173,0,0,1,121,248.6c-3.79,2.68-7.84,3.62-12.14,1.05C104.13,246.84,100.84,243.15,101,237.26Z" fill="#fdfefe"/>
<Path id="Path_5450" data-name="Path 5450" d="M65.71,201.13c-5.9,0-10.1-2.3-12.47-7.28-2.53-5.3-2-10.82,1.85-14.94,7.93-8.48,15.57-17.32,24.63-24.63,6.28-5.07,11.71-4.65,17,.35,6,5.62,7,10.54,2.4,17.2-7.74,11.11-18,19.82-28.56,28.23a6.883,6.883,0,0,1-4.85,1.07Z" fill="#fefefe"/>
<Path id="Path_5451" data-name="Path 5451" d="M174,240.68c.47,3.26-1,6.3-3.54,8.95-6.49,6.66-12.92,13.38-19.44,20a20.771,20.771,0,0,1-8,5c-5.5,1.92-11.06.34-14.28-4-3.68-5-4.39-12.2-.6-16.26,7-7.51,13-16,21.36-22.25a53.107,53.107,0,0,1,5-3.31C164.26,223.1,173.92,228.76,174,240.68Z" fill="#fdfefe"/>
<Path id="Path_5452" data-name="Path 5452" d="M176,261.31a13.68,13.68,0,0,1-15.4,13.49c-2.36-.31-3.55-1.46-2-3.62a49.53,49.53,0,0,1,14.12-13.82C176.34,255.07,175.56,259.57,176,261.31Z" fill="#f6f9f9"/>
</G>
</G>
</Svg>
 
  <View>
  <Text><Text style={styles.textBold}>MySmart</Text><Text style={{ fontFamily:'opensans-regular', color: '#fff' }}>Health</Text></Text>

  </View>

  </View>
</View>
</ImageBackground>
<View style={styles.inputContainer}>
<Text style={styles.welcomeText}>Forgot Password?</Text>
<Form>
{this.renderEnterEmail()}
</Form>

</View>
                </ScrollView>               
            </Container>
        ) : this.renderAfterOtpGenerated()
    }
}


function forgotpasswordState(state) {
    return {
        user: state.user
    }
}
export default connect(forgotpasswordState)(Forgotpassword)

