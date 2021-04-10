import React, {PureComponent} from 'react';
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
import {primaryColor} from '../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate, subTimeUnit, addTimeUnit} from '../../../setup/helpers';
import {smartHealthGetService} from '../../../setup/services/httpservices';
import {
  createMemberInsurance,
  getInsuranceCompanyNameList,
} from '../../providers/insurance/insurance.action';
import {ImageUpload} from '../../screens/commonScreen/imageUpload';
import {toastMeassage, RenderDocumentUpload} from '../../common';
import {uploadImage} from '../../providers/common/common.action';
import styles from './styles';
import IconName from 'react-native-vector-icons/MaterialIcons';
import ModalPopup from '../../../components/Shared/ModalPopup';
import InsuranceRenewalPopup from '../../shared/insuranceRenewalPopup';

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

class BuyInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insuranceCompany: '',
      policyName: null,
      policyType: '',
      policyNo: null,
      healthInsuranceType: '',
      motorInsuranceType: '',
      personalAccidentInsuranceType:'',
      lifeInsuranceType:'',
      motorType: '',
      premiumAmount: 0,
      renewal: true,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      selectOptionPoopup: false,
      uploadData: [],
      isModalVisible: false,
      errorMsg: '',
      descriptionVisible: false,

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
        this.setState({tpaList: tpaListResp.data});
        this.initialTpaList = tpaListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message);
    } finally {
      this.setState({isLoading: false});
    }
  };
  getInsuranceCompanyNAmeList = async () => {
    try {
      const insuranceListResp = await getInsuranceCompanyNameList();
      console.log(insuranceListResp);
      if (
        insuranceListResp &&
        insuranceListResp.data &&
        insuranceListResp.data.length
      ) {
        this.setState({insuranceCompanyList: insuranceListResp.data});
        this.insuranceCompanyList = insuranceListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message);
    } finally {
      this.setState({isLoading: false});
    }
  };

  createMemberInsurance = async () => {
    const {
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
      if (policyType == 'Health' && !tpaName) {
        this.setState({
          errorMsg: 'Please select TPA name',
          isModalVisible: true,
        });
        return false;
      }
      if (policyType == 'Motor' && !motorType) {
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
      this.setState({isLoading: true});
      let memberId = await AsyncStorage.getItem('memberId');
      const insuranceData = {
        memberId: memberId,
        insuranceName: String(insuranceCompany),
        productName: policyName,
        productType: policyType,
        tpaName: String(tpaName) || null,
        motorType: motorType || null,
        policyNo: policyNo,
        policyStartDate: startDate,
        policyEndDate: endDate,
        Amount: Number(premiumAmount),
        isRenewal: true,
        policyCopy: uploadData,
      };

      let result = await createMemberInsurance(insuranceData);
      if (result) {
        toastMeassage(
          'Your insurance details is submited successfully',
          'success',
          1000,
        );
        this.props.navigation.setParams({isNewInsurance: true});

        this.props.navigation.navigate('Insurance');
      }
    } catch (error) {
      console.log('Ex is getting on', error.message);
    } finally {
      this.setState({isLoading: false});
    }
  };

  showStartDateTimePicker = () => {
    this.setState({isStartDateTimePickerVisible: true});
  };
  hideStartDateTimePicker = () => {
    this.setState({isStartDateTimePickerVisible: false});
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
    this.setState({isEndDateTimePickerVisible: true});
  };
  hideStartDateTimePicker = () => {
    this.setState({isEndDateTimePickerVisible: false});
  };
  handleEndDateTimePicker = (date) => {
    try {
      this.setState({endDate: date, isEndDateTimePickerVisible: false});
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  imageUpload = async (data) => {
    this.setState({selectOptionPoopup: false});
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  uploadImageToServer = async (imagePath) => {
    try {
      this.setState({isLoadingUploadDocs: true});
      let appendForm = 'policyCopy';
      let endPoint = 'images/upload?path=policyCopy';
      const response = await uploadImage(imagePath, endPoint, appendForm);
      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data];
        await this.setState({uploadData: this.uploadedData});
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
      this.setState({isLoadingUploadDocs: false});
    }
  };
  popUpClose() {
    this.setState({descriptionVisible: false});
  }

  render() {
    const {
      insuranceCompany,
      policyName,
      policyType,
      healthInsuranceType,
      motorInsuranceType,
      lifeInsuranceType,
      personalAccidentInsuranceType,
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
            <ScrollView style={{padding: 20, marginBottom: 20}}>
              <Form>
                <Text style={styles.subHeadingText}>Select Policy Type</Text>

                <View style={styles.formStyle6}>
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
                    onValueChange={(sample) => {
                      this.setState({policyType: sample});
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
                        placeholderStyle={{fontSize: 16, marginLeft: -5}}
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
                        textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{color: '#5cb85c'}}
                        style={{width: undefined, color: '#000'}}
                        onValueChange={(sample) => {
                          this.setState({healthInsuranceType: sample, descriptionVisible: true,});
                        }}
                        selectedValue={healthInsuranceType}
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
                        placeholderStyle={{fontSize: 16, marginLeft: -5}}
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
                        textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{color: '#5cb85c'}}
                        style={{width: undefined, color: '#000'}}
                        onValueChange={(sample) => {
                          this.setState({motorInsuranceType: sample, descriptionVisible: true,});
                        }}
                        selectedValue={motorInsuranceType}
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
                        placeholderStyle={{fontSize: 16, marginLeft: -5}}
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
                        textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{color: '#5cb85c'}}
                        style={{width: undefined, color: '#000'}}
                        onValueChange={(sample) => {
                          this.setState({personalAccidentInsuranceType: sample, descriptionVisible: true,});
                        }}
                        selectedValue={personalAccidentInsuranceType}
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
                        placeholderStyle={{fontSize: 16, marginLeft: -5}}
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
                        textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                        note={false}
                        itemStyle={{
                          paddingLeft: 10,
                          fontSize: 16,
                        }}
                        itemTextStyle={{color: '#5cb85c'}}
                        style={{width: undefined, color: '#000'}}
                        onValueChange={(sample) => {
                          this.setState({lifeInsuranceType: sample, descriptionVisible: true,});
                        }}
                        selectedValue={lifeInsuranceType}
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
              </Form>
            </ScrollView>
          </View>
          <View style={{flex: 1}}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({isModalVisible: !isModalVisible})
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
        <InsuranceRenewalPopup
                messageText={'You can Renew your Insurance Policy by!'}
                callbackButtonText={'Arrange Callback'}
                renewOnlineButtonText={'Renew Online'}
                callbackButtonAction={() => {
                    this.arrangeCallback();
                    this.popUpClose();
                }}
                renewOnlineButtonAction={() =>{
                    Linking.openURL('http://www.readypolicy.com/');
                    this.popUpClose();
                }}
                popUpClose={() =>{
                    this.popUpClose();
                }}
                visible={this.state.descriptionVisible}
              />
      </Container>
    );
  }
}

export default BuyInsurance;
