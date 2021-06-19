import React, {useEffect, useState,useRef} from 'react';
import {Text, View, Item, Input} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../Styles';
import ModalPopup from '../../../../components/Shared/ModalPopup';

const PrimaryInsuredBank = (props) => {
  const { updatePrimaryInsuredBankAccountDetails } = props;
  const [PanCardDetail, setPanCardDetail] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeDetails, setChequeDetails] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [isModalVisible, setisModalVisible] = useState(false);
  const inputEl1 = useRef(null);
  const inputEl2 = useRef(null);
  const inputEl3 = useRef(null);
  const inputEl4 = useRef(null);
  const inputEl5 = useRef(null);


  const submitData = () => {
    // if (
    //   PanCardDetail != '' &&
    //   accountNo != '' &&
    //   bankName != '' &&
    //   ifscCode != ''
    // ) {
      updatePrimaryInsuredBankAccountDetails({
        PanCardDetail: PanCardDetail,
        accountNo: accountNo,
        bankName: bankName,
        chequeDetails: chequeDetails?chequeDetails:null,
        ifscCode: ifscCode,
      });
    // } else {
    //   if (PanCardDetail === '') {
    //     seterrorMsg('Please enter pan number');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (accountNo === '') {
    //     seterrorMsg('Please enter account number');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (bankName === '') {
    //     seterrorMsg('Please enter bank name');
    //     setisModalVisible(true);
    //     return false;
    //   }
    //   if (ifscCode === '') {
    //     seterrorMsg('Please enter ifsc code');
    //     setisModalVisible(true);
    //     return false;
    //   }
    // }
  };

  return (
    <View>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            PAN<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter PAN number"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={PanCardDetail}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPanCardDetail(text)}
              onSubmitEditing={() => inputEl1.current._root.focus()}
              testID="editPanCardDetail"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Account No<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Bank Account No"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={accountNo}
              ref={inputEl1}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setAccountNo(text)}
              onSubmitEditing={() => inputEl2.current._root.focus()}
              testID="editAccountNo"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Bank Branch Name<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Bank Branch Name"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={bankName}
              ref={inputEl2}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setBankName(text)}
              onSubmitEditing={() => inputEl3.current._root.focus()}
              testID="editBankName"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>Cheque dd payable details</Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Cheque dd payable details"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={chequeDetails}
              ref={inputEl3}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setChequeDetails(text)}
              onSubmitEditing={() => inputEl4.current._root.focus()}
              testID="editChequeDetails"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            IFSC Code<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter IFSC Code of bank branch "
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={ifscCode}
              ref={inputEl4}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setIfscCode(text)}
              testID="editIfscCode"
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() => submitData()}
          testID="submitDetails7">
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

export default PrimaryInsuredBank;
