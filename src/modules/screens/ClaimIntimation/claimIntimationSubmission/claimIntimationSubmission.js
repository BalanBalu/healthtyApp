import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Input, Item, Content, Icon} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import {subTimeUnit, addTimeUnit, formatDate} from '../../../../setup/helpers';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from '../Styles';
import ModalPopup from '../../../../components/Shared/ModalPopup';
import {primaryColor} from '../../../../setup/config';
import {serviceOfClaimIntimation} from '../../../providers/corporate/corporate.actions';
import {translate} from '../../../../setup/translator.helper';

import {acceptNumbersOnly, toastMeassage} from '../../../common';

export default class ClaimInitiationSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      policyNo: '',
      memberId: '',
      employeeId: '',
      hospitalName: '',
      ailment: '',
      contactNum: '',
      selectedAdmissionDate: '',
      selectedDischargeDate: '',
      errorMsg: '',
      isVisibleDatePicker: false,
      isModalVisible: false,
      isLoading: false,
      amount: '',
    };
    this.emailEditable = true;
    this.mIdEditable = true;
    this.memberInfo = props.navigation.getParam('memberInfo');
    this.tpaCode = props.navigation.getParam('tpaCode');
  }
  async UNSAFE_componentWillMount() {
    if (this.memberInfo && this.memberInfo.emailId) {
      this.emailEditable = false;
    }
    if (this.memberInfo && this.memberInfo.memberId) {
      this.mIdEditable = false;
    }
    await this.setState({
      policyNo: this.memberInfo && this.memberInfo.policyNo,
      name: this.memberInfo && this.memberInfo.full_name,
      email: this.memberInfo && this.memberInfo.emailId,
      memberId: this.memberInfo && this.memberInfo.memberId,
      employeeId: this.memberInfo && this.memberInfo.employeeId,
    });
  }

  onPressConfirmDateValue = (date) => {
    try {
      this.setState({isVisibleDatePicker: false, selectedAdmissionDate: date});
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  onPressDischargeDateValue = (date) => {
    try {
      this.setState({isVisibleDischargeDatePicker: false, selectedDischargeDate: date});
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  onPressSubmitClaimData = async () => {
    const {
      policyNo,
      memberId,
      employeeId,
      hospitalName,
      selectedAdmissionDate,
      selectedDischargeDate,
      ailment,
      contactNum,
      amount,
    } = this.state;
    try {
      let employeeId = await AsyncStorage.getItem('employeeCode');
      if (!policyNo) {
        this.setState({
          errorMsg: translate('Please Enter Policy number'),
          isModalVisible: true,
        });
        return false;
      }
      if (!memberId) {
        this.setState({
          errorMsg: translate('Please Enter Member Id'),
          isModalVisible: true,
        });
        return false;
      }
      if (!employeeId) {
        this.setState({
          errorMsg: translate('Please Enter Employee Id'),
          isModalVisible: true,
        });
        return false;
      }
      if (!hospitalName) {
        this.setState({
          errorMsg: translate('Please Enter Hospital name'),
          isModalVisible: true,
        });
        return false;
      }
      if (!selectedAdmissionDate) {
        this.setState({
          errorMsg: translate('Please Choose Date of Admission'),
          isModalVisible: true,
        });
        return false;
      }
      
      if (!ailment) {
        this.setState({errorMsg: translate('Please Enter Ailment'), isModalVisible: true});
        return false;
      }
      if (!amount) {
        this.setState({errorMsg: translate('Please Enter amount'), isModalVisible: true});
        return false;
      }
      if (!contactNum) {
        this.setState({
          errorMsg: translate('Please Enter Member Contact Number'),
          isModalVisible: true,
        });
        return false;
      }
      if (contactNum.length < 10) {
        this.setState({
          errorMsg: translate('Contact Number is required Min 10 Characters'),
          isModalVisible: true,
        });
        return false;
      }
      if (contactNum.length > 15) {
        this.setState({
          errorMsg: translate('Contact Number Accepted Max 15 Characters only'),
          isModalVisible: true,
        });
        return false;
      }
      this.setState({isLoading: true});
      const claimIntimationReqData = {
        email:
          this.memberInfo && this.memberInfo.emailId
            ? this.memberInfo.emailId
            : this.state.email,
        employeeName:
          this.memberInfo && this.memberInfo.full_name
            ? this.memberInfo.full_name
            : null,
        employeeId,
        policyNo,
        memberId,
        employeeId,
        hospitalName,
        dateOfAdmission: selectedAdmissionDate,
        dateOfDischarge:selectedDischargeDate,
        ailment,
        amount,
        contactNumber: contactNum,
        relationship:
          this.memberInfo && this.memberInfo.relationship
            ? this.memberInfo.relationship
            : null,
        status: 'REQUEST-SENT',
        payerCode: this.tpaCode ? this.tpaCode.tpaCode : null,
      };
      const claimUpdateResp = await serviceOfClaimIntimation(
        claimIntimationReqData,
      );
      if (claimUpdateResp && claimUpdateResp.referenceNumber) {
        this.props.navigation.navigate('ClaimIntimationSuccess', {
          referenceNumber: claimUpdateResp.referenceNumber,
          successMsg:
            translate('Your Claim Intimation request is being processed, will be notified on successful completion, your app reference id is'),
        });
      } else if (claimUpdateResp && claimUpdateResp.success === false) {
        toastMeassage(translate('Unable to Submit Claim Request'));
      }
      // if (claimIntimationReqData) {
      //   this.props.navigation.navigate('DocumentList', {
      //     docsUpload: true,
      //     data: claimIntimationReqData,
      //   });
      // } else {
      //   this.setState({
      //     errorMsg: ' Error : Unable to Continue Claim Request',
      //     isModalVisible: true,
      //   });
      // }
    } catch (error) {
      this.setState({
        errorMsg: translate('Something Went Wrong') + error.message,
        isModalVisible: true,
      });
    } finally {
      this.setState({isLoading: false});
    }
  };
  render() {
    const {
      policyNo,
      name,
      email,
      memberId,
      employeeId,
      hospitalName,
      ailment,
      contactNum,
      selectedAdmissionDate,
      selectedDischargeDate,
      isVisibleDatePicker,
      isVisibleDischargeDatePicker,
      isModalVisible,
      errorMsg,
      isLoading,
      amount,
    } = this.state;
    return (
      <Container>
        <Content>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Policy Number")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter Policy Number")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={policyNo}
                  keyboardType={'default'}
                  onChangeText={(enteredPolicyText) =>
                    this.setState({policyNo: enteredPolicyText})
                  }
                  editable={policyNo == undefined ? true : false}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.enteredPolicyText._root.focus();
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Name")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter Name")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={name}
                  keyboardType={'default'}
                  editable={name == undefined ? true : false}
                  onChangeText={(name) => this.setState({name: name})}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.name._root.focus();
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Email Id")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter mail did")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={email}
                  keyboardType={'default'}
                  editable={this.emailEditable}
                  onChangeText={(mailId) => this.setState({email: mailId})}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.mailId._root.focus();
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Member Id")}</Text>

              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter Member Id")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={memberId}
                  keyboardType={'number-pad'}
                  editable={this.mIdEditable}
                  onChangeText={(enteredMemberIdText) =>
                    this.setState({memberId: enteredMemberIdText})
                  }
                />
              </Item>
            </Col>
          </Row>

          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Employee Id")}</Text>

              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter Employee Id")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={employeeId}
                  keyboardType={'number-pad'}
                  editable={employeeId == undefined ? true : false}
                  onChangeText={(enteredEmployeeIdText) =>
                    this.setState({employeeId: enteredEmployeeIdText})
                  }
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Hospital")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  ref={(input) => {
                    this.mailId = input;
                  }}
                  placeholder={translate("Enter Hospital name")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'done'}
                  value={hospitalName}
                  keyboardType={'default'}
                  onChangeText={(hospitalName) => this.setState({hospitalName})}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Date of Admission")}</Text>
              <Item regular style={{borderRadius: 6, height: 50}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isVisibleDatePicker: !isVisibleDatePicker});
                  }}
                  style={{flexDirection: 'row'}}>
                  <Icon
                    name="md-calendar"
                    style={{
                      padding: 5,
                      fontSize: 20,
                      marginTop: 1,
                      color: primaryColor,
                    }}
                  />
                  <Text
                    style={
                      selectedAdmissionDate
                        ? {
                            marginLeft: 5,
                            fontFamily: 'Roboto',
                            fontSize: 13,
                            textAlign: 'center',
                            marginTop: 8,
                            color: '#000',
                          }
                        : {
                            color: '#909090',
                            fontFamily: 'Roboto',
                            fontSize: 13,
                            textAlign: 'center',
                            marginTop: 8,
                          }
                    }>
                    {selectedAdmissionDate
                      ? formatDate(selectedAdmissionDate, 'DD/MM/YYYY')
                      : translate('Date of Admission')}
                  </Text>
                  <DateTimePicker
                    mode={'date'}
                    minimumDate={subTimeUnit(new Date(), 7, 'days')}
                    maximumDate={new Date()}
                    value={selectedAdmissionDate}
                    isVisible={isVisibleDatePicker}
                    onConfirm={this.onPressConfirmDateValue}
                    onCancel={() =>
                      this.setState({isVisibleDatePicker: !isVisibleDatePicker})
                    }
                  />
                </TouchableOpacity>
              </Item>
            </Col>
          </Row>

          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>Date of Discharge</Text>
              <Item regular style={{borderRadius: 6, height: 50}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isVisibleDischargeDatePicker: !isVisibleDischargeDatePicker});
                  }}
                  style={{flexDirection: 'row'}}>
                  <Icon
                    name="md-calendar"
                    style={{
                      padding: 5,
                      fontSize: 20,
                      marginTop: 1,
                      color: primaryColor,
                    }}
                  />
                  <Text
                    style={
                      selectedDischargeDate
                        ? {
                            marginLeft: 5,
                            fontFamily: 'Roboto',
                            fontSize: 13,
                            textAlign: 'center',
                            marginTop: 8,
                            color: '#000',
                          }
                        : {
                            color: '#909090',
                            fontFamily: 'Roboto',
                            fontSize: 13,
                            textAlign: 'center',
                            marginTop: 8,
                          }
                    }>
                    {selectedDischargeDate
                      ? formatDate(selectedDischargeDate, 'DD/MM/YYYY')
                      : 'Date of Discharge'}
                  </Text>
                  <DateTimePicker
                    mode={'date'}
                    minimumDate={new Date()}
                    // maximumDate={new Date()}
                    value={selectedDischargeDate}
                    isVisible={isVisibleDischargeDatePicker}
                    onConfirm={this.onPressDischargeDateValue}
                    onCancel={() =>
                      this.setState({isVisibleDischargeDatePicker: !isVisibleDischargeDatePicker})
                    }
                  />
                </TouchableOpacity>
              </Item>
            </Col>
          </Row>

          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Ailment")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  placeholder={translate("Enter Ailment")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={ailment}
                  keyboardType={'default'}
                  onChangeText={(ailment) => this.setState({ailment})}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.ailment._root.focus();
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Amount")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  ref={(input) => {
                    this.ailment = input;
                  }}
                  placeholder={translate("Enter Amount")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'next'}
                  value={amount}
                  keyboardType={'number-pad'}
                  onChangeText={(amount) => this.setState({amount})}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.amount._root.focus();
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row
            size={4}
            style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
            <Col size={1}>
              <Text style={styles.text}>{translate("Contact Number")}</Text>
              <Item regular style={{borderRadius: 6}}>
                <Input
                  ref={(input) => {
                    this.amount = input;
                  }}
                  placeholder={translate("Enter Contact number")}
                  placeholderTextColor={'#CDD0D9'}
                  returnKeyType={'done'}
                  value={contactNum}
                  keyboardType={'number-pad'}
                  onChangeText={(contactNum) =>
                    acceptNumbersOnly(contactNum) == true || contactNum === ''
                      ? this.setState({contactNum})
                      : null
                  }
                />
              </Item>
            </Col>
          </Row>
          <View style={{flex: 1}}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={translate('CLOSE')}
              closeButtonAction={() =>
                this.setState({isModalVisible: !isModalVisible})
              }
              visible={isModalVisible}
            />
          </View>
          {isLoading ? (
            <View style={{marginTop: 40}}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color="blue"
              />
            </View>
          ) : (
            <Row
              size={4}
              style={{
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                marginBottom: 20,
              }}>
              <Col size={4}>
                <View style={{display: 'flex'}}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onPressSubmitClaimData()}
                      style={styles.appButtonContainer}>
                      <Text style={styles.appButtonText}>{translate("SAVE")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Col>
            </Row>
          )}
        </Content>
      </Container>
    );
  }
}
