import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
  Title,
  Header,
  H3,
  Button,
  Card,
  List,
  ListItem,
  View,
  Left,
  Right,
  Toast,
  Thumbnail,
  Body,
  Icon,
  locations,
  ProgressBar,
  Item,
  Radio,
  Switch,
} from 'native-base';
import {
  fetchUserProfile,
  storeBasicProfile,
} from '../../providers/profile/profile.action';
import { getPatientWishList } from '../../providers/bookappointment/bookappointment.action';
import { hasLoggedIn, userFiledsUpdate } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { dateDiff } from '../../../setup/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
// import Modal from "react-native-modal";
import { NavigationEvents } from 'react-navigation';
import { Loader } from '../../../components/ContentLoader';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadMultiPart } from '../../../setup/services/httpservices';
import { renderDoctorImage, renderProfileImage, getGender } from '../../common';
import EcardDetails from './EcardDetails';

class Profile extends Component {
  navigation = this.props.navigation;
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      starCount: 3.5,
      userId: '',
      modalVisible: false,
      favouriteList: [],
      imageSource: null,
      file_name: '',
      isLoading: false,
      selectOptionPoopup: false,
      is_blood_donor: false,
      family_members: [],
      isCorporateUser: false
    };
  }
  async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
      this.props.navigation.navigate('login');
      return;
    }
    const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
    this.setState({ isCorporateUser })
    this.getUserProfile();
    this.getfavouritesList();
  }
  componentWillUnmount() {
    this.setState({ selectOptionPoopup: false });
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  /*Get userProfile*/
  getUserProfile = async () => {
    try {
      let fields =
        'first_name,last_name,gender,dob,mobile_no,secondary_mobile,email,secondary_email,insurance,address,is_blood_donor,is_available_blood_donate,blood_group,profile_image,is_email_verified,height,weight,family_members';

      let userId = await AsyncStorage.getItem('userId');
      let result = await fetchUserProfile(userId, fields);

      if (result) {
        this.setState({
          data: result,
          is_blood_donor: result.is_blood_donor,
          family_members: result.family_members,
        });
        storeBasicProfile(result);

        if (result.profile_image) {
          this.setState({ imageSource: result.profile_image.imageURL });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  getfavouritesList = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      let result = await getPatientWishList(userId);
      if (result.success) {
        this.setState({ favouriteList: result.data });
      }
    } catch (e) {
      console.log(e);
    }
  };
  updateBloodDonor = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      let requestData = {
        is_blood_donor: this.state.is_blood_donor,
        family_members: this.state.family_members,
      };
      let response = await userFiledsUpdate(userId, requestData);
      if (this.state.data.address !== undefined) {
        if (response.success) {
          Toast.show({
            text: response.message,
            type: 'success',
            duration: 3000,
          });
        } else {
          Toast.show({
            text: response.message,
            type: 'danger',
            duration: 3000,
          });
          this.setState({ isLoading: false });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  editProfile(screen) {
    this.props.navigation.navigate(screen, {
      screen: screen,
      fromProfile: true,
      updatedata: this.state.data || '',
    });
  }

  editAddress(address) {
    try {
      debugger;
      if (address === null) {
        this.editProfile('MapBox');
      } else {
        let locationAndContext = location(address.address);
        let latLng = address.coordinates;
        let addrressData = {
          no_and_street: address.address.no_and_street,
          center: [latLng[1], latLng[0]],
          place_name: locationAndContext.placeName,
          context: locationAndContext.context,
        };
        this.props.navigation.navigate('MapBox', {
          locationData: addrressData,
          fromProfile: true,
          mapEdit: true,
        });

        function location(locationObj) {


          let placeName = '';
          let contextData = [];
          Object.keys(locationObj).forEach(keyEle => {
            let obj = {
              text: locationObj[keyEle],
            };
            switch (keyEle) {
              case 'no_and_street':
                obj.id = 'no_and_street.123';
                break;
              case 'address_line_1':
                obj.id = 'locality.123';
                break;
              case 'city':
                obj.id = 'place.123';
                break;
              case 'post_office_name':
                obj.id = 'post_office_name.123';
                break;
              case 'district':
                obj.id = 'district.123';
                break;
              case 'state':
                obj.id = 'region.123';
                break;
              case 'country':
                obj.id = 'country.123';
                break;
              case 'pin_code':
                obj.id = 'pin_code.123';
                break;
            }
            contextData.push(obj);
            placeName += locationObj[keyEle] + ', ';
          });

          return {
            placeName: placeName.slice(0, -2),
            context: contextData,
          };
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  /*Upload profile pic*/
  uploadProfilePicture(type) {
    if (type == 'Camera') {
      ImagePicker.openCamera({
        cropping: true,
        width: 500,
        height: 500,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          this.setState({ selectOptionPoopup: false });

          this.uploadImageToServer(image);
        })
        .catch(ex => {
          this.setState({ selectOptionPoopup: false });

        });
    } else {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true,
        avoidEmptySpaceAroundImage: true,
      })
        .then(image => {


          this.setState({ selectOptionPoopup: false });
          this.uploadImageToServer(image);
        })
        .catch(ex => {
          this.setState({ selectOptionPoopup: false });

        });
    }
  }

  /*Store image into api folder*/
  uploadImageToServer = async image => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      var formData = new FormData();
      formData.append('profile', {
        uri: image.path,
        type: image.mime,
        name: 'photo.jpg',
      });
      let endPoint = `user/${userId}/upload/profile`;
      var res = await uploadMultiPart(endPoint, formData);
      const response = res.data;
      if (response.success) {
        this.setState({
          imageSource: image.path,
        });
        Toast.show({
          text: 'Profile picture uploaded successfully',
          type: 'success',
          duration: 3000,
        });
      } else {
        Toast.show({
          text: 'Problem Uploading Profile Picture',
          duration: 3000,
          type: 'danger',
        });
      }
    } catch (e) {
      Toast.show({
        text: 'Problem Uploading Profile Picture' + e,
        duration: 3000,
        type: 'danger',
      });
    }
  };

  removeSelected = async index => {
    let temp = this.state.family_members;
    temp.splice(index, 1);
    this.setState({ family_members: temp, updateButton: false });
  };



  render() {
    const {
      profile: { isLoading },
    } = this.props;
    const { data, imageSource, family_members } = this.state;

    return (
      <Container style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.getUserProfile(payload);
          }}
        />

        {this.state.isLoading ? (
          <Loader style={'profile'} />
        ) : (
            <Content style={styles.bodyContent}>
              <LinearGradient
                colors={['#7E49C3', '#C86DD7']}
                style={{ height: 180 }}>
                <Grid>
                  <Row>
                    <Col style={{ width: '10%' }} />
                    <Col style={styles.customCol}>
                      <Icon name="heart" style={styles.profileIcon} />
                    </Col>
                    <Col style={{ width: '55%' }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('ImageView', {
                            passImage: renderProfileImage(data),
                            title: 'Profile photo',
                          })
                        }>
                        {imageSource != undefined ? (
                          <Thumbnail
                            style={styles.profileImage}
                            source={{ uri: imageSource }}
                          />
                        ) : (
                            <Thumbnail
                              style={styles.profileImage}
                              square
                              source={renderProfileImage(data)}
                            />
                          )}
                      </TouchableOpacity>
                      <View
                        style={{
                          marginLeft: 80,
                          marginTop: -20,
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name="camera"
                          style={{ fontSize: 20 }}
                          onPress={() =>
                            this.setState({ selectOptionPoopup: true })
                          }
                          testID="cameraIconTapped"
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 10,
                          marginLeft: 30,
                        }}>
                        <Text
                          style={styles.nameStyle}
                          onPress={() => this.editProfile('UpdateUserDetails')}>
                          {data.first_name ? data.first_name + ' ' : ''}
                          <Text style={styles.nameStyle}>
                            {data.last_name ? data.last_name : ''}
                          </Text>
                        </Text>

                        <Icon
                          name="create"
                          style={{ fontSize: 20, marginTop: 10, marginLeft: 25 }}
                          onPress={() => this.editProfile('UpdateUserDetails')}
                        />
                      </View>
                    </Col>
                    <Col style={styles.customCol}>
                      <Icon name="heart" style={styles.profileIcon} />
                    </Col>
                    <Col style={{ width: '10%' }} />
                  </Row>
                </Grid>
              </LinearGradient>
              <Modal
                visible={this.state.selectOptionPoopup}
                transparent={true}
                animationType={'fade'}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      width: '80%',
                      height: '35%',
                      backgroundColor: '#fff',
                      borderColor: 'gray',
                      borderWidth: 3,
                      padding: 30,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontFamily: 'OpenSans',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {' '}
                    Select a Photo{' '}
                    </Text>
                    {/* </Item> */}
                    <Row style={{ marginTop: 10 }}>
                      <Col>
                        <TouchableOpacity
                          onPress={() => this.uploadProfilePicture('Camera')}
                          testID="chooseCemara">
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: 'OpenSans',
                              marginLeft: 10,
                              marginTop: 10,
                            }}>
                            Take Photo
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.uploadProfilePicture('Library')}
                          testID="chooselibrary">
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: 'OpenSans',
                              marginLeft: 10,
                              marginTop: 10,
                            }}>
                            Choose from Library
                        </Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 50 }}>
                      <Right style={{ marginTop: 15, marginLeft: 15 }}>
                        <Button
                          transparent
                          style={{ marginTop: 15 }}
                          onPress={() =>
                            this.setState({ selectOptionPoopup: false })
                          }
                          testID="cancleButton">
                          <Text style={{ fontFamily: 'OpenSans', fontSize: 20 }}>
                            {' '}
                          Cancel
                        </Text>
                        </Button>
                      </Right>
                    </Row>
                  </View>
                </View>
              </Modal>

              <Card>
                <Grid style={{ padding: 10 }}>
                  <Col
                    style={{
                      backgroundColor: 'transparent',
                      borderRightWidth: 0.5,
                      borderRightColor: 'gray',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}>
                    <Text style={styles.topValue}> Age </Text>
                    <Text note style={styles.bottomValue}>
                      {' '}
                      {dateDiff(data.dob, new Date(), 'years')}{' '}
                    </Text>
                  </Col>

                  <Col
                    style={{
                      backgroundColor: 'transparent',
                      borderRightWidth: 0.5,
                      borderRightColor: 'gray',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      justifyContent: 'center',
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.topValue}>Gender </Text>
                    </View>
                    <Text note style={styles.bottomValue}>
                      {getGender(data)}{' '}
                    </Text>
                  </Col>

                  <Col
                    style={{
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}>
                    <Text style={styles.topValue}>Blood</Text>
                    <Text note style={styles.bottomValue}>
                      {' '}
                      {data.blood_group}{' '}
                    </Text>
                  </Col>
                </Grid>
              </Card>
              <List>
                <Text style={styles.titleText}>Personal details..</Text>

                <ListItem avatar>
                  <Left>
                    <Icon name="ios-body" style={{ color: '#7E49C3' }} />
                  </Left>
                  <Body>
                    <Row>
                      <Col>
                        <Text style={styles.customText}>Weight</Text>
                        <Text note style={styles.customText1}>{data.weight} kg</Text>
                      </Col>
                      <Col>
                        <Text style={styles.customText}>Height</Text>
                        <Text note style={styles.customText1}>{data.height} cm</Text>
                      </Col>
                    </Row>
                  </Body>

                  <Right>
                    <Icon
                      name="create"
                      style={{ color: 'black' }}
                      onPress={() =>
                        this.props.navigation.navigate('Updateheightweight', {
                          weight: data.weight,
                          height: data.height,
                        })
                      }
                    />
                  </Right>
                </ListItem>
                <ListItem avatar>
                  <Left>
                    <Icon name="ios-home" style={{ color: '#7E49C3' }} />
                  </Left>
                  <Body>
                    <Text style={styles.customText}>Family details</Text>

                    <FlatList
                      data={family_members}
                      renderItem={({ item, index }) => (
                        <View>
                          <Row style={{ marginTop: 10 }}>
                            <Col size={8}>
                              <Row>
                                <Col size={2}>
                                  <Text note style={styles.customText1}>
                                    Name
                                </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text note style={styles.customText1}>
                                    -
                                </Text>
                                </Col>
                                <Col size={6}>
                                  <Text note style={styles.customText1}>
                                    {item.name}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                            <Col size={1}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.editProfile('UpdateFamilyMembers')
                                }>
                                <Icon
                                  active
                                  name="create"
                                  style={{
                                    color: 'black',
                                    fontSize: 20,
                                    marginRight: 5,
                                  }}
                                />
                              </TouchableOpacity>
                            </Col>
                            <Col size={0.5}>
                              <TouchableOpacity
                                onPress={() => this.removeSelected(index)}>
                                <Icon
                                  active
                                  name="ios-close"
                                  style={{ color: '#d00729', fontSize: 18 }}
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>

                          <Row>
                            <Col size={10}>
                              <Row>
                                <Col size={2}>
                                  <Text note style={styles.customText1}>
                                    Age
                                </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text note style={styles.customText1}>
                                    -
                                </Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text note style={styles.customText1}>
                                    {item.age + ' - ' + getGender(item)}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col size={10}>
                              <Row>
                                <Col size={2}>
                                  <Text note style={styles.customText1}>
                                    Relation
                                </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text note style={styles.customText1}>
                                    -
                                </Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text note style={styles.customText1}>
                                    {item.relationship}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </View>
                      )}
                    />
                    <Button transparent style={{justifyContent:'flex-start',marginLeft:-15}}>
                      <Icon name="add" style={{ color: 'gray' }} />
                      <Text
                        uppercase={false}
                        style={styles.customText2}
                        onPress={() => this.editProfile('UpdateFamilyMembers')}
                        testID="onPressAddFamilyMembers">
                        Add your family details
                    </Text>
                    </Button>
                  </Body>
                </ListItem>
                {this.state.isCorporateUser === false ?
                  <ListItem avatar>
                    <Left>
                      <Icon
                        name="ios-flame"
                        style={{ color: '#7E49C3', marginTop: 5 }}
                      />
                    </Left>

                    <Body>
                      <Text style={styles.customText}>Blood Donor</Text>
                    </Body>

                    <Right
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: -15,
                      }}>
                      <Switch
                        value={this.state.is_blood_donor}
                        style={{ marginTop: 15 }}
                        onValueChange={value => {
                          this.setState({
                            is_blood_donor: !this.state.is_blood_donor,
                          });
                          if (value === true) {
                            if (data.address === undefined) {
                              this.editProfile('MapBox');
                            }
                          }
                          this.updateBloodDonor();
                        }}
                      />
                    </Right>
                  </ListItem>
                  : null}
                <ListItem avatar>
                  <Left>
                    <Icon name="mail" style={{ color: '#7E49C3' }} />
                  </Left>

                  <Body>
                    <TouchableOpacity
                      onPress={() => this.editProfile('UpdateEmail')}
                      testID="onPressEmail">
                      <Text style={styles.customText}>Email</Text>
                      {data.email != undefined ? (
                        <Text note style={styles.customText1}>
                          {data.email}
                        </Text>
                      ) : (
                          <Button transparent style={{justifyContent:'flex-start',marginLeft:-15}}>
                            <Icon name="add" style={{ color: 'gray' }} />
                            <Text
                              uppercase={false}
                              style={styles.customText}
                              onPress={() => this.editProfile('UpdateEmail')}
                              testID="onPressAddSecondaryEmail">
                              Add your email
                        </Text>
                          </Button>
                        )}
                    </TouchableOpacity>
                  </Body>

                  {data.email != undefined ? (
                    <Right>
                      <Icon
                        name="create"
                        style={{ color: 'black' }}
                        onPress={() => this.editProfile('UpdateEmail')}
                        testID="iconToUpdateEmail"
                      />
                    </Right>
                  ) : null}
                </ListItem>

                <ListItem avatar>
                  <Left>
                    <Icon name="locate" style={{ color: '#7E49C3' }} />
                  </Left>

                  <Body>
                    <TouchableOpacity
                      onPress={() => this.editAddress(data.address)}
                      testID="onPressAddress">
                      <Text style={styles.customText}>Address</Text>
                      {data.address ? (
                        <View>
                          <Text note style={styles.customText1}>
                            {data.address.address.no_and_street + ','}
                            <Text note style={styles.customText1}>
                              {data.address.address.address_line_1
                                ? data.address.address.address_line_1
                                : ' '}
                            </Text>
                          </Text>
                          <Text note style={styles.customText1}>
                            {data.address.address.district +
                              ', ' +
                              data.address.address.city}
                          </Text>
                          <Text note style={styles.customText1}>
                            {data.address.address.state +
                              ', ' +
                              data.address.address.country}
                          </Text>
                          <Text note style={styles.customText1}>
                            {data.address.address.pin_code}
                          </Text>
                        </View>
                      ) : (
                          <Button
                            transparent style={{justifyContent:'flex-start',marginLeft:-15}}
                            onPress={() => this.editProfile('MapBox')}>
                            <Icon name="add" style={{ color: 'gray' }} />
                            <Text uppercase={false} style={styles.customText}>
                              Add Address
                        </Text>
                          </Button>
                        )}
                    </TouchableOpacity>
                  </Body>
                  {data.address ? (
                    <Right>
                      <Icon
                        name="create"
                        style={{ color: 'black' }}
                        onPress={() => this.editAddress(data.address)}
                        testID="iconToUpdateAddress"
                      />
                    </Right>
                  ) : null}
                </ListItem>

                <ListItem avatar>
                  <Left>
                    <Icon name="call" style={{ color: '#7E49C3' }} />
                  </Left>

                  <Body>
                    <View testID="onPressUpdateContact">
                      <Text style={styles.customText}>Contact</Text>
                      <Text note style={styles.customText1}>
                        {data.mobile_no}
                      </Text>
                    </View>
                  </Body>
                  {data.mobile_no === undefined ? (
                    <Right>
                      <Icon
                        name="create"
                        style={{ color: 'black' }}
                        onPress={() => this.editProfile('UpdateContact')}
                        testID="iconToUpdateContact"
                      />
                    </Right>
                  ) : null}
                </ListItem>

                <ListItem avatar>
                  <Left>
                    <Icon
                      name="heartbeat"
                      type="FontAwesome"
                      style={{ color: '#7E49C3' }}
                    />
                  </Left>
                  <Body>
                    <TouchableOpacity
                      onPress={() => this.editProfile('UpdateInsurance')}
                      testID="onPressUpdateInsurance">
                      <Text style={styles.customText}>Insurance</Text>
                      {data.insurance != undefined ? (
                        <FlatList
                          data={this.state.data.insurance}
                          renderItem={({ item }) => (
                            <List>
                              <Text note style={styles.customText1}>
                                {item.insurance_no}
                              </Text>
                              <Text note style={styles.customText1}>
                                {item.insurance_provider}
                              </Text>
                            </List>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      ) : (
                          <Button transparent style={{justifyContent:'flex-start',marginLeft:-15}}>
                            <Icon name="add" style={{ color: 'gray' }} />
                            <Text
                              uppercase={false}
                              style={styles.customText}
                              onPress={() => this.editProfile('UpdateInsurance')}
                              testID="clickAddInsuranceText">
                              Add Insurance
                        </Text>
                          </Button>
                        )}
                    </TouchableOpacity>
                  </Body>

                  {data.insurance != undefined ? (
                    <Right>
                      <Icon
                        name="create"
                        style={{ color: 'black' }}
                        onPress={() => this.editProfile('UpdateInsurance')}
                        testID="iconToEditUpdateInsurance"
                      />
                    </Right>
                  ) : null}
                </ListItem>


                <ListItem avatar>
                  <Left>
                    <Icon name="briefcase" style={{ color: '#7E49C3' }} />
                  </Left>
                  <Body>
                    <TouchableOpacity
                      onPress={() => this.editProfile('UpdatePassword')}
                      testID="onPressUpdatePassword">
                      <Text style={styles.customText}>Change Password</Text>
                      <Text note style={styles.customText1}>
                        *********
                    </Text>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    <Icon
                      name="create"
                      style={{ color: 'black' }}
                      onPress={() => this.editProfile('UpdatePassword')}
                      testID="iconToUpdatePassword"
                    />
                  </Right>
                </ListItem>
              </List>
              <EcardDetails />
              {this.state.favouriteList.length === 0 ? null : (
                <Card style={{ padding: 10 }}>
                  <List>
                    <Text style={styles.titleText}>Your Doctors</Text>

                    <FlatList
                      data={this.state.favouriteList}
                      renderItem={({ item }) => (
                        <ListItem avatar noBorder>
                          <Left>
                            <TouchableOpacity
                              style={{
                                paddingRight: 5,
                                paddingBottom: 5,
                                paddingTop: 5,
                              }}
                              onPress={() =>
                                this.props.navigation.navigate('ImageView', {
                                  passImage: renderDoctorImage(item.doctorInfo),
                                  title: 'Profile photo',
                                })
                              }>
                              <Thumbnail
                                square
                                source={renderDoctorImage(item.doctorInfo)}
                                style={{ height: 60, width: 60, borderRadius: 60 }}
                              />
                            </TouchableOpacity>
                          </Left>
                          <Body>
                            <Text
                              style={{
                                fontFamily: 'OpenSans',
                                fontSize: 12,
                                width: '100%',
                              }}>
                              {item.doctorInfo.prefix
                                ? item.doctorInfo.prefix + '.'
                                : 'Dr.'}{' '}
                              {item.doctorInfo.first_name +
                                ' ' +
                                item.doctorInfo.last_name}{' '}
                            </Text>
                          </Body>
                          <Right>
                            <TouchableOpacity style={styles.docbutton}>
                              <Text
                                style={{
                                  fontFamily: 'OpenSans',
                                  fontSize: 12,
                                  color: '#fff',
                                  textAlign: 'center',
                                }}
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    'Doctor Details Preview',
                                    {
                                      doctorId: item.doctorInfo.doctor_id,
                                      fetchAvailabiltySlots: true,
                                    },
                                  )
                                }
                                testID="navigateBookAppointment">
                                {' '}
                              Book Again
                            </Text>
                            </TouchableOpacity>
                          </Right>
                        </ListItem>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </List>
                </Card>
              )}
            </Content>
          )}
      </Container>
    );
  }
}

function profileState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(profileState)(Profile);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },

  bodyContent: {},

  customHead: {
    fontFamily: 'OpenSans',
  },
  customText: {
    fontSize: 15,
    fontFamily: 'OpenSans',
  },
  customText1: {
    fontSize: 13,
    fontFamily: 'OpenSans',
  },
  customText2: {
    fontSize: 15,
    fontFamily: 'OpenSans',
    // marginRight: 100,
  },
  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },

  customCard: {
    borderRadius: 20,
    padding: 10,
    marginTop: -100,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: 'OpenSans',
  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
    fontSize: 15,
  },
  bottomValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans',
    fontSize: 13,
  },
  updateButton: {
    height: 30,
    width: 'auto',
    borderRadius: 10,
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
    marginLeft: 80,
  },

  titleText: {
    fontSize: 15,
    padding: 5,
    margin: 10,
    backgroundColor: '#FF9500',
    borderRadius: 20,
    color: 'white',
    width: 150,
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
  docbutton: {
    height: 30,
    width: 'auto',
    borderRadius: 20,
    fontSize: 10,
    backgroundColor: '#7357A2',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  profileIcon: {
    color: '#fff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 35,
  },
  profileImage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    height: 80,
    width: 80,
    borderColor: '#f5f5f5',
    borderWidth: 2,
    borderRadius: 50,
  },
  customCol: {
    width: '20%',

    borderRadius: 25,
    borderColor: '#fff',
    height: 50,
    width: 50,
    backgroundColor: '#C86DD7',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: '#9B9B9B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',
  },
  nameStyle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 5,
    fontFamily: 'OpenSans',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
  },

});
