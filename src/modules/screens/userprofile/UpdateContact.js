import React, {Component} from 'react';
import {
  Container,
  Content,
  Text,
  Button,
  H3,
  Item,
  List,
  CheckBox,
  Row,
  Col,
  Left,
  Right,
  Picker,
  Body,
  Icon,
  Card,
  Input,
  Toast,
  View,
} from 'native-base';
import {updateMemberDetails} from '../../providers/auth/auth.actions';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalPopup from '../../../components/Shared/ModalPopup';

import {connect} from 'react-redux';
import styles from './style.js';
import Spinner from '../../../components/Spinner';
import {acceptNumbersOnly} from '../../common';
import {translate} from '../../../setup/translator.helper'

class UpdateContact extends Component {
  numberCategory = ['Home', 'Emergency'];

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      active: true,
      isLoading: false,
      errorMsg: '',
      OTPRequestSend: false,
      isModalVisible: false,
      id: props.navigation.getParam('id') || null,
      fromProfile:props.navigation.getParam('fromProfile') || false,
      userData: props.navigation.getParam('updatedata')||null,

    };
  }

  componentDidMount() {
    this.bindContactValues();
  }

  bindContactValues() {
    if (this.state.fromProfile) {
      this.setState({
        mobile: this.state.userData.mobile ? this.state.userData.mobile : null,
        fromProfile: true,
      });
    }
  }

  commonUpdateContactMethod = async () => {
    const {mobile, id} = this.state;
    try {
      if (!mobile) {
        this.setState({
          errorMsg: translate('Please enter mobile number'),
          isModalVisible: true,
        });
        return false;
      }
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      this.setState({errorMsg: '', isLoading: true});
      let requestData = {
        mobile: mobile,
        _id: id,
        emailId:memberEmailId,
      };
      let response = await updateMemberDetails(requestData);
      if (response) {
        Toast.show({
          text: translate('Contacts has been saved'),
          type: 'success',
          duration: 3000,
        });
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

  render() {
    return (
      <Container style={styles.container}>
        <Spinner color="blue" visible={this.state.isLoading} />

        <Content contentContainerStyle={styles.bodyContent1}>
          <ScrollView>
            <View style={{marginTop: 10, padding: 10}}>
              <Text style={styles.headerText}>{translate("Update Mobile Number")}</Text>
              <View style={styles.cardEmail}>
                <Item style={{borderBottomWidth: 0}}>
                  <Col>
                    <Text>{translate("Mobile Number")}</Text>
                    <Row>
                      <Icon name="call" style={styles.centeredIcons}></Icon>
                      <Input
                        placeholder={translate("Edit Your Number")}
                        style={styles.transparentLabel}
                        keyboardType="numeric"
                        onChangeText={(mobile) =>
                          this.setState({mobile})
                        }
                        value={String(this.state.mobile)}
                        testID="updateContactNo"
                      />
                    </Row>
                  </Col>
                </Item>

                <Item style={{borderBottomWidth: 0, marginTop: 15}}>
                  <Right>
                    <Button
                      success
                      style={styles.button2}
                      onPress={() => this.commonUpdateContactMethod()}
                      testID="clickUpdateContact">
                      <Text uppercase={false} note style={styles.buttonText}>
                        {translate("Update")}
                      </Text>
                    </Button>
                  </Right>
                </Item>
              </View>
            </View>
          </ScrollView>
          <View style={{flex: 1}}>
            <ModalPopup
              errorMessageText={this.state.errorMsg}
              closeButtonText={translate('CLOSE')}
              closeButtonAction={() =>
                this.setState({isModalVisible: !this.state.isModalVisible})
              }
              visible={this.state.isModalVisible}
            />
          </View>
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
export default connect(profileState)(UpdateContact);
