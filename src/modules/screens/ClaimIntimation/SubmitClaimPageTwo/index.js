import React, {PureComponent} from 'react';
import {Text, View, Container, Content, Card, Item, Input} from 'native-base';
import {TouchableOpacity, FlatList, PermissionsAndroid} from 'react-native';
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
import {toastMeassage} from '../../../common';
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
const TimeOfAdmissionHours = [
  'Select',
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
const TimeOfAdmissionMinute = [
  'Select',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
];

const TimeOfDischargeHours = [
  'Select',
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
const TimeOfDischargeMinute = [
  'Select',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
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
      checkBoxClick: false,
      selectOptionPopup: false,
      uploadData: null,
      isLoadingUploadDocs: false,
      remark: '',
      fileName: '',
      claimSubmissionAttachments: [],
      section1Disable: true,
      section2Disable: false,
      section4Disable: false,
      section5Disable: false,
      section6Disable: false,
      section7Disable: true,
      updateId: this.props.navigation.getParam('dataId') || null,
    };
    this.submissionDetails = this.props.navigation.getParam(
      'submissionDetails',
    );
  }

  toggleData(index, typeOfArrowIcon) {
    const {showCard, show} = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({showCard: index, show: !this.state.show});
    } else {
      this.setState({showCard: -1, show: null});
    }
  }
  onPressConfirmDateValue = (date) => {
    try {
      this.setState({isVisibleDatePicker: false, selectedAdmissionDate: date});
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

  oncancelThePicker = () => {
    const {isVisibleDatePicker} = this.state;
    this.setState({isVisibleDatePicker: !isVisibleDatePicker});
  };

  openPicker = () => {
    const {isVisibleDatePicker} = this.state;
    this.setState({isVisibleDatePicker: !isVisibleDatePicker});
  };

  updateSubmissionDetails = async (data) => {
    try {
      console.log('data', data);
      console.log('this.submissionDetails', this.submissionDetails);

      const {submissionDetails} = this.state;
      let reqData = {
        _id: this.state.updateId,
        submissionDetails: {
          ...this.submissionDetails,
          hospitalName: data.hospitalName
            ? data.hospitalName
            : submissionDetails.hospitalName
            ? submissionDetails.hospitalName
            : null,
          hospitalId: data.hospitalId
            ? data.hospitalId
            : submissionDetails.hospitalId
            ? submissionDetails.hospitalId
            : null,
          hospitalType: data.hospitalType
            ? data.hospitalType
            : submissionDetails.hospitalType
            ? submissionDetails.hospitalType
            : null,
          treatingDoctorName: data.treatingDoctorName
            ? data.treatingDoctorName
            : submissionDetails.treatingDoctorName
            ? submissionDetails.treatingDoctorName
            : null,
          treatingDoctorMiddleName: data.treatingDoctorMiddleName
            ? data.treatingDoctorMiddleName
            : submissionDetails.treatingDoctorMiddleName
            ? submissionDetails.treatingDoctorMiddleName
            : null,
          treatingDoctorLastName: data.treatingDoctorLastName
            ? data.treatingDoctorLastName
            : submissionDetails.treatingDoctorLastName
            ? submissionDetails.treatingDoctorLastName
            : null,
          qualification: data.qualification
            ? data.qualification
            : submissionDetails.qualification
            ? submissionDetails.qualification
            : null,
          registrationStateCode: data.registrationStateCode
            ? data.registrationStateCode
            : submissionDetails.registrationStateCode
            ? submissionDetails.registrationStateCode
            : null,
          hospitalPhoneNumber: data.hospitalPhoneNumber
            ? data.hospitalPhoneNumber
            : submissionDetails.hospitalPhoneNumber
            ? submissionDetails.hospitalPhoneNumber
            : null,
          patientFirstName: data.patientFirstName
            ? data.patientFirstName
            : submissionDetails.patientFirstName
            ? submissionDetails.patientFirstName
            : null,
          patientMiddleName: data.patientMiddleName
            ? data.patientMiddleName
            : submissionDetails.patientMiddleName
            ? submissionDetails.patientMiddleName
            : null,
          patientLastName: data.patientLastName
            ? data.patientLastName
            : submissionDetails.patientLastName
            ? submissionDetails.patientLastName
            : null,
          patientGender: data.patientGender
            ? data.patientGender
            : submissionDetails.patientGender
            ? submissionDetails.patientGender
            : null,
          patientAgeYear1: data.patientAgeYear1
            ? data.patientAgeYear1
            : submissionDetails.patientAgeYear1
            ? submissionDetails.patientAgeYear1
            : null,
          patientAgeYear2: data.patientAgeYear2
            ? data.patientAgeYear2
            : submissionDetails.patientAgeYear2
            ? submissionDetails.patientAgeYear2
            : null,
          patientAgeMonth1: data.patientAgeMonth1
            ? data.patientAgeMonth1
            : submissionDetails.patientAgeMonth1
            ? submissionDetails.patientAgeMonth1
            : null,
          patientAgeMonth2: data.patientAgeMonth2
            ? data.patientAgeMonth2
            : submissionDetails.patientAgeMonth2
            ? submissionDetails.patientAgeMonth2
            : null,
          ipRegistrationNo: data.ipRegistrationNo
            ? data.ipRegistrationNo
            : submissionDetails.ipRegistrationNo
            ? submissionDetails.ipRegistrationNo
            : null,
          patientDOB: data.patientDOB
            ? data.patientDOB
            : submissionDetails.patientDOB
            ? submissionDetails.patientDOB
            : null,
          submissionDateOfAdmission: data.patientDOB
            ? data.submissionDateOfAdmission
            : submissionDetails.submissionDateOfAdmission
            ? submissionDetails.submissionDateOfAdmission
            : null,
          admissionTimeInHour: data.admissionTimeInHour
            ? data.admissionTimeInHour
            : submissionDetails.admissionTimeInHour
            ? submissionDetails.admissionTimeInHour
            : null,
          admissionTimeInMin: data.admissionTimeInMin
            ? data.admissionTimeInMin
            : submissionDetails.admissionTimeInMin
            ? submissionDetails.admissionTimeInMin
            : null,
          dischargeTimeInHour: data.dischargeTimeInHour
            ? data.dischargeTimeInHour
            : submissionDetails.dischargeTimeInHour
            ? submissionDetails.dischargeTimeInHour
            : null,
          dischargeTimeInMin: data.dischargeTimeInMin
            ? data.dischargeTimeInMin
            : submissionDetails.dischargeTimeInMin
            ? submissionDetails.dischargeTimeInMin
            : null,
          submissionDischargeStatus: data.submissionDischargeStatus
            ? data.submissionDischargeStatus
            : submissionDetails.submissionDischargeStatus
            ? submissionDetails.submissionDischargeStatus
            : null,
          submissionDeliveryDate: data.submissionDeliveryDate
            ? data.submissionDeliveryDate
            : submissionDetails.submissionDeliveryDate
            ? submissionDetails.submissionDeliveryDate
            : null,
          typeOfAdmission: data.typeOfAdmission
            ? data.typeOfAdmission
            : submissionDetails.typeOfAdmission
            ? submissionDetails.typeOfAdmission
            : null,
          totalOfClaimAmount: data.totalOfClaimAmount
            ? data.totalOfClaimAmount
            : submissionDetails.totalOfClaimAmount
            ? submissionDetails.totalOfClaimAmount
            : null,
          submissionDateOfDischarge: data.submissionDateOfDischarge
            ? data.submissionDateOfDischarge
            : submissionDetails.submissionDateOfDischarge
            ? submissionDetails.submissionDateOfDischarge
            : null,
          gravidaStatus: data.gravidaStatus
            ? data.gravidaStatus
            : submissionDetails.gravidaStatus
            ? submissionDetails.gravidaStatus
            : null,
          claimFormDulySigned: data.claimFormDulySigned
            ? data.claimFormDulySigned
            : submissionDetails.claimFormDulySigned
            ? submissionDetails.claimFormDulySigned
            : null,
          ctInvestigationReports: data.ctInvestigationReports
            ? data.ctInvestigationReports
            : submissionDetails.ctInvestigationReports
            ? submissionDetails.ctInvestigationReports
            : null,
          copyOfPreAuthApprovalLetter: data.copyOfPreAuthApprovalLetter
            ? data.copyOfPreAuthApprovalLetter
            : submissionDetails.copyOfPreAuthApprovalLetter
            ? submissionDetails.copyOfPreAuthApprovalLetter
            : null,
          patientVerifiedByHospital: data.patientVerifiedByHospital
            ? data.patientVerifiedByHospital
            : submissionDetails.patientVerifiedByHospital
            ? submissionDetails.patientVerifiedByHospital
            : null,
          hospitalDischargeSummary: data.hospitalDischargeSummary
            ? data.hospitalDischargeSummary
            : submissionDetails.hospitalDischargeSummary
            ? submissionDetails.hospitalDischargeSummary
            : null,
          operationTheatreNotes: data.operationTheatreNotes
            ? data.operationTheatreNotes
            : submissionDetails.operationTheatreNotes
            ? submissionDetails.operationTheatreNotes
            : null,
          hospitalMainBill: data.hospitalMainBill
            ? data.hospitalMainBill
            : submissionDetails.hospitalMainBill
            ? submissionDetails.hospitalMainBill
            : null,
          anyOthers: data.anyOthers
            ? data.anyOthers
            : submissionDetails.anyOthers
            ? submissionDetails.anyOthers
            : null,
          investigationReports: data.investigationReports
            ? data.investigationReports
            : submissionDetails.investigationReports
            ? submissionDetails.investigationReports
            : null,
          originalPreAuthRequest: data.originalPreAuthRequest
            ? data.originalPreAuthRequest
            : submissionDetails.originalPreAuthRequest
            ? submissionDetails.originalPreAuthRequest
            : null,
          DoctorReferenceSlipForInvestigation: data.DoctorReferenceSlipForInvestigation
            ? data.DoctorReferenceSlipForInvestigation
            : submissionDetails.DoctorReferenceSlipForInvestigation
            ? submissionDetails.DoctorReferenceSlipForInvestigation
            : null,
          ecg: ecg,
          pharmacyBill: data.pharmacyBill
            ? data.pharmacyBill
            : submissionDetails.pharmacyBill
            ? submissionDetails.pharmacyBill
            : null,
          MLCReportsAndPoliceFIR: data.MLCReportsAndPoliceFIR
            ? data.MLCReportsAndPoliceFIR
            : submissionDetails.MLCReportsAndPoliceFIR
            ? submissionDetails.MLCReportsAndPoliceFIR
            : null,
          hospitalBreakupBill: data.hospitalBreakupBill
            ? data.hospitalBreakupBill
            : submissionDetails.hospitalBreakupBill
            ? submissionDetails.hospitalBreakupBill
            : null,
          nonNetworkHospitalAddress: data.nonNetworkHospitalAddress
            ? data.nonNetworkHospitalAddress
            : submissionDetails.nonNetworkHospitalAddress
            ? submissionDetails.nonNetworkHospitalAddress
            : null,
          nonNetworkHospitalPinCode: data.nonNetworkHospitalPinCode
            ? data.nonNetworkHospitalPinCode
            : submissionDetails.nonNetworkHospitalPinCode
            ? submissionDetails.nonNetworkHospitalPinCode
            : null,
          nonNetworkHospitalState: data.nonNetworkHospitalState
            ? data.nonNetworkHospitalState
            : submissionDetails.nonNetworkHospitalState
            ? submissionDetails.nonNetworkHospitalState
            : null,
          nonNetworkHospitalCity: data.nonNetworkHospitalCity
            ? data.nonNetworkHospitalCity
            : submissionDetails.nonNetworkHospitalCity
            ? submissionDetails.nonNetworkHospitalCity
            : null,
          nonNetworkHospitalNoAndStreet: data.nonNetworkHospitalNoAndStreet
            ? data.nonNetworkHospitalNoAndStreet
            : submissionDetails.nonNetworkHospitalNoAndStreet
            ? submissionDetails.nonNetworkHospitalNoAndStreet
            : null,
          nonNetworkHospitalCountry: data.nonNetworkHospitalCountry
            ? data.nonNetworkHospitalCountry
            : submissionDetails.nonNetworkHospitalCountry
            ? submissionDetails.nonNetworkHospitalCountry
            : null,
          nonNetworkHospitalRegistrationStateCode: data.nonNetworkHospitalRegistrationStateCode
            ? data.nonNetworkHospitalRegistrationStateCode
            : submissionDetails.nonNetworkHospitalRegistrationStateCode
            ? submissionDetails.nonNetworkHospitalRegistrationStateCode
            : null,
          nonNetworkHospitalPlan: data.nonNetworkHospitalPlan
            ? data.nonNetworkHospitalPlan
            : submissionDetails.nonNetworkHospitalPlan
            ? submissionDetails.nonNetworkHospitalPlan
            : null,
          nonNetworkHospitalMobileNumber: data.nonNetworkHospitalMobileNumber
            ? data.nonNetworkHospitalMobileNumber
            : submissionDetails.nonNetworkHospitalMobileNumber
            ? submissionDetails.nonNetworkHospitalMobileNumber
            : null,
          nonNetworkHospitalInpatientBeds: data.nonNetworkHospitalInpatientBeds
            ? data.nonNetworkHospitalInpatientBeds
            : submissionDetails.nonNetworkHospitalInpatientBeds
            ? submissionDetails.nonNetworkHospitalInpatientBeds
            : null,
          othersNonNetworkHospital: data.othersNonNetworkHospital
            ? data.othersNonNetworkHospital
            : submissionDetails.othersNonNetworkHospital
            ? submissionDetails.othersNonNetworkHospital
            : null,
          OT: data.OT
            ? data.OT
            : submissionDetails.OT
            ? submissionDetails.OT
            : null,
          ICU: data.ICU
            ? data.ICU
            : submissionDetails.ICU
            ? submissionDetails.ICU
            : null,
          declarationDate: data. declarationDate
            ? data. declarationDate
            : submissionDetails. declarationDate
            ? submissionDetails. declarationDate
            : null,
          declarationPlace: data. declarationPlace
            ? data. declarationPlace
            : submissionDetails. declarationPlace
            ? submissionDetails. declarationPlace
            : null,
          authoritySign: data. authoritySign
            ? data. authoritySign
            : submissionDetails. authoritySign
            ? submissionDetails. authoritySign
            : null,
        },
      };
      console.log('reqData', reqData);
      let result = await updateClaimSubmission(reqData);

      if (result) {
        Toast.show({
          text: 'Successfully Saved the Details',
          duration: 3000,
          type: 'success',
        });
        this.setState({updateId: result._id});
        return true;
      }
      console.log('updateId', this.state.updateId);
    } catch (error) {
      console.error('Error on: ', error);
    }
  };
submitAllDetails=async()=>{
  let reqData={
    isSubmission: true,
  }
  let result = await updateClaimSubmission(reqData);

  if (result) {
    Toast.show({
      text: 'Successfully Saved the All Details',
      duration: 3000,
      type: 'success',
    });
    this.props.navigation.navigate('ClaimIntimationList')
  }
}
  updateHospitalDetail = async (data) => {
    let hospitalDetail = this.updateSubmissionDetails(data);
    if (hospitalDetail == true) {
      this.setState({section2Disable: true});
    }
  };
  updateInsuredPersonHospitalizedDetails = async (data) => {
    let personDetails = this.updateSubmissionDetails(data);
    if (personDetails == true) {
      this.setState({section4Disable: true});
    }
  };
  updateDocumentSubmitted = async (data) => {
    let documentSubmitted = this.updateSubmissionDetails(data);
    if (documentSubmitted == true) {
      this.setState({section5Disable: true});
    }
  };
  updateNonNetworkHospital = async (data) => {
    let nonNetworkHospital = this.updateSubmissionDetails(data);
    if (nonNetworkHospital == true) {
      this.setState({section6Disable: true});
    }
  };
  updateDeclarationByHospital = async (data) => {
    let declarationByHospital = this.updateSubmissionDetails(data);
    if (declarationByHospital == true) {
      this.setState({section7Disable: true});
    }
  };
  updateAttachment = async (data) => {
    let attachmentDetails = this.submitData(data);
    if (attachmentDetails == true) {
      this.setState({section7Disable: true});
    }
  };

  imageUpload = async (data) => {
    this.setState({selectOptionPopup: false});
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  uploadImageToServer = async (imagePath) => {
    try {
      console.log('imagePath', imagePath);

      this.setState({isLoadingUploadDocs: true});
      let appendForm = 'action';
      let endPoint = 'images/upload?path=action';
      const response = await uploadImage(imagePath, endPoint, appendForm);
      console.log('response.success', response);
      if (response.success) {
        await this.setState({uploadData: response.data[0]});
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

  addTable = async () => {
    let temp = [];
    temp.push({
      remark: this.state.remark,
      fileName: this.state.fileName,
      fileDetail: this.state.uploadData,
    });
    let data = [...this.state.claimSubmissionAttachments, ...temp];
    this.setState({
      claimSubmissionAttachments: data,
      remark: '',
      fileName: '',
      uploadData: null,
    });
  };
  submitData = async (data) => {
    console.log("data",data)
    try {
      let reqData = {
        _id: this.state.updateId,
        claimSubmissionAttachments: this.state.claimSubmissionAttachments,
      };
      console.log('reqData', reqData);
      let result = await updateClaimSubmission(reqData);
      console.log('result', result);
      if (result) {
        this.setState({
          updateId: result._id,
          claimSubmissionAttachments: result.claimSubmissionAttachments,
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  deleteAttachment = async (item, index) => {
    let temp = this.state.claimSubmissionAttachments;
    await temp.splice(index, 1);
    await this.setState({claimSubmissionAttachments: temp});
    console.log(this.state.claimSubmissionAttachments);
  };

  actualDownload = (imageUrl, fileName) => {
    console.log('imageUrl2', imageUrl);
    console.log('fileName2', fileName);

    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirs.DownloadDir}` + `/` + fileName,
      },
    })
      .fetch('GET', imageUrl, {})
      .then((res) => {
        toastMeassage('Your file has been downloaded to downloads folder!');
        console.log('The file saved to ', res.path());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  downloadAttachment = async (imageURL, file_name) => {
    try {
      console.log('imageURL', imageURL);
      console.log('file_name', file_name);

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(imageURL, file_name);
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log(err);
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
    const {showCard, show} = this.state;
    return (
      <Container>
        <Content contentContainerStyle={{padding: 10}}>
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
                            onPress={() => this.toggleData(index, 'UP')}>
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

                      {/* {item.id === 2 && (
                        <PatientAdmittedDetails
                          dropdownData={dropdownData}
                          dischargeTimeStatus={dischargeTimeStatus}
                          updateSubmissionDetails={(data) =>
                            this.updateSubmissionDetails(data)
                          }
                      />} */}

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
                      {/* {item.id === 7 && <AttachmentDetails 
                      updateAttachment={(data) =>
                        this.updateAttachment(data)
                      }
                      />} */}

                    </View>
                    {/* {this.state.section7Disable && (
                      <View>
                        <View style={styles.ButtonView}>
                          <Row
                            size={4}
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 10,
                            }}>
                            <Col size={1}>
                              <Text style={styles.text}>
                                File Name<Text style={{color: 'red'}}>*</Text>
                              </Text>

                              <Item
                                regular
                                style={{borderRadius: 6, height: 35}}>
                                <Input
                                  placeholder="Enter File Name"
                                  placeholderTextColor={'#CDD0D9'}
                                  returnKeyType={'next'}
                                  value={this.state.fileName}
                                  keyboardType={'default'}
                                  onChangeText={(text) =>
                                    this.setState({fileName: text})
                                  }
                                />
                              </Item>
                            </Col>
                          </Row>
                          <Row
                            size={4}
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 10,
                            }}>
                            <Col size={1}>
                              <Text style={styles.text}>
                                Remarks<Text style={{color: 'red'}}>*</Text>
                              </Text>

                              <Item
                                regular
                                style={{borderRadius: 6, height: 35}}>
                                <Input
                                  placeholder="Enter Remarks"
                                  placeholderTextColor={'#CDD0D9'}
                                  returnKeyType={'next'}
                                  value={this.state.remark}
                                  keyboardType={'default'}
                                  onChangeText={(text) =>
                                    this.setState({remark: text})
                                  }
                                />
                              </Item>
                            </Col>
                          </Row>
                          <View>
                            <Text
                              style={{
                                marginLeft: 15,
                                fontSize: 16,
                                marginTop: 10,
                              }}>
                              Upload Files/Reports/ID Details(Scanned PDF and
                              JPG files) (Max Upload Size: 7168K)
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#E5E5E5',
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 5,
                            }}
                            onPress={() =>
                              this.setState({selectOptionPopup: true})
                            }>
                            <Text>Choose File</Text>
                          </TouchableOpacity>
                          <View style={{marginTop: 20}}>
                            <TouchableOpacity
                              style={styles.submit_ButtonStyle}
                              onPress={() => this.addTable()}>
                              <Text style={{color: '#fff'}}>Add</Text>
                            </TouchableOpacity>
                          </View>
                          {this.state.claimSubmissionAttachments ? (
                            <FlatList
                              data={this.state.claimSubmissionAttachments}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item, index}) => (
                                <View
                                  style={{
                                    padding: 10,
                                    marginTop: 10,
                                    marginBottom: 20,
                                    width: '90%',
                                  }}>
                                  <View style={styles.form_field_view}>
                                    <Text
                                      style={[styles.form_field_inline_label]}>
                                      SL No
                                    </Text>
                                    <Text
                                      style={[
                                        styles.form_field,
                                        {paddingTop: 15, paddingLeft: 10},
                                      ]}>
                                      {index + 1}
                                    </Text>
                                  </View>
                                  <View style={styles.form_field_view}>
                                    <Text
                                      style={[styles.form_field_inline_label]}>
                                      File Name
                                    </Text>
                                    <Text
                                      style={[
                                        styles.form_field,
                                        {paddingTop: 15, paddingLeft: 10},
                                      ]}>
                                      {item.fileName}
                                    </Text>
                                  </View>
                                  <View style={styles.form_field_view}>
                                    <Text
                                      style={[styles.form_field_inline_label]}>
                                      Remarks
                                    </Text>
                                    <Text
                                      style={[
                                        styles.form_field,
                                        {paddingTop: 15, paddingLeft: 10},
                                      ]}>
                                      {item.remark}
                                    </Text>
                                  </View>

                                  <View style={styles.form_field_view}>
                                    <Text
                                      style={[styles.form_field_inline_label]}>
                                      Action
                                    </Text>
                                    <View
                                      style={
                                        (styles.form_field,
                                        {flexDirection: 'row', width: '80%'})
                                      }>
                                      {item.fileDetail ? (
                                        <TouchableOpacity
                                          style={{
                                            width: '40%',
                                            backgroundColor: 'gray',
                                            height: 45,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          onPress={() =>
                                            this.downloadAttachment(
                                              item.fileDetail.imageURL,
                                              item.fileDetail.file_name,
                                            )
                                          }>
                                          <Text
                                            style={{
                                              textAlign: 'center',
                                              color: '#fff',
                                              fontSize: 10,
                                            }}>
                                            Download
                                          </Text>
                                          <AntDesign
                                            name="clouddownload"
                                            style={{
                                              color: '#fff',
                                              fontSize: 20,
                                            }}
                                          />
                                        </TouchableOpacity>
                                      ) : null}

                                      <TouchableOpacity
                                        style={{
                                          width: '40%',
                                          backgroundColor: '#c82333',
                                          height: 45,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                        onPress={() =>
                                          this.deleteAttachment(item, index)
                                        }>
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            color: '#fff',
                                            fontSize: 10,
                                          }}>
                                          Delete
                                        </Text>
                                        <AntDesign
                                          name="delete"
                                          style={{color: '#fff', fontSize: 15}}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}
                            />
                          ) : null}
                          <View style={{marginTop: 20}}>
                            <TouchableOpacity
                              style={styles.submit_ButtonStyle}
                              onPress={() => this.submitData()}
                              disabled={
                                this.state.claimSubmissionAttachments.length
                                  ? false
                                  : true
                              }>
                              <Text style={{color: '#fff'}}>Submit</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        {this.state.selectOptionPopup ? (
                          <UploadClaimSubmission
                            popupVisible={(data) => this.imageUpload(data)}
                          />
                        ) : null}
                      </View>
                    )} */}
                  </Card>
                ) : (
                  <Card>
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
                )}

                {/* alignItems: 'center',
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
                )} */}
              </View>
            )}
          />
           <View style={{marginTop: 20}}>
                            <TouchableOpacity
                              style={styles.submit_ButtonStyle}
                              onPress={() => this.submitData()}
                              disabled={
                                this.state.claimSubmissionAttachments.length
                                  ? false
                                  : true
                              }>
                              <Text style={{color: '#fff'}}>Submit</Text>
                            </TouchableOpacity>
                          </View>
        </Content>
      </Container>
    );
  }
}
export default SubmitClaimPageTwo;
