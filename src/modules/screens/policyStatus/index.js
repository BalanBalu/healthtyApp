import React, { Component } from 'react';
import { Container, Text, Item, Card, Left, Right, Content, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getMemberDetailsByEmail, getClaimsDataByPayerCode } from '../../providers/corporate/corporate.actions'; ''
import { getPolicyByPolicyNo } from '../../providers/policy/policy.action';
import { formatDate } from '../../../setup/helpers';
import {primaryColor, secondaryColor, secondaryColorTouch} from '../../../setup/config';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const LIMIT = 5;

class PolicyStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberDetails: {},
      policyDetails: {},
      claimsData: [],
      isLoadingMoreData: false,
      showCard: 0,
      show: true,
    }
    this.isEnabledLoadMoreData = true;
    this.pagination = 1;
    this.claimsDataArray = [];
  }

  componentDidMount() {
    this.getMemberDetailsByEmail()
  }
  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = await AsyncStorage.getItem('memberEmailId') || null;
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo') || null;

      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(memberPolicyNo);
        await this.setState({ memberDetails: result[0], policyDetails: policyData });
        await this.getClaimDetails()

      }
    } catch (ex) {
      console.log(ex)
    }

  }
  getClaimDetails = async () => {
    try {
      const { memberDetails, policyDetails } = this.state
      let result = await getClaimsDataByPayerCode(policyDetails.TPA, memberDetails.policyNo, this.pagination, LIMIT);

      if (result && result.docs && result.docs.length) {
        this.pagination = this.pagination + 1;
        this.claimsDataArray = [...this.claimsDataArray, ...result.docs]
        this.setState({ claimsData: this.claimsDataArray });
      }

      else {
        if (this.claimsDataArray.length > 4) {
          Toast.show({
            text: 'No more data Available!',
            duration: 5000,
            type: "success"
          })
        }
        this.isEnabledLoadMoreData = false;
      }
    } catch (ex) {
      console.log(ex)
    }

  }
  toggleData(data) {
    const { showCard, show } = this.state
    if(data===showCard){
         this.setState({ showCard: data, show: !this.state.show, })
    }
    else{
      this.setState({ showCard: data,show: false})
    }

  }
  loadMoreData = async () => {
    try {
      this.setState({ isLoadingMoreData: true });
      await this.getClaimDetails();
    } catch (error) {
      console.log("Ex is getting on load more data", error.message);
    }
    finally {
      this.setState({ isLoadingMoreData: false })
    }
  }


  render() {
    const { memberDetails, policyDetails, claimsData, isLoadingMoreData } = this.state
    const { showCard, show, } = this.state

    return (
      <Container>
        <Content contentContainerStyle={{margin:15,}}>
          <Card style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5, }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedCircularProgress
                size={140}
                width={10}
                fill={50}
                tintColor={primaryColor}
                backgroundColor='rgba(18, 130, 131, 0.3)'>
                {() => (
                  <View>
                    <Text style={styles.usedAmount}>{memberDetails.balSumInsured ? memberDetails.balSumInsured : 0}</Text>
                    <Text style={styles.totalAmount}>{" "}/{memberDetails.sumInsured ? memberDetails.sumInsured : 0}</Text>
                  </View>
                )}
              </AnimatedCircularProgress>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.nameText}>{memberDetails.firstName ? (memberDetails.firstName + ' ' + memberDetails.lastName) : '-'}</Text>
                <Text style={styles.policyText}>Member Code : <Text style={styles.commonText}>{memberDetails.memberId ? memberDetails.memberId : '-'}</Text></Text>
                <Text style={styles.policyText}>Validity period : <Text style={styles.commonText}>{policyDetails.policyEffectiveFrom?(formatDate(policyDetails.policyEffectiveFrom, "DD-MM-YY") + " - " + formatDate(policyDetails.policyEffectiveTo, "DD-MM-YY")):'N/A'}</Text></Text>
              </View>

            </View>
          </Card>


          {claimsData && claimsData.length ?
            <FlatList
              data={claimsData}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={1}

              onEndReached={() => {
                if (this.isEnabledLoadMoreData) {
                  this.loadMoreData();
                }

              }}
              renderItem={({ item, index }) =>
                <View>
                 <View>
                {this.state.showCard === index && !this.state.show ?
                  <View>
                    <Card style={styles.cardStyles}>
                      <Row style={styles.gradientStyle}>
                        <Col size={9}>
                          <Text style={{ fontSize: 16, color: '#fff' }}>{item.EMPLOYEE_NAME}</Text>

                        </Col>
                        <Col size={0.8} >
                          <TouchableOpacity onPress={() => this.toggleData(index)}>
                            <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#fff' }} />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                      <View style={styles.mainView}>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Member Code</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{memberDetails.memberId}</Text>
                          </Col>

                        </Row>
                        {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>MAID</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.MAID}</Text>
                          </Col>

                        </Row> */}
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Relationship</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.PATIENT_REALTION}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Status</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.CLAIM_STATUS}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Amount</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.AMOUNT}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Claim Date</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.CLAIM_REGISTERED_DATE}</Text>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Ailment</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.AILMENT}</Text>
                          </Col>
                        </Row>

                        <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{item.HOSPITAL_NAME}</Text>
                          </Col>
                        </Row>
                        {/* <Row style={{ marginTop: 5 }}>
                          <Col size={4}><Text style={styles.subHeadingStyle}>Hospital Address</Text></Col>
                          <Col size={0.5}><Text style={{ marginTop: 2 }}>:</Text></Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}>{(item.HOSPITAL_CITY + " " + item.HOSPITAL_STATE + " " + item.PIN_CODE)}</Text>
                          </Col>
                        </Row> */}
                      </View>
                      
                    </Card>
                  </View>
                  :
                  <View>
                       <TouchableOpacity onPress={() => this.toggleData(index)}>
                  <Card style={styles.cardStyle}>
                    <Row>
                      <Col size={9}>
                        <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: primaryColor, fontWeight: '700' }}
                          numberOfLines={1}
                          ellipsizeMode="tail">{item.EMPLOYEE_NAME}</Text>
                        <Row>
                          <Col size={3}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16, color: '#909090', marginTop: 5 }}
                              numberOfLines={1}
                              ellipsizeMode="tail">Member Code</Text>
                          </Col>
                          <Col size={0.5}>
                            <Text style={{ marginTop: 5 }}>:</Text>
                          </Col>
                          <Col size={6.5}>
                            <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{memberDetails.memberId}</Text>
                          </Col>
                        </Row>
                        {/* <Text style={styles.subHeadingData}
                              numberOfLines={1}
                              ellipsizeMode="tail">{item.address}</Text> */}


                      </Col>

                      <Col size={0.8} style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.toggleData(index)}>
                          <MaterialIcons name={showCard === index && !show ? "keyboard-arrow-up" : "keyboard-arrow-down"} style={{ fontSize: 25, color: '#000' }} />
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </Card>
                  </TouchableOpacity>
                  </View>
                  }
              </View>  
                </View>
              } />
            : <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No Claim list found!</Text>
            </Item>
          }
          {isLoadingMoreData ?
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <ActivityIndicator
                style={{ marginBottom: 17 }}
                animating={isLoadingMoreData}
                size="large"
                color='blue'
              />
            </View>
            : null}
        </Content>
      </Container>
    )
  }

}

export default PolicyStatus


const styles = StyleSheet.create({
  usedAmount: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 5

  },
  totalAmount: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    color: '#909090',
    textAlign: 'center'
  },
  nameText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: primaryColor
  },
  policyText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#909090',
    marginTop: 5,
    textAlign: 'center'
  },
  commonText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#000'
  },
  commonBoldText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: '#909090'
  },
  boldText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: primaryColor,
    marginTop: 2,
    fontWeight: 'bold'
  },
  gradientStyle: {
    justifyContent: 'center',
    backgroundColor: primaryColor,
    padding: 8
  },
  cardStyle: {
    padding: 10,
    marginTop: 10,
    // marginBottom:25
  },
  subHeadingStyle: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'OpenSans',
    color: '#909090'
  },
  subHeadingData: {
    fontSize: 15,
    color: '#000',
    marginTop: 5,
    fontFamily: 'OpenSans'
  },
  cardStyles: {
    marginTop: 15,
    borderRadius: 5
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  linkHeader: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    textDecorationColor: primaryColor,
    textDecorationLine: 'underline',
    color: primaryColor
  },
  mainView: {
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 5
  },
  subView: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15
  }

});