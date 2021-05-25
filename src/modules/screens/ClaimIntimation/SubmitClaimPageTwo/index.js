import React, { PureComponent } from 'react';
import { Text, View, Container, Content, Card,Toast } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import HospitalDetail from './HospitalDetail'
import PatientAdmittedDetails from './PatientAdmittedDetails'
import ClaimDetails from './ClaimDetails'
import DocumentSubmitted from './DocumentSubmitted'
import NonNetworkHospital from './NonNetworkHospital'
import DeclarationByHospital from './DeclarationByHospital'
import AttachmentDetails from './AttachmentDetails'
import {
  createClaimSubmission,
  getListByTpaCode,
  updateClaimSubmission,
} from '../../../providers/corporate/corporate.actions';
const dropdownData = [
  'Select your Item',
  'Emergency',
  'Planned',
  'Day Care',
  'Maternity',
];
const TimeOfAdmissionHours = [
  'Select',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23
  
];
const TimeOfAdmissionMinute = [
  'Select',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
  33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60
  
];

const TimeOfDischargeHours = [
  'Select',0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23
  
];
const TimeOfDischargeMinute = [
  'Select',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,
  33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60
  
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
  { text: 'Claim form duly signed', },
  { text: 'CT/MR/USG/HPE investigation reports' },
  { text: 'Copy of the Pre-authorization approval letter' },
  { text: 'Copy of Photo ID Card of patient Verified by hospital' },
  { text: 'Hospital Discharge summary' },
  { text: 'Operation Theatre Notes' },
  { text: 'Hospital main bill' },
  { text: 'Any other, please specify' },
  { text: 'Investigation reports' },
  { text: 'Original Pre-authorization request' },
  { text: 'Doctor’s reference slip for investigation' },
  { text: 'ECG' },
  { text: 'Pharmacy bills' },
  { text: 'MLC reports & Police FIR' },
  { text: 'Hospital break-up bill' },

];

class SubmitClaimPageTwo extends PureComponent {
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
      checkBoxClick: false,
      updateId:this.props.navigation.getParam('dataId') || null,
    }
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
      this.setState({ isVisibleDatePicker: false, selectedAdmissionDate: date });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

oncancelThePicker =()=>{ 
  const{isVisibleDatePicker}= this.state
  this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
}

openPicker =()=>{
  const{isVisibleDatePicker}= this.state
  this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
}

updateSubmissionDetails = async (data) => {
  try {
    console.log('data', data);
    const {submissionDetails} = this.state;
    let reqData = {
      _id: this.state.updateId,
      submissionDetails: data,
    };
    console.log('reqData', reqData);
    let result = await updateClaimSubmission(reqData);
    console.log('result', result);
    console.log('result', result._id);

    if (result) {
      Toast.show({
        text: 'Successfully Saved the Details',
        duration: 3000,
        type: "success"
      })
      this.setState({sectionCDisable: true, updateId: result._id});
    }
    console.log('updateId', this.state.updateId);
  } catch (error) {
    console.error('Error on: ', error);
  }
};

  render() {
    const data = [
      { title: 'Details of hospital', id: 1 },
      { title: 'Details of patient admitted', id: 2 },
      { title: 'Details of claim', id: 3 },
      { title: 'Claim documents submitted - checklist', id: 4 },
      { title: 'Additional details in case of non network hospital(only fill in case of non network hospital)', id: 5 },
      { title: 'Declaration by hospital', id: 6 },
      { title: 'Attachment Details', id: 7 },
      ]
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
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10, backgroundColor: primaryColor }}   onPress={() => this.toggleData(index, 'UP')}>
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
                      {item.id === 1 && <HospitalDetail 
                           updateSubmissionDetails={(data) =>
                            this.updateSubmissionDetails(data)
                          }
                      />}
                     
                      {item.id === 2 && < PatientAdmittedDetails
                        dropdownData={dropdownData}
                        dischargeTimeStatus={dischargeTimeStatus}
                        TimeOfAdmissionHours={TimeOfAdmissionHours}
                        TimeOfAdmissionMinute={TimeOfAdmissionMinute}
                        TimeOfDischargeHours={TimeOfDischargeHours}
                        TimeOfDischargeMinute={TimeOfDischargeMinute}
                        updateSubmissionDetails={(data) =>
                          this.updateSubmissionDetails(data)
                        }
                        />
                      }
                       {item.id === 3 && <ClaimDetails
                        isSelected={this.state.isSelected}
                        />
                      }
                      {item.id === 4 && <DocumentSubmitted
                        ListOfData={ListOfData}
                        checkBoxClick={this.state.checkBoxClick}
                        />
                      }
                      {item.id === 5 && <NonNetworkHospital
                        isSelected={this.state.isSelected}
                        />
                      }
                      {item.id === 6 && <DeclarationByHospital
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate}
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}

                        />
                      }
                      {item.id === 7 && <AttachmentDetails/>
                      }
                    </View>
                  </Card>) : (
                   
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

              </View>
            )}
          />
        </Content>
      </Container>
    )
  }
}


export default SubmitClaimPageTwo