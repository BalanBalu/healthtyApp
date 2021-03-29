import React, {Component} from 'react';
import {
  Container,
  Text,
  Item,
  Card,
  Left,
  Right,
  Content,
  Toast,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from './styles';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {
  getMemberDetailsByEmail,
  getClaimsDataByPayerCode,
} from '../../providers/corporate/corporate.actions';
('');
import {getPolicyByPolicyNo} from '../../providers/policy/policy.action';
import {formatDate} from '../../../setup/helpers';
import {
  primaryColor,
  secondaryColor,
  secondaryColorTouch,
} from '../../../setup/config';
import {translate} from '../../../setup/translator.helper';
import RenderClaimStatus from './renderClaimStatus';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const LIMIT = 10;

class PolicyStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberDetails: {},
      policyDetails: {},
      claimsData: [],
      isLoadingMoreData: false,
      showCard: 0,
      show: true,
    };
    this.isEnabledLoadMoreData = true;
    this.pagination = 1;
    this.claimsDataArray = [];
  }

  componentDidMount() {
    this.getMemberDetailsByEmail();
  }
  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let memberPolicyNo =
        (await AsyncStorage.getItem('memberPolicyNo')) || null;

      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(memberPolicyNo);
        await this.setState({
          memberDetails: result[0],
          policyDetails: policyData,
        });
        await this.getClaimDetails();
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  getClaimDetails = async () => {
    try {
      const {memberDetails, policyDetails} = this.state;
      let result = await getClaimsDataByPayerCode(
        policyDetails.TPA,
        memberDetails.policyNo,
        this.pagination,
        LIMIT,
      );
      if (result && result.docs && result.docs.length) {
        this.pagination = this.pagination + 1;
        this.claimsDataArray = [...this.claimsDataArray, ...result.docs];
        this.setState({claimsData: this.claimsDataArray});
      } else {
        if (this.claimsDataArray.length > 4) {
          Toast.show({
            text: 'No more data Available!',
            duration: 5000,
            type: 'success',
          });
        }
        this.isEnabledLoadMoreData = false;
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  toggleData(data) {
    const {showCard, show} = this.state;
    if (data === showCard) {
      this.setState({showCard: data, show: !this.state.show});
    } else {
      this.setState({showCard: data, show: false});
    }
  }
  loadMoreData = async () => {
    try {
      this.setState({isLoadingMoreData: true});
      await this.getClaimDetails();
    } catch (error) {
      console.log('Ex is getting on load more data', error.message);
    } finally {
      this.setState({isLoadingMoreData: false});
    }
  };
  percentageCalculation = (total, balance) => {
    if (total != 0) {
      let percentage = (balance / total) * 100;
      return percentage;
    } else {
      return 0;
    }
  };

  renderClaimStatus(item, index) {
    return (
      <RenderClaimStatus
        item={item}
        index={index}
        memberDetails={this.state.memberDetails}
        showCard={this.state.showCard}
        show={this.state.show}
        onPressArrowIconSelectedIndex={index}
        navigation={this.props.navigation}
        onPressToggleButton={(data) =>
          this.toggleData(data)
        }></RenderClaimStatus>
    );
  }

  headerComponent() {
    const {memberDetails, policyDetails} = this.state;
    return (
      <View>
        <Card
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AnimatedCircularProgress
              size={140}
              width={10}
              // ref="circularProgress"
              fill={this.percentageCalculation(
                memberDetails.sumInsured ? memberDetails.sumInsured : 0,
                memberDetails.balSumInsured ? memberDetails.balSumInsured : 0,
              )}
              tintColor={primaryColor}
              backgroundColor="rgba(18, 130, 131, 0.3)">
              {() => (
                <View>
                  <Text style={styles.usedAmount}>
                    {memberDetails.balSumInsured
                      ? memberDetails.balSumInsured
                      : 0}
                  </Text>
                  <Text style={styles.totalAmount}>
                    {' '}
                    /{memberDetails.sumInsured ? memberDetails.sumInsured : 0}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <View style={{marginTop: 10}}>
              <Text style={styles.nameText}>
                {memberDetails.firstName
                  ? memberDetails.firstName + ' ' + memberDetails.lastName
                  : '-'}
              </Text>
              <Text style={styles.policyText}>
                {translate('Member Code')} :{' '}
                <Text style={styles.commonText}>
                  {memberDetails.memberId ? memberDetails.memberId : '-'}
                </Text>
              </Text>
              <Text style={styles.policyText}>
                {translate('Validity period')} :{' '}
                <Text style={styles.commonText}>
                  {policyDetails.policyEffectiveFrom
                    ? formatDate(
                        policyDetails.policyEffectiveFrom,
                        'DD-MM-YY',
                      ) +
                      ' - ' +
                      formatDate(policyDetails.policyEffectiveTo, 'DD-MM-YY')
                    : 'N/A'}
                </Text>
              </Text>
            </View>
          </View>
        </Card>

        {/* {data.length === 0 ?
            <View style={{marginTop:200}}>

            <RenderListNotFound
                text={'No medical Records found'}
            />
            </View>
            : null} */}
      </View>
    );
  }

  render() {
    const {
      memberDetails,
      policyDetails,
      claimsData,
      isLoadingMoreData,
    } = this.state;
    const {showCard, show} = this.state;

    return (
      <Container>
        {/* <Content contentContainerStyle={{margin:15,}}> */}
        {/* <Card style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5, }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <AnimatedCircularProgress
                size={140}
                width={10}
                ref='circularProgress'
                fill={this.percentageCalculation(memberDetails.sumInsured ? memberDetails.sumInsured : 0, memberDetails.balSumInsured ? memberDetails.balSumInsured : 0)}
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
                <Text style={styles.policyText}>{translate("Member Code")} : <Text style={styles.commonText}>{memberDetails.memberId ? memberDetails.memberId : '-'}</Text></Text>
                <Text style={styles.policyText}>{translate("Validity period")} : <Text style={styles.commonText}>{policyDetails.policyEffectiveFrom?(formatDate(policyDetails.policyEffectiveFrom, "DD-MM-YY") + " - " + formatDate(policyDetails.policyEffectiveTo, "DD-MM-YY")):'N/A'}</Text></Text>
              </View>

            </View>
          </Card> */}

        {claimsData && claimsData.length ? (
          <View style={{padding: 10}}>
            <FlatList
              data={claimsData}
              ListHeaderComponent={() => this.headerComponent()}
              keyExtractor={(item, index) => index.toString()}
              // onEndReached={() => this.loadMoreData()}
              //            onMomentumScrollBegin={() => { this.setState({isEnabledLoadMoreData:false}) }}
              //           onEndReachedThreshold={0.5}
              // scrollEventThrottle={16}
              onEndReachedThreshold={1}
              onEndReached={() => {
                if (this.isEnabledLoadMoreData) {
                  this.loadMoreData();
                }
              }}
              renderItem={({item, index}) =>
                this.renderClaimStatus(item, index)
              }
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
                textAlign: 'center',
              }}>
              {translate('No claim list found!')}
            </Text>
          </Item>
        )}
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

export default PolicyStatus;
