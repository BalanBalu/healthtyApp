import React, { PureComponent } from 'react';
import {
  Text,
  Container,
  Content,
  Picker,
  Form,
  Icon,
} from 'native-base';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert
} from 'react-native';
import {
  arrangeCallbackActionForBuyInsurance,createInsuranceHistory
} from '../../providers/insurance/insurance.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { primaryColor } from '../../../setup/config';
import styles from './styles';
import ModalPopup from '../../../components/Shared/ModalPopup';
import InsuranceRenewalPopup from '../../shared/insuranceRenewalPopup';
import { getFullName,toastMeassage } from '../../common';

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
      policyType: '',
      healthInsuranceType: '',
      motorInsuranceType: '',
      personalAccidentInsuranceType: '',
      lifeInsuranceType: '',
      isModalVisible: false,
      errorMsg: '',
      descriptionVisible: false,
      selectedInsurance: '',
    };
  }
  arrangeCallback = async () => {
    const basicProfileData = await AsyncStorage.getItem('basicProfileData');
    const basicData = JSON.parse(basicProfileData);
    let fullName = getFullName(basicData);
    let result = await arrangeCallbackActionForBuyInsurance(
      fullName,
      this.state.selectedInsurance,
    );
    Alert.alert(
      'Thanks',
      'Mail sent successfully, Team will contact you soon',
      [
        {
          text: 'OK',
        },
      ],
    );
    let memberId= await AsyncStorage.getItem('memberId')
    let renewalData={
      memberId:memberId,
      actionType:'BUY-INSURANCE',
      policyType:this.state.policyType,
      transactionType:'Arrange-Callback',
      requestedDate:new Date()
    }
   await createInsuranceHistory(renewalData);
  };

  renewalOnline = async () => {
    try {
    let memberId= await AsyncStorage.getItem('memberId')
    let renewalData={
      memberId:memberId,
      actionType:'BUY-INSURANCE',
      policyType:this.state.policyType,
      transactionType:'Renewal-Online',
      requestedDate:new Date()
    }
    let result = await createInsuranceHistory(renewalData);
    if (result) {
      toastMeassage(
        'Your insurance details is submited successfully',
        'success',
        1000,
      );
      this.props.navigation.navigate('CorporateHome');
    }
  } catch (error) {
    console.log('Ex is getting on', error.message);
  } finally {
    this.setState({isLoading: false});
  }
  };


  popUpClose() {
    this.setState({ descriptionVisible: false });
  }

  render() {
    const {
      policyType,
      healthInsuranceType,
      motorInsuranceType,
      lifeInsuranceType,
      personalAccidentInsuranceType,
      isModalVisible,
      errorMsg,
    } = this.state;
    return (
      <Container>
        <Content>
          <View>
            <ScrollView style={{ padding: 20, marginBottom: 20 }}>
              <Form>
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
                          this.setState({ healthInsuranceType: sample, descriptionVisible: true, });
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
                          this.setState({ motorInsuranceType: sample, descriptionVisible: true, });
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
                          this.setState({ personalAccidentInsuranceType: sample, descriptionVisible: true, });
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
                          this.setState({ lifeInsuranceType: sample, descriptionVisible: true, });
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
        <InsuranceRenewalPopup
          messageText={'You Can Renew Your Insurance Policy By!'}
          callbackButtonText={'Arrange Callback'}
          renewOnlineButtonText={'Renewal Online'}
          callbackButtonAction={() => {
            this.arrangeCallback();
            this.popUpClose();
          }}
          renewOnlineButtonAction={() => {
            Linking.openURL('http://www.readypolicy.com/');
            this.popUpClose();
            this.renewalOnline()
          }}
          popUpClose={() => {
            this.popUpClose();
          }}
          visible={this.state.descriptionVisible}
        />
      </Container>
    );
  }
}

export default BuyInsurance;
