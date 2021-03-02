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
} from 'native-base';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {primaryColor} from '../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate, subTimeUnit,addTimeUnit} from '../../../setup/helpers';
import {smartHealthGetService} from '../../../setup/services/httpservices';

const ProductTypeList = [
  'Choose Product Type',
  'Health',
  'Motor',
  'Personal accident',
  'Term life',
];
const TPAorPayerList = [
  'Choose TPA/Payer',
  'New India Assurance Company Limited',
  'Oriental Insurance Company Limited',
  'National Insurance Company Limited',
];

class AddInsurance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insuranceCompany: '',
      productName: null,
      productType: null,
      policyNo: null,
      motorType: 'Two Wheeler',
      policyAmount: 0,
      renewal: true,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
    };
    this.initialTpaList = [];
  }

  componentDidMount() {
    this.getTpaList();
  }
  getTpaList = async () => {
    try {
      const endPoint = 'tpa-master';
      const tpaListResp = await smartHealthGetService(endPoint);
      if (tpaListResp && tpaListResp.data && tpaListResp.data.length) {
        // tpaListResp.data.map(ele=>{
        //     this.initialTpaList.push(ele.tpaName)
        // })
        // console.log("this.initialTpaList",this.initialTpaList)
        this.setState({tpaList: tpaListResp.data});
        this.initialTpaList = tpaListResp.data;
      }
    } catch (error) {
      console.log('Ex is getting on get All TPA list', error.message);
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
  handleStartDateTimePicker = date => {
    try {
      this.endDateCal = moment(date).add(365, 'd');
    //   console.log(' date', date);
    //   console.log(' this.endDateCal', );
      this.setState({startDate: date,endDate:this.endDateCal.format(), isStartDateTimePickerVisible: false});
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
  handleEndDateTimePicker = date => {
    try {
      this.setState({endDate: date,isEndDateTimePickerVisible: false});
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

  render() {
    const {
      insuranceCompany,
      productName,
      productType,
      TPAorPayer,
      motorType,
      policyNo,
      startDate,
      endDate,
      policyAmount,
      isStartDateTimePickerVisible,
      isEndDateTimePickerVisible,
    } = this.state;
    return (
      <Container>
        <Content>
          <View>
            <ScrollView style={{padding: 20, marginBottom: 20}}>
              <Form>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    fontWeight: '700',
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
                          height: 35,
                          marginTop: 8,
                          borderRadius: 5,
                          fontFamily: 'Helvetica-Light',
                          borderWidth: 1,
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
                      selectText={
                        insuranceCompany ? '' : 'Choose your insurance company'
                      }
                      modalWithTouchable={true}
                      showDropDowns={true}
                      hideSearch={false}
                      showChips={false}
                      single={true}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={name =>
                        this.setState({insuranceCompany: name})
                      }
                      selectedItems={insuranceCompany}
                      colors={{primary: '#18c971'}}
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
                      confirmText={
                        insuranceCompany ? 'Confirm' : 'Please Select'
                      }
                    />
                  </Col>
                </TouchableOpacity>

                <Text style={styles.subHeadingText}>Product Name</Text>
                <TextInput
                  placeholder="Enter Product Name"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{marginTop: 2}}
                  value={productName}
                  onChangeText={text =>
                    this.setState({
                      productName: text,
                    })
                  }
                />

                <Text style={styles.subHeadingText}>Select Product Type</Text>

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
                    onValueChange={sample => {
                      this.setState({productType: sample});
                    }}
                    selectedValue={productType}
                    testID="editBloodGroup">
                    {ProductTypeList.map((value, key) => {
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
                {productType === 'Health' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Select TPA/Payer </Text>

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
                        onValueChange={sample => {
                          this.setState({TPAorPayer: sample});
                        }}
                        selectedValue={TPAorPayer}
                        testID="editBloodGroup">
                        {TPAorPayerList.map((value, key) => {
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
                {productType === 'Motor' ? (
                  <View>
                    <Text style={styles.subHeadingText}>Select Motor Type</Text>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        <Radio
                          standardStyle={true}
                          selected={motorType == 'Two Wheeler' ? true : false}
                          onPress={() =>
                            this.setState({motorType: 'Two Wheeler'})
                          }
                        />
                        <Text style={styles.radioButtonStyle}>Two Wheeler</Text>
                      </View>
                      <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Radio
                          standardStyle={true}
                          selected={motorType == 'Passenger Car' ? true : false}
                          onPress={() =>
                            this.setState({motorType: 'Passenger Car'})
                          }
                        />
                        <Text style={styles.radioButtonStyle}>
                          Passenger Car
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                <Text style={styles.subHeadingText}>Policy Number</Text>
                <TextInput
                  placeholder="Enter Policy Number"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{marginTop: 2}}
                  //   keyboardType={'number-pad'}
                  value={policyNo}
                  onChangeText={policyNo => this.setState({policyNo})}
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
                        style={{fontSize: 20, padding: 10}}
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
                        style={{fontSize: 20, padding: 10}}
                      />
                      <DateTimePicker
                        mode={'date'}
                        minimumDate={addTimeUnit(new Date(this.state.startDate), 1, 'days')}
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

                <Text style={styles.subHeadingText}>Policy Amount</Text>
                <TextInput
                  placeholder="Enter Policy Amount"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{marginTop: 2}}
                  keyboardType={'number-pad'}
                  value={policyAmount}
                  onChangeText={number =>
                    this.setState({
                      policyAmount: number,
                    })
                  }
                />

                <Text style={styles.subHeadingText}>
                  Would you like to set insurance renewal reminder?
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
                  Upload Your Adhar Card Copy
                </Text>
                <Image
                  source={require('../../../../assets/images/documentuploadgreen.png')}
                  style={{width: 100, height: 55, marginTop: 10}}
                />
              </Form>
            </ScrollView>
          </View>
        </Content>
        <TouchableOpacity
          style={{
            alignSelf: 'stretch',
            backgroundColor: primaryColor,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'OpenSans',
              fontWeight: 'bold',
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

const styles = StyleSheet.create({
  formStyle6: {
    borderColor: '#909090',
    borderWidth: 0.5,
    height: 35,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  subHeadingText: {
    fontSize: 16,
    fontFamily: 'OpenSans',
    marginTop: 25,
    fontWeight: '700',
  },
  textInputStyle: {
    borderColor: '#909090',
    borderWidth: 1,
    height: 35,
    marginTop: 8,
    borderRadius: 5,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#909090',
    borderWidth: 1,
    height: 30,
    borderRadius: 5,
    marginTop: 8,
  },
  searchIcon: {
    // padding: 1,
  },
  input: {
    flex: 1,
    paddingTop: 2,
    paddingRight: 2,
    paddingBottom: 2,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#909090',
  },
  radioButtonStyle: {
    fontSize: 14,
    fontFamily: 'OpenSans',
  },
});
