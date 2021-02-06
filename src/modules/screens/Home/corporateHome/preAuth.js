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
import { TextInput, StyleSheet, Image,SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';
import { validateEmailAddress, onlySpaceNotAllowed, validateMobileNumber, toastMeassage } from '../../../common'
import { createPreAuth } from '../../../providers/corporate/corporate.actions'
// import styles from '../styles'
import { ImageUpload } from '../../../screens/commonScreen/imageUpload'
import { uploadImage, } from '../../../providers/common/common.action'

class PreAuth extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      selectOptionPoopup: false,
      currentForm: 1,
      chosenDate: new Date(),
      selectedGender: 'Male',
      alreadyHaveInsurance: 'yes',
      referenceID: 'SMTTH7',
      haveFamilyPhysician: 'yes',
      hospitalName: '',
      hospitalLocation: '',
      hospitalId: '',
      hospitalEmail: '',
      rohiniId: '',
      tpaCompany: '',
      tpaCompanyPhoneNumber: '',
      tpaTollFreeFaxNo: '',
      patientName: '',
      contactNo: '',
      alterNateContactNumber: '',
      patientAgeInYr: '',
      patientAgeMonth: '',
      insurerId: '',
      policyNumber: '',
      employeeId: '',
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
      errorMsg: null,
      TpaComErrorMsg:null,
      MobileNumError:null,
      tpaTollFreeFaxNoErrorMsg:null,
      patientNameErrorMsg:null,
      contactNoErrorMsg:null,
      patientAgeErrorMsg:null,
      patientMonthErrorMsg:null,
      patientIDCardErrorMsg:null,
      policyNoTextErrorMsg:null,
      employeeIdTextErrorMsg:null,
      insureNameTextErrorMsg:null,
      PhysicianNameTextErrorMsg:null,
      physicianContactNoTextErrorMsg:null,
      insurerPatientOccupationsErrorMsg:null,
      insurerPatientAddressTextErrorMsg:null,
      treatingDoctorNameTextErrorMsg:null,
      treatingDoctorContactNoTextErrorMsg:null,
      diseaseDiscriptionTextErrorMsg:null,
      releventClinicalTextErrorMsg:null,
      durationOfPresentTextErrorMsg:null,
      hospitalNameTextErrorMsg:null,
      hospitalLocationTextErrorMsg:null,
      hospitalIdTextErrorMsg:null,
      rohiniIdTextErrorMsg:null,
      hospitalEmailTextErrorMsg:null


    };
    // this.onDOBChange = this.onDOBChange.bind(this);
  }

  onDOBChange(dob) {
    console.log('bbbbbb', dob);
    this.setState({ chosenDate: dob });
  }
  submitFirstPage() {

    const { hospitalName, hospitalLocation, hospitalId, hospitalEmail, rohiniId } = this.state
    
    if (!onlySpaceNotAllowed(hospitalName)) {
      this.setState({ hospitalNameTextErrorMsg: 'Kindly fill hospital name' });
      this.scrollViewRef.scrollTo({
        y: this.hospitalNameText.y,
        animated: true
      });
      return false;
  }
  if (!onlySpaceNotAllowed(hospitalLocation)) {
    this.setState({ hospitalLocationTextErrorMsg: 'Kindly fill hospital location' });
    this.scrollViewRef.scrollTo({
      y: this.hospitalLocationText.y,
      animated: true
    });
    return false;
}
if (!onlySpaceNotAllowed(hospitalId)) {
  this.setState({ hospitalIdTextErrorMsg: 'Kindly fill hospital id' });
  this.scrollViewRef.scrollTo({
    y: this.hospitalIdText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(rohiniId)) {
  this.setState({ rohiniIdTextErrorMsg: 'Kindly fill rohini Id' });
  this.scrollViewRef.scrollTo({
    y: this.rohiniIdText.y,
    animated: true
  });
  return false;
}
if (!validateEmailAddress(hospitalEmail)) {
  this.setState({ hospitalEmailTextErrorMsg: 'Kindly enter valid mail id' });
  this.scrollViewRef.scrollTo({
    y: this.hospitalEmailText.y,
    animated: true
  });
  return false;
}
    
    let errorMsg = !onlySpaceNotAllowed(hospitalName) ? 'Kindly fill hospital name' : !onlySpaceNotAllowed(hospitalLocation) ? 'Kindly fill hospital location' : !onlySpaceNotAllowed(hospitalId) ? 'Kindly fill hospital id' : !onlySpaceNotAllowed(rohiniId) ? 'Kindly fill rohini Id' : !validateEmailAddress(hospitalEmail) ? 'Kindly enter valid mail id' : null

    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      this.setState({ currentForm: 2 });
    }
  }
  submitSecandPage() {
    const { tpaCompany, tpaCompanyPhoneNumber, tpaTollFreeFaxNo, patientName, contactNo,
      alterNateContactNumber, patientAgeInYr, patientAgeMonth, insurerId, policyNumber, employeeId, insurerName,
      physicianName, physicianContactNumber, insurerPatientOccupation, insurerPatientAddress } = this.state
    let errorMsg = null
    if (!onlySpaceNotAllowed(tpaCompany)) {
      this.setState({ TpaComErrorMsg: 'Kindly fill tpa  company name' });
      this.scrollViewRef.scrollTo({
        y: this.TpaCompany.y,
        animated: true
      });
      return false;
  }
  if (!validateMobileNumber(tpaCompanyPhoneNumber)) {
    this.setState({ MobileNumError: 'Kindly fill valid tpa company phone number' });
    this.scrollViewRef.scrollTo({
      y: this.PhoneNumber.y,
      animated: true
    });
    return false;
}
// if (!validateMobileNumber(tpaTollFreeFaxNo)) {
//   this.setState({ tpaTollFreeFaxNoErrorMsg: 'Kindly fill valid toll free fax no' });
//   this.scrollViewRef.scrollTo({
//     y: this.tpaTollFreeFaxNoText.y,
//     animated: true
//   });
//   return false;
// }
  
if (!onlySpaceNotAllowed(patientName)) {
  this.setState({ patientNameErrorMsg: 'Kindly fill patient name' });
  this.scrollViewRef.scrollTo({
    y: this.patientNameText.y,
    animated: true
  });
  return false;
}
if (!validateMobileNumber(contactNo)) {
  this.setState({ contactNoErrorMsg: 'Kindly fill valid  contact number' });
  this.scrollViewRef.scrollTo({
    y: this.contactNoText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(patientAgeInYr)) {
  this.setState({ patientAgeErrorMsg: 'Kindly fill age year' });
  this.scrollViewRef.scrollTo({
    y: this.patientAgeText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(patientAgeMonth)) {
  this.setState({ patientMonthErrorMsg: 'Kindly fill age month' });
  this.scrollViewRef.scrollTo({
    y: this.patientAgeText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(insurerId)) {
  this.setState({ patientIDCardErrorMsg: 'Kindly fill insurer id' });
  this.scrollViewRef.scrollTo({
    y: this.patientIDCardText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(policyNumber)) {
  this.setState({ policyNoTextErrorMsg: 'Kindly fill policy number' });
  this.scrollViewRef.scrollTo({
    y: this.policyNoText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(employeeId)) {
  this.setState({ employeeIdTextErrorMsg: 'Kindly fill employee ID' });
  this.scrollViewRef.scrollTo({
    y: this.EmployeeIdText.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(insurerName)) {
  this.setState({ insureNameTextErrorMsg: 'Kindly fill insurer name' });
  this.scrollViewRef.scrollTo({
    y: this.InsureNameText.y,
    animated: true
  });
  return false;
}
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
if (!onlySpaceNotAllowed(insurerPatientOccupation)) {
  this.setState({ insurerPatientOccupationsErrorMsg: 'Kindly fill insurer patient occupation' });
  this.scrollViewRef.scrollTo({
    y: this.insurerPatientOccupations.y,
    animated: true
  });
  return false;
}
if (!onlySpaceNotAllowed(insurerPatientAddress)) {
  this.setState({ insurerPatientAddressTextErrorMsg: 'Kindly fill insurer patient address' });
  this.scrollViewRef.scrollTo({
    y: this.insurerPatientAddressText.y,
    animated: true
  });
  return false;
}



      

    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      this.setState({ currentForm: 3 });
    }
  }

  async submitThirdPage() {
    const {
      hospitalName,
      hospitalLocation,
      hospitalId,
      hospitalEmail,
      rohiniId,
      tpaCompany,
      tpaCompanyPhoneNumber,
      tpaTollFreeFaxNo,
      patientName,
      contactNo,
      alterNateContactNumber,
      patientAgeInYr,
      patientAgeMonth,
      insurerId,
      policyNo,
      employeeId,
      insurerName,
      physicianName,
      physicianContactNumber,
      insurerPatientOccupation,
      insurerPatientAddress,
      treatingDoctorName,
      treatingDoctorContactNo,
      diseaseDiscription,
      releventClinical,
      durationOfPresent
    } = this.state
    let errorMsg = null
    if (!onlySpaceNotAllowed(treatingDoctorName)) {
      this.setState({ treatingDoctorNameTextErrorMsg: 'Kindly fill doctor name' });
      this.scrollViewRef.scrollTo({
        y: this.treatingDoctorNameText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(treatingDoctorName)) {
      this.setState({ treatingDoctorContactNoTextErrorMsg: 'Kindly fill valid doctor phone number' });
      this.scrollViewRef.scrollTo({
        y: this.treatingDoctorContactNoText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(treatingDoctorName)) {
      this.setState({ diseaseDiscriptionTextErrorMsg: 'Kindly fill disease description' });
      this.scrollViewRef.scrollTo({
        y: this.diseaseDiscriptionText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(treatingDoctorName)) {
      this.setState({ releventClinicalTextErrorMsg: 'Kindly fill clinical finding' });
      this.scrollViewRef.scrollTo({
        y: this.releventClinicalText.y,
        animated: true
      });
      return false;
    }
    if (!onlySpaceNotAllowed(treatingDoctorName)) {
      this.setState({ durationOfPresentTextErrorMsg: 'Kindly fill duration of present' });
      this.scrollViewRef.scrollTo({
        y: this.durationOfPresentText.y,
        animated: true
      });
      return false;
    }
    
    
    if (errorMsg) {

      this.setState({ errorMsg: errorMsg });
    } else {
      let reqData = {
        hospitalName: hospitalName,
        hospitalLocation: hospitalLocation,
        hospitalId: hospitalId,
        hospitalEmail: hospitalEmail,
        rohiniId: rohiniId,
        tpaCompany: tpaCompany,
        tpaCompanyPhoneNumber: tpaCompanyPhoneNumber,
        tpaTollFreeFaxNo: tpaTollFreeFaxNo,
        patientName: patientName,
        patientAgeInYr: patientAgeInYr,
        patientAgeMonth: patientAgeMonth,
        insurerId: insurerId,
        policyNo: policyNo,
        employeeId: employeeId,
        insurerName: insurerName,
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
      let result = await createPreAuth(reqData)
    
      
      if (result) {
        this.setState({ currentForm: 4, refNo: result.refNo || '5' });
      }
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

      let appendForm = "medicine"
      let endPoint = 'images/upload'
      const response = await uploadImage(imagePath, endPoint, appendForm)
      
      if (response.success) {
        let data = this.state.imageData;
        let temp = data.concat(response.data)

        this.setState({ imageData: temp })
        toastMeassage('image upload successfully', 'success', 3000)

      } else {
        toastMeassage('Problem Uploading Picture', 'danger', 3000)
      }

    } catch (e) {
   
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000)

    }
  }
  InsurerDetails = () => {
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
            value={this.state.tpaCompany}
            onChangeText={(text) => this.setState({ tpaCompany: text,TpaComErrorMsg:null })}
            style={[
              styles.inputText,
              this.state.TpaComErrorMsg != null?
              {
                borderColor: 'red',
               
              }:
                styles.inputText
              ,
            ]}
          />
          {this.state.TpaComErrorMsg !== null?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right' }}>{this.state.TpaComErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.PhoneNumber = event.nativeEvent.layout)
          }>B. Phone Number</Text>
          <TextInput

            onChangeText={(text) => this.setState({ tpaCompanyPhoneNumber: text,MobileNumError:null })}
            value={this.state.tpaCompanyPhoneNumber}
            style={[
              styles.inputText,
              this.state.MobileNumError != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
            {this.state.MobileNumError !== null?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.MobileNumError}</Text>
              :null}
          {/* <Text style={styles.inputLabel}
            onLayout={event =>
              (this.tpaTollFreeFaxNoText = event.nativeEvent.layout)
            }>C. Toll Free Fax No</Text>
          <TextInput
            value={this.state.tpaTollFreeFaxNo}
            onChangeText={(text) => this.setState({ tpaTollFreeFaxNo: text,tpaTollFreeFaxNoErrorMsg:null })}
            style={[
              styles.inputText,
              this.state.tpaTollFreeFaxNoErrorMsg != null?
              {
                backgroundColor: '#E1E2E5',
                borderColor: 'red',
                color: '#707070',
              }:
                styles.inputText
              ,
            ]}
          />
           {this.state.tpaTollFreeFaxNoErrorMsg !== null?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.tpaTollFreeFaxNoErrorMsg}</Text>
              :null} */}
          <Text style={styles.headerText}>
            to be filled by insurer / patient
          </Text>
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.patientNameText = event.nativeEvent.layout)
          }>A. Name of the patient</Text>
          <TextInput

            onChangeText={(text) => this.setState({ patientName: text,patientNameErrorMsg:null })}
            placeholder={'Enter name of patient'}
            style={[
              styles.inputText,
              this.state.patientNameErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
             {this.state.patientNameErrorMsg !== null?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.patientNameErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}>B. Gender</Text>
          <View style={{ flexDirection: 'row' }}>
            <Radio
              style={{ marginLeft: 40 }}
              standardStyle={true}
              onPress={() => {
                this.setState({ selectedGender: 'Male' });
              }}
              selected={this.state.selectedGender === 'Male'}
            />
            <Text style={{ marginLeft: 10 }}>Male</Text>
            <Radio
              style={{ marginLeft: 40 }}
              standardStyle={true}
              onPress={() => {
                this.setState({ selectedGender: 'Female' });
              }}
              selected={this.state.selectedGender === 'Female'}
            />
            <Text style={{ marginLeft: 10 }}>Female</Text>
          </View>
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.contactNoText = event.nativeEvent.layout)
          }>C. Concat No</Text>
          <TextInput
            placeholder={'Enter contact no'}
            onChangeText={(text) => this.setState({ contactNo: text,contactNoErrorMsg:null })}
            style={[ styles.inputText,
              this.state.contactNoErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
           {this.state.contactNoErrorMsg !== null?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.contactNoErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}>D. Alternate Concat No</Text>
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


              onChangeText={(text) => this.setState({ patientAgeInYr: text,patientAgeErrorMsg:null })}
            
              style={[ styles.inputText,
                this.state.patientAgeErrorMsg != null?
                {
                  width: 160,
                  marginRight:0
                }:
                  styles.inputText
                ,
                {
                  width: 160,
                }
              ]}
            />
            <TextInput
              placeholder={'MM'}

              onChangeText={(text) => this.setState({ patientAgeMonth: text,patientMonthErrorMsg:null })}
                style={[ styles.inputText,
                  this.state.patientMonthErrorMsg != null?
                  {
                    width: 160,
                    marginRight:0
                  }:
                    styles.inputText
                  ,
                  {
                    width: 160,
                  }
                ]}
            />
          </View>
          {this.state.patientAgeErrorMsg !== null  ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.patientAgeErrorMsg}</Text>
              :null}
              {this.state.patientMonthErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.patientMonthErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}>F. Date of birth</Text>
          {/* 
          style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
          */}
          <View style={[{ flexDirection: 'row' }, styles.inputText]}>

            <DatePicker
              style={{
                borderColor: '#E0E1E4',
                borderWidth: 2,
                backgroundColor: '#fff',
              }}
              // defaultDate={this.state.chosenDate}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={true}
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
              disabled={this.dobIsEditable}
            />
            <Icon
              name="calendar"
              style={{ color: '#3E4459', marginTop: 8, marginLeft: 160 }}
            />
          </View>
          <Text style={styles.inputLabel}
            onLayout={event =>
              (this.patientIDCardText = event.nativeEvent.layout)
            }>G. Insurer ID Card No</Text>
          <TextInput

            placeholder={'Enter Insurer ID Card No'}
            onChangeText={(text) => this.setState({ insurerId: text,patientIDCardErrorMsg:null })}
            style={[ styles.inputText,
              this.state.patientIDCardErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
            {this.state.patientIDCardErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.patientIDCardErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
              onLayout={event =>
                (this.policyNoText = event.nativeEvent.layout)
              }>
            H. Policy number / Name of corporate
          </Text>
          <TextInput
            placeholder={'Enter policy no / corporate name'}

            onChangeText={(text) => this.setState({ policyNumber: text,policyNoTextErrorMsg:null })}
            style={[ styles.inputText,
              this.state.policyNoTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
          {this.state.policyNoTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.policyNoTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
          onLayout={event =>
            (this.EmployeeIdText = event.nativeEvent.layout)
          }>I. Employee ID</Text>
          <TextInput

            placeholder={'Enter Employee ID'}
            onChangeText={(text) => this.setState({ employeeId: text,employeeIdTextErrorMsg:null})}
            style={[ styles.inputText,
              this.state.employeeIdTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
           {this.state.employeeIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.employeeIdTextErrorMsg}</Text>
              :null}
          <Text style={[styles.inputLabel, { lineHeight: 26 }]}
              onLayout={event =>
                (this.InsureNameText = event.nativeEvent.layout)
              }>
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
              <Text style={styles.inputLabel}
           >J.1. Insurer Name</Text>
              <TextInput
                onChangeText={(text) => this.setState({ insurerName: text,insureNameTextErrorMsg:null})}
                placeholder={'Enter insurer Name'}
                style={[ styles.inputText,
                  this.state.insureNameTextErrorMsg != null?
                  {
                    borderColor: 'red',
                  }:
                    styles.inputText
                  ,
                ]}
              />
 {this.state.insureNameTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.insureNameTextErrorMsg}</Text>
              :null}
              <Text style={styles.inputLabel}>J.2. Give Details</Text>
              <TextInput
                value={this.state.employeeId}
                placeholder={'Enter Employee ID'}
                style={styles.inputText}
              />
            </View>
            : null}

          <Text style={[styles.inputLabel, { lineHeight: 26 }]}
          onLayout={event =>
            (this.personalPhysicianNameText = event.nativeEvent.layout)
          }>
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
            <View>
            <TextInput

              onChangeText={(text) => this.setState({ physicianName: text,PhysicianNameTextErrorMsg:null })}
              placeholder={'Enter Physician name'}
              style={[ styles.inputText,
                this.state.PhysicianNameTextErrorMsg != null?
                {
                  borderColor: 'red',
                }:
                  styles.inputText
                ,
              ]}
            />
              {this.state.PhysicianNameTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.PhysicianNameTextErrorMsg}</Text>
              :null}
            </View>
            
          ) : null}
         
          {
            this.state.selectOptionPoopup ?
              <ImageUpload
                popupVisible={(data) => this.imageUpload(data)}
              /> : null
          }
          <Text  style={{marginTop:-20}}onLayout={event =>
                  (this.physicianContactNoText = event.nativeEvent.layout)
                }/>
          {this.state.haveFamilyPhysician === 'yes' ? (
            <View>
              <Text style={styles.inputLabel}
                >K.1. Contact No</Text>
              <TextInput
                placeholder={'Enter Contact No'}

                onChangeText={(text) => this.setState({ physicianContactNumber: text,physicianContactNoTextErrorMsg:null })}
                style={[ styles.inputText,
                  this.state.physicianContactNoTextErrorMsg != null?
                  {
                    borderColor: 'red',
                  }:
                    styles.inputText
                  ,
                ]}
              />
               {this.state.physicianContactNoTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.physicianContactNoTextErrorMsg}</Text>
              :null}
            </View>
          ) : null}
          <Text style={styles.inputLabel}
          onLayout={event =>
            (this.insurerPatientOccupations = event.nativeEvent.layout)
          }>
            L. Occupation of insured patient
          </Text>
          <TextInput

            onChangeText={(text) => this.setState({ insurerPatientOccupation: text,insurerPatientOccupationsErrorMsg:null })}
            placeholder={'Enter Occupation of insured patient'}
            style={[ styles.inputText,
              this.state.insurerPatientOccupationsErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
           {this.state.insurerPatientOccupationsErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.insurerPatientOccupationsErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
             onLayout={event =>
              (this.insurerPatientAddressText = event.nativeEvent.layout)
            }>M. Address of insured patient</Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ insurerPatientAddress: text ,insurerPatientAddressTextErrorMsg:null})}
            style={[ styles.inputText,
              this.state.insurerPatientAddressTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
          {this.state.insurerPatientAddressTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.insurerPatientAddressTextErrorMsg}</Text>
              :null}
          <Text style={styles.headerText}>Upload your aadhar copy</Text>
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
      </SafeAreaView>
    );
  };

  DoctorDetails = () => {
    return (
      <ScrollView style={styles.body}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>
            to be filled by the treating doctor / hospital
          </Text>
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.treatingDoctorNameText = event.nativeEvent.layout)
          }>A. Name of treating doctor</Text>
          <TextInput
            onChangeText={(text) => this.setState({ treatingDoctorName: text,treatingDoctorNameTextErrorMsg:null})}
            placeholder={'Enter Name of treating doctor'}
            style={[ styles.inputText,
              this.state.treatingDoctorNameTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
          {this.state.treatingDoctorNameTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.treatingDoctorNameTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.treatingDoctorContactNoText= event.nativeEvent.layout)
          }>B. Contact No</Text>
          <TextInput

            onChangeText={(text) => this.setState({ treatingDoctorContactNo: text,treatingDoctorContactNoTextErrorMsg:null })}
            placeholder={'Enter contact no'}
            style={[ styles.inputText,
              this.state.treatingDoctorContactNoTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
           {this.state.treatingDoctorContactNoTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.treatingDoctorContactNoTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.diseaseDiscriptionText= event.nativeEvent.layout)
          }>
            C. Name of illness/disease with presenting complaints
          </Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ diseaseDiscription: text,diseaseDiscriptionTextErrorMsg:null })}
            style={[ styles.inputText,
              this.state.diseaseDiscriptionTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
           />
           {this.state.diseaseDiscriptionTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.diseaseDiscriptionTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
          onLayout={event =>
            (this.releventClinicalText= event.nativeEvent.layout)
          }>D. Relevant clinical findings</Text>
          <TextInput
            placeholder={''}

            onChangeText={(text) => this.setState({ releventClinical: text,releventClinicalTextErrorMsg:null })}
            style={[ styles.inputText,
              this.state.releventClinicalTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
             />
           {this.state.releventClinicalTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.releventClinicalTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
              onLayout={event =>
                (this.durationOfPresentText= event.nativeEvent.layout)
              }>
            E. Duration of the present ailment in days
          </Text>
          <TextInput
            placeholder={'Enter duration of present ailment'}

            onChangeText={(text) => this.setState({ durationOfPresent: text,durationOfPresentTextErrorMsg:null })}
            style={[ styles.inputText,
              this.state.durationOfPresentTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
          />
             {this.state.durationOfPresentTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.durationOfPresentTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}>E.1. Date of first consultation</Text>
          <View style={[{ flexDirection: 'row' }, styles.inputText]}>
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
          </View>
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
            your request is being processed, will be notified on successful
            completion of request, your reference id is {this.state.referenceID}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.setState({ currentForm: 2 });
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
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.body} ref={ref => (this.scrollViewRef = ref)}>
        <Text style={styles.formHeader}>
          Request For cashless hospitalisation for health insurance policy part
          c (revised)
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>enter hospital details</Text>
          <Text style={styles.inputLabel}
              onLayout={event =>
                (this.hospitalNameText= event.nativeEvent.layout)
              }>Name of the hospital</Text>
          <TextInput
            placeholder={'Enter name of the hospital'}
            style={[ styles.inputText,
              this.state.hospitalNameTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
            onChangeText={(text) => this.setState({ hospitalName: text,hospitalNameTextErrorMsg:null })}
          />
            {this.state.hospitalNameTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.hospitalNameTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.hospitalLocationText= event.nativeEvent.layout)
          }>Hospital Location</Text>
          <TextInput

            placeholder={'Enter hospital location'}
            style={[ styles.inputText,
              this.state.hospitalLocationTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
            onChangeText={(text) => this.setState({ hospitalLocation: text,hospitalLocationTextErrorMsg:null })}
          />
            {this.state.hospitalLocationTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.hospitalLocationTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
             onLayout={event =>
              (this.hospitalIdText= event.nativeEvent.layout)
            }>Hospital ID</Text>
          <TextInput
            placeholder={'Enter hospital ID'}
            style={[ styles.inputText,
              this.state.hospitalIdTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}

            onChangeText={(text) => this.setState({ hospitalId: text,hospitalIdTextErrorMsg:null})}
          />
           {this.state.hospitalIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.hospitalIdTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
           onLayout={event =>
            (this.hospitalEmailText= event.nativeEvent.layout)
          }>Hospital Email ID</Text>
          <TextInput

            placeholder={'Enter Email ID'}
            style={[ styles.inputText,
              this.state.hospitalEmailTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
            onChangeText={(text) => this.setState({ hospitalEmail: text,hospitalEmailTextErrorMsg:null })}
          />
           {this.state.hospitalEmailTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.hospitalEmailTextErrorMsg}</Text>
              :null}
          <Text style={styles.inputLabel}
            onLayout={event =>
              (this.rohiniIdText= event.nativeEvent.layout)
            }>Rohini ID</Text>
          <TextInput
            placeholder={'Enter Rohini ID'}
            style={[ styles.inputText,
              this.state.rohiniIdTextErrorMsg != null?
              {
                borderColor: 'red',
              }:
                styles.inputText
              ,
            ]}
            onChangeText={(text) => this.setState({ rohiniId: text,rohiniIdTextErrorMsg:null })}
          />
           {this.state.rohiniIdTextErrorMsg !== null ?
              <Text style={{ color: 'red', marginRight: 40, marginTop: 10,textAlign:'right',fontSize:14 }}>{this.state.rohiniIdTextErrorMsg}</Text>
              :null}
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
      </SafeAreaView>
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
    borderWidth: 0.5,
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
