import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { primaryColor, secondaryColor } from '../../../../setup/config';
import { CircleProgessImage } from './svgDrawings';
import styles from './styles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { formatDate } from '../../../../setup/helpers';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { getMemberDetailsByEmail } from '../../../providers/corporate/corporate.actions';
import { getPolicyByPolicyNo } from '../../../providers/policy/policy.action';
import {arrangeFullName} from '../../../common';
class PolicyCoverageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetails: {},
      policyDetails: {},

    }

  }
  componentDidMount() {
    this.getMemberDetailsByEmail();
    setInterval(this.getMemberDetailsByEmail, 5000);
  }
  getMemberDetailsByEmail = async () => {
    try {
      this.setState({ isLoading: true })
      let memberEmailId = await AsyncStorage.getItem('memberEmailId') || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(result&&result[0].policyNo);
        await this.setState({
          memberDetails:result&& result[0],
          policyDetails: policyData,
        });
        // await this.termsAndConditionListDetails();
      }
    } catch (ex) {
      console.log(ex);
    }
    finally {
      this.setState({ isLoading: false })
    }

  }
  percentageCalculation = (total, balance) => {
    if (total != 0) {
      let percentage = (balance / total) * 100;
      return percentage;
    } else {
      return 0;
    }
  };
  tpaName = (data) => {
    let tpaName = '';
    if (data) {
      tpaName = data.tpaName;
    }
    return tpaName;
  };
  render() {
    const { memberDetails, policyDetails } = this.state
    let tpaName = this.props.profile.memberTpaInfo;
    return (
      <TouchableHighlight activeOpacity={0.6} underlayColor="#fff">
        <View
          style={{
            marginTop: 6,
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: primaryColor,
              minHeight: 135,
              borderRadius: 22,
              marginTop: 0,
              marginBottom: 20,
              marginHorizontal: 10,
              position: 'relative',
              flex: 1,
            }}>
            {Object.keys(memberDetails).length === 0 ? (
              <ActivityIndicator
                style={{ marginBottom: 0, marginRight: 100, marginTop: 50 }}
                animating={true}
                size="large"
                color="white"
              />
            ) : (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginLeft: 20,
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'opensans-bold',
                    fontSize: 18,
                  }}>
                    {arrangeFullName(memberDetails&&memberDetails.firstName,memberDetails&&memberDetails.middleName,memberDetails&&memberDetails.lastName)}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'opensans-bold',
                      fontSize: 12,
                      lineHeight: 20,
                    }}>
                    {memberDetails.memberId ? memberDetails.memberId : ''}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Roboto',
                      fontSize: 12,
                      lineHeight: 20,
                    }}>
                    Valid Upto
                </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'opensans-bold',
                      fontSize: 12,
                      lineHeight: 20,
                      marginLeft: 5,
                    }}>
                    {formatDate(policyDetails.policyEffectiveTo, 'DD/MM/YY')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: 'rgba(255,255,255, 0.9)',
                      fontFamily: 'Roboto',
                      fontSize: 12,
                      lineHeight: 24,
                      width: '40%',
                      // fontStyle: 'italic',
                    }}>
                    {/* {TPAdata.tpaName ? TPAdata.tpaName : '-'} */}
                    {this.tpaName(tpaName)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: 'rgba(255,255,255, 0.9)',
                      fontFamily: 'Roboto',
                      fontSize: 12,
                      lineHeight: 20,
                      width: '40%',
                      // fontStyle: 'italic',
                    }}>
                    {memberDetails.corporateName ? memberDetails.corporateName : ''}
                  </Text>
                </View>
              </View>
            )}

            <View style={{ position: 'absolute', top: 0, right: -11.5 }}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="192.099"
                height="135.165"
                viewBox="0 0 194.099 155.165">
                <Path
                  id="Path_5183"
                  data-name="Path 5183"
                  d="M731.328,89.558V193.773c0,14.069-8.41,25.475-18.785,25.475H537.229c1.332-15.262,8.316-59.808,44.717-75.579,44.213-19.141,38.56-79.586,38.56-79.586h92.037C722.917,64.083,731.328,75.489,731.328,89.558Z"
                  transform="translate(-537.229 -64.083)"
                  fill="#b1d9d9"
                />
              </Svg>
            </View>
            <View style={{ position: 'absolute', right: 15, top: 15 }}>
              <AnimatedCircularProgress
                size={80}
                width={7}
                // fill={10}
                fill={this.percentageCalculation(memberDetails.sumInsured ? memberDetails.sumInsured : 0, memberDetails.balSumInsured ? memberDetails.balSumInsured : 0)}
                tintColor={primaryColor}
                backgroundColor="rgba(18, 130, 131, 0.3)">
                {() => (
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        fontFamily: 'Roboto',
                        fontSize: 11,
                        lineHeight: 24,
                        textAlign: 'center',
                        marginTop: 15,
                      }}>
                      {memberDetails.sumInsured ? memberDetails.sumInsured : 0}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        fontFamily: 'Roboto',
                        fontSize: 10,
                        lineHeight: 24,
                        textAlign: 'center',
                        marginTop: -5,
                      }}>
                      SI
                  </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
              <Row style={{ position: 'absolute', right: 60, top: 65 }}>
                <Col>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Roboto',
                      fontSize: 11,
                      lineHeight: 24,
                      marginLeft: 5,

                      textAlign: 'center',
                      marginTop: 8,
                    }}>
                    {memberDetails.balSumInsured ? memberDetails.balSumInsured : 0}
                  </Text>
                  <Text
                    style={{
                      color: '#128283',
                      fontFamily: 'opensans-bold',
                      fontSize: 10,
                      lineHeight: 24,
                      textAlign: 'center',
                      marginTop: -5,
                    }}>
                    Balance SI
                </Text>
                </Col>
              </Row>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
function PolicyCoverageCardstate(state) {
  return {
    profile: state.profile,
  };
}
export default connect(PolicyCoverageCardstate)(PolicyCoverageCard);
