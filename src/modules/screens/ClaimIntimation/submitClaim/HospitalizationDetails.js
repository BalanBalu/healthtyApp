import React, {useEffect, useState} from 'react';
import {Text, View, Item, Input, Picker, Radio, Icon} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {subTimeUnit, formatDate} from '../../../../setup/helpers';
import ModalPopup from '../../../../components/Shared/ModalPopup';

const HospitalizationDetails = (props) => {
  const {
    claimListData,
    RoomCategory,
    Hospitalization,
    InjuryCause,
    updateHospitalization,
    TimeOfAdmissionHours,
    TimeOfAdmissionMinute,
    TimeOfDischargeMinute,
    TimeOfDischargeHours,
  } = props;
  const [hospitalName, setHospitalName] = useState('');
  const [roomCategory, setRoomCategory] = useState();
  const [hospitalizationDueTo, setHospitalizationDueTo] = useState();
  const [dayOfInjury, setdayOfInjury] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [dateOfAdmission, setDateOfAdmission] = useState(
    claimListData.dateOfAdmission,
  );
  const [dateOfDischarge, setDateOfDischarge] = useState(
    claimListData.dateOfDischarge,
  );
  const [injuryCause, setInjuryCause] = useState('');
  const [medicoLegal, setMedicoLegal] = useState();
  const [reportedTpPolice, setReportedTpPolice] = useState();
  const [mlcReport, setMlcReport] = useState();
  const [systemOfMedicine, setSystemOfMedicine] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);
  const [timeOfAdmissionHours, settimeOfAdmissionHours] = useState();
  const [timeOfAdmissionMinute, settimeOfAdmissionMinute] = useState();
  const [timeOfDischargeHours, settimeOfDischargeHours] = useState();
  const [timeOfDischargeMinute, settimeOfDischargeMinute] = useState();

  const onPressConfirmDateValue = (date) => {
    setdayOfInjury(date);
    setIsVisible(false);
  };
  const onCancelPicker = () => {
    setIsVisible(false);
  };

  const openPicker = () => {
    setIsVisible(true);
  };

  const submitData = () => {
    if (
      hospitalName != '' &&
      hospitalizationDueTo != '' &&
      dateOfAdmission != '' &&
      timeOfAdmissionHours != '' &&
      timeOfAdmissionMinute != '' &&
      dateOfDischarge != '' &&
      timeOfDischargeHours != '' &&
      timeOfDischargeMinute != ''
    ) {
      updateHospitalization({
        hospitalName: hospitalName,
        roomCategory: roomCategory,
        hospitalizationDueTo: hospitalizationDueTo,
        dayOfInjury: dayOfInjury,
        dateOfAdmission: dateOfAdmission,
        admissionTimeInHour: timeOfAdmissionHours,
        admissionTimeInMin: timeOfAdmissionMinute,
        dateOfDischarge: dateOfDischarge,
        dischargeTimeInHour: timeOfDischargeHours,
        dischargeTimeInMin: timeOfDischargeMinute,
        injuryCause: injuryCause,
        medicoLegal: medicoLegal,
        reportedTpPolice: reportedTpPolice,
        mlcReport: mlcReport,
        systemOfMedicine: systemOfMedicine,
      });
    } else {
      if (hospitalName === '') {
        seterrorMsg('Please enter hospital name');
        setisModalVisible(true);
        return false;
      }
      if (hospitalizationDueTo === ''||hospitalizationDueTo ==='Select your Item') {
        seterrorMsg('Please enter hospitalization due');
        setisModalVisible(true);
        return false;
      }
      if (dateOfAdmission === '') {
        seterrorMsg('Please enter admission date');
        setisModalVisible(true);
        return false;
      }
      if (timeOfAdmissionHours === '' || timeOfAdmissionHours === 'Select') {
        seterrorMsg('Please enter time of admission hours')
        setisModalVisible(true);
        return false;
      }
      if (timeOfAdmissionMinute === '' || timeOfAdmissionMinute === 'Select') {
        seterrorMsg('Please enter time of admission minutes')
        setisModalVisible(true);
        return false;
      }
      if (dateOfDischarge === '' || dateOfDischarge === 'Select') {
        seterrorMsg('Please enter discharge date');
        setisModalVisible(true);
        return false;
      }

      if (timeOfDischargeHours === '' || timeOfDischargeHours === 'Select') {
        seterrorMsg('Please enter time of discharge hours')
        setisModalVisible(true);
        return false;
      }
      if (timeOfDischargeMinute === '' || timeOfDischargeMinute === 'Select') {
        seterrorMsg('Please enter time of discharge minutes')
        setisModalVisible(true);
        return false;
      }
    }
  }
    return (
      <View>
        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Name of Hospital<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Input
                placeholder="Enter Name of Hospital"
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={hospitalName}
                keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                onChangeText={(text) => setHospitalName(text)}
                testID="editHospitalName"
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>Room category occupied</Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Picker
                mode="dropdown"
                placeholderStyle={{fontSize: 12, marginLeft: -5}}
                iosIcon={
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    style={
                      Platform.OS === 'ios'
                        ? {color: '#fff', fontSize: 20, marginRight: 15}
                        : {color: '#fff', fontSize: 20}
                    }
                  />
                }
                textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: '#fff',
                }}
                itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                style={{width: '100%', color: '#000'}}
                onValueChange={(sample) => {
                  setRoomCategory(sample);
                }}
                selectedValue={roomCategory}
                testID="editJobType">
                {RoomCategory.map((value, key) => {
                  return (
                    <Picker.Item
                      label={String(value)}
                      value={String(value)}
                      key={key}
                    />
                  );
                })}
              </Picker>
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Hospitalization due to<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Picker
                mode="dropdown"
                placeholderStyle={{fontSize: 12, marginLeft: -5}}
                iosIcon={
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    style={
                      Platform.OS === 'ios'
                        ? {color: '#fff', fontSize: 20, marginRight: 15}
                        : {color: '#fff', fontSize: 20}
                    }
                  />
                }
                textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: '#fff',
                }}
                itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                style={{width: '100%', color: '#000'}}
                onValueChange={(sample) => {
                  setHospitalizationDueTo(sample);
                }}
                selectedValue={hospitalizationDueTo}
                testID="selectHospitalizationDueTo">
                {Hospitalization.map((value, key) => {
                  return (
                    <Picker.Item
                      label={String(value)}
                      value={String(value)}
                      key={key}
                    />
                  );
                })}
              </Picker>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>Date Of injury</Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={openPicker}
                testID="selectDateOfInjury">
                <Icon name="md-calendar" style={styles.calenderStyle} />
                <Text
                  style={
                    dayOfInjury
                      ? styles.timeplaceHolder
                      : styles.afterTimePlaceholder
                  }>
                  {dayOfInjury
                    ? formatDate(dayOfInjury, 'DD/MM/YYYY')
                    : 'Date Of injury'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  // maximumDate={new Date()}
                  value={dayOfInjury}
                  isVisible={isVisible}
                  onConfirm={onPressConfirmDateValue}
                  onCancel={onCancelPicker}
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Date Of Admission<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                testID="selectDateOfAdmission">
                {/* onPress={openPicker}> */}
                <Icon name="md-calendar" style={styles.calenderStyle} />
                <Text
                  style={
                    dateOfAdmission
                      ? styles.timeplaceHolder
                      : styles.afterTimePlaceholder
                  }>
                  {dateOfAdmission
                    ? formatDate(dateOfAdmission, 'DD/MM/YYYY')
                    : 'Date Of Admission'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  // maximumDate={new Date()}
                  value={dateOfAdmission}
                  // isVisible={isVisiblePicker}
                  // onConfirm={onPressConfirmDateValue}
                  // onCancel={oncancelThePicker}
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Time of admission<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Item regular style={{borderRadius: 6, height: 35, width: 140}}>
                <Picker
                  mode="dropdown"
                  placeholderStyle={{fontSize: 12, marginLeft: -5}}
                  iosIcon={
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      style={
                        Platform.OS === 'ios'
                          ? {color: '#fff', fontSize: 20, marginRight: 15}
                          : {color: '#fff', fontSize: 20}
                      }
                    />
                  }
                  textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                  note={false}
                  itemStyle={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Helvetica-Light',
                    color: '#fff',
                  }}
                  itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                  style={{width: '100%', color: '#000'}}
                  onValueChange={(sample) => {
                    settimeOfAdmissionHours(sample);
                  }}
                  selectedValue={timeOfAdmissionHours}
                  testID="editadmissionType">
                  {TimeOfAdmissionHours.map((value, key) => {
                    return (
                      <Picker.Item
                        label={String(value)}
                        value={String(value)}
                        key={key}
                      />
                    );
                  })}
                </Picker>
              </Item>
              <Item regular style={{borderRadius: 6, height: 35, width: 140}}>
                <Picker
                  mode="dropdown"
                  placeholderStyle={{fontSize: 12, marginLeft: -5}}
                  iosIcon={
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      style={
                        Platform.OS === 'ios'
                          ? {color: '#fff', fontSize: 20, marginRight: 15}
                          : {color: '#fff', fontSize: 20}
                      }
                    />
                  }
                  textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                  note={false}
                  itemStyle={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Helvetica-Light',
                    color: '#fff',
                  }}
                  itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                  style={{width: '100%', color: '#000'}}
                  onValueChange={(sample) => {
                    settimeOfAdmissionMinute(sample);
                  }}
                  selectedValue={timeOfAdmissionMinute}
                  testID="editTimeOfAdmissionMinute">
                  {TimeOfAdmissionMinute.map((value, key) => {
                    return (
                      <Picker.Item
                        label={String(value)}
                        value={String(value)}
                        key={key}
                      />
                    );
                  })}
                </Picker>
              </Item>
            </View>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Date Of Discharge<Text style={{color: 'red'}}>*</Text>
            </Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                testID="selectDateOfDischarge">
                {/* onPress={openPicker}> */}
                <Icon name="md-calendar" style={styles.calenderStyle} />
                <Text
                  style={
                    dateOfDischarge
                      ? styles.timeplaceHolder
                      : styles.afterTimePlaceholder
                  }>
                  {dateOfDischarge
                    ? formatDate(dateOfDischarge, 'DD/MM/YYYY')
                    : 'Date Of Discharge'}
                </Text>
                <DateTimePicker
                  mode={'date'}
                  // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                  // maximumDate={new Date()}
                  value={dateOfDischarge}
                  // isVisible={isVisiblePicker}
                  // onConfirm={onPressConfirmDateValue}
                  // onCancel={oncancelThePicker}
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>
              Time of discharge<Text style={{color: 'red'}}>*</Text>
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Item regular style={{borderRadius: 6, height: 35, width: 140}}>
                <Picker
                  mode="dropdown"
                  placeholderStyle={{fontSize: 12, marginLeft: -5}}
                  iosIcon={
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      style={
                        Platform.OS === 'ios'
                          ? {color: '#fff', fontSize: 20, marginRight: 15}
                          : {color: '#fff', fontSize: 20}
                      }
                    />
                  }
                  textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                  note={false}
                  itemStyle={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Helvetica-Light',
                    color: '#fff',
                  }}
                  itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                  style={{width: '100%', color: '#000'}}
                  onValueChange={(sample) => {
                    settimeOfDischargeHours(sample);
                  }}
                  selectedValue={timeOfDischargeHours}
                  testID="editadmissionType">
                  {TimeOfDischargeHours.map((value, key) => {
                    return (
                      <Picker.Item
                        label={String(value)}
                        value={String(value)}
                        key={key}
                      />
                    );
                  })}
                </Picker>
              </Item>
              <Item regular style={{borderRadius: 6, height: 35, width: 140}}>
                <Picker
                  mode="dropdown"
                  placeholderStyle={{fontSize: 12, marginLeft: -5}}
                  iosIcon={
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      style={
                        Platform.OS === 'ios'
                          ? {color: '#fff', fontSize: 20, marginRight: 15}
                          : {color: '#fff', fontSize: 20}
                      }
                    />
                  }
                  textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                  note={false}
                  itemStyle={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Helvetica-Light',
                    color: '#fff',
                  }}
                  itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                  style={{width: '100%', color: '#000'}}
                  onValueChange={(sample) => {
                    settimeOfDischargeMinute(sample);
                  }}
                  selectedValue={timeOfDischargeMinute}
                  testID="editadmissionType">
                  {TimeOfDischargeMinute.map((value, key) => {
                    return (
                      <Picker.Item
                        label={String(value)}
                        value={String(value)}
                        key={key}
                      />
                    );
                  })}
                </Picker>
              </Item>
            </View>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>If injury, give cause</Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Picker
                mode="dropdown"
                placeholderStyle={{fontSize: 12, marginLeft: -5}}
                iosIcon={
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    style={
                      Platform.OS === 'ios'
                        ? {color: '#fff', fontSize: 20, marginRight: 15}
                        : {color: '#fff', fontSize: 20}
                    }
                  />
                }
                textStyle={{color: '#fff', left: 0, marginLeft: 5}}
                note={false}
                itemStyle={{
                  paddingLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Helvetica-Light',
                  color: '#fff',
                }}
                itemTextStyle={{color: '#fff', fontFamily: 'Helvetica-Light'}}
                style={{width: '100%', color: '#000'}}
                onValueChange={(sample) => setInjuryCause(sample)}
                selectedValue={injuryCause}
                testID="selectInjuryCause">
                {InjuryCause.map((value, key) => {
                  return (
                    <Picker.Item
                      label={String(value)}
                      value={String(value)}
                      key={key}
                    />
                  );
                })}
              </Picker>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>If Medico legal</Text>

            <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={medicoLegal === true}
                onPress={() => setMedicoLegal(true)}
                testID="chooseMedicoLegal"
              />
              <Text style={styles.text}>Yes</Text>

              <View style={styles.radioButtonStyle}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={medicoLegal === false}
                  onPress={() => setMedicoLegal(false)}
                  testID="chooseNotMedicoLegal"
                />
                <Text style={styles.text}>No</Text>
              </View>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>Reported to police</Text>

            <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={reportedTpPolice === true}
                onPress={() => setReportedTpPolice(true)}
                testID="chooseReported"
              />
              <Text style={styles.text}>Yes</Text>

              <View style={styles.radioButtonStyle}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={reportedTpPolice === false}
                  onPress={() => setReportedTpPolice(false)}
                  testID="chooseNotReported"
                />
                <Text style={styles.text}>No</Text>
              </View>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>MLC Report police FIR attached</Text>

            <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={mlcReport === true}
                onPress={() => setMlcReport(true)}
                testID="chooseMedicalReportAttached"
              />
              <Text style={styles.text}>Yes</Text>

              <View style={styles.radioButtonStyle}>
                <Radio
                  color={primaryColor}
                  selectedColor={primaryColor}
                  standardStyle={true}
                  selected={mlcReport === false}
                  onPress={() => setMlcReport(false)}
                  testID="chooseNotMedicalReportAttached"
                />
                <Text style={styles.text}>No</Text>
              </View>
            </Item>
          </Col>
        </Row>

        <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
          <Col size={1}>
            <Text style={styles.text}>Enter system of medicine</Text>

            <Item regular style={{borderRadius: 6, height: 35}}>
              <Input
                placeholder="Enter system of medicine"
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={systemOfMedicine}
                keyboardType={'default'}
                //   editable={employeeId == undefined ? true : false}
                onChangeText={(text) => setSystemOfMedicine(text)}
                testID="editSystemOfMedicine"
              />
            </Item>
          </Col>
        </Row>

        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.submit_ButtonStyle}
            onPress={() => submitData()}
            testID="submitDetails4">
            <Text style={{color: '#fff'}}>Submit And Continue</Text>
          </TouchableOpacity>
        </View>
        <ModalPopup
        errorMessageText={errorMsg}
        closeButtonText={'CLOSE'}
        closeButtonAction={() => setisModalVisible(false)}
        visible={isModalVisible}
      />
      </View>
    );
  };
export default HospitalizationDetails;
