import React, {PureComponent} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Content, Text, Left, Item, View, Card} from 'native-base';
import {Col, Row} from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getClaimIntimationWithPagination} from '../../providers/corporate/corporate.actions';
import {log} from 'react-native-reanimated';
import {primaryColor} from '../../../setup/config';
import { Loader } from '../../../components/ContentLoader';
import {translate} from '../../../setup/translator.helper'

const LIMIT = 10;

class ClaimIntimationList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCard: -1,
      show: true,
      claimList: [],
      isLoading:false
    };
    this.pagination = 1;
  }
  componentDidMount() {
    this.getClaimIntimationDetails();
  }
  getClaimIntimationDetails = async () => {
    try {
      this.setState({isLoading:true});
      let searchText = null;
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let employeeId = await AsyncStorage.getItem('employeeCode');
      let result = await getClaimIntimationWithPagination(
        searchText,
        employeeId,
        memberPolicyNo,
        this.pagination,
        LIMIT,
      );
      if (result) {
        await this.setState({claimList: result.docs});
      }
    } catch (ex) {
      console.log(ex);
    }
    finally {
      this.setState({ isLoading: false });
  }
  };

  toggleData(index, typeOfArrowIcon) {
    const {showCard, show} = this.state;
    if (typeOfArrowIcon === 'DOWN') {
      this.setState({showCard: index, show: !this.state.show});
    } else {
      this.setState({showCard: -1, show: null});
    }
  }
  render() {
    const {showCard, show, claimList, isLoading} = this.state;

    return (
      <Container>
        <Content>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Card style={{borderRadius: 20}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  borderRadius: 20,
                  borderColor: primaryColor,
                  borderWidth: 1,
                  paddingVertical: 3,
                }}
                onPress={() => {
                  this.props.navigation.navigate('FamilyInfoList', {
                    navigationPage: 'ClaimIntimationSubmission',
                  });
                }}>
                <MaterialIcons
                  name="add"
                  style={{fontSize: 20, color: primaryColor}}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'OpenSans',
                    color: primaryColor,
                    fontWeight: '600',
                  }}>
                  {translate("Add New")}
                </Text>
              </TouchableOpacity>
            </Card>
          </View>
          {isLoading ? (
            <Loader style="list" />
          ) : claimList.length ? (
            <FlatList
              data={claimList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View>
                  {this.state.showCard === index && !this.state.show ? (
                    <View>
                      <Card style={styles.cardStyles}>
                        <Row style={styles.gradientStyle}>
                          <Col size={9}>
                            <Text style={{fontSize: 18, color: '#fff'}}>
                              {item.employeeName}
                            </Text>
                          </Col>
                          <Col size={0.8}>
                            <TouchableOpacity
                              onPress={() => this.toggleData(index, 'UP')}>
                              <MaterialIcons
                                name={
                                  showCard === index && !show
                                    ? 'keyboard-arrow-up'
                                    : 'keyboard-arrow-down'
                                }
                                style={{fontSize: 25, color: '#fff'}}
                              />
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <View style={styles.mainView}>
                          <Row style={{marginTop: 5}}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                               {translate("Member Code")} 
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{marginTop: 2}}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.memberId}
                              </Text>
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>MAID</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.MAID}</Text>
                          </Col>

                        </Row> */}
                          <Row style={{marginTop: 5}}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                             { translate("Claim By") } 
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{marginTop: 2}}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.claimBy ? item.claimBy : `-`}
                              </Text>
                            </Col>
                          </Row>
                          <Row style={{marginTop: 5}}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>{translate("Status")}</Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{marginTop: 2}}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.status}
                              </Text>
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Amount</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.ClaimAmount}</Text>
                          </Col>
                        </Row> */}
                          <Row style={{marginTop: 5}}>
                            <Col size={4}>
                              <Text style={styles.subHeadingStyle}>
                              {translate("Hospital")}
                              </Text>
                            </Col>
                            <Col size={0.5}>
                              <Text style={{marginTop: 2}}>:</Text>
                            </Col>
                            <Col size={6.5}>
                              <Text style={styles.subHeadingData}>
                                {item.hospitalName}
                              </Text>
                            </Col>
                          </Row>
                          {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital Address</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.address}</Text>
                          </Col>
                        </Row> */}
                        </View>
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
                                      uploadData: item.claimIntimationDocuments,
                                      data: item,
                                    },
                                  )
                                }>
                                <Text style={styles.linkHeader}>
                                  {translate("View Document")}
                                </Text>
                              </TouchableOpacity>
                            </Left>
                            {/* <Right>
                            <TouchableOpacity style={styles.ecardButton} onPress={() => this.props.navigation.navigate("DocumentList", { docsUpload: true,data: item })}>
                              <Text style={styles.linkHeader}>Upload Document</Text>
                            </TouchableOpacity>
                          </Right> */}
                          </Row>
                        </View>
                      </Card>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.toggleData(index, 'DOWN')}>
                        <Card style={styles.cardStyle}>
                          <Row>
                            <Col size={9}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: 'OpenSans',
                                  color: primaryColor,
                                  fontWeight: '700',
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {item.employeeName}
                              </Text>
                              <Row>
                                <Col size={3}>
                                  <Text
                                    style={{
                                      fontFamily: 'OpenSans',
                                      fontSize: 16,
                                      color: '#909090',
                                      marginTop: 5,
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                   {translate(" Member Code")} 
                                  </Text>
                                </Col>
                                <Col size={0.5}>
                                  <Text style={{marginTop: 5}}>:</Text>
                                </Col>
                                <Col size={6.5}>
                                  <Text
                                    style={styles.subHeadingData}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item.memberId}
                                  </Text>
                                </Col>
                              </Row>
                              {/* <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{item.address}</Text> */}
                            </Col>

                            <Col size={0.8} style={{justifyContent: 'center'}}>
                              <TouchableOpacity
                                onPress={() => this.toggleData(index, 'DOWN')}>
                                <MaterialIcons
                                  name={
                                    showCard === index && !show
                                      ? 'keyboard-arrow-up'
                                      : 'keyboard-arrow-down'
                                  }
                                  style={{fontSize: 25, color: '#000'}}
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                        </Card>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
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
                No claim intimation list found!
              </Text>
            </Item>
          )}
        </Content>
      </Container>
    );
  }
}

export default ClaimIntimationList;

const styles = StyleSheet.create({
  gradientStyle: {
    justifyContent: 'center',
    backgroundColor: primaryColor,
    padding: 8,
  },
  cardStyle: {
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
    marginTop: 10,
  },
  subHeadingStyle: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'OpenSans',
    color: '#909090',
  },
  subHeadingData: {
    fontSize: 15,
    color: '#000',
    marginTop: 5,
    fontFamily: 'OpenSans',
  },
  cardStyles: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkHeader: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    textDecorationColor: primaryColor,
    textDecorationLine: 'underline',
    color: primaryColor,
  },
  mainView: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: '#909090',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
  },
  subView: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
});
