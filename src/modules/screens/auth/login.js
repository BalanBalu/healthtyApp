import React, { Component } from 'react';
import {
  Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right,
  Grid, Toast, KeyboardAvoidingView, Icon, Row, Card, Label, Left, Col, Radio
} from 'native-base';
import { connect } from 'react-redux'
import { Image, TouchableOpacity, View, ScrollView, AsyncStorage, ImageBackground } from 'react-native';
import { login, RESET_REDIRECT_NOTICE,SmartHealthlogin } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles'
import { store } from '../../../setup/store';
import { fetchUserProfile, storeBasicProfile } from '../../providers/profile/profile.action';
import { acceptNumbersOnly } from '../../screens/../common';
const mainBg = require('../../../../assets/images/MainBg.jpg');
import Spinner from '../../../components/Spinner';
import Razorpay from 'react-native-customui';
import ModalPopup from '../../../components/Shared/ModalPopup';
import { CURRENT_APP_NAME, MY_SMART_HEALTH_CARE } from "../../../setup/config";
class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: '',
      checked: false,
      isModalVisible: false,
      showPassword: true,
      isSelected:CURRENT_APP_NAME=== MY_SMART_HEALTH_CARE?'corporate_user':'user',
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
        this.getUserProfile();
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
  getUserProfile = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      let fields = "first_name,last_name,gender,dob,mobile_no,email,profile_image,middle_name"
      let result = await fetchUserProfile(userId, fields);
      if (!result.error) storeBasicProfile(result)
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    const { user: { isLoading } } = this.props;
    const { userEntry, password, showPassword, loginErrorMsg, isModalVisible, isSelected } = this.state;
    return (
      <Container style={styles.container}>
        <ImageBackground source={mainBg} style={{ width: '100%', height: '100%', flex: 1 }}>
          <Content contentContainerStyle={styles.authBodyContent}>
            <ScrollView>

              <Text uppercase={true}
                style={[styles.welcome, { color: '#fff' }]}> {CURRENT_APP_NAME}</Text>

              <Card style={{ borderRadius: 10, padding: 5, marginTop: 20 }}>
                <View style={{ flex: 1 }}>
                  <ModalPopup
                    errorMessageText={loginErrorMsg}
                    closeButtonText={'CLOSE'}
                    closeButtonAction={() => this.setState({ isModalVisible: !isModalVisible })}
                    visible={isModalVisible} />
                </View>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                  <Text uppercase={true} style={[styles.cardHead, { color: '#775DA3' }]}>Login</Text>

                  <Form>
                    <Label style={{ marginTop: 20, fontSize: 15, color: '#775DA3', fontWeight: 'bold' }}>{isSelected === 'corporate_user' ? "Email" : "Mobile Number/ Email"}</Label>
                    <Item style={{ borderBottomWidth: 0, marginLeft: 'auto', marginRight: 'auto', }}>
                      <Input placeholder={isSelected === 'corporate_user' ? "Email" : "Mobile Number / Email"} style={styles.authTransparentLabel}
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
                    <Label style={{ fontSize: 15, marginTop: 10, color: '#775DA3', fontWeight: 'bold' }}>Password</Label>
                    <Item style={[styles.authTransparentLabel1, { marginTop: 10, marginLeft: 'auto', marginRight: 'auto' }]}>
                      <Input placeholder="Password" style={{ fontSize: 15, fontFamily: 'OpenSans', paddingLeft: 15, }}
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


                      {showPassword == true ? <Icon active name='eye' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                        : <Icon active name='eye-off' style={{ fontSize: 20, marginTop: 5, color: '#775DA3' }} onPress={() => this.setState({ showPassword: !showPassword })} />
                      }
                    </Item>
                    {CURRENT_APP_NAME === MY_SMART_HEALTH_CARE ?
                      <Row style={{ marginTop: 10 }}>
                         <Col size={3}>
                          <Row style={{ alignItems: 'center' }}>
                            <Radio
                              standardStyle={true}
                              selected={isSelected === 'corporate_user'}
                              onPress={() => this.setState({ isSelected: 'corporate_user', addPatientDataPoPupEnable: true, patientDetailsObj: {} })}
                            />
                            <Text style={styles.firstCheckBox}>Corporate</Text>
                          </Row>
                        </Col>
                        <Col size={3}>
                          <Row style={{ alignItems: 'center' }}>
                            <Radio
                              standardStyle={true}
                              selected={isSelected === 'user'}
                              onPress={() => this.setState({ isSelected: 'user', patientDetailsObj: this.defaultPatDetails })}
                            />
                            <Text style={styles.firstCheckBox}>User</Text>
                          </Row>
                        </Col>
                       
                        <Col size={4}>
                        </Col>
                      </Row>
                      : null}
                    <Row style={{ marginTop: 20, }}>
                      <Right>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                          <Text style={styles.customText}> Forgot Password?</Text>
                        </TouchableOpacity>
                      </Right>
                    </Row>
                    {isLoading ?
                      <Spinner
                        visible={isLoading}
                      /> : null}
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <TouchableOpacity small
                        style={(userEntry && password) == '' ? styles.loginButton1Disable : styles.loginButton1}
                        disabled={isLoading}
                        block success disabled={(userEntry && password) == ''} onPress={() => this.doLogin()}>
                        <Text uppercase={true} style={styles.ButtonText}>Login </Text>
                      </TouchableOpacity>
                      {/* <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans', marginTop: 2 }}>{loginErrorMsg}</Text> */}
                    </View>

                    <Item style={{ marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0, marginBottom: 10 }}>
                      <Text uppercase={false} style={{ color: '#000', fontSize: 14, fontFamily: 'OpenSans', color: '#775DA3' }}>Don't Have An Account ?</Text>
                      <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('signup')
                      }} style={styles.smallSignUpButton}>
                        <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#fff' }}> Sign Up</Text>
                      </TouchableOpacity>
                    </Item>
                  </Form>
                </View>
              </Card>
            </ScrollView>
          </Content>
        </ImageBackground>
      </Container>
    )
  }
}

function loginState(state) {
  return {
    user: state.user
  }
}
export default connect(loginState)(Login)

