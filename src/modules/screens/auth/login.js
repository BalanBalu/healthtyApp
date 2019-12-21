import React, { Component } from 'react';
import {
  Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right,
  Grid, Toast, KeyboardAvoidingView, Icon, Row,Card,Label,Left
} from 'native-base';
import { connect } from 'react-redux'
import { Image, TouchableOpacity, View, ScrollView, AsyncStorage ,ImageBackground} from 'react-native';
import { Checkbox } from 'react-native-paper';

import { login, RESET_REDIRECT_NOTICE, userFiledsUpdate } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles'
import Spinner from '../../../components/Spinner';
import { store } from '../../../setup/store';
import { fetchUserProfile, storeBasicProfile } from '../../providers/profile/profile.action';
const mainBg  = require('../../../../assets/images/MainBg.jpg')
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

  doLogin = async () => {
    try {
      if (this.state.userEntry != '' && this.state.password != '') {
        let requestData = {
          userEntry: this.state.userEntry,
          password: this.state.password,
          type: 'user'
        };

        let result = await login(requestData);
        console.log('result' + JSON.stringify(result))
        console.log(this.props.user);
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
          Toast.show({
            text: this.props.user.message,
            timeout: 50000
          })
        }
      } else {
        this.setState({ loginErrorMsg: "Your login credentials are not valid" })
      }
    } catch (e) {
      console.log(e);
    }
  }
  getUserProfile = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      let fields = "first_name,last_name,gender,dob,mobile_no,email,profile_image"
      let result = await fetchUserProfile(userId, fields);
      if (!result.error) {
        storeBasicProfile(result)
      }

    }
    catch (e) {
      console.log(e);
    }
  }
  render() {
    const { user: { isLoading } } = this.props;
    const { loginErrorMsg } = this.state;
    const { checked } = this.state;
    return (
      <Container style={styles.container}>
                   <ImageBackground source={mainBg} style={{width: '100%', height: '100%', flex: 1 }}>

        <Content contentContainerStyle={styles.authBodyContent}>
          <ScrollView>
            <Spinner color='blue'
              visible={isLoading}
              textContent={'Loading...'}
            />
              <Text uppercase={true}  
                style={[styles.welcome, {color:'#fff'}]}> Medflic</Text>

<Card style={{borderRadius:10,padding:5,marginTop:20}}>
  <View style={{marginLeft:10,marginRight:10}}>
  <Text uppercase={true} style={[styles.cardHead,{color:'#775DA3'}]}>Login</Text>
              <Form>
              <Label style={{marginTop: 20,fontSize:15,color:'#775DA3',fontWeight:'bold'}}>Email / Phone</Label>
                <Item style={{ borderBottomWidth: 0 ,marginLeft:'auto',marginRight:'auto',}}>
                  <Input placeholder="Email Or Phone" style={styles.authTransparentLabel}
                    returnKeyType={'next'}
                    value={this.state.userEntry}
                    keyboardType={'email-address'}
                    onChangeText={userEntry => this.setState({ userEntry })}
                    autoCapitalize='none'
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this.userEntry._root.focus(); }}
                  />
                </Item>
                <Label style={{fontSize:15,marginTop:10,color:'#775DA3',fontWeight:'bold'}}>Password</Label>
                <Item   style={[styles.authTransparentLabel1,{marginTop:10,marginLeft:'auto',marginRight:'auto'}]}>
                  <Input placeholder="Password" style={{ fontSize: 15, fontFamily: 'OpenSans', paddingLeft: 15, }}
                    ref={(input) => { this.userEntry = input; }}
                    secureTextEntry={true}
                    returnKeyType={'done'}
                    value={this.state.password}
                    secureTextEntry={this.state.showPassword}
                    autoCapitalize='none'
                    onChangeText={password => this.setState({ password })}
                    blurOnSubmit={false}
                    onSubmitEditing={() => { this.doLogin(); }}

                  />
                  <Icon active name='eye' style={{ fontSize: 20, marginTop: 5,color:'#775DA3' }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
                </Item>


                <Row style={{ marginTop: 20, }}>

                  
                    {/* <CheckBox  checked={this.state.conditionCheck}

                    color="green" onPress={() => this.setState({ conditionCheck: !this.state.conditionCheck })} style={{borderRadius:5}}
                  ></CheckBox> */}
                  {/* <Left style={{flexDirection:'row'}}>
                    <Checkbox color="#775DA3"
                      borderStyle={{
                        borderColor: '#F44336',
                        backfaceVisibility: 'visible',
                        borderRadius: 18,
                        borderWidth: 1,
                      }}
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => { this.setState({ checked: !checked }); }}
                    />
                    <Text style={{ marginLeft: 2, color: 'gray', fontFamily: 'OpenSans', fontSize: 15, marginTop:10,color:'#775DA3',}}>Remember me</Text>
                    </Left> */}

                  <Right>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                      <Text style={styles.customText}> Forgot Password?</Text>
                    </TouchableOpacity>
                  </Right>
                </Row>
<View style={{alignItems:'center',justifyContent:'center'}}>

             <TouchableOpacity small style={styles.loginButton1} 
                  disabled={isLoading}
                  onPress={() => this.doLogin()}>
                  <Text uppercase={true} style={styles.ButtonText}>Login </Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', fontSize: 15, fontFamily: 'OpenSans',marginTop:2  }}>{loginErrorMsg != null ? '*' + loginErrorMsg : null}</Text>
</View>
                
              <Item style={{marginLeft:'auto',marginRight:'auto',borderBottomWidth:0,marginBottom:10}}>
              <Text uppercase={false} style={{ color: '#000', fontSize: 14, fontFamily: 'OpenSans',color:'#775DA3' }}>Don't Have An Account ?</Text>
              <TouchableOpacity  onPress={() => this.props.navigation.navigate('signup')} style={styles.smallSignUpButton}>
              <Text uppercase={true} style={{ color: '#000', fontSize: 10, fontFamily: 'OpenSans',fontWeight:'bold',color:'#fff' }}> Sign Up</Text>
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

