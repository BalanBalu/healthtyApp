import React, {Component} from 'react';
import {Row, Col} from 'react-native-easy-grid';
import {
  Container,
  View,
  Text,
  Icon,
  Card,
  Content,
  Item,
  Left,
  Right,
} from 'native-base';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {toastMeassage, getFullName} from '../../common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {
  getInsuranceByMemberId,
  arrangeCallbackAction,
} from '../../providers/insurance/insurance.action';
import {dateDiff, formatDate} from '../../../setup/helpers';
import moment from 'moment';
import {NavigationEvents} from 'react-navigation';
import InsuranceRenewalPopup from '../../shared/insuranceRenewalPopup';

const LIMIT = 5;

class Insurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      descriptionVisible: false,
      isLoadingMoreData: false,
      selectedInsurance: '',
    };
    this.isEnabledLoadMoreData = true;
    this.pagination = 1;
    this.insuranceData = [];
  }

  componentDidMount() {
    this.getInsuranceList();
  }

  getInsuranceList = async () => {
    try {
      let memberId = await AsyncStorage.getItem('memberId');
      let result = await getInsuranceByMemberId(
        memberId,
        this.pagination,
        LIMIT,
      );
      if (result && result.docs && result.docs.length) {
        this.pagination = this.pagination + 1;
        this.insuranceData = [...this.insuranceData, ...result.docs];

        this.setState({isLoading: false, data: this.insuranceData});
      } else {
        if (this.insuranceData.length > 3) {
          toastMeassage('No more data Available!', 'success', 3000);
        }
        this.isEnabledLoadMoreData = false;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  popUpClose() {
    this.setState({descriptionVisible: false});
  }

  arrangeCallback = async () => {
    const basicProfileData = await AsyncStorage.getItem('basicProfileData');
    const basicData = JSON.parse(basicProfileData);
    let fullName = getFullName(basicData);
    console.log("this.state.selectedInsurance",this.state.selectedInsurance)
    let result = await arrangeCallbackAction(
      fullName,
      this.state.selectedInsurance,
    );
    Alert.alert(
      'Thanks',
      'Mail sent successfully, Team will contact you soon',
      [
        {
          text: 'OK',
        },
      ],
    );
  };

  loadMoreData = async () => {
    try {
      this.setState({isLoadingMoreData: true});
      await this.getInsuranceList();
    } catch (error) {
      console.log('Ex is getting on load more data', error.message);
    } finally {
      this.setState({isLoadingMoreData: false});
    }
  };
  policyPeriod(startDate, endDaet) {
    let policyPrriod;
    let firstDate = moment(startDate, 'YYYY-MM-DD'); //Create date using string-format constructor
    let secondDate = moment(endDaet, 'YYYY-MM-DD');
    policyPrriod = secondDate.diff(firstDate, 'years');
    if (policyPrriod == 0) {
      policyPrriod = secondDate.diff(firstDate, 'months');
      if (policyPrriod <= 1) return policyPrriod + ` Month`;
      else return policyPrriod + ` Months`;
    } else {
      if (policyPrriod == 0) return 'N/A';
      if (policyPrriod > 1) return policyPrriod + ` Years`;
      else return policyPrriod + ` Year`;
    }
  }

  onWillFocusUpdate = async (navigationData) => {
    if (
      navigationData.lastState &&
      navigationData.lastState.params &&
      navigationData.lastState.params.isNewInsurance
    ) {
      this.isEnabledLoadMoreData = true;
      this.pagination = 1;
      this.insuranceData = [];
      await this.getInsuranceList();
    }
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#7E49C3"
            style={{marginTop: 100}}
          />
        </View>
      );
    }
    const {data, isLoadingMoreData, isLoading} = this.state;
    return (
      <Container>
        <NavigationEvents
          onWillFocus={(payload) => {
            this.onWillFocusUpdate(payload);
          }}
        />
        {/* <Content style={{padding: 10}}> */}
        <View style={styles.mainView}>
          <View style={{flexDirection: 'row'}}>
         <View style={{width:'50%'}}>
            <TouchableOpacity
              style={[styles.addInsuranceButton,{width:'80%',marginLeft:25,}]}
              onPress={() => this.props.navigation.navigate('AddInsurance')}>
              <Icon
                name="add-circle-outline"
                style={{fontSize: 20, color: '#128283'}}
              />
              <Text style={styles.addInsuranceText}>Add Insurance</Text>
            </TouchableOpacity>
            </View>
            <View style={{width:'50%',justifyContent:'flex-end',alignItems:'flex-end'}}>
            <TouchableOpacity
              style={[styles.addInsuranceButton,{width:'80%',marginRight:30}]}
              onPress={() => this.props.navigation.navigate('BuyInsurance')}>
              <Icon
                name="add-circle-outline"
                style={{fontSize: 20, color: '#128283'}}
              />
              <Text style={styles.addInsuranceText}>Buy Insurance</Text>
            </TouchableOpacity>
            </View >
          </View>
          {isLoading ? (
            <Loader style="list" />
          ) : data.length ? (
            <View style={{padding: 10, marginBottom: 35}}>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (this.isEnabledLoadMoreData) {
                    this.loadMoreData();
                  }
                }}
                renderItem={({item, index}) => (
                  <Card style={styles.CardStyle}>
                    <View style={styles.mainVieww}>
                      <View style={styles.commonStyleView}>
                        <View style={styles.HeadingTextView}>
                          <Text style={styles.HeadingText}>
                            {item.insuranceName}
                          </Text>
                        </View>
                        <View style={styles.rightTextView}>
                          <Text style={styles.rightText}>{item.Amount}</Text>
                        </View>
                      </View>
                      <View style={[styles.commonStyleView, {marginTop: 8}]}>
                        <View style={styles.leftView}>
                          <Text style={styles.leftText}>Product Name</Text>
                        </View>
                        <View style={styles.dividingView}>
                          <Text style={styles.smallrightText}>
                            {item.productName}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.commonStyleView, {marginTop: 8}]}>
                        <View style={styles.leftView}>
                          <Text style={styles.leftText}>Policy period</Text>
                        </View>
                        <View style={styles.dividingView}>
                          <Text style={styles.smallrightText}>
                            {this.policyPeriod(
                              item.policyStartDate,
                              item.policyEndDate,
                            )}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.commonStyleView, {marginTop: 8}]}>
                        <View style={styles.leftView}>
                          <Text style={styles.leftText}>Policy start date</Text>
                        </View>
                        <View style={styles.dividingView}>
                          <Text style={styles.smallrightText}>
                            {formatDate(item.policyStartDate, 'DD/MM/YYYY')}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.commonStyleView, {marginTop: 8}]}>
                        <View style={styles.leftView}>
                          <Text style={styles.leftText}>Policy end date</Text>
                        </View>
                        <View style={styles.dividingView}>
                          <Text style={styles.smallrightText}>
                            {formatDate(item.policyEndDate, 'DD/MM/YYYY')}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Row
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Left>
                        <TouchableOpacity
                          style={styles.ecardButton}
                          onPress={() =>
                            this.props.navigation.navigate('DocumentList', {
                              uploadData: item.policyCopy,
                              data: item,
                              viewDocs: true,
                            })
                          }>
                          <Text style={styles.linkHeader}>View Document</Text>
                        </TouchableOpacity>
                      </Left>
                      <View
                        style={{
                          justifyContent: 'flex-start',
                          alignItems: 'flex-end',
                          marginTop: 8,
                        }}>
                        <TouchableOpacity
                          style={styles.renewalButton}
                          onPress={() =>
                            this.setState({
                              descriptionVisible: true,
                              selectedInsurance: item.insuranceName,
                            })
                          }>
                          <Text style={styles.renewalButtonText}>
                            Insurance Renewal
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Row>
                  </Card>
                )}
              />
            </View>
          ) : (
            <Item
              style={{
                borderBottomWidth: 0,
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {' '}
                No insurance policy list found!
              </Text>
            </Item>
          )}
        </View>
        <InsuranceRenewalPopup
                messageText={'You can Renew your Insurance Policy by!'}
                callbackButtonText={'Arrange Callback'}
                renewOnlineButtonText={'Renew Online'}
                callbackButtonAction={() => {
                    this.arrangeCallback();
                    this.popUpClose();
                }}
                renewOnlineButtonAction={() =>{
                    Linking.openURL('http://www.readypolicy.com/');
                    this.popUpClose();
                }}
                popUpClose={() =>{
                    this.popUpClose();
                }}
                visible={this.state.descriptionVisible}
              />
        {isLoadingMoreData ? (
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <ActivityIndicator
              style={{marginBottom: 17}}
              animating={isLoadingMoreData}
              size="large"
              color="blue"
            />
          </View>
        ) : null}
        {/* </Content> */}
      </Container>
    );
  }
}

function homeState(state) {
  return {
    profile: state.profile,
  };
}
export default connect(homeState)(Insurance);

// ***
