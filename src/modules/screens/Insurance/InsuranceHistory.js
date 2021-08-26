import React, { Component } from 'react';
import { Container, Content, Toast, Text, Item, Card } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { primaryColor } from '../../../setup/config';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { getInsuranceHistory } from '../../providers/insurance/insurance.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../../components/ContentLoader';
import { dateDiff, formatDate } from '../../../setup/helpers';
import { toastMeassage } from '../../common';
import { NegativePolicyCoverageDrawing } from '../Home/corporateHome/svgDrawings'
const LIMIT = 5;

export default class InsuranceHistory extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
      isLoading: true,
      isLoadingMoreData: false,
      isLoadingBuyInsurance: true
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
      // this.setState({ isLoading: true });
    } else {
      this.getInsuranceList();
      // this.setState({ isLoading: true });
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
        this.setState({ isLoading: false, data: this.insuranceData });
      } else {
        if (this.insuranceData.length > 0) {
          toastMeassage('No more data Available!', 'success', 3000);
        }
        this.isEnabledLoadMoreInsuranceData = false;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
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
        this.setState({ isLoadingBuyInsurance: false, isLoading: false, buyInsuranceData: this.buyInsuranceData });

      } else {
        if (this.buyInsuranceData.length > 0) {
          toastMeassage('No more data Available!', 'success', 3000);
        }
        this.isEnabledLoadMoreData = false;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoadingBuyInsurance: false, isLoading: false });
    }
  };
  loadMoreData = async () => {
    try {
      this.setState({ isLoadingMoreData: true });
      await this.getInsuranceList();
    } catch (error) {
      console.log('Ex is getting on load more data', error.message);
    } finally {
      this.setState({ isLoadingMoreData: false });
    }
  };

  loadMoreBuyInsuranceData = async () => {
    try {
      this.setState({ isLoadingMoreData: true });
      await this.getBuyInsuranceList();
    } catch (error) {
      console.log('Ex is getting on load more data', error.message);
    } finally {
      this.setState({ isLoadingMoreData: false });
    }
  };
  ListFooterComponent(){
    return(
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <ActivityIndicator
        style={{ marginBottom: 40 }}
            animating={this.state.isLoadingMoreData}
            size="large"
            color='blue'/>
        </View>
    )
  }


  render() {
    const { selectedIndex, data, buyInsuranceData, isLoading, isLoadingBuyInsurance } = this.state;
    return (
      <Container>
        {/* <Content> */}
            <Card transparent>
              <SegmentedControlTab
                tabsContainerStyle={{
                  width: '95%',
                  marginLeft: 10,
                  marginRight: 30,
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
                tabStyle={{ borderColor: primaryColor, fontFamily: 'Roboto' }}
              />
            </Card>
            {selectedIndex === 0 ? (
              isLoading ? (
                <Loader style="newList" />
              ) : data && data.length ? (
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
                    ListFooterComponent={() => this.ListFooterComponent()}
                    renderItem={({ item, index }) => (
                      <Card style={styles.cardStyle}>
                        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <View style={{maxWidth: '49%'}}>
                        <Text
                              style={{
                                fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                color: '#B6B3D4',
                                marginLeft: 5,
                                textTransform: 'uppercase'
                              }}>
                              POLICY TYPE
                            </Text>
                            <Text style={{ marginLeft: 5, color: '#128283',fontFamily: 'opensans-semibold', marginTop: 5 }}>{item.policyType}</Text>
                        </View>
                        <View style={{maxWidth: '49%'}}>
                        <Text
                              style={{
                                fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                color: '#B6B3D4',
                                marginLeft: 5,
                                textTransform: 'uppercase'
                              }}>
                              Transaction Type
                            </Text>
                            <Text style={{ marginLeft: 5, color: '#128283',fontFamily: 'opensans-semibold', marginTop: 5, marginVertical: 10 }}>{item.transactionType}</Text>
                        </View>

                        
                        </View>

                        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 8}}>
                        <View>
                       
                            <Text style={{ fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                fontFamily: 'opensans-semibold', marginTop: 3, 
                                color: 'rgba(0,0,0,0.5)',
                                marginLeft: 5,  }}> <Text
                              style={{
                                fontFamily: 'opensans-semibold',
                                fontSize: 13.5,
                                color: 'rgba(0,0,0,0.8)',
                                
                                marginLeft: 5,
                                // textTransform: 'uppercase'
                              }}>
                              Renewal Date,
                            </Text> {formatDate(item.renewalDate, 'MMMM Do dddd YYYY')}</Text>
                        </View>

                        

                        
                        </View>
                      </Card>
                    )}
                  />
                </View>) : (
                <View style={{ borderBottomWidth: 0, flex: 1, marginTop: 250, justifyContent: 'center', alignItems: 'center' }}>
                  <NegativePolicyCoverageDrawing />
                  <Text style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    marginTop: "10%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }} >No insurance policy list found!</Text>
                </View>
              )
            ) : selectedIndex === 1 ? (
              isLoadingBuyInsurance ? (
                <Loader style="newList" />
              ) : buyInsuranceData && buyInsuranceData.length ? (
                <FlatList
                  data={buyInsuranceData}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => {
                    if (this.isEnabledLoadMoreData) {
                      this.loadMoreBuyInsuranceData();
                    }
                  }}
                  ListFooterComponent={() => this.ListFooterComponent()}
                  renderItem={({ item, index }) => (
                    <Card style={styles.cardStyle}>
                        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <View style={{maxWidth: '49%'}}>
                        <Text
                              style={{
                                fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                color: '#B6B3D4',
                                marginLeft: 5,
                                textTransform: 'uppercase'
                              }}>
                              POLICY TYPE
                            </Text>
                            <Text style={{ marginLeft: 5, color: '#128283',fontFamily: 'opensans-semibold', marginTop: 5 }}>{item.policyType}</Text>
                        </View>
                        <View style={{maxWidth: '49%'}}>
                        <Text
                              style={{
                                fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                color: '#B6B3D4',
                                marginLeft: 5,
                                textTransform: 'uppercase'
                              }}>
                              Transaction Type
                            </Text>
                            <Text style={{ marginLeft: 5, color: '#128283',fontFamily: 'opensans-semibold', marginTop: 5, marginVertical: 10 }}>{item.transactionType}</Text>
                        </View>

                        
                        </View>

                        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 8}}>
                        <View>
                       
                            <Text style={{ fontFamily: 'opensans-bold',
                                fontSize: 13.5,
                                fontFamily: 'opensans-semibold', marginTop: 3, 
                                color: 'rgba(0,0,0,0.5)',
                                marginLeft: 5,  }}> <Text
                              style={{
                                fontFamily: 'opensans-semibold',
                                fontSize: 13.5,
                                color: 'rgba(0,0,0,0.8)',
                                
                                marginLeft: 5,
                                // textTransform: 'uppercase'
                              }}>
                              Request Date,
                            </Text> {formatDate(item.requestedDate, 'MMMM Do dddd YYYY')}</Text>
                        </View>

                        

                        
                        </View>
                      </Card>
                    
                    
                  )} />
              ) : (
                <View style={{ borderBottomWidth: 0, flex: 1, marginTop: 250, justifyContent: 'center', alignItems: 'center' }}>
                  <NegativePolicyCoverageDrawing />
                  <Text style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    marginTop: "10%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }} >No insurance policy list found!</Text>
                </View>)) : null}
            {/* <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              {this.state.isLoadingMoreData ? <ActivityIndicator
                style={{ marginBottom: 17 }}
                animating={this.state.isLoadingMoreData}
                size="large"
                color='blue'
              /> : null}
            </View> */}
        {/* </Content> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    marginRight: 15,
    borderRadius: 12,
    marginLeft: 15,
    padding: 5,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 14
  },
});
