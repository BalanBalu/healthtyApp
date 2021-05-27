import React, { useEffect, useState } from 'react';
import { Text, View, Item, Input, Radio, CheckBox } from 'native-base';
import { TouchableOpacity, FlatList } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import { toastMeassage, acceptNumbersOnly } from '../../../common';

const ClaimDetail = (props) => {
  const { ListOfData, checkBoxClick, updateClaimDetails } = props;
  const [
    preHospitalizationExpenses,
    setPreHospitalizationExpenses,
  ] = useState();
  const [hospitalizationExpenses, setHospitalizationExpenses] = useState();
  const [
    postHospitalizationExpenses,
    setPostHospitalizationExpenses,
  ] = useState();
  const [healthCheckupCost, setHealthCheckupCost] = useState();
  const [ambulanceCharges, setAmbulanceCharges] = useState();
  const [othersCode, setOthersCode] = useState();
  const [totalClaim, setTotalClaim] = useState();
  const [preHospitalizationPeriod, setPreHospitalizationPeriod] = useState('');
  const [postHospitalizationPeriod, setPostHospitalizationPeriod] = useState(
    '',
  );
  const [
    claimForDomiciliaryHospitalization,
    setClaimForDomiciliaryHospitalization,
  ] = useState('');
  const [hospitalDailyCash, setHospitalDailyCash] = useState('');
  const [surgicalCash, setSurgicalCash] = useState('');
  const [criticalIllness, setCriticalIllness] = useState('');
  const [convalescence, setConvalescence] = useState('');
  const [lumsumBenefit, setLumsumBenefit] = useState('');
  const [others, setOthers] = useState('');
  const [totalClaimValue, setTotalClaimValue] = useState();
  const [claimFormDulySigned, setCheckBox1] = useState(false);
  const [copyOfClaimIntimation, setCheckBox2] = useState(false);
  const [hospitalMainBill, setCheckBox3] = useState(false);
  const [hospitalBreakupBill, setCheckBox4] = useState(false);
  const [hospitalBillPaymentReceipt, setCheckBox5] = useState(false);
  const [hospitalDischargeSummary, setCheckBox6] = useState(false);
  const [ecg, setCheckBox7] = useState(false);
  const [requestForInvestigation, setCheckBox8] = useState(false);
  const [doctorPrescription, setCheckBox9] = useState(false);
  const [pharmacyBill, setCheckBox10] = useState(false);
  const [OthersClaim, setCheckBox11] = useState(false);
  const [investigationReports, setCheckBox12] = useState(false);
  // const [calculation, setCalculation] = useState(0);

  console.log('total', totalClaim);
  console.log('totalClaimValue', totalClaimValue);
  return (
    <View>
      <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 10 }}>
        Details of treatment expenses claimed
      </Text>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Enter Pre hospitalization Expense
            <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Pre hospitalization Expense"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={preHospitalizationExpenses}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setPreHospitalizationExpenses(text), setTotalClaim(text))
                  : null
              }
              testID="editPreHospitalizationExpenses"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Enter Hospitalization Expenses<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Hospitalization Expenses"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={hospitalizationExpenses}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setHospitalizationExpenses(text),
                    setTotalClaim(
                      parseInt(text) + parseInt(preHospitalizationExpenses),
                    ))
                  : null
              }
              testID="editHospitalizationExpenses"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Enter Post hospitalization Expense
            <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Post hospitalization Expense"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={postHospitalizationExpenses}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setPostHospitalizationExpenses(text),
                    setTotalClaim(
                      parseInt(text) +
                      parseInt(preHospitalizationExpenses) +
                      parseInt(hospitalizationExpenses),
                    ))
                  : null
              }
              testID="editPostHospitalizationExpenses"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Enter Health checkup costs<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Health checkup costs in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={healthCheckupCost}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setHealthCheckupCost(text),
                    setTotalClaim(
                      parseInt(text) +
                      parseInt(preHospitalizationExpenses) +
                      parseInt(hospitalizationExpenses) +
                      parseInt(postHospitalizationExpenses),
                    ))
                  : null
              }
              testID="editHealthCheckupCost"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Enter Ambulance charges<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Ambulance charges"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={ambulanceCharges}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setAmbulanceCharges(text),
                    setTotalClaim(
                      parseInt(text) +
                      parseInt(preHospitalizationExpenses) +
                      parseInt(hospitalizationExpenses) +
                      parseInt(postHospitalizationExpenses) +
                      parseInt(healthCheckupCost),
                    ))
                  : null
              }
              testID="editAmbulanceCharges"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Others code<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Others code"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={othersCode}
              keyboardType={'number-pad'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setOthersCode(text),
                    setTotalClaim(
                      parseInt(text) +
                      parseInt(preHospitalizationExpenses) +
                      parseInt(hospitalizationExpenses) +
                      parseInt(postHospitalizationExpenses) +
                      parseInt(healthCheckupCost) +
                      parseInt(ambulanceCharges),
                    ))
                  : null
              }
              testID="editOthersCode"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            TOTAL<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter TOTAL"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={String(totalClaim)}
              editable={false}
              keyboardType={'number-pad'}
              onChangeText={(test) => setTotalClaim(test)}
              testID="editTotalClaim"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Pre Hospitalization period<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Pre Hospitalization period"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={preHospitalizationPeriod}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? setPreHospitalizationPeriod(text)
                  : null
              }
              testID="editPreHospitalizationPeriod"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Post Hospitalization period<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Post Hospitalization period"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={postHospitalizationPeriod}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? setPostHospitalizationPeriod(text)
                  : null
              }
              testID="editPostHospitalizationPeriod"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Claim for domiciliary hospitalization
            <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={claimForDomiciliaryHospitalization === true}
              onPress={() => setClaimForDomiciliaryHospitalization(true)}
              testID="selectClaimForDomiciliaryHospitalization"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={claimForDomiciliaryHospitalization === false}
                onPress={() => setClaimForDomiciliaryHospitalization(false)}
                testID="selectNoClaimForDomiciliaryHospitalization"
              />
              <Text style={styles.text}>No</Text>
              <Text style={{ width: '80%', marginTop: 10 }}>
                {' '}
                If yes, provide details in annexure
              </Text>
            </View>
          </Item>
        </Col>
      </Row>
      <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 10 }}>
        Details of lump sum cash claimed
      </Text>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Hospital daily cash<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter health ceckup cost in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={hospitalDailyCash}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setHospitalDailyCash(text),
                    setTotalClaimValue(parseInt(text)))
                  : null
              }
              testID="editHospitalDailyCash"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Surgical cash<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Surgical cash"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={surgicalCash}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setSurgicalCash(text), setTotalClaimValue(
                    parseInt(text) +
                    parseInt(hospitalDailyCash)
                  ))
                  : null
              }
              testID="editSurgicalCash"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Critical illness benefit<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={criticalIllness}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setCriticalIllness(text), setTotalClaimValue(
                    parseInt(text) +
                    parseInt(hospitalDailyCash) +
                    parseInt(surgicalCash)
                  ))
                  : null
              }
              testID="editCriticalIllness"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            CONVALESCENCE<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={convalescence}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setConvalescence(text), setTotalClaimValue(
                    parseInt(text) +
                    parseInt(hospitalDailyCash) +
                    parseInt(surgicalCash) + parseInt(criticalIllness)))
                  : null
              }
              testID="editConvalescence"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Pre post Lump sum benefit<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={lumsumBenefit}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setLumsumBenefit(text), setTotalClaimValue(
                    parseInt(text) +
                    parseInt(hospitalDailyCash) +
                    parseInt(surgicalCash) + parseInt(criticalIllness) + parseInt(convalescence)))
                  : null
              }
              testID="editLumsumBenefit"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Others<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={others}
              keyboardType={'number-pad'}
              onChangeText={(text) =>
                acceptNumbersOnly(text) == true || text === ''
                  ? (setOthers(text), setTotalClaimValue(
                    parseInt(text) +
                    parseInt(hospitalDailyCash) +
                    parseInt(surgicalCash) + parseInt(criticalIllness) + parseInt(convalescence) + parseInt(lumsumBenefit10)))
                  : null
              }
              testID="editOthers"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            TOTAL<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter in Rs"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={String(totalClaimValue)}
              editable={false}
              keyboardType={'number-pad'}
              onChangeText={(text) => setTotalClaimValue(text)}
              testID="editTotalClaimValue"
            />
          </Item>
        </Col>
      </Row>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={claimFormDulySigned ? true : false}
          checked={claimFormDulySigned == true}
          onPress={() => setCheckBox1(true)}
          testID="selectCheckBox1"
        />
        <Text style={styles.flatlistText}>Claim form duly signed</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={copyOfClaimIntimation ? true : false}
          checked={copyOfClaimIntimation == true}
          onPress={() => setCheckBox2(true)}
          testID="selectCheckBox2"
        />
        <Text style={styles.flatlistText}>
          Copy of the claim intimation, if any
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={hospitalMainBill ? true : false}
          checked={hospitalMainBill == true}
          onPress={() => setCheckBox3(true)}
          testID="selectCheckBox3"
        />
        <Text style={styles.flatlistText}>Hospital main bill</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={hospitalBreakupBill ? true : false}
          checked={hospitalBreakupBill == true}
          onPress={() => setCheckBox4(true)}
          testID="selectCheckBox4"
        />
        <Text style={styles.flatlistText}>Hospital Break-up bill</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={hospitalBillPaymentReceipt ? true : false}
          checked={hospitalBillPaymentReceipt == true}
          onPress={() => setCheckBox5(true)}
          testID="selectCheckBox5"
        />
        <Text style={styles.flatlistText}>Hospital bill payment receipt</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={hospitalDischargeSummary ? true : false}
          checked={hospitalDischargeSummary == true}
          onPress={() => setCheckBox6(true)}
          testID="selectCheckBox6"
        />
        <Text style={styles.flatlistText}>Hospital Discharge Summary</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={ecg ? true : false}
          checked={ecg == true}
          onPress={() => setCheckBox7(true)}
          testID="selectCheckBox7"
        />
        <Text style={styles.flatlistText}>ECG</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={requestForInvestigation ? true : false}
          checked={requestForInvestigation == true}
          onPress={() => setCheckBox8(true)}
          testID="selectCheckBox8"
        />
        <Text style={styles.flatlistText}>
          Doctor request for investigation
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={doctorPrescription ? true : false}
          checked={doctorPrescription == true}
          onPress={() => setCheckBox9(true)}
          testID="selectCheckBox9"
        />
        <Text style={styles.flatlistText}>Doctor Prescription</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={pharmacyBill ? true : false}
          checked={pharmacyBill == true}
          onPress={() => setCheckBox10(true)}
          testID="selectCheckBox10"
        />
        <Text style={styles.flatlistText}>Pharmacy Bill</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={OthersClaim ? true : false}
          checked={OthersClaim == true}
          onPress={() => setCheckBox11(true)}
          testID="selectCheckBox11"
        />
        <Text style={styles.flatlistText}>Others</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 10,
        }}>
        <CheckBox
          style={{ borderRadius: 5 }}
          status={investigationReports ? true : false}
          checked={investigationReports == true}
          onPress={() => setCheckBox12(true)}
          testID="selectCheckBox12"
        />
        <Text style={styles.flatlistText}>
          Investigation reports including(including CT/MRI/USG/HPE)
        </Text>
      </View>

      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() =>
            updateClaimDetails({
              preHospitalizationExpenses: preHospitalizationExpenses,
              hospitalizationExpenses: hospitalizationExpenses,
              postHospitalizationExpenses: postHospitalizationExpenses,
              healthCheckupCost: healthCheckupCost,
              ambulanceCharges: ambulanceCharges,
              othersCode: othersCode,
              totalClaim: totalClaim,
              preHospitalizationPeriod: preHospitalizationPeriod,
              postHospitalizationPeriod: postHospitalizationPeriod,
              claimForDomiciliaryHospitalization: claimForDomiciliaryHospitalization,
              hospitalDailyCash: hospitalDailyCash,
              surgicalCash: surgicalCash,
              criticalIllness: criticalIllness,
              convalescence: convalescence,
              lumsumBenefit: lumsumBenefit,
              others: others,
              totalClaimValue: totalClaimValue,
              claimFormDulySigned: claimFormDulySigned,
              copyOfClaimIntimation: copyOfClaimIntimation,
              hospitalMainBill: hospitalMainBill,
              hospitalBreakupBill: hospitalBreakupBill,
              hospitalBillPaymentReceipt: hospitalBillPaymentReceipt,
              hospitalDischargeSummary: hospitalDischargeSummary,
              ecg: ecg,
              requestForInvestigation: requestForInvestigation,
              doctorPrescription: doctorPrescription,
              pharmacyBill: pharmacyBill,
              OthersClaim: OthersClaim,
              investigationReports: investigationReports,
            })
          }
          testID="submitDetails4">
          <Text style={{ color: '#fff' }}>Submit And Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClaimDetail;
