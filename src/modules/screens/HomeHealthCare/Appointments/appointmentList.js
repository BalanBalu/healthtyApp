import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from '../Styles'
import { serviceOfGetHealthcareAppointmentList } from '../../../providers/homeHelthCare/action'
import { addTimeUnit, subTimeUnit, getAllId } from "../../../../setup/helpers";
import { hasLoggedIn } from "../../../providers/auth/auth.actions";
import { getAllEducation, getAllSpecialist } from '../../../common'
import Spinner from "../../../../components/Spinner";
import { getMultipleDoctorDetails } from "../../../providers/bookappointment/bookappointment.action";
import InsertReview from '../Reviews/insertReviews';
import { RenderNoAppointmentsFounds } from '../../CommonAll/components';
import RenderAppointmentList from './RenderAppointmentList';
const PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST = 6;
const DOCTOR_FIELDS = "specialist,education,prefix,profile_image,gender";

import moment from 'moment';
export default class AppointmentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            isVisibleAddReviewPop: false,
            reviewData: {},
            isLoadingMoreAppList: false
        }
        this.incrementPaginationCount = 0;
        this.isEnabledLoadMoreData = true;
    }
    async componentDidMount() {
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        await this.onChangeUpComingOrPastTabs(0);
    }


    pageRefresh = async (navigationData) => {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {
                if (navigationData.lastState && navigationData.lastState.params && navigationData.lastState.params.isEnablePageRefresh4HomeAppointmentList) {
                    this.isEnabledLoadMoreData = true;
                    this.incrementPaginationCount = 0;
                    if (this.state.selectedIndex == 0) {
                        this.setState({ data: [], isLoading: true });
                        await this.getUpComingAppointmentList();
                    } else {
                        this.setState({ data: [], isLoading: true });
                        await this.getPastAppointmentList();
                    }
                    this.setState({ isLoading: false });
                }
            }
        }

    }

    getUpComingAppointmentList = async () => {
        try {
            debugger
            const reqQueryData = {
                startDate: moment().startOf('day').toISOString(),
                endDate: addTimeUnit(new Date(), 1, "years").toUTCString(),
                limit: PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST,
                skip: this.incrementPaginationCount,
                sort: 1
            };
            await this.setUpComingAndPastDataListByCommon(reqQueryData);
            debugger
        } catch (Ex) {
            console.log('Ex is getting on getUpComingAppointmentList for Patient====>', Ex.message)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting getUpComingAppointmentList for Patient : ${Ex.message}`
            }
        }
    }

    getPastAppointmentList = async () => {
        try {
            const reqQueryData = {
                startDate: subTimeUnit(new Date(), 1, "years").toISOString(),
                endDate: new Date(moment().subtract(1, 'day').endOf('day')).toISOString(),
                limit: PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST,
                skip: this.incrementPaginationCount,
                sort: -1,
                reviewInfo: true
            };
            await this.setUpComingAndPastDataListByCommon(reqQueryData);
        } catch (Ex) {
            console.log('Ex is getting on getPastAppointmentList for Patient====>', Ex.message)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting getPastAppointmentList for Patient : ${Ex.message}`
            }
        }
    }
    setUpComingAndPastDataListByCommon = async (reqQueryData) => {
        try {
            debugger
            const userId = await AsyncStorage.getItem("userId");
            let appointmentListResp = await serviceOfGetHealthcareAppointmentList(userId, reqQueryData);
            if (appointmentListResp.success) {
                this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST;
                let doctorInfoMap = new Map();
                appointmentListResp = appointmentListResp.data;
                const stringOfDoctorIds = getAllId(appointmentListResp)
                let docMulDetailsList = await getMultipleDoctorDetails(stringOfDoctorIds, DOCTOR_FIELDS);
                docMulDetailsList.data.forEach(doctorData => {
                    let educationData = '';
                    let specialistData = '';
                    if (doctorData.education != undefined) {
                        educationData = getAllEducation(doctorData.education)
                    }
                    if (doctorData.specialist != undefined) {
                        specialistData = getAllSpecialist(doctorData.specialist)
                    }
                    doctorInfoMap.set(String(doctorData.doctor_id), {
                        degree: educationData,
                        specialist: specialistData,
                        prefix: doctorData.prefix,
                        profile_image: doctorData.profile_image,
                        gender: doctorData.gender
                    })
                });
                debugger
                let upcomingOrPastInfo = [];
                appointmentListResp.map(appointmentItem => {
                    const baCupOfDocInfoObj = doctorInfoMap.get(String(appointmentItem.doctor_id))
                    upcomingOrPastInfo.push({
                        appointmentResult: appointmentItem,
                        ...baCupOfDocInfoObj
                    });
                });
                debugger
                const upcomingOrPastInfoList = [...this.state.data, ...upcomingOrPastInfo];  //  Merge previous  and current  UpComing Or Past data list
                if (upcomingOrPastInfoList.length < 4) {
                    this.isEnabledLoadMoreData = false;
                }
                if (this.state.selectedIndex === 0) {
                    upcomingOrPastInfoList.sort((firstObj, secObj) => firstObj.appointmentResult.appointment_date < secObj.appointmentResult.appointment_date ? -1 : 0);
                    this.setState({ data: upcomingOrPastInfoList, });
                }
                else {
                    upcomingOrPastInfoList.sort((firstObj, secObj) => firstObj.appointmentResult.appointment_date > secObj.appointmentResult.appointment_date ? -1 : 0);
                    this.setState({ data: upcomingOrPastInfoList });
                }
            }
            else {
                this.isEnabledLoadMoreData = false;
                if (this.state.data.length > 4) {
                    Toast.show({
                        text: 'No more Appointments Available!',
                        duration: 4000,
                        type: "success"
                    })
                }
            }
            debugger
        } catch (Ex) {
            console.log('Ex is getting on set UpComingAndPastDataList By Common  for Patient====>', Ex.message)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on set UpComingAndPastDataList By Common for Patient : ${Ex.message}`
            }
        }
    }

    onChangeUpComingOrPastTabs = async (index) => {
        debugger
        this.isEnabledLoadMoreData = true;
        this.incrementPaginationCount = 0;
        await this.setState({ data: [], selectedIndex: index, isLoading: true });
        if (index === 0) {
            debugger
            await this.getUpComingAppointmentList();
        } else {
            debugger
            await this.getPastAppointmentList();
        }
        this.setState({ isLoading: false });
        debugger
    }

    onPressNavigateToInsertReviewPage(item, index) {
        this.setState({ isVisibleAddReviewPop: true, reviewData: item.appointmentResult })
    }

    insertReviewPopVisible = async (data) => {
        this.isEnabledLoadMoreData = true;
        this.setState({ isVisibleAddReviewPop: false });
        if (data.updatedVisible == true) {
            this.incrementPaginationCount = 0;
            this.setState({ data: [] });
            await this.getPastAppointmentList();
        }
    }
    onPressGoToBookAppointmentPage = (item) => {
        const reqParamsData = {
            doctorId: item.appointmentResult && item.appointmentResult.doctor_id,
            fetchAvailabiltySlots: true,
        }
        const userAddressInfo = item.appointmentResult && item.appointmentResult.patient_location
        if (userAddressInfo) {
            reqParamsData.reqPinCode = userAddressInfo.address && userAddressInfo.address.pin_code;
            reqParamsData.userAddressInfo = userAddressInfo;
        }
        this.props.navigation.navigate('Home Healthcare Doctor Details Preview', reqParamsData);
    }
    renderAppointmentList(item, index) {
        return (
            <RenderAppointmentList
                appointmentData={{ item, index, selectedIndex: this.state.selectedIndex, navigation: this.props.navigation }}
                onPressNavigateToInsertReviewPage={(item, index) => { this.onPressNavigateToInsertReviewPage(item, index) }}
                onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
            // shouldUpdate={`${item}`}
            >
            </RenderAppointmentList>
        )
    }


    loadMoreData = async () => {
        try {
            debugger
            this.setState({ isLoadingMoreAppList: true });
            if (this.state.selectedIndex === 0) await this.getUpComingAppointmentList()
            else await this.getPastAppointmentList();
            debugger
        } catch (error) {
            console.log("Ex is getting on load more doctor ist data", error.message);
        }
        finally {
            this.setState({ isLoadingMoreAppList: false })
        }
    }
    render() {
        const { data, reviewData, selectedIndex, isVisibleAddReviewPop, isLoading } = this.state;
        return (
            <Container style={{ backgroundColor: '#ffffff', }}>
                <NavigationEvents
                    onWillFocus={payload => { this.pageRefresh(payload) }}
                />

                <Card transparent>
                    <SegmentedControlTab
                        tabsContainerStyle={{
                            width: 250,
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "auto"
                        }}
                        values={["Upcoming", "Past"]}
                        selectedIndex={selectedIndex}
                        onTabPress={this.onChangeUpComingOrPastTabs}
                        activeTabStyle={{
                            backgroundColor: "#775DA3",
                            borderColor: "#775DA3"
                        }}
                        tabStyle={{ borderColor: "#775DA3" }} />
                </Card>
                {isLoading ?
                    <Spinner
                        color="blue"
                        style={[styles.containers, styles.horizontal]}
                        visible={isLoading}
                        size={"large"}
                        overlayColor="none"
                        cancelable={false}
                    /> :
                    data.length ?
                        <FlatList
                            data={data}
                            onEndReached={() => { if (this.isEnabledLoadMoreData) this.loadMoreData(); }}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item, index }) => this.renderAppointmentList(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : < RenderNoAppointmentsFounds text={"No Appointments are scheduled !"} />
                }
                {isVisibleAddReviewPop === true ?
                    <InsertReview
                        props={this.props}
                        data={reviewData}
                        popupVisible={(data) => this.insertReviewPopVisible(data)}
                    />
                    : null}
                {this.state.isLoadingMoreAppList ?
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <ActivityIndicator
                            style={{ marginBottom: 17 }}
                            animating={true}
                            size="small"
                            color='green'
                        />
                    </View>
                    : null}
            </Container>
        )
    }
}

