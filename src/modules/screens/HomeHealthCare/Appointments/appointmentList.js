import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, ListItem, Card, Thumbnail, List, Item, Input, Left, Right, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, AsyncStorage, FlatList, ImageBackground, Alert, Linking } from 'react-native';
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
        }
    }
    async componentDidMount() {
        const isLoggedIn = await hasLoggedIn(this.props);
        if (!isLoggedIn) {
            this.props.navigation.navigate("login");
            return;
        }
        await this.getUpComingAppointmentList();
    }


    pageRefresh = async (navigationData) => {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/BACK' || navigationData.action.type === 'Navigation/NAVIGATE' || navigationData.action.type === 'Navigation/POP') {
                if (this.state.selectedIndex == 0) {
                    await this.getUpComingAppointmentList();
                } else {
                    await this.getPastAppointmentList();
                }
            }
        }

    }

    getUpComingAppointmentList = async () => {
        try {
            this.setState({ isLoading: true });
            const reqQueryData = {
                startDate: new Date().toISOString(),
                endDate: addTimeUnit(new Date(), 1, "years").toISOString(),
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
        finally {
            this.setState({ isLoading: false });
        }
    }

    getPastAppointmentList = async () => {
        try {
            this.setState({ isLoading: true })
            const reqQueryData = {
                startDate: subTimeUnit(new Date(), 1, "years").toISOString(),
                endDate: subTimeUnit(new Date(), 1, 'days').toISOString(),
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
        finally {
            this.setState({ isLoading: false });
        }
    }
    setUpComingAndPastDataListByCommon = async (reqQueryData) => {
        try {
            this.setState({ isLoading: true });
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
                this.setState({ data: [] });
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
        await this.setState({ selectedIndex: index });
        if (index === 0 && !this.state.upComingData.length) {
            await this.getUpComingAppointmentList();
        } else if (index === 1 && !this.state.pastData.length) {
            await this.getPastAppointmentList();
        }
        else {
            await this.setState({ data: index === 0 ? this.state.upComingData : this.state.pastData });
        }
    }

    onPressNavigateToInsertReviewPage(item, index) {
        this.setState({ isVisibleAddReviewPop: true, reviewData: item.appointmentResult })
    }

    insertReviewPopVisible = async (data) => {
        this.setState({ isVisibleAddReviewPop: false });
        if (data.updatedVisible == true) await this.getPastAppointmentList();
    }
    onPressGoToBookAppointmentPage = () => {
        console.log('Need to Implement===>')
    }
    renderAppointmentList(item, index) {
        return (
            <View>
                <RenderAppointmentList
                    appointmentData={{ item, index, selectedIndex: this.state.selectedIndex, navigation: this.props.navigation }}
                    onPressNavigateToInsertReviewPage={(item, index) => { this.onPressNavigateToInsertReviewPage(item, index) }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                // shouldUpdate={`${item}`}
                >
                </RenderAppointmentList>
            </View>
        )
    }


    render() {
        const { data, reviewData, selectedIndex, isVisibleAddReviewPop, isLoading } = this.state;
        return (
            <Container>
                <Content style={{ margin: 10 }}>
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
                                <FlatList
                                    data={data}
                                    renderItem={({ item, index }) => this.renderAppointmentList(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            )}
                        {isVisibleAddReviewPop === true ?
                            <InsertReview
                                props={this.props}
                                data={reviewData}
                                popupVisible={(data) => this.insertReviewPopVisible(data)}
                            />
                            : null}
                    </View>
                </Content>
            </Container>
        )
    }
}

