import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Left, Right, Thumbnail, Body, Icon, locations, Input, Toast } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, Modal, Linking, Alert } from 'react-native';
import { catagries } from '../../providers/catagries/catagries.actions';
import { toDataUrl } from '../../../setup/helpers';
import { MAX_DISTANCE_TO_COVER, SERVICE_TYPES } from '../../../setup/config';
import FastImage from 'react-native-fast-image'
import CheckLocationWarning from '../Home/LocationWarning';
import { Loader } from '../../../components/ContentLoader';
import { translate } from '../../../setup/translator.helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Communications from 'react-native-communications';
import { CONSULTATION_ADMIN_MOBILE_NUMBER, CONSULTATION_ADMIN_EMAIL_ID1, CONSULTATION_ADMIN_EMAIL_ID2 } from '../../../setup/config';
import { getCorporateFullName } from '../../common';
import { NegativeConsultationDrawing } from '../../screens/Home/corporateHome/svgDrawings';
import { primaryColor } from '../../../setup/config';
class Categories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      categoriesMain: [],
      consultPopVisible: false,
      selectedSpecialist: null,
      isLoading: true,
      isCorporateUser: false,
      textInputValue: '',
    }

    this.emailId = '',
      this.mobile = '',
      this.userName = '',
      this.city = ''
  }

  async componentDidMount() {
    const loggedMemberInfo = this.props && this.props.profile && this.props.profile.corporateData;
    if (loggedMemberInfo && loggedMemberInfo.length) {
      const memInfo = loggedMemberInfo[0];
      if (memInfo.emailId) this.emailId = memInfo.emailId;
      if (memInfo.mobile) this.mobile = memInfo.mobile;
      this.userName = getCorporateFullName(memInfo);
      if (memInfo.city) this.city = memInfo.city;
    }
    const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
    this.setState({ isCorporateUser: isCorporateUser });
    this.getCatagries();
  }
  getCatagries = async () => {
    try {
      this.setState({ isLoading: true })
      let result = await catagries('services=0');
      if (result.success) {
        const categoriesData = result.data;
        if (categoriesData && categoriesData.length) {
          categoriesData.map(element => {
            switch (element.category_id) {
              case 1:
                categoriesData[0] = element;
                break;
              case 12:
                categoriesData[1] = element;
                break;
              case 2:
                categoriesData[2] = element;
                break;
              case 36:
                categoriesData[3] = element;
                break;
              case 8:
                categoriesData[4] = element;
                break;
              case 35:
                categoriesData[5] = element;
                break;
              default:
                categoriesData.push(element)
                break;
            }
          })
          const getFilterIds = categoriesData.map(item => item.category_id)
          const finalCategoriesData = categoriesData.filter(({ category_id }, index) => !getFilterIds.includes(category_id, index + 1))
          this.setState({ data:finalCategoriesData, categoriesMain: finalCategoriesData })
          // for (let i = 0; i < result.data.length; i++) {
          //   const item = result.data[i];
          //   // imageURL = item.imageBaseURL + item.category_id + '.png';
          //   // base64ImageDataRes = await toDataUrl(imageURL)
          //   // result.data[i].base64ImageData = base64ImageDataRes;
          //   // this.setState({ categoriesMain: result.data })
          // }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  navigate = (categoryName, category_id) => {
    CheckLocationWarning.checkLocationWarning(this.navigateToCategorySearch.bind(this), [categoryName, category_id]);
  }

  navigateToCategorySearch(categoryName, category_id) {



    const { bookappointment: { locationCordinates } } = this.props;

    let fromNavigation = this.props.navigation.getParam('fromNavigation') || null


    if (fromNavigation === "HOSPITAl") {

      this.props.navigation.navigate("HospitalList", {   // New Enhancement Router path
        category_id: category_id
      })
    }
    else if (fromNavigation === SERVICE_TYPES.HOME_HEALTHCARE) {
      let userAddressInfo = this.props.navigation.getParam('userAddressInfo') || null;
      const pinCode = userAddressInfo && userAddressInfo.address && userAddressInfo.address.pin_code;
      const reqParamDataObj = {
        categoryName,
        categoryId: category_id
      }
      if (pinCode) {
        reqParamDataObj.userAddressInfo = userAddressInfo;
        reqParamDataObj.pinCode = pinCode
      }
      this.props.navigation.navigate("Home Health Care", reqParamDataObj);
    } else {
      this.props.navigation.navigate("Doctor Search List", {   // New Enhancement Router path
        inputKeywordFromSearch: categoryName,
        locationDataFromSearch: {
          type: 'geo',
          "coordinates": locationCordinates,
          maxDistance: MAX_DISTANCE_TO_COVER
        }
      })
    }
    // let serachInputvalues = [{
    //   type: 'category',
    //   value: categoryName
    // },
    // {
    //   type: 'geo',
    //   value: {
    //       coordinates: locationCordinates,
    //       maxDistance: MAX_DISTANCE_TO_COVER
    //   }
    // }]
    // this.props.navigation.navigate('Doctor List', { resultData: serachInputvalues })
  }

  filterCategories(searchValue) {
    this.setState({ textInputValue: searchValue });

    const { categoriesMain } = this.state;
    if (!searchValue) {
      this.setState({ searchValue, data: categoriesMain });
    } else {
      const filteredCategories = categoriesMain.filter(ele =>
        ele.category_name.toLowerCase().search(searchValue.toLowerCase()) !== -1
      );
      this.setState({ searchValue, data: filteredCategories })
    }
  }
  clearText = async () => {
    this.setState({ textInputValue: '' });
    await this.getCatagries();
  }


  renderStickeyHeader() {
    return (
      <View style={{ width: '100%' }} >
        <Text style={{ fontFamily: 'Roboto', fontSize: 12, marginLeft: 10, marginTop: 10 }}>{translate('Search Doctors by their specialism')}</Text>
        <Row style={styles.SearchRow}>

          <Col size={9.1} style={{ justifyContent: 'center', }}>
            <Input
              placeholder={translate("Specialism and Categories")}
              style={styles.inputfield}
              placeholderTextColor="#e2e2e2"
              keyboardType={'email-address'}
              returnKeyType={'done'}
              onChangeText={searchValue => this.filterCategories(searchValue)}
              value={this.state.textInputValue}
              underlineColorAndroid="transparent"
            />
          </Col>
          <Col size={0.9} style={styles.SearchStyle}>
            {this.state.textInputValue ? <TouchableOpacity onPress={() => this.clearText()} style={{ justifyContent: 'center' }}>
              <Icon name="ios-close" style={{ color: 'gray', fontSize: 25 }} />
            </TouchableOpacity> :
              <TouchableOpacity style={{ justifyContent: 'center' }}><Icon name='ios-search' style={{ color: primaryColor, fontSize: 22 }} /></TouchableOpacity>}
          </Col>

        </Row>
      </View>
    )
  }
  callToBookAppointment() {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${CONSULTATION_ADMIN_MOBILE_NUMBER}`;
    }
    else {
      phoneNumber = `telprompt:${CONSULTATION_ADMIN_MOBILE_NUMBER}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  }
  onPressGotoMessageApp(message) {
    Communications.text(
      CONSULTATION_ADMIN_MOBILE_NUMBER,
      message
    )
    this.props.navigation.navigate('CorporateHome');
  }

  onPressGotoWhatsApp(message) {
    Linking.openURL('whatsapp://send?text=' + message + '&phone=91' + CONSULTATION_ADMIN_MOBILE_NUMBER);
    this.props.navigation.navigate('CorporateHome');
  }
  onPressGotoMailApp(message) {
    Communications.email(
      [
        CONSULTATION_ADMIN_EMAIL_ID1,
        CONSULTATION_ADMIN_EMAIL_ID2
      ],
      null,
      null,
      'Consultation Arrange Callback',
      message,
    );
    this.props.navigation.navigate('CorporateHome');
  }
  onPressArrangeCallBack() {
    try {
      let fromNavigation = this.props.navigation.getParam('fromNavigation') || null
      let message = '';
      if (fromNavigation === SERVICE_TYPES.HOME_HEALTHCARE) {
        let userAddressInfo = this.props.navigation.getParam('userAddressInfo') || null;
        const city = userAddressInfo && userAddressInfo.address && userAddressInfo.address.city ? userAddressInfo && userAddressInfo.address && userAddressInfo.address.city : '';
        const state = userAddressInfo && userAddressInfo.address && userAddressInfo.address.state ? userAddressInfo && userAddressInfo.address && userAddressInfo.address.state : '';
        message = `${this.userName} needs ${this.state.selectedSpecialist} Home health consultation at ${city ? city + ', ' : ''} ${state ? state : ''}. please contact them. Mobile Number : ${this.mobile}`;
      }
      else {
        message = `${this.userName} needs ${this.state.selectedSpecialist} consultation. please contact them. Phone Number: ${this.mobile}`;
      }
      Alert.alert(
        'Send request by SMS / WhatsApp / Mail',
        '',
        [
          {
            text: 'SMS',
            onPress: () => this.onPressGotoMessageApp(message)
          },
          { text: 'WhatsApp', onPress: () => this.onPressGotoWhatsApp(message) },
          { text: 'Mail', onPress: () => this.onPressGotoMailApp(message) },
        ]
      );
    } catch (error) {
      console.log('error is getting on Arrange call back', error);
    }
  }

  onPressCloseToConsultPop() {
    this.setState({ consultPopVisible: false });
  }
  render() {
    // const { user: { isLoading } } = this.props;
    const { data, isLoading } = this.state;
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent}>
          <Modal
            visible={this.state.consultPopVisible}
            transparent={true}
            animationType={'fade'}>
            <View style={styles.modalFirstView}>
              <View style={styles.modalSecondView}>
                <Row
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: -30,
                  }}>
                  <TouchableOpacity onPress={() => this.onPressCloseToConsultPop()}>
                    <MaterialIcons
                      name="close"
                      style={{ fontSize: 30, color: 'red' }}
                    />
                  </TouchableOpacity>
                </Row>
                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.modalHeading}>
                    {`You can Consult ${this.state.selectedSpecialist || ''} ${this.state.selectedSpecialist === "Primary Care Doctor" ? '' : "Doctor"} by `}
                  </Text>
                </Row>

                {/* <Row
                  style={{
                    marginTop: 15,
                    justifyContent: 'flex-end',
                    marginBottom: 5,
                  }}>
                  <Col size={5}> */}
                <View >
                  <TouchableOpacity
                    danger
                    style={styles.backToHomeButton1}
                    onPress={() => {
                      this.callToBookAppointment();
                      this.onPressCloseToConsultPop();
                    }}
                    testID="cancelButton">
                    <Row>
                      <Col size={1} ></Col>
                      <Col size={1} style={{ marginTop: 7, marginLeft: 40 }}>
                        <MaterialIcons name="call" style={{ fontSize: 25, color: '#FFF' }} />
                      </Col>
                      <Col size={8}>

                        <Text style={styles.backToHomeButtonText1}>
                          {'Call to Book Appointment'}
                        </Text>
                      </Col>
                    </Row>

                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    danger
                    style={styles.backToHomeButton}
                    onPress={() => {
                      this.onPressArrangeCallBack();
                      this.onPressCloseToConsultPop();
                    }}
                    testID="cancelButton">
                    <Row>
                      <Col size={1} ></Col>
                      <Col size={1} style={{ marginTop: 7, marginLeft: 40 }}>
                        <MaterialIcons name="reply" style={{ fontSize: 25, color: '#FFF' }} />
                      </Col>
                      <Col size={8}>
                        <Text style={styles.backToHomeButtonText1}>
                          {'Arrange Callback'}
                        </Text>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                </View>
                {/* </Col>
                </Row> */}
              </View>
            </View>
          </Modal>
          {isLoading ?
            <Loader style="boxList" /> : data && data.length ?
              <View style={{ marginBottom: 10 }}>
                <FlatList horizontal={false} numColumns={3}
                  data={this.state.data}
                  ListHeaderComponent={this.renderStickeyHeader()}
                  renderItem={({ item, index }) =>
                    <Col style={styles.mainCol}>
                                            {/* <TouchableOpacity onPress={() => this.state.isCorporateUser === true ? this.setState({ consultPopVisible: true, selectedSpecialist: item.category_name }) : this.navigate(item.category_name, item.category_id)} */}

                      <TouchableOpacity onPress={() =>this.navigate(item.category_name, item.category_id)}
                        style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                        <FastImage
                          source={{ uri: item.imageBaseURL + item.category_id + '.png' }}
                          style={{
                            width: 60, height: 60, alignItems: 'center'
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={{
                          fontSize: 12,
                          textAlign: 'center',
                          fontFamily: 'Roboto',
                          marginTop: 5,
                          paddingLeft: 5,
                          paddingRight: 5,
                          paddingTop: 1,
                          paddingBottom: 1
                        }}>{item.category_name}</Text>
                      </TouchableOpacity>
                    </Col>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </View> : Object.keys(data).length === 0 ?
                <View style={{ marginBottom: 10 }}>
                  <FlatList horizontal={false} numColumns={3}
                    ListHeaderComponent={this.renderStickeyHeader()}
                  />
                  <View style={{ marginTop: "70%", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <NegativeConsultationDrawing />
                    <Text style={{
                      fontFamily: "Roboto",
                      fontSize: 15,
                      marginTop: "10%",
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                    }} >Your Search Is Not Found</Text></View>
                </View>
                : null}
        </Content>
      </Container>

    )
  }

}

function appoinmentsState(state) {

  return {
    user: state.user,
    profile: state.profile,
    bookappointment: state.bookappointment
  }
}
export default connect(appoinmentsState)(Categories)


const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    padding: 5,
    backgroundColor: '#F4F4F4'
  },
  textcenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto'
  },

  column:
  {
    width: '15%',
    borderRadius: 10,
    margin: 10,
    padding: 6
  },


  customImage: {
    height: 100,
    width: 100,
    margin: 10,
    alignItems: 'center'
  },

  titleText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto',

  },
  SearchRow: {
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5, borderRadius: 5
  },
  SearchStyle: {

    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputfield: {
    color: 'gray',
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 5,
    paddingLeft: 10
  },
  mainCol: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: 'gray',
    borderRadius: 20,
    flexDirection: 'row',
    // borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1, width: '29.5%', flexDirection: 'row', backgroundColor: '#fafafa',
    minHeight: 110
  },
  modalFirstView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSecondView: {
    width: '95%',
    height: 200,
    backgroundColor: '#fff',
    borderColor: '#909090',
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
  },
  modalHeading: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'opensans-bold'
  },
  backToHomeButton1: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#128283',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  backToHomeButtonText1: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    // textAlign: 'center',
    color: '#fff',
    marginTop: 10
  },
  backToHomeButton: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#59a7a8',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backToHomeButtonText: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
});