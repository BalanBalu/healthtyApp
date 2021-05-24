import React, {PureComponent} from 'react';
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
import {TouchableOpacity, FlatList} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {primaryColor} from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {subTimeUnit, addTimeUnit, formatDate} from '../../../../setup/helpers';
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
import styles from '../Styles'


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
  {text: 'Claim form duly signed'},
  {text: 'Copy of the claim intimation, if any'},
  {text: 'Hospital main bill'},
  {text: 'Hospital Break-up bill'},
  {text: 'Hospital bill payment receipt'},
  {text: 'Hospital Discharge Summary'},
  {text: 'ECH'},
  {text: 'Doctor request for investigation'},
  {text: 'Doctor Prescription'},
  {text: 'Pharmacy Bill'},
  {text: 'Others'},
  {text: 'Investigation reports including(including CT/MRI/USG/HPE)'},
];

class SubmitClaim extends PureComponent {
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
      claimListData: this.props.navigation.getParam('claimListData') || null,
      sectionADisable: true,
      sectionBDisable: false,
      sectionCDisable: false,
      sectionDDisable: false,
      sectionEDisable: false,
      sectionFDisable: true,
      sectionGDisable: false,
      sectionHDisable: false,
      updateId: '',
    };
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

  submissionDetails = async (data) => {
    try {
      const {claimListData} = this.state;
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
        this.setState({
          sectionBDisable: true,
          updateId: result._id,
          submissionDetails: result.submissionDetails,
        });
      }
    } catch (error) {
      console.error('Error on: ', error);
    }
  };





  updateSubmissionDetails = async (data) => {
    try {
      console.log('data', data);
      const {submissionDetails} = this.state;
      let reqData = {
        _id: this.state.updateId,
        submissionDetails: {
          certificateNumber: data.certificateNo?data.certificateNo:submissionDetails.certificateNo?submissionDetails.certificateNo:null,
          tpaIdNo: data.tpaIdNo?data.tpaIdNo:submissionDetails.tpaIdNo?submissionDetails.tpaIdNo:null,
          policyHolderFirstName: data.policyHolderFirstName?data.policyHolderFirstName:submissionDetails.policyHolderFirstName?submissionDetails.policyHolderFirstName:null,
          policyHolderMiddleName: data.policyHolderMiddleName?data.policyHolderMiddleName:submissionDetails.policyHolderMiddleName?submissionDetails.policyHolderMiddleName:null,
          policyHolderLastName: data.policyHolderLastName?data.policyHolderLastName:submissionDetails.policyHolderLastName?submissionDetails.policyHolderLastName:null,
          policyHolderPincode: data.policyHolderPincode?data.policyHolderPincode:submissionDetails.policyHolderPincode?submissionDetails.policyHolderPincode:null,
          noAndStreet: data.noAndStreet?data.noAndStreet:submissionDetails.noAndStreet?submissionDetails.noAndStreet:null,
          holderAddress: data.holderAddress?data.holderAddress:submissionDetails.holderAddress?submissionDetails.holderAddress:null,
          policyHolderCity: data.policyHolderCity?data.policyHolderCity:submissionDetails.policyHolderCity?submissionDetails.policyHolderCity:null,
          policyHolderState: data.policyHolderState?data.policyHolderState:submissionDetails.policyHolderState?submissionDetails.policyHolderState:null,
          policyHolderCountry: data.policyHolderCountry?data.policyHolderCountry:submissionDetails.policyHolderCountry?submissionDetails.policyHolderCountry:null,
          phoneNumber: data.phoneNumber?data.phoneNumber:submissionDetails.phoneNumber?submissionDetails.phoneNumber:null,
          policyHolderMailId: data.policyHolderMailId?data.policyHolderMailId:submissionDetails.policyHolderMailId?submissionDetails.policyHolderMailId:null,
          currentlyHaveMediClaim: data.currentlyHaveMediClaim?data.currentlyHaveMediClaim:submissionDetails.currentlyHaveMediClaim?submissionDetails.currentlyHaveMediClaim:null,
          commencementOfFirstInsuranceDate: data.commencementOfFirstInsuranceDate?data.commencementOfFirstInsuranceDate:submissionDetails.commencementOfFirstInsuranceDate?submissionDetails.commencementOfFirstInsuranceDate:null,
          mediClaimCompanyName: data.mediClaimCompanyName?data.mediClaimCompanyName:submissionDetails.mediClaimCompanyName?submissionDetails.mediClaimCompanyName:null,
          hospitalized: data.hospitalized?data.hospitalized:submissionDetails.hospitalized?submissionDetails.hospitalized:null,
          sumInsuresPerPolicy: data.sumInsuresPerPolicy?data.sumInsuresPerPolicy:submissionDetails.sumInsuresPerPolicy?submissionDetails.sumInsuresPerPolicy:null,
          hospitalizationDate: data.hospitalizationDate?data.hospitalizationDate:submissionDetails.hospitalizationDate?submissionDetails.hospitalizationDate:null,
          diagnosisDetails: data.diagnosisDetails?data.diagnosisDetails:submissionDetails.diagnosisDetails?submissionDetails.diagnosisDetails:null,
          hospitalizedCompany: data.hospitalizedCompany?data.hospitalizedCompany:submissionDetails.hospitalizedCompany?submissionDetails.hospitalizedCompany:null,
          isCoveredByOtherClaim: data.isCoveredByOtherClaim?data.isCoveredByOtherClaim:submissionDetails.isCoveredByOtherClaim?submissionDetails.isCoveredByOtherClaim:null,
          patientName: data.patientName?data.patientName:submissionDetails.patientName?submissionDetails.patientName:null,
          patientGender: data.patientGender?data.patientGender:submissionDetails.patientGender?submissionDetails.patientGender:null,
          patientAge: data.patientAge?data.patientAge:submissionDetails.patientAge?submissionDetails.patientAge:null,
          patientDob: data.patientDob?data.patientDob:submissionDetails.patientDob?submissionDetails.patientDob:null,
          relationship: data.relationship?data.relationship:submissionDetails.relationship?submissionDetails.relationship:null,
          relationshipDetail: data.relationshipDetail?data.relationshipDetail:submissionDetails.relationshipDetail?submissionDetails.relationshipDetail:null,
          occupation: data.occupation?data.occupation:submissionDetails.occupation?submissionDetails.occupation:null,
          occupationDetail: data.occupationDetailNo?data.occupationDetailNo:submissionDetails.occupationDetailNo?submissionDetails.occupationDetailNo:null,
          patientAddress: data.patientAddressNo?data.patientAddressNo:submissionDetails.patientAddressNo?submissionDetails.patientAddressNo:null,
          patientNoAndStreet: data.patientNoAndStreetNo?data.patientNoAndStreetNo:submissionDetails.patientNoAndStreetNo?submissionDetails.patientNoAndStreetNo:null,
          patientCity: data.patientCityNo?data.patientCityNo:submissionDetails.patientCityNo?submissionDetails.patientCityNo:null,
          patientState: data.patientStateNo?data.patientStateNo:submissionDetails.patientStateNo?submissionDetails.patientStateNo:null,
          patientCountry: data.patientCountryNo?data.patientCountryNo:submissionDetails.patientCountryNo?submissionDetails.patientCountryNo:null,
          patientPhoneNumber: data.patientPhoneNumberNo?data.patientPhoneNumberNo:submissionDetails.patientPhoneNumberNo?submissionDetails.patientPhoneNumberNo:null,
          patientEmail: data.patientEmailNo?data.patientEmailNo:submissionDetails.patientEmailNo?submissionDetails.patientEmailNo:null,
          hospitalName: data.hospitalNameNo?data.hospitalNameNo:submissionDetails.hospitalNameNo?submissionDetails.hospitalNameNo:null,
          roomCategory: data.roomCategoryNo?data.roomCategoryNo:submissionDetails.roomCategoryNo?submissionDetails.roomCategoryNo:null,
          hospitalizationDueTo: data.hospitalizationDueToNo?data.hospitalizationDueToNo:submissionDetails.hospitalizationDueToNo?submissionDetails.hospitalizationDueToNo:null,
          dayOfInjury: data.dayOfInjuryNo?data.dayOfInjuryNo:submissionDetails.dayOfInjuryNo?submissionDetails.dayOfInjuryNo:null,
          dateOfAdmission: data.dateOfAdmissionNo?data.dateOfAdmissionNo:submissionDetails.dateOfAdmissionNo?submissionDetails.dateOfAdmissionNo:null,
          dateOfDischarge: data.dateOfDischargeNo?data.dateOfDischargeNo:submissionDetails.dateOfDischargeNo?submissionDetails.dateOfDischargeNo:null,
          injuryCause: data.injuryCauseNo?data.injuryCauseNo:submissionDetails.injuryCauseNo?submissionDetails.injuryCauseNo:null,
          medicoLegal: data.medicoLegalNo?data.medicoLegalNo:submissionDetails.medicoLegalNo?submissionDetails.medicoLegalNo:null,
          reportedTpPolice: data.reportedTpPoliceNo?data.reportedTpPoliceNo:submissionDetails.reportedTpPoliceNo?submissionDetails.reportedTpPoliceNo:null,
          mlcReport: data.mlcReportNo?data.mlcReportNo:submissionDetails.mlcReportNo?submissionDetails.mlcReportNo:null,
          systemOfMedicine: data.systemOfMedicineNo?data.systemOfMedicineNo:submissionDetails.systemOfMedicineNo?submissionDetails.systemOfMedicineNo:null,
          preHospitalizationExpenses: data.preHospitalizationExpensesNo?data.preHospitalizationExpensesNo:submissionDetails.preHospitalizationExpensesNo?submissionDetails.preHospitalizationExpensesNo:null,
          hospitalizationExpenses: data.hospitalizationExpensesNo?data.hospitalizationExpensesNo:submissionDetails.hospitalizationExpensesNo?submissionDetails.hospitalizationExpensesNo:null,
          postHospitalizationExpenses: data.postHospitalizationExpensesNo?data.postHospitalizationExpensesNo:submissionDetails.postHospitalizationExpensesNo?submissionDetails.postHospitalizationExpensesNo:null,
          healthCheckupCost: data.healthCheckupCostNo?data.healthCheckupCostNo:submissionDetails.healthCheckupCostNo?submissionDetails.healthCheckupCostNo:null,
          ambulanceCharges: data.ambulanceChargesNo?data.ambulanceChargesNo:submissionDetails.ambulanceChargesNo?submissionDetails.ambulanceChargesNo:null,
          othersCode: data.othersCodeNo?data.othersCodeNo:submissionDetails.othersCodeNo?submissionDetails.othersCodeNo:null,
          totalClaim: data.totalClaimNo?data.totalClaimNo:submissionDetails.totalClaimNo?submissionDetails.totalClaimNo:null,
          preHospitalizationPeriod: data.preHospitalizationPeriodNo?data.preHospitalizationPeriodNo:submissionDetails.preHospitalizationPeriodNo?submissionDetails.preHospitalizationPeriodNo:null,
          postHospitalizationPeriod: data.postHospitalizationPeriodNo?data.postHospitalizationPeriodNo:submissionDetails.postHospitalizationPeriodNo?submissionDetails.postHospitalizationPeriodNo:null,
          claimForDomiciliaryHospitalization: data.claimForDomiciliaryHospitalizationNo?data.claimForDomiciliaryHospitalizationNo:submissionDetails.claimForDomiciliaryHospitalizationNo?submissionDetails.claimForDomiciliaryHospitalizationNo:null,
          hospitalDailyCash: data.hospitalDailyCashNo?data.hospitalDailyCashNo:submissionDetails.hospitalDailyCashNo?submissionDetails.hospitalDailyCashNo:null,
          surgicalCash: data.surgicalCashNo?data.surgicalCashNo:submissionDetails.surgicalCashNo?submissionDetails.surgicalCashNo:null,
          criticalIllness: data.criticalIllnessNo?data.criticalIllnessNo:submissionDetails.criticalIllnessNo?submissionDetails.criticalIllnessNo:null,
          convalescence: data.convalescenceNo?data.convalescenceNo:submissionDetails.convalescenceNo?submissionDetails.convalescenceNo:null,
          lumsumBenefit: data.lumsumBenefitNo?data.lumsumBenefitNo:submissionDetails.lumsumBenefitNo?submissionDetails.lumsumBenefitNo:null,
          others: data.othersNo?data.othersNo:submissionDetails.othersNo?submissionDetails.othersNo:null,
          totalClaimValue: data.totalClaimValueNo?data.totalClaimValueNo:submissionDetails.totalClaimValueNo?submissionDetails.totalClaimValueNo:null,
          PanCardDetail: data.PanCardDetailNo?data.PanCardDetailNo:submissionDetails.PanCardDetailNo?submissionDetails.PanCardDetailNo:null,
          accountNo: data.accountNoNo?data.accountNoNo:submissionDetails.accountNoNo?submissionDetails.accountNoNo:null,
          bankName: data.bankNameNo?data.bankNameNo:submissionDetails.bankNameNo?submissionDetails.bankNameNo:null,
          chequeDetails: data.chequeDetailsNo?data.chequeDetailsNo:submissionDetails.chequeDetailsNo?submissionDetails.chequeDetailsNo:null,
          ifscCode: data.ifscCodeNo?data.ifscCodeNo:submissionDetails.ifscCodeNo?submissionDetails.ifscCodeNo:null,
          insuredPlace: data.insuredPlaceNo?data.insuredPlaceNo:submissionDetails.insuredPlaceNo?submissionDetails.insuredPlaceNo:null,
          dateOfHospitalization: data.dateOfHospitalizationNo?data.dateOfHospitalizationNo:submissionDetails.dateOfHospitalizationNo?submissionDetails.dateOfHospitalizationNo:null,
          signatureOfInsures: data.signatureOfInsuresNo?data.signatureOfInsuresNo:submissionDetails.signatureOfInsuresNo?submissionDetails.signatureOfInsuresNo:null,
        },
      };
      console.log('reqData', reqData);
      let result = await updateClaimSubmission(reqData);
      console.log('result', result);
      console.log('result', result._id);

      if (result) {
        this.setState({
          updateId: result._id,
          submissionDetails: result.submissionDetails,
        });
        return true;
      }

      console.log('updateId', this.state.updateId);

    } catch (error) {
      console.error('Error on: ', error);
    }
  };
  updatePrimaryInsuredDetails = async (data) => {
  }
  updateInsuranceHistoryDetails = async (data) => {
    let historyDetails=this.updateSubmissionDetails(data)
    if(historyDetails==true){
      this.setState({sectionCDisable:true})
    }
  }
  updateInsuredPersonHospitalizedDetails = async (data) => {
    let personDetails=this.updateSubmissionDetails(data)
    if(personDetails==true){
      this.setState({sectionDDisable:true})
    }
  }
  updateHospitalization = async (data) => {
    let hospitalDetails=this.updateSubmissionDetails(data)
    if(hospitalDetails==true){
      this.setState({sectionEDisable:true})
    }
  }
  updateClaimDetails = async (data) => {
    let claimDetails=this.updateSubmissionDetails(data)
    if(claimDetails==true){
      this.setState({sectionFDisable:true})
    }
  }
  updateBillsEnclosedDetails = async (data) => {
    let billEnclosedDetails=this.updateSubmissionDetails(data)
    if(billEnclosedDetails==true){
      this.setState({sectionGDisable:true})
    }
  }
  updatePrimaryInsuredBankAccountDetails = async (data) => {
    let bankAccDetails=this.updateSubmissionDetails(data)
    if(personDetails==true){
      this.setState({sectionHDisable:true})
    }
  }
  updateDeclarationByInsuredDetails = async (data) => {
    let declarationDetails=this.updateSubmissionDetails(data)
    // if(declarationDetails==true){
    //   this.setState({sectionHDisable:true})
    // }
  }

  render() {
    const data = [
      {title: 'Details of primary insured', id: 1, disable: false},
      {title: 'Details of insurance history', id: 2, disable: false},
      {title: 'Details of insured person hospitalized', id: 3, disable: false},
      {title: 'Details of hospitalization', id: 4, disable: false},
      {title: 'Details of claim', id: 5, disable: false},
      {title: 'Details of bills enclosed', id: 6, disable: false},
      {title: 'Details of primary insured bank account', id: 7, disable: false},
      {title: 'Declaration by insured', id: 8, disable: false},
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
    } = this.state;
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
                      onPress={() => {
                        this.setState({showCard: true});
                      }}>
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
                        <PrimaryInsured
                          claimListData={claimListData}
                          submissionDetails={(data) =>
                            this.submissionDetails(data)
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
                          isSelected={this.state.isSelected}
                          isVisiblePicker={this.state.isVisibleDatePicker}
                          selectedAdmissionDate={
                            this.state.selectedAdmissionDate
                          }
                          ListOfData={ListOfData}
                          checkBoxClick={this.state.checkBoxClick}
                        />
                      )}
                      {item.id === 6 && sectionFDisable && (
                        <BillEnclosedDeatil
                          isSelected={this.state.isSelected}
                          isVisiblePicker={this.state.isVisibleDatePicker}
                          selectedAdmissionDate={
                            this.state.selectedAdmissionDate
                          }
                          onPressConfirmDateValue={this.onPressConfirmDateValue}
                          oncancelThePicker={this.oncancelThePicker}
                          openPicker={this.openPicker}
                          updateBillsEnclosedDetails={(data)=>this.updateBillsEnclosedDetails(data)}
                        />
                      )}
                      {item.id === 7 && sectionGDisable && (
                        <PrimaryInsuredBank
                          claimListData={claimListData}
                          updatePrimaryInsuredBankAccountDetails={(data) =>
                            this.updatePrimaryInsuredBankAccountDetails(data)
                          }
                          isSelected={this.state.isSelected}
                          isVisiblePicker={this.state.isVisibleDatePicker}
                          selectedAdmissionDate={
                            this.state.selectedAdmissionDate
                          }
                        />
                      )}
                      {item.id === 8 && sectionHDisable && (
                        <DeclarationByInsured
                          claimListData={claimListData}
                          updateDeclarationByInsuredDetails={(data) =>
                            this.updateDeclarationByInsuredDetails(data)
                          }
                          isSelected={this.state.isSelected}
                          isVisiblePicker={this.state.isVisibleDatePicker}
                          selectedAdmissionDate={
                            this.state.selectedAdmissionDate
                          }
                          onPressConfirmDateValue={this.onPressConfirmDateValue}
                          oncancelThePicker={this.oncancelThePicker}
                          openPicker={this.openPicker}
                        />
                      )}
                    </View>
                  </Card>
                ) : (
                  <Card>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        padding: 10,
                        height: 60,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        this.setState({showCard: false});
                      }}>
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
              </View>
            )}
          />
          <View style={styles.ButtonView}>
               <TouchableOpacity style={styles.submit_ButtonStyle} onPress={() =>{ this.props.navigation.navigate('SubmitClaimPageTwo')}}>
                   <Text style={{ color: "#fff" }}>Next</Text>
                </TouchableOpacity>
            </View>
        </Content>
      </Container>
    );
  }
}

export default SubmitClaim;
