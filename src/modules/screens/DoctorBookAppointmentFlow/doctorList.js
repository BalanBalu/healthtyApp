import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import {
    SET_SINGLE_DOCTOR_ITEM_DATA,
    SET_FILTERED_DOCTOR_DATA,
    SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    searchByDocDetailsService,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    addFavoritesToDocByUserService,
    fetchDoctorAvailabilitySlotsService,
    serviceOfGetTotalActiveSponsorDetails4Doctors,
    serviceOfUpdateDocSponsorViewCountByUser,
    filterByDocDetailsService,
    serviceOfGetNextDayAVailabilityAndFeeDetails4Doctors
} from '../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, addTimeUnit, getMoment } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';

import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../setup/store';
import { RenderListNotFound, RenderNoSlotsAvailable } from '../CommonAll/components';
import { enumerateStartToEndDates, calculateDoctorUpdatedExperience, sortByPrimeDoctors } from '../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
import RenderDatesList from './RenderDateList'
import RenderSlots from './RenderSlots'
import RenderSponsorList from './RenderSponsorList';
import Spinner from '../../../components/Spinner'

let currentDoctorOrder = 'ASC';
const SHOW_NO_OF_PRIME_DOCTORS_COUNT_ON_SWIPER_LIST_VIEW = 2;
const CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT = 5;
const PAGINATION_COUNT_FOR_GET_DOCTORS_LIST = 5;
class DoctorList extends Component {
    weekWiseDatesList = [];
    docInfoAndAvailableSlotsMapByDoctorIdHostpitalId = new Map();
    selectedDate4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotIndex4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotItem4DocIdHostpitalIdToStoreInObj = {};
    showNoOfPrimeDoctorsListOnSwiperListViewArray = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            isLoadingNextWeekAvailabilitySlots: false,
            expandItemOfDocIdHospitalsToShowSlotsData: [],
            storeFeeBySelectedSlotOfDocIdHostpitalIdInObj: {},
            isLoggedIn: false,
            renderRefreshCount: 1,
            refreshCountOnDateFL: 1, // need to check
            isLoading: true,
            isLoadingDatesAndSlots: false,
            isLoadingMoreDocList: false,
            doctorInfoListAndSlotsData1: [],
        }
        this.conditionFromFilterPage = false,
            this.selectedDataFromFilterPage = null;
        this.incrementPaginationCount = 0,
            this.onEndReachedCalledDuringMomentum = true
        this.isRenderedPrimeDocsOnSwiperListView = false;
        this.onEndReachedIsTriggedFromRenderDateList = false;
    }
    navigateToFilters() {
        this.props.navigation.navigate("Filter Doctor Info", {
            filterData: this.selectedDataFromFilterPage,
        })
    }
    componentNavigationMount = async () => {
        try {
            //debugger
            const { navigation } = this.props;
            this.selectedDataFromFilterPage = navigation.getParam('filterData');
            //debugger
            if (this.selectedDataFromFilterPage) {
                //debugger
                this.conditionFromFilterPage = navigation.getParam('conditionFromFilterPage');
                if (this.conditionFromFilterPage) {
                    this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.clear();
                    //debugger
                    this.setState({ isLoading: true });
                    this.searchByDoctorDetails();
                    this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
                    //debugger
                }
            }
            //debugger
        }
        catch (Ex) {
            console.log('Ex is getting on Filter by Doctor details ===>', Ex.message);
        }
        // finally {
        //     this.setState({ isLoading: false });
        // }

    }

    searchByDoctorDetails = async () => {
        try {
            // debugger
            console.log("calling Api pagination COUNT====>", this.incrementPaginationCount);
            const locationDataFromSearch = this.props.navigation.getParam('locationDataFromSearch');
            const inputKeywordFromSearch = this.props.navigation.getParam('inputKeywordFromSearch');
            let docListResponse;
            if (this.conditionFromFilterPage) {
                //debugger
                this.selectedDataFromFilterPage.locationData = locationDataFromSearch;
                docListResponse = await filterByDocDetailsService(this.selectedDataFromFilterPage);
                //debugger
            }
            else {
                docListResponse = await searchByDocDetailsService(locationDataFromSearch, inputKeywordFromSearch, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_DOCTORS_LIST);
            }
            //debugger
            // console.log('docListResponse====>', JSON.stringify(docListResponse));
            if (docListResponse.success) {
                //debugger
                this.incrementPaginationCount = this.incrementPaginationCount + 5;
                const searchedDoctorIdsArray = [];
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    const doctorIdHostpitalId = item.doctor_id + '-' + item.hospitalInfo.hospital_id;
                    /** calculate Doctor Experience using  Updated  data   **/
                    if (!this.conditionFromFilterPage) {
                        item.calculatedExperience = calculateDoctorUpdatedExperience(item.experience);
                    }
                    if (!searchedDoctorIdsArray.includes(item.doctor_id)) {
                        searchedDoctorIdsArray.push(item.doctor_id)
                    }
                    item.doctorIdHostpitalId = doctorIdHostpitalId;
                    this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, item);
                })
                //debugger
                const [activeDoctorsSponsorDetails, DocFeeAndNextAvailability, docsFavoriteDetails, docsReviewDetails] = await Promise.all([
                    serviceOfGetTotalActiveSponsorDetails4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                    serviceOfGetNextDayAVailabilityAndFeeDetails4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                    ServiceOfGetDoctorFavoriteListCount4Pat(searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                const activeDoctorsSponsorData = activeDoctorsSponsorDetails.data;
                if (activeDoctorsSponsorData) {
                    const sponsorIdsArray = [];
                    activeDoctorsSponsorData.map((sponsorItem) => {
                        sponsorIdsArray.push(sponsorItem._id);
                        const hospitalId = sponsorItem.location[0] && sponsorItem.location[0].hospital_id;
                        const doctorIdHostpitalId = sponsorItem.doctor_id + '-' + hospitalId;
                        if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.has(doctorIdHostpitalId)) {
                            const baCupDocHospitalIdItemObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId)
                            if (this.showNoOfPrimeDoctorsListOnSwiperListViewArray.length < SHOW_NO_OF_PRIME_DOCTORS_COUNT_ON_SWIPER_LIST_VIEW) {
                                baCupDocHospitalIdItemObj.isDoctorIdHostpitalIdSponsored = true;
                                this.showNoOfPrimeDoctorsListOnSwiperListViewArray.push(baCupDocHospitalIdItemObj)
                                this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, baCupDocHospitalIdItemObj)
                            } else {
                                baCupDocHospitalIdItemObj.isPrimeDoctorOnNormalCardView = true;
                                this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, baCupDocHospitalIdItemObj)
                            }
                        }
                    });
                    this.updateDocSponsorViewersCountByUser(sponsorIdsArray);
                }
                const DocFeeAndNextAvailabilityData = DocFeeAndNextAvailability.data;
                // debugger
                if (DocFeeAndNextAvailabilityData.length) {
                    // debugger
                    DocFeeAndNextAvailabilityData.map((slotItem) => {
                        const doctorIdHostpitalId = slotItem.doctorIdHostpitalId;
                        if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.has(doctorIdHostpitalId)) {
                            const baCupDocHospitalIdItemObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId)
                            baCupDocHospitalIdItemObj.fee = slotItem.fee;
                            baCupDocHospitalIdItemObj.feeWithoutOffer = slotItem.feeWithoutOffer;
                            baCupDocHospitalIdItemObj.nextAvailableDateAndTime = slotItem.startAndEndTimeCal && slotItem.startAndEndTimeCal.slotStartDateAndTime;
                            this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, baCupDocHospitalIdItemObj)
                        }
                    })
                }
                // debugger
                let doctorInfoList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values()) || [];
                //debugger
                // doctorInfoList.sort(sortByPrimeDoctors);
                // console.log('doctorInfoList========>', JSON.stringify(doctorInfoList));
                ////debugger
                // this.setState({ doctorInfoListAndSlotsData1: doctorInfoList })
                store.dispatch({
                    type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                    data: doctorInfoList
                })
            }
            debugger
        } catch (Ex) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
    }

    async componentDidMount() {
        try {
            console.log('calling componentDidMount====>');
            this.setState({ isLoading: true });
            const userId = await AsyncStorage.getItem('userId');
            await this.searchByDoctorDetails();
            if (userId) {
                //     this.getFavoriteCounts4PatByUserId(userId);
                this.setState({ isLoggedIn: true })
            }
        } catch (error) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false });
        }
    }
    // getFavoriteCounts4PatByUserId = (userId) => {
    //     try {
    //         getFavoriteListCount4PatientService(userId);
    //     } catch (Ex) {
    //         console.log('Ex is getting on get Favorites details for Patient====>', Ex)
    //         return {
    //             success: false,
    //             statusCode: 500,
    //             error: Ex,
    //             message: `Exception while getting on Favorites for Patient : ${Ex}`
    //         }
    //     }
    // }

    render() {
        // console.log('RENDERING====>');
        const { bookAppointmentData: { doctorInfoListAndSlotsData, filteredDoctorData } } = this.props;
        const { isLoading, isLoadingMoreDocList, doctorInfoListAndSlotsData1
        } = this.state;
        const { height, width } = Dimensions.get('window');
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
                <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                    <Row style={{ height: 35, alignItems: 'center' }}>
                        <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, justifyContent: 'center' }} onPress={() => this.sortByTopRatings(filteredDoctorData)}>
                            <Col size={2.0} >
                                <Icon name='ios-arrow-dropdown-circle' style={{ color: 'gray', fontSize: 24 }} />
                            </Col>
                            <Col size={8.0} style={{ justifyContent: 'center' }}>
                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center' }}>Top Rated </Text>
                            </Col>
                        </Col>
                        <Col size={5} style={{ flexDirection: 'row', borderLeftColor: '#909090', borderLeftWidth: 1, justifyContent: 'center' }} onPress={() => this.navigateToFilters()}>

                            <Col size={8.0} style={{ justifyContent: 'center' }}>
                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginLeft: 10, width: '100%', textAlign: 'center' }}>Filters </Text>
                            </Col>
                            <Col size={2.0} style={{ marginLeft: 5 }}>
                                <Icon name='ios-funnel' style={{ color: 'gray', fontSize: 25 }} />
                            </Col>
                        </Col>
                    </Row>
                </Card>
                {isLoading ? <Loader style='list' /> :
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}   >
                        <View>
                            {doctorInfoListAndSlotsData.length === 0 ? <RenderListNotFound text={' No Doctor list found!'} />
                                :
                                <View>
                                    <View style={{ borderBottomColor: '#B6B6B6', borderBottomWidth: 0.5, paddingBottom: 8 }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10 }}>Recommended <Text style={{ color: '#775DA3', fontFamily: 'OpenSans', fontSize: 12 }}>Prime Doctors</Text> in Hearing Specialist near you</Text>
                                    </View>
                                    <FlatList
                                        data={doctorInfoListAndSlotsData}
                                        // extraData={this.state.renderRefreshCount}
                                        onMomentumScrollBegin={() => { this.onEndReachedCalledWhenScrollBegin = false }}
                                        onEndReachedThreshold={0.5}
                                        // onEndReachedThreshold={doctorInfoListAndSlotsData.length < 5 ? 0.5 : 2}
                                        // initialNumToRender={10}
                                        onEndReached={() => {
                                            console.log('calling onEndReached===>',
                                                this.onEndReachedCalledDuringMomentum)
                                            if (!this.conditionFromFilterPage) {
                                                this.loadMoreData();
                                            }
                                            // if (!this.onEndReachedCalledDuringMomentum) {
                                            //     alert('calling scroll begin===>' +
                                            //         this.onEndReachedCalledDuringMomentum);
                                            //     this.loadMoreData();    // LOAD MORE DATA
                                            //     this.onEndReachedCalledDuringMomentum = true;
                                            // }
                                        }}
                                        renderItem={this.renderMainItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    // ListFooterComponent={this.renderFooterComponent}
                                    />
                                </View>}
                        </View>
                    </ScrollView>
                }
                {isLoadingMoreDocList ?
                    <ActivityIndicator
                        style={{
                            marginBottom: 6
                        }}
                        animating={isLoadingMoreDocList}
                        size="large"
                        color='blue'
                    />
                    : null}

            </Container>
        )
    }


    renderMainItem = ({ item, index }) => {
        /* Render Prime Doctor Cards   */
        if (item.isDoctorIdHostpitalIdSponsored === true && this.isRenderedPrimeDocsOnSwiperListView === false) {
            ////debugger
            return (
                <View >
                    <FlatList
                        horizontal={true}
                        data={this.showNoOfPrimeDoctorsListOnSwiperListViewArray}
                        renderItem={({ item, index }) => { return this.renderDoctorSponsorListCards(item, index) }}
                    />
                </View>
            );
        }
        /*  Render Normal Doctor cards   */
        if (item.isDoctorIdHostpitalIdSponsored !== true) {
            return this.renderDoctorCard(item, index);
        }
    }
    loadMoreData = async () => {
        try {
            alert('calling loadMoreData====>')
            this.setState({ isLoadingMoreDocList: true });
            await this.searchByDoctorDetails();
            if (this.showNoOfPrimeDoctorsListOnSwiperListViewArray.length === 2) {
                this.isRenderedPrimeDocsOnSwiperListView = false;
            }
        } catch (error) {
            console.log("Ex is getting on load more doctor ist data", error.message);
        }
        finally {
            this.setState({ isLoadingMoreDocList: false })
        }
    }
    updateDocSponsorViewersCountByUser = async (sponsorIds) => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            if (!userId) userId = "NO_USER"
            const sponsorIdsObj = {
                sponsorIds
            }
            await serviceOfUpdateDocSponsorViewCountByUser(userId, sponsorIdsObj);
        } catch (ex) {
            console.log('Ex getting on updateDocSponsorViewersCountByUser service======', ex.message);
        }
    }
    /* Update Favorites for Doctor by UserId  */
    addToFavoritesList = async (doctorId) => {
        const userId = await AsyncStorage.getItem('userId');
        await addFavoritesToDocByUserService(userId, doctorId);
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    /*   navigate to next further process    */
    onPressToContinue4PaymentReview = async (doctorData, selectedSlotItemByDoctor, doctorIdHostpitalId) => {
        if (!selectedSlotItemByDoctor) {
            Toast.show({
                text: 'Please Select a Slot to continue booking',
                type: 'warning',
                duration: 3000
            })
            return;
        }
        doctorData.doctorName = doctorData.first_name + ' ' + doctorData.last_name;
        doctorData.doctorId = doctorData.doctor_id;
        const confirmSlotDetails = { ...doctorData, slotData: selectedSlotItemByDoctor };
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
    }
    onSlotItemPress(doctorIdHostpitalId, item, index) {
        debugger
        const { storeFeeBySelectedSlotOfDocIdHostpitalIdInObj } = this.state;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = index;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = item
        debugger
        if ((item.fee != storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId])) {
            debugger
            if (storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId] != undefined) {
                Toast.show({
                    text: 'Appointment Fee Updated',
                    type: 'warning',
                    duration: 3000
                });
            }
            debugger
            storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId] = item.fee
            this.setState({ storeFeeBySelectedSlotOfDocIdHostpitalIdInObj });
            debugger
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
        debugger
    }

    onPressGoToBookAppointmentPage(doctorItemData) {
        doctorItemData.doctorId = doctorItemData.doctor_id;
        let reqDocBookAppointmentData = { ...doctorItemData }
        store.dispatch({
            type: SET_SINGLE_DOCTOR_ITEM_DATA,
            data: reqDocBookAppointmentData
        })
        this.props.navigation.navigate('Book Appointment', { doctorId: doctorItemData.doctor_id, processedAvailabilityDates: this.weekWiseDatesList })
    }

    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctorIdHostpitalId, item) {
        debugger
        if (selectedSlotData) {
            // debugger
            selectedSlotIndex = this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] || 0;
            if (selectedSlotData === undefined) {
                selectedSlotData = wholeSlotData[Object.keys(wholeSlotData)[0]]
            }
            const selectedIndex = selectedSlotData[selectedSlotIndex] ? selectedSlotIndex : 0;
            const selectedSlotFee = selectedSlotData[selectedIndex].fee;
            const selectedSlotFeeWithoutOffer = selectedSlotData[selectedIndex].feeWithoutOffer;

            return {
                fee: selectedSlotFee,
                feeWithoutOffer: selectedSlotFeeWithoutOffer
            }
        }
        else {
            if (item.fee) {
                return {
                    fee: item.fee,
                    feeWithoutOffer: item.feeWithoutOffer
                }
            }
            else { return {} }
        }
    }

    getNextAvailableDateAndTime = (selectedSlotData, item) => {
        if (selectedSlotData) {
            const startTime = moment(selectedSlotData[0].slotStartDateAndTime).format('h:mm a');
            const endTime = moment(selectedSlotData[selectedSlotData.length - 1].slotEndDateAndTime).format('h:mm a');
            return 'Available ' + startTime + ' - ' + endTime;
        } else {
            if (item.nextAvailableDateAndTime) {
                const availableOn = moment(item.nextAvailableDateAndTime).format('ddd, DD MMM YY');
                return 'Available On ' + availableOn;
            }
            else {
                return 'No Slots available';
            }
        }
    }

    getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService = indexOfItem => {
        const { bookAppointmentData: { doctorInfoListAndSlotsData } } = this.props;
        const orderedDataFromWholeData = doctorInfoListAndSlotsData.slice(indexOfItem, indexOfItem + CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT)
        return orderedDataFromWholeData || []
    }
    /* get Doctor  Availability Slots service */
    getDoctorAvailabilitySlots = async (doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem) => {
        try {
            ////debugger
            this.weekWiseDatesList = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.weekWiseDatesList);
            const orderedDataFromWholeData = this.getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService(indexOfItem) // get 5 Or LessThan 5 of doctorIdHostpitalIds in order wise using index of given input of doctorInfoListAndSlotsData
            ////debugger
            const setDoctorIdHostpitalIdsArrayMap = new Map();
            orderedDataFromWholeData.map((item) => {
                const doctorIdFromItem = item.doctor_id;
                const hospitalIdFromItem = item.hospitalInfo && item.hospitalInfo.hospital_id;
                if (setDoctorIdHostpitalIdsArrayMap.has(doctorIdFromItem)) {  //Execute condition  when Doctor Id is repeated;
                    let baCupDocHospitalIdsObj = setDoctorIdHostpitalIdsArrayMap.get(doctorIdFromItem);
                    const obj = {
                        doctorId: doctorIdFromItem,
                        hospitalIds: [...baCupDocHospitalIdsObj.hospitalIds, hospitalIdFromItem]
                    }
                    setDoctorIdHostpitalIdsArrayMap.set(doctorIdFromItem, obj)
                }
                else {
                    setDoctorIdHostpitalIdsArrayMap.set(doctorIdFromItem, {
                        doctorId: doctorIdFromItem,
                        hospitalIds: [hospitalIdFromItem]
                    })
                }
            })
            const reqData4Availability = Array.from(setDoctorIdHostpitalIdsArrayMap.values()) || [];
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchDoctorAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            if (resultSlotsData.success) {
                const availabilitySlotsData = resultSlotsData.data;
                if (availabilitySlotsData.length != 0) {
                    this.setDoctorAvailabilitySlotsDataByDocAndHospitalIds(availabilitySlotsData || []);
                    const docInfoAndAvailableSlotsMap = Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values());
                    store.dispatch({
                        type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                        data: docInfoAndAvailableSlotsMap
                    })
                    // this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
                }
            }
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }
    /*  Set Doctor Availability Slots data by doctorIdHostpitalIds   */
    setDoctorAvailabilitySlotsDataByDocAndHospitalIds = (SourceOfSlotsDataArray) => {
        SourceOfSlotsDataArray.map((item) => {
            const baCupOfDocInfo = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(item.doctorIdHostpitalId);
            const finalSlotsDataObj = { ...baCupOfDocInfo.slotData, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            delete baCupOfDocInfo.slotData
            const finalDocAndAvailabilityObj = {
                ...baCupOfDocInfo, slotData: finalSlotsDataObj
            }
            this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(item.doctorIdHostpitalId, finalDocAndAvailabilityObj)
        });
    }



    sortByTopRatings(filteredDoctorData) {
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = this.props;
        filteredData = filteredDoctorData.sort(function (a, b) {
            let ratingA = 0;
            let ratingB = 0;
            if (docReviewListCountOfDoctorIDs[a.doctor_id]) {
                ratingA = docReviewListCountOfDoctorIDs[a.doctor_id].average_rating || 0
            };
            if (docReviewListCountOfDoctorIDs[b.doctor_id]) {
                ratingB = docReviewListCountOfDoctorIDs[b.doctor_id].average_rating || 0
            }
            if (a.primeDocOnNonPrimeList === true || b.primeDocOnNonPrimeList) {
                return ratingB - ratingA;
            }
            if (currentDoctorOrder === 'ASC') {
                return ratingB - ratingA;
            } else if (currentDoctorOrder === 'DESC') {
                return ratingA - ratingB;
            }
        });
        store.dispatch({
            type: SET_FILTERED_DOCTOR_DATA,
            data: filteredData
        })
        if (currentDoctorOrder === 'ASC') {
            currentDoctorOrder = 'DESC';
        } else if (currentDoctorOrder === 'DESC') {
            currentDoctorOrder = 'ASC';
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }



    renderDoctorSponsorListCards(item) {
        this.isRenderedPrimeDocsOnSwiperListView = true;
        const { currentDate } = this.state;
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || currentDate], item.slotData, item.doctorIdHostpitalId, item)
        return (
            <View>
                <RenderSponsorList
                    item={item}
                    docInfoData={{ fee, feeWithoutOffer, docReviewListCountOfDoctorIDs }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                // shouldUpdate4ReRender={`${item.doctor_id}-${item.doctor_id}`}
                >
                </RenderSponsorList>
            </View>
        )
    }
    renderDoctorInformationCard(item) {
        const { isLoggedIn, currentDate } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || currentDate], item.slotData, item.doctorIdHostpitalId, item)
        return (
            <View>
                <RenderDoctorInfo
                    item={item}
                    docInfoData={{ isLoggedIn, fee, feeWithoutOffer, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }}
                    addToFavoritesList={(doctorId) => { this.addToFavoritesList(doctorId) }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                // shouldUpdate4ReRender={`${item.doctor_id}-${item.doctor_id}`}
                >
                </RenderDoctorInfo>
            </View>
        )
    }

    renderAvailableSlots(doctorIdHostpitalId, slotData) {
        debugger
        selectedSlotIndex = this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] !== undefined ? this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] : -1;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        debugger
        return (
            <View>
                <RenderSlots
                    selectedDate4DocIdHostpitalIdToStoreInObj={this.selectedDate4DocIdHostpitalIdToStoreInObj}
                    selectedSlotItem4DocIdHostpitalIdToStoreInObj={this.selectedSlotItem4DocIdHostpitalIdToStoreInObj}
                    slotDetails={{ slotData, selectedSlotIndex, doctorIdHostpitalId }}
                    // shouldUpdate={`${doctorIdHostpitalId}-${selectedSlotIndex}`}
                    onSlotItemPress={(doctorIdHostpitalId, selectedSlot, selectedSlotItemIndex) => this.onSlotItemPress(doctorIdHostpitalId, selectedSlot, selectedSlotItemIndex)}
                >
                </RenderSlots>
            </View>
        )
    }


    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, doctorIdHostpitalId, indexOfItem) {
        this.onEndReachedIsTriggedFromRenderDateList = false

        this.selectedDate4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = selectedDate;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = -1;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = null;
        if (this.weekWiseDatesList.includes(selectedDate) === false) {
            const endDateByMoment = addMoment(getMoment(selectedDate), 7, 'days');
            this.getDoctorAvailabilitySlots(doctorIdHostpitalId, getMoment(selectedDate), endDateByMoment, indexOfItem);
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
        // debugger

    }
    callSlotsServiceWhenOnEndReached = (doctorIdHostpitalId, weekWiseDatesList, indexOfItem) => { // call availability slots service when change dates on next week
        // debugger
        this.onEndReachedIsTriggedFromRenderDateList = true;
        const finalIndex = weekWiseDatesList.length
        const lastProcessedDate = weekWiseDatesList[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.weekWiseDatesList.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            this.getDoctorAvailabilitySlots(doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem);
        }
    }
    renderDatesOnFlatList(doctorIdHostpitalId, slotData, indexOfItem) {
        // debugger
        const selectedDate = this.selectedDate4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] || this.state.currentDate;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        // debugger

        return (
            <View>
                <RenderDatesList
                    selectedDate={selectedDate}
                    slotData={slotData}
                    indexOfItem={indexOfItem}
                    doctorIdHostpitalId={doctorIdHostpitalId}
                    selectedDate4DocIdHostpitalIdToStoreInObj={this.selectedDate4DocIdHostpitalIdToStoreInObj}
                    selectedSlotItem4DocIdHostpitalIdToStoreInObj={this.selectedSlotItem4DocIdHostpitalIdToStoreInObj}
                    weekWiseDatesList={this.weekWiseDatesList}
                    onDateChanged={(item, doctorIdHostpitalId, indexOfItem) => { this.onDateChanged(item, doctorIdHostpitalId, indexOfItem) }}
                    callSlotsServiceWhenOnEndReached={(doctorIdHostpitalId, weekWiseDatesList, indexOfItem) => {
                        this.callSlotsServiceWhenOnEndReached(doctorIdHostpitalId, weekWiseDatesList, indexOfItem);
                    }}
                    shouldUpdate={`${doctorIdHostpitalId}-${selectedDate}`}
                    onEndReachedIsTriggedFromRenderDateList={this.onEndReachedIsTriggedFromRenderDateList}
                >
                </RenderDatesList>
            </View>
        )
    }

    onBookPress = async (doctorIdHostpitalId, indexOfItem) => {
        try {
            this.onEndReachedIsTriggedFromRenderDateList = false;
            this.setState({ isLoadingDatesAndSlots: true, isLoadingDatesAndSlotsByRespectedItem: doctorIdHostpitalId });
            const { expandItemOfDocIdHospitalsToShowSlotsData } = this.state;
            if (expandItemOfDocIdHospitalsToShowSlotsData.indexOf(doctorIdHostpitalId) !== -1) {
                expandItemOfDocIdHospitalsToShowSlotsData.splice(expandItemOfDocIdHospitalsToShowSlotsData.indexOf(doctorIdHostpitalId), 1)
            } else {
                expandItemOfDocIdHospitalsToShowSlotsData.push(doctorIdHostpitalId);
            }
            const startDateByMoment = addMoment(this.state.currentDate)
            const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
            if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId).slotData == undefined) {
                await this.getDoctorAvailabilitySlots(doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem);
            }
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
        catch (Ex) {
            console.log('Ex is getting on when Pressed BOOK button in Doctor list :', Ex);
        }
        finally {
            this.setState({ isLoadingDatesAndSlots: false });
        }
    }

    renderDoctorCard(item, indexOfItem) {
        const { currentDate, expandItemOfDocIdHospitalsToShowSlotsData, isLoadingDatesAndSlots } = this.state;
        return (
            <View>
                <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                    <List style={{ borderBottomWidth: 0 }}>
                        <ListItem>
                            <Grid >
                                {this.renderDoctorInformationCard(item)}
                                <Row style={{ borderTopColor: '#000', borderTopWidth: 0.4, marginTop: 5 }} >
                                    <Col style={{ width: "5%" }}>
                                        <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />
                                    </Col>
                                    <Col style={{ width: "80%" }}>
                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}> {this.getNextAvailableDateAndTime(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || currentDate], item)}</Text>
                                    </Col>
                                    <Col style={{ width: "15%" }}>
                                        {!expandItemOfDocIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId, indexOfItem)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity> :
                                            null}
                                        {this.state.isLoadingDatesAndSlotsByRespectedItem == item.doctorIdHostpitalId ?
                                            isLoadingDatesAndSlots == true ?
                                                <View style={{ marginTop: 6 }}>
                                                    <ActivityIndicator
                                                        animating={isLoadingDatesAndSlots}
                                                        size="large"
                                                        color='green'
                                                    />
                                                </View>
                                                : null
                                            : null}
                                    </Col>
                                </Row>
                                {expandItemOfDocIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?
                                    item.slotData ?
                                        <View>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date and time</Text>
                                            </Row>
                                            {this.renderDatesOnFlatList(item.doctorIdHostpitalId, item.slotData, indexOfItem)}
                                            {
                                                item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || this.state.currentDate] !== undefined ?
                                                    this.renderAvailableSlots(item.doctorIdHostpitalId, item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || this.state.currentDate])
                                                    : <RenderNoSlotsAvailable
                                                        text={'No Slots Available'}
                                                    />
                                            }
                                            <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        <Text style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                        <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] ? formatDate(this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                    </Col>
                                                    <Col size={4}>
                                                        <TouchableOpacity
                                                            onPress={() => { console.log('......Pressing....'); this.onPressToContinue4PaymentReview(item, this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId], item.doctorIdHostpitalId) }}
                                                            style={{ backgroundColor: 'green', borderColor: '#000', height: 30, borderRadius: 20, justifyContent: 'center', marginLeft: 5, marginRight: 5, marginTop: -5 }}>
                                                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>Continue </Text>
                                                        </TouchableOpacity>
                                                    </Col>
                                                </Row>
                                            </View>
                                        </View> : null
                                    : null}
                            </Grid>
                        </ListItem>
                    </List>
                </Card>
            </View>
        )
    }

}


const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(DoctorList)
const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    slotDefaultBgColor: {

        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5


    },
    slotDefaultTextColor: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'

    },
    slotBookedBgColor: {

        backgroundColor: '#A9A9A9', //'#775DA3',
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginLeft: 5


    },
    slotSelectedBgColor: {

        backgroundColor: '#775DA3',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 6,
        justifyContent: 'center',
        marginLeft: 5



    },
    slotBookedTextColor: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'OpenSans',
        textAlign: 'center'
    },
    slotBookedBgColorFromModal: {
        backgroundColor: '#878684',
        borderRadius: 5,

        height: 30,

    },
    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,

        height: 30,

    },
    slotSelectedBg: {
        backgroundColor: '#808080',
        borderRadius: 5,
        height: 30,

    },
    availabilityBG: {
        textAlign: 'center',
        borderColor: '#000',
        marginTop: 10,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },

});