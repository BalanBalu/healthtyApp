import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Footer,
  Icon,
  DatePicker,
  FooterTab,
  H3,
  Toast,
  ListItem,
  Radio,
  Picker,
  View,
} from 'native-base';
import { updateMemberDetails, logout } from '../../providers/auth/auth.actions';
import { connect } from 'react-redux';
import { Row, Col } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateFamilyMembersDetails } from '../../providers/corporate/corporate.actions';
import { translate } from '../../../setup/translator.helper';
import { storeBasicProfile } from '../../providers/profile/profile.action';

import {
  Image,
  BackHandler,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styles from './style.js';
import { formatDate, subTimeUnit } from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import { bloodGroupList, validateName, calculateAge } from '../../common';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { primaryColor } from '../../../setup/config';
import ModalPopup from '../../../components/Shared/ModalPopup';

class UpdateUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      dob: null,
      gender: 'M',
      radioStatus: [true, false, false],
      fromProfile: false,
      isLoading: false,
      selectedBloodGroup: null,
      userData: '',
      errorMsg: '',
      updateButton: true,
      isOnlyDateTimePickerVisible: false,
      isModalVisible: false,
    };
  }
  componentDidMount() {
    this.bindValues();
  }

  onPressRadio(value) {
    this.setState({ gender: value });
  }

  toggleRadio = (radioSelect, genderSelect) => {
    let tempArray = [false, false, false];
    tempArray[radioSelect] = true;
    this.setState({ radioStatus: tempArray });
    this.setState({ gender: genderSelect });
  };

  async bindValues() {
    const { navigation } = this.props;
    const userData = navigation.getParam('updatedata');
    const fromProfile = navigation.getParam('fromProfile') || false;
    if (fromProfile) {
      await this.setState({
        dob: userData.dob || null,
        firstName: userData.firstName,
        middleName: userData.middleName || null,
        lastName: userData.lastName,
        gender: userData.gender,
        updateButton: true,
        selectedBloodGroup: userData.bloodGroup || null,
        userData,
      });
    }
  }

  // onChangeFirstnameAndLastname = async (text, type) => {
  //   if (type === 'Firstname') {
  //     await this.setState({firstName: text, updateButton: false});
  //   }
  //   if (type === 'MiddleName') {
  //     await this.setState({middleName: text, updateButton: false});
  //   }
  //   if (type === 'LastName') {
  //     await this.setState({lastName: text, updateButton: false});
  //   }
  //   if (this.state.firstName && validateName(this.state.firstName) == false) {
  //     this.setState({
  //       errorMsg: 'Firstname must be a Characters',
  //       isModalVisible: true,
  //       updateButton: true,
  //     });
  //     return false;
  //   }
  //   if (this.state.middleName && validateName(this.state.middleName) == false) {
  //     this.setState({
  //       errorMsg: 'Middlename must be a Characters',
  //       isModalVisible: true,
  //       updateButton: true,
  //     });
  //     return false;
  //   }
  //   if (this.state.lastName && validateName(this.state.lastName) == false) {
  //     this.setState({
  //       errorMsg: 'Lastname must be a Characters',
  //       isModalVisible: true,
  //       updateButton: true,
  //     });
  //     return false;
  //   }
  // };

  userUpdate = async () => {
    const {
      userData,
      firstName,
      middleName,
      lastName,
      dob,
      gender,
      selectedBloodGroup,
      id,
    } = this.state;
    try {
      if (!firstName) {
        this.setState({
          errorMsg: translate('Please enter first name'),
          isModalVisible: true,
        });
        return false;
      }
      if (!dob) {
        this.setState({
          errorMsg: translate('Please select date of birth'),
          isModalVisible: true,
        });
        return false;
      }
      if (!gender) {
        this.setState({
          errorMsg: translate('Please select gender'),
          isModalVisible: true,
        });
        return false;
      }
      if (selectedBloodGroup == 'Select Blood Group') {
        this.setState({
          errorMsg: translate('Please select blood group'),
          isModalVisible: true,
        });
        return false;
      }
      this.setState({
        errorMsg: '',
        firstNameMsg: '',
        lastNameMsg: '',
        isLoading: true,
        updateButton: false,
      });
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let relationship = (await AsyncStorage.getItem('relationship')) || null;

      let requestData = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        bloodGroup: selectedBloodGroup,
        _id: this.state.userData._id,
        emailId:memberEmailId,
        relationship:relationship
      };

      let response = await updateMemberDetails(requestData);
      storeBasicProfile(response);
      if (response) {
        let temp =
          this.props &&
          this.props.profile &&
          this.props.profile.familyData.filter(
            (ele) => ele.memberId === response.memberId,
          );
        let fullName =
          (firstName ? firstName + ' ' : '') +
          (middleName ? middleName + ' ' : '') +
          (lastName ? lastName + ' ' : '');
        const getAge = calculateAge(dob);
        if(temp.length!==0){
          let data = {
            familyMemberName: fullName,
            // familyMemberLastName:lastName
            familyMemberGender: gender,
            familyMemberMonth: String(getAge.months),
            familyMemberAge: String(getAge.years),
            familyMemberDob: dob,
            _id: temp?temp[0]._id : null,
          };
          let updateRes = await updateFamilyMembersDetails(data);
        }
      
        Toast.show({
          text: translate('Your Profile has been Updated'),
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
        this.setState({ isLoading: false });
      }
    } catch (e) {
      Toast.show({
        text: 'Exception Occured' + e,
        duration: 3000,
      });
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };
  showOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: true });
  };
  hideOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: false });
  };
  handleOnlyDateTimePicker = (date) => {
    try {
      this.setState({
        isOnlyDateTimePickerVisible: false,
        dob: date,
        updateButton: false,
      });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            {this.state.isLoading ? (
              <Spinner color="blue" visible={this.state.isLoading} />
            ) : null}

            <Text style={styles.headerText}>{translate("Update Your Details")}</Text>
            <View style={{ marginLeft: -10 }}>
              <Form style={{ marginTop: 10 }}>
                <Item style={{ borderBottomWidth: 0 }}>
                  <Input
                    placeholder={translate("First Name")}
                    style={styles.transparentLabel2}
                    value={this.state.firstName}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    onChangeText={(text) =>
                      this.onChangeFirstnameAndLastname(text, 'Firstname')
                    }
                    disabled={true}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      this.firstName._root.focus();
                    }}
                    testID="editFirstName"
                  />
                </Item>

                <Item style={{ borderBottomWidth: 0 }}>
                  <Input
                    placeholder={translate("Middle Name")}
                    style={styles.transparentLabel2}
                    ref={(input) => {
                      this.firstName = input;
                    }}
                    value={this.state.middleName}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    onChangeText={(text) =>
                      this.onChangeFirstnameAndLastname(text, 'MiddleName')
                    }
                    disabled={true}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      this.middleName._root.focus(this.setState({ focus: true }));
                    }}
                    testID="editMiddleName"
                  />
                </Item>
                <Item style={{ borderBottomWidth: 0 }}>
                  <Input
                    placeholder={translate("Last Name")}
                    style={styles.transparentLabel2}
                    ref={(input) => {
                      this.middleName = input;
                    }}
                    value={this.state.lastName}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    onChangeText={(text) =>
                      this.onChangeFirstnameAndLastname(text, 'LastName')
                    }
                    disabled={true}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    // onSubmitEditing={() => { this.lastName._root.focus(this.setState({ focus: true })); }}
                    testID="editLastName"
                  />
                </Item>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isOnlyDateTimePickerVisible: !this.state
                        .isOnlyDateTimePickerVisible,
                    });
                  }}
                  style={{
                    borderBottomWidth: 0,
                    backgroundColor: '#F1F1F1',
                    height: 45,
                    marginRight: 15,
                    marginTop: 10,
                    borderRadius: 5,
                    flexDirection: 'row',
                    marginLeft: 15,
                    alignItems: 'center',
                  }}>
                  {/* <Item > */}
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
                      this.state.dob != null
                        ? {
                          marginTop: 7,
                          marginBottom: 7,
                          marginLeft: 5,
                          fontFamily: 'Roboto',
                          fontSize: 13,
                          textAlign: 'center',
                        }
                        : { color: '#909090' }
                    }>
                    {this.state.dob != null
                      ? formatDate(this.state.dob, 'DD/MM/YYYY')
                      : translate('Date of Birth')}
                  </Text>
                  <DateTimePicker
                    mode={'date'}
                    minimumDate={new Date(1940, 0, 1)}
                    maximumDate={subTimeUnit(new Date(), 1, 'year')}
                    value={this.state.dob}
                    isVisible={this.state.isOnlyDateTimePickerVisible}
                    onConfirm={this.handleOnlyDateTimePicker}
                    onCancel={() =>
                      this.setState({
                        isOnlyDateTimePickerVisible: !this.state
                          .isOnlyDateTimePickerVisible,
                      })
                    }
                  />
                  {/* </Item> */}
                </TouchableOpacity>

                <Item
                  style={{
                    borderBottomWidth: 0,
                    backgroundColor: '#F1F1F1',
                    height: 45,
                    marginRight: 15,
                    marginTop: 10,
                    borderRadius: 5,
                  }}>
                  <Picker
                    style={styles.transparentLabel2}
                    mode="dropdown"
                    placeholderStyle={{ fontSize: 15, marginLeft: -5 }}
                    iosIcon={
                      <Icon
                        name="ios-arrow-down"
                        style={{ color: primaryColor, fontSize: 20 }}
                      />
                    }
                    textStyle={{ left: 0, marginLeft: -5, color: primaryColor }}
                    note={false}
                    itemStyle={{
                      color: primaryColor,
                      paddingLeft: 10,
                      fontSize: 16,
                    }}
                    itemTextStyle={{ color: primaryColor }}
                    style={{ width: '100%', color: primaryColor }}
                    onValueChange={(sample) => {
                      this.setState({
                        selectedBloodGroup: sample,
                        updateButton: false,
                      });
                    }}
                    selectedValue={this.state.selectedBloodGroup}
                    testID="editBloodGroup">
                    {bloodGroupList.map((value, key) => {
                      return (
                        <Picker.Item
                          label={String(value)}
                          value={String(value)}
                          key={key}
                        />
                      );
                    })}
                  </Picker>
                </Item>

                <View
                  style={{ marginTop: 20, borderBottomWidth: 0, marginLeft: 20 }}>
                  <Row
                    style={
                      Platform.OS === 'ios'
                        ? { marginLeft: 10, marginRight: 10 }
                        : null
                    }>
                    <Col
                      size={3}
                      style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Radio
                        color={primaryColor}
                        standardStyle={true}
                        onPress={() =>
                          this.setState({ gender: 'Male', updateButton: false })
                        }
                        selected={this.state.gender === 'Male'}
                      />
                      <Text
                        style={
                          Platform.OS === 'ios'
                            ? {
                              fontFamily: 'Roboto',
                              fontSize: 14,
                              marginLeft: 5,
                            }
                            : {
                              fontFamily: 'Roboto',
                              fontSize: 12,
                              marginLeft: 5,
                            }
                        }>
                        {translate("Male")}
                      </Text>
                    </Col>
                    <Col
                      size={3}
                      style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <Radio
                        color={primaryColor}
                        standardStyle={true}
                        onPress={() =>
                          this.setState({ gender: 'Female', updateButton: false })
                        }
                        selected={this.state.gender === 'Female'}
                      />
                      <Text
                        style={
                          Platform.OS === 'ios'
                            ? {
                              fontFamily: 'Roboto',
                              fontSize: 14,
                              marginLeft: 5,
                            }
                            : {
                              fontFamily: 'Roboto',
                              fontSize: 12,
                              marginLeft: 5,
                            }
                        }>
                        {translate("Female")}
                      </Text>
                    </Col>
                    <Col
                      size={3}
                      style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <Radio
                        color={primaryColor}
                        standardStyle={true}
                        selectedColor={primaryColor}
                        onPress={() =>
                          this.setState({ gender: 'others', updateButton: false })
                        }
                        selected={this.state.gender === 'others'}
                      />
                      <Text
                        style={
                          Platform.OS === 'ios'
                            ? {
                              fontFamily: 'Roboto',
                              fontSize: 14,
                              marginLeft: 5,
                            }
                            : {
                              fontFamily: 'Roboto',
                              fontSize: 12,
                              marginLeft: 5,
                            }
                        }>
                        {translate("Others")}
                      </Text>
                    </Col>
                  </Row>
                </View>

                <View>
                  <Button
                    primary
                    disabled={this.state.updateButton}
                    style={
                      this.state.updateButton
                        ? styles.addressButtonDisable
                        : styles.addressButton
                    }
                    block
                    onPress={() => this.userUpdate()}
                    testID="updateBasicDetails">
                    <Text style={styles.buttonText}>{translate("Update")}</Text>
                  </Button>
                </View>
              </Form>
            </View>
          </ScrollView>
          <View style={{ flex: 1 }}>
            <ModalPopup
              errorMessageText={this.state.errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({ isModalVisible: !this.state.isModalVisible })
              }
              visible={this.state.isModalVisible}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

function userDetailsState(state, profile) {
  return {
    user: state.user,
    profile: state.profile,
  };
}
export default connect(userDetailsState)(UpdateUserDetails);
