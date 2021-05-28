import React, { Component } from 'react';
import {
  Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right,
  Grid, Toast, KeyboardAvoidingView, Icon, Row, Card, Label, Left, Col, Radio
} from 'native-base';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, TouchableOpacity, View, ScrollView, ImageBackground, Pressable } from 'react-native';
import { login, RESET_REDIRECT_NOTICE,SmartHealthlogin } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles'
import { store } from '../../../setup/store';
import { fetchUserProfile, storeBasicProfile, storeBasicProfileUserLogin } from '../../providers/profile/profile.action';
import { acceptNumbersOnly } from '../../screens/../common';
const mainBg = require('../../../../assets/images/MainBg.jpg');
import Spinner from '../../../components/Spinner';
import ModalPopup from '../../../components/Shared/ModalPopup';
import Svg, {Defs, Ellipse, G, Path, Stop,TSpan,Circle,Rect } from 'react-native-svg';

import { CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from "../../../setup/config";
import {primaryColor} from '../../../setup/config'
import {
  getMemberDetailsByEmail,
} from '../../providers/corporate/corporate.actions';
class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: '',
      checked: false,
      isModalVisible: false,
      backgroundColor: '#dddddd',
      showPassword: true,
      isSelected:CURRENT_APP_NAME=== MY_SMART_HEALTH_CARE?'corporate_user':'user' ,
      CorporateUser: false
    }
  }

  /*  Do Login with Credentials  */
  doLogin = async () => {
    const { userEntry, password, isSelected } = this.state;
    try {
      await this.setState({ loginErrorMsg: '' })
      if ((userEntry && password) == '') {
        this.setState({ loginErrorMsg: 'Please enter Email and Password' });
        return false;
      }
      let requestData = {
        userEntry: userEntry,
        password: password,
        type: 'user'
      };
      if (isSelected === 'corporate_user') {
        requestData.is_corporate_user = true
      }
      if (isSelected === 'corporate_user') {
        await SmartHealthlogin(requestData)
      } else {
        await login(requestData);
      }  // Do Login Process
      if (this.props.user.isAuthenticated) {
        this.getUserProfile(isSelected);
        if (this.props.user.needToRedirect === true) {
          let redirectNoticeData = this.props.user.redirectNotice;
          this.props.navigation.navigate(redirectNoticeData.routeName, redirectNoticeData.stateParams);
          store.dispatch({
            type: RESET_REDIRECT_NOTICE
          })
          return
        }
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
       
        await this.setState({ CorporateUser: isCorporateUser })
        const { CorporateUser } = this.state
        if (CorporateUser === true) {
          this.props.navigation.navigate('CorporateHome');
        } else {
          
          this.props.navigation.navigate('Home');
        }
      } else {
        this.setState({ loginErrorMsg: this.props.user.message, isModalVisible: true })
      }
      // setTimeout(async () => {   // set Time out for Disable the Error Messages
      //   await this.setState({ loginErrorMsg: '' });
      // }, 4000);
    } catch (e) {
      this.setState({ loginErrorMsg: 'Something Went Wrong' + e, isModalVisible: true })
    }
  }
  onFocus(item) {
    if(item === 1) {
      this.setState({
        backgroundColor1: '#128283'
      })
    } else {
      this.setState({
        backgroundColor2: '#128283'
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
  getUserProfile = async (isSelected) => {
    try {
      if(isSelected === 'corporate_user') {
        // let userId = await AsyncStorage.getItem('userId');
        // let fields = "first_name,last_name,gender,dob,mobile_no,email,profile_image,middle_name"
        // let result = await fetchUserProfile(userId, fields);
        let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
        let coorporateSideresult = await getMemberDetailsByEmail(memberEmailId);
        if (!coorporateSideresult.error) storeBasicProfile(coorporateSideresult[0])
      } else {
        let userId = await AsyncStorage.getItem('userId');
        let fields = "first_name,last_name,gender,dob,mobile_no,email,profile_image,middle_name"
        let result = await fetchUserProfile(userId, fields);
        storeBasicProfileUserLogin(result)
      }
     
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    const { user: { isLoading } } = this.props;

    
    const { userEntry, password, showPassword, loginErrorMsg, isModalVisible, isSelected } = this.state;
    return (
      <Container style={{backgroundColor: '#fff'}}>
             <ImageBackground source={require('../../../../assets/images/loginBG.jpeg')} style={{ minHeight: 270}}>

      <View>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginTop: 30, marginLeft: 30, alignSelf: 'baseline'}}>
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
        <Text><Text style={{ fontFamily:'opensans-bold', color: '#fff' }}>MySmart</Text><Text style={{ fontFamily:'opensans-regular', color: '#fff' }}>Health</Text></Text>

        </View>

        </View>
      </View>
      </ImageBackground>
      <View style={{borderTopRightRadius: 45, borderTopLeftRadius: 45, backgroundColor: '#fff', minHeight: '100%', marginTop: -30, display: 'flex', alignItems: "flex-start"}}>
<Text style={{fontFamily: 'opensans-bold', marginLeft: 28, marginTop: 55, fontSize: 20, color: '#333333'}}>Welcome</Text>

<Form>
<Item style={{marginTop: 40, borderBottomColor: this.state.backgroundColor1, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30}}>
                      <Input
                       onBlur={ () => this.onBlur(1) }
                       onFocus={ () => this.onFocus(1) }
                      placeholderTextColor={'##A1A1A1'} placeholder={ isSelected === 'corporate_user' ? "Email" : "Mobile Number / Email"} style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                 ref={(input) => { this.enterTextInputEmail = input; }}
                                    returnKeyType={'next'}
                                    value={userEntry}
                                    keyboardType={"default"}
                                    onChangeText={userEntry => this.setState({ userEntry })/*acceptNumbersOnly(userEntry) == true || userEntry === '' ? this.setState({ userEntry }) : null */}
                                    autoCapitalize='none'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.userEntry._root.focus(); }}
                      />


                     
                    </Item>
                    
            <Item style={{borderBottomColor: this.state.backgroundColor2, borderBottomWidth: 1, width: '88%', marginRight: 50, marginLeft: 30, marginTop: 35}}>
                      <Input 
                      onBlur={ () => this.onBlur(2) }
                      onFocus={ () => this.onFocus(2) }
                      placeholderTextColor={'#A1A1A1'} placeholder="Password" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 1, }}
                        ref={(input) => { this.userEntry = input; }}
                        secureTextEntry={true}
                        returnKeyType={'done'}
                        value={password}
                        secureTextEntry={showPassword}
                        autoCapitalize='none'
                        onChangeText={password => this.setState({ password })}
                        // blurOnSubmit={false}
                        onSubmitEditing={() => { (userEntry && password) != '' ? this.doLogin() : this.enterTextInputEmail._root.focus() }}
                      />

{this.state.password !== '' && showPassword == true ? <Icon active name='eye' style={{ fontSize: 20, marginTop: 5, color: primaryColor }} onPress={() => this.setState({ showPassword: !showPassword })} /> 
      : this.state.password !== '' && showPassword == false ? <Icon active name='eye-off' style={{ fontSize: 20, marginTop: 5, color: primaryColor }} onPress={() => this.setState({ showPassword: !showPassword })} /> 
      : null}

                      
                    </Item>

                   
                    <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                    <View style={{display: 'flex', marginTop: 25, marginLeft: 25, flexDirection: 'row'}}>
                              <Radio
                              
                               color={'#AAAAAA'}
                             selectedColor={'#AAAAAA'}
                               standardStyle={true}
                               selected={ isSelected === 'corporate_user'}
                               onPress={() => this.setState({  isSelected: 'corporate_user', addPatientDataPoPupEnable: true, patientDetailsObj: {} })}
                             />
                             <Text style={{marginLeft: 8}}>Corporate</Text>
                     </View>
                     <View style={{display: 'flex', marginTop: 25, marginLeft: 25, flexDirection: 'row'}}>
                              <Radio
                              
                               color={'#AAAAAA'}
                             selectedColor={'#AAAAAA'}
                               standardStyle={true}
                               selected={ isSelected === 'user'}
                               onPress={() => this.setState({  isSelected: 'corporate_user', addPatientDataPoPupEnable: true, patientDetailsObj: {} })}
                             />
                             <Text style={{marginLeft: 8}}>User</Text>
                     </View>
                    </View>
                   <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 30, marginRight: 24}}>
                   <Pressable style={{ elevation: 2,
    backgroundColor: "#fff",
    borderColor: '#48b4a5',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 102}}>
                        <Text style={{  fontSize: 18,
    color: "#48b4a5",
    fontFamily: 'opensans-bold',
    alignSelf: "center",
}}>Sign in</Text>
                </Pressable>
                <Text style={{marginTop: 20, color: '#AAAAAA'}}>Forgot Password?</Text>
                   </View>
                   
</Form>

<LinearGradient start={{x: 0, y: 0}} end={{x: 0.5, y: 0}}  colors={['#0390e8', '#48b4a5']} style={{display: 'flex', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 30, elevation: 8,
    backgroundColor: "#128283",
    borderColor: '#128283',
    borderWidth: 0,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 67}}>
                   <Pressable style={{ }}>
                        <Text style={{  fontSize: 18,
    color: "#fff",
    fontFamily: 'opensans-bold',
    alignSelf: "center",
}}>Create Account</Text>
                </Pressable>
                </LinearGradient>
      </View>
     
     
      

      
       
      </Container>
      // <Container style={styles.container}>
      //   <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
      //     <Content contentContainerStyle={styles.authBodyContent}>
      //       <ScrollView>

      //         <Text uppercase={true}
      //           style={[styles.welcome, { color: '#fff' }]}> {CURRENT_APP_NAME}</Text>

      //         <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>
      //           <View style={{ flex: 1 }}>
      //             <ModalPopup
      //               errorMessageText={loginErrorMsg}
      //               closeButtonText={'CLOSE'}
      //               closeButtonAction={() => this.setState({ isModalVisible: !isModalVisible })}
      //               visible={isModalVisible} />
      //           </View>
      //           <View style={{ marginLeft: 10, marginRight: 10 }}>
      //             <Text uppercase={true} style={[styles.cardHead, { color: primaryColor }]}>Login</Text>

      //             <Form>
      //               <Label style={{ marginTop: 20, fontSize: 15, color: primaryColor, fontFamily:'opensans-bold' }}>{ isSelected === 'corporate_user' ? "Email" : "Mobile Number/ Email"}</Label>
      //               <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto', }}>
      //                 <Input placeholder={ isSelected === 'corporate_user' ? "Email" : "Mobile Number / Email"} style={styles.authTransparentLabel}
      //                   ref={(input) => { this.enterTextInputEmail = input; }}
      //                   returnKeyType={'next'}
      //                   value={userEntry}
      //                   keyboardType={"default"}
      //                   onChangeText={userEntry => this.setState({ userEntry })/*acceptNumbersOnly(userEntry) == true || userEntry === '' ? this.setState({ userEntry }) : null */}
      //                   autoCapitalize='none'
      //                   blurOnSubmit={false}
      //                   onSubmitEditing={() => { this.userEntry._root.focus(); }}
      //                 />
      //               </Item>
      //               <Label style={{ fontSize: 15, marginTop: 10, color: primaryColor, fontFamily: 'opensans-bold' }}>Password</Label>
      //               <Item style={[styles.authTransparentLabel1, { marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }]}>
      //                 <Input placeholder="Password" style={{ fontSize: 15, fontFamily: 'Roboto', paddingLeft: 15, }}
      //                   ref={(input) => { this.userEntry = input; }}
      //                   secureTextEntry={true}
      //                   returnKeyType={'done'}
      //                   value={password}
      //                   secureTextEntry={showPassword}
      //                   autoCapitalize='none'
      //                   onChangeText={password => this.setState({ password })}
      //                   // blurOnSubmit={false}
      //                   onSubmitEditing={() => { (userEntry && password) != '' ? this.doLogin() : this.enterTextInputEmail._root.focus() }}
      //                 />


      //                 {showPassword == true ? <Icon active name='eye' style={{ fontSize: 20, marginTop: 5, color: primaryColor }} onPress={() => this.setState({ showPassword: !showPassword })} />
      //                   : <Icon active name='eye-off' style={{ fontSize: 20, marginTop: 5, color: primaryColor }} onPress={() => this.setState({ showPassword: !showPassword })} />
      //                 }
      //               </Item>
                    // {CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ?
                    //   <Row style={{ marginTop: 10 }}>
                    //      <Col size={4}>
                    //       <Row style={{ alignItems: 'center' }}>
                    //         <Radio
                    //           color={primaryColor}
                    //         selectedColor={primaryColor}
                    //           standardStyle={true}
                    //           selected={ isSelected === 'corporate_user'}
                    //           onPress={() => this.setState({  isSelected: 'corporate_user', addPatientDataPoPupEnable: true, patientDetailsObj: {} })}
                    //         />
                    //         <Text style={styles.firstCheckBox}>Corporate</Text>
                    //       </Row>
                    //     </Col>
                    //     <Col size={3}>
                    //       <Row style={{ alignItems: 'center' }}>
                    //         <Radio
                    //           color={primaryColor}
                    //          selectedColor={primaryColor}
                    //           standardStyle={true}
                    //           selected={ isSelected === 'user'}
                    //           onPress={() => this.setState({  isSelected: 'user', patientDetailsObj: this.defaultPatDetails })}
                    //         />
                    //         <Text style={styles.firstCheckBox}>User</Text>
                    //       </Row>
                    //     </Col>
                       
                    //     <Col size={3}>
                    //     </Col>
                    //   </Row>
                    //   : null}
      //               <Row style={{ marginTop: 20, }}>
      //                 <Right>
      //                   <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
      //                     <Text style={styles.customText}> Forgot Password?</Text>
      //                   </TouchableOpacity>
      //                 </Right>
      //               </Row>
      //               {isLoading ?
      //                 <Spinner
      //                   visible={isLoading}
      //                 /> : null}
      //               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      //                 <TouchableOpacity small
      //                   style={(userEntry && password) == '' ? styles.loginButton1Disable : styles.loginButton1}
      //                   disabled={isLoading}
      //                   block success disabled={(userEntry && password) == ''} onPress={() => this.doLogin()}>
      //                   <Text uppercase={true} style={styles.ButtonText}>Login </Text>
      //                 </TouchableOpacity>
      //                 {/* <Text style={{ color: 'red', fontSize: 15, fontFamily: 'Roboto', marginTop: 2 }}>{loginErrorMsg}</Text> */}
      //               </View>

      //               <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10 }}>
      //                 <Text uppercase={false} style={{ color: '#000', fontSize: 14, fontFamily: 'Roboto', color: primaryColor }}>Don't Have An Account ?</Text>
      //                 <TouchableOpacity onPress={() => {
      //                   this.props.navigation.navigate('signup')
      //                 }} style={styles.smallSignUpButton}>
      //                   <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'opensans-bold', color: '#fff' }}> Sign Up</Text>
      //                 </TouchableOpacity>
      //               </Item>
      //             </Form>
      //           </View>
      //         </Card>
      //       </ScrollView>
      //     </Content>
      //   </ImageBackground>
      // </Container>
    )
  }
}

function loginState(state) {
  return {
    user: state.user
  }
}
export default connect(loginState)(Login)

