import React, {useEffect, useState} from 'react';
import {Text, View, Item, Input, Radio} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../Styles';
import {primaryColor} from '../../../../setup/config';

const NonNetworkHospital = (props) => {
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
  const [hospitalFalitilies, setHospitalFalitilies] = useState();
  const [icu, setICU] = useState();
  const [others, setOthers] = useState('');
  return (
    <View>
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
            PinCode.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter PinCode."
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={pinCode}
              keyboardType={'default'}
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
            Country<Text style={{color: 'red'}}>*</Text>
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
              value={phoneNo}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPhoneNo(text)}
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Registration with state code.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Registration with state code"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={stateCode}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setStateCode(text)}
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Hospital PAN.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Hospital PAN"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={hospitalPan}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setHospitalPan(text)}
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Number of inpatient beds .<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Number of inpatient beds "
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={noOfInpatientBeds}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setNoOfInpatientBeds(text)}
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Facilities available in hospital{' '}
            <Text style={{color: 'red'}}>*</Text>
          </Text>

          <Text style={styles.text}>
            OT<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={hospitalFalitilies === 'Male'}
              onPress={() => setHospitalFalitilies('Male')}
            />
            <Text style={styles.text}>Male</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={hospitalFalitilies === 'Female'}
                onPress={() => setHospitalFalitilies('Female')}
              />
              <Text style={styles.text}>Female</Text>
            </View>
            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={hospitalFalitilies === 'Other'}
                onPress={() => setHospitalFalitilies('Other')}
              />
              <Text style={styles.text}>Other</Text>
            </View>
          </Item>

          <Text style={styles.text}>
            ICU<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item style={{borderRadius: 6, height: 35, borderBottomWidth: 0}}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={icu === 'Male'}
                onPress={() => setICU('Male')}
            />
            <Text style={styles.text}>Male</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={icu === 'Female'}
                onPress={() => setICU('Female')}
              />
              <Text style={styles.text}>Female</Text>
            </View>
            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={icu === 'Other'}
                onPress={() => setICU('Other')}
              />
              <Text style={styles.text}>Other</Text>
            </View>
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Others.<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Others"
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
                value={others}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
                onChangeText={(text) =>setOthers(text)}
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity style={styles.submit_ButtonStyle}>
          <Text style={{color: '#fff'}}>Submit And Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NonNetworkHospital;
