import React, { Component } from 'react';
import { Container, Content, Button, Text, Form, Item, Input, Header, Footer, FooterTab, Right, CheckBox, Grid, Toast } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '../../screens/auth/styles'
import Spinner from '../../../components/Spinner';
class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: ''
    }
  }

  doLogin = async () => {
    try {
      let requestData = {
        userEntry: this.state.userEntry,
        password: this.state.password,
        type: 'user'
      };
      await login(requestData);
      console.log(this.props.user);
      if (this.props.user.isAuthenticated) {
        this.props.navigation.navigate('Home');
      } else {
        Toast.show({
          text: this.props.user.message,
          timeout: 3000
        })
      }

    } catch (e) {
      console.log(e);
    }

  }

  render() {
    const { user: { isLoading } } = this.props;
    const { loginErrorMsg } = this.state;
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>

          <Spinner color='blue'
            visible={isLoading}
            textContent={'Loading...'}
          />
          <Text style={styles.welcome}>Welcome</Text>
          <Image source={{ uri: 'https://static1.squarespace.com/static/582bbfef9de4bb07fe62ab18/t/5877b9ccebbd1a124af66dfe/1484241404624/Headshot+-+Circular.png?format=300w' }} style={styles.logo} />

          <Form>
            {/* <View style={styles.errorMsg}>
              <Text style={{textAlign:'center',color:'#775DA3'}}> Invalid Credencials</Text>
            </View> */}
            <Item style={{ borderBottomWidth: 0 }}>
              <Input placeholder="Email Or Phone" style={styles.transparentLabel}
                returnKeyType={'next'}
                value={this.state.userEntry}
                keyboardType={'email-address'}
                onChangeText={userEntry => this.setState({ userEntry })}
                blurOnSubmit={false}
                onSubmitEditing={() => { this.userEntry._root.focus(); }}
              />
            </Item>

            <Item style={{ borderBottomWidth: 0 }}>
              <Input placeholder="Password" style={styles.transparentLabel}
                getRef={(input) => { this.userEntry = input; }}
                secureTextEntry={true}
                returnKeyType={'go'}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Item>

            <Item style={{ marginTop: 10, borderBottomWidth: 0 }}>

              <Item style={{ borderBottomWidth: 0, }}>
                <CheckBox checked={true} color="green" style={{ marginLeft: -7, }} ></CheckBox>
                <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Remember me</Text>
              </Item>

              <Right>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpassword')}>
                  <Text style={styles.customText}> Forgot Password</Text>
                </TouchableOpacity>
              </Right>
            </Item>

            <Button style={styles.loginButton} block primary
              disabled={isLoading}
              onPress={() => this.doLogin()}>
              <Text>Sign In</Text>
            </Button>
            <Text style={{ color: '#000', fontSize: 15, fontFamily: 'OpenSans', textAlign: 'center' }}>{loginErrorMsg}</Text>
          </Form>

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
