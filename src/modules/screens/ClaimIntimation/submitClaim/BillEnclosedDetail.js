import React, { PureComponent } from 'react';
import { Text, View, Input, Icon, Item, ListItem } from 'native-base';
import { TouchableOpacity, FlatList } from 'react-native';
import styles from '../Styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { subTimeUnit, formatDate } from '../../../../setup/helpers';
import { toastMeassage, acceptNumbersOnly } from '../../../common';
import { Col, Row } from 'react-native-easy-grid';
import ModalPopup from '../../../../components/Shared/ModalPopup';

class BillEnclosedDeatil extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      issuedBy: '',
      towards: '',
      amount: '',
      bilEnclosedList: [],
      refreshCount: 1,
      dateOfHospitalizationForBill: '',
      billNo: '',
      isModalVisible: false,
      errorMsg: '',
      editDetails: false,
    };
  }
  onPressConfirmDateValue = (date) => {
    this.setState({ dateOfHospitalizationForBill: date, isVisible: false });
  };
  onCancelPicker = () => {
    this.setState({ isVisible: false });
  };

  openPicker = () => {
    this.setState({ isVisible: true });
  };

  addTable = () => {
    // let bilEnclosedData = [];
    const {
      billNo,
      dateOfHospitalizationForBill,
      issuedBy,
      towards,
      amount,
      bilEnclosedList,
      refreshCount,
    } = this.state;
    console.log("dateOfHospitalizationForBill",dateOfHospitalizationForBill)
    if (billNo === '') {
      this.setState({
        errorMsg: 'Please enter bill number',
        isModalVisible: true,
      });
      return false;
    }
    if (dateOfHospitalizationForBill === '') {
      this.setState({
        errorMsg: 'Please select date of hospitalization for bill',
        isModalVisible: true,
      });
      return false;
    }
    // if (issuedBy === '') {
    //   this.setState({
    //     errorMsg: 'Please enter issuedBy',
    //     isModalVisible: true,
    //   });
    //   return false;
    // }
    // if (towards === '') {
    //   this.setState({
    //     errorMsg: 'Please enter towards',
    //     isModalVisible: true,
    //   });
    //   return false;
    // }
    if (amount === '') {
      this.setState({
        errorMsg: 'Please enter amount',
        isModalVisible: true,
      });
      return false;
    }
    bilEnclosedList.push({
      billNo: billNo,
      dateOfHospitalizationForBill: dateOfHospitalizationForBill,
      issuedBy: issuedBy,
      towards: towards,
      amount: amount,
    });
    this.setState({
      bilEnclosedList: bilEnclosedList,
      refreshCount: refreshCount + 1,
      billNo: '',
      dateOfHospitalizationForBill: null,
      issuedBy: '',
      towards: '',
      amount: '',
    });
  };

  deleteBillEnclosedDetails = async (item, index) => {
    let temp = this.state.bilEnclosedList;
    await temp.splice(index, 1);
    await this.setState({
      bilEnclosedList: temp,
      refreshCount: this.state.refreshCount + 1,
    });
  };

  editBillEnclosedDetails = async (item, index) => {
    this.setState({
      refreshCount: this.state.refreshCount + 1,
      billNo: item.billNo,
      dateOfHospitalizationForBill: item.dateOfHospitalizationForBill,
      issuedBy: item.issuedBy,
      towards: item.towards,
      amount: item.amount,
      editDetails: true,
      index: index,
    });
  };
  editTable = async () => {
    const {
      billNo,
      dateOfHospitalizationForBill,
      issuedBy,
      towards,
      amount,
      bilEnclosedList,
      refreshCount,
      index,
    } = this.state;
    bilEnclosedList.map((ele, i) => {
      if (index == i) {
        (ele.billNo = billNo),
          (ele.dateOfHospitalizationForBill = dateOfHospitalizationForBill),
          (ele.issuedBy = issuedBy),
          (ele.towards = towards),
          (ele.amount = amount);
      }
    });

    this.setState({
      bilEnclosedList: bilEnclosedList,
      refreshCount: refreshCount + 1,
      billNo: '',
      dateOfHospitalizationForBill: null,
      issuedBy: '',
      towards: '',
      amount: '',
      editDetails: false,
    });
  };

  render() {
    const {
      billNo,
      dateOfHospitalizationForBill,
      issuedBy,
      isVisible,
      towards,
      amount,
      bilEnclosedList,
      isModalVisible,
      errorMsg,
      editDetails,
    } = this.state;
    const {updateBillsEnclosedDetails} = this.props;

    return (
      <View>
        <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>
              Bill No<Text style={{ color: 'red' }}>*</Text>
            </Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter BILL No "
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={billNo}
                keyboardType={'default'}
                onChangeText={(text) => this.setState({ billNo: text })}
                testID="addBillNo"
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
                onPress={this.openPicker}
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
                  onConfirm={this.onPressConfirmDateValue}
                  onCancel={this.onCancelPicker}
                />
              </TouchableOpacity>
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>
              Issued by<Text style={{ color: 'red' }}>*</Text>
            </Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Inssured by details "
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={issuedBy}
               
                keyboardType={'default'}
                onChangeText={(text) => this.setState({ issuedBy: text })}
                testID="addIssuedBy"
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>
              Towards<Text style={{ color: 'red' }}>*</Text>
            </Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Towards details "
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={towards}
                
                keyboardType={'default'}
                onChangeText={(text) => this.setState({ towards: text })}
                testID="addTowards"
              />
            </Item>
          </Col>
        </Row>
        <Row size={4} style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          <Col size={1}>
            <Text style={styles.text}>
              Amount<Text style={{ color: 'red' }}>*</Text>
            </Text>

            <Item regular style={{ borderRadius: 6, height: 35 }}>
              <Input
                placeholder="Enter Amount "
                placeholderTextColor={'#CDD0D9'}
                style={styles.fontColorOfInput}
                returnKeyType={'next'}
                value={amount}  
                keyboardType={'number-pad'}
                onChangeText={(text) =>
                  acceptNumbersOnly(text) == true || text === ''
                    ? this.setState({ amount: text })
                    : null
                }
                testID="addAmount"
              />
            </Item>
          </Col>
        </Row>

        <View style={styles.ButtonView}>
          <TouchableOpacity
            style={styles.submit_ButtonStyle}
            onPress={editDetails ? this.editTable : this.addTable}>
            <Text style={{color: '#fff'}}>
              {editDetails ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {bilEnclosedList && bilEnclosedList.length != 0 ? (
          <FlatList
            containerstyle={{ flex: 1 }}
            data={bilEnclosedList}
            extraData={bilEnclosedList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={{ padding: 10, marginTop: 10, marginBottom: 20 }}>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>SL No</Text>
                    <Text
                      style={[
                        styles.form_field,
                        { paddingTop: 15, paddingLeft: 10 },
                      ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>
                      BILL No
                    </Text>
                    {/* <Text style={styles.form_field}>{item.billNo}</Text> */}
                    <Input
                      placeholder="Enter BILL No "
                      placeholderTextColor={'#CDD0D9'}
                      style={styles.fontColorOfInput}
                      returnKeyType={'next'}
                      style={styles.form_field}
                      keyboardType={'default'}
                      onChangeText={(text) => this.setState({ billNo: text })}
                      value={item.billNo}
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
                      <Text style={{ fontSize: 12 }}>Date of</Text>

                      <Text style={{ fontSize: 12 }}>hospitalization</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.form_field, { flexDirection: 'row' }]}
                      onPress={this.openPicker}>
                      <Icon name="md-calendar" style={styles.calenderStyle} />
                      <Text
                        style={
                          item.dateOfHospitalizationForBill
                            ? styles.timeplaceHolder
                            : styles.afterTimePlaceholder
                        }>
                        {item.dateOfHospitalizationForBill
                          ? formatDate(
                            item.dateOfHospitalizationForBill,
                            'DD/MM/YYYY',
                          )
                          : new Date()}
                      </Text>
                      <DateTimePicker
                        mode={'date'}
                        // minimumDate={subTimeUnit(new Date(), 7, 'days')}
                        maximumDate={new Date()}
                        value={item.dateOfHospitalizationForBill}
                        isVisible={isVisible}
                        onConfirm={this.onPressConfirmDateValue}
                        onCancel={this.onCancelPicker}
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
                      style={styles.fontColorOfInput}
                      returnKeyType={'next'}
                      value={item.issuedBy}
                      style={styles.form_field}
                      keyboardType={'default'}
                      onChangeText={(text) => this.setState({ issuedBy: text })}
                      testID="editIssuedBy"
                    />
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>
                      Towards
                    </Text>
                    <Input
                      placeholder="Enter Towards details "
                      placeholderTextColor={'#CDD0D9'}
                      style={styles.fontColorOfInput}
                      returnKeyType={'next'}
                      value={item.towards}
                      style={styles.form_field}
                      keyboardType={'default'}
                      onChangeText={(text) => this.setState({ towards: text })}
                      testID="editTowards"
                    />
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>
                      AMOUNT(RS)
                    </Text>
                    <Input
                      placeholder="Enter Amount "
                      placeholderTextColor={'#CDD0D9'}
                      style={styles.fontColorOfInput}
                      returnKeyType={'next'}
                      value={item.amount}
                      style={styles.form_field}
                      keyboardType={'number-pad'}
                      onChangeText={(text) => this.setState({ amount: text })}
                      testID="editAmount"
                    />
                  </View>
                  <View style={styles.form_field_view}>
                    <Text style={[styles.form_field_inline_label]}>Action</Text>
                    <View
                      style={
                        (styles.form_field,
                          { flexDirection: 'row', width: '85%' })
                      }>
                      <TouchableOpacity
                        style={{
                          width: '40%',
                          backgroundColor: 'gray',
                          height: 45,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          this.editBillEnclosedDetails(item, index)
                        }>
                        <Text style={{textAlign: 'center', color: '#fff'}}>
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          width: '40%',
                          backgroundColor: '#c82333',
                          height: 45,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          this.deleteBillEnclosedDetails(item, index)
                        }>
                        <Text style={{ textAlign: 'center', color: '#fff' }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : null}

        <View style={{flex: 1}}>
          <ModalPopup
            errorMessageText={errorMsg}
            closeButtonText={'CLOSE'}
            closeButtonAction={() =>
              this.setState({ isModalVisible: !isModalVisible })
            }
            visible={isModalVisible}
          />
        </View>
        {this.state.bilEnclosedList && this.state.bilEnclosedList.length ? (
          <View style={styles.ButtonView}>
            <TouchableOpacity
              style={styles.submit_ButtonStyle}
              onPress={() =>
                updateBillsEnclosedDetails(this.state.bilEnclosedList)
              }
              disabled={this.state.bilEnclosedList.length ? false : true}>
              <Text style={{color: '#fff'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

export default BillEnclosedDeatil;
