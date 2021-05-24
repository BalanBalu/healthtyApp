import React,{useEffect, useState} from 'react';
import { Text, View,Item, Input,} from 'native-base';
import { TouchableOpacity,  } from 'react-native'
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import {toastMeassage} from '../../../common';


const PrimaryInsuredBank = (props) => {
  const {updateSubmissionDetails} = props;
  const [PanCardDetail, setPanCardDetail] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeDetails, setChequeDetails] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  return (
    <View>
    <Row
      size={4}
      style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <Col size={1}>
        <Text style={styles.text}>PAN<Text style={{ color: 'red' }}>*</Text></Text>

        <Item regular style={{ borderRadius: 6, height: 35 }}>
          <Input
            placeholder="Enter PAN number"
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
              value={PanCardDetail}
            keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) =>setPanCardDetail(text)}

          />
        </Item>
      </Col>
    </Row>
    <Row
      size={4}
      style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <Col size={1}>
        <Text style={styles.text}>Account No<Text style={{ color: 'red' }}>*</Text></Text>

        <Item regular style={{ borderRadius: 6, height: 35 }}>
          <Input
            placeholder="Enter Bank Account No"
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
              value={accountNo}
            keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) =>setAccountNo(text)}

          />
        </Item>
      </Col>
    </Row>
    <Row
      size={4}
      style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <Col size={1}>
        <Text style={styles.text}>Bank Branch Name<Text style={{ color: 'red' }}>*</Text></Text>

        <Item regular style={{ borderRadius: 6, height: 35 }}>
          <Input
            placeholder="Enter Bank Branch Name"
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
              value={bankName}
            keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) =>setBankName(text)}

          />
        </Item>
      </Col>
    </Row>
    <Row
      size={4}
      style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <Col size={1}>
        <Text style={styles.text}>Cheque dd payable details<Text style={{ color: 'red' }}>*</Text></Text>

        <Item regular style={{ borderRadius: 6, height: 35 }}>
          <Input
            placeholder="Enter Cheque dd payable details"
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
              value={chequeDetails}
            keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) =>setChequeDetails(text)}
          />
        </Item>
      </Col>
    </Row>
    <Row
      size={4}
      style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      <Col size={1}>
        <Text style={styles.text}>IFSC Code<Text style={{ color: 'red' }}>*</Text></Text>

        <Item regular style={{ borderRadius: 6, height: 35 }}>
          <Input
            placeholder="Enter IFSC Code of bank branch "
            placeholderTextColor={'#CDD0D9'}
            returnKeyType={'next'}
              value={ifscCode}
            keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) =>setIfscCode(text)}

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


export default PrimaryInsuredBank