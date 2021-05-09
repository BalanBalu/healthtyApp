import React, {Component, PureComponent} from 'react';
import {
  Container,
  Content,
  Text,
  Title,
  Header,
  Button,
  H3,
  Item,
  List,
  ListItem,
  Card,
  Left,
  Right,
  Thumbnail,
  Body,
  Icon,
  locations,
  Input,
} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { toDataUrl } from '../../../../setup/helpers';
import { StyleSheet, Image, TouchableOpacity, View, FlatList, Alert, Modal, Linking } from 'react-native';
import { getLabTestCateries } from '../../../providers/lab/lab.action';
import FastImage from 'react-native-fast-image'
import { Loader } from '../../../../components/ContentLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Communications from 'react-native-communications';
import {primaryColor, secondaryColor} from '../../../../setup/config';
import {translate} from '../../../../setup/translator.helper';
import { MAX_DISTANCE_TO_COVER, CONSULTATION_ADMIN_MOBILE_NUMBER, CONSULTATION_ADMIN_EMAIL_ID1, CONSULTATION_ADMIN_EMAIL_ID2, primaryColor } from '../../../../setup/config';
import { getCorporateFullName } from '../../../common';

class LabCategories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      labData: [],
      categoriesMain: [],
      isLoading: false,
      consultPopVisible: false,
      selectedSpecialist: null,
      isCorporateUser: false
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
    this.getLabCategories();
  }
  getLabCategories = async () => {
    try {
      this.setState({isLoading: true});
      const {
        bookappointment: {locationCordinates, isLocationSelected},
      } = this.props;
      if (!isLocationSelected) {
        Alert.alert(
          'Location Warning',
          'Please select the location to continue...!',
          [
            {text: 'Cancel'},
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Locations'),
            },
          ],
        );
        return;
      }
      let locationData = {
        coordinates: locationCordinates,
        maxDistance: MAX_DISTANCE_TO_COVER,
      };
      let result = await getLabTestCateries(JSON.stringify(locationData));

      if (result.success) {
        this.setState({labData: result.data});
        this.mainLabData = result.data;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  }
  onPressCatItem = async (type, value) => {
    const {
      bookappointment: {locationCordinates, isLocationSelected},
    } = this.props;

    if (!isLocationSelected) {
      Alert.alert(
        'Location Warning',
        'Please select the location to continue...!',
        [
          {text: 'Cancel'},
          {
            text: 'OK',
            onPress: () => this.props.navigation.navigate('Locations'),
          },
        ],
      );
      return;
    }
    const inputDataBySearch = [
      {
        type: 'geo',
        value: {
          coordinates: locationCordinates,
          maxDistance: MAX_DISTANCE_TO_COVER
        }
      }
    ]
    if (type === 'category_name' || type === 'lab_name') {
      inputDataBySearch.push({
        type,
        value
      })
    }
    this.props.navigation.navigate('LabSearchList', { inputDataFromLabCat: inputDataBySearch })

  }


  filterCategories(searchValue) {

    const { labData } = this.state;
    if (searchValue === searchValue.replace(/^[^*|\":<>[\]{}`\\()'; @& $]+$/)) {
      return [];
    }
    if (!searchValue) {
      this.setState({searchValue, data: labData});
    } else {
      if (this.mainLabData != undefined) {
        const filteredCategories = this.mainLabData.filter(ele =>
          ele.lab_test_category_info.category_name.toLowerCase().search(searchValue.toLowerCase()) !== -1
        );
        this.setState({searchValue, labData: filteredCategories});
      }
    }
  }

  renderStickeyHeader() {
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            fontFamily: 'Roboto',
            fontSize: 12,
            marginLeft: 10,
            marginTop: 10,
          }}>
          {translate('Search Labs by categories')}
        </Text>
        <Row style={styles.SearchRow}>
          <Col size={9.1} style={{justifyContent: 'center'}}>
            <Input
              placeholder={translate('Categories')}
              style={styles.inputfield}
              placeholderTextColor="#e2e2e2"
              keyboardType={'email-address'}
              onChangeText={(searchValue) => this.filterCategories(searchValue)}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
            />
          </Col>
          <Col size={0.9} style={styles.SearchStyle}>
            <TouchableOpacity style={{justifyContent: 'center'}}>
              <Icon
                name="ios-search"
                style={{color: 'gray', fontSize: 20, padding: 2}}
              />
            </TouchableOpacity>
          </Col>
        </Row>
      </View>
    );
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
      const message = `${this.userName} needs ${this.state.selectedSpecialist} Test at ${this.city}. please contact Him/Her to this mobile number of ${this.mobile}`;
      Alert.alert(
        'Send message to SMS / WhatsApp / G-Mail',
        '',
        [
          {
            text: 'SMS',
            onPress: () => this.onPressGotoMessageApp(message)
          },
          { text: 'WhatsApp', onPress: () => this.onPressGotoWhatsApp(message) },
          { text: 'G-Mail', onPress: () => this.onPressGotoMailApp(message) },
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
    const { labData, isLoading } = this.state;

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
                    {`You can Test ${this.state.selectedSpecialist || ''} by `}
                  </Text>
                </Row>

                <Row
                  style={{
                    marginTop: 15,
                    justifyContent: 'flex-end',
                    marginBottom: 5,
                  }}>
                  <Col size={5}>
                    <TouchableOpacity
                      danger
                      style={styles.backToHomeButton1}
                      onPress={() => {
                        this.callToBookAppointment();
                        this.onPressCloseToConsultPop();
                      }}
                      testID="cancelButton">
                      <Text style={styles.backToHomeButtonText1}>
                        {' '}
                        {'Call to Book Appointment'}
                      </Text>
                    </TouchableOpacity>
                  </Col>
                  <Col size={5} style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      danger
                      style={styles.backToHomeButton}
                      onPress={() => {
                        this.onPressArrangeCallBack();
                        this.onPressCloseToConsultPop();
                      }}
                      testID="cancelButton">
                      <Text style={styles.backToHomeButtonText}>
                        {' '}
                        {'Arrange Callback'}
                      </Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              </View>
            </View>
          </Modal>
          {isLoading ?
            <Loader style="boxList" /> : labData.length ?
              <View style={{ marginBottom: 10 }}>
                <FlatList horizontal={false} numColumns={3}
                  data={this.state.labData}
                  extraData={this.state.labData}
                  ListHeaderComponent={this.renderStickeyHeader()}
                  renderItem={({ item, index }) =>
                    <Col style={styles.mainCol}>

                      <TouchableOpacity onPress={() => this.state.isCorporateUser === true ? this.setState({ consultPopVisible: true, selectedSpecialist: item.lab_test_category_info.category_name }) : this.onPressCatItem('category_name', item.lab_test_category_info.category_name)}
                        style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>

                        <FastImage
                          source={{
                            uri: item.
                              lab_test_category_info.category_image_url + '/' + item.lab_test_category_info.category_image_name
                          }}
                          style={{
                            width: 60, height: 60, alignItems: 'center'

                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                        <Text style={styles.mainText}>{item.lab_test_category_info.category_name}</Text>
                        <Text style={styles.subText}>Package starts from</Text>
                        <Row>
                          <Text style={styles.rsText}> {item.minPriceWithoutOffer != item.minPriceWithOffer ? ('₹' + item.minPriceWithoutOffer) : null}</Text>
                          <Text style={styles.finalRs}>₹ {Math.round(item.minPriceWithOffer)}</Text>
                        </Row>
                      </TouchableOpacity>
                    </Col>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </View> : null}
        </Content>
      </Container>
    );
  }
}
function labCategoriesState(state) {
  return {
    profile: state.profile,
    bookappointment: state.bookappointment,
  };
}
export default connect(labCategoriesState)(LabCategories);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
  },

  bodyContent: {
    padding: 5,
    backgroundColor: '#F4F4F4',
  },
  textcenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto',
  },

  column: {
    width: '15%',
    borderRadius: 10,
    margin: 10,
    padding: 6,
  },

  customImage: {
    height: 100,
    width: 100,
    margin: 10,
    alignItems: 'center',
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
    marginTop: 5,
    borderRadius: 5,
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
    paddingLeft: 10,
  },
  mainCol: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderRadius: 20,
    flexDirection: 'row',
    // borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    padding: 1,
    marginTop: 15,
    marginLeft: 11,
    marginBottom: 1, width: '29.5%', flexDirection: 'row', backgroundColor: '#fafafa',
    minHeight: 100
  },
  mainText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    color: primaryColor,
  },
  subText: {
    fontSize: 8,
    textAlign: 'center',
    fontFamily: 'Roboto',
    paddingTop: 1,
  },
  rsText: {
    fontSize: 8,
    textAlign: 'center',
    paddingTop: 1,
    color: '#ff4e42',
    marginTop: 2,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ff4e42',
    fontFamily: 'Roboto'
  },
  finalRs: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
    paddingTop: 1,
    marginLeft: 5,
    color: '#8dc63f'
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
    justifyContent: 'center'
  },
  backToHomeButtonText1: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
  backToHomeButton: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    backgroundColor: '#59a7a8',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backToHomeButtonText: {
    fontFamily: 'opensans-bold',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
  },
});
