import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {
  Container,
  Input,
  Item,
  Content,
  Icon
} from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { subTimeUnit, addTimeUnit, formatDate } from "../../../../setup/helpers";
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from '../Styles'
import ModalPopup from '../../../../components/Shared/ModalPopup';
import { acceptNumbersOnly } from '../../../common';
import { serviceOfClaimIntimation } from '../../../providers/corporate/corporate.actions';

export default class ClaimInitiationSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      policyNo: '',
      memberId: '',
      hospitalName: '',
      ailment: '',
      contactNum: '',
      selectedAdmissionDate: '',
      errorMsg: '',
      isVisibleDatePicker: false,
      isModalVisible: false,
      isLoading: false,
    };
    this.memberInfo = props.navigation.getParam('memberInfo');
  }
  async UNSAFE_componentWillMount() {
    await this.setState({ policyNo: this.memberInfo && this.memberInfo.policyNo, memberId: this.memberInfo && this.memberInfo.memberId })

  }

  onPressConfirmDateValue = (date) => {
    try {
      this.setState({ isVisibleDatePicker: false, selectedAdmissionDate: date })
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  }
  onPressSubmitClaimData = async () => {
    const { policyNo, memberId, hospitalName, selectedAdmissionDate, ailment, contactNum } = this.state;
    try {
      if (!policyNo) {
        this.setState({ errorMsg: 'Please Enter Policy number', isModalVisible: true });
        return false;
      }
      if (!memberId) {
        this.setState({ errorMsg: "Please Enter Member Id", isModalVisible: true });
        return false;
      }
      if (!hospitalName) {
        this.setState({ errorMsg: "Please Enter Hospital name", isModalVisible: true });
        return false;
      }
      if (!selectedAdmissionDate) {
        this.setState({ errorMsg: "Please Choose Date of Admission", isModalVisible: true });
        return false;
      }
      if (!ailment) {
        this.setState({ errorMsg: "Please Enter Ailment", isModalVisible: true });
        return false;
      }
      if (!contactNum) {
        this.setState({ errorMsg: "Please Enter Member Contact Number", isModalVisible: true });
        return false;
      }
      this.setState({ isLoading: true })
      const claimIntimationReqData = {
        email:this.memberInfo&&this.memberInfo.emailId?this.memberInfo.emailId:null,
        policyNo,
        memberId,
        hospitalName,
        dateOfAdmission: selectedAdmissionDate,
        ailment,
        contactNumber: contactNum,
        status: 'REQUEST-SENT'
      }
      const claimUpdateResp = await serviceOfClaimIntimation(claimIntimationReqData);
      if (claimUpdateResp && claimUpdateResp.referenceNumber) {
        this.props.navigation.navigate('ClaimIntimationSuccess',{referenceNumber:claimUpdateResp.referenceNumber});
      }
      else if (claimUpdateResp && claimUpdateResp.success === false) {
        this.setState({ errorMsg: ' Error : Unable to Submit Claim Request', isModalVisible: true })
      }
    } catch (error) {
      this.setState({ errorMsg: 'Something Went Wrong' + error.message, isModalVisible: true })
    }
    finally {
      this.setState({ isLoading: false })
    }
  }
  render() {
    const { policyNo, memberId, hospitalName, ailment, contactNum, selectedAdmissionDate, isVisibleDatePicker, isModalVisible, errorMsg, isLoading } = this.state;
    return (
      <Container>
        <Content>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Policy Number
            </Text>
              <Item regular style={{ borderRadius: 6 }}>
                <Input
                  placeholder="Enter Policy Number"
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={policyNo}
                  keyboardType={"default"}
                  onChangeText={enteredPolicyText => this.setState({ policyNo: enteredPolicyText })}
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.enteredPolicyText._root.focus(); }}
                />
              </Item>
            </Col>
          </Row>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Member Id
            </Text>

              <Item regular style={{ borderRadius: 6 }}>
                <Input
                  ref={(input) => { this.enteredPolicyText = input; }}
                  placeholder="Enter Member Id"
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={memberId}
                  keyboardType={"number-pad"}
                  onChangeText={enteredMemberIdText => this.setState({ memberId: enteredMemberIdText })}
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.enteredMemberIdText._root.focus(); }}
                />
              </Item>
            </Col>
          </Row>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Hospital
            </Text>
              <Item regular style={{ borderRadius: 6 }}>
                <Input
                  ref={(input) => { this.enteredMemberIdText = input; }}
                  placeholder="Enter Hospital name"
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'done'}
                  value={hospitalName}
                  keyboardType={"default"}
                  onChangeText={hospitalName => this.setState({ hospitalName })}
                />
              </Item>
            </Col>
          </Row>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Date of Admission
            </Text>
              <Item regular style={{ borderRadius: 6, height: 50, width: 370 }}>
                <TouchableOpacity onPress={() => { this.setState({ isVisibleDatePicker: !isVisibleDatePicker }) }} style={{ flexDirection: 'row' }}>
                  <Icon name='md-calendar' style={{ padding: 5, fontSize: 20, marginTop: 1, color: '#7F49C3' }} />
                  <Text style={selectedAdmissionDate ? { marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', } : { color: '#909090' }}>{selectedAdmissionDate ? formatDate(selectedAdmissionDate, 'DD/MM/YYYY') : 'Date of Birth'}</Text>
                  <DateTimePicker
                    mode={'date'}
                    minimumDate={subTimeUnit(new Date(), 8, 'days')}
                    maximumDate={addTimeUnit(new Date(), 8, 'days')}
                    value={selectedAdmissionDate}
                    isVisible={isVisibleDatePicker}
                    onConfirm={this.onPressConfirmDateValue}
                    onCancel={() => this.setState({ isVisibleDatePicker: !isVisibleDatePicker })}
                  />
                </TouchableOpacity>
              </Item>
            </Col>
          </Row>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Ailment
            </Text>
              <Item regular style={{ borderRadius: 6 }}>
                <Input
                  placeholder="Enter Ailment"
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={ailment}
                  keyboardType={"default"}
                  onChangeText={ailment => this.setState({ ailment })}
                  blurOnSubmit={false}
                  onSubmitEditing={() => { this.ailment._root.focus(); }}
                />
              </Item>
            </Col>
          </Row>
          <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
            <Col size={1}>
              <Text
                style={styles.text}>
                Contact Number
            </Text>
              <Item regular style={{ borderRadius: 6 }}>
                <Input
                  ref={(input) => { this.ailment = input; }}
                  placeholder="Enter Contact number"
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'done'}
                  value={contactNum}
                  keyboardType={"number-pad"}
                  onChangeText={contactNum => acceptNumbersOnly(contactNum) == true || contactNum === '' ? this.setState({ contactNum }) : null}
                />
              </Item>
            </Col>
          </Row>
          <View style={{ flex: 1 }}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() => this.setState({ isModalVisible: !isModalVisible })}
              visible={isModalVisible} />
          </View>
          {isLoading ?
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color='blue'
              />
            </View>
            :
            <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20 }}>
              <Col size={4}>
                <View style={{ display: 'flex' }}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => this.onPressSubmitClaimData()} style={styles.appButtonContainer}>
                      <Text style={styles.appButtonText}>SUBMIT</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Col>
            </Row>
          }
        </Content>
      </Container>
    );
  }
}

