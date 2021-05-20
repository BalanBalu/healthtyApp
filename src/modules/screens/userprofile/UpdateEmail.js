import React, { Component } from 'react';
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
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { connect } from 'react-redux';
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import { validateEmailAddress } from '../../common';
import { memberEmailValidation } from '../../providers/corporate/corporate.actions';
import ModalPopup from '../../../components/Shared/ModalPopup';
import {translate} from '../../../setup/translator.helper';

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
      updateButton: true,

    };
  }
  componentDidMount() {
    this.bindEmailValues();
  }

  bindEmailValues = async () => {
    if (this.state.fromProfile) {
      this.setState({
        emailId: this.state.userData.emailId, updateButton: true,
      });
    }
  };


  memberEmailValidation = async () => {
    try {
      if (validateEmailAddress(this.state.emailId) == false) {
        this.setState({
          errorMsg: 'Kindly enter valid mail id', isModalVisible: true,
        });
        return false;
      }
      let memberId = (await AsyncStorage.getItem('memberId')) || null;
      let response = await memberEmailValidation(this.state.emailId, memberId);
      if (response || this.state.emailId == this.state.userData.emailId) {
        this.setState({
          emailId: '',
          errorMsg: 'Email already exist',
          isModalVisible: true,
          updateButton: true,
        });
        return false;
      }
      this.setState({ memberId: this.state.memberId, updateButton: false });
      let requestData = {
        emailId: this.state.emailId,
        _id: this.state.id,
      };
      this.props.navigation.navigate('RenderVerifyEmailOtp', { requestData: requestData })
    } catch (error) {
      console.log('Ex is getting on validate member emailId', error);
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            <View style={{marginTop: 30}}>
              <Text style={styles.headerText}>{translate("Update Email")}</Text>

              <Card style={styles.cardEmail}>
                <Item
                  style={{ borderBottomWidth: 0, marginTop: 12, marginLeft: 4 }}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: 15,
                      fontFamily: 'Roboto',
                      marginTop: 5,
                      marginLeft: 7,
                    }}>
                    {translate("Email")}
                  </Text>
                </Item>

                <Item style={{ borderBottomWidth: 0 }}>
                  <Icon name="mail" style={styles.centeredIcons}></Icon>
                  <Input
                    placeholder={translate("Edit Your Email")}
                    style={styles.transparentLabel}
                    keyboardType="email-address"
                    onChangeText={(emailId) => this.setState({ emailId, updateButton: false })}
                    value={this.state.emailId}
                    onSubmitEditing={() => {
                      this.memberEmailValidation();
                    }}
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
                  <Row style={{ width: '100%' }}>
                    <Right>
                      <Button
                        success
                        disabled={this.state.updateButton}
                        style={styles.button2}
                        onPress={() => this.memberEmailValidation()}
                        testID="clickUpdateEmail">
                        <Text style={styles.buttonText}>{translate("Update")}</Text>
                      </Button>
                    </Right>
                  </Row>
                </Item>
              </Card>
              <View style={{ flex: 1 }}>
                <ModalPopup
                  errorMessageText={this.state.errorMsg}
                  closeButtonText={translate('CLOSE')}
                  closeButtonAction={() =>
                    this.setState({ isModalVisible: !this.state.isModalVisible })
                  }
                  visible={this.state.isModalVisible}
                />
              </View>
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
