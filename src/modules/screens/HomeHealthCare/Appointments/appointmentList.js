import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking, ActivityIndicator } from 'react-native';
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
import { fetchDocHomeHealthcareAvailabilitySlotsService } from '../../../providers/BookAppointmentFlow/action';
const PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST = 8;
const DOCTOR_FIELDS = "specialist,education,prefix,profile_image,gender";
export default class AppointmentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: false,
            selectedIndex: 0,
            upComingData: [],
            pastData: [],
            isVisibleAddReviewPop: false,
            reviewData: {},
            isLoadingMoreAppList: false
        }
        this.isCalledScrollBegin = true;
        this.incrementPaginationCount = 0;
    }
    async componentDidMount() {
        this.setState({ isLoading: true });
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        await this.getUpComingAppointmentList();
        this.setState({ isLoading: false });
    }


    pageRefresh = async (navigationData) => {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {
                this.incrementPaginationCount = 0;
                this.setState({ isLoading: true });
                if (this.state.selectedIndex == 0) {
                    await this.getUpComingAppointmentList();
                } else {
                    await this.getPastAppointmentList();
                }
                this.setState({ isLoading: false });
            }
        }

    }

    getUpComingAppointmentList = async () => {
        try {
            const reqQueryData = {
                startDate: new Date().toISOString(),
                endDate: addTimeUnit(new Date(), 1, "years").toISOString(),
                limit: PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST,
                skip: this.incrementPaginationCount,
                sort: 1
            };
            await this.setUpComingAndPastDataListByCommon(reqQueryData);
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
                endDate: subTimeUnit(new Date(), 1, 'days').toISOString(),
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
            const userId = await AsyncStorage.getItem("userId");
            let appointmentListResp = await serviceOfGetHealthcareAppointmentList(userId, reqQueryData);
            if (appointmentListResp.success) {
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
                let upcomingOrPastInfo = [];
                appointmentListResp.map(appointmentItem => {
                    const baCupOfDocInfoObj = doctorInfoMap.get(String(appointmentItem.doctor_id))
                    upcomingOrPastInfo.push({
                        appointmentResult: appointmentItem,
                        ...baCupOfDocInfoObj
                    });
                });
                if (this.state.selectedIndex === 0) {
                    upcomingOrPastInfo.sort((firstObj, secObj) => firstObj.appointmentResult.appointment_date < secObj.appointmentResult.appointment_date ? -1 : 0);
                    this.setState({
                        upComingData: upcomingOrPastInfo,
                        data: upcomingOrPastInfo,
                    });
                }
                else if (this.state.selectedIndex === 1) {
                    upcomingOrPastInfo.sort((firstObj, secObj) => firstObj.appointmentResult.appointment_date > secObj.appointmentResult.appointment_date ? -1 : 0);
                    this.setState({
                        pastData: upcomingOrPastInfo,
                        data: upcomingOrPastInfo,
                    });
                }
            }
            else {
                this.setState({});
            }
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
        this.incrementPaginationCount = 0;
        await this.setState({ selectedIndex: index, isLoading: true });
        if (index === 0 && !this.state.upComingData.length) {
            await this.getUpComingAppointmentList();
        } else if (index === 1 && !this.state.pastData.length) {
            await this.getPastAppointmentList();
        }
        else {
            await this.setState({ data: index === 0 ? this.state.upComingData : this.state.pastData });
        }
        this.setState({ isLoading: false });
    }

    onPressNavigateToInsertReviewPage(item, index) {
        this.setState({ isVisibleAddReviewPop: true, reviewData: item.appointmentResult })
    }

    insertReviewPopVisible = async (data) => {
        this.setState({ isVisibleAddReviewPop: false });
        if (data.updatedVisible == true) {
            this.incrementPaginationCount = 0;
            await this.getPastAppointmentList();
        }
    }
    onPressGoToBookAppointmentPage = () => {
        console.log('Need to Implement===>')
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


    renderFooter() {
        return (
            <View >
                {this.state.isLoadingMoreAppList ?
                    <ActivityIndicator animating={true}
                        size="large"
                        color="green" />
                    : null}
            </View>
        );
    }


    loadMoreData = async () => {
        try {
            this.isCalledScrollBegin = true;
            this.setState({ isLoadingMoreAppList: true });
            console.log('incrementPaginationCount===>', this.incrementPaginationCount)
            this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_APPOINTMENT_LIST;
            if (this.state.selectedIndex === 0) await this.getUpComingAppointmentList()
            else await this.getPastAppointmentList();
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
            <View style={{
                backgroundColor: "#ffffff",
                margin: 10
            }}>
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
                <View style={{ marginTop: 5 }}>
                    {isLoading == true ?
                        (
                            <Spinner
                                color="blue"
                                style={[styles.containers, styles.horizontal]}
                                visible={true}
                                size={"large"}
                                overlayColor="none"
                                cancelable={false}
                            />
                        ) :
                        (!data.length ? (
                            < RenderNoAppointmentsFounds text={"No Appointments are scheduled !"} />
                        ) :
                            (<FlatList
                                data={data}
                                extraData={data}
                                ListFooterComponent={this.renderFooter.bind(this)}
                                onEndReached={() => {
                                    if (!this.isCalledScrollBegin) {
                                        this.loadMoreData();
                                    }
                                }}
                                onEndReachedThreshold={0.5}
                                onMomentumScrollBegin={() => { this.isCalledScrollBegin = false; }}
                                renderItem={({ item, index }) => this.renderAppointmentList(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                            />)
                        )}
                    {/* <ActivityIndicator animating={true}
                        size="large"
                        color="green" />
                  */}
                </View>
                {isVisibleAddReviewPop === true ?
                    <InsertReview
                        props={this.props}
                        data={reviewData}
                        popupVisible={(data) => this.insertReviewPopVisible(data)}
                    />
                    : null}
            </View>
        )
    }
}

