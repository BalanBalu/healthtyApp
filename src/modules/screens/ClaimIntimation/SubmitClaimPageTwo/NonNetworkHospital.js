import React, { useEffect, useState } from 'react';
import { Text, View, Item, Input, Radio } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import {primaryColor} from '../../../../setup/config';
import {toastMeassage} from '../../../common';
import ModalPopup from '../../../../components/Shared/ModalPopup';

const NonNetworkHospital = (props) => {
  const {updateNonNetworkHospital} = props;
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState();
  const [noAndStreet, setNoAndStreet] = useState('');
  const [city, setCity] = useState();
  const [state, setState] = useState(false);
  const [country, setCountry] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [stateCode, setStateCode] = useState();
  const [hospitalPan, setHospitalPan] = useState('');
  const [noOfInpatientBeds, setNoOfInpatientBeds] = useState('');
  const [ot, setOT] = useState();
  const [icu, setICU] = useState();
  const [others, setOthers] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);

  const submitData = () => {
    // if (
    //   address != '' &&
    //   pinCode != '' &&
    //   state != '' &&
    //   city != '' &&
    //   noAndStreet != '' &&
    //   country != ''
    // ) {
      updateNonNetworkHospital({
        nonNetworkHospitalAddress: address,
        nonNetworkHospitalPinCode: pinCode,
        nonNetworkHospitalState: state,
        nonNetworkHospitalCity: city,
        nonNetworkHospitalNoAndStreet: noAndStreet,
        nonNetworkHospitalCountry: country,
        nonNetworkHospitalRegistrationStateCode: stateCode,
        nonNetworkHospitalPlan: hospitalPan,
        nonNetworkHospitalMobileNumber: phoneNo,
        nonNetworkHospitalInpatientBeds: noOfInpatientBeds,
        othersNonNetworkHospital: others,
        OT: ot,
        ICU: icu,
      });
    // } else {
    //   if (address === '') {
    //     seterrorMsg('Please enter address');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (pinCode === '') {
    //     seterrorMsg('Please enter pinCode');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (noAndStreet === '') {
    //     seterrorMsg('Please enter no and street');
    //     setisModalVisible(true);
    //     return false;
    //   }

    //   if (city === '') {
    //     seterrorMsg('Please enter city');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (state === '') {
    //     seterrorMsg('Please enter state');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (country === '') {
    //     seterrorMsg('Please enter country');
    //     setisModalVisible(true);
    //     return false;
    //   }
    // }
  };

  return (
    <View>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Address.<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Address"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={address}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setAddress(text)}
              testID="editAddress"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            PinCode.<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter PinCode."
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={pinCode}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPinCode(text)}
              testID="editPinCode"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            No and Street.<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter No and Street"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={noAndStreet}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setNoAndStreet(text)}
              testID="editNoAndStreet"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            City.<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter City"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={city}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCity(text)}
              testID="editCity"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            State.<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter State"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={state}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setState(text)}
              testID="editState"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Country.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Country"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={country}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCountry(text)}
              testID="editCountry"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Phone Number</Text>
          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Phone Number"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={phoneNo}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPhoneNo(text)}
              testID="editPhoneNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Registration with state code</Text>
          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Registration with state code"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={stateCode}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setStateCode(text)}
              testID="editStateCode"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Hospital PAN</Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Hospital PAN"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={hospitalPan}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setHospitalPan(text)}
              testID="editHospitalPan"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Number of inpatient beds</Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Number of inpatient beds "
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={noOfInpatientBeds}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setNoOfInpatientBeds(text)}
              testID="editNoOfInpatientBeds"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Facilities available in hospital{' '}</Text>

          <Text style={styles.text}>
            OT<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={ot === true}
              onPress={() => setOT(true)}
              testID="selectOt"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={ot === false}
                onPress={() => setOT(false)}
                testID="selectNoOt"
              />
              <Text style={styles.text}>No</Text>
            </View>
          </Item>

          <Text style={styles.text}>
            ICU<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={icu === true}
              onPress={() => setICU(true)}
              testID="selectICU"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={icu === false}
                onPress={() => setICU(false)}
                testID="selectNOICU"
              />
              <Text style={styles.text}>No</Text>
            </View>
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>Others</Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Others"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={others}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setOthers(text)}
              testID="editOthers"
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() => submitData()}
          testID="submitSection5">
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

export default NonNetworkHospital;
