import React, { Component } from 'react';
import { Container, Text, Item, Card, Left, Right, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, ActivityIndicator } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getMemberDetailsByEmail, getClaimsDataByPayerCode } from '../../providers/corporate/corporate.actions'; ''
import { getPolicyByPolicyNo } from '../../providers/policy/policy.action';
import { formatDate } from '../../../setup/helpers';
const LIMIT = 50;

class PolicyStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberDetails: {},
      policyDetails: {},
      claimsData: [],
      isLoadingMoreData: false
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
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(result[0].policyNo);
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
        this.pagination = this.pagination + LIMIT;
        this.claimsDataArray = [...this.claimsDataArray, ...result.docs]
        this.setState({ claimsData: this.claimsDataArray });
      }
    } catch (ex) {
      console.log(ex)
    }

  }
  // loadMoreData = async () => {
  //   try {
  //     this.setState({ isLoadingMoreData: true });
  //     await this.getClaimDetails();
  //   } catch (error) {
  //     console.log("Ex is getting on load more hospitals", error.message);
  //   }
  //   finally {
  //     this.setState({ isLoadingMoreData: false })
  //   }
  // }


  render() {
    const { memberDetails, policyDetails, claimsData, isLoadingMoreData } = this.state
    return (
      <Container>
        <Content>
          <Card style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedCircularProgress
                size={140}
                width={10}
                fill={50}
                tintColor="#7F49C3"
                backgroundColor="#AAB3DC">
                {() => (
                  <View>
                    <Text style={styles.usedAmount}>{memberDetails.balSumInsured ? memberDetails.balSumInsured : 0}</Text>
                    <Text style={styles.totalAmount}>{" "}/{memberDetails.sumInsured ? memberDetails.sumInsured : 0}</Text>
                  </View>
                )}
              </AnimatedCircularProgress>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.nameText}>{memberDetails.firstName ? (memberDetails.firstName + ' ' + memberDetails.lastName) : '-'}</Text>
                <Text style={styles.policyText}>Policy No : <Text style={styles.commonText}>{memberDetails.policyNo ? memberDetails.policyNo : '-'}</Text></Text>
                <Text style={styles.policyText}>Validity period : <Text style={styles.commonText}>{formatDate(policyDetails.policyEffectiveFrom, "DD-MM-YYYY") + "to " + formatDate(policyDetails.policyEffectiveTo, "DD-MM-YYYY")}</Text></Text>
              </View>

            </View>
          </Card>


          {claimsData && claimsData.length ?
            <FlatList
              data={claimsData}
              keyExtractor={(item, index) => index.toString()}
              // onEndReachedThreshold={1}

              // onEndReached={() => {
              //   this.loadMoreData();

              // }}
              renderItem={({ item, index }) =>
                <View>
                  <Card style={{ padding: 10, borderRadius: 5 }}>
                    <Row>

                      <Col size={8}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, lineHeight: 25, fontWeight: '700', color: '#7F49C3' }}>{item.INSURANCE_COMPANY_NAME}</Text>

                      </Col>
                      <Col size={2} >
                        <TouchableOpacity disabled style={item.CLAIM_STATUS === 'PAID' ? { backgroundColor: 'green', borderRadius: 5, padding: 2, marginTop: 2 } : { backgroundColor: '#FECE83', borderRadius: 5, padding: 2, marginTop: 2 }}>
                          <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: '600', textAlign: 'center', fontSize: 14 }}>{item.CLAIM_STATUS}</Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                    <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                      <Col size={9}>
                        <Row style={{ marginTop: 5, }}>
                          <Col size={4}>
                            <Text style={styles.commonBoldText}>Hospital</Text>
                          </Col>
                          <Col size={0.5}>
                            <Text>:</Text>
                          </Col>
                          <Col size={5.5}>
                            <Text style={styles.commonText}>{item.HOSPITAL_NAME}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5, }}>
                          <Col size={4}>
                            <Text style={styles.commonBoldText}>Address</Text>
                          </Col>
                          <Col size={0.5}>
                          </Col>

                          <Col size={5.5}>
                            <Text style={styles.commonText}>{(item.HOSPITAL_CITY + " " + item.HOSPITAL_STATE + " " + item.PIN_CODE)}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5, }}>
                          <Col size={4}>
                            <Text style={styles.commonBoldText}>Claimed By</Text>
                          </Col>
                          <Col size={0.5}>
                            <Text>:</Text>
                          </Col>
                          <Col size={5.5}>
                            <Text style={styles.commonText}>{item.PATIENT_REALTION}</Text>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 5, }}>
                          <Col size={4}>
                            <Text style={styles.commonBoldText}>Claimed Date</Text>
                          </Col>
                          <Col size={0.5}>
                            <Text>:</Text>
                          </Col>
                          <Col size={5.5}>
                            <Text style={styles.commonText}>{item.CLAIM_REGISTERED_DATE}</Text>
                          </Col>
                        </Row>
                      </Col>
                      <Col size={1}>

                      </Col>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                      <Left>
                        <Text style={styles.commonBoldText}>Date</Text>
                        <Text style={styles.boldText}>{item.DATE_OF_SETTLEMENT}</Text>

                      </Left>
                      <Right>
                        <Text style={styles.commonBoldText}>Amount</Text>
                        <Text style={styles.boldText}>{item.AMOUNT}</Text>
                      </Right>
                    </Row>
                  </Card>
                </View>
              } />
            : <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No Claim list found!</Text>
            </Item>
          }
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
    color: '#7F49C3'
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
    color: '#7F49C3',
    marginTop: 2,
    fontWeight: 'bold'
  }

});