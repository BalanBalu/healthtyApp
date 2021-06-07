import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Row } from 'react-native-easy-grid';
import { translate } from '../../../../setup/translator.helper';
import {
  IS_ANDROID,
  validateFirstNameLastName,
  acceptNumbersOnly,
} from '../../../common';
import {
  Container,
  Toast,
  Body,
  Button,
  Text,
  Item,
  Input,
  Icon,
  Card,
  CardItem,
  Label,
  Form,
  Content,
  Picker,
} from 'native-base';
import { MAP_BOX_TOKEN, SERVICE_TYPES } from '../../../../setup/config';
import axios from 'axios';
import {
  updateMemberDetails,
  logout,
  getPostOffNameAndDetails,
} from '../../../providers/auth/auth.actions';
import Geolocation from 'react-native-geolocation-service';
MapboxGL.setAccessToken(MAP_BOX_TOKEN);
// import Qs from 'qs';
import { primaryColor } from '../../../../setup/config';

import { NavigationEvents } from 'react-navigation';
import Spinner from '../../../../components/Spinner';
import locationIcon from '../../../../../assets/marker.png';

export default class MapBox extends Component {
  // _requests = [];
  constructor(props) {
    super(props);
    this.state = {
      fromProfile: false,
      loading: false,
      coordinates: null,
      center: [],
      zoom: 15,
      isLoadingFinished: false,
      searchBoxLocFullText: null,
      showAllAddressFields: false,
      full_name: '',
      mobile_no: null,
      addressType: null,
      postOfficeData: [{ Name: translate('Select Post Name') }],
      editable: true,
      address: {
        address1: null,
        address2: null,
        city: null,
        postOfficeName: null,
        district: null,
        state: null,
        country: null,
        pinCode: '',
      },
      updateId: this.props.navigation.getParam('id') || null
    };
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
    this.onRegionIsChanging = this.onRegionIsChanging.bind(this);
    this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);
    this.navigationOption = null;
    this.isFromNetworkHospital =
      props.navigation.getParam('isFromNetworkHospital') || false;
  }
  async componentDidMount() {
    try {
      if (IS_ANDROID) {
        const granted = PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ],
          {
            title: 'Give Location Permission',
            message: 'App needs location permission to find your position.',
          },
        )
          .then((granted) => { })
          .catch((err) => {
            console.warn(err);
          });
      }
      const { navigation } = this.props;
      const fromProfile = navigation.getParam('fromProfile') || false;
      let showAllAddressFields = navigation.getParam('mapEdit') || false;
      this.navigationOption = navigation.getParam('navigationOption') || null;
      let locationData = this.props.navigation.getParam('locationData');

      if (fromProfile) {
        await this.setState({ fromProfile: true });
        if (locationData) {
          this.setAndAutoFillAddressFields(locationData);
          await this.setState({
            coordinates: locationData.center,
            fromProfile,
            showAllAddressFields,
            // updateId,
          });
        } else {
          this.getCurrentLocation();
        }
      }
      // else if (this.navigationOption) {
      //     const addressType = navigation.getParam('addressType') || null
      //     if (addressType) {
      //         this.setState({ addressType: addressType.addressType, full_name: addressType.full_name, mobile_no: addressType.mobile_no })
      //     }
      //     else if (addressType == 'lab_delivery_Address') {
      //         this.setState({ addressType })
      //     }
      // }
      else {
        this.getCurrentLocation();
      }
    } catch (Ex) {
      console.log('Ex is getting on Component Did Mount   ', Ex.message);
    }
  }
  backNavigation(navigationData) {
    if (
      navigationData.action &&
      navigationData.action.type === 'Navigation/NAVIGATE'
    ) {
      const searchLocationData = this.props.navigation.getParam('locationData');
      if (searchLocationData) {
        this.setAndAutoFillAddressFields(searchLocationData);
        this.setState({ coordinates: searchLocationData.center });
      }
    }
  }

  async getCurrentLocation() {
    try {
      Geolocation.getCurrentPosition(async (position) => {
        const currentLocCoOrdinates = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        await this.setState({
          center: currentLocCoOrdinates,
          coordinates: currentLocCoOrdinates,
          zoom: 15,
          isLoadingFinished: true,
        });
        this.serviceOfUpdateLocInfoByCoOrdinates(currentLocCoOrdinates);
      }),
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 };
    } catch (Ex) {
      console.log('Ex is getting on Gte Current Location  ' + Ex.message);
    }
  }
  async serviceOfUpdateLocInfoByCoOrdinates(coOrdinates) {
    // Call Map Box data service
    let fullPath = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coOrdinates[0]},${coOrdinates[1]}.json?types=poi&access_token=${MAP_BOX_TOKEN}`;
    let mapBoxResp = await axios.get(fullPath, {
      headers: {
        'Content-Type': null,
        'x-access-token': null,
        userId: null,
      },
    });
    const mapBoxLocData = mapBoxResp.data && mapBoxResp.data.features[0];
    if (mapBoxLocData) {
      this.setAndAutoFillAddressFields(mapBoxLocData);
    }
  }
  setAndAutoFillAddressFields(locationData) {
    // Set and Auto fill the all Address fields
    let searchBoxLocFullText = '';
    const locDataContext = locationData.context;
    const locDataContextLength = locDataContext && locDataContext.length;
    if (locDataContextLength) {
      for (let i = 0; i < locDataContextLength; i++) {
        const locValue = locDataContext[i].text;
        searchBoxLocFullText += `${locValue}${i + 1 !== locDataContextLength ? ', ' : '.'
          }`; //  auto fill Location text content in Search Box
        const contextType = locDataContext[i].id.split('.')[0];
        switch (contextType) {
          case 'address1':
            this.onChangeUpdateAddressData('address1', locValue);
            break;
          case 'address2':
            this.onChangeUpdateAddressData('address2', locValue);
            break;
          case 'address3':
            this.onChangeUpdateAddressData('address3', locValue);
            break;
          case 'place':
            this.onChangeUpdateAddressData('city', locValue);
            break;
          case 'postOfficeName':
            this.onChangeUpdateAddressData('postOfficeName', locValue);
            break;
          case 'district':
            this.onChangeUpdateAddressData('district', locValue);
            break;
          case 'region':
            this.onChangeUpdateAddressData('state', locValue);
            break;
          case 'country':
            this.onChangeUpdateAddressData('country', locValue);
            break;
          case 'pinCode':
            this.onChangeUpdateAddressData('pinCode', locValue);
            break;
        }
      }
    } else {
      searchBoxLocFullText = locationData.place_name;
    }
    this.setState({
      address: { ...this.state.address },
      searchBoxLocFullText,
      center: locationData.center,
    });
  }

  onChangePinCodeValue = async (pinCode) => {
    const regPattern = /^[1-9][0-9]{5}$/;
    this.onChangeUpdateAddressData('pinCode', pinCode);
    if (pinCode.match(regPattern)) {
      this.getPostOfficeNameByPinCode(pinCode);
      return true;
    } else {
      this.setState({ postOfficeData: [{ Name: translate('Select Post Name') }] });
    }
  };

  getPostOfficeNameByPinCode = async (pinCode) => {
    const postOffResp = await getPostOffNameAndDetails(pinCode);
    if (postOffResp.Status == 'Success') {
      const postOfficeData = postOffResp.PostOffice;
      this.setState({ postOfficeData });
      this.postOfficeAddress(postOfficeData[0]);
    } else {
      this.setState({ postOfficeData: [{ Name: translate('Select Post Name') }] });
      Toast.show({
        text: postOffResp.Message,
        type: 'danger',
        duration: 4000,
      });
      return false;
    }
  };
  postOfficeAddress = async (value) => {
    this.onChangeUpdateAddressData('postOfficeName', value.Name);
    const {
      address: { address1, address2, pinCode, city, postOfficeName },
    } = this.state;
    await this.setState({
      editable: false,
      address: {
        address1,
        address2,
        pinCode,
        postOfficeName,
        city,
        district: value.District,
        state: value.State,
        country: value.Country,
      },
    });
  };

  onChangeUpdateAddressData(addressNode, value) {
    let baCupOfAddressObjInState = this.state.address;
    baCupOfAddressObjInState[addressNode] = value;
    this.setState({ address: baCupOfAddressObjInState });
  }
  async onPressUpdateLocInfo() {
    try {
      const {
        center,
        addressType,
        fromProfile,
        updateId,
        address: {
          address1,
          address2,
          pinCode,
          city,
          state,
          postOfficeName,
          country,
          district,
        },
      } = this.state;
      const reqData4displayToastMsg = {
        type: 'warning',
        duration: 3000,
        buttonText: translate('Okay'),
        buttonTextStyle: {
          color: '#008000',
        },
        buttonStyle: { backgroundColor: '#5cb85c' },
      };
      if (!address1) {
        (reqData4displayToastMsg.text = translate('Enter address1 in above')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!address2) {
        (reqData4displayToastMsg.text = translate('Enter address2 in above')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!pinCode) {
        (reqData4displayToastMsg.text = translate('Enter Valid Pin Code')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!city) {
        (reqData4displayToastMsg.text = translate('Enter city Or area')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!district) {
        (reqData4displayToastMsg.text = translate('Enter district')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!state) {
        (reqData4displayToastMsg.text = translate('Enter state')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      if (!country) {
        (reqData4displayToastMsg.text = translate('Enter country')),
          Toast.show(reqData4displayToastMsg);
        return;
      }
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let relationship = (await AsyncStorage.getItem('relationship')) || null;

      const reqUserAddressData = {
        _id: updateId,
        emailId:memberEmailId,
        relationship:relationship,
        coordinates: [center[1], center[0]],
        pinCode: Number(pinCode),
        address1,
        address2,
        city,
        state,
        country,
        district,
        postOfficeName,
      };
      //   if (addressType == 'delivery_Address') {
      //     if (validateFirstNameLastName(this.state.full_name) == false) {
      //       Toast.show({
      //         text:
      //           'name should not contains white spaces and any Special Character',
      //         type: 'danger',
      //         duration: 5000,
      //       });
      //       return false;
      //     } else {
      //       reqUserAddressData.delivery_Address = reqUserAddressData.address;
      //       reqUserAddressData.delivery_Address.full_name = this.state.full_name;
      //       reqUserAddressData.delivery_Address.mobile_no = this.state.mobile_no;
      //       delete reqUserAddressData.address;
      //     }
      //   } else if (addressType == 'lab_delivery_Address') {
      //     reqUserAddressData.delivery_Address = reqUserAddressData.address;
      //     delete reqUserAddressData.address;
      //   } else if (addressType === SERVICE_TYPES.HOME_HEALTHCARE) {
      //     reqUserAddressData.home_healthcare_address = reqUserAddressData.address;
      //     reqUserAddressData.home_healthcare_address.active = true;
      //     delete reqUserAddressData.address;
      //   }
      this.setState({ isLoading: true });
      console.log("reqUserAddressData",reqUserAddressData)
      const updateResp = await updateMemberDetails(reqUserAddressData);
      console.log("updateResp",updateResp)

      if (updateResp) {
        if (fromProfile) {
          Toast.show({
            text: translate("Address updated successfully"),
            type: 'success',
            duration: 3000,
          });
          this.props.navigation.navigate('Profile');
        }
        // else if (this.navigationOption) {
        //   const setParamObjData = {hasReloadAddress: true};
        //   if (this.state.addressType === SERVICE_TYPES.HOME_HEALTHCARE) {
        //     setParamObjData.userAddressInfo = reqUserAddressData;
        //     setParamObjData.fromNavigation = SERVICE_TYPES.HOME_HEALTHCARE;
        //   }
        //   this.props.navigation.navigate(
        //     this.navigationOption,
        //     setParamObjData,
        //   );
        // }
        else {
          logout();
          Toast.show({
            text: translate('Click Here Login to continue'),
            type: 'success',
            duration: 3000,
          });
          this.props.navigation.navigate('login');
        }
      } else {
        Toast.show({
          text: updateResp.message,
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (Ex) {
      console.log('Exception Occurred on Updating Location Info' + Ex.message),
        Toast.show({
          text: 'Exception Occurred on ' + Ex.message,
          type: 'danger',
          duration: 5000,
        });
    } finally {
      this.setState({ isLoading: false });
    }
  }
  async onRegionDidChange() {
    if (this.state.isLoadingFinished) {
      const zoom = await this._map.getZoom();
      this.setState({ zoom });
      await this.serviceOfUpdateLocInfoByCoOrdinates(this.state.center);
    }
  }

  async onRegionIsChanging() {
    if (this.state.isLoadingFinished) {
      const center = await this._map.getCenter();
      this.setState({ center: center });
    }
  }
  async onDidFinishLoadingMap() {
    await this.setState({ isLoadingFinished: true });
  }

  // _abortRequests = () => {
  //     this._requests.map(i => i.abort());
  //     this._requests = [];
  // }
  // _request = (lng, lat) => {
  //     this._abortRequests();
  //     if (lng && lat) {
  //         const request = new XMLHttpRequest();
  //         this._requests.push(request);
  //         request.timeout = 1000;
  //         request.ontimeout = 2000;
  //         request.onreadystatechange = () => {
  //             if (request.readyState !== 4) {
  //                 return;
  //             }
  //             if (request.status === 200 && request.status !== 0) {
  //                 const responseJSON = JSON.parse(request.responseText);
  //                 if (typeof responseJSON.error_message !== 'undefined') {
  //                     console.warn('Map places autocomplete: ' + responseJSON.error_message);
  //                 }
  //             } else {
  //                 //console.warn(JSON.stringify(request) + "request could not be completed or has been aborted");
  //             }
  //         };
  //         let url = '';
  //         url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lng + ',' + lat + '.json' + '?' + Qs.stringify({
  //             types: 'poi',
  //             access_token: MAP_BOX_TOKEN,
  //         })
  //         request.open('GET', url);
  //         request.send();
  //     }
  // }

  confirmLocation() {
    if (this.isFromNetworkHospital === true) {
      const { address, center } = this.state;
      const coordinates = [center[1], center[0]];
      const reqData4NetworkHosp = {
        coordinates,
        selectedCityName: address.address2,
      };
      if (coordinates && coordinates.length) {
        reqData4NetworkHosp.isFromMapBox = true;
      }
      this.props.navigation.navigate('NetworkHospitals', reqData4NetworkHosp);
    } else {
      this.setState({ showAllAddressFields: true });
    }
  }

  render() {
    const {
      coordinates,
      zoom,
      searchBoxLocFullText,
      center,
      address: {
        address1,
        address2,
        pinCode,
        city,
        state,
        country,
        postOfficeName,
        district,
      },
      showAllAddressFields,
      editable,
      isLoading,
    } = this.state;
    return (
      <Container>
        <NavigationEvents
          onWillFocus={(payload) => {
            this.backNavigation(payload);
          }}
        />
        {isLoading ? (
          <Spinner
            color="blue"
            visible={isLoading}
            textContent={translate('Please wait Loading')}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          {coordinates && coordinates !== null ? (
            <MapboxGL.MapView
              ref={(c) => (this._map = c)}
              style={{ flex: 1 }}
              compassEnabled={false}
              showUserLocation={true}
              styleURL={MapboxGL.StyleURL.Street}
              onRegionDidChange={this.onRegionDidChange}
              regionDidChangeDebounceTime={500}
              onRegionIsChanging={this.onRegionIsChanging}
              onDidFinishLoadingMap={this.onDidFinishLoadingMap}
              centerCoordinate={coordinates}>
              <MapboxGL.Camera
                zoomLevel={zoom}
                centerCoordinate={coordinates}
                animationDuration={2000}
              />
              <MapboxGL.Images images={{ location: locationIcon }} />
              {searchBoxLocFullText !== null ? (
                <MapboxGL.PointAnnotation
                  id={'Map Center Pin'}
                  title={searchBoxLocFullText}
                  coordinate={center}></MapboxGL.PointAnnotation>
              ) : null}
            </MapboxGL.MapView>
          ) : null}
          <View style={[styles.containerForBubble, { bottom: 0 }]}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => this.getCurrentLocation()}>
              <Icon color={'white'} name="locate" style={styles.text}></Icon>
            </TouchableOpacity>
          </View>
        </View>
        {!showAllAddressFields ? (
          <Card>
            <CardItem bordered>
              <Body>
                <Button
                  style={{ borderRadius: 15 }}
                  iconLeft
                  block
                  success
                  onPress={() => this.confirmLocation()}>
                  <Icon name="paper-plane"></Icon>
                  <Text>{translate("Confirm Location")}</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        ) : (
          <Content style={styles.bodyContent}>
            <Form
              style={{
                borderBottomWidth: 5,
                marginLeft: 10,
                marginRight: 10,
              }}>
              {/* {this.state.addressType === 'delivery_Address' ? (
                <View>
                  <Item floatingLabel>
                    <Label>Name</Label>
                    <Input
                      placeholder="No And Street"
                      style={{
                        borderBottomColor: 'transparent',
                        height: 45,
                        marginTop: 5,
                        borderRadius: 5,
                        color: '#000',
                        fontFamily: 'Roboto',
                      }}
                      value={this.state.full_name}
                      onChangeText={(value) =>
                        this.setState({full_name: value})
                      }
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label>Mobile no </Label>
                    <Input
                      placeholder="Address Line 1"
                      style={styles.transparentLabel}
                      returnKeyType={'next'}
                      value={this.state.mobile_no}
                      onChangeText={(value) =>
                        acceptNumbersOnly(value) == true || value === ''
                          ? this.setState({mobile_no: value})
                          : null
                      }
                    />
                  </Item>
                </View>
              ) : null} */}
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("Address 1")}</Label>
                <Input
                  style={styles.transparentLabel}
                  returnKeyType={'next'}
                  value={address1}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('address1', value)
                  }
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.enterNoAndStreet.focus();
                  }}
                />
              </Item>
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("Address 2")}</Label>
                <Input
                  placeholder={translate("Address Line")}
                  style={styles.transparentLabel}
                  getRef={(ref) => {
                    this.enterNoAndStreet = ref.wrappedInstance; // <-- notice
                  }}
                  returnKeyType={'next'}
                  value={address2}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('address2', value)
                  }
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this.enterAddressLine1.focus();
                  }}
                />
              </Item>
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("Pincode")}</Label>
                <Input
                  placeholder={translate("Pincode")}
                  style={styles.transparentLabel}
                  getRef={(ref) => {
                    this.enterAddressLine1 = ref.wrappedInstance; // <-- notice
                  }}
                  returnKeyType={'next'}
                  keyboardType="numeric"
                  value={String(pinCode)}
                  onChangeText={(pinCode) =>
                    acceptNumbersOnly(pinCode) == true || pinCode === ''
                      ? this.onChangePinCodeValue(pinCode)
                      : null
                  }
                  onSubmitEditing={() => {
                    this.enterPinCode.focus();
                  }}
                />
              </Item>
              <Item style={[styles.transparentLabel1]}>
                <Picker
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 14,
                    backgroundColor: '#F1F1F1',
                  }}
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder={translate("Select your Post Office Name")}
                  textStyle={{ color: 'gray', fontFamily: 'Roboto' }}
                  itemStyle={{
                    backgroundColor: 'gray',
                    marginLeft: 0,
                    paddingLeft: 10,
                  }}
                  onValueChange={(value) => {
                    value.Name !== 'Select Post Name'
                      ? this.postOfficeAddress(value)
                      : null;
                  }}
                  itemTextStyle={{ color: '#788ad2' }}
                  style={{ width: undefined }}
                  selectedValue={postOfficeName}>
                  {this.state.postOfficeData.map((ele, index) => {
                    return (
                      <Picker.Item
                        label={String(ele.Name)}
                        value={ele}
                        key={index}
                        testID="pickPostOfficeName"
                      />
                    );
                  })}
                </Picker>
              </Item>
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("City Or Area")}</Label>
                <Input
                  placeholder={translate("City")}
                  style={styles.transparentLabel}
                  value={city}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('city', value)
                  }
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  getRef={(ref) => {
                    this.enterPinCode = ref.wrappedInstance;
                  }}
                  onSubmitEditing={() => {
                    this.enterDistrict.focus();
                  }}
                />
              </Item>
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("District")}</Label>
                <Input
                  placeholder={translate("District")}
                  style={styles.transparentLabel}
                  value={district}
                  editable={editable}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('district', value)
                  }
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  getRef={(ref) => {
                    this.enterDistrict = ref.wrappedInstance;
                  }}
                  onSubmitEditing={() => {
                    this.enterState.focus();
                  }}
                />
              </Item>
              <Item floatingLabel>
              <Label style={{fontFamily: 'Roboto'}}>{translate("State")}</Label>
                <Input
                  placeholder={translate("State")}
                  style={styles.transparentLabel}
                  value={state}
                  editable={editable}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('state', value)
                  }
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  getRef={(ref) => {
                    this.enterState = ref.wrappedInstance;
                  }}
                  onSubmitEditing={() => {
                    this.enterCountry.focus();
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label style={{fontFamily: 'Roboto'}}>{translate("Country")}</Label>
                <Input
                  placeholder={translate("Country")}
                  style={styles.transparentLabel}
                  value={country}
                  editable={editable}
                  returnKeyType={'done'}
                  onChangeText={(value) =>
                    this.onChangeUpdateAddressData('country', value)
                  }
                  getRef={(ref) => {
                    this.enterCountry = ref.wrappedInstance;
                  }}
                />
              </Item>
              <Button
                success
                style={styles.confirmUpdateLocBtn}
                block
                onPress={() => this.onPressUpdateLocInfo()}>
                <Icon name="paper-plane"></Icon>
                <Text>{translate("Update")}</Text>
              </Button>
            </Form>
          </Content>
        )}
        <View style={{ position: 'absolute' }}>
          <Row style={styles.SearchRow1}>
            <View style={styles.SearchStyle}>
              <TouchableOpacity style={{ justifyContent: 'center' }}>
                <Icon
                  name="ios-search"
                  style={{ color: '#fff', fontSize: 20, padding: 2 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', width: '90%' }}>
              <Input
                placeholder={translate("Search Location")}
                value={searchBoxLocFullText}
                style={styles.inputfield}
                placeholderTextColor="black"
                onFocus={() => {
                  this.state.fromProfile
                    ? this.props.navigation.navigate('UserAddress', {
                      fromProfile: true,
                    })
                    : this.navigationOption
                      ? this.props.navigation.navigate('UserAddress', {
                        navigationOption: this.navigationOption,
                      })
                      : this.props.navigation.navigate('UserAddress');
                }}
                onChangeText={(searchBoxLocFullText) =>
                  this.setState({ searchBoxLocFullText })
                }
              />
            </View>
          </Row>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerForBubble: {
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    alignSelf: 'flex-end',
    left: 0,
    right: 0,
    paddingVertical: 16,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 200,
    position: 'absolute',
    bottom: 20,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#686cc3',
  },
  header: {
    backgroundColor: '#f6f8fa',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  map: {
    height: 400,
    marginTop: 80,
  },
  customText: {
    marginLeft: 10,
    fontFamily: 'Roboto',
  },
  transparentLabel: {
    borderBottomColor: 'transparent',
    height: 45,
    marginTop: 5,
    borderRadius: 5,
    color: '#000',
    fontFamily: 'Roboto',
  },
  transparentLabel1: {
    borderBottomColor: 'transparent',
    backgroundColor: '#F1F1F1',
    height: 45,
    marginTop: 10,
    borderRadius: 5,
    paddingLeft: 20,
    fontFamily: 'Roboto',
    fontSize: 15
    
  },

  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
    transform: [{ scale: 0.6 }],
  },
  bodyContent: {
    paddingLeft: 10,
    paddingRight: 20,
  },
  confirmUpdateLocBtn: {
    marginTop: 25,
    backgroundColor: primaryColor,
    borderRadius: 5,
    fontFamily: 'Roboto',
    marginLeft: 15,
    marginBottom: 10,
    borderRadius: 15,
  },
  SearchStyle: {
    backgroundColor: primaryColor,
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightColor: '#000',
    borderRightWidth: 0.5,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  SearchRow: {
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 0.5,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  inputfield: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 5,
    paddingLeft: 10,
  },
  SearchRow1: {
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 0.5,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 5,
    marginTop: 35,
  },
});
