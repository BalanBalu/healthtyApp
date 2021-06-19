import React, {Component} from 'react';
import {Container, Content, Toast, Text, Item, Card} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {primaryColor} from '../../../setup/config';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {getInsuranceHistory} from '../../providers/insurance/insurance.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../../components/ContentLoader';
import {dateDiff, formatDate} from '../../../setup/helpers';


const LIMIT = 5;

export default class InsuranceHistory extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
    this.isEnabledLoadMoreData = true;
    this.isEnabledLoadMoreInsuranceData = true;
    this.pagination = 1;
    this.pagination1 = 1;
    this.insuranceData = [];
    this.buyInsuranceData = [];

  }

  async componentDidMount() {
    this.getInsuranceList();
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });
    if (index == 1) {
      this.getBuyInsuranceList();
    }else{
      this.getInsuranceList();
    }
  };
  getInsuranceList = async (actionType) => {
    try {
      let memberId = await AsyncStorage.getItem('memberId');
      let result = await getInsuranceHistory(
       memberId,
       'INSURANCE',
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
        this.isEnabledLoadMoreInsuranceData = false;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({isLoading: false});
    }
  };

  
  getBuyInsuranceList = async (actionType) => {
    try {
      let memberId = await AsyncStorage.getItem('memberId');
      let result = await getInsuranceHistory(
        memberId,
        'BUY-INSURANCE',
        this.pagination1,
        LIMIT,
      );
      if (result && result.docs && result.docs.length) {
        this.pagination1 = this.pagination1 + 1;
        this.buyInsuranceData = [...this.buyInsuranceData, ...result.docs];
        this.setState({isLoading: false, buyInsuranceData: this.buyInsuranceData});

      } else {
        if (this.buyInsuranceData.length > 3) {
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

  loadMoreBuyInsuranceData = async () => {
    try {
      this.setState({isLoadingMoreData: true});
      await this.getInsuranceList();
    } catch (error) {
      console.log('Ex is getting on load more data', error.message);
    } finally {
      this.setState({isLoadingMoreData: false});
    }
  };


  render() {
    const {selectedIndex,data,buyInsuranceData,isLoading} = this.state;
    return (
      <Container>
        <Content>
          <View>
            <Card transparent>
              <SegmentedControlTab
                tabsContainerStyle={{
                  width: 250,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 'auto',
                  fontFamily: 'Roboto',
                }}
                values={['Insurance Renewal', 'Buy Insurance']}
                selectedIndex={selectedIndex}
                onTabPress={this.handleIndexChange}
                activeTabStyle={{
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  fontFamily: 'Roboto',
                }}
                tabStyle={{borderColor: primaryColor, fontFamily: 'Roboto'}}
              />
            </Card>
            {selectedIndex === 0 ? (
               isLoading ? (
                <Loader style="list" />
              ) : data&&data.length ? (
              <View>
                 <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (this.isEnabledLoadMoreInsuranceData) {
                    this.loadMoreData();
                  }
                }}
                renderItem={({item, index}) => (
                <Card style={styles.cardStyle}>
                  <Col>
                    <Row>
                      <Text
                        style={{
                          fontFamily: 'opensans-bold',
                          fontSize: 14,
                          color: 'primaryColor',
                          marginLeft: 5,
                        }}>
                        Renewal Date
                      </Text>
                      <Text style={{marginLeft: 30}}>:</Text>
                      <Text style={{marginLeft: 11}}>{formatDate(item.renewalDate, 'DD-MM-YY')}</Text>
                    </Row>
                  </Col>

                  <Col>
                    <Row>
                      <Text
                        style={{
                          fontSize: 15,
                          marginLeft: 5,
                          fontFamily: 'Roboto',
                        }}>
                        PolicyType
                      </Text>
                      <Text style={{marginLeft: 50}}>:</Text>
                      <Text style={{marginLeft: 11}}>{item.policyType}</Text>
                    </Row>
                  </Col>

                  <Col>
                    <Row>
                      <Text
                        style={{
                          fontSize: 15,
                          marginLeft: 5,
                          fontFamily: 'Roboto',
                        }}>
                        TransactionType
                      </Text>
                      <Text style={{marginLeft: 11}}>:</Text>
                      <Text style={{marginLeft: 11}}>{item.transactionType}</Text>
                    </Row>
                  </Col>
                </Card>
                 )}
                 />
              </View>): (
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
          )
            ) : selectedIndex === 1 ? (
              isLoading ? (
                <Loader style="list" />
              ) : buyInsuranceData&&buyInsuranceData.length ? (
              <FlatList
              data={buyInsuranceData}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (this.isEnabledLoadMoreData) {
                  this.loadMoreBuyInsuranceData();
                }
              }}
              renderItem={({item, index}) => (
              <Card style={styles.cardStyle}>
                <Col>
                  <Row>
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'primaryColor',
                        marginLeft: 5,
                        fontFamily: 'opensans-bold',
                      }}>
                      Request Date
                    </Text>
                    <Text style={{marginLeft: 32}}>:</Text>
                    <Text style={{marginLeft: 11}}>{formatDate(item.requestedDate, 'DD-MM-YY')}</Text>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Text
                      style={{
                        fontSize: 15,
                        marginLeft: 5,
                        fontFamily: 'Roboto',
                      }}>
                      PolicyType
                    </Text>
                    <Text style={{marginLeft: 50}}>:</Text>
                    <Text style={{marginLeft: 11}}>{item.policyType}</Text>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Text
                      style={{
                        fontSize: 15,
                        marginLeft: 5,
                        fontFamily: 'Roboto',
                      }}>
                      TransactionType
                    </Text>
                    <Text style={{marginLeft: 11}}>:</Text>
                    <Text style={{marginLeft: 11}}>{item.transactionType}</Text>
                  </Row>
                </Col>
              </Card>
              )}/>
            ): (
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
              </Item>) ): null}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    marginRight: 15,
    marginLeft: 15,
    padding: 5,
    marginTop: 10,
  },
});
