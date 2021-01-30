import React from 'react';
import { Animated, Dimensions, Button, FlatList, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Container, Header, Content, List, ListItem, Body, Text, Left, Right, Icon, Input, View, Item, Card, CardItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, } from 'react-native-gesture-handler';
import ProgressBar from 'react-native-horizontal-progress-bar'
import { getMemberDetailsByEmail } from '../../../providers/corporate/corporate.actions';
import { getPolicyByPolicyNo } from '../../../providers/policy/policy.action';
import { formatDate } from '../../../../setup/helpers';

class PolicyCoverage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetails: {},
      policyDetails: {}
    }
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
        console.log(`policyDetails`, JSON.stringify(this.state.policyDetails));

      }
    } catch (ex) {
      console.log(ex)
    }

  }

  render() {
    const { memberDetails, policyDetails } = this.state
    return (
      <Container>
        <Content style={{ backgroundColor: '#F3F3F4' }}>
          <View style={{ marginTop: 20, marginRight: 10, marginLeft: 10 }}>
            <Text style={styles.myInsuranceText}>My Insurance</Text>
            <Card style={styles.cardStyle}>
              <Row style={{ borderBottomColor: 'gray', borderBottomWidth: 1, paddingBottom: 10 }}>
                <Col size={2}>
                  <Image source={require('../../../../../assets/images/male_user.png')} style={{ height: 45, width: 45 }} />
                </Col>
                <Col size={6}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 10 }}>{memberDetails.firstName ? (memberDetails.firstName + ' ' + memberDetails.lastName) : '-'}</Text>
                </Col>
                <Col size={2}>
                  <TouchableOpacity style={styles.ecardButton} onPress={() => this.props.navigation.navigate('E Card')}>
                    <Text style={styles.linkHeader}>View Ecard</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
              <View style={{ marginBottom: 10 }}>
                <Row style={{ paddingBottom: 10, marginTop: 10 }}>
                  <Col size={5}>
                    <Text style={styles.subHeadingStyle}>Policy Number</Text>
                    <Text style={styles.subHeadingData}>{memberDetails.policyNo ? memberDetails.policyNo : '-'}</Text>
                  </Col>
                  <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <Text style={styles.subHeadingStyle}>Valid Upto</Text>
                    <Text style={styles.subHeadingData}>{formatDate(policyDetails.policyEffectiveFrom, "DD-MM-YYYY") + "to " + formatDate(policyDetails.policyEffectiveTo, "DD-MM-YYYY")}</Text>
                  </Col>
                </Row>
                <Row style={{ paddingBottom: 10, marginTop: 10 }}>
                  <Col size={5}>
                    <Text style={styles.subHeadingStyle}>Insurance company</Text>
                    <Text style={styles.subHeadingData}>{memberDetails.insuranceCompany ? memberDetails.insuranceCompany : '-'}</Text>
                  </Col>
                </Row>
                <Text style={[styles.subText, { marginTop: 5 }]}>Balance Sum Insured</Text>
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>{memberDetails.balSumInsured ? memberDetails.balSumInsured : 0}<Text style={{ fontFamily: 'OpenSans', fontSize: 13, color: '#909090' }}>{" "}/{memberDetails.sumInsured ? memberDetails.sumInsured : 0}</Text></Text>
                </View>
                <ProgressBar progress={0.5} color={'#4CAF50'} style={styles.progressbarStyle} animated={true} />

                {/* <Text style={[styles.subText, { marginTop: 15 },]}>Family Sum Insured</Text>
                <View style={{ marginTop: 2 }}>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 18, }}>15000.00<Text style={{ fontFamily: 'OpenSans', fontSize: 13, color: '#909090' }}>{" "}/ 50000.00</Text></Text>
                </View>
                <ProgressBar progress={0.2} color={'#2196F3'} style={styles.progressbarStyle} animated={true} /> */}


              </View>

            </Card>
            <Card style={styles.cardStyle}>
              <Row>
                <Col size={9} style={{ justifyContent: 'center' }}>
                  <Text style={styles.policyConitionText}>Policy Conditions</Text>
                  <Text style={styles.policyConditionSubText}>View all the policy and conditions  given to you </Text>
                </Col>
                <Col size={1} style={{ justifyContent: 'center' }}>
                  <MaterialIcons name="keyboard-arrow-right" style={{ fontSize: 30 }} />
                </Col>
              </Row>
            </Card>

          </View>

        </Content>
      </Container>
    )
  }
}

export default PolicyCoverage

const styles = StyleSheet.create({
  linkHeader: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    textDecorationColor: '#7F49C3',
    textDecorationLine: 'underline',
    color: '#7F49C3'
  },
  subHeadingStyle: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: '#909090'
  },
  progressbarStyle: {
    height: 20,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5
  },
  myInsuranceText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  cardStyle: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 10,
    borderRadius: 5
  },
  ecardButton: {
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  subText: {
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  policyConitionText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
  },
  policyConditionSubText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: '#909090'
  }
})

