import React from 'react';
import {
  Text,
  View,
  Radio,
  Icon,
 
} from 'native-base';
import { TextInput, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { subTimeUnit, formatDate, dateDiff } from '../../../../setup/helpers';
import { validateEmailAddress, onlySpaceNotAllowed, validateMobileNumber, toastMeassage } from '../../../common'
import { createPreAuth } from '../../../providers/corporate/corporate.actions'
// import styles from '../styles'
import { ImageUpload } from '../../../screens/commonScreen/imageUpload'
import { uploadImage, } from '../../../providers/common/common.action'
import DateTimePicker from 'react-native-modal-datetime-picker';

class PreAuth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hospitalInfo: {
        hospitalName: '',
        hospitalLocation: '',
        hospitalId: '',
        hospitalEmail: '',
        rohiniId: ''
      },
      hospitalInfomation:{},
      tpaInformation:{},
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
      imageData:null,
      selectOptionPoopup: false,
      currentForm: 1,
      chosenDate: new Date(),
      firstConsultantDate: new Date(),
      alreadyHaveInsurance: 'yes',
      referenceID: '',
      haveFamilyPhysician: 'yes',
      errorMsg: null,
      isOnlyDateTimePickerVisible: false,
    };
     this.onDOBChange = this.onDOBChange.bind(this);
  }
 async  componentDidMount() {
    let preAuthInfo = this.props.navigation.getParam('preAuthInfo')
  console.log(JSON.stringify(preAuthInfo))
   let hospitalInfo = preAuthInfo.hospitalInfo || {};
   let tpaInfo=preAuthInfo.tpaInfo||{}
   let tpaInformation= {
    tpaCompany: tpaInfo.tpaName||'',
    tpaCompanyPhoneNumber:tpaInfo.tpaPhoneNumber|| '',
    tpaTollFreeFaxNo: ''
  }
let  hospitalInfomation= {
  hospitalName: hospitalInfo.name ||'',
  hospitalLocation: hospitalInfo&&hospitalInfo.location&&hospitalInfo.location.address&&hospitalInfo.location.address.city||'',
  hospitalId: '',
  hospitalEmail: hospitalInfo.email,
  rohiniId: ''
   }
   let memberInformation = this.props.navigation.getParam('memberInfo')
   console.log(memberInfo)
   let memberInfo= {
    patientName: this.getMemberName(memberInformation),
    contactNo: memberInformation.mobile||'',
    alterNateContactNumber:memberInformation.phone|| '',
    patientAgeInYr: memberInformation.age||'',
    patientAgeMonth:memberInformation.month|| '',
    insurerId: memberInformation.memberId||'',
    policyNo: memberInformation.policyNo||'',
     employeeId: memberInformation.employeeId || '',
     selectedGender: memberInformation.gender||'',
    dob:memberInformation.dob||new Date()
  }
   await this.setState({ hospitalInfo: hospitalInfomation,hospitalInfomation:hospitalInfomation,tpaInformation:tpaInformation,tpaInfo:tpaInformation,memberInfo:memberInfo,memberInformation:memberInfo })
    
    
  
  }
  getMemberName(item) {
    let name=''
    if (item.firstName) {
      name+=item.firstName+' '
    }
    if (item.middleName) {
      name+=item.middleName+' '
    }
    if (item.lastName) {
      name+=item.lastName+' '
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
      temp.dob=date
      this.setState({
        isOnlyDateTimePickerVisible: false, 
        memberInfo: temp
      })
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  }

  onDOBChange(dob) {
    console.log('bbbbbb', dob);
    this.setState({ chosenDate: dob });
  }
  submitFirstPage() {

    const { hospitalInfo} = this.state
    let errorMsg = !onlySpaceNotAllowed(hospitalInfo.hospitalName) ? 'Kindly fill hospital name' : !onlySpaceNotAllowed(hospitalInfo.hospitalLocation) ? 'Kindly fill hospital location' : !onlySpaceNotAllowed(hospitalInfo.hospitalId) ? 'Kindly fill hospital id' : !onlySpaceNotAllowed(hospitalInfo.rohiniId) ? 'Kindly fill rohini Id' : !validateEmailAddress(hospitalInfo.hospitalEmail) ? 'Kindly enter valid mail id' : null

    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      this.setState({ currentForm: 2,errorMsg:null });
    }
  }
  submitSecandPage() {
    const { tpaInfo,memberInfo,insurerName,
      physicianName, physicianContactNumber, insurerPatientOccupation, insurerPatientAddress } = this.state
    let errorMsg = null
    if (!onlySpaceNotAllowed(tpaInfo.tpaCompany)) {
      errorMsg = 'Kindly fill tpa  company'
    }
    // else if (!validateMobileNumber(tpaInfo.tpaCompanyPhoneNumber)) {
    //   errorMsg = 'Kindly fill valid tpa company phone number'
    // } else if (!validateMobileNumber(tpaInfo.tpaTollFreeFaxNo)) {
    //   errorMsg = 'Kindly fill valid toll free fax no'
    // }
    else if (!onlySpaceNotAllowed(memberInfo.patientName)) {
      errorMsg = 'Kindly fill patient name'
    } else if (!onlySpaceNotAllowed(memberInfo.contactNo)) {
      errorMsg = 'Kindly fill valid  contact number'
    }
    // else if (!onlySpaceNotAllowed(memberInfo.patientAgeInYr)) {
    //   errorMsg = 'Kindly fill age year'
  // } 
    else if(!onlySpaceNotAllowed(memberInfo.patientAgeMonth)) {
      errorMsg = 'Kindly fill age month'
    } else if (!onlySpaceNotAllowed(memberInfo.insurerId)) {
      errorMsg = 'Kindly fill insurer id '
    } else if (!onlySpaceNotAllowed(memberInfo.policyNo)) {
      errorMsg = 'Kindly fill policy number'
    } else if (!onlySpaceNotAllowed(memberInfo.employeeId)) {
      errorMsg = 'Kindly fill employee id'
    } else if(this.state.alreadyHaveInsurance==='yes'){
      if(!onlySpaceNotAllowed(insurerName)) {
        errorMsg = 'Kindly fill insurer name'
      }
    } else if(this.state.haveFamilyPhysician==='yes'){
      if (!onlySpaceNotAllowed(physicianName)) {
        errorMsg = 'Kindly fill physician name'
      }else if (!validateMobileNumber(physicianContactNumber)) {
        errorMsg = 'Kindly fill  valid physician contact number'
      }
    } else if (!onlySpaceNotAllowed(insurerPatientOccupation)) {
      errorMsg = 'Kindly fill insurer patient occupation'
    } else if (!onlySpaceNotAllowed(insurerPatientAddress)) {
      errorMsg = 'Kindly fill insurer patient address'
    }

    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      this.setState({ currentForm: 3 });
    }
  }

  async submitThirdPage() {
    try {
      const {
        hospitalInfo,
        tpaInfo,
        memberInfo,
        insurerName,
        physicianName,
        physicianContactNumber,
        insurerPatientOccupation,
        insurerPatientAddress,
        treatingDoctorName,
        treatingDoctorContactNo,
        diseaseDiscription,
        releventClinical,
        durationOfPresent,
        imageData
      } = this.state
      let errorMsg = null
      if (!onlySpaceNotAllowed(treatingDoctorName)) {
        errorMsg = 'Kindly fill doctor name'
      } else if (!validateMobileNumber(treatingDoctorContactNo)) {
        errorMsg = 'Kindly fill valid doctor phone number'
      } else if (!onlySpaceNotAllowed(diseaseDiscription)) {
        errorMsg = 'Kindly fill disease discription'
      } else if (!onlySpaceNotAllowed(releventClinical)) {
        errorMsg = 'Kindly fill clinical finding '
      } else if (!onlySpaceNotAllowed(durationOfPresent)) {
        errorMsg = 'Kindly fill duration of present '
      }

      if (errorMsg) {

        this.setState({ errorMsg: errorMsg });
      } else {
        let reqData = {
          hospitalName: hospitalInfo.hospitalName,
          hospitalLocation: hospitalInfo.hospitalLocation,
          hospitalId: hospitalInfo.hospitalId,
          hospitalEmail: hospitalInfo.hospitalEmail,
          rohiniId: hospitalInfo.rohiniId,
          tpaCompany: tpaInfo.tpaCompany,
          tpaCompanyPhoneNumber: tpaInfo.tpaCompanyPhoneNumber,
          tpaTollFreeFaxNo: tpaInfo.tpaTollFreeFaxNo,
          patientName: memberInfo.patientName,
          patientDob:memberInfo.dob,
          patientGender:memberInfo.selectedGender,
          patientAgeInYr: memberInfo.patientAgeInYr,
          patientAgeMonth: memberInfo.patientAgeMonth,
          insurerId: memberInfo.insurerId,
          policyNo: memberInfo.policyNo,
          employeeId: memberInfo.employeeId,
          insurerName: memberInfo.insurerName,
          physicianName: physicianName,
          physicianContactNumber: physicianContactNumber,
          insurerPatientOccupation: insurerPatientOccupation,
          insurerPatientAddress: insurerPatientAddress,
          treatingDoctorName: treatingDoctorName,
          treatingDoctorContactNo: treatingDoctorContactNo,
          diseaseDiscription: diseaseDiscription,
          releventClinical: releventClinical,
          durationOfPresent: durationOfPresent
        }
        if (imageData) {
          reqData.patientProof=imageData
        }
        let result = await createPreAuth(reqData)
    
        
        if (result && result.referenceNumber) {
          this.setState({ currentForm: 4, referenceID: result.referenceNumber });
        }
      }
    } catch (e) {
      alert(e)
    }
  }

  imageUpload = async (data) => {
    this.setState({ selectOptionPoopup: false })
 
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);

    }
  }
  uploadImageToServer = async (imagePath) => {

    try {

      let appendForm = "adhar"
      let endPoint = 'images/upload?path=adhar'
      const response = await uploadImage(imagePath, endPoint, appendForm)
    
      if (response.success) {
        
       

        await this.setState({ imageData: response.data[0] })
       
        toastMeassage('image upload successfully', 'success', 3000)

      } else {
        toastMeassage('Problem Uploading Picture'+response.error, 'danger', 3000)
      }

    } catch (e) {
   
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)

    }
  }
  InsurerDetails = () => {
    const {tpaInfo,tpaInformation,memberInfo,memberInformation}=this.state
    return (
      <ScrollView style={styles.body}>
        {/* <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text> */}
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>
            Details of third party administrator
          </Text>
          <Text style={styles.inputLabel}>A. Name of TPA Company</Text>
          <TextInput
              value={tpaInfo.tpaCompany}
              editable={tpaInformation.tpaCompany===''?true:false}
              onChangeText={(text) => this.setState({
                tpaInfo: {
                  ...tpaInfo,
                  tpaCompany: text
                }
              })}
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
           value={tpaInfo.tpaCompanyPhoneNumber}
           editable={tpaInformation.tpaCompanyPhoneNumber===''?true:false}
           onChangeText={(text) => this.setState({
             tpaInfo: {
               ...tpaInfo,
               tpaCompanyPhoneNumber: text
             }
           })}
          
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
             value={tpaInfo.tpaTollFreeFaxNo}
             editable={tpaInformation.tpaTollFreeFaxNo===''?true:false}
             onChangeText={(text) => this.setState({
               tpaInfo: {
                 ...tpaInfo,
                 tpaTollFreeFaxNo: text
               }
             })}
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
            value={memberInfo.patientName}
            editable={memberInformation.patientName===''?true:false}
            onChangeText={(text) => this.setState({
              memberInfo: {
                ...memberInfo,
                patientName: text
              }
            })}

          
            placeholder={'Enter name of patient'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>B. Gender</Text>
          <View style={{ flexDirection: 'row' }}>
            <Radio
              style={{ marginLeft: 40 }}
              standardStyle={true}
              disabled={memberInformation.selectedGender?true:false} 
              onPress={() => {
                this.setState({
                  memberInfo: {
                    ...memberInfo,
                    selectedGender: 'Male'
                  }
                
                });
              }}
              selected={memberInfo.selectedGender === 'Male'}
            />
            <Text style={{ marginLeft: 10 }}>Male</Text>
            <Radio
              style={{ marginLeft: 40 }}
              standardStyle={true}
              disabled={memberInformation.selectedGender?true:false} 
              onPress={() => {
                this.setState({
                  memberInfo: {
                    ...memberInfo,
                    selectedGender: 'Female'
                  }
                
                });
              }}
              selected={memberInfo.selectedGender === 'Female'}
            />
            <Text style={{ marginLeft: 10 }}>Female</Text>
          </View>
          <Text style={styles.inputLabel}>C. Contact No</Text>
          <TextInput
            placeholder={'Enter contact no'}
            value={memberInfo.contactNo}
            editable={memberInformation.contactNo===''?true:false}
            onChangeText={(text) => this.setState({
              memberInfo: {
                ...memberInfo,
                contactNo: text
              }
            })}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>D. Alternate Concat No</Text>
          <TextInput
            placeholder={'Enter alternate contact no'}

            onChangeText={(text) => this.setState({ alterNateContactNumber: text })}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>E. Age</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              placeholder={'YY'}
              value={memberInfo.patientAgeInYr}
              editable={memberInformation.patientAgeInYr===''?true:false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  patientAgeInYr: text
                }
              })}
        
              style={[
                styles.inputText,
                { width: 160, marginRight: 0, textAlign: 'center' },
              ]}
            />
            <TextInput
              placeholder={'MM'}
              value={memberInfo.patientAgeMonth}
              editable={memberInformation.patientAgeMonth===''?true:false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  patientAgeMonth: text
                }
              })}
             
              style={[
                styles.inputText,
                { width: 160, marginLeft: 10, textAlign: 'center' },
              ]}
            />
          </View>
          <Text style={styles.inputLabel}>F. Date of birth</Text>
          <View style={{ marginTop: 20, width: '100%', }}>

<Text style={{ fontFamily: "OpenSans", fontSize: 15, }}>Date of birth</Text>
<TouchableOpacity onPress={() => { this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible }) }} style={[styles.formStyle2,{flexDirection:'row'}]}>
    {/* <Item > */}
<Icon name='md-calendar' style={{ padding: 5, fontSize: 20, marginTop: 1, color: '#7F49C3' }} />
<Text style={memberInfo.dob != null ?{ marginTop: 7, marginBottom: 7, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', }:{color:'#909090'}}>{memberInfo.dob != null ?formatDate(memberInfo.dob, 'DD/MM/YYYY'):'Date of Birth'}</Text>
<DateTimePicker
  mode={'date'}
  minimumDate={new Date(1940, 0, 1)}
  value={memberInfo.dob}
  isVisible={this.state.isOnlyDateTimePickerVisible}
  onConfirm={this.handleOnlyDateTimePicker}
  onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
/>
    {/* </Item> */}
    </TouchableOpacity>
</View>

          {/* 
          style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
          */}
          {/* <View style={[{ flexDirection: 'row' }, styles.inputText]}>

            <DatePicker
              style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
              defaultDate={memberInfo.dob}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={true}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={subTimeUnit(new Date(), 1, 'year')}
              animationType={'fade'}
              androidMode={'default'}
              textStyle={{ color: '#5A5A5A' }}
              value={memberInfo.dob}
              placeHolderTextStyle={{ color: '#5A5A5A' }}
              onDateChange={dob => {
                this.onDOBChange(dob);
              }}
              // disabled={this.dobIsEditable}
            />
            <Icon
              name="calendar"
              style={{ color: '#3E4459', marginTop: 8, marginLeft: 160 }}
            />
          </View> */}
          <Text style={styles.inputLabel}>G. Insurer ID Card No</Text>
          <TextInput

            placeholder={'Enter Insurer ID Card No'}
            value={memberInfo.insurerId}
              editable={memberInformation.insurerId===''?true:false}
              onChangeText={(text) => this.setState({
                memberInfo: {
                  ...memberInfo,
                  insurerId: text
                }
              })}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>
            H. Policy number / Name of corporate
          </Text>
          <TextInput
            placeholder={'Enter policy no / corporate name'}
            value={memberInfo.policyNo}
            editable={memberInformation.policyNo===''?true:false}
            onChangeText={(text) => this.setState({
              memberInfo: {
                ...memberInfo,
                policyNo: text
              }
            })}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>I. Employee ID</Text>
          <TextInput

            placeholder={'Enter Employee ID'}
            value={memberInfo.employeeId}
            editable={memberInformation.employeeId===''?true:false}
            onChangeText={(text) => this.setState({
              memberInfo: {
                ...memberInfo,
                employeeId: text
              }
            })}
         
            style={styles.inputText}
          />
          <Text style={[styles.inputLabel, { lineHeight: 26 }]}>
            J. Currently you have any other medical claim / insurance
          </Text>
          <View style={{ flexDirection: 'row', marginBottom: 1 }}>
            <Radio
              onPress={() => {
                this.setState({ alreadyHaveInsurance: 'yes' });
              }}
              style={{ marginLeft: 40 }}
              standardStyle={true}
              selected={
                this.state.alreadyHaveInsurance === 'yes' ? true : false
              }
            />
            <Text style={{ marginLeft: 10 }}>Yes</Text>
            <Radio
              onPress={() => {
                this.setState({ alreadyHaveInsurance: 'no' });
              }}
              style={{ marginLeft: 40 }}
              standardStyle={true}
              selected={this.state.alreadyHaveInsurance === 'no' ? true : false}
            />
            <Text style={{ marginLeft: 10 }}>No</Text>
          </View>
          {this.state.alreadyHaveInsurance === 'yes' ?
            <View>
              <Text style={styles.inputLabel}>J.1. Insurer Name</Text>
              <TextInput
                onChangeText={(text) => this.setState({ insurerName: text })}
                placeholder={'Enter insurer Name'}
                style={styles.inputText}
              />

              <Text style={styles.inputLabel}>J.2. Give Details</Text>
              <TextInput
              
                placeholder={'Enter Employee ID'}
                value={memberInfo.employeeId}
                editable={memberInformation.employeeId===''?true:false}
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
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <Radio
              onPress={() => {
                this.setState({ haveFamilyPhysician: 'yes' });
              }}
              style={{ marginLeft: 40 }}
              standardStyle={true}
              selected={this.state.haveFamilyPhysician === 'yes' ? true : false}
            />
            <Text style={{ marginLeft: 10 }}>Yes</Text>
            <Radio
              onPress={() => {
                this.setState({ haveFamilyPhysician: 'no' });
              }}
              style={{ marginLeft: 40 }}
              standardStyle={true}
              selected={this.state.haveFamilyPhysician === 'no' ? true : false}
            />
            <Text style={{ marginLeft: 10 }}>No</Text>
          </View>
          {this.state.haveFamilyPhysician === 'yes' ? (
            <TextInput

              onChangeText={(text) => this.setState({ physicianName: text })}
              placeholder={'Enter Physician name'}
              style={styles.inputText}
            />
          ) : null}
          {
            this.state.selectOptionPoopup ?
              <ImageUpload
                popupVisible={(data) => this.imageUpload(data)}
              /> : null
          }
          {this.state.haveFamilyPhysician === 'yes' ? (
            <View>
              <Text style={styles.inputLabel}>K.1. Contact No</Text>
              <TextInput
                placeholder={'Enter Contact No'}

                onChangeText={(text) => this.setState({ physicianContactNumber: text })}
                style={styles.inputText}
              />
            </View>
          ) : null}
          <Text style={styles.inputLabel}>
            L. Occupation of insured patient
          </Text>
          <TextInput

            onChangeText={(text) => this.setState({ insurerPatientOccupation: text })}
            placeholder={'Enter Occupation of insured patient'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>M. Address of insured patient</Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ insurerPatientAddress: text })}
            style={[styles.inputText, { height: 100 }]}
          />
          <Text style={styles.headerText}>Upload your aadhar copy</Text>
          {this.state.imageData !== null ?
            <View
              style={{
                flex: 1,
                marginLeft: 40,
                marginRight: 40,
                height: 130,
                borderColor: '#424242',
                borderRadius: 1,
                backgroundColor: '#fff',
                marginTop: 10,
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="document"
                  style={{
                    color: '#424242',
                    marginTop: 8,
                    marginLeft: 20,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'openSans, sans-serif',
                    fontSize: 12,
                    marginTop: 8,
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>

                 {this.state.imageData.file_name}

  </Text>
              </View>

              <View style={{ flexDirection: 'column', marginTop: 0 }}>
              </View>
            </View>
            :
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity onPress={() => this.setState({ selectOptionPoopup: true })}>
                <Image
                  source={require('../../../../../assets/images/documentCloud.png')}
                  style={{ height: 60, width: 110 }}
                />
              </TouchableOpacity>
            </View>
          }
          <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{this.state.errorMsg}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentForm: 1 });
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
                this.submitSecandPage()
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
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>
            to be filled by the treating doctor / hospital
          </Text>
          <Text style={styles.inputLabel}>A. Name of treating doctor</Text>
          <TextInput
            onChangeText={(text) => this.setState({ treatingDoctorName: text })}
            placeholder={'Enter Name of treating doctor'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>B. Contact No</Text>
          <TextInput

            onChangeText={(text) => this.setState({ treatingDoctorContactNo: text })}
            placeholder={'Enter contact no'}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>
            C. Name of illness/disease with presenting complaints
          </Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ diseaseDiscription: text })}
            style={[styles.inputText, { height: 100 }]}
          />
          <Text style={styles.inputLabel}>D. Relevant clinical findings</Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ releventClinical: text })}
            style={[styles.inputText, { height: 100 }]}
          />
          <Text style={styles.inputLabel}>
            E. Duration of the present ailment in days
          </Text>
          <TextInput
            placeholder={'Enter duration of present ailment'}

            onChangeText={(text) => this.setState({ durationOfPresent: text })}
            style={styles.inputText}
          />
          <Text style={styles.inputLabel}>E.1. Date of first consultation</Text>
          <View style={{ marginTop: 20, width: '100%', }}>
<TouchableOpacity onPress={() => { this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible }) }} style={[styles.formStyle2,{flexDirection:'row'}]}>
    {/* <Item > */}
<Icon name='md-calendar' style={{ padding: 5, fontSize: 20, marginTop: 1, color: '#7F49C3' }} />
<Text style={this.state.firstConsultantDate != null ?{ marginTop: 7, marginBottom: 7, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 13, textAlign: 'center', }:{color:'#909090'}}>{this.state.firstConsultantDate != null ?formatDate(this.state.firstConsultantDate, 'DD/MM/YYYY'):'Date of Birth'}</Text>
<DateTimePicker
  mode={'date'}
  minimumDate={new Date(1940, 0, 1)}
  value={this.state.firstConsultantDate}
  isVisible={this.state.isOnlyDateTimePickerVisible}
  onConfirm={this.handleOnlyDateTimePicker}
  onCancel={() => this.setState({ isOnlyDateTimePickerVisible: !this.state.isOnlyDateTimePickerVisible })}
/>
    {/* </Item> */}
    </TouchableOpacity>
</View>

          {/* <View style={[{ flexDirection: 'row' }, styles.inputText]}>
            <DatePicker
              style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
               defaultDate={new Date()}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              minimumDate={new Date(1940, 0, 1)}
              maximumDate={subTimeUnit(new Date(), 1, 'year')}
              animationType={'fade'}
              androidMode={'default'}
              textStyle={{ color: '#5A5A5A' }}
              value={this.state.chosenDate}
              placeHolderTextStyle={{ color: '#5A5A5A' }}
              onDateChange={dob => {
                this.onDOBChange(dob);
              }}
              disabled={false}
            />
            <Icon
              name="calendar"
              style={{ color: '#3E4459', marginTop: 8, marginLeft: 160 }}
            /> 
          </View>*/}
          <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{this.state.errorMsg}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ currentForm: 2 });
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
                this.submitThirdPage()
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
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>
          Your request has been submitted successfully. Reference No:  {this.state.referenceID}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
               this.props.navigation.navigate('CorporateHome')
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
    const {hospitalInfo,hospitalInfomation}=this.state
    return (
      <ScrollView style={styles.body}>
        <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>enter hospital details</Text>
          <Text style={styles.inputLabel}>Name of the hospital</Text>
          <TextInput
            value={hospitalInfo.hospitalName}
            editable={hospitalInfomation.hospitalName===''?true:false}
            placeholder={'Enter name of the hospital'}
            style={styles.inputText}
            onChangeText={(text) => this.setState({
              hospitalInfo: {
                ...hospitalInfo,
                hospitalName: text
              }
            })}
          />
          <Text style={styles.inputLabel}>Hospital Location</Text>
          <TextInput
           value={hospitalInfo.hospitalLocation}
           editable={hospitalInfomation.hospitalLocation===''?true:false}
            placeholder={'Enter hospital location'}
            style={styles.inputText}
            onChangeText={(text) => this.setState({
              hospitalInfo: {
                ...hospitalInfo,
                hospitalLocation: text
              }
            })}
          />
          <Text style={styles.inputLabel}>Hospital ID</Text>
          <TextInput
            placeholder={'Enter hospital ID'}
            style={styles.inputText}
            value={hospitalInfo.hospitalId}
            editable={hospitalInfomation.hospitalId===''?true:false}
            onChangeText={(text) => this.setState({
              hospitalInfo: {
                ...hospitalInfo,
                hospitalId: text
              }
            })}
          />
          <Text style={styles.inputLabel}>Hospital Email ID</Text>
          <TextInput
             value={hospitalInfo.hospitalEmail}
             editable={hospitalInfomation.hospitalEmail===''?true:false}
            placeholder={'Enter Email ID'
            } style={styles.inputText}
            onChangeText={(text) => this.setState({
              hospitalInfo: {
                ...hospitalInfo,
                hospitalEmail: text
              }
            })}
          />
          <Text style={styles.inputLabel}>Rohini ID</Text>
          <TextInput
            placeholder={'Enter Rohini ID'}
            style={styles.inputText}
            value={hospitalInfo.rohiniId}
            editable={hospitalInfomation.rohiniId===''?true:false}
            onChangeText={(text) => this.setState({
              hospitalInfo: {
                ...hospitalInfo,
                rohiniId: text
              }

            })}
          />
          <Text style={{ color: 'red', marginLeft: 15, marginTop: 10 }}>{this.state.errorMsg}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.buttonStyle}
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
        </View>
      </ScrollView>
    );
  };
  render() {
    const { currentForm } = this.state;
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
    marginBottom: 4,
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
