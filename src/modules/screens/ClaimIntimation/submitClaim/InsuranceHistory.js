import React, { PureComponent } from 'react';
import { Text, View, Item, Input, Radio, Icon,  } from 'native-base';
import { TouchableOpacity,  } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';



const InsuranceHistory = ({ isSelected, isVisiblePicker, selectedAdmissionDate, onPressConfirmDateValue, oncancelThePicker, openPicker }) => {

    return (
        <View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Currently have mediclaim?<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>commencement of first insurance without break.<Text style={{ color: 'red' }}>*</Text></Text>

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
                                    : 'Date of Admission'}
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
                    <Text style={styles.text}>If, yes company name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter full name of Insurance company"
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
                    <Text style={styles.text}>Have you been hospitalized in the last four years since inception of the confract?<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Sum Insured<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter fSum Insured in RS"
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
                    <Text style={styles.text}>Diagnosis<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter the Diagnosis details"
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
                    <Text style={styles.text}>If, yes company name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter the full name of Insurance company"
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
                    <Text style={styles.text}>Previously covered by other mediclaim?<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Yes</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>No</Text>

                        </View>
                    </Item>
                </Col>
            </Row>
            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} >
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default InsuranceHistory