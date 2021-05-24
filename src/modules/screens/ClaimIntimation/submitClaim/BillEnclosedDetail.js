import React, {useEffect, useState} from 'react';
import {Text, View, Input, Icon, FlatList, Item,ListItem} from 'native-base';
import {TouchableOpacity} from 'react-native';
import styles from '../Styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {subTimeUnit, formatDate} from '../../../../setup/helpers';
import {toastMeassage} from '../../../common';
import {Col, Row} from 'react-native-easy-grid';

const BillEnclosedDeatil = (props) => {
  const {updateBillsEnclosedDetails} = props;

  const [billNo, setBillNo] = useState('');
  const [
    dateOfHospitalizationForBill,
    setDateOfHospitalizationForBill,
  ] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [issuedBy, setIssuedBy] = useState('');
  const [towards, setTowards] = useState('');
  const [amount, setAmount] = useState('');
  const [bilEnclosedList, setBilEnclosedList] = useState([]);

  const onPressConfirmDateValue = (date) => {
    setDateOfHospitalizationForBill(date);
    setIsVisible(false);
  };
  const onCancelPicker = () => {
    setIsVisible(false);
  };

  const openPicker = () => {
    setIsVisible(true);
  };

  const addTable = () => {
    // let bilEnclosedData = [];
    bilEnclosedList.push({
      billNo: billNo,
      dateOfHospitalizationForBill: dateOfHospitalizationForBill,
      issuedBy: issuedBy,
      towards: towards,
      amount: amount,
    });
     setBilEnclosedList(bilEnclosedList);
     console.log('bilEnclosedList', bilEnclosedList);

  };

 const renderItem = ({ item }) => {
    <View style={{padding: 10, marginTop: 10, marginBottom: 20}}>
      <View style={styles.form_field_view}>
        <Text style={[styles.form_field_inline_label]}>SL No</Text>
        <Text
          style={[
            styles.form_field,
            {paddingTop: 15, paddingLeft: 10},
          ]}>
          1
        </Text>
      </View>
      <View style={styles.form_field_view}>
        <Text style={[styles.form_field_inline_label]}>BILL No</Text>
        {/* <Text style={styles.form_field}>{item.billNo}</Text> */}
        <Input
          placeholder="Enter BILL No "
          placeholderTextColor={'#CDD0D9'}
          returnKeyType={'next'}
          value={item.billNo}
          style={styles.form_field}
          keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) => setBillNo(text)}
          testID="editBillNo"
        />
      </View>
      <View style={styles.form_field_view}>
        <View
          style={[
            styles.form_field_inline_label,
            {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text style={{fontSize: 12}}>Date of</Text>

          <Text style={{fontSize: 12}}>hospitalization</Text>
        </View>
        <TouchableOpacity
          style={[styles.form_field, {flexDirection: 'row'}]}
          onPress={openPicker}>
          <Icon name="md-calendar" style={styles.calenderStyle} />
          <Text
            style={
              item.dateOfHospitalizationForBill
                ? styles.timeplaceHolder
                : styles.afterTimePlaceholder
            }>
            {item.dateOfHospitalizationForBill
              ? formatDate(dateOfHospitalizationForBill, 'DD/MM/YYYY')
              : new Date()}
          </Text>
          <DateTimePicker
            mode={'date'}
            // minimumDate={subTimeUnit(new Date(), 7, 'days')}
            // maximumDate={new Date()}
            value={item.dateOfHospitalizationForBill}
            isVisible={isVisible}
            onConfirm={onPressConfirmDateValue}
            onCancel={onCancelPicker}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.form_field_view}>
        <Text style={[styles.form_field_inline_label]}>
          Inssured by
        </Text>
        <Input
          placeholder="Enter Inssured by details "
          placeholderTextColor={'#CDD0D9'}
          returnKeyType={'next'}
          value={item.issuedBy}
          style={styles.form_field}
          keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) => setIssuedBy(text)}
          testID="editIssuedBy"
        />
      </View>
      <View style={styles.form_field_view}>
        <Text style={[styles.form_field_inline_label]}>Towards</Text>
        <Input
          placeholder="Enter Towards details "
          placeholderTextColor={'#CDD0D9'}
          returnKeyType={'next'}
          value={item.towards}
          style={styles.form_field}
          keyboardType={'default'}
          //   editable={employeeId == undefined ? true : false}
          onChangeText={(text) => setTowards(text)}
          testID="editTowards"
        />
      </View>
      <View style={styles.form_field_view}>
        <Text style={[styles.form_field_inline_label]}>AMOUNT(RS)</Text>
        <Input
          placeholder="Enter Amount "
          placeholderTextColor={'#CDD0D9'}
          returnKeyType={'next'}
          value={item.amount}
          style={styles.form_field}
          keyboardType={'number-pad'}
          onChangeText={(text) => setAmount(text)}
          testID="editAmount"
        />
      </View>
    </View>
 }

  console.log('bilEnclosedList', bilEnclosedList.length);

  return (
    <View>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Bill No<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter BILL No "
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={billNo}
              style={styles.form_field}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setBillNo(text)}
              testID="addBillNo"
            />
          </Item>
        </Col>
      </Row>

      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Date of hospitalization<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={openPicker}
              testID="chooseDateOfHospitalizationForBill">
              <Icon name="md-calendar" style={styles.calenderStyle} />
              <Text
                style={
                  dateOfHospitalizationForBill
                    ? styles.timeplaceHolder
                    : styles.afterTimePlaceholder
                }>
                {dateOfHospitalizationForBill
                  ? formatDate(dateOfHospitalizationForBill, 'DD/MM/YYYY')
                  : 'Date of hospitalization'}
              </Text>
              <DateTimePicker
                mode={'date'}
                //  minimumDate={subTimeUnit(new Date(), 7, 'days')}
                //  maximumDate={new Date()}
                value={dateOfHospitalizationForBill}
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
            Issued by<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Inssured by details "
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={issuedBy}
              style={styles.form_field}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setIssuedBy(text)}
              testID="addIssuedBy"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Towards<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Towards details "
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={towards}
              style={styles.form_field}
              keyboardType={'default'}
              //   editable={employeeId == undefined ? true : false}
              onChangeText={(text) => setTowards(text)}
              testID="addTowards"
            />
          </Item>
        </Col>
      </Row>
      <Row size={4} style={{marginLeft: 20, marginRight: 20, marginTop: 10}}>
        <Col size={1}>
          <Text style={styles.text}>
            Amount<Text style={{color: 'red'}}>*</Text>
          </Text>

          <Item regular style={{borderRadius: 6, height: 35}}>
            <Input
              placeholder="Enter Amount "
              placeholderTextColor={'#CDD0D9'}
              returnKeyType={'next'}
              value={amount}
              style={styles.form_field}
              keyboardType={'number-pad'}
              onChangeText={(text) => setAmount(text)}
              testID="addAmount"
            />
          </Item>
        </Col>
      </Row>

      <View style={styles.ButtonView}>
        <TouchableOpacity style={styles.submit_ButtonStyle} onPress={addTable}>
          <Text style={{color: '#fff'}}>Save</Text>
        </TouchableOpacity>
      </View>
      {/* {bilEnclosedList.length!=0 ? ( */}
        <FlatList
          data={bilEnclosedList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      {/* ) : null} */}
      { bilEnclosedList.length ? (
        <View style={styles.form_field_view}>
          <Text style={[styles.form_field_inline_label]}>Action</Text>
          <View
            style={(styles.form_field, {flexDirection: 'row', width: '85%'})}>
            <TouchableOpacity
              style={{
                width: '40%',
                backgroundColor: 'gray',
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', color: '#fff'}}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '40%',
                backgroundColor: '#c82333',
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', color: '#fff'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default BillEnclosedDeatil;
