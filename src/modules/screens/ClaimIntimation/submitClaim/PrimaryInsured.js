import React, {useEffect, useState} from 'react';
import {Text, View, Item, Input} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../Styles';
import {toastMeassage} from '../../../common';

const PrimaryInsured = (props) => {
  const {claimListData, submissionDetails} = props;
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

  //    submissionDetails = () => {
  //     if (
  //       policyNo &&
  //       certificateNo &&
  //       tpaID &&
  //       firstName &&
  //       middleName &&
  //       lastName &&
  //       pinCode &&
  //       noAndStreet &&
  //       address &&
  //       city &&
  //       state &&
  //       country &&
  //       phoneNo &&
  //       emailId
  //     ) {
  //       let data = {
  //         certificateNumber: certificateNo,
  //         tpaIdNo: tpaID,
  //         policyHolderFirstName: firstName,
  //         policyHolderMiddleName: middleName,
  //         policyHolderLastName: lastName,
  //         policyHolderPincode: pinCode,
  //         noAndStreet: noAndStreet,
  //         holderAddress: address,
  //         policyHolderCity: city,
  //         policyHolderState: state,
  //         policyHolderCountry: country,
  //         phoneNumber: phoneNo,
  //         policyHolderMailId: emailId,
  //       };
  //       console.log("data>>>",data.certificateNumber)
  //       return data
  //     }else{
  //         toastMeassage('Unable to Submit Claim, Please fill all details');

  //     }
  //   };
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
              onChangeText={(text) => {
                console.log(text), setPolicyNo(text);
              }}
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
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setTPAID(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setFirstName(text)}
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Middle Name.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Middle Name"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={middleName}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setMiddleName(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setLastName(text)}
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
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPinCode(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setNoAndStreet(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setAddress(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCity(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setState(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setCountry(text)}
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
              value={
                claimListData.contactNumber
                  ? claimListData.contactNumber
                  : phoneNo
              }
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPhoneNo(text)}
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
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setEmailId(text)}
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() =>
            policyNo &&
            certificateNo &&
            tpaID &&
            firstName &&
            middleName &&
            lastName &&
            pinCode &&
            noAndStreet &&
            address &&
            city &&
            state &&
            country &&
            phoneNo &&
            emailId
              ? submissionDetails({
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
                })
              : toastMeassage('Unable to Submit Claim, Please fill all details')
          }>
          <Text style={{color: '#fff'}}>Submit And Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrimaryInsured;
