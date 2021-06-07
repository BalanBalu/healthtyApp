import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Container,
  Content,
  Card,
  Item,
  Input,
  Picker,
  Radio,
  Icon,
  CheckBox,
} from 'native-base';
import { TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {primaryColor} from '../../../../setup/config';
import PrimaryInsured from './PrimaryInsured';
import InsuranceHistory from './InsuranceHistory';
import InsuredPersonHospitalized from './InsuredPersonHospitalized';
import HospitalizationDetails from './HospitalizationDetails';
import ClaimDetail from './ClaimDetail';
import BillEnclosedDeatil from './BillEnclosedDetail';
import PrimaryInsuredBank from './PrimaryInsuredBank';
import DeclarationByInsured from './DeclarationByInsured';
import {
  createClaimSubmission,
  getListByTpaCode,
  updateClaimSubmission,
} from '../../../providers/corporate/corporate.actions';
import styles from '../Styles';
import {TimeOfAdmissionHours,TimeOfAdmissionMinute,TimeOfDischargeHours,TimeOfDischargeMinute} from '../../../common';

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
  { text: 'Claim form duly signed' },
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
    super(props);
    this.state = {
      showCard: -1,
      show: true,
      Occupation: '',
      RoomCategory: '',
      Hospitalization: '',
      InjuryCause: '',
      claimListData: this.props.navigation.getParam('claimListData') || null,
      sectionADisable: true,
      sectionBDisable: true,
      sectionCDisable: true,
      sectionDDisable: true,
      sectionEDisable: true,
      sectionFDisable: true,
      sectionGDisable: true,
      sectionHDisable: true,
      updateId: '60b22d697d0508132089ae51',
      nextButtonEnable: true,
      disabled: 1,
    };
  }

  toggleData(index, typeOfArrowIcon) {
    const { showCard, show } = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({ showCard: index, show: !this.state.show });
    } else {
      this.setState({ showCard: -1, show: null });
    }
  }

  submissionDetails = async (data) => {
    try {
      const { claimListData } = this.state;
      let memberId = await AsyncStorage.getItem('memberId');
      let tpaRes = await getListByTpaCode(claimListData.payerCode);
      let reqData = {
        userName: tpaRes.username,
        password: tpaRes.password,
        policyNo: claimListData.policyNo,
        memberId: memberId,
        mobileNo: claimListData.mobileNo,
        emailId: claimListData.email,
        hospitalName: claimListData.hospitalName,
        ailment: claimListData.ailment,
        claimAmount: claimListData.amount,
        claimIntimationId: claimListData._id,
        claimReferenceNo: claimListData.referenceNumber,
        submissionDetails: data,
        isSubmission: false,
        status: claimListData.status,
        employeeId: claimListData.employeeId,
        employeeName: claimListData.employeeName,
        payerCode: claimListData.payerCode,
      };
      let result = await createClaimSubmission(reqData);
      if (result) {
        await this.setState({
          updateId: result._id,
          submissionDetails: result.submissionDetails,
        });
        return true;
      }
    } catch (error) {
      console.error('Error on: ', error);
    }
  };
  updateDisableCout = (number) => {
    const { disabled } = this.state;
    if(number === disabled){
    this.setState({ disabled: disabled + 1 });
    }
  };

  updateSubmissionDetails = async (data) => {
    console.log("data",data)

    try {
      const {submissionDetails} = this.state;
      let reqData = {
        _id: this.state.updateId,
        submissionDetails: {
          certificateNumber: data.certificateNo
            ? data.certificateNo
            : submissionDetails.certificateNo
              ? submissionDetails.certificateNo
              : null,
          tpaIdNo: data.tpaIdNo
            ? data.tpaIdNo
            : submissionDetails.tpaIdNo
              ? submissionDetails.tpaIdNo
              : null,
          policyHolderFirstName: data.policyHolderFirstName
            ? data.policyHolderFirstName
            : submissionDetails.policyHolderFirstName
              ? submissionDetails.policyHolderFirstName
              : null,
          policyHolderMiddleName: data.policyHolderMiddleName
            ? data.policyHolderMiddleName
            : submissionDetails.policyHolderMiddleName
              ? submissionDetails.policyHolderMiddleName
              : null,
          policyHolderLastName: data.policyHolderLastName
            ? data.policyHolderLastName
            : submissionDetails.policyHolderLastName
              ? submissionDetails.policyHolderLastName
              : null,
          policyHolderPincode: data.policyHolderPincode
            ? data.policyHolderPincode
            : submissionDetails.policyHolderPincode
              ? submissionDetails.policyHolderPincode
              : null,
          noAndStreet: data.noAndStreet
            ? data.noAndStreet
            : submissionDetails.noAndStreet
              ? submissionDetails.noAndStreet
              : null,
          holderAddress: data.holderAddress
            ? data.holderAddress
            : submissionDetails.holderAddress
              ? submissionDetails.holderAddress
              : null,
          policyHolderCity: data.policyHolderCity
            ? data.policyHolderCity
            : submissionDetails.policyHolderCity
              ? submissionDetails.policyHolderCity
              : null,
          policyHolderState: data.policyHolderState
            ? data.policyHolderState
            : submissionDetails.policyHolderState
              ? submissionDetails.policyHolderState
              : null,
          policyHolderCountry: data.policyHolderCountry
            ? data.policyHolderCountry
            : submissionDetails.policyHolderCountry
              ? submissionDetails.policyHolderCountry
              : null,
          phoneNumber: data.phoneNumber
            ? data.phoneNumber
            : submissionDetails.phoneNumber
              ? submissionDetails.phoneNumber
              : null,
          policyHolderMailId: data.policyHolderMailId
            ? data.policyHolderMailId
            : submissionDetails.policyHolderMailId
              ? submissionDetails.policyHolderMailId
              : null,
          currentlyHaveMediClaim: data.currentlyHaveMediClaim
            ? data.currentlyHaveMediClaim
            : submissionDetails.currentlyHaveMediClaim
              ? submissionDetails.currentlyHaveMediClaim
              : null,
          commencementOfFirstInsuranceDate: data.commencementOfFirstInsuranceDate
            ? data.commencementOfFirstInsuranceDate
            : submissionDetails.commencementOfFirstInsuranceDate
              ? submissionDetails.commencementOfFirstInsuranceDate
              : null,
          mediClaimCompanyName: data.mediClaimCompanyName
            ? data.mediClaimCompanyName
            : submissionDetails.mediClaimCompanyName
              ? submissionDetails.mediClaimCompanyName
              : null,
          hospitalized: data.hospitalized
            ? data.hospitalized
            : submissionDetails.hospitalized
              ? submissionDetails.hospitalized
              : null,
          sumInsuresPerPolicy: data.sumInsuresPerPolicy
            ? data.sumInsuresPerPolicy
            : submissionDetails.sumInsuresPerPolicy
              ? submissionDetails.sumInsuresPerPolicy
              : null,
          hospitalizationDate: data.hospitalizationDate
            ? data.hospitalizationDate
            : submissionDetails.hospitalizationDate
              ? submissionDetails.hospitalizationDate
              : null,
          diagnosisDetails: data.diagnosisDetails
            ? data.diagnosisDetails
            : submissionDetails.diagnosisDetails
              ? submissionDetails.diagnosisDetails
              : null,
          hospitalizedCompany: data.hospitalizedCompany
            ? data.hospitalizedCompany
            : submissionDetails.hospitalizedCompany
              ? submissionDetails.hospitalizedCompany
              : null,
          isCoveredByOtherClaim: data.isCoveredByOtherClaim
            ? data.isCoveredByOtherClaim
            : submissionDetails.isCoveredByOtherClaim
              ? submissionDetails.isCoveredByOtherClaim
              : null,
          patientName: data.patientName
            ? data.patientName
            : submissionDetails.patientName
              ? submissionDetails.patientName
              : null,
          patientGender: data.patientGender
            ? data.patientGender
            : submissionDetails.patientGender
              ? submissionDetails.patientGender
              : null,
          patientAge: data.patientAge
            ? data.patientAge
            : submissionDetails.patientAge
              ? submissionDetails.patientAge
              : null,
          patientDob: data.patientDob
            ? data.patientDob
            : submissionDetails.patientDob
              ? submissionDetails.patientDob
              : null,
          relationship: data.relationship
            ? data.relationship
            : submissionDetails.relationship
              ? submissionDetails.relationship
              : null,
          relationshipDetail: data.relationshipDetail
            ? data.relationshipDetail
            : submissionDetails.relationshipDetail
              ? submissionDetails.relationshipDetail
              : null,
          occupation: data.occupation
            ? data.occupation
            : submissionDetails.occupation
              ? submissionDetails.occupation
              : null,
          occupationDetail: data.occupationDetail 
            ? data.occupationDetail 
            : submissionDetails.occupationDetail 
              ? submissionDetails.occupationDetail 
              : null,
          patientAddress: data.patientAddress 
            ? data.patientAddress 
            : submissionDetails.patientAddress 
              ? submissionDetails.patientAddress 
              : null,
          patientNoAndStreet: data.patientNoAndStreet
            ? data.patientNoAndStreet
            : submissionDetails.patientNoAndStreet
              ? submissionDetails.patientNoAndStreet
              : null,
          patientCity: data.patientCity
            ? data.patientCity 
            : submissionDetails.patientCity 
              ? submissionDetails.patientCity 
              : null,
          patientState: data.patientState 
            ? data.patientState 
            : submissionDetails.patientState 
              ? submissionDetails.patientState 
              : null,
          patientCountry: data.patientCountry 
            ? data.patientCountry 
            : submissionDetails.patientCountry 
              ? submissionDetails.patientCountry 
              : null,
          patientPhoneNumber: data.patientPhoneNumber 
            ? data.patientPhoneNumber 
            : submissionDetails.patientPhoneNumber 
              ? submissionDetails.patientPhoneNumber 
              : null,
          patientEmail: data.patientEmail 
            ? data.patientEmail 
            : submissionDetails.patientEmail 
              ? submissionDetails.patientEmail 
              : null,
          hospitalName: data.hospitalName 
            ? data.hospitalName 
            : submissionDetails.hospitalName 
              ? submissionDetails.hospitalName 
              : null,
          roomCategory: data.roomCategory 
            ? data.roomCategory 
            : submissionDetails.roomCategory 
              ? submissionDetails.roomCategory 
              : null,
          hospitalizationDueTo: data.hospitalizationDueTo 
            ? data.hospitalizationDueTo 
            : submissionDetails.hospitalizationDueTo 
              ? submissionDetails.hospitalizationDueTo 
              : null,
          dayOfInjury: data.dayOfInjury 
            ? data.dayOfInjury 
            : submissionDetails.dayOfInjury 
              ? submissionDetails.dayOfInjury 
              : null,
          dateOfAdmission: data.dateOfAdmission 
            ? data.dateOfAdmission 
            : submissionDetails.dateOfAdmission 
              ? submissionDetails.dateOfAdmission 
              : null,
          dateOfDischarge: data.dateOfDischarge 
            ? data.dateOfDischarge 
            : submissionDetails.dateOfDischarge 
              ? submissionDetails.dateOfDischarge 
              : null,
          injuryCause: data.injuryCause 
            ? data.injuryCause 
            : submissionDetails.injuryCause 
              ? submissionDetails.injuryCause 
              : null,
          medicoLegal: data.medicoLegal 
            ? data.medicoLegal 
            : submissionDetails.medicoLegal 
              ? submissionDetails.medicoLegal 
              : null,
          reportedTpPolice: data.reportedTpPolice 
            ? data.reportedTpPolice 
            : submissionDetails.reportedTpPolice 
              ? submissionDetails.reportedTpPolice 
              : null,
          mlcReport: data.mlcReport 
            ? data.mlcReport 
            : submissionDetails.mlcReport 
              ? submissionDetails.mlcReport 
              : null,
          systemOfMedicine: data.systemOfMedicine 
            ? data.systemOfMedicine 
            : submissionDetails.systemOfMedicine 
              ? submissionDetails.systemOfMedicine 
              : null,
          preHospitalizationExpenses: data.preHospitalizationExpenses 
            ? data.preHospitalizationExpenses 
            : submissionDetails.preHospitalizationExpenses 
              ? submissionDetails.preHospitalizationExpenses 
              : null,
          hospitalizationExpenses: data.hospitalizationExpenses 
            ? data.hospitalizationExpenses 
            : submissionDetails.hospitalizationExpenses 
              ? submissionDetails.hospitalizationExpenses 
              : null,
          postHospitalizationExpenses: data.postHospitalizationExpenses 
            ? data.postHospitalizationExpenses 
            : submissionDetails.postHospitalizationExpenses 
              ? submissionDetails.postHospitalizationExpenses 
              : null,
          healthCheckupCost: data.healthCheckupCost 
            ? data.healthCheckupCost 
            : submissionDetails.healthCheckupCost 
              ? submissionDetails.healthCheckupCost 
              : null,
          ambulanceCharges: data.ambulanceCharges 
            ? data.ambulanceCharges 
            : submissionDetails.ambulanceCharges 
              ? submissionDetails.ambulanceCharges 
              : null,
          othersCode: data.othersCode 
            ? data.othersCode 
            : submissionDetails.othersCode 
              ? submissionDetails.othersCode 
              : null,
          totalClaim: data.totalClaim 
            ? data.totalClaim 
            : submissionDetails.totalClaim 
              ? submissionDetails.totalClaim 
              : null,
          preHospitalizationPeriod: data.preHospitalizationPeriod 
            ? data.preHospitalizationPeriod 
            : submissionDetails.preHospitalizationPeriod 
              ? submissionDetails.preHospitalizationPeriod 
              : null,
          postHospitalizationPeriod: data.postHospitalizationPeriod 
            ? data.postHospitalizationPeriod 
            : submissionDetails.postHospitalizationPeriod 
              ? submissionDetails.postHospitalizationPeriod 
              : null,
          claimForDomiciliaryHospitalization: data.claimForDomiciliaryHospitalization 
            ? data.claimForDomiciliaryHospitalization 
            : submissionDetails.claimForDomiciliaryHospitalization 
              ? submissionDetails.claimForDomiciliaryHospitalization 
              : null,
          hospitalDailyCash: data.hospitalDailyCash 
            ? data.hospitalDailyCash 
            : submissionDetails.hospitalDailyCash 
              ? submissionDetails.hospitalDailyCash 
              : null,
          surgicalCash: data.surgicalCash 
            ? data.surgicalCash 
            : submissionDetails.surgicalCash 
              ? submissionDetails.surgicalCash 
              : null,
          criticalIllness: data.criticalIllness 
            ? data.criticalIllness 
            : submissionDetails.criticalIllness 
              ? submissionDetails.criticalIllness 
              : null,
          convalescence: data.convalescence 
            ? data.convalescence 
            : submissionDetails.convalescence 
              ? submissionDetails.convalescence 
              : null,
          lumsumBenefit: data.lumsumBenefit 
            ? data.lumsumBenefit 
            : submissionDetails.lumsumBenefit 
              ? submissionDetails.lumsumBenefit 
              : null,
          others: data.others 
            ? data.others 
            : submissionDetails.others 
              ? submissionDetails.others 
              : null,
          totalClaimValue: data.totalClaimValue 
            ? data.totalClaimValue 
            : submissionDetails.totalClaimValue 
              ? submissionDetails.totalClaimValue 
              : null,
          PanCardDetail: data.PanCardDetail
            ? data.PanCardDetail
            : submissionDetails.PanCardDetail
              ? submissionDetails.PanCardDetail
              : null,
          accountNo: data.accountNo
            ? data.accountNo
            : submissionDetails.accountNo
              ? submissionDetails.accountNo
              : null,
          bankName: data.bankName
            ? data.bankName
            : submissionDetails.bankName
              ? submissionDetails.bankName
              : null,
          chequeDetails: data.chequeDetails
            ? data.chequeDetails
            : submissionDetails.chequeDetails
              ? submissionDetails.chequeDetails
              : null,
          ifscCode: data.ifscCode
            ? data.ifscCode
            : submissionDetails.ifscCode
              ? submissionDetails.ifscCode
              : null,
          insuredPlace: data.insuredPlace
            ? data.insuredPlace 
            : submissionDetails.insuredPlace 
              ? submissionDetails.insuredPlace 
              : null,
          dateOfHospitalization: data.dateOfHospitalization 
            ? data.dateOfHospitalization 
            : submissionDetails.dateOfHospitalization 
              ? submissionDetails.dateOfHospitalization 
              : null,
          signatureOfInsures: data.signatureOfInsures 
            ? data.signatureOfInsures 
            : submissionDetails.signatureOfInsures 
              ? submissionDetails.signatureOfInsures 
              : null,
        },
      };
      let result = await updateClaimSubmission(reqData);
console.log("result",result)
      if (result) {
        this.setState({
          updateId: result._id,
          submissionDetails: result.submissionDetails,
        });
        return true;
      }

    } catch (error) {
      console.error('Error on: ', error);
    }
  };
  updatePrimaryInsuredDetails = async (data) => {
    let primaryDetails = this.submissionDetails(data);

    this.updateDisableCout(1);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    if (primaryDetails == true) {
      this.setState({ sectionBDisable: true });
    }
  };
  updateInsuranceHistoryDetails = async (data) => {
    let historyDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(2);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 200, animated: true });
    if (historyDetails == true) {
      this.setState({ sectionCDisable: true });
    }
  };
  updateInsuredPersonHospitalizedDetails = async (data) => {
    let personDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(3);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    if (personDetails == true) {
      this.setState({ sectionDDisable: true });
    }
  };
  updateHospitalization = async (data) => {
    let hospitalDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(4);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    if (hospitalDetails == true) {
      this.setState({ sectionEDisable: true });
    }
  };
  updateClaimDetails = async (data) => {
    let claimDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(5);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });

    if (claimDetails == true) {
      this.setState({ sectionFDisable: true });
    }
  };
  updateBillsEnclosedDetails = async (data) => {
    let billEnclosedDetails = this.submitData(data);
    this.updateDisableCout(6);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });

    if (billEnclosedDetails == true) {
      this.setState({ sectionGDisable: true });
    }
  };
  updatePrimaryInsuredBankAccountDetails = async (data) => {
    let bankAccDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(7);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1 });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });

    if (bankAccDetails == true) {
      this.setState({ sectionHDisable: true });
    }
  };
  updateDeclarationByInsuredDetails = async (data) => {
    let declarationDetails = this.updateSubmissionDetails(data);
    this.updateDisableCout(8);
    const { showCard } = this.state;
    this.setState({ showCard: showCard + 1, nextButtonEnable: false });
    this.scroll.scrollTo({ x: 0, y: 0, animated: true });
    if (declarationDetails == true) {
      this.setState({ nextButtonEnable: false });
    }
  };
  submitData = async (data) => {
    try {
      let reqData = {
        _id: this.state.updateId,
        billDetails: data,
      };
      let result = await updateClaimSubmission(reqData);
      if (result) {
        this.setState({
          updateId: result._id,
          bilEnclosedList: result.bilEnclosedList,
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const data = [
      { title: 'Details of primary insured', id: 1, disable: false },
      { title: 'Details of insurance history', id: 2, disable: false },
      { title: 'Details of insured person hospitalized', id: 3, disable: false },
      { title: 'Details of hospitalization', id: 4, disable: false },
      { title: 'Details of claim', id: 5, disable: false },
      { title: 'Details of bills enclosed', id: 6, disable: false },
      { title: 'Details of primary insured bank account', id: 7, disable: false },
      { title: 'Declaration by insured', id: 8, disable: false },
    ];
    const {
      showCard,
      show,
      claimListData,
      sectionADisable,
      sectionBDisable,
      sectionCDisable,
      sectionDDisable,
      sectionEDisable,
      sectionFDisable,
      sectionGDisable,
      sectionHDisable,
      disabled,
    } = this.state;
    return (
      <ScrollView
        style={{ padding: 10 }}
        ref={(c) => {
          this.scroll = c;
        }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
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
                      <PrimaryInsured
                        claimListData={claimListData}
                        updatePrimaryInsuredDetails={(data) =>
                          this.updatePrimaryInsuredDetails(data)
                        }
                      />
                    )}
                    {item.id === 2 && sectionBDisable && (
                      <InsuranceHistory
                        claimListData={claimListData}
                        updateInsuranceHistoryDetails={(data) =>
                          this.updateInsuranceHistoryDetails(data)
                        }
                      />
                    )}
                    {item.id === 3 && sectionCDisable && (
                      <InsuredPersonHospitalized
                        dropdownData={dropdownData}
                        Occupation={Occupation}
                        claimListData={claimListData}
                        updateInsuredPersonHospitalizedDetails={(data) =>
                          this.updateInsuredPersonHospitalizedDetails(data)
                        }
                      />
                    )}
                    {item.id === 4 && sectionDDisable && (
                      <HospitalizationDetails
                        RoomCategory={RoomCategory}
                        Hospitalization={Hospitalization}
                        InjuryCause={InjuryCause}
                        claimListData={claimListData}
                        TimeOfAdmissionHours={TimeOfAdmissionHours}
                        TimeOfAdmissionMinute={TimeOfAdmissionMinute}
                        TimeOfDischargeHours={TimeOfDischargeHours}
                        TimeOfDischargeMinute={TimeOfDischargeMinute}
                        updateHospitalization={(data) =>
                          this.updateHospitalization(data)
                        }
                      />
                    )}
                    {item.id === 5 && sectionEDisable && (
                      <ClaimDetail
                        claimListData={claimListData}
                        updateClaimDetails={(data) =>
                          this.updateClaimDetails(data)
                        }
                        ListOfData={ListOfData}
                      />
                    )}
                    {item.id === 6 && sectionFDisable && (
                      <BillEnclosedDeatil
                        updateBillsEnclosedDetails={(data) => this.updateBillsEnclosedDetails(data)}
                      />
                    )}

                    {item.id === 7 && sectionGDisable && (
                      <PrimaryInsuredBank
                        claimListData={claimListData}
                        updatePrimaryInsuredBankAccountDetails={(data) =>
                          this.updatePrimaryInsuredBankAccountDetails(data)
                        }
                      />
                    )}
                    {item.id === 8 && sectionHDisable && (
                      <DeclarationByInsured
                        claimListData={claimListData}
                        updateDeclarationByInsuredDetails={(data) =>
                          this.updateDeclarationByInsuredDetails(data)
                        }
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
                        height: 60,
                        alignItems: 'center',
                      }}
                      onPress={() => this.toggleData(index, 'DOWN')}>
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
                </View>
              )}
            </View>
          )}
        />
        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.submit_ButtonStyle}
            onPress={() => {
              this.props.navigation.navigate('SubmitClaimPageTwo', {
                dataId: this.state.updateId,
                submissionDetails: this.state.submissionDetails,
              });
            }}
            disabled={this.state.nextButtonEnable == true ? true : false}>
            <Text style={{ color: '#fff' }}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default SubmitClaim;
