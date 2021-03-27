import React, {PureComponent} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import {CorporateProfileCard} from './profileCard';
import {ProfileFamilyCard} from './profilefamilyCard';
import {SearchAndAppointmentCard} from './searchAndAppointmentcard';
import {TransactionHistoryCard} from './transactionHistoryCard';
import {CoverageCard} from './converageCard';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  Button,
  Card,
  Input,
  Left,
  Right,
  Icon,
  Toast,
} from 'native-base';
import {
  getCorporateEmployeeDetailsById,
  getTpaInfoByTpaCode,
  getCorporateHelpLineNumber,
  getMemberDetailsByPolicyNo,
  getFamilyMembersByPolicyNoeWithPagination,

} from '../../../providers/corporate/corporate.actions';
import {
  fetchUserProfile,
  SET_CORPORATE_DATA,
  SET_MEMBER_POLICY_INFO,
  SET_MEMBER_TPA_DATA,
  SET_FAMILY_DATA
} from '../../../providers/profile/profile.action';
import {store} from '../../../../setup/store';
import {fetchUserMarkedAsReadedNotification} from '../../../providers/notification/notification.actions';
import {getPolicyByPolicyNo} from '../../../providers/policy/policy.action';
import CurrentLocation from '../CurrentLocation';
import {NavigationEvents} from 'react-navigation';
import {ContactUsCard} from './contactUsCard';
import {PolicyCoverageCard} from './policyCoverageCard';
import {getMemberDetailsByEmail} from '../../../providers/corporate/corporate.actions';
import {formatDate} from '../../../../setup/helpers';
import {translate} from '../../../../setup/translator.helper';

const LIMIT = 10;

class CorporateHome extends PureComponent {
  locationUpdatedCount = 0;
  constructor(props) {
    super(props);
    this.state = {
      isCorporateUser: false,
      relationship: null,
      memberDetails: {},
      policyDetails: {},
      relationship: null,
      helpLineNumberData: [],
    };
    this.pagination = 1;

  }
  async componentDidMount() {
    let userId = await AsyncStorage.getItem('userId');
    let relationship = (await AsyncStorage.getItem('relationship')) || null;

    const isCorporateUser =
      (await AsyncStorage.getItem('is_corporate_user')) === 'true';
    this.setState({isCorporateUser, relationship});
    if (isCorporateUser) {
      this.getCorporateDatails(userId);
    }
    this.initialFunction();
    await this.getMemberDetailsByPolicyNo();
    this.getMemberDetailsByEmail();
    this.getCorporatePhoneNumber();
  }
//   componentDidUpdate(prevProps, prevState) {
//     if (prevState.translation !== this.state.translation) {
//       console.log('pokemons state has changed.');
//     }
//   }


  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result) {
        let policyData = await getPolicyByPolicyNo(result[0].policyNo);
        await this.setState({
          memberDetails: result[0],
          policyDetails: policyData,
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  getCorporatePhoneNumber = async () => {
    try {
      let result = await getCorporateHelpLineNumber();
      await this.setState({helpLineNumberData: result[0]});
    } catch (ex) {
      console.log(ex);
    }
  };
  doLogout() {
    logout();
    this.props.navigation.navigate('login');
  }
  initialFunction = async () => {
    try {
      CurrentLocation.getCurrentPosition();
      let userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const {
          notification: {notificationCount},
          navigation,
        } = this.props;

        navigation.setParams({
          notificationBadgeCount: notificationCount,
        });

        this.getMarkedAsReadedNotification(userId);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  getCorporateDatails = async (userId) => {
    try {
      let fields = 'corporate_member_id,employee_code';
      let userResult = await fetchUserProfile(userId, fields);

      if (userResult) {
        let corporateResult = await getCorporateEmployeeDetailsById(
          userResult.employee_code,
        );

        if (!!corporateResult && !corporateResult.error) {
          store.dispatch({
            type: SET_CORPORATE_DATA,
            data: corporateResult,
          });
          const memberPolicyNo =
            corporateResult &&
            corporateResult.length &&
            corporateResult[0].policyNo;
          if (memberPolicyNo) {
            const policyData = await getPolicyByPolicyNo(memberPolicyNo);
            if (policyData && Object.keys(policyData).length) {
              if (policyData && policyData.TPA) {
                const memberTpaResp = await getTpaInfoByTpaCode(policyData.TPA);
                const memberTpaData =
                  memberTpaResp && memberTpaResp.length && memberTpaResp[0];
                  console.log("memberTpaData",memberTpaData)
                if (memberTpaData) {
                  await store.dispatch({
                    type: SET_MEMBER_TPA_DATA,
                    data: memberTpaData,
                  });
                }
              }
              await store.dispatch({
                type: SET_MEMBER_POLICY_INFO,
                data: policyData,
              });
            }
          }
        }
      }
      let forceToChangePassword =
        (await AsyncStorage.getItem('forceToChangePassword')) || null;
      if (forceToChangePassword) {
        this.props.navigation.navigate('UpdatePassword', {updatedata: {}});
      }
    } catch (error) {
      Toast.show({
        text: 'Something went wrong' + error,
        duration: 3000,
        type: 'danger',
      });
    }
  };

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
      let searchText = null;
      let result = await getFamilyMembersByPolicyNoeWithPagination(
        searchText,
        memberPolicyNo,
        this.pagination,
        LIMIT,
      );
      if (result) {
        let temp = [],familyList=[];
        for (let familydetails of result.docs) {
          this.state.memberDetails.filter((ele) => {
            ele.employeeId === familydetails.employeeId;
            temp.push(ele);
          });

          if (temp &&temp.length != 0) {
            familydetails.sumInsured = temp[0].sumInsured;
            familydetails.balSumInsured = temp[0].balSumInsured;
            familydetails.enrollmentStartDate = temp[0].enrollmentStartDate;
            familydetails.enrollmentEndDate = temp[0].enrollmentEndDate;
            familydetails.emailId = temp[0].emailId;
            familyList.push(familydetails);
          }
        }
         await this.setState({familyList:  familyList});
         store.dispatch({
          type: SET_FAMILY_DATA,
          data: this.state.familyList,
        });
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({isLoading: false});
    }
  };


  getMarkedAsReadedNotification = async (userId) => {
    try {
      await fetchUserMarkedAsReadedNotification(userId);
      const {
        notification: {notificationCount},
        navigation,
      } = this.props;
      navigation.setParams({
        notificationBadgeCount: notificationCount,
      });
    } catch (e) {
      console.log(e);
    }
  };
  backNavigation = async (navigationData) => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      if (userId) {
        this.getMarkedAsReadedNotification(userId);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    let corporateData = this.props.profile.corporateData;
    let TPAData = this.props.profile.memberTpaInfo;
    const {navigate} = this.props.navigation;

    const {
      isCorporateUser,
      relationship,
      memberDetails,
      helpLineNumberData,
      policyDetails,
    } = this.state;
    const {
      bookappointment: {
        patientSearchLocationName,
        isSearchByCurrentLocation,
        locationUpdatedCount,
      },
      navigation,
    } = this.props;
    if (locationUpdatedCount !== this.locationUpdatedCount) {
      navigation.setParams({
        appBar: {
          locationName: patientSearchLocationName,
          locationCapta: isSearchByCurrentLocation
            ? 'You are searching Near by Hospitals'
            : 'You are searching hospitals in ' + patientSearchLocationName,
        },
      });
      this.locationUpdatedCount = locationUpdatedCount;
    }

    return (
      <Container style={[styles.container, {backgroundColor: '#FAFBFF'}]}>
        <Content
          keyboardShouldPersistTaps={'handled'}
          style={styles.bodyContent}>
          <NavigationEvents
            onWillFocus={(payload) => {
              this.backNavigation(payload);
            }}
          />
          <View style={{padding: 10}}>
            {isCorporateUser && corporateData && corporateData.length ? (
              <PolicyCoverageCard
                //  data={corporateData && corporateData.find(ele => ele.relationship === relationship) || null}
                data={memberDetails}
                policyData={policyDetails}
                TPAdata={TPAData}
              />
            ) : null}

            {isCorporateUser ? (
              <ProfileFamilyCard navigation={navigate} translate={translate} />
            ) : null}
            {isCorporateUser ? <CoverageCard navigation={navigate} /> : null}
            <SearchAndAppointmentCard navigation={navigate} />
            <TransactionHistoryCard navigation={navigate} />
            <ContactUsCard navigation={navigate} data={helpLineNumberData} />
          </View>
        </Content>
      </Container>
    );
  }
}
function CorporateHomeState(state) {
  return {
    profile: state.profile,
    bookappointment: state.bookappointment,
  };
}
export default connect(CorporateHomeState)(CorporateHome);
