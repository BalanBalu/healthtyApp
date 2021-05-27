import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Item, Input, Picker, Radio, Icon, } from 'native-base';
import { TouchableOpacity, } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';
import ModalPopup from '../../../../components/Shared/ModalPopup';



const PatientAdmittedDetails = (props) => {
    const { updateInsuredPersonHospitalizedDetails, TimeOfAdmissionHours, TimeOfAdmissionMinute, dropdownData, OccupationText, TimeOfDischargeMinute, TimeOfDischargeHours, dischargeTimeStatus } = props;
    const [patientFirstName, setpatientFirstName] = useState('')
    const [patientMiddleName, setpatientMiddleName] = useState('')
    const [patientLastName, setpatientLastName] = useState('')
    const [registrationNo, setregistrationNo] = useState('')
    const [gender, setgender] = useState('Male')
    const [selectedAdmissionDate, setselectedAdmissionDate] = useState('')
    const [isVisiblePicker, setisVisiblePicker] = useState(false)
    const [selectedDateOfBirth, setselectedDateOfBirth] = useState('')
    const [dateofBirthPickerOpen, setdateofBirthPickerOpen] = useState(false)
    const [timeOfAdmission, settimeOfAdmission] = useState('')
    const [selectDischargeDate, setselectDischargeDate] = useState('')
    const [isVisibleDischargeDatePicker, setisVisibleDischargeDatePicker] = useState(false)
    const [timeOfDischarge, settimeOfDischarge] = useState('')
    const [admissionType, setadmissionType] = useState('')
    const [selectdeliveryDate, setselectdeliveryDate] = useState('')
    const [isVisibledeliveryDatePicker, setisVisibledeliveryDatePicker] = useState(false)
    const [gravidaStatus, setgravidaStatus] = useState('')
    const [claimAmount, setclaimAmount] = useState('')
    const [dischargeTime, setdischargeTime] = useState('')
    const [errorMsg, seterrorMsg] = useState('')
    const [isModalVisible, setisModalVisible] = useState(false)
    const [age, setage] = useState('')
    const [patientAgeYear1, setpatientAgeYear1] = useState('')
    const [patientAgeYear2, setpatientAgeYear2] = useState('')
    const [patientAgeMonth1, setpatientAgeMonth1] = useState('')
    const [patientAgeMonth2, setpatientAgeMonth2] = useState('')
    const [timeOfAdmissionHours, settimeOfAdmissionHours] = useState()
    const [timeOfAdmissionMinute, settimeOfAdmissionMinute] = useState()
    const [timeOfDischargeHours, settimeOfDischargeHours] = useState()
    const [timeOfDischargeMinute, settimeOfDischargeMinute] = useState()

    const inputEl1 = useRef(null);
    const inputEl2 = useRef(null);
    const inputEl3 = useRef(null);
    const inputEl4 = useRef(null);
    const inputEl5 = useRef(null);
    const inputEl6 = useRef(null);


    const onPressConfirmDateValue = (date) => {
        try {
            setdateofBirthPickerOpen(false)
            setselectedDateOfBirth(date)
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    };
    const oncancelDateOfBirthPiscker = () => {
        setdateofBirthPickerOpen(!dateofBirthPickerOpen)
    }

    const openDateOfBirthPiscker = () => {
        setdateofBirthPickerOpen(!dateofBirthPickerOpen)

    }

    const oncancelThePicker = () => {
        setisVisiblePicker(!isVisiblePicker)
    }
    const onPressConfirmAdmissionDateValue = (date) => {
        try {
            setisVisiblePicker(false)
            setselectedAdmissionDate(date)
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    };

    const openAdmissionDatePicker = () => {
        setisVisiblePicker(!isVisiblePicker)
    }
    const oncancelTheDischargeDatePicker = () => {
        setisVisibleDischargeDatePicker(!isVisibleDischargeDatePicker)
    }

    const openTheDischargeDatePicker = () => {
        setisVisibleDischargeDatePicker(!isVisibleDischargeDatePicker)
    }

    const onPressConfirmDischargeDatePicker = (date) => {
        try {
            setisVisibleDischargeDatePicker(false)
            setselectDischargeDate(date)
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    };

    const opendeliveryDatePicker = () => {
        setisVisibledeliveryDatePicker(!isVisibledeliveryDatePicker)
    }

    const oncanceldeliveryDatePicker = () => {
        setisVisibledeliveryDatePicker(!isVisibledeliveryDatePicker)
    }
    const onPressConfirmdeliveryDatePicker = (date) => {
        try {
            setisVisibledeliveryDatePicker(false)
            setselectdeliveryDate(date)
        } catch (error) {
            console.error('Error on Date Picker: ', error);
        }
    };

    const submmitData = () => {
        if (patientFirstName && patientMiddleName && patientLastName && gravidaStatus && claimAmount && dischargeTime &&
            patientAgeYear1 && patientAgeYear2 && patientAgeMonth1 && patientAgeMonth2 != '') {
            updateInsuredPersonHospitalizedDetails({
                patientFirstName: patientFirstName,
                patientMiddleName: patientMiddleName,
                patientLastName: patientLastName,
                patientGender: gender,
                patientAgeYear1: patientAgeYear1,
                patientAgeYear2: patientAgeYear2,
                patientAgeMonth1: patientAgeMonth1,
                patientAgeMonth2: patientAgeMonth2,
                ipRegistrationNo: registrationNo,
                patientDOB: selectedDateOfBirth,
                submissionDateOfAdmission: selectedAdmissionDate,
                admissionTimeInHour: timeOfAdmissionHours,
                admissionTimeInMin: timeOfAdmissionMinute,
                dischargeTimeInHour: timeOfDischargeHours,
                dischargeTimeInMin: timeOfDischargeMinute,
                submissionDischargeStatus: dischargeTime,
                submissionDeliveryDate: selectdeliveryDate,
                typeOfAdmission: admissionType,
                totalOfClaimAmount: claimAmount,
                submissionDateOfDischarge: selectDischargeDate,
                gravidaStatus: gravidaStatus,
            })
            setpatientFirstName('')
            setpatientMiddleName('')
            setpatientLastName('')
            setregistrationNo('')
            setselectedAdmissionDate('')
            setselectedDateOfBirth('')
            setselectDischargeDate('')
            setadmissionType('')
            setselectdeliveryDate('')
            setgravidaStatus('')
            setclaimAmount('')
            setdischargeTime('')
            setpatientAgeYear1('')
            setpatientAgeYear2('')
            setpatientAgeMonth1('')
            setpatientAgeMonth2('')
            settimeOfAdmissionHours()
            settimeOfAdmissionMinute()
            settimeOfDischargeHours()
            settimeOfDischargeMinute()

        } else {
            if (patientFirstName === '') {
                seterrorMsg('Please enter patient first name')
                setisModalVisible(true)
                return false
            }
            if (patientMiddleName === '') {
                seterrorMsg('Please enter patient middle name')
                setisModalVisible(true)
                return false
            }
            if (patientLastName === '') {
                seterrorMsg('Please enter patient Last name')
                setisModalVisible(true)
                return false
            }
            if (registrationNo === '') {
                seterrorMsg('Please enter registration number')
                setisModalVisible(true)
                return false
            }
            if (claimAmount === '') {
                seterrorMsg('Please enter claimAmount')
                setisModalVisible(true)
                return false
            }
            if (age === '') {
                seterrorMsg('Please enter age')
                setisModalVisible(true)
                return false
            }
            if (dischargeTime === '' || dischargeTime === 'Select your Status') {
                seterrorMsg('Please enter time Of discharge')
                setisModalVisible(true)
                return false
            }
            if (admissionType === '' || admissionType === 'Select your Item') {
                seterrorMsg('Please enter admission type')
                setisModalVisible(true)
                return false
            }
            if (timeOfAdmissionHours === '' || timeOfAdmissionHours === 'Select') {
                seterrorMsg('Please enter admission type')
                setisModalVisible(true)
                return false
            }
            if (timeOfAdmissionMinute === '' || timeOfAdmissionMinute === 'Select') {
                seterrorMsg('Please enter admission type')
                setisModalVisible(true)
                return false
            }
            if (timeOfDischargeHours === '' || timeOfDischargeHours === 'Select') {
                seterrorMsg('Please enter admission type')
                setisModalVisible(true)
                return false
            }
            if (timeOfDischargeMinute === '' || timeOfDischargeMinute === 'Select') {
                seterrorMsg('Please enter admission type')
                setisModalVisible(true)
                return false
            }
        }



    }
    return (
        <View>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Patient first name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <Input
                            placeholder="Enter Patient first name"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={patientFirstName}
                            keyboardType={'default'}
                            onChangeText={(text) => setpatientFirstName(text)}
                            onSubmitEditing={() => inputEl1.current._root.focus()}
                            testID="editpatientFirstName"

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Patient middle name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Patient middle name"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={patientMiddleName}
                            ref={inputEl1}
                            keyboardType={'default'}
                            onChangeText={(text) => setpatientMiddleName(text)}
                            onSubmitEditing={() => inputEl2.current._root.focus()}
                            testID="editpatientMiddleName"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Patient last name<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Patient last name"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={patientLastName}
                            ref={inputEl2}
                            keyboardType={'default'}
                            onChangeText={(text) => setpatientLastName(text)}
                            onSubmitEditing={() => inputEl3.current._root.focus()}
                            testID="editpatientLastName"

                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>IP_REGISTRATION_NO<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Action"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={registrationNo}
                            ref={inputEl3}
                            keyboardType={'number-pad'}
                            onChangeText={(text) => setregistrationNo(text)}
                            testID="editpatientLastName"

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
                            selected={gender === 'Male'}
                            onPress={() => setgender('Male')}
                        />
                        <Text style={styles.text}>Male</Text>

                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={gender === 'Female'}
                                onPress={() => setgender('Female')}
                            />
                            <Text style={styles.text}>Female</Text>

                        </View>
                        <View style={styles.radioButtonStyle}>
                            <Radio
                                color={primaryColor}
                                selectedColor={primaryColor}
                                standardStyle={true}
                                selected={gender === 'Other'}
                                onPress={() => setgender('Other')}
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
                    <Text style={styles.text}>Age<Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 50 }}>
                            <Input
                                placeholder="Y"
                                placeholderTextColor={'#CDD0D9'}
                                style={styles.fontColorOfInput}
                                returnKeyType={'next'}
                                value={patientAgeYear1}
                                maxLength={1}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => setpatientAgeYear1(text)}
                                onSubmitEditing={() => inputEl4.current._root.focus()}
                                testID="editpatientAge"
                            />
                        </Item>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 50 }}>
                            <Input
                                placeholder="Y"
                                placeholderTextColor={'#CDD0D9'}
                                style={styles.fontColorOfInput}
                                returnKeyType={'next'}
                                value={patientAgeYear2}
                                maxLength={1}
                                ref={inputEl4}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => setpatientAgeYear2(text)}
                                onSubmitEditing={() => inputEl5.current._root.focus()}

                                testID="editpatientAge"
                            />
                        </Item>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 50 }}>
                            <Input
                                placeholder="M"
                                placeholderTextColor={'#CDD0D9'}
                                style={styles.fontColorOfInput}
                                returnKeyType={'next'}
                                value={patientAgeMonth1}
                                maxLength={1}
                                ref={inputEl5}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => setpatientAgeMonth1(text)}
                                testID="editpatientAge"
                                onSubmitEditing={() => inputEl6.current._root.focus()}

                            />
                        </Item>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 50 }}>
                            <Input
                                placeholder="M"
                                placeholderTextColor={'#CDD0D9'}
                                style={styles.fontColorOfInput}
                                returnKeyType={'next'}
                                value={patientAgeMonth2}
                                maxLength={1}
                                ref={inputEl6}
                                keyboardType={'number-pad'}
                                onChangeText={(text) => setpatientAgeMonth2(text)}
                                testID="editpatientAge"
                            />
                        </Item>
                    </View>

                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Date Of Birth<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={openDateOfBirthPiscker}>
                            <Icon
                                name="md-calendar"
                                style={styles.calenderStyle}
                            />
                            <Text
                                style={
                                    selectedDateOfBirth
                                        ? styles.timeplaceHolder
                                        : styles.afterTimePlaceholder
                                }>
                                {selectedDateOfBirth
                                    ? formatDate(selectedDateOfBirth, 'DD/MM/YYYY')
                                    : 'Enter Date of birth'}
                            </Text>
                            <DateTimePicker
                                mode={'date'}
                                maximumDate={new Date()}
                                value={selectedDateOfBirth}
                                isVisible={dateofBirthPickerOpen}
                                onConfirm={onPressConfirmDateValue}
                                onCancel={oncancelDateOfBirthPiscker}
                            />
                        </TouchableOpacity>
                    </Item>
                </Col>
            </Row>


            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Date of Admission<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={openAdmissionDatePicker}>
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
                                    : 'Enter Date of Admission'}
                            </Text>
                            <DateTimePicker
                                mode={'date'}
                                maximumDate={new Date()}
                                value={selectedAdmissionDate}
                                isVisible={isVisiblePicker}
                                onConfirm={onPressConfirmAdmissionDateValue}
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

                    {/* <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="HH/MH"
                             placeholderTextColor={'#CDD0D9'}
                    style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={timeOfAdmission}
                            keyboardType={'default'}
                            onChangeText={(text) => settimeOfAdmission(text)}
                            testID="editTimeOfAdmission"
                        />
                    </Item> */}
                    <View style={{ flexDirection: 'row' }}>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 140 }}>
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
                                onValueChange={(sample) => { settimeOfAdmissionHours(sample) }}
                                selectedValue={timeOfAdmissionHours}
                                testID="editadmissionType"
                            >

                                {TimeOfAdmissionHours.map((value, key) => {

                                    return <Picker.Item label={String(value)} value={String(value)} key={key}
                                    />
                                })
                                }
                            </Picker>
                        </Item>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 140 }}>
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
                                onValueChange={(sample) => { settimeOfAdmissionMinute(sample) }}
                                selectedValue={timeOfAdmissionMinute}
                                testID="editadmissionType"
                            >

                                {TimeOfAdmissionMinute.map((value, key) => {

                                    return <Picker.Item label={String(value)} value={String(value)} key={key}
                                    />
                                })
                                }
                            </Picker>
                        </Item>
                    </View>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Date Of Discharge<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={openTheDischargeDatePicker}>
                            <Icon
                                name="md-calendar"
                                style={styles.calenderStyle}
                            />
                            <Text
                                style={
                                    selectDischargeDate
                                        ? styles.timeplaceHolder
                                        : styles.afterTimePlaceholder
                                }>
                                {selectDischargeDate
                                    ? formatDate(selectDischargeDate, 'DD/MM/YYYY')
                                    : 'Enter Date Of Discharge'}
                            </Text>
                            <DateTimePicker
                                mode={'date'}
                                maximumDate={new Date()}
                                value={selectDischargeDate}
                                isVisible={isVisibleDischargeDatePicker}
                                onConfirm={onPressConfirmDischargeDatePicker}
                                onCancel={oncancelTheDischargeDatePicker}
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

                    <View style={{ flexDirection: 'row' }}>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 140 }}>
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
                                onValueChange={(sample) => { settimeOfDischargeHours(sample) }}
                                selectedValue={timeOfDischargeHours}
                                testID="editadmissionType"
                            >

                                {TimeOfDischargeHours.map((value, key) => {

                                    return <Picker.Item label={String(value)} value={String(value)} key={key}
                                    />
                                })
                                }
                            </Picker>
                        </Item>
                        <Item regular style={{ borderRadius: 6, height: 35, width: 140 }}>
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
                                onValueChange={(sample) => { settimeOfDischargeMinute(sample) }}
                                selectedValue={timeOfDischargeMinute}
                                testID="editadmissionType"
                            >

                                {TimeOfDischargeMinute.map((value, key) => {

                                    return <Picker.Item label={String(value)} value={String(value)} key={key}
                                    />
                                })
                                }
                            </Picker>
                        </Item>
                    </View>
                </Col>
            </Row>



            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Type of admission<Text style={{ color: 'red' }}>*</Text></Text>

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
                            onValueChange={(sample) => { setadmissionType(sample) }}
                            selectedValue={admissionType}
                            testID="editadmissionType"
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
                    <Text style={styles.text}>If maternity, enter delivery date<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={opendeliveryDatePicker}>
                            <Icon
                                name="md-calendar"
                                style={styles.calenderStyle}
                            />
                            <Text
                                style={
                                    selectdeliveryDate
                                        ? styles.timeplaceHolder
                                        : styles.afterTimePlaceholder
                                }>
                                {selectdeliveryDate
                                    ? formatDate(selectdeliveryDate, 'DD/MM/YYYY')
                                    : 'If maternity, enter delivery date'}
                            </Text>
                            <DateTimePicker
                                mode={'date'}
                                maximumDate={new Date()}
                                value={selectdeliveryDate}
                                isVisible={isVisibledeliveryDatePicker}
                                onConfirm={onPressConfirmdeliveryDatePicker}
                                onCancel={oncanceldeliveryDatePicker}
                            />
                        </TouchableOpacity>
                    </Item>
                </Col>
            </Row>

            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Gravida status<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Gravida status"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            value={gravidaStatus}
                            keyboardType={'default'}
                            onChangeText={(text) => setgravidaStatus(text)}
                            testID="editgravidaStatus"
                        />
                    </Item>
                </Col>
            </Row>
            <Row
                size={4}
                style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
                <Col size={1}>
                    <Text style={styles.text}>Status at time of discharge<Text style={{ color: 'red' }}>*</Text></Text>

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
                            onValueChange={(sample) => { setdischargeTime(sample) }}
                            selectedValue={dischargeTime}
                            testID="editdischargeTime"
                        >

                            {dischargeTimeStatus.map((value, key) => {

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
                    <Text style={styles.text}>Total claimed amount<Text style={{ color: 'red' }}>*</Text></Text>

                    <Item regular style={{ borderRadius: 6, height: 35 }}>
                        <Input
                            placeholder="Enter Total claimed amount"
                            placeholderTextColor={'#CDD0D9'}
                            style={styles.fontColorOfInput}
                            returnKeyType={'next'}
                            keyboardType={'number-pad'}
                            value={claimAmount}
                            onChangeText={(text) => setclaimAmount(text)}
                            testID="editclaimAmount"
                        />
                    </Item>
                </Col>
            </Row>
            <View style={styles.ButtonView}>
                <TouchableOpacity style={styles.submit_ButtonStyle} onPress={() => submmitData()}>
                    <Text style={{ color: "#fff" }}>Submit And Continue</Text>
                </TouchableOpacity>
            </View>
            <ModalPopup
                errorMessageText={errorMsg}
                closeButtonText={'CLOSE'}
                closeButtonAction={() => setisModalVisible(false)}
                visible={isModalVisible} />
        </View>
    )
}





export default PatientAdmittedDetails