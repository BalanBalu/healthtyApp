import React, { PureComponent } from 'react';
import { Text, View, Container, Content, Card, Item, Input, Picker, Radio, Icon, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './Styles';
import { primaryColor } from '../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, addTimeUnit, formatDate } from '../../../setup/helpers';
const dropdownData = [
  'Select your Item',
  'Employee',
  'Father',
  'Mother',
  'Husband',
  'Wife',
  'SOn',
];
const Occupation = [
  'Select your Item',
  'Self employee',
  'Home maker',
  'student',
  'Retired',
  'Service',
];
const RoomCategory = [
  'Select your Item',
  'Day Care',
  'Single Occupancy',
  'Twin Sharing',
  '3 or more beds per room',
];
const Hospitalization = [
  'Select your Item',
  'Day Care',
  'Single Occupancy',
  'Twin Sharing',
  '3 or more beds per room',
];
const InjuryCause = [
  'Select your Item',
  'Road traffic accident',
  'Substance abuse / alcohol consumption',

];

const ListOfData = [
  { text: 'Claim form duly signed', },
  { text: 'Copy of the claim intimation, if any' },
  { text: 'Hospital main bill' },
  { text: 'Hospital Break-up bill' },
  { text: 'Hospital bill payment receipt' },
  { text: 'Hospital Discharge Summary' },
  { text: 'ECH' },
  { text: 'Doctor request for investigation' },
  { text: 'Doctor Prescription' },
  { text: 'Pharmacy Bill' },
  { text: 'Others' },
  { text: 'Investigation reports including(including CT/MRI/USG/HPE)' },

];

class SubmitClaim extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showCard: -1,
      show: true,
      selectedAdmissionDate: '',
      isSelected: true,
      isVisibleDatePicker: false,
      dropdownList: '',
      Occupation: '',
      RoomCategory: '',
      Hospitalization: '',
      InjuryCause: '',
      checkBoxClick: false
    }
  }

  toggleData(index, typeOfArrowIcon) {
    const { showCard, show } = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({ showCard: index, show: !this.state.show });
    } else {
      this.setState({ showCard: -1, show: null });
    }
  }
  onPressConfirmDateValue = (date) => {
    try {
      this.setState({ isVisibleDatePicker: false, selectedAdmissionDate: date });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };


  primaryInsured(index, typeOfArrowIcon) {
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Policy No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Policy Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>SI No Certificate No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Social Insurance Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Company ITPA ID MA ID No.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter TPA ID"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>First Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter First Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Middle Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Middle Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Last Name.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Last Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Pin Code.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Pin Code"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>No and Street.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter No and Street"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Address.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Address"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>City.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter City"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>State.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter State"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Country.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Country"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Phone Number.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Phone Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Email ID.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Email ID"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  insuranceHistory(item, index) {
    const { isSelected, isVisibleDatePicker, selectedAdmissionDate } = this.state
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Currently have mediclaim?<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>commencement of first insurance without break.<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date of Admission'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If, yes company name<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter full name of Insurance company"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Have you been hospitalized in the last four years since inception of the confract?<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Sum Insured<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter fSum Insured in RS"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date of hospitalization<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date of hospitalization'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Diagnosis<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter the Diagnosis details"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If, yes company name<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter the full name of Insurance company"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Previously covered by other mediclaim?<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  insuredPersonHospitalized(item, index) {
    const { isSelected, selectedAdmissionDate, isVisibleDatePicker } = this.state
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Name<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Gender<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Male</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>Female</Text>

              </View>
              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>Other</Text>

              </View>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>AGE(MA_ID)NO<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter age of the patient"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date Of Birth<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Enter Date of birth of patient'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Relation to primary Insured<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Picker
                mode="dropdown"
                placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: "#fff",
                }}
                itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                style={{ width: "100%", color: "#000", }}
                onValueChange={(sample) => { this.setState({ dropdownList: sample }) }}
                selectedValue={this.state.dropdownList}
                testID="editJobType"
              >

                {dropdownData.map((value, key) => {

                  return <Picker.Item label={String(value)} value={String(value)} key={key}
                  />
                })
                }
              </Picker>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If other, details<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Specify your Relation"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>indicate occupation of patient<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Picker
                mode="dropdown"
                placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: "#fff",
                }}
                itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                style={{ width: "100%", color: "#000", }}
                onValueChange={(sample) => { this.setState({ Occupation: sample }) }}
                selectedValue={this.state.Occupation}
                testID="editJobType"
              >

                {Occupation.map((value, key) => {

                  return <Picker.Item label={String(value)} value={String(value)} key={key}
                  />
                })
                }
              </Picker>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If other, details<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Specify your ocupation"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Address<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Address Details"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>City<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter City"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>State<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter State"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Country<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Country"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>No and Street<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter No and Street"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Phone Number<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Phone Number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Email ID<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Email ID"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  }

  hospitalizationDetails(item, index) {
    const { isSelected, selectedAdmissionDate, isVisibleDatePicker } = this.state
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Name of Hospital<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Name of Hospital"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>indicate occupation of patient<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Picker
                mode="dropdown"
                placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: "#fff",
                }}
                itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                style={{ width: "100%", color: "#000", }}
                onValueChange={(sample) => { this.setState({ RoomCategory: sample }) }}
                selectedValue={this.state.RoomCategory}
                testID="editJobType"
              >

                {RoomCategory.map((value, key) => {

                  return <Picker.Item label={String(value)} value={String(value)} key={key}
                  />
                })
                }
              </Picker>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Hospitalization due to<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Picker
                mode="dropdown"
                placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: "#fff",
                }}
                itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                style={{ width: "100%", color: "#000", }}
                onValueChange={(sample) => { this.setState({ Hospitalization: sample }) }}
                selectedValue={this.state.Hospitalization}
                testID="editJobType"
              >

                {Hospitalization.map((value, key) => {

                  return <Picker.Item label={String(value)} value={String(value)} key={key}
                  />
                })
                }
              </Picker>
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date Of injury<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date Of injury'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date Of Admission<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date Of Admission'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Time of admission<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="hh/mm"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date Of Discharge<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date Of Discharge'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Time of discharge<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="hh/mm"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If injury, give cause<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Picker
                mode="dropdown"
                placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: "#fff",
                }}
                itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                style={{ width: "100%", color: "#000", }}
                onValueChange={(sample) => { this.setState({ InjuryCause: sample }) }}
                selectedValue={this.state.InjuryCause}
                testID="editJobType"
              >

                {InjuryCause.map((value, key) => {

                  return <Picker.Item label={String(value)} value={String(value)} key={key}
                  />
                })
                }
              </Picker>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>If Medico legal<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Reported to police<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>MLC Report police FIR attached<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>

              </View>
            </Item>
          </Col>
        </Row>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter system of medicine<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter system of medicine"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>

        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  claimDetail(item, index) {
    const { isSelected, } = this.state

    return (
      <View>
        <Text>Details of treatment expenses claimed</Text>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter Pre hospitalization Expense<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Pre hospitalization Expense"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter Hospitalization Expenses<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Hospitalization Expenses"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter Post hospitalization Expense<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Post hospitalization Expense"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter Health checkup costs<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Health checkup costs in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Enter Ambulance charges<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Ambulance charges"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Others code<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Others code"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>TOTAL<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter TOTAL"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Pre Hospitalization period<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Pre Hospitalization period"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Post Hospitalization period<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Post Hospitalization period"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Claim for domiciliary hospitalization<Text style={{ color: 'red' }}>*</Text></Text>

            <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={isSelected === true}
                onPress={() => this.setState({ isSelected: true })}
              />
              <Text style={styles.text}>Yes</Text>

              <View style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={isSelected === false}
                  onPress={() => this.setState({ isSelected: false })}
                />
                <Text style={styles.text}>No</Text>
                <Text> If yes, provide details in annexure</Text>

              </View>
            </Item>
          </Col>
        </Row>
        <Text>Details of lump sum cash claimed</Text>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Hospital daily cash<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter health ceckup cost in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Surgical cash<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Surgical cash"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Critical illness benefit<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>CONVALESCENCE<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Pre post Lump sum benefit<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Others<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>TOTAL<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter in Rs"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>


        <FlatList
          data={ListOfData}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.checkBoxClick}
          renderItem={({ item, index }) => (
            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, marginLeft: 10 }}>
              <CheckBox style={{ borderRadius: 5, }}
                checked={this.state.checkBoxClick === item.text}
                onPress={() => this.setState({ checkBoxClick: item.text })}

              />
              <Text style={styles.flatlistText}>{item.text}</Text>
            </View>
          )} />

        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }



  billEnclosedDeatil(item, index) {
    const { isSelected, selectedAdmissionDate, isVisibleDatePicker } = this.state

    return (
      <View style={{ padding: 10, marginTop: 10 }}>
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>SL No</Text>
          <Text style={[styles.form_field, { paddingTop: 10, paddingLeft: 10 }]}>1</Text>
        </View>
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>BILL No</Text>
          <Input
            placeholder="Enter BILL No "
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
            //   value={employeeId}
            style={styles.form_field}
            keyboardType={'number-pad'}
          //   editable={employeeId == undefined ? true : false}
          //   onChangeText={(enteredEmployeeIdText) =>
          //     this.setState({employeeId: enteredEmployeeIdText})
          //   }
          />
        </View>
        <View style={styles.form_field_view}>
          <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 12 }}>Date of</Text>

            <Text style={{ fontSize: 12 }}>hospitalization</Text>

          </View>
          <TouchableOpacity style={[styles.form_field, { flexDirection: 'row' }]} onPress={() => {
            this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
          }}>
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
                : 'Date of hospitalization'}
            </Text>
            <DateTimePicker
              mode={'date'}
              minimumDate={subTimeUnit(new Date(), 7, 'days')}
              maximumDate={new Date()}
              value={selectedAdmissionDate}
              isVisible={isVisibleDatePicker}
              onConfirm={this.onPressConfirmDateValue}
              onCancel={() =>
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>Inssured by</Text>
          <Input
            placeholder="Enter Inssured by details "
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
            //   value={employeeId}
            style={styles.form_field}
            keyboardType={'number-pad'}
          //   editable={employeeId == undefined ? true : false}
          //   onChangeText={(enteredEmployeeIdText) =>
          //     this.setState({employeeId: enteredEmployeeIdText})
          //   }
          />
        </View>
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>Towards</Text>
          <Input
            placeholder="Enter Towards details "
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
            //   value={employeeId}
            style={styles.form_field}
            keyboardType={'number-pad'}
          //   editable={employeeId == undefined ? true : false}
          //   onChangeText={(enteredEmployeeIdText) =>
          //     this.setState({employeeId: enteredEmployeeIdText})
          //   }
          />
        </View>
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>AMOUNT(RS)</Text>
          <Input
            placeholder="Enter Amount "
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
            //   value={employeeId}
            style={styles.form_field}
            keyboardType={'number-pad'}
          //   editable={employeeId == undefined ? true : false}
          //   onChangeText={(enteredEmployeeIdText) =>
          //     this.setState({employeeId: enteredEmployeeIdText})
          //   }
          />
        </View>
      </View>

    )
  }

  primaryInsuredBank(item, index) {
    return (
      <View>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>PAN<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter PAN number"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Account No<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Bank Account No"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Bank Branch Name<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Bank Branch Name"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Cheque dd payable details<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Cheque dd payable details"
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>IFSC Code<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter IFSC Code of bank branch "
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  declarationByInsured(item, index) {
    const { selectedAdmissionDate, isVisibleDatePicker } = this.state
    return (
      <View>
        <Text style={{ padding: 8, fontSize: 14 }}>I hereby declare that the information furnished in the claim form is true & correct to the best of my knowledge and belief. If I have made any false or untrue statement. suppression or concealent of any material fact with respect to questions asked in relation to this claim, my right to claim reimbrusement shall be forfeited1 I .:ilso consent & authorize TPA / insurance Company, to seek necessary medical information/ documents frorn any hospital/ Medical Practitioner who has attended on the person against whom this claim is made. I hereby declare that I have included all the bills / receipts for the purpose of this claim & that I will not be making any supplementary daim except the pre/post-hospitalization claim, if any.
</Text>

        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Place<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Place "
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Date of hospitalization<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>

              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
              }}>
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
                    : 'Date of hospitalization'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  maximumDate={new Date()}
                  value={selectedAdmissionDate}
                  isVisible={isVisibleDatePicker}
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={() =>
                    this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
                  }
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>
        <Row
          size={4}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>Signature of insured<Text style={{ color: 'red' }}>*</Text></Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Signature of insured "
                placeholderTextColor={'#CDD0D9'}
                returnKeyType={'next'}
                //   value={employeeId}
                keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              //   onChangeText={(enteredEmployeeIdText) =>
              //     this.setState({employeeId: enteredEmployeeIdText})
              //   }
              />
            </Item>
          </Col>
        </Row>
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
          <TouchableOpacity style={{ backgroundColor: primaryColor, paddingHorizontal: 30, paddingVertical: 6, borderRadius: 10 }} >
            <Text style={{ color: "#fff" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }




  render() {
    const data = [
      { title: 'Details of primary insured', id: 1 },
      { title: 'Details of insurance history', id: 2 },
      { title: 'Details of insured person hospitalized', id: 3 },
      { title: 'Details of hospitalization', id: 4 },
      { title: 'Details of claim', id: 5 },
      { title: 'Details of bills enclosed', id: 6 },
      { title: 'Details of primary insured bank account', id: 7 },
      { title: 'Declaration by insured', id: 8 }]
    const { showCard, show } = this.state
    return (
      <Container>
        <Content contentContainerStyle={{ padding: 10 }}>

          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                {this.state.showCard === index && !this.state.show ? (
                  <Card>
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10, backgroundColor: primaryColor }} onPress={() => { this.setState({ showCard: true }) }}>
                      <Row>
                        <Col size={9}>
                          <Text style={{ color: '#fff' }}>{item.title}</Text>
                        </Col>
                        <Col size={1}>
                          <TouchableOpacity
                            onPress={() => this.toggleData(index, 'UP')}>
                            <MaterialIcons
                              name={
                                showCard === index && !show
                                  ? 'keyboard-arrow-up'
                                  : 'keyboard-arrow-down'
                              }
                              style={{ fontSize: 25, color: '#fff' }}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                    <View style={{
                      borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomColor: '#909090',
                      borderLeftColor: '#909090', borderRightColor: '#909090', paddingBottom: 10
                    }}>
                      {item.id === 1 && this.primaryInsured(item, index)}
                      {item.id === 2 && this.insuranceHistory(item, index)}
                      {item.id === 3 && this.insuredPersonHospitalized(item, index)}
                      {item.id === 4 && this.hospitalizationDetails(item, index)}
                      {item.id === 5 && this.claimDetail(item, index)}
                      {item.id === 6 && this.billEnclosedDeatil(item, index)}
                      {item.id === 7 && this.primaryInsuredBank(item, index)}
                      {item.id === 8 && this.declarationByInsured(item, index)}
                    </View>
                  </Card>) : (
                  <Card>
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10,height:50 }} onPress={() => { this.setState({ showCard: false }) }}>
                      <Row>
                        <Col size={9}>
                          <Text style={{ color: '#000' }}>{item.title}</Text>
                        </Col>
                        <Col size={1}>
                          <TouchableOpacity
                            onPress={() => this.toggleData(index, 'DOWN')}>
                            <MaterialIcons
                              name={
                                showCard === index && !show
                                  ? 'keyboard-arrow-up'
                                  : 'keyboard-arrow-down'
                              }
                              style={{ fontSize: 25, color: '#000' }}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  </Card>
                )}

              </View>
            )}
          />
        </Content>
      </Container>
    )
  }
}


export default SubmitClaim