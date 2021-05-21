import React, { PureComponent } from 'react';
import { Text, View, Container, Content, Card, Item, Input, Picker, Radio, Icon, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, addTimeUnit, formatDate } from '../../../../setup/helpers';
import PrimaryInsured from './PrimaryInsured'
import InsuranceHistory from './InsuranceHistory'
import InsuredPersonHospitalized from './InsuredPersonHospitalized'
import HospitalizationDetails from './HospitalizationDetails'
import ClaimDetail from './ClaimDetail'
import BillEnclosedDeatil from './BillEnclosedDetail'
import PrimaryInsuredBank from './PrimaryInsuredBank'
import DeclarationByInsured from './DeclarationByInsured'
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

oncancelThePicker =()=>{ 
  const{isVisibleDatePicker}= this.state
  this.setState({ isVisibleDatePicker: !isVisibleDatePicker })
}

openPicker =()=>{
  const{isVisibleDatePicker}= this.state
  this.setState({ isVisibleDatePicker: !isVisibleDatePicker });
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
                      {item.id === 1 && <PrimaryInsured />}
                      {item.id === 2 && <InsuranceHistory
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} 
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}

                        />
                      }
                      {item.id === 3 && <InsuredPersonHospitalized
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} 
                        dropdownList={this.state.dropdownList}
                        dropdownData={dropdownData}
                        Occupation={Occupation}
                        OccupationText={this.state.Occupation}
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}

                        />
                      }
                      {item.id === 4 && <HospitalizationDetails
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} 
                        RoomCategory = {RoomCategory}
                        RoomCategoryText={this.state.RoomCategory}
                        Hospitalization={Hospitalization}
                        HospitalizationText={this.state.Hospitalization}
                        InjuryCause={InjuryCause}
                        InjuryCauseText={this.state.InjuryCause}
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}



                        />
                      }
                      {item.id === 5 && <ClaimDetail
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} 
                        ListOfData={ListOfData}
                        checkBoxClick={this.state.checkBoxClick}
                        />
                      }
                      {item.id === 6 && <BillEnclosedDeatil
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate}
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}

                        />
                      }
                      {item.id === 7 && <PrimaryInsuredBank
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} />
                      }
                      {item.id === 8 && <DeclarationByInsured
                        isSelected={this.state.isSelected}
                        isVisiblePicker={this.state.isVisibleDatePicker}
                        selectedAdmissionDate={this.state.selectedAdmissionDate} 
                        onPressConfirmDateValue={this.onPressConfirmDateValue}
                        oncancelThePicker={this.oncancelThePicker}
                        openPicker={this.openPicker}
                        />
                      }
                    </View>
                  </Card>) : (
                  <Card>
                    <TouchableOpacity style={{ justifyContent: 'center', padding: 10, height: 60, alignItems: 'center' }} onPress={() => { this.setState({ showCard: false }) }}>
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