import React, { PureComponent } from 'react';
import { Text, View, Item, Input, Icon, } from 'native-base';
import { TouchableOpacity, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';



const DeclarationByInsured = ({ isSelected, isVisiblePicker, selectedAdmissionDate, onPressConfirmDateValue, oncancelThePicker, openPicker }) => {

    return (
        <View>
            <Text style={{ padding: 8, fontSize: 14 }}>I hereby declare that the information furnished in the claim form is true & correct to the best of my knowledge and belief. If I have made any false or untrue statement. suppression or concealent of any material fact with respect to questions asked in relation to this claim, my right to claim reimbrusement shall be forfeited1 I .:ilso consent & authorize TPA / insurance Company, to seek necessary medical information/ documents frorn any hospital/ Medical Practitioner who has attended on the person against whom this claim is made. I hereby declare that I have included all the bills / receipts for the purpose of this claim & that I will not be making any supplementary daim except the pre/post-hospitalization claim, if any.
              </Text>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Place<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Place "
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Date of hospitalization<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={openPicker}>
                            <Icon
                                name="md-calendar"
                                style={styles.calenderStyle}
                            />
                            <Text
                                style={
                                    selectedAdmissionDate
                                        ? styles.timeplaceHolder
                                        : styles.afterTimePlaceholder
                                }>
                                {selectedAdmissionDate
                                    ? formatDate(selectedAdmissionDate, 'DD/MM/YYYY')
                                    : 'Date of hospitalization'}
                            </Text>
                            <DateTimePicker
                                mode={'date'}
                                minimumDate={subTimeUnit(new Date(), 7, 'days')}
                                maximumDate={new Date()}
                                value={selectedAdmissionDate}
                                isVisible={isVisiblePicker}
                                onConfirm={onPressConfirmDateValue}
                                onCancel={oncancelThePicker}
                            />
                        </TouchableOpacity>
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Signature of insured<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Signature of insured "
                            placeholderTextColor={'#CDD0D9'}
                            returnKeyType={'next'}
                            //   value={employeeId}
                            keyboardType={'number-pad'}
                        //   editable={employeeId == undefined ? true : false}
                        //   onChangeText={(enteredEmployeeIdText) =>
                        //     this.setState({employeeId: enteredEmployeeIdText})
                        //   }
                        />
                    </Item>
                </Col>
            </Row>
            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} >
                    <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default DeclarationByInsured