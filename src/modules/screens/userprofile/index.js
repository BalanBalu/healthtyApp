import React, {Component} from 'react';
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
  primaryColor,
  secondaryColor,
  secondaryColorTouch,
} from '../../../setup/config';

import {
  fetchUserProfile,
  storeBasicProfile,
} from '../../providers/profile/profile.action';
import {getPatientWishList} from '../../providers/bookappointment/bookappointment.action';
import {
  hasLoggedIn,
  updateMemberDetails,
  getPostOffNameAndDetails,
} from '../../providers/auth/auth.actions';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {connect} from 'react-redux';
import {dateDiff} from '../../../setup/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, TouchableOpacity, FlatList, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Modal from "react-native-modal";
import {NavigationEvents} from 'react-navigation';
import {Loader} from '../../../components/ContentLoader';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadImage} from '../../providers/common/common.action';
import {renderDoctorImage, renderProfileImage} from '../../common';
// import EcardDetails from '../userprofile/EcardDetails';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  getMemberDetailsByEmail,
  getFamilyMemDetails,
  deleteFamilyMembersDetails,
} from '../../providers/corporate/corporate.actions';
import ConfirmPopup from '../../shared/confirmPopup';

class Profile extends Component {
  navigation = this.props.navigation;
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      userId: '',
      modalVisible: false,
      favouriteList: [],
      imageSource: null,
      file_name: '',
      isLoading: true,
      selectOptionPoopup: false,
      is_blood_donor: false,
      family_members: [],
      deletePopupVisible: false,
    };
  }
  async componentDidMount() {
    const isLoggedIn = await hasLoggedIn(this.props);
    if (!isLoggedIn) {
      this.props.navigation.navigate('login');
      return;
    }
    await this.getFamilyDetails();
    await this.getMemberDetailsByEmail();
    this.getfavouritesList();
  }
  componentWillUnmount() {
    this.setState({selectOptionPoopup: false});
  }

  /*Get userProfile*/
  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        await this.setState({data: result[0]});
       
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  getFamilyDetails = async () => {
    try {
      this.setState({isLoading: true});
        await this.setState({family_members: this.props.profile.familyData || []});
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  getfavouritesList = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      let result = await getPatientWishList(userId);
      if (result.success) {
        this.setState({favouriteList: result.data});
      }
    } catch (e) {
      console.log(e);
    }
  };

  editProfile(screen) {
    this.props.navigation.navigate(screen, {
      screen: screen,
      fromProfile: true,
      updatedata: this.state.data || '',
      id: this.state.data._id,
      updateEmpDetails:this.state.id
    });
  }

  editAddress = async (item) => {
    try {
      let addrressData;
      if (item === null) {
        this.editProfile('MapBox');
      } else {
        let address = {
          address1: item.address1,
          address2: item.address2,
          city: item.city,
          state: item.state,
          country: item.country,
          pinCode: item.pinCode,
        };

        let locationAndContext = location(address);
        let latLng = item.coordinates;
        if (latLng.length != 0) {
          addrressData = {
            address1: item.address1,
            center: latLng ? [latLng[1], latLng[0]] : null,
            place_name: locationAndContext.placeName,
            context: locationAndContext.context,
          };
        } else {
          let coordinates = [];
          const postOffResp = await getPostOffNameAndDetails(item.pinCode);
          if (postOffResp.Status == 'Success') {
            const postOfficeData = postOffResp.PostOffice;
            coordinates.push(
              postOfficeData[0].Longitude,
              postOfficeData[0].Latitude,
            );
          }
          addrressData = {
            address1: item.address1,
            center: coordinates ? coordinates : null,
            place_name: locationAndContext.placeName,
            context: locationAndContext.context,
          };
        }
        this.props.navigation.navigate('MapBox', {
          locationData: addrressData,
          fromProfile: true,
          id: this.state.data._id,
          mapEdit: true,
        });

        function location(locationObj) {
          let placeName = '';
          let contextData = [];
          Object.keys(locationObj).forEach((keyEle) => {
            let obj = {
              text: locationObj[keyEle],
            };
            switch (keyEle) {
              case 'address1':
                obj.id = 'address1.123';
                break;
              case 'address2':
                obj.id = 'address2.123';
                break;
              case 'city':
                obj.id = 'place.123';
                break;
              case 'postOfficeName':
                obj.id = 'postOfficeName.123';
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
              case 'pinCode':
                obj.id = 'pinCode.123';
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
      this.setState({isLoading: false});
    }
  };
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
        .then((image) => {
          this.setState({selectOptionPoopup: false});

          this.uploadImageToServer(image);
        })
        .catch((ex) => {
          this.setState({selectOptionPoopup: false});
        });
    } else {
      ImagePicker.openPicker({
        multiple:false,
        width: 300,
        height: 400,
        // cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true,
        avoidEmptySpaceAroundImage: true,
      })
        .then((image) => {
          this.setState({selectOptionPoopup: false});
          this.uploadImageToServer(image);
        })
        .catch((ex) => {
          this.setState({selectOptionPoopup: false});
        });
    }
  }

  /*Store image into api folder*/
  uploadImageToServer = async (image) => {
    try {
      let appendForm = 'profileImage';
      let endPoint = 'images/upload?path=profileImage';
      const response = await uploadImage(image, endPoint, appendForm);
      if (response.success) {
        let requestData = {
          profileImage: response.data,
          _id: this.state.data._id,
        };
        let result = await updateMemberDetails(requestData);
        if (result) {
          this.setState({
            imageSource: image.path,
          });
          storeBasicProfile(result);
          Toast.show({
            text: 'Profile picture uploaded successfully',
            type: 'success',
            duration: 3000,
          });
        }
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
  async deleteSelectedDocs(id, index) {
    await this.setState({
      selectedFamilyIndex4Delete: index,
      selectedFamilyid4Delete: id,
      deletePopupVisible: true,
    });
  }

  removeSelected = async () => {
    let temp = this.state.family_members;
    temp.splice(this.state.selectedFamilyIndex4Delete, 1);
    this.setState({family_members: temp, updateButton: false});
    let deleteFamilyMembers = await deleteFamilyMembersDetails(
      this.state.selectedFamilyid4Delete,
    );
    if (deleteFamilyMembers) {
      Toast.show({
        text: 'Deleted your family member details',
        type: 'success',
        duration: 3000,
      });
    }
  };
  familyMemAgeCal = (value) => {
    try {
      if (value.familyMemberAge == 0 && value.familyMemberMonth <= 1)
        return value.familyMemberMonth + ' Month';
      else if (value.familyMemberAge == 0 &&value.familyMemberMonth > 1)
        return value.familyMemberMonth + ' Months';
      else if (value.familyMemberAge > 1)
        return value.familyMemberAge + ` Years `;
      else return value.familyMemberAge + ` Year`;
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };
  render() {
    const {
      profile: {isLoading},
    } = this.props;
    const {data, imageSource, family_members} = this.state;
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onWillFocus={(payload) => {
            this.getMemberDetailsByEmail(payload), this.getFamilyDetails();
          }}
        />

        {this.state.isLoading ? (
          <Loader style={'profile'} />
        ) : (
          <Content style={styles.bodyContent}>
            <LinearGradient
              colors={[primaryColor, secondaryColor]}
              style={{height: 180}}>
              <Grid>
                <Row>
                  <Col style={{width: '10%'}} />
                  <Col style={styles.customCol}>
                    <Icon name="heart" style={styles.profileIcon} />
                  </Col>
                  <Col style={{width: '55%'}}>
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
                          source={{uri: imageSource}}
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
                        style={{fontSize: 20}}
                        onPress={() =>
                          this.setState({selectOptionPoopup: true})
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
                        {data.firstName ? data.firstName + ' ' : ''}
                        <Text style={styles.nameStyle}>
                          {data.middleName ? data.middleName : ''}
                        <Text style={styles.nameStyle}>
                          {data.lastName ? data.lastName : ''}
                        </Text>
                        </Text>
                      </Text>

                      <MaterialIcons
                        name="create"
                        style={{
                          fontSize: 20,
                          marginTop: 10,
                          marginLeft: 25,
                          color: '#000',
                        }}
                        onPress={() => this.editProfile('UpdateUserDetails')}
                      />
                    </View>
                  </Col>
                  <Col style={styles.customCol}>
                    <Icon name="heart" style={styles.profileIcon} />
                  </Col>
                  <Col style={{width: '10%'}} />
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
                      fontFamily: 'opensans-bold',
                      textAlign: 'center',
                    }}>
                    {' '}
                    Select a Photo{' '}
                  </Text>
                  {/* </Item> */}
                  <Row style={{marginTop: 10}}>
                    <Col>
                      <TouchableOpacity
                        onPress={() => this.uploadProfilePicture('Camera')}
                        testID="chooseCemara">
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'Roboto',
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
                            fontFamily: 'Roboto',
                            marginLeft: 10,
                            marginTop: 10,
                          }}>
                          Choose from Library
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 50}}>
                    <Right style={{marginTop: 15, marginLeft: 15}}>
                      <Button
                        transparent
                        style={{marginTop: 15}}
                        onPress={() =>
                          this.setState({selectOptionPoopup: false})
                        }
                        testID="cancleButton">
                        <Text style={{fontFamily: 'Roboto', fontSize: 20}}>
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
              <Grid style={{padding: 10}}>
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
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.topValue}>Gender </Text>
                  </View>
                  <Text note style={styles.bottomValue}>
                    {data.gender ? data.gender : '-'}{' '}
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
                    {data.bloodGroup ? data.bloodGroup : '-'}{' '}
                  </Text>
                </Col>
              </Grid>
            </Card>
            <List>
              <Text style={styles.titleText}>Personal details..</Text>

              <ListItem avatar>
                <Left>
                  <Icon name="ios-home" style={{color: primaryColor}} />
                </Left>
                <Body>
                  <Text style={styles.customText}>Family details</Text>

                  <FlatList
                    data={family_members}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          borderWidth: 0.3,
                          borderColor: '#101010',
                          marginBottom: 10,
                          borderRadius: 5,
                          padding: 5,
                          marginRight: 20,
                          marginTop: 10,
                        }}>
                        <Row style={{marginTop: 10}}>
                          <Col size={8}>
                            <Row>
                              <Col size={4}>
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
                                  {item.familyMemberName}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                          {item.relationship!='EMPLOYEE'&&item.relationship!='SELF'?
                          <Col size={1}>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate(
                                  'UpdateFamilyMembers',
                                  {
                                    updatedata: item,
                                    fromProfile: true,
                                    data: family_members,
                                  },
                                )
                              }>
                              <MaterialIcons
                                active
                                name="create"
                                style={{
                                  color: 'black',
                                  fontSize: 15,
                                  marginRight: 5,
                                }}
                              />
                            </TouchableOpacity>
                          </Col>:null}
                          {item.relationship!='EMPLOYEE'&&item.relationship!='SELF'?
                          <Col size={0.5}>
                            <TouchableOpacity
                              onPress={() =>
                                this.deleteSelectedDocs(item._id, index)
                              }>
                              <Icon
                                active
                                name="ios-trash"
                                style={{color: '#d00729', fontSize: 15}}
                              />
                            </TouchableOpacity>
                          </Col>:null}
                        </Row>
                        <Row>
                          <Col size={10}>
                            <Row>
                              <Col size={3}>
                                <Text note style={styles.customText1}>
                                  Member Code
                                </Text>
                              </Col>
                              <Col size={0.5}>
                                <Text note style={styles.customText1}>
                                  -
                                </Text>
                              </Col>
                              <Col size={6}>
                                <Text note style={styles.customText1}>
                                  {item.memberId ? item.memberId : 'N/A'}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col size={10}>
                            <Row>
                              <Col size={3}>
                                <Text note style={styles.customText1}>
                                  Age
                                </Text>
                              </Col>
                              <Col size={0.5}>
                                <Text note style={styles.customText1}>
                                  -
                                </Text>
                              </Col>
                              <Col size={6}>
                                <Text note style={styles.customText1}>
                                  {this.familyMemAgeCal(item)}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col size={10}>
                            <Row>
                              <Col size={3}>
                                <Text note style={styles.customText1}>
                                  Gender
                                </Text>
                              </Col>
                              <Col size={0.5}>
                                <Text note style={styles.customText1}>
                                  -
                                </Text>
                              </Col>
                              <Col size={6}>
                                <Text note style={styles.customText1}>
                                  {item.familyMemberGender
                                    ? item.familyMemberGender 
                                    : 'N/A'}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col size={10}>
                            <Row>
                              <Col size={3}>
                                <Text note style={styles.customText1}>
                                  Relation
                                </Text>
                              </Col>
                              <Col size={0.5}>
                                <Text note style={styles.customText1}>
                                  -
                                </Text>
                              </Col>
                              <Col size={6}>
                                <Text note style={styles.customText1}>
                                  {item.relationship}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        {item.familyMemberDocument &&
                        item.familyMemberDocument.length != 0 ? (
                          <View style={styles.subView}>
                            <Row
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Left>
                                <TouchableOpacity
                                  style={styles.ecardButton}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'DocumentList',
                                      {
                                        uploadData: item.familyMemberDocument,
                                        data: item,
                                        familyDocs: true,
                                      },
                                    )
                                  }>
                                  <Text style={styles.linkHeader}>
                                    View Document
                                  </Text>
                                </TouchableOpacity>
                              </Left>
                            </Row>
                          </View>
                        ) : null}
                      </View>
                    )}
                  />
                  {family_members.length<11?
                  <Button
                    transparent
                    style={{justifyContent: 'flex-start', marginLeft: -15}}>
                    <Icon name="add" style={{color: 'gray'}} />
                    <Text
                      uppercase={false}
                      style={styles.customText2}
                      onPress={() =>
                        this.props.navigation.navigate('UpdateFamilyMembers', {
                          data: family_members,
                        })
                      }
                      testID="onPressAddFamilyMembers">
                      Add your family details
                    </Text>
                  </Button>:null}
                </Body>
              </ListItem>

              <ConfirmPopup
                warningMessageText={'Are you sure you want to delete !'}
                confirmButtonText={'Confirm'}
                confirmButtonStyle={styles.confirmButton}
                cancelButtonStyle={styles.cancelButton}
                cancelButtonText={'Cancel'}
                confirmButtonAction={() => {
                  this.removeSelected();
                  this.setState({deletePopupVisible: false});
                }}
                cancelButtonAction={() =>
                  this.setState({
                    deletePopupVisible: !this.state.deletePopupVisible,
                  })
                }
                visible={this.state.deletePopupVisible}
              />

              <ListItem avatar>
                <Left>
                  <Icon name="mail" style={{color: primaryColor}} />
                </Left>

                <Body>
                  <TouchableOpacity
                    onPress={() => this.editProfile('UpdateEmail')}
                    testID="onPressEmail">
                    <Text style={styles.customText}>Email</Text>
                    {data.emailId != undefined ? (
                      <Text note style={styles.customText1}>
                        {data.emailId}
                      </Text>
                    ) : (
                      <Button
                        transparent
                        style={{justifyContent: 'flex-start', marginLeft: -15}}>
                        <Icon name="add" style={{color: 'gray'}} />
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

                {data.emailId != undefined ? (
                  <Right>
                    <MaterialIcons
                      name="create"
                      style={{color: 'black', fontSize: 20}}
                      onPress={() => this.editProfile('UpdateEmail')}
                      testID="iconToUpdateEmail"
                    />
                  </Right>
                ) : null}
              </ListItem>

              <ListItem avatar>
                <Left>
                  <Icon name="locate" style={{color: primaryColor}} />
                </Left>

                <Body>
                  <TouchableOpacity
                    onPress={() => this.editAddress(data)}
                    testID="onPressAddress">
                    <Text style={styles.customText}>Address</Text>
                    {data.address1 ? (
                      <View>
                        <Text note style={styles.customText1}>
                          {data.address1 + ','}
                          <Text note style={styles.customText1}>
                            {data.address2 ? data.address2 : ' '}
                          </Text>
                        </Text>
                        <Text note style={styles.customText1}>
                          {data.address3 ? data.address3 + ',' : ' '}
                          <Text note style={styles.customText1}>
                            {data.city ? data.city : ' '}
                          </Text>
                        </Text>
                        <Text note style={styles.customText1}>
                          {data.state ? data.state + ',' : ' '}
                          <Text note style={styles.customText1}>
                            {data.country ? data.country : ' '}
                          </Text>
                        </Text>
                        <Text note style={styles.customText1}>
                          {data.pinCode}
                        </Text>
                      </View>
                    ) : (
                      <Button
                        transparent
                        style={{justifyContent: 'flex-start', marginLeft: -15}}
                        onPress={() => this.editProfile('MapBox')}>
                        <Icon name="add" style={{color: 'gray'}} />
                        <Text uppercase={false} style={styles.customText}>
                          Add Address
                        </Text>
                      </Button>
                    )}
                  </TouchableOpacity>
                </Body>
                {data.address1 ? (
                  <Right>
                    <MaterialIcons
                      name="create"
                      style={{color: 'black', fontSize: 20}}
                      onPress={() => this.editAddress(data)}
                      testID="iconToUpdateAddress"
                    />
                  </Right>
                ) : null}
              </ListItem>

              <ListItem avatar>
                <Left>
                  <Icon name="call" style={{color: primaryColor}} />
                </Left>
                <Body>
                  <TouchableOpacity
                    onPress={() => this.editProfile('UpdateContact')}
                    testID="onPressUpdateContact">
                    <Text style={styles.customText}>Contact</Text>
                    {data.mobile != undefined ? (
                      <Text note style={styles.customText1}>
                        {data.mobile}
                      </Text>
                    ) : (
                      <Button
                        transparent
                        style={{justifyContent: 'flex-start', marginLeft: -15}}>
                        <Icon name="add" style={{color: 'gray'}} />
                        <Text
                          uppercase={false}
                          style={styles.customText}
                          onPress={() =>
                            this.props.navigation.navigate('UpdateContact', {
                              id: this.state.data._id || null,
                            })
                          }
                          testID="clickAddContactNo">
                          Add Contact Number
                        </Text>
                      </Button>
                    )}
                  </TouchableOpacity>
                </Body>

                {data.mobile ? (
                  <Right>
                    <MaterialIcons
                      name="create"
                      style={{color: 'black', fontSize: 20}}
                      onPress={() => this.editProfile('UpdateContact')}
                      testID="iconToUpdateContact"
                    />
                  </Right>
                ) : null}
              </ListItem>

              <ListItem avatar>
                <Left>
                  <Icon name="briefcase" style={{color: primaryColor}} />
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
                  <MaterialIcons
                    name="create"
                    style={{color: 'black', fontSize: 20}}
                    onPress={() => this.editProfile('UpdatePassword')}
                    testID="iconToUpdatePassword"
                  />
                </Right>
              </ListItem>
            </List>
            {/* <EcardDetails /> */}
            {this.state.favouriteList.length === 0 ? null : (
              <Card style={{padding: 10}}>
                <List>
                  <Text style={styles.titleText}>Your Doctors</Text>

                  <FlatList
                    data={this.state.favouriteList}
                    renderItem={({item}) => (
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
                              style={{height: 60, width: 60, borderRadius: 60}}
                            />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                          <Text
                            style={{
                              fontFamily: 'Roboto',
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
                                fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
  customText: {
    fontSize: 15,
    fontFamily: 'Roboto',
  },
  customText1: {
    fontSize: 13,
    fontFamily: 'Roboto',
  },
  customText2: {
    fontSize: 15,
    fontFamily: 'Roboto',
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
    fontFamily: 'Roboto',
  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  bottomValue: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Roboto',
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
    backgroundColor: primaryColor,
    borderRadius: 20,
    color: 'white',
    width: 150,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  docbutton: {
    height: 30,
    width: 'auto',
    borderRadius: 20,
    fontSize: 10,
    backgroundColor: primaryColor,
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
    backgroundColor: primaryColor,
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
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
  },
  linkHeader: {
    fontFamily: 'Roboto',
    fontSize: 13,
    textDecorationColor: primaryColor,
    textDecorationLine: 'underline',
    color: primaryColor,
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
