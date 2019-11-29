import React, { Component } from 'react';
import {
  Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right,
  Spinner, Toast, Icon, Row
} from 'native-base';
import { connect } from 'react-redux'
import { Image, TouchableOpacity, View, ScrollView, AsyncStorage } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { login, RESET_REDIRECT_NOTICE } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles'
import { store } from '../../../setup/store';
import { fetchUserProfile, storeBasicProfile } from '../../providers/profile/profile.action';
import { validateEmailAddress } from '../../screens/../common';

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: null,
      checked: false,
      showPassword: true
    }
  }

/*  Do Login with Credentials  */
doLogin = async () => {
  const { userEntry, password } = this.state;
      try {
        let requestData = {
          userEntry: userEntry,
          password: password,
          type: 'user'
        };
        if ((userEntry && password) !== '') {
          if (validateEmailAddress(userEntry) == true) {
         await login(requestData);   // Do Login Process
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
          this.props.navigation.navigate('Home');
        } else {
          this.setState({ loginErrorMsg: this.props.user.message })
        }
      } else {
         this.setState({ loginErrorMsg: 'Email address is not valid' });
      }
    }
    else {
      this.setState({ loginErrorMsg: 'Please enter Email and Password' });
    }
    setTimeout(async () => {   // set Time out for Disable the Error Messages
      await this.setState({ loginErrorMsg: '' });
    }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
  getUserProfile = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      let fields = "first_name,last_name,gender,dob,mobile_no,email,profile_image"
      let result = await fetchUserProfile(userId, fields);
      if (!result.error) storeBasicProfile(result)
    }
    catch (e) {
      console.log(e);
    }
  }
  render() {
    const { user: { isLoading } } = this.props;
    const { userEntry, password, showPassword,checked, loginErrorMsg } = this.state;
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            <View >
              <Text style={styles.welcome}>Welcome To Patient Medflic</Text>
              <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />
              <Form>
                <Item style={{ borderBottomWidth: 0, marginTop: 20 }}>
                  <Input placeholder="Enter your email" style={styles.transparentLabel}
                    ref={(input) => { this.enterTextInputEmail = input; }}
                    returnKeyType={'next'}
                    value={userEntry}
                    keyboardType={'email-address'}
                    onChangeText={userEntry => this.setState({ userEntry })}
                    autoCapitalize='none'
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this.userEntry._root.focus(); }}
                  />
                </Item>

                <Item success style={styles.transparentLabel1}>
                  <Input placeholder="Password" style={{ fontSize: 15, fontFamily: 'OpenSans', paddingLeft: 20, }}
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
                  <Icon active name='eye' style={{ fontSize: 20, marginTop: 10 }} onPress={() => this.setState({ showPassword: !showPassword })} />
                </Item>
                <Row style={{ marginTop: 20, borderBottomWidth: 0 }}>
                  <Item style={{ borderBottomWidth: 0 }}>
                    <Checkbox color="green"
                      borderStyle={{
                        borderColor: '#F44336',
                        backfaceVisibility: 'visible',
                        borderRadius: 18,
                        borderWidth: 1,
                        padding: 2,
                      }}
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => { this.setState({ checked: !checked }); }}
                    />
                    <Text style={{ marginLeft: 5, color: 'gray', fontFamily: 'OpenSans', fontSize: 15 }}>Remember me</Text>
                  </Item>
                  <Right>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                      <Text style={styles.customText}> Forgot Password</Text>
                    </TouchableOpacity>
                  </Right>
                </Row>
                {isLoading ? <Spinner color='blue' /> : null}
                <Button style={styles.loginButton} block primary
                  disabled={isLoading}
                  onPress={() => this.doLogin()}>
                  <Text style={styles.ButtonText}>Sign In</Text>
                </Button>
                <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{loginErrorMsg}</Text>
              </Form>
            </View>
          </ScrollView>
        </Content>
        <Footer >
          <FooterTab style={{ backgroundColor: '#F2F2F2', }}>
            <Button full onPress={() => this.props.navigation.navigate('signup')}>
              <Text uppercase={false} style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans' }}>Don't Have An Account ? SignUp</Text>
            </Button>
          </FooterTab>
        </Footer>
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

