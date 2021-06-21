import React, { useEffect, useState } from 'react';
import { Text, View, Item, Input, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import styles from '../Styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';
import { toastMeassage } from '../../../common';

const DeclarationByHospital = (props) => {
  const { updateDeclarationByHospital } = props;
  const [declarationDate, setDeclarationDate] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [place, setPlace] = useState('');
  const [
    signatureOfHospitalAuthority,
    setSignatureOfHospitalAuthority,
  ] = useState('');
  const onPressConfirmDateValue = (date) => {
    setDeclarationDate(date);
    setIsVisible(false);
  };
  const onCancelPicker = () => {
    setIsVisible(false);
  };

  const openPicker = () => {
    setIsVisible(true);
  };

  return (
    <View>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Date<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={openPicker}
              testID="chooseDate">
              <Icon name="md-calendar" style={styles.calenderStyle} />
              <Text
                style={
                  declarationDate
                    ? styles.timeplaceHolder
                    : styles.afterTimePlaceholder
                }>
                {declarationDate
                  ? formatDate(declarationDate, 'DD/MM/YYYY')
                  : 'Admission Date'}
              </Text>
              <DateTimePicker
                mode={'date'}
                // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                // maximumDate={new Date()}
                value={declarationDate}
                isVisible={isVisible}
                onConfirm={onPressConfirmDateValue}
                onCancel={onCancelPicker}
              />
            </TouchableOpacity>
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Place<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Place"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={place}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setPlace(text)}
              testID="editPlace"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
        <Col size={1}>
          <Text style={styles.text}>
            Signature of hospital authority<Text style={{ color: 'red' }}>*</Text>
          </Text>

          <Item regular style={{ borderRadius: 6, height: 35 }}>
            <Input
              placeholder="Enter Signature of hospital authority"
              placeholderTextColor={'#CDD0D9'}
              style={styles.fontColorOfInput}
              returnKeyType={'next'}
              value={signatureOfHospitalAuthority}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setSignatureOfHospitalAuthority(text)}
              testID="editSignatureOfHospitalAuthority"
            />
          </Item>
        </Col>
      </Row>
      <View style={styles.ButtonView}>
        <TouchableOpacity
          style={styles.submit_ButtonStyle}
          onPress={() =>
            updateDeclarationByHospital({
                declarationDate: declarationDate,
                declarationPlace: place,
                authoritySign: signatureOfHospitalAuthority,
              })
          } testID="submitSection6">
          <Text style={{ color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeclarationByHospital;
