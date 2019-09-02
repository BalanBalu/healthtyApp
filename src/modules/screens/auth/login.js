import React, { Component } from 'react';
import {
  Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right,
   Grid, Toast, KeyboardAvoidingView, Icon,Row
} from 'native-base';
import { connect } from 'react-redux'
import { Image, TouchableOpacity, View, ScrollView, AsyncStorage } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { login, RESET_REDIRECT_NOTICE } from '../../providers/auth/auth.actions';
import styles from '../../screens/auth/styles'
import Spinner from '../../../components/Spinner';
import { store } from '../../../setup/store';
import { fetchUserProfile } from '../../providers/profile/profile.action';

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
            let fields = "first_name,last_name,gender,dob,mobile_no,email"
            let result = await fetchUserProfile(userId, fields);
            if (!result.error) {
              await AsyncStorage.setItem('basicProfileData', JSON.stringify(result))
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
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            <Spinner color='blue'
              visible={isLoading}
              textContent={'Loading...'}
            />
            <View >
            <Text style={styles.welcome}>Welcome To Patient Medflic</Text>
            <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />


            <Form>
              
              <Item style={{ borderBottomWidth: 0, marginTop: 20 }}>
                <Input placeholder="Email Or Phone" style={styles.transparentLabel}
                  returnKeyType={'next'}
                  value={this.state.userEntry}
                  keyboardType={'email-address'}
                  onChangeText={userEntry => this.setState({ userEntry })}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.userEntry._root.focus(); }}
                />
              </Item>

              <Item success style={styles.transparentLabel1}>
                <Input placeholder="Password" style={{fontSize:15,fontFamily:'OpenSans',paddingLeft: 20,}}
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
                <Icon active name='eye' style={{ fontSize: 20, marginTop: 10 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })} />
              </Item>


              <Row style={{ marginTop: 20, borderBottomWidth: 0 }}>

                <Item style={{ borderBottomWidth: 0 }}>
                  {/* <CheckBox  checked={this.state.conditionCheck}

                    color="green" onPress={() => this.setState({ conditionCheck: !this.state.conditionCheck })} style={{borderRadius:5}}
                  ></CheckBox> */}
                   <Checkbox color="green"
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => { this.setState({ checked: !checked }); }}
                     />
                  <Text style={{ marginLeft: 5, color: 'gray', fontFamily: 'OpenSans',fontSize:15 }}>Remember me</Text>
                </Item>

                <Right>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                    <Text style={styles.customText}> Forgot Password</Text>
                  </TouchableOpacity>
                </Right>
              </Row>

              <Button style={styles.loginButton} block primary
                disabled={isLoading}
                onPress={() => this.doLogin()}>
                <Text style={styles.ButtonText}>Sign In</Text>
              </Button>
              <Text style={{ color: 'red', paddingLeft: 20, fontSize: 15, fontFamily: 'OpenSans', marginBottom: 30 }}>{loginErrorMsg != null ? '*' + loginErrorMsg : null}</Text>
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

