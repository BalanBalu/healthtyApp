import React, {useEffect, useState} from 'react';
import {Text, View, Item, Input, Picker, Radio, Icon} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../Styles';
import {primaryColor} from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {subTimeUnit, formatDate,dateDiff} from '../../../../setup/helpers';
import {toastMeassage} from '../../../common';
import ModalPopup from '../../../../components/Shared/ModalPopup';

const InsuredPersonHospitalized = (props) => {
  const {dropdownData, Occupation,updateInsuredPersonHospitalizedDetails} = props;
  const [patientName, setPatientName] = useState('');
  const [patientGender, setPatientGender] = useState();
  const [patientDob, setPatientDob] = useState();
  const [patientAge, setPatientAge] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [relationshipDetail, setRelationshipDetail] = useState('');
  const [occupation, setOccupation] = useState();
  const [occupationDetail, setOccupationDetail] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientNoAndStreet, setPatientNoAndStreet] = useState('');
  const [patientCity, setPatientCity] = useState('');
  const [patientState, setPatientState] = useState('');
  const [patientCountry, setPatientCountry] = useState('');
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);
  const onPressConfirmDateValue = (date) => {
    setPatientDob(date);
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
      patientName != '' &&
      patientGender!= ''&&
      patientAge != '' &&
      patientDob!= ''&&
      relationship != '' 
    ) {
      updateInsuredPersonHospitalizedDetails({
        patientName: patientName,
        patientGender: patientGender,
        patientAge: patientAge,
        patientDob: patientDob,
        relationship: relationship,
        relationshipDetail: relationshipDetail,
        occupation: occupation,
        occupationDetail: occupationDetail,
        patientAddress: patientAddress,
        patientNoAndStreet: patientNoAndStreet,
        patientCity: patientCity,
        patientState: patientState,
        patientCountry: patientCountry,
        patientPhoneNumber: patientPhoneNumber,
        patientEmail: patientEmail,
      });
    } else {
      if (patientName === '') {
        seterrorMsg('Please enter patient name');
        setisModalVisible(true);
        return false;
      }
      if (!patientGender) {
        seterrorMsg('Please choose patient gender');
        setisModalVisible(true);
        return false;
      }
      if (!patientDob) {
        seterrorMsg('Please choose patient dob');
        setisModalVisible(true);
        return false;
      }
      if (patientAge === '') {
        seterrorMsg('Please enter patient age');
        setisModalVisible(true);
        return false;
      }
      if (relationship === '') {
        seterrorMsg('Please enter relationship');
        setisModalVisible(true);
        return false;
      }
    }
  };

  return (
    <View>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Name<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Name"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientName}
              keyboardType={'default'}
              onChangeText={(text) => setPatientName(text)}
              testID="editName"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Gender<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={patientGender === 'Male'}
              onPress={() => setPatientGender('Male')}
              testID="selectMale"
            />
            <Text style={styles.text}>Male</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={patientGender === 'Female'}
                onPress={() => setPatientGender('Female')}
                testID="selectFemale"
              />
              <Text style={styles.text}>Female</Text>
            </View>
            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={patientGender === 'Other'}
                onPress={() => setPatientGender('Other')}
                testID="selectOther"
              />
              <Text style={styles.text}>Other</Text>
            </View>
          </Item>
        </Col>
      </Row>

     
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            AGE(MA_ID)NO<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter age of the patient"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientAge}
              keyboardType={'number-pad'}
              onChangeText={(text) => setPatientAge(text)}
              testID="editAge"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Date Of Birth<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={openPicker}
              testID="editDOB">
              <Icon name="md-calendar" style={styles.calenderStyle} />
              <Text
                style={
                  patientDob
                    ? styles.timeplaceHolder
                    : styles.afterTimePlaceholder
                }>
                {patientDob
                  ? formatDate(patientDob, 'DD/MM/YYYY')
                  : 'Enter Date of birth of patient'}
              </Text>
              <DateTimePicker
                mode={'date'}
                // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                maximumDate={new Date()}
                value={patientDob}
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
            Relation to primary Insured<Text style={{color: 'red'}}>*</Text>
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
                setRelationship(sample);
              }}
              selectedValue={relationship}
              testID="editRelationShip">
              {dropdownData.map((value, key) => {
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
          <Text style={styles.text}>If other, details</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Specify your Relation"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={relationshipDetail}
              keyboardType={'default'}
              onChangeText={(text) => setRelationshipDetail(text)}
              testID="editRelationDetail"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Indicate occupation of patient</Text>

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
                setOccupation(sample);
              }}
              selectedValue={occupation}
              testID="editOccupation"
              >
              {Occupation.map((value, key) => {
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
          <Text style={styles.text}>If other, details</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Specify your ocupation"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={occupationDetail}
              keyboardType={'default'}
              onChangeText={(text) => setOccupationDetail(text)}
              testID="editOccupationDetail"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Address</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Address Details"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientAddress}
              keyboardType={'default'}
              onChangeText={(text) => setPatientAddress(text)}
              testID="editAddress"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>No and Street</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter No and Street"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientNoAndStreet}
              keyboardType={'default'}
              onChangeText={(text) => setPatientNoAndStreet(text)}
              testID="editNoAndStreet"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>City</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter City"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientCity}
              keyboardType={'default'}
              onChangeText={(text) => setPatientCity(text)}
              testID="editCity"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>State</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter State"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientState}
              keyboardType={'default'}
              onChangeText={(text) => setPatientState(text)}
              testID="editState"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Country</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Country"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientCountry}
              keyboardType={'default'}
              onChangeText={(text) => setPatientCountry(text)}
              testID="editCountry"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Phone Number</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Phone Number"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientPhoneNumber}
              keyboardType={'number-pad'}
              onChangeText={(text) => setPatientPhoneNumber(text)}
              testID="editMobileNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Email ID</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Email ID"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={patientEmail}
              keyboardType={'default'}
              onChangeText={(text) => setPatientEmail(text)}
              testID="editEmailId"
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() => submitData()}
          testID="submitDetails3">
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

export default InsuredPersonHospitalized;
