import React, { PureComponent } from 'react';
import { Text, View, Input,Icon, } from 'native-base';
import { TouchableOpacity, } from 'react-native'
import styles from '../Styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';



const BillEnclosedDeatil = ({ isSelected, isVisiblePicker, selectedAdmissionDate, onPressConfirmDateValue, oncancelThePicker, openPicker }) => {

    return (
        <View style={{ padding: 10, marginTop: 10,marginBottom:20 }}>
            <View style={styles.form_field_view}>
                <Text style={[styles.form_field_inline_label]}>SL No</Text>
                <Text style={[styles.form_field, { paddingTop: 10, paddingLeft: 10 }]}>1</Text>
            </View>
            <View style={styles.form_field_view}>
                <Text style={[styles.form_field_inline_label]}>BILL No</Text>
                <Input
                    placeholder="Enter BILL No "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                    keyboardType={'number-pad'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <View style={[styles.form_field_inline_label, { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12 }}>Date of</Text>

                    <Text style={{ fontSize: 12 }}>hospitalization</Text>

                </View>
                <TouchableOpacity style={[styles.form_field, { flexDirection: 'row' }]} onPress={openPicker}>
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
            </View>
            <View style={styles.form_field_view}>
                <Text style={[styles.form_field_inline_label]}>Inssured by</Text>
                <Input
                    placeholder="Enter Inssured by details "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                    keyboardType={'number-pad'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <Text style={[styles.form_field_inline_label]}>Towards</Text>
                <Input
                    placeholder="Enter Towards details "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                    keyboardType={'number-pad'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <View style={styles.form_field_view}>
                <Text style={[styles.form_field_inline_label]}>AMOUNT(RS)</Text>
                <Input
                    placeholder="Enter Amount "
                    placeholderTextColor={'#CDD0D9'}
                    returnKeyType={'next'}
                    //   value={employeeId}
                    style={styles.form_field}
                    keyboardType={'number-pad'}
                //   editable={employeeId == undefined ? true : false}
                //   onChangeText={(enteredEmployeeIdText) =>
                //     this.setState({employeeId: enteredEmployeeIdText})
                //   }
                />
            </View>
            <TouchableOpacity 
                style={{ position: 'absolute', right: 0, bottom: -18, backgroundColor: '#128283', borderRadius: 10 / 2, paddingLeft: 2, paddingRight: 2, paddingTop: 5, paddingBottom: 5, flexDirection: 'row', alignItems: 'center', marginRight: 10 ,}}>
                <Icon name="md-add" style={{ fontSize: 15, color: '#fff' }} />
                 <Text style={{ fontSize: 10, fontFamily: 'opensans-bold', color: '#fff', }}>Add Next Table</Text>
            </TouchableOpacity>
        </View>

    );
}


export default BillEnclosedDeatil