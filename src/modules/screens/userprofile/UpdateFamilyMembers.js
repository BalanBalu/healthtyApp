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

import {
  Image,
  AsyncStorage,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import styles from './style.js';
import {formatDate, subTimeUnit} from '../../../setup/helpers';
import Spinner from '../../../components/Spinner';
import {
  relationship,
  getGender,
  toastMeassage,
  RenderDocumentUpload,
} from '../../common';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {ImageUpload} from '../../screens/commonScreen/imageUpload';
import {uploadImage} from '../../providers/common/common.action';

class UpdateFamilyMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }
  componentDidMount() {
    this.getFamilyDetails();
  }

  async getFamilyDetails() {
    const {navigation} = this.props;
    let userData = navigation.getParam('updatedata');
    const fromProfile = navigation.getParam('fromProfile') || false;
    if (fromProfile) {
      await this.setState({
        updateButton: true,
        fromProfile: true,
        family_members: userData.family_members,
      });
    }
  }
  showOnlyDateTimePicker = () => {
    this.setState({isOnlyDateTimePickerVisible: true});
  };
  hideOnlyDateTimePicker = () => {
    this.setState({isOnlyDateTimePickerVisible: false});
  };
  handleOnlyDateTimePicker = date => {
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
  addedFamilyMembers = async () => {
    const {name, age, dob, gender, relationship} = this.state;

    if (
      name == '' ||
      dob == '' ||
      gender == '' ||
      relationship == '' ||
      relationship == 'Select Relationship'
    ) {
      this.setState({errorMsg: 'Kindly fill all the fields...'});
      return false;
    } else {
      this.setState({errMsg: ''});
      let temp = [];
      temp = this.state.family_members || [];
      temp.push({
        name: name,
        dob: dob,
        gender: gender,
        relationship: String(relationship),
        idProof: this.state.uploadData,
      });

      await this.setState({family_members: temp, updateButton: false});
      await this.setState({name: '', dob: '', gender: '', relationship: ''});
    }
  };

  updateFamilyMembers = async () => {
    try {
      this.setState({errorMsg: '', isLoading: true, updateButton: false});
      let requestData = {
        family_members: this.state.family_members,
      };
      const userId = await AsyncStorage.getItem('userId');
      let response = await userFiledsUpdate(userId, requestData);

      if (response.success) {
        Toast.show({
          text: 'Your family member details are updated',
          type: 'success',
          duration: 3000,
        });

        this.props.navigation.navigate('Profile');
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
  onSelectedItemsChange = async selectedItems => {
    this.state.family_members.map(async ele => {

      if ( selectedItems == 'DAUGHTER' || selectedItems === 'SON' ) {
        this.setState({relationship: selectedItems});
      }
      else if ( ele.relationship == selectedItems[0]) {
        await this.setState({relationship:''});
        console.log(' relationship',this.state.relationship);
           Toast.show({
            text: 'Selected relationship is already exist',
            duration: 3000,
          })
        }
        else
        this.setState({relationship: selectedItems});
    });
  };

  removeSelected = async index => {
    let temp = this.state.family_members;
    temp.splice(index, 1);
    this.setState({family_members: temp, updateButton: false});
  };
  imageUpload = async data => {
    this.setState({selectOptionPopup: false});
    if (data.image !== null) {
      await this.uploadImageToServer(data.image);
    }
  };

  uploadImageToServer = async imagePath => {
    try {
      this.setState({isLoading: true});
      let appendForm, endPoint;
      appendForm = 'memberFamilyId';
      endPoint = 'images/upload?path=memberFamilyId';
      const response = await uploadImage(imagePath, endPoint, appendForm);

      if (response.success) {
        // this.uploadedData = [...this.state.uploadData, ...response.data];
        await this.setState({uploadData: response.data});
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
    const {dob, gender, selectOptionPopup} = this.state;

    return (
      <Container>
        <Content contentContainerStyle={styles.bodyContent}>
          <ScrollView>
            {this.state.isLoading ? (
              <Spinner color="blue" visible={this.state.isLoading} />
            ) : null}

            <Text style={styles.headerText}>Update Your Family Details</Text>
            <Card style={styles.cardStyle}>
              <View style={{marginLeft: -10}}>
                <Form style={{marginTop: 10}}>
                  <Item style={{borderBottomWidth: 0}}>
                    <Input
                      placeholder="Enter name"
                      style={styles.transparentLabel2}
                      returnKeyType={'next'}
                      keyboardType={'default'}
                      value={this.state.name}
                      onChangeText={name =>
                        this.setState({name, updateButton: false})
                      }
                      blurOnSubmit={false}
                      testID="editName"
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isOnlyDateTimePickerVisible: !this.state
                          .isOnlyDateTimePickerVisible,
                      });
                    }}
                    style={{
                      borderBottomWidth: 0,
                      backgroundColor: '#F1F1F1',
                      height: 45,
                      marginRight: 15,
                      marginTop: 10,
                      borderRadius: 5,
                      flexDirection: 'row',
                      marginLeft: 15,
                      alignItems: 'center',
                    }}>
                    {/* <Item > */}
                    <Icon
                      name="md-calendar"
                      style={{
                        padding: 5,
                        fontSize: 13,
                        marginTop: 1,
                        color: '#7F49C3',
                      }}
                    />
                    <Text
                      style={
                        dob != null
                          ? {
                              marginTop: 7,
                              marginBottom: 7,
                              marginLeft: 5,
                              fontFamily: 'OpenSans',
                              fontSize: 13,
                              textAlign: 'center',
                            }
                          : {color: '#909090', fontSize: 13}
                      }>
                      {dob != null
                        ? formatDate(dob, 'DD/MM/YYYY')
                        : 'Date of Birth'}
                    </Text>

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
                  </TouchableOpacity>
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
                        standardStyle={true}
                        selected={gender === 'M' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'M', updateButton: false})
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
                        standardStyle={true}
                        selected={gender === 'F' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'F', updateButton: false})
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
                        standardStyle={true}
                        selected={gender === 'O' ? true : false}
                        onPress={() =>
                          this.setState({gender: 'O', updateButton: false})
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
                  <View style={styles.transparentLabel2}>
                    <SectionedMultiSelect
                      items={relationship}
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
                      //   selectToggleIconComponent={
                      //     <Icon
                      //       name="ios-arrow-down"
                      //       style={{color: 'gray', fontSize: 20, marginLeft: 5}}
                      //     />
                      //   }
                      testID="relationSelected"
                    />
                  </View>
                  {/* <Item
                    last
                    style={{
                      borderBottomWidth: 0,
                      marginRight: 10,
                      height: 45,
                      backgroundColor: '#F1F1F1',
                      marginTop: 10,
                      borderRadius: 5,
                      marginLeft: 10,
                    }}>
                    <Picker
                      style={styles.transparentLabel2}
                      mode="dropdown"
                      placeholderStyle={{fontSize: 13, marginLeft: -5}}
                      iosIcon={
                        <Icon
                          name="ios-arrow-down"
                          style={{color: 'gray', fontSize: 20, marginLeft: 5}}
                        />
                      }
                      textStyle={{color: 'gray', left: 0, marginLeft: -5}}
                      note={false}
                      itemStyle={{
                        paddingLeft: 10,

                        fontSize: 16,
                      }}
                      itemTextStyle={{color: '#5cb85c'}}
                      style={{width: 320}}
                      onValueChange={value => {
                        this.setState({
                          relationship: value,
                          updateButton: false,
                        });
                      }}
                      selectedValue={this.state.relationship}
                      testID="editIdType">
                      <Picker.Item label="Select" value="" />
                      <Picker.Item label="Adhar ID" value="Adhar ID" />
                      <Picker.Item label="PAN ID" value="PAN ID" />
                      <Picker.Item label="Passport ID" value="Passport ID" />
                    </Picker>
                  </Item> */}
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      marginLeft: 7,
                      fontWeight: 'bold',
                      fontSize: 15,
                      marginTop: 10,
                    }}>
                    Upload Id Proof
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => this.setState({selectOptionPopup: true})}>
                      <Image
                        source={require('../../../../assets/images/documentCloud.png')}
                        style={{height: 40, width: 70}}
                      />
                    </TouchableOpacity>
                  </View>
                  {selectOptionPopup ? (
                    <ImageUpload
                      popupVisible={data => this.imageUpload(data)}
                    />
                  ) : null}
                  <View>
                    <Button
                      primary
                      disabled={this.state.updateButton}
                      style={
                        this.state.updateButton
                          ? styles.addressButtonDisable
                          : styles.addressButton
                      }
                      block
                      onPress={() => this.addedFamilyMembers()}
                      testID="addDetails">
                      <Text style={styles.buttonText}>ADD</Text>
                    </Button>
                  </View>
                  {this.state.errorMsg ? (
                    <Text style={{color: 'red', marginLeft: 15, marginTop: 5}}>
                      {this.state.errorMsg}
                    </Text>
                  ) : null}
                </Form>
              </View>
            </Card>
            {this.state.family_members &&
            this.state.family_members.length != 0 ? (
              <Card style={styles.cardStyle}>
                <View>
                  <Text style={styles.headText}>Added Details</Text>
                  <View style={{marginTop: 10}}>
                    <FlatList
                      data={this.state.family_members}
                      extraData={this.state}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) => (
                        <View>
                          <Row style={{marginTop: 10}}>
                            <Col size={8}>
                              <Row>
                                <Col size={2}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    Name
                                  </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    -
                                  </Text>
                                </Col>
                                <Col size={7}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                    }}>
                                    {item.name}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                            <Col size={0.5}>
                              <TouchableOpacity
                                onPress={() => this.removeSelected(index)}>
                                <Icon
                                  active
                                  name="ios-close"
                                  style={{color: '#d00729', fontSize: 18}}
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>

                          <Row>
                            <Col size={10}>
                              <Row>
                                <Col size={2}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    Dob
                                  </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    -
                                  </Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                    }}>
                                    {formatDate(item.dob, 'DD/MM/YYYY') +
                                      ' - ' +
                                      getGender(item)}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col size={10}>
                              <Row>
                                <Col size={2}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    Relation
                                  </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                      fontWeight: '500',
                                    }}>
                                    -
                                  </Text>
                                </Col>
                                <Col size={7.5}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 12,
                                      color: '#000',
                                    }}>
                                    {item.relationship}
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          {/* <View>
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
                          </View> */}
                        </View>
                      )}
                    />
                  </View>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Button
                    primary
                    disabled={this.state.updateButton}
                    style={
                      this.state.updateButton
                        ? styles.addressButtonDisable
                        : styles.addressButton
                    }
                    block
                    onPress={() => this.updateFamilyMembers()}
                    testID="updateBasicDetails">
                    <Text style={styles.buttonText}>UPDATE</Text>
                  </Button>
                </View>
              </Card>
            ) : null}
          </ScrollView>
        </Content>
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
