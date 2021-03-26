import React, {Component} from 'react';
import {
  Container,
  Content,
  Text,
  Button,
  H3,
  Item,
  List,
  Col,
  CheckBox,
  Left,
  Right,
  Thumbnail,
  Body,
  Icon,
  Card,
  Input,
  Toast,
  View,
  Row,
} from 'native-base';
import {updateMemberDetails} from '../../providers/auth/auth.actions';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {connect} from 'react-redux';
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import {validateEmailAddress} from '../../common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

let loginData;
class UpdateEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: null,
      isLoading: false,
      errorMsg: '',
      editable: true,
      isModalVisible: false,
      id: props.navigation.getParam('id') || null,
      fromProfile: props.navigation.getParam('fromProfile') || false,
      userData: props.navigation.getParam('updatedata') || null,
    };
  }
  componentDidMount() {
    this.bindEmailValues();
  }

  bindEmailValues = async () => {
    if (this.state.fromProfile) {
      this.setState({emailId: this.state.userData.emailId});
    }
  };

  handleEmailUpdate = async () => {
    try {
      if (validateEmailAddress(this.state.emailId) == false) {
        this.setState({errorMsg: 'Kindly enter valid mail id'});
        return false;
      }
      this.setState({errorMsg: '', isLoading: true});
      let userId = await AsyncStorage.getItem('userId');
      let requestData = {
        emailId: this.state.emailId,
        _id: this.state.id,
      };

      let response = await updateMemberDetails(requestData);
      if (response) {
        Toast.show({
            text: 'Your email id is updated successfully',
            type: "success",
            duration: 3000,

        })
        await AsyncStorage.setItem('memberEmailId', this.state.emailId)
        this.props.navigation.navigate('Profile');
      } else {
        Toast.show({
          text: response.message,
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };
  verifyEmail() {
    this.props.navigation.navigate('renderOtpInput', {
      loginData: loginData,
      fromProfile: true,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            <View style={{marginTop: 30}}>
              <Text style={styles.headerText}>Update Email</Text>

              <Card style={styles.cardEmail}>
                <Item
                  style={{borderBottomWidth: 0, marginTop: 12, marginLeft: 4}}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: 15,
                      fontFamily: 'Roboto',
                      marginTop: 5,
                      marginLeft: 7,
                    }}>
                    Email
                  </Text>
                </Item>

                <Item style={{borderBottomWidth: 0}}>
                  <Icon name="mail" style={styles.centeredIcons}></Icon>
                  <Input
                    placeholder="Edit Your Email"
                    style={styles.transparentLabel}
                    keyboardType="email-address"
                    onChangeText={(emailId)=> this.setState({emailId})}
                    value={this.state.emailId}
                    testID="updateEmail"
                  />
                </Item>
                {/* <View style={{position: 'absolute', top: 70, right: 20}}>
                  <MaterialIcons
                    name="lock"
                    style={{fontSize: 20, color: 'gray'}}></MaterialIcons>
                </View> */}

                {this.state.isLoading ? (
                  <Spinner color="blue" visible={this.state.isLoading} />
                ) : null}

                <Item
                  style={{
                    borderBottomWidth: 0,
                    justifyContent: 'center',
                    marginTop: 35,
                  }}>
                  <Row style={{width: '100%'}}>
                    <Right>
                      <Button
                        success
                        style={styles.button2}
                        onPress={() => this.handleEmailUpdate()}
                        testID="clickUpdateEmail">
                        <Text style={styles.buttonText}>Update</Text>
                      </Button>
                    </Right>
                  </Row>
                </Item>
              </Card>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
function profileState(state) {
  return {
    user: state.user,
  };
}
export default connect(profileState)(UpdateEmail);
