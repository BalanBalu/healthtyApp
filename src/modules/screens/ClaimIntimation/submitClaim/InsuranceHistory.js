import React, { useEffect, useState } from 'react';
import { Text, View, Item, Input, Radio, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import { primaryColor } from '../../../../setup/config';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';
import { toastMeassage } from '../../../common';

const InsuranceHistory = (props) => {
  const { claimListData, updateInsuranceHistoryDetails } = props;

  const [currentlyHaveMediClaim, setCurrentlyHaveMediClaim] = useState(true);
  const [
    commencementOfFirstInsuranceDate,
    setCommencementOfFirstInsuranceDate,
  ] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [mediClaimCompanyName, setMediClaimCompanyName] = useState('');
  const [hospitalized, setHospitalized] = useState(true);
  const [sumInsuresPerPolicy, setSumInsuresPerPolicy] = useState('');
  const [hospitalizationDate, setHospitalizationDate] = useState();
  const [
    isVisibleHospitalizationDate,
    setIsVisibleHospitalizationDate,
  ] = useState(false);
  const [diagnosisDetails, setDiagnosisDetails] = useState('');
  const [hospitalizedCompany, setHospitalizedCompany] = useState('');
  const [isCoveredByOtherClaim, setIsCoveredByOtherClaim] = useState(true);

  const onPressConfirmDateValue = (date) => {
    setCommencementOfFirstInsuranceDate(date);
    setIsVisible(false);
  };
  const onCancelInsurancePicker = () => {
    setIsVisible(false);
  };
  const onPressHospitalizationDate = (date) => {
    setHospitalizationDate(date);
    setIsVisibleHospitalizationDate(false);
  };
  const oncancelHospitalizationDatePicker = () => {
    setIsVisibleHospitalizationDate(false);
  };

  const openPicker = () => {
    setIsVisible(true);
  };
  const openHospitalizationPicker = () => {
    setIsVisibleHospitalizationDate(true);
  };

  return (
    <View>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Currently have mediclaim?<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={currentlyHaveMediClaim}
              onPress={() => setCurrentlyHaveMediClaim(true)}
              testID="selectCurrentlyHaveMediClaim"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={!currentlyHaveMediClaim}
                onPress={() => setCurrentlyHaveMediClaim(false)}
                testID="selectNoCurrentlyHaveMediClaim"
              />
              <Text style={styles.text}>No</Text>
            </View>
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            commencement of first insurance without break.
            <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={openPicker}
              testID="selectCommencementOfFirstInsuranceDate">
              <Icon name="md-calendar" style={styles.calenderStyle} />
              <Text
                style={
                  commencementOfFirstInsuranceDate
                    ? styles.timeplaceHolder
                    : styles.afterTimePlaceholder
                }>
                {commencementOfFirstInsuranceDate
                  ? formatDate(commencementOfFirstInsuranceDate, 'DD/MM/YYYY')
                  : 'Date of Admission'}
              </Text>
              <DateTimePicker
                mode={'date'}
                // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                // maximumDate={new Date()}
                value={commencementOfFirstInsuranceDate}
                isVisible={isVisible}
                onConfirm={onPressConfirmDateValue}
                onCancel={onCancelInsurancePicker}
              />
            </TouchableOpacity>
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            If, yes company name<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter full name of Insurance company"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={mediClaimCompanyName}
              keyboardType={'default'}
              onChangeText={(text) => setMediClaimCompanyName(text)}
              testID="editMediClaimCompanyName"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Have you been hospitalized in the last four years since inception of
            the confract?<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={hospitalized}
              onPress={() => setHospitalized(true)}
              testID="selectHospitalized"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={!hospitalized}
                onPress={() => setHospitalized(false)}
                testID="selectNoHospitalized"
              />
              <Text style={styles.text}>No</Text>
            </View>
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Sum Insured<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter fSum Insured in RS"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={sumInsuresPerPolicy}
              keyboardType={'number-pad'}
              onChangeText={(text) => setSumInsuresPerPolicy(text)}
              testID="editSumInsuresPerPolicy"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Date of hospitalization<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={openHospitalizationPicker}
              testID="selectHospitalizationDate">
              <Icon name="md-calendar" style={styles.calenderStyle} />
              <Text
                style={
                  hospitalizationDate
                    ? styles.timeplaceHolder
                    : styles.afterTimePlaceholder
                }>
                {hospitalizationDate
                  ? formatDate(hospitalizationDate, 'DD/MM/YYYY')
                  : 'Date of hospitalization'}
              </Text>
              <DateTimePicker
                mode={'date'}
                // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                // maximumDate={new Date()}
                value={hospitalizationDate}
                isVisible={isVisibleHospitalizationDate}
                onConfirm={onPressHospitalizationDate}
                onCancel={oncancelHospitalizationDatePicker}
              />
            </TouchableOpacity>
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Diagnosis<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter the Diagnosis details"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={diagnosisDetails}
              keyboardType={'default'}
              onChangeText={(text) => setDiagnosisDetails(text)}
              testID="editDiagnosisDetails"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            If, yes company name<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter the full name of Insurance company"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={hospitalizedCompany}
              keyboardType={'default'}
              onChangeText={(text) => setHospitalizedCompany(text)}
              testID="editHospitalizedCompany"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Previously covered by other mediclaim?
            <Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item style={{ borderRadius: 6, height: 35, borderBottomWidth: 0 }}>
            <Radio
              color={primaryColor}
              selectedColor={primaryColor}
              standardStyle={true}
              selected={isCoveredByOtherClaim}
              onPress={() => setIsCoveredByOtherClaim(true)}
              testID="selectIsCoveredByOtherClaim"
            />
            <Text style={styles.text}>Yes</Text>

            <View style={styles.radioButtonStyle}>
              <Radio
                color={primaryColor}
                selectedColor={primaryColor}
                standardStyle={true}
                selected={!isCoveredByOtherClaim}
                onPress={() => setIsCoveredByOtherClaim(false)}
                testID="selectNoIsCoveredByOtherClaim"
              />
              <Text style={styles.text}>No</Text>
            </View>
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() =>
            updateInsuranceHistoryDetails({
              currentlyHaveMediClaim: currentlyHaveMediClaim,
              commencementOfFirstInsuranceDate: commencementOfFirstInsuranceDate,
              mediClaimCompanyName: mediClaimCompanyName,
              hospitalized: hospitalized,
              sumInsuresPerPolicy: sumInsuresPerPolicy,
              hospitalizationDate: hospitalizationDate,
              diagnosisDetails: diagnosisDetails,
              hospitalizedCompany: hospitalizedCompany,
              isCoveredByOtherClaim: isCoveredByOtherClaim,
            })
          }
          testID="submitDetails2">
          <Text style={{ color: '#fff' }}>Submit And Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsuranceHistory;
