import React, {PureComponent} from 'react';
import {
  Text,
  View,
  Container,
  Content,
  Card,
  Item,
  Input,
  Toast,
} from 'native-base';
import {
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import {primaryColor} from '../../../../setup/config';
import HospitalDetail from './HospitalDetail';
import PatientAdmittedDetails from './PatientAdmittedDetails';
import ClaimDetails from './ClaimDetails';
import DocumentSubmitted from './DocumentSubmitted';
import NonNetworkHospital from './NonNetworkHospital';
import DeclarationByHospital from './DeclarationByHospital';
import AttachmentDetails from './AttachmentDetails';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {UploadClaimSubmission} from './uploadClaimSubmission';
import {
  TimeOfAdmissionHours,
  TimeOfAdmissionMinute,
  TimeOfDischargeHours,
  TimeOfDischargeMinute,
} from '../../../common';
import {uploadImage} from '../../../providers/common/common.action';
import {
  updateClaimSubmission,
  getClaimSubmissionById,
  createClaimSubmission,
  getListByTpaCode,
} from '../../../providers/corporate/corporate.actions';
import RNFetchBlob from 'rn-fetch-blob';
const dropdownData = [
  'Select your Item',
  'Emergency',
  'Planned',
  'Day Care',
  'Maternity',
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
const dischargeTimeStatus = [
  'Select your Status',
  'Discharge to Home',
  'Discharge to another hospital',
  'Deceased',
];

const ListOfData = [
  {text: 'Claim form duly signed'},
  {text: 'CT/MR/USG/HPE investigation reports'},
  {text: 'Copy of the Pre-authorization approval letter'},
  {text: 'Copy of Photo ID Card of patient Verified by hospital'},
  {text: 'Hospital Discharge summary'},
  {text: 'Operation Theatre Notes'},
  {text: 'Hospital main bill'},
  {text: 'Any other, please specify'},
  {text: 'Investigation reports'},
  {text: 'Original Pre-authorization request'},
  {text: 'Doctor’s reference slip for investigation'},
  {text: 'ECG'},
  {text: 'Pharmacy bills'},
  {text: 'MLC reports & Police FIR'},
  {text: 'Hospital break-up bill'},
];

class SubmitClaimPageTwo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCard: 0,
      show: true,
      dropdownList: '',
      Occupation: '',
      RoomCategory: '',
      Hospitalization: '',
      InjuryCause: '',
      checkBoxClick: false,
      selectOptionPopup: false,
      uploadData: null,
      isLoadingUploadDocs: false,
      claimSubmissionAttachments: [],
      section1Disable: true,
      section2Disable: true,
      section4Disable: true,
      section5Disable: true,
      section6Disable: true,
      section7Disable: true,
      updateId: this.props.navigation.getParam('dataId') || null,
      disabled: 1,
      submitButton: true,
    };
    this.submissionDetails = this.props.navigation.getParam(
      'submissionDetails',
    );
  }

  toggleData(index, typeOfArrowIcon) {
    const {showCard, show} = this.state;
    if (typeOfArrowIcon === 'DOWN' || index===showCard) {
      this.setState({showCard: index, show: !this.state.show});
    } else {
      this.setState({showCard: -1, show: null});
    }
  }

  updateSubmissionDetails = async (data) => {
    try {
      const {submissionDetails} = this.state;
      let reqData = {
        _id: this.state.updateId,
        submissionDetails: {
          ...this.submissionDetails,
          ...data,
          // hospitalName: data.hospitalName
          //   ? data.hospitalName
          //   :  this.submissionDetails.hospitalName
          //   ?  this.submissionDetails.hospitalName
          //   : null,
          // hospitalId: data.hospitalId
          //   ? data.hospitalId
          //   :  this.submissionDetails.hospitalId
          //   ?  this.submissionDetails.hospitalId
          //   : null,
          // hospitalType: data.hospitalType
          //   ? data.hospitalType
          //   :  this.submissionDetails.hospitalType
          //   ?  this.submissionDetails.hospitalType
          //   : null,
          // treatingDoctorName: data.treatingDoctorName
          //   ? data.treatingDoctorName
          //   :  this.submissionDetails.treatingDoctorName
          //   ?  this.submissionDetails.treatingDoctorName
          //   : null,
          // treatingDoctorMiddleName: data.treatingDoctorMiddleName
          //   ? data.treatingDoctorMiddleName
          //   :  this.submissionDetails.treatingDoctorMiddleName
          //   ?  this.submissionDetails.treatingDoctorMiddleName
          //   : null,
          // treatingDoctorLastName: data.treatingDoctorLastName
          //   ? data.treatingDoctorLastName
          //   :  this.submissionDetails.treatingDoctorLastName
          //   ?  this.submissionDetails.treatingDoctorLastName
          //   : null,
          // qualification: data.qualification
          //   ? data.qualification
          //   :  this.submissionDetails.qualification
          //   ?  this.submissionDetails.qualification
          //   : null,
          // registrationStateCode: data.registrationStateCode
          //   ? data.registrationStateCode
          //   :  this.submissionDetails.registrationStateCode
          //   ?  this.submissionDetails.registrationStateCode
          //   : null,
          // hospitalPhoneNumber: data.hospitalPhoneNumber
          //   ? data.hospitalPhoneNumber
          //   :  this.submissionDetails.hospitalPhoneNumber
          //   ?  this.submissionDetails.hospitalPhoneNumber
          //   : null,
          // patientFirstName: data.patientFirstName
          //   ? data.patientFirstName
          //   : this. this.submissionDetails.patientFirstName
          //   ? this. this.submissionDetails.patientFirstName
          //   : null,
          // patientMiddleName: data.patientMiddleName
          //   ? data.patientMiddleName
          //   :  this.submissionDetails.patientMiddleName
          //   ?  this.submissionDetails.patientMiddleName
          //   : null,
          // patientLastName: data.patientLastName
          //   ? data.patientLastName
          //   :  this.submissionDetails.patientLastName
          //   ?  this.submissionDetails.patientLastName
          //   : null,
          // patientGender: data.patientGender
          //   ? data.patientGender
          //   :  this.submissionDetails.patientGender
          //   ?  this.submissionDetails.patientGender
          //   : null,
          // patientAgeYear1: data.patientAgeYear1
          //   ? data.patientAgeYear1
          //   :  this.submissionDetails.patientAgeYear1
          //   ?  this.submissionDetails.patientAgeYear1
          //   : null,
          // patientAgeYear2: data.patientAgeYear2
          //   ? data.patientAgeYear2
          //   :  this.submissionDetails.patientAgeYear2
          //   ?  this.submissionDetails.patientAgeYear2
          //   : null,
          // patientAgeMonth1: data.patientAgeMonth1
          //   ? data.patientAgeMonth1
          //   :  this.submissionDetails.patientAgeMonth1
          //   ?  this.submissionDetails.patientAgeMonth1
          //   : null,
          // patientAgeMonth2: data.patientAgeMonth2
          //   ? data.patientAgeMonth2
          //   :  this.submissionDetails.patientAgeMonth2
          //   ?  this.submissionDetails.patientAgeMonth2
          //   : null,
          // ipRegistrationNo: data.ipRegistrationNo
          //   ? data.ipRegistrationNo
          //   :  this.submissionDetails.ipRegistrationNo
          //   ?  this.submissionDetails.ipRegistrationNo
          //   : null,
          // patientDOB: data.patientDOB
          //   ? data.patientDOB
          //   :  this.submissionDetails.patientDOB
          //   ?  this.submissionDetails.patientDOB
          //   : null,
          // submissionDateOfAdmission: data.patientDOB
          //   ? data.submissionDateOfAdmission
          //   :  this.submissionDetails.submissionDateOfAdmission
          //   ?  this.submissionDetails.submissionDateOfAdmission
          //   : null,
          // admissionTimeInHour: data.admissionTimeInHour
          //   ? data.admissionTimeInHour
          //   :  this.submissionDetails.admissionTimeInHour
          //   ?  this.submissionDetails.admissionTimeInHour
          //   : null,
          // admissionTimeInMin: data.admissionTimeInMin
          //   ? data.admissionTimeInMin
          //   :  this.submissionDetails.admissionTimeInMin
          //   ?  this.submissionDetails.admissionTimeInMin
          //   : null,
          // dischargeTimeInHour: data.dischargeTimeInHour
          //   ? data.dischargeTimeInHour
          //   :  this.submissionDetails.dischargeTimeInHour
          //   ?  this.submissionDetails.dischargeTimeInHour
          //   : null,
          // dischargeTimeInMin: data.dischargeTimeInMin
          //   ? data.dischargeTimeInMin
          //   :  this.submissionDetails.dischargeTimeInMin
          //   ?  this.submissionDetails.dischargeTimeInMin
          //   : null,
          // submissionDischargeStatus: data.submissionDischargeStatus
          //   ? data.submissionDischargeStatus
          //   :  this.submissionDetails.submissionDischargeStatus
          //   ?  this.submissionDetails.submissionDischargeStatus
          //   : null,
          // submissionDeliveryDate: data.submissionDeliveryDate
          //   ? data.submissionDeliveryDate
          //   :  this.submissionDetails.submissionDeliveryDate
          //   ?  this.submissionDetails.submissionDeliveryDate
          //   : null,
          // typeOfAdmission: data.typeOfAdmission
          //   ? data.typeOfAdmission
          //   :  this.submissionDetails.typeOfAdmission
          //   ?  this.submissionDetails.typeOfAdmission
          //   : null,
          // totalOfClaimAmount: data.totalOfClaimAmount
          //   ? data.totalOfClaimAmount
          //   :  this.submissionDetails.totalOfClaimAmount
          //   ?  this.submissionDetails.totalOfClaimAmount
          //   : null,
          // submissionDateOfDischarge: data.submissionDateOfDischarge
          //   ? data.submissionDateOfDischarge
          //   :  this.submissionDetails.submissionDateOfDischarge
          //   ?  this.submissionDetails.submissionDateOfDischarge
          //   : null,
          // gravidaStatus: data.gravidaStatus
          //   ? data.gravidaStatus
          //   :  this.submissionDetails.gravidaStatus
          //   ?  this.submissionDetails.gravidaStatus
          //   : null,
          // claimFormDulySigned: data.claimFormDulySigned
          //   ? data.claimFormDulySigned
          //   :  this.submissionDetails.claimFormDulySigned
          //   ?  this.submissionDetails.claimFormDulySigned
          //   : null,
          // ctInvestigationReports: data.ctInvestigationReports
          //   ? data.ctInvestigationReports
          //   :  this.submissionDetails.ctInvestigationReports
          //   ?  this.submissionDetails.ctInvestigationReports
          //   : null,
          // copyOfPreAuthApprovalLetter: data.copyOfPreAuthApprovalLetter
          //   ? data.copyOfPreAuthApprovalLetter
          //   :  this.submissionDetails.copyOfPreAuthApprovalLetter
          //   ?  this.submissionDetails.copyOfPreAuthApprovalLetter
          //   : null,
          // patientVerifiedByHospital: data.patientVerifiedByHospital
          //   ? data.patientVerifiedByHospital
          //   :  this.submissionDetails.patientVerifiedByHospital
          //   ?  this.submissionDetails.patientVerifiedByHospital
          //   : null,
          // hospitalDischargeSummary: data.hospitalDischargeSummary
          //   ? data.hospitalDischargeSummary
          //   :  this.submissionDetails.hospitalDischargeSummary
          //   ?  this.submissionDetails.hospitalDischargeSummary
          //   : null,
          // operationTheatreNotes: data.operationTheatreNotes
          //   ? data.operationTheatreNotes
          //   :  this.submissionDetails.operationTheatreNotes
          //   ?  this.submissionDetails.operationTheatreNotes
          //   : null,
          // hospitalMainBill: data.hospitalMainBill
          //   ? data.hospitalMainBill
          //   :  this.submissionDetails.hospitalMainBill
          //   ?  this.submissionDetails.hospitalMainBill
          //   : null,
          // anyOthers: data.anyOthers
          //   ? data.anyOthers
          //   :  this.submissionDetails.anyOthers
          //   ?  this.submissionDetails.anyOthers
          //   : null,
          // investigationReports: data.investigationReports
          //   ? data.investigationReports
          //   :  this.submissionDetails.investigationReports
          //   ?  this.submissionDetails.investigationReports
          //   : null,
          // originalPreAuthRequest: data.originalPreAuthRequest
          //   ? data.originalPreAuthRequest
          //   :  this.submissionDetails.originalPreAuthRequest
          //   ?  this.submissionDetails.originalPreAuthRequest
          //   : null,
          // DoctorReferenceSlipForInvestigation: data.DoctorReferenceSlipForInvestigation
          //   ? data.DoctorReferenceSlipForInvestigation
          //   :  this.submissionDetails.DoctorReferenceSlipForInvestigation
          //   ?  this.submissionDetails.DoctorReferenceSlipForInvestigation
          //   : null,
          // ecg: ecg,
          // pharmacyBill: data.pharmacyBill
          //   ? data.pharmacyBill
          //   :  this.submissionDetails.pharmacyBill
          //   ?  this.submissionDetails.pharmacyBill
          //   : null,
          // MLCReportsAndPoliceFIR: data.MLCReportsAndPoliceFIR
          //   ? data.MLCReportsAndPoliceFIR
          //   :  this.submissionDetails.MLCReportsAndPoliceFIR
          //   ?  this.submissionDetails.MLCReportsAndPoliceFIR
          //   : null,
          // hospitalBreakupBill: data.hospitalBreakupBill
          //   ? data.hospitalBreakupBill
          //   :  this.submissionDetails.hospitalBreakupBill
          //   ?  this.submissionDetails.hospitalBreakupBill
          //   : null,
          // nonNetworkHospitalAddress: data.nonNetworkHospitalAddress
          //   ? data.nonNetworkHospitalAddress
          //   :  this.submissionDetails.nonNetworkHospitalAddress
          //   ?  this.submissionDetails.nonNetworkHospitalAddress
          //   : null,
          // nonNetworkHospitalPinCode: data.nonNetworkHospitalPinCode
          //   ? data.nonNetworkHospitalPinCode
          //   :  this.submissionDetails.nonNetworkHospitalPinCode
          //   ?  this.submissionDetails.nonNetworkHospitalPinCode
          //   : null,
          // nonNetworkHospitalState: data.nonNetworkHospitalState
          //   ? data.nonNetworkHospitalState
          //   :  this.submissionDetails.nonNetworkHospitalState
          //   ?  this.submissionDetails.nonNetworkHospitalState
          //   : null,
          // nonNetworkHospitalCity: data.nonNetworkHospitalCity
          //   ? data.nonNetworkHospitalCity
          //   :  this.submissionDetails.nonNetworkHospitalCity
          //   ?  this.submissionDetails.nonNetworkHospitalCity
          //   : null,
          // nonNetworkHospitalNoAndStreet: data.nonNetworkHospitalNoAndStreet
          //   ? data.nonNetworkHospitalNoAndStreet
          //   :  this.submissionDetails.nonNetworkHospitalNoAndStreet
          //   ?  this.submissionDetails.nonNetworkHospitalNoAndStreet
          //   : null,
          // nonNetworkHospitalCountry: data.nonNetworkHospitalCountry
          //   ? data.nonNetworkHospitalCountry
          //   :  this.submissionDetails.nonNetworkHospitalCountry
          //   ?  this.submissionDetails.nonNetworkHospitalCountry
          //   : null,
          // nonNetworkHospitalRegistrationStateCode: data.nonNetworkHospitalRegistrationStateCode
          //   ? data.nonNetworkHospitalRegistrationStateCode
          //   :  this.submissionDetails.nonNetworkHospitalRegistrationStateCode
          //   ?  this.submissionDetails.nonNetworkHospitalRegistrationStateCode
          //   : null,
          // nonNetworkHospitalPlan: data.nonNetworkHospitalPlan
          //   ? data.nonNetworkHospitalPlan
          //   :  this.submissionDetails.nonNetworkHospitalPlan
          //   ?  this.submissionDetails.nonNetworkHospitalPlan
          //   : null,
          // nonNetworkHospitalMobileNumber: data.nonNetworkHospitalMobileNumber
          //   ? data.nonNetworkHospitalMobileNumber
          //   :  this.submissionDetails.nonNetworkHospitalMobileNumber
          //   ?  this.submissionDetails.nonNetworkHospitalMobileNumber
          //   : null,
          // nonNetworkHospitalInpatientBeds: data.nonNetworkHospitalInpatientBeds
          //   ? data.nonNetworkHospitalInpatientBeds
          //   :  this.submissionDetails.nonNetworkHospitalInpatientBeds
          //   ?  this.submissionDetails.nonNetworkHospitalInpatientBeds
          //   : null,
          // othersNonNetworkHospital: data.othersNonNetworkHospital
          //   ? data.othersNonNetworkHospital
          //   :  this.submissionDetails.othersNonNetworkHospital
          //   ?  this.submissionDetails.othersNonNetworkHospital
          //   : null,
          // OT: data.OT
          //   ? data.OT
          //   :  this.submissionDetails.OT
          //   ?  this.submissionDetails.OT
          //   : null,
          // ICU: data.ICU
          //   ? data.ICU
          //   :  this.submissionDetails.ICU
          //   ?  this.submissionDetails.ICU
          //   : null,
          // declarationDate: data. declarationDate
          //   ? data. declarationDate
          //   :  this.submissionDetails. declarationDate
          //   ?  this.submissionDetails. declarationDate
          //   : null,
          // declarationPlace: data. declarationPlace
          //   ? data. declarationPlace
          //   :  this.submissionDetails. declarationPlace
          //   ?  this.submissionDetails. declarationPlace
          //   : null,
          // authoritySign: data. authoritySign
          //   ? data. authoritySign
          //   :  this.submissionDetails. authoritySign
          //   ?  this.submissionDetails. authoritySign
          //   : null,
        },
      };
      let result = await updateClaimSubmission(reqData);

      if (result) {
        Toast.show({
          text: 'Successfully Saved the Details',
          duration: 3000,
          type: 'success',
        });
        this.submissionDetails = result.submissionDetails;
        this.setState({updateId: result._id});
        return true;
      }
    } catch (error) {
      console.error('Error on: ', error);
    }
  };
  submitAllDetails = async () => {
    let reqData = {
      isSubmission: true,
    };
    let result = await updateClaimSubmission(reqData);

    if (result) {
      Toast.show({
        text: 'Successfully Saved the All Details',
        duration: 3000,
        type: 'success',
      });
      this.props.navigation.navigate('ClaimIntimationList');
    }
  };
  updateHospitalDetail = async (data) => {
    let hospitalDetail = this.updateSubmissionDetails(data);
    this.updateDisableCout(1);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (hospitalDetail == true) {
      this.setState({section2Disable: true});
    }
  };
  updateInsuredPersonHospitalizedDetails = async (data) => {
    let personDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(2);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (personDetails == true) {
      this.setState({section4Disable: true});
    }
  };
  updateDocumentSubmitted = async (data) => {
    let documentSubmitted = this.updateSubmissionDetails(data);
    this.updateDisableCout(3);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (documentSubmitted == true) {
      this.setState({section5Disable: true});
    }
  };
  updateNonNetworkHospital = async (data) => {
    let nonNetworkHospital = this.updateSubmissionDetails(data);
    this.updateDisableCout(4);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (nonNetworkHospital == true) {
      this.setState({section6Disable: true});
    }
  };
  updateDeclarationByHospital = async (data) => {
    let declarationByHospital = this.updateSubmissionDetails(data);
    this.updateDisableCout(5);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (declarationByHospital == true) {
      this.setState({section7Disable: true});
    }
  };
  updateAttachment = async (data) => {
    let attachmentDetails = this.submitData(data);
    this.updateDisableCout(6);
    const {showCard} = this.state;
    this.setState({showCard: showCard + 1});
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
    if (attachmentDetails == true) {
      this.setState({submitButton: false});
    }
  };

  updateDisableCout = (number) => {
    const { disabled } = this.state;
    if(number === disabled){
    this.setState({ disabled: disabled + 1 });
    }
  };

  submitData = async (data) => {
    try {
      let reqData = {
        _id: this.state.updateId,
        claimSubmissionAttachments: this.state.claimSubmissionAttachments,
      };
      let result = await updateClaimSubmission(reqData);
      if (result) {
        this.setState({
          updateId: result._id,
          claimSubmissionAttachments: result.claimSubmissionAttachments,
        });
        return true;
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const data = [
      {title: 'Details of hospital', id: 1},
      {title: 'Details of patient admitted', id: 2},
      // { title: 'Details of claim', id: 3 },
      {title: 'Claim documents submitted - checklist', id: 4},
      {
        title:
          'Additional details in case of non network hospital(only fill in case of non network hospital)',
        id: 5,
      },
      {title: 'Declaration by hospital', id: 6},
      {title: 'Attachment Details', id: 7},
    ];
    const {showCard, show, disabled} = this.state;
    return (
      <ScrollView
        style={{padding: 10}}
        ref={(c) => {
          this.scroll = c;
        }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View>
              {this.state.showCard === index && !this.state.show ? (
                <Card>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      padding: 10,
                      backgroundColor: primaryColor,
                    }}
                    onPress={() => this.toggleData(index, 'UP')}>
                    <Row>
                      <Col size={9}>
                        <Text style={{color: '#fff'}}>{item.title}</Text>
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
                            style={{fontSize: 25, color: '#fff'}}
                          />
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderBottomColor: '#909090',
                      borderLeftColor: '#909090',
                      borderRightColor: '#909090',
                      paddingBottom: 10,
                    }}>
                    {item.id === 1 && (
                      <HospitalDetail
                        updateHospitalDetail={(data) =>
                          this.updateHospitalDetail(data)
                        }
                      />
                    )}

                    {item.id === 2 && this.state.section2Disable && (
                      <PatientAdmittedDetails
                        dropdownData={dropdownData}
                        dischargeTimeStatus={dischargeTimeStatus}
                        TimeOfAdmissionHours={TimeOfAdmissionHours}
                        TimeOfAdmissionMinute={TimeOfAdmissionMinute}
                        TimeOfDischargeHours={TimeOfDischargeHours}
                        TimeOfDischargeMinute={TimeOfDischargeMinute}
                        updateInsuredPersonHospitalizedDetails={(data) =>
                          this.updateInsuredPersonHospitalizedDetails(data)
                        }
                      />
                    )}
                    {/* {item.id === 3 && <ClaimDetails
                        isSelected={this.state.isSelected}
                        />
                      } */}
                    {item.id === 4 && this.state.section4Disable && (
                      <DocumentSubmitted
                        updateDocumentSubmitted={(data) =>
                          this.updateDocumentSubmitted(data)
                        }
                      />
                    )}
                    {item.id === 5 && this.state.section5Disable && (
                      <NonNetworkHospital
                        updateNonNetworkHospital={(data) =>
                          this.updateNonNetworkHospital(data)
                        }
                      />
                    )}
                    {item.id === 6 && this.state.section6Disable && (
                      <DeclarationByHospital
                        updateDeclarationByHospital={(data) =>
                          this.updateDeclarationByHospital(data)
                        }
                      />
                    )}
                    {item.id === 7 && (
                      <AttachmentDetails
                        updateAttachment={(data) => this.updateAttachment(data)}
                      />
                    )}
                  </View>
                </Card>
              ) : (
                 <View pointerEvents={disabled >= item.id ? 'auto' : 'none'}>
                  <Card style={disabled >= item.id  ? { backgroundColor: '#fff' } : { backgroundColor: '#E0E0E0' }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        padding: 10,
                        alignItems: 'center',
                      }}
                      onPress={() => this.toggleData(index, 'DOWN')}>
                      <Row>
                        <Col size={9}>
                          <Text style={{color: '#000'}}>{item.title}</Text>
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
                              style={{fontSize: 25, color: '#000'}}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  </Card>
                </View>
              )}
            </View>
          )}
        />
        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.submit_ButtonStyle}
            onPress={() => this.submitAllDetails()}
            disabled={this.state.submitButton == true ? true : false}>
            <Text style={{color: '#fff'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
export default SubmitClaimPageTwo;
