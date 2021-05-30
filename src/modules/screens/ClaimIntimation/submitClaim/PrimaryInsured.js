import React, {useEffect, useState, useRef} from 'react';
import {Text, View, Item, Input} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../Styles';
import {toastMeassage} from '../../../common';
import ModalPopup from '../../../../components/Shared/ModalPopup';

const PrimaryInsured = (props) => {
  const {claimListData, updatePrimaryInsuredDetails} = props;
  const [policyNo, setPolicyNo] = useState(claimListData.policyNo);
  const [certificateNo, setCertificateNo] = useState('');
  const [tpaID, setTPAID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [noAndStreet, setNoAndStreet] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNo, setPhoneNo] = useState(claimListData.contactNumber);
  const [emailId, setEmailId] = useState(claimListData.email);
  const [errorMsg, seterrorMsg] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);
  const inputEl1 = useRef(null);
  const inputEl2 = useRef(null);
  const inputEl3 = useRef(null);
  const inputEl4 = useRef(null);
  const inputEl5 = useRef(null);
  const inputEl6 = useRef(null);
  const inputEl7 = useRef(null);
  const inputEl8 = useRef(null);
  const inputEl9 = useRef(null);
  const inputEl10 = useRef(null);
  const inputEl11 = useRef(null);

  const submitData = () => {
    if (
      certificateNo != '' &&
      tpaID != '' &&
      firstName != '' &&
      lastName != '' &&
      pinCode != '' &&
      noAndStreet != '' &&
      address != '' &&
      city != '' &&
      state != '' &&
      country != '' &&
      phoneNo != '' &&
      emailId != ''
    ) {
      updatePrimaryInsuredDetails({
        certificateNumber: certificateNo,
        tpaIdNo: tpaID,
        policyHolderFirstName: firstName,
        policyHolderMiddleName: middleName,
        policyHolderLastName: lastName,
        policyHolderPincode: pinCode,
        noAndStreet: noAndStreet,
        holderAddress: address,
        policyHolderCity: city,
        policyHolderState: state,
        policyHolderCountry: country,
        phoneNumber: phoneNo,
        policyHolderMailId: emailId,
      });
    } else {
      if (certificateNo === '') {
        seterrorMsg('Please enter certificate number');
        setisModalVisible(true);
        return false;
      }
      if (tpaID === '') {
        seterrorMsg('Please enter tpa Id');
        setisModalVisible(true);
        return false;
      }
      if (firstName === '') {
        seterrorMsg('Please enter first name');
        setisModalVisible(true);
        return false;
      }
      if (lastName === '') {
        seterrorMsg('Please enter last name');
        setisModalVisible(true);
        return false;
      }
      if (pinCode === '') {
        seterrorMsg('Please enter pinCode');
        setisModalVisible(true);
        return false;
      }
      if (noAndStreet === '') {
        seterrorMsg('Please enter no and street');
        setisModalVisible(true);
        return false;
      }
      if (address === '') {
        seterrorMsg('Please enter address');
        setisModalVisible(true);
        return false;
      }
      if (city === '') {
        seterrorMsg('Please enter city');
        setisModalVisible(true);
        return false;
      }
      if (state === '') {
        seterrorMsg('Please enter state');
        setisModalVisible(true);
        return false;
      }
      if (country === '') {
        seterrorMsg('Please enter country');
        setisModalVisible(true);
        return false;
      }
      if (phoneNo === '') {
        seterrorMsg('Please enter phone number');
        setisModalVisible(true);
        return false;
      }
      if (emailId === '') {
        seterrorMsg('Please enter email id');
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
            Policy No.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Policy Number"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={claimListData.policyNo ? claimListData.policyNo : policyNo}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPolicyNo(text)}
              testID="editPolicyNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            SI No Certificate No.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Social Insurance Number"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={certificateNo}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCertificateNo(text)}
              onSubmitEditing={() => inputEl1.current._root.focus()}
              testID="editCertificateNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Company ITPA ID MA ID No.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter TPA ID"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={tpaID}
              ref={inputEl1}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setTPAID(text)}
              onSubmitEditing={() => inputEl2.current._root.focus()}
              testID="editTPAID"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            First Name.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter First Name"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={firstName}
              ref={inputEl2}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setFirstName(text)}
              onSubmitEditing={() => inputEl3.current._root.focus()}
              testID="editFirstName"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Middle Name</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Middle Name"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={middleName}
              ref={inputEl3}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setMiddleName(text)}
              onSubmitEditing={() => inputEl4.current._root.focus()}
              testID="editMiddleName"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Last Name.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Last Name"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={lastName}
              ref={inputEl4}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setLastName(text)}
              onSubmitEditing={() => inputEl5.current._root.focus()}
              testID="editLastName"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Pin Code.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Pin Code"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={pinCode}
              ref={inputEl5}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPinCode(text)}
              onSubmitEditing={() => inputEl6.current._root.focus()}
              testID="editPinCode"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            No and Street.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter No and Street"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={noAndStreet}
              ref={inputEl6}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setNoAndStreet(text)}
              onSubmitEditing={() => inputEl7.current._root.focus()}
              testID="editNoAndStreet"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Address.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Address"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={address}
              ref={inputEl7}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setAddress(text)}
              onSubmitEditing={() => inputEl8.current._root.focus()}
              testID="editAddress"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            City.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter City"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={city}
              ref={inputEl8}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCity(text)}
              onSubmitEditing={() => inputEl9.current._root.focus()}
              testID="editCity"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            State.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter State"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={state}
              ref={inputEl9}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setState(text)}
              onSubmitEditing={() => inputEl10.current._root.focus()}
              testID="editState"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Country.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Country"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={country}
              ref={inputEl10}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCountry(text)}
              onSubmitEditing={() => inputEl11.current._root.focus()}
              testID="editCountry"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Phone Number.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Phone Number"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              ref={inputEl11}
              value={
                claimListData.contactNumber
                  ? claimListData.contactNumber
                  : phoneNo
              }
              keyboardType={'number-pad'}
              editable={false}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPhoneNo(text)}
              testID="editPhoneNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Email ID.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Email ID"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={claimListData.email ? claimListData.email : emailId}
              editable={false}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setEmailId(text)}
              testID="editEmailId"
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() => submitData()}
          testID="submitDetails1">
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

export default PrimaryInsured;
