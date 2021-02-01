import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, FlatList, AsyncStorage } from 'react-native';
import { CorporateProfileCard } from './profileCard'
import { ProfileFamilyCard } from './profilefamilyCard'
import { SearchAndAppointmentCard } from './searchAndAppointmentcard'
import { TransactionHistoryCard } from './transactionHistoryCard'
import { CoverageCard } from './converageCard'
import { connect } from 'react-redux'
import { Container, Content, Button, Card, Input, Left, Right, Icon, Toast } from 'native-base';
import { getCorporateEmployeeDetailsById } from '../../../providers/corporate/corporate.actions'
import { fetchUserProfile, SET_CORPORATE_DATA } from '../../../providers/profile/profile.action';
import { store } from '../../../../setup/store';
import { fetchUserMarkedAsReadedNotification } from '../../../providers/notification/notification.actions';
import CurrentLocation from '../CurrentLocation';
import { NavigationEvents } from 'react-navigation'

class CorporateHome extends PureComponent {
    locationUpdatedCount = 0;
    constructor(props) {
        super(props)
        this.state = {
            isCorporateUser: false,
            relationship:null
        }
    }
    async componentDidMount() {
        let userId = await AsyncStorage.getItem("userId");
        let relationship = await AsyncStorage.getItem("relationship") || null;
        
        const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
        this.setState({ isCorporateUser, relationship })
        if (isCorporateUser) {
            this.getCorporateDatails(userId)
        }
        this.initialFunction();
    }

    doLogout() {
        logout();
        this.props.navigation.navigate('login');
    }
    initialFunction = async () => {
        try {

            CurrentLocation.getCurrentPosition();
            let userId = await AsyncStorage.getItem("userId");
            if (userId) {
                const { notification: { notificationCount }, navigation } = this.props
                
                    navigation.setParams({
                        notificationBadgeCount: notificationCount
                    });
                
                this.getMarkedAsReadedNotification(userId);
            }
        }
        catch (ex) {
            console.log(ex)
        }
    }

    getCorporateDatails = async (userId) => {
        try {

            let fields = "corporate_member_id,employee_code";
            let userResult = await fetchUserProfile(userId, fields);
           
            if (userResult) {
                let corporateResult = await getCorporateEmployeeDetailsById(userResult.employee_code);

                if (!!corporateResult && !corporateResult.error) {


                    store.dispatch({
                        type: SET_CORPORATE_DATA,
                        data: corporateResult
                    })

                    // await this.setState({ data: corporateResult })


                }
            }
            let forceToChangePassword = await AsyncStorage.getItem('forceToChangePassword') || null
            if (forceToChangePassword) {
                this.props.navigation.navigate('UpdatePassword', { updatedata: {} });
            }

        } catch (error) {
            Toast.show({
                text: 'Something went wrong' + error,
                duration: 3000,
                type: 'danger'
            })
        }
    }
    getMarkedAsReadedNotification = async (userId) => {
        try {
            await fetchUserMarkedAsReadedNotification(userId);
            const { notification: { notificationCount }, navigation } = this.props
            navigation.setParams({
                notificationBadgeCount: notificationCount
            });
        }
        catch (e) {
            console.log(e)
        }
    }
    backNavigation = async (navigationData) => {
        try {
            let userId = await AsyncStorage.getItem('userId')
            if (userId) {
                this.getMarkedAsReadedNotification(userId);
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let corporateData = this.props.profile.corporateData;
        const { navigate } = this.props.navigation;
        const { isCorporateUser,relationship } = this.state;
        const { bookappointment: { patientSearchLocationName, isSearchByCurrentLocation, locationUpdatedCount },
            navigation } = this.props;
        if (locationUpdatedCount !== this.locationUpdatedCount) {
            navigation.setParams({
                appBar: {
                    locationName: patientSearchLocationName,
                    locationCapta: isSearchByCurrentLocation ? 'You are searching Near by Hospitals' : 'You are searching hospitals in ' + patientSearchLocationName
                }
            });
            this.locationUpdatedCount = locationUpdatedCount;

        }

        return (
            <Container style={styles.container}>
                <Content keyboardShouldPersistTaps={'handled'} style={styles.bodyContent}>
                    <NavigationEvents onWillFocus={payload => { this.backNavigation(payload) }} />
                    <View style={{ padding: 10 }}>
                        {isCorporateUser&&corporateData && corporateData.length ?
                            <CorporateProfileCard
                                data={corporateData && corporateData.find(ele => ele.relationship === relationship) || null}
                            />
                            : null}
                        {isCorporateUser ?
                            <ProfileFamilyCard
                                navigation={navigate}
                            /> : null}
                        {isCorporateUser ?
                            <CoverageCard /> : null}
                        <SearchAndAppointmentCard
                            navigation={navigate}
                        />
                        <TransactionHistoryCard
                            navigation={navigate} />

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
    }
}
export default connect(CorporateHomeState)(CorporateHome)