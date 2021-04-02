import React, {PureComponent} from 'react';
import {
  Text,
  Radio,
  Icon,
  Input,
  CheckBox,
  Right,
  Container,
  Content,
  Item,
} from 'native-base';
import { Loader } from '../../../components/ContentLoader';
import {Col, Row} from 'react-native-easy-grid';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import RenderFamilyList from './RenderFamilyList';
import {
  getMemberDetailsByPolicyNo,
  getFamilyMembersByPolicyNoeWithPagination,
} from '../../providers/corporate/corporate.actions';
import {Loader} from '../../../components/ContentLoader';

const LIMIT = 10;

class FamilyInfoList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      memberDetails: [],
      claimList: [],
      familyList: [],
      isShowBeneficiaryInfoCard: -1,
      isLoading: true,
    };
    this.pagination = 1;
    this.navigationPage = props.navigation.getParam('navigationPage');
    this.preAuthReqData = props.navigation.getParam('preAuthReqData');
  }
  UNSAFE_componentWillMount= async () => {
    this.getMemberDetailsByPolicyNo();
    this.memberEmailId = await AsyncStorage.getItem('memberEmailId');
  }
  getMemberDetailsByPolicyNo = async () => {
    try {
      this.setState({isLoading: true});
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let result = await getMemberDetailsByPolicyNo(memberPolicyNo);
      if (result) {
        await this.setState({memberDetails: result});
        this.getFamilyMemberDetailsByPolicyNo(memberPolicyNo);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({isLoading: false});
    }
  };

  getFamilyMemberDetailsByPolicyNo = async (memberPolicyNo) => {
    try {
      this.setState({isLoading: true});
      let result = this.props.profile.familyData || [];
      if (result && result.length != 0) {
        let temp = [],
          familyList = [];
        for (let familydetails of result) {
          this.state.memberDetails.filter((ele) => {
            ele.employeeId === familydetails.employeeId;
            temp.push(ele);
          });

          if (temp && temp.length != 0) {
            familydetails.sumInsured = temp[0].sumInsured;
            familydetails.balSumInsured = temp[0].balSumInsured;
            familydetails.enrollmentStartDate = temp[0].enrollmentStartDate;
            familydetails.enrollmentEndDate = temp[0].enrollmentEndDate;
            familydetails.emailId = temp[0].emailId|| this.memberEmailId;
            familyList.push(familydetails);
          }
        }
        await this.setState({familyList: familyList || []});
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({isLoading: false});
    }
  };

  onPressSelectBtnToGoNextProcess = (selectedMemObj) => {
    if (this.navigationPage === 'ClaimIntimationSubmission') {
      this.props.navigation.navigate(this.navigationPage, {
        memberInfo: selectedMemObj,
        tpaCode:this.props.profile && this.props.profile.memberTpaInfo,
      });
    } else if (this.navigationPage === 'PreAuthSubmission') {
      if (!this.preAuthReqData) {
        this.preAuthReqData = {
          tpaInfo: this.props.profile && this.props.profile.memberTpaInfo,
        };
      }
      this.props.navigation.navigate('PreAuthSubmission', {
        memberInfo: selectedMemObj,
        preAuthInfo: this.preAuthReqData,
      });
    }
  };
  render() {
    const {familyList, isLoading} = this.state;
    return (
      <Container>
        {isLoading ? (
          <Loader style="list" />
        ) : familyList && familyList.length ? (
          <Content style={{padding: 10}}>
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'opensans-bold',
                  marginTop: 10,
                }}>
                {' '}
                {familyList && familyList.length ? 'Family Information' : null}
              </Text>
              {familyList.map((item, index) => (
                <RenderFamilyList
                  item={item}
                  index={index}
                  isShowBeneficiaryInfoCard={
                    this.state.isShowBeneficiaryInfoCard
                  }
                  navigation={this.props.navigation}
                  onPressIsShowBeneficiaryInfo={(
                    isShowBeneficiaryInfoCard,
                    typeOfArrowIcon,
                  ) =>
                    this.setState({
                      isShowBeneficiaryInfoCard:
                        typeOfArrowIcon === 'DOWN'
                          ? isShowBeneficiaryInfoCard
                          : -1,
                    })
                  }
                  onPressSelectBtnToGoNextProcess={(selectedMemObj) =>
                    this.onPressSelectBtnToGoNextProcess(selectedMemObj)
                  }
                  // shouldUpdate={``}
                ></RenderFamilyList>
              ))}
            </View>
          </Content>
        ) : (
          <Content
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                borderBottomWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {' '}
                No member details found!
              </Text>
            </View>
          </Content>
        )}
      </Container>
    );
  }
}

const familyInfoListState = ({profile} = state) => ({profile});
export default connect(familyInfoListState)(FamilyInfoList);
