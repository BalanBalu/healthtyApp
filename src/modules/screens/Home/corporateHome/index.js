import React, { PureComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View
} from 'react-native';
import { ProfileFamilyCard } from './profilefamilyCard';
import { SearchAndAppointmentCard } from './searchAndAppointmentcard';
import { TransactionHistoryCard } from './transactionHistoryCard';
import { CoverageCard } from './converageCard';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Toast,
} from 'native-base';
import {
  getCorporateEmployeeDetailsById,
  getTpaInfoByTpaCode,
  getCorporateHelpLineNumber,
  getMemberDetailsByPolicyNo,
  getFamilyMemDetails,

} from '../../../providers/corporate/corporate.actions';
import {
  fetchUserProfile,
  SET_CORPORATE_DATA,
  SET_MEMBER_POLICY_INFO,
  SET_MEMBER_TPA_DATA,
  SET_FAMILY_DATA
} from '../../../providers/profile/profile.action';
import { store } from '../../../../setup/store';
import { fetchUserMarkedAsReadedNotification } from '../../../providers/notification/notification.actions';
import { getPolicyByPolicyNo } from '../../../providers/policy/policy.action';
import CurrentLocation from '../CurrentLocation';
import { NavigationEvents } from 'react-navigation';
import { ContactUsCard } from './contactUsCard';
import PolicyCoverageCard from './policyCoverageCard';
import { getMemberDetailsByEmail } from '../../../providers/corporate/corporate.actions';
import { translate } from '../../../../setup/translator.helper';
import NotifService from '../../../../setup/NotifService';

class CorporateHome extends PureComponent {
  locationUpdatedCount = 0;
  constructor(props) {
    super(props);
    this.state = {
      corporateData: {},
      TPAData: null,
      memberDetails: {},
      policyDetails: {},
      connectionStatus: null,
      helpLineNumberData: [],
      isLoadingPolicyCard:true
    };
    this.pagination = 1;
  }

  async componentDidMount() {
      await this.getCorporateDatails();
    this.setState({ corporateData: this.props?.profile?.corporateData,TPAData: this.props?.profile?.memberTpaInfo })
    await this.getMemberDetailsByPolicyNo();
    await this.getMemberDetailsByEmail();
    this.initialFunction();
    this.getCorporatePhoneNumber();

  }


  async componentDidUpdate(prevProps, prevState) {
    this.setState({ connectionStatus: this.props.profile.connectionStatus })
    if (prevState.connectionStatus !== this.state.connectionStatus) {
      let userID = await AsyncStorage.getItem('userID');
      await this.getCorporateDatails(userID)
      await this.getFamilyMemberDetailsByPolicyNo()
      await this.getMemberDetailsByPolicyNo();
      this.getMemberDetailsByEmail();
      this.getCorporatePhoneNumber();

      this.setState({ corporateData: this.props?.profile?.corporateData ,TPAData: this.props?.profile?.memberTpaInfo })
    }
  }


  getMemberDetailsByEmail = async () => {
    try {
      let memberEmailId = (await AsyncStorage.getItem('memberEmailId')) || null;
      let result = await getMemberDetailsByEmail(memberEmailId);
      if (result && result.length) {
        NotifService.initNotification(this.props.navigation,result[0]._id);
        let policyData = await getPolicyByPolicyNo(result&&result[0].policyNo);
        await this.setState({
          memberDetails: result[0],
          policyDetails: policyData,
        });
      }
    } catch (Ex) {
      console.log('Ex is getting on get getMemberDetailsByEmail ',Ex.message);
    }
  };
  getCorporatePhoneNumber = async () => {
    try {
      let result = await getCorporateHelpLineNumber();
      await this.setState({ helpLineNumberData: result[0] });
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
      // const userId = await AsyncStorage.getItem('userId');
      // if (userId) {
      //   const {
      //     notification: { notificationCount },
      //     navigation,
      //   } = this.props;

      //   navigation.setParams({
      //     notificationBadgeCount: notificationCount,
      //   });

      //   this.getMarkedAsReadedNotification(userId);
      // }
    } catch (ex) {
      console.log(ex);
    }
  };

  getCorporateDatails = async () => {
    try {
      this.setState({isLoadingPolicyCard: true})
      const employeeCode = await AsyncStorage.getItem('employeeCode');
      if (employeeCode) {
        const corporateResult = await getCorporateEmployeeDetailsById(employeeCode);
        if (corporateResult && corporateResult.length) {
        await   store.dispatch({
            type: SET_CORPORATE_DATA,
            data: corporateResult,
          });
          const memberPolicyNo = corporateResult &&  corporateResult.length &&  corporateResult[0].policyNo;
          if (memberPolicyNo) {
            const policyData = await getPolicyByPolicyNo(memberPolicyNo);
            if (policyData && Object.keys(policyData).length) {
              await store.dispatch({
                type: SET_MEMBER_POLICY_INFO,
                data: policyData,
              });
              if (policyData && policyData.TPA) {
                const memberTpaResp = await getTpaInfoByTpaCode(policyData.TPA);
                const memberTpaData =
                  memberTpaResp && memberTpaResp.length && memberTpaResp[0];
                if (memberTpaData) {
                  await store.dispatch({
                    type: SET_MEMBER_TPA_DATA,
                    data: memberTpaData,
                  });
                }
              }
            }
          }
        }
      }
      const forceToChangePassword =  (await AsyncStorage.getItem('forceToChangePassword')) || null;
      if (forceToChangePassword) {
        this.props.navigation.navigate('UpdatePassword', { updatedata: {} });
      }
    } catch (error) {
      Toast.show({
        text: 'Something went wrong' + error,
        duration: 3000,
        type: 'danger',
      });
    }
    finally{
      this.setState({isLoadingPolicyCard: false})
    }
  };

  getMemberDetailsByPolicyNo = async () => {
    try {
      this.setState({ isLoadingPolicyCard: true });
      const memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      const  respData = await getMemberDetailsByPolicyNo(memberPolicyNo);
      if (respData) {
        await this.setState({ memberDetails: respData });
        this.getFamilyMemberDetailsByPolicyNo(memberPolicyNo);
      }
    } catch (Ex) {
      console.log('Ex is getting on get Policy Card info',Ex.message);
    } finally {
      this.setState({ isLoadingPolicyCard: false });
    }
  };

  getFamilyMemberDetailsByPolicyNo = async () => {
    try {
      this.setState({ isLoading: true });
      let memberPolicyNo = await AsyncStorage.getItem('memberPolicyNo');
      let employeeCode = await AsyncStorage.getItem('employeeCode');
      let result = await getFamilyMemDetails(memberPolicyNo, employeeCode);

      //commented out since no states family_members and id is declared -aashiq
      // if (result) {
      //   this.setState({family_members: result, id: result[0]?._id});

      //    store.dispatch({
      //     type: SET_FAMILY_DATA,
      //     data: this.state.family_members,
      //   });
      // }

      await store.dispatch({
        type: SET_FAMILY_DATA,
        data: result ?? {},
      });
    } catch (ex) {
      console.log(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };


  getMarkedAsReadedNotification = async (userId) => {
    try {
      await fetchUserMarkedAsReadedNotification(userId);
      const {
        notification: { notificationCount },
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
    const { corporateData } = this.state;
    const { navigate } = this.props.navigation;

    const {
      helpLineNumberData,
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
            ? translate('You are searching Near by Hospitals')
            : translate('You are searching hospitals in ') + patientSearchLocationName,
        },
      });
      this.locationUpdatedCount = locationUpdatedCount;
    }

    return (
      <Container style={[styles.container, { backgroundColor: '#FAFBFF' }]}>
        <Content
          keyboardShouldPersistTaps={'handled'}
          style={styles.bodyContent}>
          <NavigationEvents
            onWillFocus={(payload) => {
              this.backNavigation(payload);
            }}
          />
          <View style={{ padding: 10 }}>
            { corporateData && corporateData.length ? (
              <PolicyCoverageCard
              />
            ) : null}
              <ProfileFamilyCard navigation={navigate} translate={translate} />
          <CoverageCard navigation={navigate} /> 
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
