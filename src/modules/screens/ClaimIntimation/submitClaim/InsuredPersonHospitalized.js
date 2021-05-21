import React, { PureComponent } from 'react';
import { Text, View,  Item, Input, Picker, Radio, Icon, } from 'native-base';
import { TouchableOpacity,  } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';



const InsuredPersonHospitalized = ({ isSelected, isVisiblePicker, selectedAdmissionDate, dropdownList, dropdownData, OccupationText, Occupation, onPressConfirmDateValue, oncancelThePicker, openPicker }) => {

    return (
        <View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Name"
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
                    <Text style={styles.text}>Gender<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
                        <Radio
                            color={primaryColor}
                            selectedColor={primaryColor}
                            standardStyle={true}
                            selected={isSelected === true}
                            onPress={() => this.setState({ isSelected: true })}
                        />
                        <Text style={styles.text}>Male</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>Female</Text>

                        </View>
                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={isSelected === false}
                                onPress={() => this.setState({ isSelected: false })}
                            />
                            <Text style={styles.text}>Other</Text>

                        </View>
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>AGE(MA_ID)NO<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter age of the patient"
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
                    <Text style={styles.text}>Date Of Birth<Text style={{ color: 'red' }}>*</Text></Text>

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
                                    : 'Enter Date of birth of patient'}
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
                    <Text style={styles.text}>Relation to primary Insured<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Picker
                            mode="dropdown"
                            placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                            iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                            textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                            note={false}
                            itemStyle={{
                                paddingLeft: 10,
                                fontSize: 16,
                                fontFamily: 'Helvetica-Light',
                                color: "#fff",
                            }}
                            itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                            style={{ width: "100%", color: "#000", }}
                            onValueChange={(sample) => { this.setState({ dropdownList: sample }) }}
                            selectedValue={dropdownList}
                            testID="editJobType"
                        >

                            {dropdownData.map((value, key) => {

                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                />
                            })
                            }
                        </Picker>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If other, details<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Specify your Relation"
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
                    <Text style={styles.text}>indicate occupation of patient<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Picker
                            mode="dropdown"
                            placeholderStyle={{ fontSize: 12, marginLeft: -5 }}
                            iosIcon={<MaterialIcons name="keyboard-arrow-down" style={Platform.OS === "ios" ? { color: '#fff', fontSize: 20, marginRight: 15 } : { color: '#fff', fontSize: 20 }} />}
                            textStyle={{ color: "#fff", left: 0, marginLeft: 5 }}
                            note={false}
                            itemStyle={{
                                paddingLeft: 10,
                                fontSize: 16,
                                fontFamily: 'Helvetica-Light',
                                color: "#fff",
                            }}
                            itemTextStyle={{ color: '#fff', fontFamily: 'Helvetica-Light', }}
                            style={{ width: "100%", color: "#000", }}
                            onValueChange={(sample) => { this.setState({ OccupationText: sample }) }}
                            selectedValue={OccupationText}
                            testID="editJobType"
                        >

                            {Occupation.map((value, key) => {

                                return <Picker.Item label={String(value)} value={String(value)} key={key}
                                />
                            })
                            }
                        </Picker>
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>If other, details<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Specify your ocupation"
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
                    <Text style={styles.text}>Address<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Address Details"
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
                    <Text style={styles.text}>City<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter City"
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
                    <Text style={styles.text}>State<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter State"
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
                    <Text style={styles.text}>Country<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Country"
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
                    <Text style={styles.text}>No and Street<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter No and Street"
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
                    <Text style={styles.text}>Phone Number<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Phone Number"
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
                    <Text style={styles.text}>Email ID<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Email ID"
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
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}





export default InsuredPersonHospitalized