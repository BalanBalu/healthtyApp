import React, { Component } from 'react';
import { Container, Content, Text, Form, Item, Button, Input, H1, Card, primary, primaryGradient1, primaryGradient2, locations } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { userInitialState } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {primaryColor} from '../../../setup/config'

class FindDoctor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userEntry: '',
      password: '',
      loginErrorMsg: ''
    }
  }


  render() {
    const { user: { isLoading } } = this.props;
    const { loginErrorMsg } = this.state;
    return (
      <Container style={styles.container}>

        <LinearGradient
          style={{ flex: 1 }}
          colors={['#6595D8', '#4DC9EF']}
          locations={locations}>
      
          <Content style={styles.bodyContent}>

            <H1 style={{ color: '#fff' }}>We Care About</H1>
            <H1 style={{ color: '#fff' }}>Your Health</H1>
            <Card style={styles.customCard}>
              <Form style={{ marginTop: 30 }}>
                <Text style={styles.leftValue}>What Are You Looking For</Text>
                <Item style={{ borderBottomWidth: 0, marginBottom: 5 }}>
                  <Input placeholder="General Consultation" style={styles.transparentLabel}


                  />
                </Item>
                <Text style={styles.leftValue}>Location</Text>
                <Item style={{ borderBottomWidth: 0, marginBottom: 5 }}>
                  <Input placeholder="Location" style={styles.transparentLabel}

                  />
                </Item>
                <Text style={styles.leftValue}>Pin</Text>
                <Item style={{ borderBottomWidth: 0, marginBottom: 5 }}>
                  <Item style={{ borderBottomWidth: 0 }}>
                    <Input placeholder="Pin" style={styles.transparentLabel}
                    />
                  </Item>


                </Item>

                <Button style={styles.loginButton} block primary

                >
                  <Text uppercase={false}>Find Doctor!</Text>
                </Button>
              </Form>
            </Card></Content>
        </LinearGradient>
      </Container>
    )
  }

}

function loginState(state) {

  return {
    user: state.user
  }
}
export default connect(loginState, { login, messageShow, messageHide })(FindDoctor)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: primaryColor,
  },

  bodyContent: {
    top: '10%',
    paddingLeft: 30,
    paddingRight: 30,

  },

  transparentLabel: {
    borderBottomColor: 'transparent',
    backgroundColor: '#F1F1F1',
    height: 45,
    marginTop: 5,
    borderRadius: 5,
    marginLeft: -15,
    color: 'black',

  },
  loginButton: {
    marginTop: 12,
    backgroundColor: primaryColor,
    borderRadius: 5,
    marginBottom: 50,
    fontSize: 15,
    fontWeight: 'bold'

  },

  customCard: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20
  },
  leftValue: {
    fontSize: 12,
    marginTop: 5
  }

});