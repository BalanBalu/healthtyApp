import React from 'react';
import {
  Container,
  Text,
  View,
  Radio,
  DatePicker,
  Icon,
  Header,
  Content,
} from 'native-base';
import {TextInput, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {subTimeUnit, formatDate} from '../../../../setup/helpers';

// import styles from '../styles'

class PreAuth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentForm: 1,
      chosenDate: new Date(1940, 0, 1),
      selectedGender: 'male',
      alreadyHaveInsurance: 'yes',
      referenceID: 'SMTTH7',
      haveFamilyPhysician: 'yes',
    };
    this.onDOBChange = this.onDOBChange.bind(this);
  }

  onDOBChange(dob) {
    console.log('bbbbbb', dob);
    this.setState({chosenDate: dob});
  }

  InsurerDetails = () => {
    return (
      <ScrollView style={styles.body}>
        {/* <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text> */}
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.headerText}>
            Details of third party administrator
          </Text>
          <Text style={styles.inputLabel}>A. Name of TPA Company</Text>
          <TextInput
            value={'MEDI ASSIT INSURANCE'}
            style={[
              styles.inputText,
              {
                backgroundColor: '#E1E2E5',
                borderColor: '#7F49C3',
                color: '#707070',
              },
            ]}
          />
          <Text style={styles.inputLabel}>B. Phone Number</Text>
          <TextInput
            value={'080 220686666'}
            style={[
              styles.inputText,
              {
                backgroundColor: '#E1E2E5',
                borderColor: '#7F49C3',
                color: '#707070',
              },
            ]}
          />
          <Text style={styles.inputLabel}>C. Toll Free Fax No</Text>
          <TextInput
            value={'1800 425 9559'}
            style={[
              styles.inputText,
              {
                backgroundColor: '#E1E2E5',
                borderColor: '#7F49C3',
                color: '#707070',
              },
            ]}
          />
          <Text style={styles.headerText}>
            to be filled by insurer / patient
          </Text>
          <Text style={styles.inputLabel}>A. Name of the patient</Text>
          <TextInput
            placeholder={'Enter name of patient'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>B. Gender</Text>
          <View style={{flexDirection: 'row'}}>
            <Radio
              style={{marginLeft: 40}}
              standardStyle={true}
              selected={this.state.selectedGender === 'male' ? true : false}
            />
            <Text style={{marginLeft: 10}}>Male</Text>
            <Radio
              style={{marginLeft: 40}}
              standardStyle={true}
              // selected={this.state.selectedGender === 'male' ? true : false}
            />
            <Text style={{marginLeft: 10}}>Female</Text>
          </View>
          <Text style={styles.inputLabel}>C. Concat No</Text>
          <TextInput
            placeholder={'Enter contact no'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>D. Alternate Concat No</Text>
          <TextInput
            placeholder={'Enter alternate contact no'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>E. Age</Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              placeholder={'YY'}
              style={[
                styles.inputText,
                {width: 160, marginRight: 0, textAlign: 'center'},
              ]}
            />
            <TextInput
              placeholder={'MM'}
              style={[
                styles.inputText,
                {width: 160, marginLeft: 10, textAlign: 'center'},
              ]}
            />
          </View>
          <Text style={styles.inputLabel}>F. Date of birth</Text>
          {/* 
          style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
          */}
          <View style={[{flexDirection: 'row'}, styles.inputText]}>
            <DatePicker
              style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
              //   defaultDate={new Date()}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={subTimeUnit(new Date(), 1, 'year')}
              animationType={'fade'}
              androidMode={'default'}
              placeHolderText={
                this.state.chosenDate === ''
                  ? 'Date Of Birth'
                  : formatDate(this.state.chosenDate, 'DD-MM-YYYY')
              }
              textStyle={{color: '#5A5A5A'}}
              value={this.state.chosenDate}
              placeHolderTextStyle={{color: '#5A5A5A'}}
              onDateChange={dob => {
                this.onDOBChange(dob);
              }}
              disabled={this.dobIsEditable}
            />
            <Icon
              name="calendar"
              style={{color: '#3E4459', marginTop: 8, marginLeft: 160}}
            />
          </View>
          <Text style={styles.inputLabel}>G. Insurer ID Card No</Text>
          <TextInput
            placeholder={'Enter Insurer ID Card No'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>
            H. Policy number / Name of corporate
          </Text>
          <TextInput
            placeholder={'Enter policy no / corporate name'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>I. Employee ID</Text>
          <TextInput
            placeholder={'Enter Employee ID'}
            style={styles.inputText}
          />
          <Text style={[styles.inputLabel, {lineHeight: 26}]}>
            J. Currently you have any other medical claim / insurance
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 1}}>
            <Radio
              onPress={() => {
                this.setState({alreadyHaveInsurance: 'yes'});
              }}
              style={{marginLeft: 40}}
              standardStyle={true}
              selected={
                this.state.alreadyHaveInsurance === 'yes' ? true : false
              }
            />
            <Text style={{marginLeft: 10}}>Yes</Text>
            <Radio
              onPress={() => {
                this.setState({alreadyHaveInsurance: 'no'});
              }}
              style={{marginLeft: 40}}
              standardStyle={true}
              selected={this.state.alreadyHaveInsurance === 'no' ? true : false}
            />
            <Text style={{marginLeft: 10}}>No</Text>
          </View>

          <Text style={styles.inputLabel}>J.1. Insurer Name</Text>
          <TextInput
            placeholder={'Enter Employee ID'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>J.2. Give Details</Text>
          <TextInput
            placeholder={'Enter Employee ID'}
            style={styles.inputText}
          />

          <Text style={[styles.inputLabel, {lineHeight: 26}]}>
            K. If you have family physician
          </Text>
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Radio
              onPress={() => {
                this.setState({haveFamilyPhysician: 'yes'});
              }}
              style={{marginLeft: 40}}
              standardStyle={true}
              selected={this.state.haveFamilyPhysician === 'yes' ? true : false}
            />
            <Text style={{marginLeft: 10}}>Yes</Text>
            <Radio
              onPress={() => {
                this.setState({haveFamilyPhysician: 'no'});
              }}
              style={{marginLeft: 40}}
              standardStyle={true}
              selected={this.state.haveFamilyPhysician === 'no' ? true : false}
            />
            <Text style={{marginLeft: 10}}>No</Text>
          </View>
          {this.state.haveFamilyPhysician === 'yes' ? (
            <TextInput
              placeholder={'Enter Physician name'}
              style={styles.inputText}
            />
          ) : null}
          {this.state.haveFamilyPhysician === 'yes' ? (
            <View>
              <Text style={styles.inputLabel}>K.1. Contact No</Text>
              <TextInput
                placeholder={'Enter Contact No'}
                style={styles.inputText}
              />
            </View>
          ) : null}
          <Text style={styles.inputLabel}>
            L. Occupation of insured patient
          </Text>
          <TextInput
            placeholder={'Enter Occupation of insured patient'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>M. Address of insured patient</Text>
          <TextInput
            placeholder={''}
            style={[styles.inputText, {height: 100}]}
          />
          <Text style={styles.headerText}>Upload your aadhar copy</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../../../../../assets/images/documentCloud.png')}
              style={{height: 60, width: 110}}
            />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({currentForm: 1});
              }}
              style={[
                styles.buttonStyle,
                {
                  width: 160,
                  backgroundColor: '#fff',
                  borderColor: '#7F49C3',
                },
              ]}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#7F49C3',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({currentForm: 3});
              }}
              style={[
                styles.buttonStyle,
                {
                  width: 160,
                  backgroundColor: '#7F49C3',
                  marginLeft: 10,
                },
              ]}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#fff',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  DoctorDetails = () => {
    return (
      <ScrollView style={styles.body}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.headerText}>
            to be filled by the treating doctor / hospital
          </Text>
          <Text style={styles.inputLabel}>A. Name of treating doctor</Text>
          <TextInput
            placeholder={'Enter Name of treating doctor'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>B. Contact No</Text>
          <TextInput
            placeholder={'Enter contact no'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>
            C. Name of illness/disease with presenting complaints
          </Text>
          <TextInput
            placeholder={''}
            style={[styles.inputText, {height: 100}]}
          />
          <Text style={styles.inputLabel}>D. Relevant clinical findings</Text>
          <TextInput
            placeholder={''}
            style={[styles.inputText, {height: 100}]}
          />
          <Text style={styles.inputLabel}>
            E. Duration of the present ailment in days
          </Text>
          <TextInput
            placeholder={'Enter duration of present ailment'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>E.1. Date of first consultation</Text>
          <View style={[{flexDirection: 'row'}, styles.inputText]}>
            <DatePicker
              style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
              //   defaultDate={new Date()}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={subTimeUnit(new Date(), 1, 'year')}
              animationType={'fade'}
              androidMode={'default'}
              placeHolderText={
                this.state.chosenDate === ''
                  ? 'Date Of Birth'
                  : formatDate(this.state.chosenDate, 'DD-MM-YYYY')
              }
              textStyle={{color: '#5A5A5A'}}
              value={this.state.chosenDate}
              placeHolderTextStyle={{color: '#5A5A5A'}}
              onDateChange={dob => {
                this.onDOBChange(dob);
              }}
              disabled={this.dobIsEditable}
            />
            <Icon
              name="calendar"
              style={{color: '#3E4459', marginTop: 8, marginLeft: 160}}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({currentForm: 2});
              }}
              style={[
                styles.buttonStyle,
                {
                  width: 160,
                  backgroundColor: '#fff',
                  borderColor: '#7F49C3',
                },
              ]}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#7F49C3',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({currentForm: 4});
              }}
              style={[
                styles.buttonStyle,
                {
                  width: 160,
                  backgroundColor: '#7F49C3',
                  marginLeft: 10,
                },
              ]}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#fff',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                SUBMIT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  FormComplete = () => {
    return (
      <ScrollView style={styles.body}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.headerText}>
            your request is being processed, will be notified on successful
            completion of request, your reference id is {this.state.referenceID}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.setState({currentForm: 2});
              }}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#fff',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                Go to Homepage
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  HospitalDetails = () => {
    return (
      <ScrollView style={styles.body}>
        <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.headerText}>enter hospital details</Text>
          <Text style={styles.inputLabel}>Name of the hospital</Text>
          <TextInput
            placeholder={'Enter name of the hospital'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital Location</Text>
          <TextInput
            placeholder={'Enter hospital location'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital ID</Text>
          <TextInput
            placeholder={'Enter hospital ID'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>Hospital Email ID</Text>
          <TextInput placeholder={'Enter Email ID'} style={styles.inputText} />
          <Text style={styles.inputLabel}>Rohini ID</Text>
          <TextInput placeholder={'Enter Rohini ID'} style={styles.inputText} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.setState({currentForm: 2});
              }}>
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  color: '#fff',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 7,
                  textTransform: 'uppercase',
                }}>
                proceed to next step
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  render() {
    const {currentForm} = this.state;
    if (currentForm === 1) {
      return <this.HospitalDetails />;
    } else if (currentForm === 2) {
      return <this.InsurerDetails />;
    } else if (currentForm === 3) {
      return <this.DoctorDetails />;
    } else if (currentForm === 4) {
        return <this.FormComplete />;
      }
  }
}

const styles = StyleSheet.create({
  /* Hospital Details styling Start */
  body: {
    backgroundColor: '#EFF3F5',
    fontFamily: 'OpenSans, sans-serif',
    display: 'flex',
  },
  buttonStyle: {
    borderColor: '#7F49C3',
    // marginLeft: 40,
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 41,
    width: 330,
    borderRadius: 4,
    backgroundColor: '#7F49C3',
    color: '#ffffff',
  },
  headerText: {
    textTransform: 'uppercase',
    fontWeight: '700',
    marginLeft: 40,
    color: '#3E4459',
    lineHeight: 26,
    fontFamily: 'OpenSans, sans-serif',
    marginRight: 40,
    marginTop: 20,
  },
  formHeader: {
    color: '#7F49C3',
    fontWeight: 'bold',
    lineHeight: 30,
    fontSize: 17,
    fontFamily: 'OpenSans, sans-serif',
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
  },
  inputText: {
    height: 50,
    borderRadius: 6,
    borderColor: '#E0E1E4',
    borderWidth: 2,
    marginLeft: 40,
    backgroundColor: '#fff',
    marginRight: 40,
    paddingLeft: 18,
  },
  inputLabel: {
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#3E4459',
    marginTop: 20,
    fontFamily: 'OpenSans, sans-serif',
  },
  /* Hospital Details End */
});
function profileState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(profileState)(PreAuth);
