import React, { PureComponent } from 'react';
import { Text, View,Item, Input, Picker, Radio, Icon, } from 'native-base';
import { TouchableOpacity, FlatList, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';



const HospitalizationDetails = ({ isSelected, isVisiblePicker, selectedAdmissionDate, RoomCategoryText, RoomCategory, HospitalizationText, Hospitalization, InjuryCause, InjuryCauseText, onPressConfirmDateValue, oncancelThePicker, openPicker }) => {

    return (
        <View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Name of Hospital<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Name of Hospital"
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
                            onValueChange={(sample) => { this.setState({ RoomCategoryText: sample }) }}
                            selectedValue={RoomCategoryText}
                            testID="editJobType"
                        >

                            {RoomCategory.map((value, key) => {

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
                    <Text style={styles.text}>Hospitalization due to<Text style={{ color: 'red' }}>*</Text></Text>

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
                            onValueChange={(sample) => { this.setState({ HospitalizationText: sample }) }}
                            selectedValue={HospitalizationText}
                            testID="editJobType"
                        >

                            {Hospitalization.map((value, key) => {

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
                    <Text style={styles.text}>Date Of injury<Text style={{ color: 'red' }}>*</Text></Text>

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
                                    : 'Date Of injury'}
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
                    <Text style={styles.text}>Date Of Admission<Text style={{ color: 'red' }}>*</Text></Text>

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
                                    : 'Date Of Admission'}
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
                    <Text style={styles.text}>Time of admission<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="hh/mm"
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
                    <Text style={styles.text}>Date Of Discharge<Text style={{ color: 'red' }}>*</Text></Text>

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
                                    : 'Date Of Discharge'}
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
                    <Text style={styles.text}>Time of discharge<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="hh/mm"
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
                    <Text style={styles.text}>If injury, give cause<Text style={{ color: 'red' }}>*</Text></Text>

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
                            onValueChange={(sample) => { this.setState({ InjuryCauseText: sample }) }}
                            selectedValue={InjuryCauseText}
                            testID="editJobType"
                        >

                            {InjuryCause.map((value, key) => {

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
                    <Text style={styles.text}>If Medico legal<Text style={{ color: 'red' }}>*</Text></Text>

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
                    <Text style={styles.text}>Reported to police<Text style={{ color: 'red' }}>*</Text></Text>

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
                    <Text style={styles.text}>MLC Report police FIR attached<Text style={{ color: 'red' }}>*</Text></Text>

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
                    <Text style={styles.text}>Enter system of medicine<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter system of medicine"
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
    );
}


export default HospitalizationDetails