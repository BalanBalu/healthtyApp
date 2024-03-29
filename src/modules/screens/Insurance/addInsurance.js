import React, { PureComponent } from 'react';
import {
  Text,
  Container,
  Content,
  Picker,
  Form,
  Icon,
  Col,
  Row,
  Radio,
  Card,
} from 'native-base';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryColor } from '../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDate, subTimeUnit, addTimeUnit } from '../../../setup/helpers';
import { smartHealthGetService } from '../../../setup/services/httpservices';
import {
  createMemberInsurance,
  getInsuranceCompanyNameList,
} from '../../providers/insurance/insurance.action';
import { ImageUpload } from '../../screens/commonScreen/imageUpload';
import { toastMeassage, RenderDocumentUpload } from '../../common';
import { uploadImage } from '../../providers/common/common.action';
import styles from './styles';
import IconName from 'react-native-vector-icons/MaterialIcons';
import ModalPopup from '../../../components/Shared/ModalPopup';

const PolicyTypeList = [
  'Choose Policy Type',
  'Health Insurance',
  'Motor Insurance',
  'Personal Accident Insurance',
  'Life Insurance',
];
const HealthInsurance = [
  'Choose Health Insurance',
  'Family floater insurance',
  'Senior citizen insurance',
  'Topup insurance',
  'Covid-19 insurance',
];
const MotorInsurance = [
  'Choose Motor Insurance',
  'Bike insurance',
  'car insurance',
  'commercial vehicle insurance',
];
const PersonalAccidentInsurance = [
  'Choose Personal Accident Insurance',
  'Accidental death',
  'accidental death & disability',
];
const LifeInsurance = [
  'Choose Life Insurance',
  'Term insurance',
  'endowment policies',
];

class AddInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insuranceCompany: '',
      policyName: null,
      policyType: '',
      policyNo: null,
      tpaName: '',
      motorType: '',
      premiumAmount: 0,
      renewal: true,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      selectOptionPoopup: false,
      uploadData: [],
      isModalVisible: false,
      errorMsg: '',
      subInsuranceType: '',
    };
    this.initialTpaList = [];
    this.insuranceCompanyList = [];
  }

  async componentDidMount() {
    await this.getInsuranceCompanyNAmeList();
    this.getTpaList();
  }
  getTpaList = async () => {
    try {
      const endPoint = 'tpa-master';
      const tpaListResp = await smartHealthGetService(endPoint);
      if (tpaListResp && tpaListResp.data && tpaListResp.data.length) {
        this.setState({ tpaList: tpaListResp.data });
        this.initialTpaList = tpaListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };
  getInsuranceCompanyNAmeList = async () => {
    try {
      const insuranceListResp = await getInsuranceCompanyNameList();
      if (
        insuranceListResp &&
        insuranceListResp.data &&
        insuranceListResp.data.length
      ) {
        this.setState({ insuranceCompanyList: insuranceListResp.data });
        this.insuranceCompanyList = insuranceListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  createMemberInsurance = async () => {
    const {
      subInsuranceType,
      insuranceCompany,
      policyName,
      policyType,
      tpaName,
      motorType,
      policyNo,
      startDate,
      endDate,
      premiumAmount,
      uploadData,
    } = this.state;
    try {
      if (!insuranceCompany) {
        this.setState({
          errorMsg: 'Please select insurance company name',
          isModalVisible: true,
        });
        return false;
      }
      if (!policyType || policyType == 'Choose Policy Type') {
        this.setState({
          errorMsg: 'Please select Policy type',
          isModalVisible: true,
        });
        return false;
      }
      if (!subInsuranceType || subInsuranceType == 'Choose Motor Insurance' || subInsuranceType == 'Choose Personal Accident Insurance' || subInsuranceType == 'Choose Life Insurance') {
        this.setState({
          errorMsg: 'Please select ' + policyType + ' Type',
          isModalVisible: true,
        });
        return false;
      }
      if (policyType == 'Health Insurance' && !tpaName) {
        this.setState({
          errorMsg: 'Please select TPA name',
          isModalVisible: true,
        });
        return false;
      }
      if (policyType == 'Motor Insurance' && !motorType) {
        this.setState({
          errorMsg: 'Please select motor type',
          isModalVisible: true,
        });
        return false;
      }
      if (!policyName) {
        this.setState({
          errorMsg: 'Please Enter Policy name',
          isModalVisible: true,
        });
        return false;
      }
      if (!policyNo) {
        this.setState({
          errorMsg: 'Please Enter Policy number',
          isModalVisible: true,
        });
        return false;
      }

      if (!startDate) {
        this.setState({
          errorMsg: 'Please Choose policy start date',
          isModalVisible: true,
        });
        return false;
      }

      if (!premiumAmount) {
        this.setState({
          errorMsg: 'Please Enter premium amount',
          isModalVisible: true,
        });
        return false;
      }
      if (uploadData && uploadData.length == 0) {
        this.setState({
          errorMsg: 'Please upload your policy copy',
          isModalVisible: true,
        });
        return false;
      }
      this.setState({ isLoading: true });
      let memberId = await AsyncStorage.getItem('memberId');
      const insuranceData = {
        memberId: memberId,
        insuranceName: String(insuranceCompany),
        productName: policyName,
        productType: policyType,
        subPolicyType: subInsuranceType,
        tpaName: String(tpaName) || null,
        motorType: motorType || null,
        policyNo: policyNo,
        policyStartDate: startDate,
        policyEndDate: endDate,
        Amount: Number(premiumAmount),
        isRenewal: true,
        policyCopy: uploadData,
      };
      console.log(insuranceData)
      let result = await createMemberInsurance(insuranceData);
      if (result) {
        toastMeassage(
          'Your insurance details is submited successfully',
          'success',
          1000,
        );
        this.props.navigation.setParams({ isNewInsurance: true });

        this.props.navigation.navigate('Insurance');
      }
    } catch (error) {
      console.log('Ex is getting on', error.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  showStartDateTimePicker = () => {
    this.setState({ isStartDateTimePickerVisible: true });
  };
  hideStartDateTimePicker = () => {
    this.setState({ isStartDateTimePickerVisible: false });
  };
  handleStartDateTimePicker = (date) => {
    try {
      this.endDateCal = moment(date).add(365, 'd');
      this.setState({
        startDate: date,
        endDate: this.endDateCal.format(),
        isStartDateTimePickerVisible: false,
      });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  showEndDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: true });
  };
  hideStartDateTimePicker = () => {
    this.setState({ isEndDateTimePickerVisible: false });
  };
  handleEndDateTimePicker = (date) => {
    try {
      this.setState({ endDate: date, isEndDateTimePickerVisible: false });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  imageUpload = async (data) => {
    this.setState({ selectOptionPoopup: false });
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  uploadImageToServer = async (imagePath) => {
    try {
      this.setState({ isLoadingUploadDocs: true });
      let appendForm = 'policyCopy';
      let endPoint = 'images/upload?path=policyCopy';
      const response = await uploadImage(imagePath, endPoint, appendForm);
      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data];
        await this.setState({ uploadData: this.uploadedData });
        toastMeassage('Image upload successfully', 'success', 1000);
      } else {
        toastMeassage(
          'Problem Uploading Picture' + response.error,
          'danger',
          3000,
        );
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000);
    } finally {
      this.setState({ isLoadingUploadDocs: false });
    }
  };

  render() {
    const {
      subInsuranceType,
      insuranceCompany,
      policyName,
      policyType,
      tpaName,
      motorType,
      policyNo,
      startDate,
      endDate,
      premiumAmount,
      isStartDateTimePickerVisible,
      isEndDateTimePickerVisible,
      selectOptionPoopup,
      uploadData,
      isModalVisible,
      errorMsg,
    } = this.state;
    return (
      <Container>
        <Content>
          <View>
            <ScrollView style={{ padding: 20, marginBottom: 20 }}>
              <Form>
                <Text
                  style={{
                    fontFamily: 'opensans-bold',
                    fontSize: 16,
                  }}>
                  Insurance Company Name
                </Text>

                {/* <View style={styles.formStyle6}>
                  <Picker
                    style={styles.userDetailLabel}
                    mode="dropdown"
                    placeholderStyle={{fontSize: 16, marginLeft: -5}}
                    iosIcon={
                      <Icon
                        name="ios-arrow-down"
                        style={{color: 'gray', fontSize: 20, marginLeft: 170}}
                      />
                    }
                    textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                    note={false}
                    itemStyle={{
                      paddingLeft: 10,
                      fontSize: 16,
                    }}
                    itemTextStyle={{color: '#5cb85c'}}
                    style={{width: undefined, color: '#000'}}
                    onValueChange={sample => {
                      this.setState({insuranceCompany: sample});
                    }}
                    selectedValue={insuranceCompany}
                    testID="editInsuranceCompany">
                    {this.initialTpaList.map((value, key) => {
                      return (
                        <Picker.Item
                          label={String(value)}
                          value={String(value)}
                          key={key}
                        />
                      );
                    })}
                  </Picker>
                </View> */}

                <TouchableOpacity>
                  <Col
                    size={10}
                    style={{
                      borderRadius: 6,
                      borderColor: '#E0E1E4',
                      borderWidth: 2,
                      justifyContent: 'center',
                      height: 40,
                      paddingTop: 10,
                      fontFamily: 'Helvetica-Light',
                      marginTop: 5,
                    }}>
                    <SectionedMultiSelect
                      IconRenderer={IconName}
                      styles={{
                        selectToggleText:
                          Platform.OS === 'ios'
                            ? {
                              color: '#000',
                              fontSize: 16,
                              height: 20,
                              fontFamily: 'Helvetica-Light',
                            }
                            : {
                              color: '#909090',
                              fontSize: 16,
                              fontFamily: 'Helvetica-Light',
                            },
                        chipIcon: {
                          color: '#000',
                        },
                        itemText: {
                          fontSize: 16,
                          marginLeft: 5,
                          marginBottom: 5,
                          marginTop: 8,
                          borderRadius: 5,
                          fontFamily: 'Helvetica-Light',
                        },
                        button: {
                          backgroundColor: '#128283',
                          fontFamily: 'Helvetica-Light',
                        },
                        cancelButton: {
                          backgroundColor: '#000',
                          fontFamily: 'Helvetica-Light',
                        },
                      }}
                      selectedIconComponent={
                        <View
                          style={{
                            height: 24,
                            width: 24,
                            borderWidth: 1,
                            borderColor: 'gray',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                          }}>
                          <MaterialIcons
                            name="check"
                            style={{
                              fontSize: 20,
                              marginHorizontal: 3,
                              color: 'green',
                              textAlign: 'center',
                            }}
                          />
                        </View>
                      }
                      unselectedIconComponent={
                        <View
                          style={{
                            height: 24,
                            width: 24,
                            borderWidth: 1,
                            borderColor: 'gray',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                          }}
                        />
                      }
                      items={this.insuranceCompanyList}
                      uniqueKey="insuranceName"
                      displayKey="insuranceName"
                      selectText={
                        insuranceCompany ? '' : 'Choose your insurance company'
                      }
                      modalWithTouchable={true}
                      showDropDowns={true}
                      hideSearch={false}
                      showChips={false}
                      single={true}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={(name) =>
                        this.setState({ insuranceCompany: name })
                      }
                      selectedItems={insuranceCompany}
                      colors={{ primary: '#18c971' }}
                      showCancelButton={true}
                      animateDropDowns={true}
                      selectToggleIconComponent={
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          style={
                          
                            Platform.OS === 'ios'
                              ? {
                                  fontSize: 20,
                                  marginHorizontal: 6,
                                  color: '#909090',
                                  textAlign: 'center',
                                  marginTop: 5,
                                  button: insuranceCompany ? {backgroundColor : primaryColor} : { backgroundColor: "#5A5a5a"}
                                }
                              : {
                                  fontSize: 25,
                                  marginHorizontal: 6,
                                  color: '#909090',
                                  textAlign: 'center',
                                  marginTop: 10,
                                  button: insuranceCompany ? {backgroundColor : primaryColor} : { backgroundColor: "#5A5a5a"}
                                }
                          }
                        />
                      }
                      confirmText={
                        insuranceCompany ? 'Confirm' : 'Please Select'
                      }
                    />
                  </Col>
                </TouchableOpacity>

                <Text style={styles.subHeadingText}>Select Policy Type</Text>

                <View style={styles.formStyle6}>
                  <Picker
                    style={styles.userDetailLabel}
                    mode="dropdown"
                    placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                    iosIcon={
                      <Icon
                        name="ios-arrow-down"
                        style={{ color: 'gray', fontSize: 20, marginLeft: 170 }}
                      />
                    }
                    textStyle={{ color: 'gray', left: 0, marginLeft: -5 }}
                    note={false}
                    itemStyle={{
                      paddingLeft: 10,
                      fontSize: 16,
                    }}
                    itemTextStyle={{ color: '#5cb85c' }}
                    style={{ width: undefined, color: '#000' }}
                    onValueChange={(sample) => {
                      this.setState({ policyType: sample });
                    }}
                    selectedValue={policyType}
                    testID="editPolicyTypeList">
                    {PolicyTypeList.map((value, key) => {
                      return (
                        <Picker.Item
                          label={String(value)}
                          value={String(value)}
                          key={key}
                        />
                      );
                    })}
                  </Picker>
                </View>
                {policyType === 'Health Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Health Insurance</Text>
                    <View style={styles.formStyle6}>
                      <Picker
                        style={styles.userDetailLabel}
                        mode="dropdown"
                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                        iosIcon={
                          <Icon
                            name="ios-arrow-down"
                            style={{
                              color: 'gray',
                              fontSize: 20,
                              marginLeft: 170,
                            }}
                          />
                        }
                        textStyle={{ color: 'gray', left: 0, marginLeft: -5 }}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{ color: '#5cb85c' }}
                        style={{ width: undefined, color: '#000' }}
                        onValueChange={(sample) => {
                          this.setState({ subInsuranceType: sample });
                        }}
                        selectedValue={subInsuranceType}
                        testID="editHealthInsurance">
                        {HealthInsurance.map((value, key) => {
                          return (
                            <Picker.Item
                              label={String(value)}
                              value={String(value)}
                              key={key}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                ) : null}
                {policyType === 'Motor Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Motor Insurance</Text>
                    <View style={styles.formStyle6}>
                      <Picker
                        style={styles.userDetailLabel}
                        mode="dropdown"
                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                        iosIcon={
                          <Icon
                            name="ios-arrow-down"
                            style={{
                              color: 'gray',
                              fontSize: 20,
                              marginLeft: 170,
                            }}
                          />
                        }
                        textStyle={{ color: 'gray', left: 0, marginLeft: -5 }}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{ color: '#5cb85c' }}
                        style={{ width: undefined, color: '#000' }}
                        onValueChange={(sample) => {
                          this.setState({ subInsuranceType: sample });
                        }}
                        selectedValue={subInsuranceType}
                        testID="editMotorInsurance">
                        {MotorInsurance.map((value, key) => {
                          return (
                            <Picker.Item
                              label={String(value)}
                              value={String(value)}
                              key={key}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                ) : null}
                {policyType === 'Personal Accident Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Personal Accident Insurance</Text>
                    <View style={styles.formStyle6}>
                      <Picker
                        style={styles.userDetailLabel}
                        mode="dropdown"
                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                        iosIcon={
                          <Icon
                            name="ios-arrow-down"
                            style={{
                              color: 'gray',
                              fontSize: 20,
                              marginLeft: 170,
                            }}
                          />
                        }
                        textStyle={{ color: 'gray', left: 0, marginLeft: -5 }}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{ color: '#5cb85c' }}
                        style={{ width: undefined, color: '#000' }}
                        onValueChange={(sample) => {
                          this.setState({ subInsuranceType: sample });
                        }}
                        selectedValue={subInsuranceType}
                        testID="editPersonalAccidentInsurance">
                        {PersonalAccidentInsurance.map((value, key) => {
                          return (
                            <Picker.Item
                              label={String(value)}
                              value={String(value)}
                              key={key}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                ) : null}
                {policyType === 'Life Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Life Insurance</Text>
                    <View style={styles.formStyle6}>
                      <Picker
                        style={styles.userDetailLabel}
                        mode="dropdown"
                        placeholderStyle={{ fontSize: 16, marginLeft: -5 }}
                        iosIcon={
                          <Icon
                            name="ios-arrow-down"
                            style={{
                              color: 'gray',
                              fontSize: 20,
                              marginLeft: 170,
                            }}
                          />
                        }
                        textStyle={{ color: 'gray', left: 0, marginLeft: -5 }}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{ color: '#5cb85c' }}
                        style={{ width: undefined, color: '#000' }}
                        onValueChange={(sample) => {
                          this.setState({ subInsuranceType: sample });
                        }}
                        selectedValue={subInsuranceType}
                        testID="editLifeInsurance">
                        {LifeInsurance.map((value, key) => {
                          return (
                            <Picker.Item
                              label={String(value)}
                              value={String(value)}
                              key={key}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                ) : null}
                {policyType === 'Health Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Select TPA/Payer </Text>

                    <TouchableOpacity>
                      <Col
                        size={10}
                        style={{
                          borderRadius: 6,
                          borderColor: '#E0E1E4',
                          borderWidth: 2,
                          justifyContent: 'center',
                          height: 40,
                          paddingTop: 10,
                          fontFamily: 'Helvetica-Light',
                          marginTop: 5,
                        }}>
                        <SectionedMultiSelect
                          IconRenderer={IconName}
                          styles={{
                            selectToggleText:
                              Platform.OS === 'ios'
                                ? {
                                  color: '#000',
                                  fontSize: 16,
                                  height: 20,
                                  fontFamily: 'Helvetica-Light',
                                }
                                : {
                                  color: '#909090',
                                  fontSize: 16,
                                  fontFamily: 'Helvetica-Light',
                                },
                            chipIcon: {
                              color: '#000',
                            },
                            itemText: {
                              fontSize: 16,
                              marginLeft: 5,
                              marginBottom: 5,
                              marginTop: 8,
                              borderRadius: 5,
                              fontFamily: 'Helvetica-Light',
                            },
                            button: {
                              backgroundColor: '#128283',
                              fontFamily: 'Helvetica-Light',
                            },
                            cancelButton: {
                              backgroundColor: '#000',
                              fontFamily: 'Helvetica-Light',
                            },
                          }}
                          selectedIconComponent={
                            <View
                              style={{
                                height: 24,
                                width: 24,
                                borderWidth: 1,
                                borderColor: 'gray',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}>
                              <MaterialIcons
                                name="check"
                                style={{
                                  fontSize: 20,
                                  marginHorizontal: 3,
                                  color: 'green',
                                  textAlign: 'center',
                                }}
                              />
                            </View>
                          }
                          unselectedIconComponent={
                            <View
                              style={{
                                height: 24,
                                width: 24,
                                borderWidth: 1,
                                borderColor: 'gray',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5,
                              }}
                            />
                          }
                          items={this.initialTpaList}
                          uniqueKey="tpaName"
                          displayKey="tpaName"
                          selectText={tpaName ? '' : 'Choose your TPA or Payer'}
                          modalWithTouchable={true}
                          showDropDowns={true}
                          hideSearch={false}
                          showChips={false}
                          single={true}
                          readOnlyHeadings={false}
                          onSelectedItemsChange={(name) =>
                            this.setState({ tpaName: name })
                          }
                          selectedItems={tpaName}
                          colors={{ primary: '#18c971' }}
                          showCancelButton={true}
                          animateDropDowns={true}
                          selectToggleIconComponent={
                            <MaterialIcons
                              name="keyboard-arrow-down"
                              style={
                                Platform.OS === 'ios'
                                  ? {
                                    fontSize: 20,
                                    marginHorizontal: 6,
                                    color: '#909090',
                                    textAlign: 'center',
                                    marginTop: 5,
                                  }
                                  : {
                                    fontSize: 25,
                                    marginHorizontal: 6,
                                    color: '#909090',
                                    textAlign: 'center',
                                    marginTop: 10,
                                  }
                              }
                            />
                          }
                          confirmText={tpaName ? 'Confirm' : 'Please Select'}
                        />
                      </Col>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {policyType === 'Motor Insurance' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Select Motor Type</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Radio
                          standardStyle={true}
                          selected={motorType == 'Two Wheeler' ? true : false}
                          onPress={() =>
                            this.setState({ motorType: 'Two Wheeler' })
                          }
                        />
                        <Text style={styles.radioButtonStyle}>Two Wheeler</Text>
                      </View>
                      <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <Radio
                          standardStyle={true}
                          selected={motorType == 'Passenger Car' ? true : false}
                          onPress={() =>
                            this.setState({ motorType: 'Passenger Car' })
                          }
                        />
                        <Text style={styles.radioButtonStyle}>
                          Passenger Car
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                <Text style={styles.subHeadingText}>Policy Name</Text>
                <TextInput
                  placeholder="Enter Policy Name"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{ marginTop: 2 }}
                  value={policyName}
                  onChangeText={(text) =>
                    this.setState({
                      policyName: text,
                    })
                  }
                />
                <Text style={styles.subHeadingText}>Policy Number</Text>
                <TextInput
                  placeholder="Enter Policy Number"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{ marginTop: 2 }}
                  //   keyboardType={'number-pad'}
                  value={policyNo}
                  onChangeText={(policyNo) => this.setState({ policyNo })}
                />
                <View>
                  <Text style={styles.subHeadingText}>Select Start Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isStartDateTimePickerVisible: !isStartDateTimePickerVisible,
                      });
                    }}>
                    <View style={styles.searchSection}>
                      <AntDesign
                        name="calendar"
                        style={{ fontSize: 20, padding: 10 }}
                      />
                      <DateTimePicker
                        mode={'date'}
                        minimumDate={new Date(1940, 0, 1)}
                        value={startDate}
                        isVisible={isStartDateTimePickerVisible}
                        onConfirm={this.handleStartDateTimePicker}
                        onCancel={() =>
                          this.setState({
                            isStartDateTimePickerVisible: !isStartDateTimePickerVisible,
                          })
                        }
                      />
                      <Text
                        style={styles.input}
                        underlineColorAndroid="transparent">
                        {startDate != null
                          ? formatDate(startDate, 'DD/MM/YYYY')
                          : 'Enter Start Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.subHeadingText}>Select End Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isEndDateTimePickerVisible: !isEndDateTimePickerVisible,
                      });
                    }}>
                    <View style={styles.searchSection}>
                      <AntDesign
                        name="calendar"
                        style={{ fontSize: 20, padding: 10 }}
                      />
                      <DateTimePicker
                        mode={'date'}
                        minimumDate={addTimeUnit(
                          new Date(this.state.startDate),
                          1,
                          'days',
                        )}
                        value={endDate}
                        isVisible={isEndDateTimePickerVisible}
                        onConfirm={this.handleEndDateTimePicker}
                        onCancel={() =>
                          this.setState({
                            isEndDateTimePickerVisible: !isEndDateTimePickerVisible,
                          })
                        }
                      />
                      <Text
                        style={styles.input}
                        underlineColorAndroid="transparent">
                        {endDate != null
                          ? formatDate(endDate, 'DD/MM/YYYY')
                          : 'Enter End Date'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subHeadingText}>Premium Amount</Text>
                <TextInput
                  placeholder="Enter Premium Amount"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{ marginTop: 2 }}
                  keyboardType={'number-pad'}
                  value={premiumAmount}
                  onChangeText={(number) =>
                    this.setState({
                      premiumAmount: number,
                    })
                  }
                />

                <Text style={styles.subHeadingText}>
                  Would you like to set insurance renewal reminder?
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Radio standardStyle={true} selected={this.state.renewal} />
                    <Text style={styles.radioButtonStyle}>Yes</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Radio
                      standardStyle={true}
                      selected={!this.state.renewal}
                    />
                    <Text style={styles.radioButtonStyle}>No</Text>
                  </View>
                </View>
                {/* <Text style={styles.subHeadingText}>
                  Would you like to renew your policy online ?
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Radio standardStyle={true} selected={this.state.renewal} />
                    <Text style={styles.radioButtonStyle}>Yes</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginLeft: 10}}>
                    <Radio
                      standardStyle={true}
                      selected={!this.state.renewal}
                    />
                    <Text style={styles.radioButtonStyle}>No</Text>
                  </View>
                </View> */}
                <Text style={styles.subHeadingText}>
                  Upload Your Policy Copy
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({ selectOptionPoopup: true })}>
                  <Image
                    source={require('../../../../assets/images/documentuploadgreen.png')}
                    style={{ width: 100, height: 55, marginTop: 10 }}
                  />
                </TouchableOpacity>
                {selectOptionPoopup ? (
                  <ImageUpload
                    popupVisible={(data) => this.imageUpload(data)}
                  />
                ) : null}
                <FlatList
                  data={uploadData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View>
                      <Card style={styles.cardStyles}>
                        <Row>
                          <Col style={{ width: '10%' }}>
                            <Image
                              source={RenderDocumentUpload(item)}
                              style={{ width: 25, height: 25 }}
                            />
                          </Col>
                          <Col style={{ width: '70%' }}>
                            <Text style={styles.innerCardText}>
                              {item.original_file_name}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </View>
                  )}
                />
              </Form>
            </ScrollView>
          </View>
          <View style={{ flex: 1 }}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({ isModalVisible: !isModalVisible })
              }
              visible={isModalVisible}
            />
          </View>
        </Content>
        <TouchableOpacity
          style={{
            alignSelf: 'stretch',
            backgroundColor: primaryColor,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.createMemberInsurance()}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'opensans-bold',
              color: '#fff',
            }}>
            Save
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default AddInsurance;
