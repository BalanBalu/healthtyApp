import React from 'react';
import {
  Text,
  View,
  Radio,
  Icon,
  Row,
  Col
} from 'native-base';
import { TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { formatDate } from '../../../../setup/helpers';
import {  onlySpaceNotAllowed, validateMobileNumber,getNetworkHospitalAddress,truncateByString,calculateAge } from '../../../common'
import DateTimePicker from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { serviceOfSearchByNetworkHospitalDetails } from '../../../providers/corporate/corporate.actions';
import IconName from 'react-native-vector-icons/MaterialIcons'
import { primaryColor } from '../../../../setup/config';

class PreAuth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentForm: 1,
      networkHospList: [],
      hospitalInfo: {
        hospitalName: '',
        hospitalLocation: '',
        hospitalId: '',
        hospitalEmail: '',
        rohiniId: ''
      },
      hospitalInfomation: {},
      tpaInformation: {},
      tpaInfo: {
        tpaCompany: '',
        tpaCompanyPhoneNumber: '',
        tpaTollFreeFaxNo: ''
      },
      memberInformation: {},
      memberInfo: {
        patientName: '',
        contactNo: '',
        alterNateContactNumber: '',
        patientAgeInYr: '',
        patientAgeMonth: '',
        insurerId: '',
        policyNo: '',
        employeeId: '',
        selectedGender: 'Male',
        dob: new Date(),
      },
      selectedHospitalName: '',
      insurerName: '',
      physicianName: '',
      physicianContactNumber: '',
      insurerPatientOccupation: '',
      insurerPatientAddress: '',
      treatingDoctorName: '',
      treatingDoctorContactNo: '',
      diseaseDiscription: '',
      releventClinical: '',
      durationOfPresent: '',
      isLoading: false,
      imageData: null,
      selectOptionPoopup: false,
      chosenDate: new Date(),
      firstConsultantDate: new Date(),
      alreadyHaveInsurance: 'yes',
      referenceID: '',
      haveFamilyPhysician: 'yes',
      errorMsg: null,
      isOnlyDateTimePickerVisible: false,
      TpaComErrorMsg: null,
      MobileNumError: null,
      tpaTollFreeFaxNoErrorMsg: null,
      patientNameErrorMsg: null,
      contactNoErrorMsg: null,
      patientAgeErrorMsg: null,
      patientMonthErrorMsg: null,
      patientIDCardErrorMsg: null,
      policyNoTextErrorMsg: null,
      employeeIdTextErrorMsg: null,
      insureNameTextErrorMsg: null,
      PhysicianNameTextErrorMsg: null,
      physicianContactNoTextErrorMsg: null,
      insurerPatientOccupationsErrorMsg: null,
      insurerPatientAddressTextErrorMsg: null,
      treatingDoctorNameTextErrorMsg: null,
      treatingDoctorContactNoTextErrorMsg: null,
      diseaseDiscriptionTextErrorMsg: null,
      releventClinicalTextErrorMsg: null,
      durationOfPresentTextErrorMsg: null,
      hospitalNameTextErrorMsg: null,
      hospitalLocationTextErrorMsg: null,
      hospitalIdTextErrorMsg: null,
      rohiniIdTextErrorMsg: null,
      hospitalEmailTextErrorMsg: null
    };

    this.preAuthInfoObj = props.navigation.getParam('preAuthInfo') || null
    this.onDOBChange = this.onDOBChange.bind(this);
  }
  async componentDidMount() {
    let preAuthInfo = this.props.navigation.getParam('preAuthInfo')
    let currentForm = this.props.navigation.getParam('currentForm') || 1
    let uploadDocs = this.props.navigation.getParam('uploadDocs') || 1;


    /* Get Network Hospital list by Member TPA Code   */
    const tpaCode = preAuthInfo && preAuthInfo.tpaInfo && preAuthInfo.tpaInfo.tpaCode;
    if (tpaCode) {
      const reqData4GetNetworkWithoutLoc = { tpaCode };
      const getHospitalList = await serviceOfSearchByNetworkHospitalDetails(reqData4GetNetworkWithoutLoc);
            if (getHospitalList && getHospitalList.length) {
              var networkHospList = getHospitalList;
            }
    }
    let hospitalInfo = preAuthInfo.hospitalInfo || {};
    let tpaInfo = preAuthInfo.tpaInfo || {}
    let tpaInformation = {
      tpaCompany: tpaInfo.tpaName || '',
      tpaCompanyPhoneNumber: tpaInfo.tpaPhoneNumber || '',
      tpaTollFreeFaxNo: ''
    }
    const selectedHospitalAddress= {
      address:hospitalInfo.address,
      city:hospitalInfo.city,
      state:hospitalInfo.state,
      pinCode:hospitalInfo.pinCode
     }
    let hospitalInfomation = {
      hospitalName: hospitalInfo.hospitalName || '', 
      hospitalLocation:  getNetworkHospitalAddress(selectedHospitalAddress)||'',
      hospitalId: '',
      hospitalEmail: hospitalInfo.email || '',
      rohiniId: hospitalInfo.rohiniId||''
    }
    let memberInformation = this.props.navigation.getParam('memberInfo');
    let memberInfo = {
      patientName: this.getMemberName(memberInformation),
      relationship: memberInformation.relationship || '',
      contactNo: memberInformation.mobile || '',
      alterNateContactNumber: memberInformation.phone || '',
      patientAgeInYr:memberInformation.age?String(memberInformation.age) :'',
      patientAgeMonth:memberInformation.month?String(memberInformation.month ): '0',
      insurerId: memberInformation.memberId || '',
      policyNo: memberInformation.policyNo || '',
      employeeId: memberInformation.employeeId || '',
      selectedGender: memberInformation.gender || '',
      dob: memberInformation.dob || new Date()
    }
    await this.setState({ networkHospList: networkHospList || [], hospitalInfo: hospitalInfomation, hospitalInfomation: hospitalInfomation, tpaInformation: tpaInformation, tpaInfo: tpaInformation, memberInfo: memberInfo, memberInformation: memberInfo, currentForm, imageData: uploadDocs })
  }
  getMemberName(item) {
    let name = ''
    if (item.firstName) {
      name += item.firstName + ' '
    }
    if (item.middleName) {
      name += item.middleName + ' '
    }
    if (item.lastName) {
      name += item.lastName + ' '
    }
    return name

  }
  showOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: true })
  }
  hideOnlyDateTimePicker = () => {
    this.setState({ isOnlyDateTimePickerVisible: false })
  }
  handleOnlyDateTimePicker = (date) => {
    try {
      let temp = this.state.memberInfo
      temp.dob = date;
     const getAge= calculateAge(date);
     if(getAge){
      temp.patientAgeInYr=String(getAge.years);
      temp.patientAgeMonth=String(getAge.months);
     }
      this.setState({
        isOnlyDateTimePickerVisible: false,
        memberInfo: temp
      })
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  }

  onDOBChange(dob) {
    this.setState({ chosenDate: dob });
  }
  submitFirstPage() {
    const { hospitalInfo } = this.state
    let errorMsg = !onlySpaceNotAllowed(hospitalInfo.hospitalName) ? 'Kindly fill hospital name' : !onlySpaceNotAllowed(hospitalInfo.hospitalLocation) ? 'Kindly fill hospital location': null

    if (!onlySpaceNotAllowed(hospitalInfo.hospitalName)) {
      this.setState({ hospitalNameTextErrorMsg: 'Kindly fill hospital name' });
      this.scrollViewRef.scrollTo({
        y: this.hospitalNameText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(hospitalInfo.hospitalLocation)) {
      this.setState({ hospitalLocationTextErrorMsg: 'Kindly fill hospital location' });
      this.scrollViewRef.scrollTo({
        y: this.hospitalLocationText.y,
        animated: true
      });
      return false;
    }
    // if (!onlySpaceNotAllowed(hospitalInfo.hospitalId)) {
    //   this.setState({ hospitalIdTextErrorMsg: 'Kindly fill hospital id' });
    //   this.scrollViewRef.scrollTo({
    //     y: this.hospitalIdText.y,
    //     animated: true
    //   });
    //   return false;
    // }
    // if (!onlySpaceNotAllowed(hospitalInfo.rohiniId)) {
    //   this.setState({ rohiniIdTextErrorMsg: 'Kindly fill rohini Id' });
    //   this.scrollViewRef.scrollTo({
    //     y: this.rohiniIdText.y,
    //     animated: true
    //   });
    //   return false;
    // }
    // if (!onlySpaceNotAllowed(hospitalInfo.hospitalEmail)) {
    //   this.setState({ hospitalEmailTextErrorMsg: 'Kindly enter  mail id' });
    //   this.scrollViewRef.scrollTo({
    //     y: this.hospitalEmailText.y,
    //     animated: true
    //   });
    //   return false;
    // }


    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      this.setState({ currentForm: 2, errorMsg: null });
    }
  }
  submitSecandPage() {
    const { tpaInfo, memberInfo, insurerName,
      physicianName, physicianContactNumber, insurerPatientOccupation, insurerPatientAddress,
      hospitalInfo,
    } = this.state
    let errorMsg = null

    if (!onlySpaceNotAllowed(tpaInfo.tpaCompany)) {
      this.setState({ TpaComErrorMsg: 'Kindly fill tpa  company name' });
      this.scrollViewRef.scrollTo({
        y: this.TpaCompany.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(tpaInfo.tpaCompanyPhoneNumber)) {
      this.setState({ MobileNumError: 'Kindly fill tpa  company mobile number' });
      this.scrollViewRef.scrollTo({
        y: this.PhoneNumber.y,
        animated: true
      });
      return false;
    }

    if (!onlySpaceNotAllowed(memberInfo.patientName)) {
      this.setState({ patientNameErrorMsg: 'Kindly fill patient name' });
      this.scrollViewRef.scrollTo({
        y: this.patientNameText.y,
        animated: true
      });
      return false;
    }

    if (!onlySpaceNotAllowed(memberInfo.contactNo)) {
      this.setState({ contactNoErrorMsg: 'Kindly fill valid  contact number' });
      this.scrollViewRef.scrollTo({
        y: this.contactNoText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(memberInfo.patientAgeInYr)) {
      this.setState({ patientAgeErrorMsg: 'Kindly fill age Year' });
      this.scrollViewRef.scrollTo({
        y: this.patientAgeText.y,
        animated: true
      });
      return false;
    }

    if (!onlySpaceNotAllowed(memberInfo.patientAgeMonth)) {
      this.setState({ patientMonthErrorMsg: 'Kindly fill age month' });
      this.scrollViewRef.scrollTo({
        y: this.patientAgeText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(memberInfo.insurerId)) {
      this.setState({ patientIDCardErrorMsg: 'Kindly fill insurer id' });
      this.scrollViewRef.scrollTo({
        y: this.patientIDCardText.y,
        animated: true
      });
      return false;
    }

    if (!onlySpaceNotAllowed(memberInfo.policyNo)) {
      this.setState({ policyNoTextErrorMsg: 'Kindly fill policy number' });
      this.scrollViewRef.scrollTo({
        y: this.policyNoText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(memberInfo.employeeId)) {
      this.setState({ employeeIdTextErrorMsg: 'Kindly fill employee ID' });
      this.scrollViewRef.scrollTo({
        y: this.EmployeeIdText.y,
        animated: true
      });
      return false;
    }
    if (this.state.alreadyHaveInsurance === 'yes') {
      if (!onlySpaceNotAllowed(insurerName)) {
        this.setState({ insureNameTextErrorMsg: 'Kindly fill insurer name' });
        this.scrollViewRef.scrollTo({
          y: this.InsureNameText.y,
          animated: true
        });
        return false;
      }
    }

    if (this.state.haveFamilyPhysician === 'yes') {

      if (!onlySpaceNotAllowed(physicianName)) {
        this.setState({ PhysicianNameTextErrorMsg: 'Kindly fill physician name' });
        this.scrollViewRef.scrollTo({
          y: this.personalPhysicianNameText.y,
          animated: true
        });
        return false;
      }
      if (!validateMobileNumber(physicianContactNumber)) {
        this.setState({ physicianContactNoTextErrorMsg: 'Kindly fill  valid physician contact number' });
        this.scrollViewRef.scrollTo({
          y: this.physicianContactNoText.y,
          animated: true
        });
        return false;
      }
    }
    if (!onlySpaceNotAllowed(insurerPatientOccupation)) {
      this.setState({ insurerPatientOccupationsErrorMsg: "Patient occupation field can't be empty"});
      this.scrollViewRef.scrollTo({
        y: this.insurerPatientOccupations.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(insurerPatientAddress)) {
      this.setState({ insurerPatientAddressTextErrorMsg: "Patient address field can't be empty" });
      this.scrollViewRef.scrollTo({
        y: this.insurerPatientAddressText.y,
        animated: true
      });
      return false;
    }
    if (errorMsg) {
      this.setState({ errorMsg: errorMsg });
    } else {
      let reqData = {
        hospitalName: hospitalInfo.hospitalName,
        hospitalLocation: hospitalInfo.hospitalLocation,
        hospitalId: hospitalInfo.hospitalId,
        hospitalEmail: hospitalInfo.hospitalEmail,
        rohiniId: hospitalInfo.rohiniId ||null,
        status: 'REQUEST-SENT',
        tpaCompany: tpaInfo.tpaCompany,
        tpaCompanyPhoneNumber: tpaInfo.tpaCompanyPhoneNumber,
        tpaTollFreeFaxNo: tpaInfo.tpaTollFreeFaxNo,
        patientName: memberInfo.patientName,
        patientRelationship: memberInfo.relationship,
        patientDob: memberInfo.dob,
        patientGender: memberInfo.selectedGender,
        patientAgeInYr:parseInt(memberInfo.patientAgeInYr),
        patientAgeMonth: parseInt(memberInfo.patientAgeMonth),
        insurerId: memberInfo.insurerId,
        policyNo: memberInfo.policyNo,
        employeeId: memberInfo.employeeId,
        insurerName: memberInfo.insurerName,
        physicianName: physicianName,
        physicianContactNumber: physicianContactNumber,
        insurerPatientOccupation: insurerPatientOccupation,
        insurerPatientAddress: insurerPatientAddress
      }
      this.props.navigation.navigate('DocumentList', { docsUpload: true, isFromPreAuthReq: true, preAuthReqData: reqData });
    }
  }
  InsurerDetails = () => {
    const { tpaInfo, tpaInformation, memberInfo, memberInformation } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.body} ref={ref => (this.scrollViewRef = ref)}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.headerText}>
              Details of third party administrator
          </Text>
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.TpaCompany = event.nativeEvent.layout)
              }>A. Name of TPA Company</Text>
            <TextInput
              value={tpaInfo.tpaCompany}
              editable={tpaInformation.tpaCompany === '' ? true : false}
              onChangeText={(text) => this.setState({
                tpaInfo: {
                  ...tpaInfo,
                  tpaCompany: text
                }, TpaComErrorMsg: null
              })}
              style={[
                styles.inputText,
                this.state.TpaComErrorMsg != null ?
                  {
                    borderColor: 'red',

                  } :
                  styles.inputText
                ,
              ]}
            />
            {this.state.TpaComErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right' }}>{this.state.TpaComErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.PhoneNumber = event.nativeEvent.layout)
              }>B. Phone Number</Text>
            <TextInput
              value={tpaInfo.tpaCompanyPhoneNumber}
              editable={tpaInformation.tpaCompanyPhoneNumber === '' ? true : false}
              onChangeText={(text) => this.setState({
                tpaInfo: {
                  ...tpaInfo,
                  tpaCompanyPhoneNumber: text,

                }, MobileNumError: null
              })}

              style={[
                styles.inputText,
                this.state.MobileNumError != null ?
                  {
                    borderColor: 'red',
                  } :
                  styles.inputText
                ,
              ]}
            />
            {this.state.MobileNumError !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.MobileNumError}</Text>
              : null}

            <Text style={styles.headerText}>
              to be filled by insurer / patient
          </Text>
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.patientNameText = event.nativeEvent.layout)
              }>A. Name of the patient</Text>
            <TextInput
              value={memberInfo.patientName}
              editable={memberInformation.patientName === '' ? true : false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  patientName: text,

                }, patientNameErrorMsg: null
              })}


              placeholder={'Enter name of patient'}
              style={[
                styles.inputText,
                this.state.patientNameErrorMsg != null ?
                  {
                    borderColor: 'red',
                  } :
                  styles.inputText
                ,
              ]}
            />
            {this.state.patientNameErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.patientNameErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}>B. Gender</Text>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Radio
                color={primaryColor}
                selectedColor={'#128283'}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                disabled={memberInformation.selectedGender ? true : false}
                onPress={() => {
                  this.setState({
                    memberInfo: {
                      ...memberInfo,
                      selectedGender: 'Male',
                    },
                  });
                }}
                selected={memberInfo.selectedGender === 'Male'}
              />
              <Text style={{ marginLeft: 10 }}>Male</Text>
              <Radio
                color={primaryColor}
                selectedColor={'#128283'}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                disabled={memberInformation.selectedGender ? true : false}
                onPress={() => {
                  this.setState({
                    memberInfo: {
                      ...memberInfo,
                      selectedGender: 'Female',
                    },
                  });
                }}
                selected={memberInfo.selectedGender === 'Female'}
              />
              <Text style={{ marginLeft: 10 }}>Female</Text>
            </View>

            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.contactNoText = event.nativeEvent.layout)
              }>C. Contact No</Text>
            <TextInput
              placeholder={'Enter contact no'}
              value={memberInfo.contactNo}
              editable={memberInformation.contactNo === '' ? true : false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  contactNo: text,

                }, contactNoErrorMsg: null
              })}
              style={[styles.inputText,
              this.state.contactNoErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
            />
            {this.state.contactNoErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.contactNoErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}>D. Alternate Contact No</Text>
            <TextInput
              placeholder={'Enter alternate contact no'}

              onChangeText={(text) => this.setState({ alterNateContactNumber: text })}
              style={styles.inputText}
            />
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.patientAgeText = event.nativeEvent.layout)
              }>E. Age</Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder={'YY'}
                value={String(memberInfo.patientAgeInYr)}
                editable={memberInformation.patientAgeInYr === '' ? true : false}
                onChangeText={text =>
                  this.setState({
                    memberInfo: {
                      ...memberInfo,
                      patientAgeInYr: text,
                    },
                  })
                }
                style={[
                  styles.inputText,
                  { width: '44%', marginRight: 0, textAlign: 'center' },
                ]}
              />
              <TextInput
                placeholder={'MM'}
                value={String(memberInfo.patientAgeMonth)}
                editable={memberInformation.patientAgeMonth === '' ? true : false}
                onChangeText={text =>
                  this.setState({
                    memberInfo: {
                      ...memberInfo,
                      patientAgeMonth: text,
                    },
                  })
                }
                style={[
                  styles.inputText,
                  {
                    width: '44%',
                    marginLeft: 5,
                    textAlign: 'center',
                    marginRight: 20,
                  },
                ]}
              />
            </View>
            {this.state.patientAgeErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.patientAgeErrorMsg}</Text>
              : null}
            {this.state.patientMonthErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.patientMonthErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}>F. Date of birth</Text>
            <View style={[styles.inputText, { marginTop: 2 }]}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isOnlyDateTimePickerVisible: !this.state
                      .isOnlyDateTimePickerVisible,
                  });
                }}
                style={[
                  styles.formStyle2,
                  {
                    flexDirection: 'row',

                    marginTop: '2%',
                  },
                ]}>
                {/* <Item > */}
                <Icon
                  name="md-calendar"
                  style={{
                    padding: 5,
                    paddingLeft: 2,
                    fontSize: 20,
                    marginTop: 1,
                    color: '#128283',
                  }}
                />
                <Text
                  style={
                    memberInfo.dob != null
                      ? {
                        marginTop: 7,
                        marginBottom: 7,
                        marginLeft: 5,
                        fontFamily: 'OpenSans',
                        fontSize: 13,
                        textAlign: 'center',
                      }
                      : { color: '#909090' }
                  }>
                  {memberInfo.dob != null
                    ? formatDate(memberInfo.dob, 'DD/MM/YYYY')
                    : 'Date of Birth'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  minimumDate={new Date(1940, 0, 1)}
                  value={memberInfo.dob}
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
            </View>

            <Text style={styles.inputLabel}>G. Insurer ID Card No</Text>
            <TextInput

              placeholder={'Enter Insurer ID Card No'}
              value={memberInfo.insurerId}
              editable={memberInformation.insurerId === '' ? true : false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  insurerId: text
                }
              })}
              style={styles.inputText}
            />
            {this.state.patientIDCardErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.patientIDCardErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.policyNoText = event.nativeEvent.layout)
              }>
              H. Policy number / Name of corporate
          </Text>
            <TextInput
              placeholder={'Enter policy no / corporate name'}
              value={memberInfo.policyNo}
              editable={memberInformation.policyNo === '' ? true : false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  policyNo: text
                }
              })}
              style={[styles.inputText,
              this.state.policyNoTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
            />
            {this.state.policyNoTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.policyNoTextErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.EmployeeIdText = event.nativeEvent.layout)
              }>I. Employee ID</Text>
            <TextInput

              placeholder={'Enter Employee ID'}
              value={memberInfo.employeeId}
              editable={memberInformation.employeeId === '' ? true : false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  employeeId: text
                }
              })}

              style={[styles.inputText,
              this.state.employeeIdTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
            />
            {this.state.employeeIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.employeeIdTextErrorMsg}</Text>
              : null}
            <Text style={[styles.inputLabel, { lineHeight: 26 }]}
              onLayout={event =>
                (this.InsureNameText = event.nativeEvent.layout)
              }>
              J. Currently you have any other medical claim / insurance
          </Text>
            <View style={{ flexDirection: 'row', marginBottom: 1, marginTop: 2 }}>
              <Radio
                  color={primaryColor}
                selectedColor={'#128283'}
                onPress={() => {
                  this.setState({ alreadyHaveInsurance: 'yes' });
                }}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                selected={
                  this.state.alreadyHaveInsurance === 'yes' ? true : false
                }
              />
              <Text style={{ marginLeft: 10 }}>Yes</Text>
              <Radio
                color={primaryColor}
                selectedColor={'#128283'}
                onPress={() => {
                  this.setState({ alreadyHaveInsurance: 'no' });
                }}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                selected={this.state.alreadyHaveInsurance === 'no' ? true : false}
              />
              <Text style={{ marginLeft: 10 }}>No</Text>
            </View>
            {this.state.alreadyHaveInsurance === 'yes' ?
              <View>
                <Text style={styles.inputLabel}
                >J.1. Insurer Name</Text>
                <TextInput
                  onChangeText={(text) => this.setState({ insurerName: text, insureNameTextErrorMsg: null })}
                  placeholder={'Enter insurer Name'}
                  style={[styles.inputText,
                  this.state.insureNameTextErrorMsg != null ?
                    {
                      borderColor: 'red',
                    } :
                    styles.inputText
                    ,
                  ]}
                />
                {this.state.insureNameTextErrorMsg !== null ?
                  <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.insureNameTextErrorMsg}</Text>
                  : null}
                <Text style={styles.inputLabel}>J.2. Give Details</Text>
                <TextInput

                  placeholder={'Enter Employee ID'}
                  value={memberInfo.employeeId}
                  editable={memberInformation.employeeId === '' ? true : false}
                  onChangeText={(text) => this.setState({
                    memberInfo: {
                      ...memberInfo,
                      employeeId: text
                    }
                  })}
                  style={styles.inputText}
                />
              </View>
              : null}

            <Text style={[styles.inputLabel, { lineHeight: 26 }]}>
              K. If you have family physician
          </Text>
            <View style={{ flexDirection: 'row', marginBottom: '0.5%', marginTop: 2 }}>
              <Radio
                color={primaryColor}
                selectedColor={'#128283'}
                onPress={() => {
                  this.setState({ haveFamilyPhysician: 'yes' });
                }}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                selected={this.state.haveFamilyPhysician === 'yes' ? true : false}
              />
              <Text style={{ marginLeft: 10 }}>Yes</Text>
              <Radio
              color={primaryColor}
                selectedColor={'#128283'}
                onPress={() => {
                  this.setState({ haveFamilyPhysician: 'no' });
                }}
                style={{ marginLeft: 20 }}
                standardStyle={true}
                selected={this.state.haveFamilyPhysician === 'no' ? true : false}
              />
              <Text style={{ marginLeft: 10 }}>No</Text>
            </View>
            <Text onLayout={event =>
              (this.personalPhysicianNameText = event.nativeEvent.layout)
            } stye={{ marginTop: -20 }} />
            {this.state.haveFamilyPhysician === 'yes' ? (
              <View>

                <TextInput

                  onChangeText={(text) => this.setState({ physicianName: text, PhysicianNameTextErrorMsg: null })}
                  placeholder={'Enter Physician name'}
                  style={[styles.inputText,
                  this.state.PhysicianNameTextErrorMsg != null ?
                    {
                      borderColor: 'red',
                    } :
                    styles.inputText
                    ,
                  ]}
                />
                {this.state.PhysicianNameTextErrorMsg !== null ?
                  <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.PhysicianNameTextErrorMsg}</Text>
                  : null}
              </View>

            ) : null}

            <Text style={{ marginTop: -20 }} onLayout={event =>
              (this.physicianContactNoText = event.nativeEvent.layout)
            } />
            {this.state.haveFamilyPhysician === 'yes' ? (
              <View>
                <Text style={styles.inputLabel} >K.1. Contact No</Text>
                <TextInput
                  placeholder={'Enter Contact No'}

                  onChangeText={(text) => this.setState({ physicianContactNumber: text, physicianContactNoTextErrorMsg: null })}
                  style={[styles.inputText,
                  this.state.physicianContactNoTextErrorMsg != null ?
                    {
                      borderColor: 'red',
                    } :
                    styles.inputText
                    ,
                  ]}
                />
                {this.state.physicianContactNoTextErrorMsg !== null ?
                  <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.physicianContactNoTextErrorMsg}</Text>
                  : null}
              </View>
            ) : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.insurerPatientOccupations = event.nativeEvent.layout)
              }>
              L. Occupation of insured patient
          </Text>
            <TextInput

              onChangeText={(text) => this.setState({ insurerPatientOccupation: text, insurerPatientOccupationsErrorMsg: null })}
              placeholder={'Enter Occupation of insured patient'}
              style={[styles.inputText,
              this.state.insurerPatientOccupationsErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
            />
            {this.state.insurerPatientOccupationsErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.insurerPatientOccupationsErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.insurerPatientAddressText = event.nativeEvent.layout)
              }>M. Address of insured patient</Text>
            <TextInput
              placeholder={'Enter address of insured'}

              onChangeText={(text) => this.setState({ insurerPatientAddress: text, insurerPatientAddressTextErrorMsg: null })}
              style={[styles.inputText,
              this.state.insurerPatientAddressTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
            />
            {this.state.insurerPatientAddressTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.insurerPatientAddressTextErrorMsg}</Text>
              : null}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ currentForm: 1 });
                }}
                style={[
                  styles.buttonStyle,
                  {
                    // width: '44%',
                    backgroundColor: '#fff',
                    marginLeft: 20,
                    marginRight: 5,
                    borderColor: '#128283',
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    color: '#128283',
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
                  this.submitSecandPage();
                }}
                style={[
                  styles.buttonStyle,
                  {
                    // width: '44%',
                    backgroundColor: '#128283',
                    marginLeft: 5,
                    borderColor: '#128283',
                    marginRight: 20,
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
      </SafeAreaView>
    );
  };
  onChangeSelectedHospitalItem = (hospitalItem) => {
    hospitalItem = hospitalItem && hospitalItem[0];
    const selectedHospitalAddress= {
      address:hospitalItem.address,
      city:hospitalItem.city,
      state:hospitalItem.state,
      pinCode:hospitalItem.pinCode
     }
    if (hospitalItem) {
      const hospitalInfomation = {
        hospitalName: hospitalItem.hospitalName || '',
        hospitalLocation:  getNetworkHospitalAddress(selectedHospitalAddress)||'',
        hospitalId:'',
        hospitalEmail: hospitalItem.email || '',
        rohiniId:  hospitalItem.rohiniId||''
      }
      this.setState({ hospitalInfo: hospitalInfomation, hospitalInfomation })
    }
  }

  HospitalDetails = () => {
    const { hospitalInfo, hospitalInfomation, networkHospList, selectedHospitalName } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.body} ref={ref => (this.scrollViewRef = ref)}>
          <Text style={styles.formHeader}>
            Request For cashless hospitalization for health insurance policy
        </Text>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.headerText}>enter hospital details</Text>
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.hospitalNameText = event.nativeEvent.layout)
              }>Name of the hospital</Text>
            {this.preAuthInfoObj && this.preAuthInfoObj.hospitalInfo && Object.keys(this.preAuthInfoObj.hospitalInfo).length ?

              <TextInput
                value={hospitalInfo.hospitalName}
                editable={hospitalInfomation.hospitalName === ''}
                placeholder={'Enter name of the hospital'}
                style={[styles.inputText,
                this.state.hospitalNameTextErrorMsg != null ?
                  {
                    borderColor: 'red',
                  } :
                  styles.inputText
                  ,
                ]}
                onChangeText={(text) => this.setState({
                  hospitalInfo: {
                    ...hospitalInfo,
                    hospitalName: text,

                  },
                  hospitalNameTextErrorMsg: null
                })}
              />
              :
              <TouchableOpacity >
                <Row style={{ marginLeft: 20, marginRight: 20 }}>
                  <Col size={10} style={{
                    borderRadius: 6,
                    borderColor: '#E0E1E4',
                    borderWidth: 2,
                    justifyContent: 'center',
                    height: 50,
                    paddingTop: 10,
                    fontFamily: 'Helvetica-Light'
                  }}>
                    <SectionedMultiSelect
                      styles={{
                        selectToggleText: Platform.OS === "ios" ? {
                          color: '#000',
                          fontSize: 16,
                          height: 20,
                          fontFamily: 'Helvetica-Light',


                        } : {
                            color: '#000',
                            fontSize: 16,
                            fontFamily: 'Helvetica-Light'
                          },
                        chipIcon: {
                          color: '#000',
                        },
                        itemText: {
                          fontSize: 16,
                          marginLeft: 5,
                          marginTop: 5,
                          marginBottom: 5,
                          fontFamily: 'Helvetica-Light'
                        },
                        button: { backgroundColor: '#128283', fontFamily: 'Helvetica-Light' },
                        cancelButton: { backgroundColor: '#000', fontFamily: 'Helvetica-Light' },

                      }}
                      IconRenderer={IconName}
                      selectedIconComponent={
                        <View style={{
                          height: 24,
                          width: 24,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5
                        }}>
                          <MaterialIcons name="check"
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
                        <View style={{
                          height: 24,
                          width: 24,
                          borderWidth: 1,
                          borderColor: 'gray',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5
                        }}>
                        </View>
                      }
                      items={networkHospList}
                      uniqueKey='_id'
                      displayKey='hospitalName'
                      selectText={selectedHospitalName ? '' : 'Choose your Hospital'}
                      modalWithTouchable={true}
                      showDropDowns={true}
                      hideSearch={false}
                      showChips={false}
                      single={true}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={(hospitalName) => this.setState({ selectedHospitalName: hospitalName })}
                      onSelectedItemObjectsChange={this.onChangeSelectedHospitalItem}
                      selectedItems={selectedHospitalName}
                      // onCancel={() => this.removeAllSelectedItems()}
                      colors={{ primary: '#18c971' }}
                      showCancelButton={true}
                      animateDropDowns={true}
                      selectToggleIconComponent={
                        <MaterialIcons name="keyboard-arrow-down"
                          style={Platform.OS === "ios" ? {
                            fontSize: 20,
                            marginHorizontal: 6,
                            color: '#909090',
                            textAlign: 'center',
                            marginTop: 5,
                          } : {
                              fontSize: 25,
                              marginHorizontal: 6,
                              color: '#909090',
                              textAlign: 'center',
                              marginTop: 10,
                            }}
                        />
                      }
                      confirmText={selectedHospitalName ? 'Confirm' : 'Please Select'}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            }
            {this.state.hospitalNameTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.hospitalNameTextErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.hospitalLocationText = event.nativeEvent.layout)
              }>Hospital Location</Text>
            <TextInput
              value={truncateByString(hospitalInfo.hospitalLocation,45)||''}
              editable={hospitalInfomation.hospitalLocation === ''}
              placeholder={'Enter hospital location'}
              style={[styles.inputText,
              this.state.hospitalLocationTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
              onChangeText={(text) => this.setState({
                hospitalInfo: {
                  ...hospitalInfo,
                  hospitalLocation: text,

                }, hospitalLocationTextErrorMsg: null
              })}
            />
            {this.state.hospitalLocationTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.hospitalLocationTextErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.hospitalIdText = event.nativeEvent.layout)
              }>Hospital ID</Text>
            <TextInput
              placeholder={'Enter hospital ID'}

              value={hospitalInfo.hospitalId}
              editable={hospitalInfomation.hospitalId === '' ? true : false}
              onChangeText={(text) => this.setState({
                hospitalInfo: {
                  ...hospitalInfo,
                  hospitalId: text,

                }, hospitalIdTextErrorMsg: null
              })}
              style={[styles.inputText,
              this.state.hospitalIdTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}

            />
            {this.state.hospitalIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.hospitalIdTextErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.hospitalEmailText = event.nativeEvent.layout)
              }>Hospital Email ID</Text>
            <TextInput
              value={hospitalInfo.hospitalEmail}
              editable={hospitalInfomation.hospitalEmail === '' ? true : false}
              placeholder={'Enter Email ID'
              }
              style={[styles.inputText,
              this.state.hospitalEmailTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
              onChangeText={(text) => this.setState({
                hospitalInfo: {
                  ...hospitalInfo,
                  hospitalEmail: text,

                },
                hospitalEmailTextErrorMsg: null
              })}
            />
            {this.state.hospitalEmailTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.hospitalEmailTextErrorMsg}</Text>
              : null}
            <Text style={styles.inputLabel}
              onLayout={event =>
                (this.rohiniIdText = event.nativeEvent.layout)
              }>Rohini ID</Text>
            <TextInput
              placeholder={'Enter Rohini ID'}
              style={[styles.inputText,
              this.state.rohiniIdTextErrorMsg != null ?
                {
                  borderColor: 'red',
                } :
                styles.inputText
                ,
              ]}
              value={hospitalInfo.rohiniId}
              editable={hospitalInfomation.rohiniId === '' ? true : false}
              onChangeText={(text) => this.setState({
                hospitalInfo: {
                  ...hospitalInfo,
                  rohiniId: text,

                },
                rohiniIdTextErrorMsg: null

              })}
            />
            {this.state.rohiniIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10, textAlign: 'right', fontSize: 14 }}>{this.state.rohiniIdTextErrorMsg}</Text>
              : null}
            {/* <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{this.state.errorMsg}</Text> */}
            {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
           

            </View> */}
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                {
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 14,
                  marginBottom: 14,
                },
              ]}
              onPress={() => this.submitFirstPage()}>
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
        </ScrollView>
      </SafeAreaView>
    );
  };
  render() {
    const { currentForm } = this.state;
    if (currentForm === 1) {
      return <this.HospitalDetails />;
    } else if (currentForm === 2) {
      return <this.InsurerDetails />;
    }
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    fontFamily: 'OpenSans',
    display: 'flex',
  },
  buttonStyle: {
    borderColor: '#128283',
    // marginLeft: 20,
    marginTop: 12,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 41,
    paddingLeft: 62.5,
    paddingRight: 62.5,
    // width: 330,
    borderRadius: 4,
    backgroundColor: '#128283',
    color: '#ffffff',
  },
  headerText: {
    textTransform: 'uppercase',
    fontWeight: '700',
    marginLeft: 20,
    color: '#3E4459',
    lineHeight: 26,
    fontFamily: 'OpenSans',
    marginRight: 20,
    marginTop: 20,
  },
  formHeader: {
    color: '#128283',
    fontWeight: 'bold',
    lineHeight: 30,
    fontSize: 17,
    fontFamily: 'OpenSans',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  inputText: {
    height: 50,
    borderRadius: 6,
    borderColor: '#E0E1E4',
    borderWidth: 2,
    marginLeft: 20,
    backgroundColor: '#fff',
    // backgroundColor: '#fff',
    marginRight: 20,
    paddingLeft: 18,
  },
  inputLabel: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 6,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.65)',
    marginTop: 18,
    fontFamily: 'OpenSans',
  },
  /* Hospital Details End */
});
function profileState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(profileState)(PreAuth);
