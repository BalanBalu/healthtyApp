import React, {Component} from 'react';
import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Icon,
  Toast,
  Radio,
  View,
  Card,
} from 'native-base';
import {userFiledsUpdate} from '../../providers/auth/auth.actions';
import {connect} from 'react-redux';
import {Row, Col} from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styles from './style.js';
import {formatDate, subTimeUnit} from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import {
  relationship,
  getGender,
  toastMeassage,
  calculateAge,
  RenderDocumentUpload,
} from '../../common';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {ImageUpload} from '../../screens/commonScreen/imageUpload';
import {uploadImage} from '../../providers/common/common.action';
import {primaryColor} from '../../../setup/config';
import IconName from 'react-native-vector-icons/MaterialIcons';
import {
  addFamilyMembersDetails,
  getMemberDetailsByEmail,
  familyMemberIdExist,
  updateFamilyMembersDetails,
} from '../../providers/corporate/corporate.actions';
import ModalPopup from '../../../components/Shared/ModalPopup';

class UpdateFamilyMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:props.navigation.getParam('data')||[],
      family_members: [],
      relationship: '',
      name: '',
      gender: '',
      fromProfile: false,
      isLoading: false,
      updateButton: true,
      errorMsg: '',
      dob: null,
      isOnlyDateTimePickerVisible: false,
      selectOptionPopup: false,
      memberDetails: {},
      isModalVisible: false,
      uploadData: [],
    };
    this.relationship = [];
  }
  async componentDidMount() {
    this.getMemberDetailsByEmail();
    this.getFamilyDetails();
  }
  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        await this.setState({memberDetails: result[0]});
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  async getFamilyDetails() {
    const {navigation} = this.props;
    let userData = navigation.getParam('updatedata');
    const fromProfile = navigation.getParam('fromProfile') || false;
    if (fromProfile) {
      await this.setState({
        updateButton: true,
        id: userData._id,
        name: userData.familyMemberName,
        dob: userData.familyMemberDob,
        gender: userData.familyMemberGender,
        relationship: [userData.relationship],
        memberId: userData.memberId,
        fromProfile: true,
        uploadData: userData.familyMemberDocument,
      });
    }
  }
  showOnlyDateTimePicker = () => {
    this.setState({isOnlyDateTimePickerVisible: true});
  };
  hideOnlyDateTimePicker = () => {
    this.setState({isOnlyDateTimePickerVisible: false});
  };
  handleOnlyDateTimePicker = (date) => {
    try {
      this.setState({
        dob: date,
        isOnlyDateTimePickerVisible: false,
        updateButton: false,
      });
    } catch (error) {
      console.error('Error on Date Picker: ', error);
    }
  };

  updateFamilyMembers = async () => {
    try {
      const {
        name,
        fromProfile,
        dob,
        gender,
        relationship,
        uploadData,
        memberDetails,
        memberId,
      } = this.state;

      if (!name) {
        this.setState({
          errorMsg: 'Please enter name',
          isModalVisible: true,
        });
        return false;
      }
      if (!dob) {
        this.setState({
          errorMsg: 'Please select date of birth',
          isModalVisible: true,
        });
        return false;
      }
      if (!gender) {
        this.setState({
          errorMsg: 'Please select gender',
          isModalVisible: true,
        });
        return false;
      }
      if (!relationship) {
        this.setState({
          errorMsg: 'Please select relationship',
          isModalVisible: true,
        });
        return false;
      }
      if (!memberId) {
        this.setState({
          errorMsg: 'Please enter member code',
          isModalVisible: true,
        });
        return false;
      }
      const getAge = calculateAge(dob);

      this.setState({errorMsg: '', isLoading: true, updateButton: false});
      let requestData = {
        familyMemberDocument: uploadData || [],
        corporateId: memberDetails.corporateId,
        clientId: memberDetails.clientId,
        employeeId: memberDetails.employeeId,
        memberId: memberId,
        policyNo: memberDetails.policyNo,
        familyMemberName: name,
        familyMemberGender: gender,
        familyMemberMonth: String(getAge.months),
        familyMemberAge: String(getAge.years),
        familyMemberDob: dob,
        relationship: String(relationship),
      };
      let response;

      if (fromProfile) {
        requestData._id = this.state.id;
        response = await updateFamilyMembersDetails(requestData);
      } else {
        response = await addFamilyMembersDetails(requestData);
      }

      if (response) {
        Toast.show({
          text: 'Your family member details are updated',
          type: 'success',
          duration: 3000,
        });
        if (fromProfile) {
          this.props.navigation.navigate('Profile');
        } else {
          await this.setState({
            name: '',
            dob: '',
            gender: '',
            relationship: '',
            memberId: '',
            uploadData: [],
          });
        }
      } else {
        Toast.show({
          text: response.message,
          type: 'danger',
          duration: 3000,
        });
        this.setState({isLoading: false});
      }
    } catch (e) {
      Toast.show({
        text: 'Exception Occured' + e,
        duration: 3000,
      });
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  onSelectedItemsChange = async (selectedItems) => {
    if(this.state.data.length!=0){
      this.state.data.map(async (ele, index) => {
        if (ele.relationship == selectedItems[0]) {
         await this.setState({
            relationship: '',
            errorMsg: 'Selected relationship is already exist',
            isModalVisible: true,
            updateButton: true,
          });
          return false;
        } else this.setState({relationship: selectedItems, updateButton: false});
      });
    }else this.setState({relationship: selectedItems, updateButton: false});
 
  };

  imageUpload = async (data) => {
    this.setState({selectOptionPopup: false});
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  memberValidation = async () => {
    let memberPolicyNo = (await AsyncStorage.getItem('memberPolicyNo')) || null;
    let response = await familyMemberIdExist(this.state.memberId, memberPolicyNo);
    if (response) {
      this.setState({
        memberId:'',
        errorMsg: 'Member code already exist',
        isModalVisible: true,
        updateButton: true,
      });
      return false;
    }
     else {
      this.setState({memberId:this.state.memberId, updateButton: false});
    }
  };
  uploadImageToServer = async (imagePath) => {
    try {
      this.setState({isLoading: true});
      let appendForm, endPoint;
      appendForm = 'memberFamilyId';
      endPoint = 'images/upload?path=memberFamilyId';
      const response = await uploadImage(imagePath, endPoint, appendForm);

      if (response.success) {
        this.uploadedData = [...this.state.uploadData, ...response.data];
        await this.setState({uploadData: this.uploadedData});
        toastMeassage('Image upload successfully', 'success', 3000);
      } else {
        toastMeassage(
          'Problem Uploading Picture' + response.error,
          'danger',
          3000,
        );
      }
    } catch (e) {
      toastMeassage('Problem Uploading Picture' + e, 'danger', 3000);
    } finally {
      this.setState({isLoading: false});
    }
  };

  render() {
    const {
      name,
      dob,
      gender,
      selectOptionPopup,
      uploadData,
      isModalVisible,
      errorMsg,
      memberId,
      fromProfile,
    } = this.state;
    return (
      <Container>
        <Content>
          <View>
            <ScrollView style={{padding: 20, marginBottom: 20}}>
              <Form>
                <Text style={styles.subHeadingText}>Name</Text>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor={'#909090'}
                  style={styles.textInputStyle}
                  placeholderStyle={{marginTop: 2}}
                  value={name}
                  onChangeText={(value) =>
                    this.setState({name: value, updateButton: false})
                  }
                  blurOnSubmit={false}
                  testID="editName"
                />

                <View style={{marginTop: 10}}>
                  <Text style={styles.subHeadingText}>Date of birth</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isOnlyDateTimePickerVisible: !this.state
                          .isOnlyDateTimePickerVisible,
                      });
                    }}>
                    <View style={styles.searchSection}>
                      <AntDesign
                        name="calendar"
                        style={{fontSize: 20, padding: 10}}
                      />
                      <DateTimePicker
                        mode={'date'}
                        minimumDate={new Date(1940, 0, 1)}
                        maximumDate={subTimeUnit(new Date())}
                        value={this.state.dob}
                        isVisible={this.state.isOnlyDateTimePickerVisible}
                        onConfirm={this.handleOnlyDateTimePicker}
                        onCancel={() =>
                          this.setState({
                            isOnlyDateTimePickerVisible: !this.state
                              .isOnlyDateTimePickerVisible,
                          })
                        }
                      />
                      <Text
                        style={styles.input}
                        underlineColorAndroid="transparent">
                        {dob === '' || dob == null
                          ? 'Date of Birth'
                          : dob != null
                          ? formatDate(dob, 'DD/MM/YYYY')
                          : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.subHeadingText}>Gender</Text>
                  <View
                    style={{
                      marginTop: 5,
                      borderBottomWidth: 0,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 15,
                      }}>
                      <Radio
                        color={primaryColor}
                        selectedColor={primaryColor}
                        standardStyle={true}
                        selected={gender === 'Male' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'Male', updateButton: false})
                        }
                      />
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 12,
                          marginLeft: 10,
                        }}>
                        Male
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        alignItems: 'center',
                      }}>
                      <Radio
                        color={primaryColor}
                        standardStyle={true}
                        selected={gender === 'Female' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'Female', updateButton: false})
                        }
                      />
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 12,
                          marginLeft: 10,
                        }}>
                        Female
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        alignItems: 'center',
                      }}>
                      <Radio
                        color={primaryColor}
                        standardStyle={true}
                        selected={gender === 'Others' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'Others', updateButton: false})
                        }
                      />
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 12,
                          marginLeft: 10,
                        }}>
                        Others
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.subHeadingText}>Relationship </Text>
                  <TouchableOpacity>
                    <Col
                      size={10}
                      style={{
                        borderRadius: 6,
                        borderColor: '#E0E1E4',
                        borderWidth: 2,
                        justifyContent: 'center',
                        height: 40,
                        paddingTop: 10,
                        fontFamily: 'Helvetica-Light',
                        marginTop: 5,
                      }}>
                      <SectionedMultiSelect
                        items={relationship}
                        IconRenderer={IconName}
                        uniqueKey="value"
                        displayKey="value"
                        selectText="Select relation"
                        selectToggleText={{fontSize: 10}}
                        searchPlaceholderText="Select relation"
                        modalWithTouchable={true}
                        showDropDowns={true}
                        hideSearch={false}
                        showRemoveAll={true}
                        showChips={false}
                        single={true}
                        readOnlyHeadings={false}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.relationship}
                        colors={{primary: '#18c971'}}
                        showCancelButton={true}
                        animateDropDowns={true}
                        testID="relationSelected"
                      />
                    </Col>
                  </TouchableOpacity>
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={styles.subHeadingText}>Member Code</Text>
                  <TextInput
                    placeholder="Enter member code"
                    placeholderTextColor={'#909090'}
                    style={styles.textInputStyle}
                    placeholderStyle={{marginTop: 2}}
                    value={memberId}
                    onChangeText={(code) => this.setState({memberId:code})}
                    blurOnSubmit={false}
                    editable={memberId && fromProfile ? false : true}
                    testID="editMemberCode"
                    onSubmitEditing={() => {
                      this.memberValidation()
                    }}
                  />
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={styles.subHeadingText}>Upload Document</Text>
                  <TouchableOpacity
                    onPress={() => this.setState({selectOptionPopup: true})}>
                    <Image
                      source={require('../../../../assets/images/documentuploadgreen.png')}
                      style={{width: 100, height: 55, marginTop: 10}}
                    />
                  </TouchableOpacity>
                </View>

                {selectOptionPopup ? (
                  <ImageUpload
                    popupVisible={(data) => this.imageUpload(data)}
                  />
                ) : null}
                <FlatList
                  data={uploadData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View>
                      <Card style={styles.cardStyles}>
                        <Row>
                          <Col style={{width: '10%'}}>
                            <Image
                              source={RenderDocumentUpload(item)}
                              style={{width: 25, height: 25}}
                            />
                          </Col>
                          <Col style={{width: '70%'}}>
                            <Text style={styles.innerCardText}>
                              {item.original_file_name}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </View>
                  )}
                />
              </Form>
            </ScrollView>
          </View>
          <View style={{flex: 1}}>
            <ModalPopup
              errorMessageText={errorMsg}
              closeButtonText={'CLOSE'}
              closeButtonAction={() =>
                this.setState({isModalVisible: !isModalVisible})
              }
              visible={isModalVisible}
            />
          </View>
        </Content>
        <TouchableOpacity
          disabled={this.state.updateButton}
          style={{
            alignSelf: 'stretch',
            backgroundColor: primaryColor,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.updateFamilyMembers()}
          testID="updateBasicDetails">
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'OpenSans',
              fontWeight: 'bold',
              color: '#fff',
            }}>
            {fromProfile ? 'UPDATE' : 'Save'}
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

function userFamilyDetailsState(state) {
  return {
    user: state.user,
  };
}
export default connect(userFamilyDetailsState)(UpdateFamilyMembers);
