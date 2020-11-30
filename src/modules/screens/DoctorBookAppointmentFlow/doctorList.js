import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from '../CommonAll/styles'
import {
    SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
    SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
    searchByDocDetailsService,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    addFavoritesToDocByUserService,
    fetchDoctorAvailabilitySlotsService,
    serviceOfUpdateDocSponsorViewCountByUser,
    getFavoriteListCount4PatientService,
} from '../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, getMoment } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../setup/store';
import { RenderListNotFound, RenderNoSlotsAvailable } from '../CommonAll/components';
import { enumerateStartToEndDates, sortByPrimeDoctors } from '../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
import RenderDatesList from './RenderDateList'
import RenderSlots from './RenderSlots'
let currentDoctorOrder = 'ASC';

const CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT = 5;
const PAGINATION_COUNT_FOR_GET_DOCTORS_LIST = 8;
class DoctorList extends Component {
    weekWiseDatesList = [];
    docInfoAndAvailableSlotsMapByDoctorIdHostpitalId = new Map();
    selectedDate4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotIndex4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotItem4DocIdHostpitalIdToStoreInObj = {};
    totalSearchedDoctorIdsArray = [];
    hospitalAndDoctorIdsArray = [];  // for remove avoid the sponsors doctors with hospital list duplication
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
        }
        this.conditionFromFilterPage = false,
            this.isEnabledLoadMoreData = true;
        this.selectedDataFromFilterPage = null;
        this.incrementPaginationCount = 0;
        this.onEndReachedIsTriggedFromRenderDateList = false;
        this.isRenderedTopRatedDocList = false;
    }
    navigateToFilters() {
        this.props.navigation.navigate("Filter Doctor Info", {
            filterData: this.selectedDataFromFilterPage,
        })
    }
    componentNavigationMount = async () => {
        try {
            const { navigation } = this.props;
            this.selectedDataFromFilterPage = navigation.getParam('filterData');
            this.conditionFromFilterPage = navigation.getParam('conditionFromFilterPage');
            const { bookAppointmentData: { getPreviousDocListWhenClearFilter } } = this.props;
            if (this.conditionFromFilterPage && getPreviousDocListWhenClearFilter) {  //Call Initial search service  when clear the Filter data from filter page
                await this.callInitialSearchOrFilterServiceWithClearedData(true);
            }
            else if (this.conditionFromFilterPage && this.selectedDataFromFilterPage && !getPreviousDocListWhenClearFilter) {  // Call Filter service when have selected filtered data from Filter Page
                await this.callInitialSearchOrFilterServiceWithClearedData();
            }
        }
        catch (Ex) {
            console.log('Ex is getting on Filter by Doctor details ===>', Ex.message);
        }
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true });
            await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props
            const userId = await AsyncStorage.getItem('userId');
            /** Passing ActiveSponsor is TRUE Or FALSE values on Params **/
            await this.callSearchAndFilterServiceWithActiveSponsorTrueAndFalse();// multiple times services call
            if (userId) {
                await this.getFavoriteCounts4PatByUserId(userId);
                this.setState({ isLoggedIn: true })
            }
        } catch (Ex) {
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
    callInitialSearchOrFilterServiceWithClearedData = async (conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond) => {
        this.setState({ isLoading: true });
        if (conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond) {
            this.props.navigation.setParams({ 'conditionFromFilterPage': false });
            this.conditionFromFilterPage = false;
        }
        this.isEnabledLoadMoreData = true;
        this.incrementPaginationCount = 0;
        this.onEndReachedIsTriggedFromRenderDateList = false;
        this.totalSearchedDoctorIdsArray = [];
        this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.clear();
        await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props;
        /** Passing ActiveSponsor is TRUE Or FALSE values on Params **/
        await this.callSearchAndFilterServiceWithActiveSponsorTrueAndFalse();// multiple times services call
        this.setState({ isLoading: false, renderRefreshCount: this.state.renderRefreshCount + 1 })
    }

    callSearchAndFilterServiceWithActiveSponsorTrueAndFalse = async () => {
        await Promise.all([
            this.searchByDoctorDetails(true).catch(Ex => console.log('Ex is getting on get Doctor details by search service call using Active Sponsor TRUE====>', Ex.message)),
            this.searchByDoctorDetails(false).catch(Ex => console.log('Ex is getting on get Doctor details by search service call using Active Sponsor FALSE====>', Ex.message)),
        ]);

    }

    dispatchAndCResetOfRattingAndFavorites = async () => {
        await store.dispatch(
            {
                type: SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
                data: {}
            },
        );
        await store.dispatch(
            {
                type: SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
                data: {}
            },
        );
        await store.dispatch({
            type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
            data: []
        });
    }
    searchByDoctorDetails = async (activeSponsor) => {
        try {
            const locationDataFromSearch = this.props.navigation.getParam('locationDataFromSearch');
            const inputKeywordFromSearch = this.props.navigation.getParam('inputKeywordFromSearch');
            const { bookAppointmentData: { getPreviousDocListWhenClearFilter } } = this.props;
            let type;
            let reqData4ServiceCall = {
                locationData: locationDataFromSearch
            }
            if (!this.conditionFromFilterPage && inputKeywordFromSearch) reqData4ServiceCall.inputText = inputKeywordFromSearch;

            if (this.conditionFromFilterPage && !getPreviousDocListWhenClearFilter) {
                type = 'filter';
                reqData4ServiceCall = { ...reqData4ServiceCall, ...this.selectedDataFromFilterPage }
            }
            else if (!inputKeywordFromSearch) {
                type = 'location'
            }
            else {
                type = 'search';
            }
            // console.log('type=====>', type);
            // console.log('reqData4ServiceCall=====>', JSON.stringify(reqData4ServiceCall))
            const docListResponse = await searchByDocDetailsService(type, activeSponsor, reqData4ServiceCall, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_DOCTORS_LIST);
            // console.log('docListResponse====>', JSON.stringify(docListResponse));
            if (docListResponse.success) {
                if (!activeSponsor) {
                    this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_DOCTORS_LIST;
                }
                const searchedDoctorIdsArray = [];
                const activeSponsorDocIdsArry = [];
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    item.specialist = item.specialistInfo;
                    delete item.specialistInfo;
                    const doctorIdHostpitalId = item.hospitalInfo.doctorIdHostpitalId;
                    item.doctorIdHostpitalId = doctorIdHostpitalId;
                    if (!this.totalSearchedDoctorIdsArray.includes(item.doctor_id)) {
                        searchedDoctorIdsArray.push(item.doctor_id);
                        this.totalSearchedDoctorIdsArray.push(item.doctor_id)
                    }
                    if (activeSponsor && item.is_doctor_sponsor) {
                        this.hospitalAndDoctorIdsArray.push(String(doctorIdHostpitalId));
                        if (!activeSponsorDocIdsArry.includes(item.doctor_id)) {
                            activeSponsorDocIdsArry.push(item.doctor_id)
                        }
                    }
                    if (!activeSponsor && this.hospitalAndDoctorIdsArray && this.hospitalAndDoctorIdsArray.includes(String(doctorIdHostpitalId))) {
                        console.log('Removing duplicate Doctor with hosital  item ====>')
                    }
                    else {
                        this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, item);

                    }
                })
                await Promise.all([
                    ServiceOfGetDoctorFavoriteListCount4Pat(searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                if (activeSponsor) {
                    this.updateDocSponsorViewersCountByUser(activeSponsorDocIdsArry);
                }
                let doctorInfoList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values()) || [];
                doctorInfoList.sort(sortByPrimeDoctors);  // Sort by active Sponsors list in TOP
                if (!activeSponsor && docListData.length <= 3) {
                    this.isEnabledLoadMoreData = false;
                }
                store.dispatch({
                    type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                    data: doctorInfoList
                });
                if (!this.conditionFromFilterPage) {
                    store.dispatch({
                        type: BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
                        data: doctorInfoList
                    })
                }
            }
            else {
                if (!activeSponsor) this.isEnabledLoadMoreData = false;
                if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.size > 7) {
                    Toast.show({
                        text: 'No more Doctors Available!',
                        duration: 4000,
                        type: "success"
                    })
                }
            }
        } catch (Ex) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
    }

    getFavoriteCounts4PatByUserId = async (userId) => {
        try {
            await getFavoriteListCount4PatientService(userId);
        } catch (Ex) {
            console.log('Ex is getting on get Favorites details for Patient====>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Favorites for Patient : ${Ex}`
            }
        }
    }
    setDocListByPreviousOrder() {
        let docList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values()) || [];
        docList.sort(sortByPrimeDoctors);  // Sort by active Sponsors list in TOP
        return docList || [];
    }
    render() {
        const { bookAppointmentData: { doctorInfoListAndSlotsData, } } = this.props;
        const { isLoading, isLoadingMoreDocList } = this.state;
        if (isLoading) return <Loader style='list' />;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
                <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                    <Row style={{ height: 35, alignItems: 'center' }}>
                        <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, justifyContent: 'center' }} onPress={() => this.sortByTopRatings(doctorInfoListAndSlotsData)}>
                            <Col size={2.0} >
                                <MaterialIcons name={this.isRenderedTopRatedDocList ? 'reply'
                                    : 'keyboard-arrow-down'} style={{ color: 'gray', fontSize: 24 }} />
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
                {doctorInfoListAndSlotsData.length ?
                    <FlatList

                        scrollEventThrottle={26}
                        data={doctorInfoListAndSlotsData}
                        onEndReachedThreshold={doctorInfoListAndSlotsData.length <= 3 ? 2 : 0.5}
                        onEndReached={() => {
                            if (this.isEnabledLoadMoreData) {
                                this.loadMoreData();
                            }
                        }}
                        renderItem={({ item, index }) => this.renderDoctorCard(item, index)
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                    : <RenderListNotFound text={this.conditionFromFilterPage ? 'Doctors Not found!..Choose Filter again' : ' No Doctor list found!'} />

                }
                {isLoadingMoreDocList ?
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <ActivityIndicator
                            style={{ marginBottom: 17 }}
                            animating={isLoadingMoreDocList}
                            size="large"
                            color='blue'
                        />
                    </View>
                    : null}
            </Container>
        )
    }

    loadMoreData = async () => {
        try {
            this.setState({ isLoadingMoreDocList: true });
            await this.searchByDoctorDetails(false);
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
        const updateResp = await addFavoritesToDocByUserService(userId, doctorId);
        if (updateResp)
            Toast.show({
                text: 'Doctor wish list updated successfully',
                type: "success",
                duration: 3000,
            });
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    /*   navigate to next further process    */
    onPressToContinue4PaymentReview = async (doctorData, selectedSlotItemByDoctor, doctorIdHostpitalId) => {
        if (!selectedSlotItemByDoctor) {
            Toast.show({
                text: 'Please select a slot to continue booking',
                type: 'warning',
                duration: 3000
            })
            return;
        }
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        doctorData.doctorName = doctorData.first_name + ' ' + doctorData.last_name;
        doctorData.doctorId = doctorData.doctor_id;
        const confirmSlotDetails = { ...doctorData, slotData: selectedSlotItemByDoctor };
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
    }
    onSlotItemPress(doctorIdHostpitalId, item, index) {
        const { storeFeeBySelectedSlotOfDocIdHostpitalIdInObj } = this.state;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = index;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = item
        if ((item.fee != storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId])) {
            if (storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId] != undefined) {
                Toast.show({
                    text: 'Appointment Fee Updated',
                    type: 'warning',
                    duration: 3000
                });
            }
            storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctorIdHostpitalId] = item.fee
            this.setState({ storeFeeBySelectedSlotOfDocIdHostpitalIdInObj });
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    onPressGoToBookAppointmentPage(doctorItemData) {
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        doctorItemData.doctorId = doctorItemData.doctor_id;
        const singleDoctorItemData = { ...doctorItemData };
        const reqData4BookAppPage = {
            singleDoctorItemData: singleDoctorItemData,
            doctorId: doctorItemData.doctor_id,
        }
        const doctorItemHaveSlotsDataObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorItemData.doctorIdHostpitalId).slotData;
        if (doctorItemHaveSlotsDataObj) {
            reqData4BookAppPage.singleDoctorAvailabilityData = doctorItemHaveSlotsDataObj;
            reqData4BookAppPage.weekWiseDatesList = this.weekWiseDatesList;
        }
        this.props.navigation.navigate('Doctor Details Preview', reqData4BookAppPage)
    }

    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctorIdHostpitalId, item) {
        if (selectedSlotData) {
            const selectedSlotIndex = this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] || 0;
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
                return 'Not Available';
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
            this.weekWiseDatesList = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.weekWiseDatesList);
            const orderedDataFromWholeData = this.getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService(indexOfItem) // get 5 Or LessThan 5 of doctorIdHostpitalIds in order wise using index of given input of doctorInfoListAndSlotsData
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
                    });
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



    sortByTopRatings(doctorDataList) {
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = this.props;
        if (!this.isRenderedTopRatedDocList) {
            this.isRenderedTopRatedDocList = true;
            const doctorDataListBySort = doctorDataList.sort(function (a, b) {
                let ratingA = 0;
                let ratingB = 0;
                if (docReviewListCountOfDoctorIDs[a.doctor_id]) {
                    ratingA = docReviewListCountOfDoctorIDs[a.doctor_id].average_rating || 0
                };
                if (docReviewListCountOfDoctorIDs[b.doctor_id]) {
                    ratingB = docReviewListCountOfDoctorIDs[b.doctor_id].average_rating || 0
                }
                if (a.is_doctor_sponsor || b.is_doctor_sponsor) {
                    return ratingB - ratingA;
                }
                if (currentDoctorOrder === 'ASC') {
                    return ratingB - ratingA;
                }
            });
            store.dispatch({
                type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                data: doctorDataListBySort
            });
        }
        else {
            this.isRenderedTopRatedDocList = false;
            store.dispatch({
                type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                data: this.setDocListByPreviousOrder()
            });
        }
    }

    renderDoctorInformationCard(item) {
        const { isLoggedIn, currentDate } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctorIdHostpitalId] || currentDate], item.slotData, item.doctorIdHostpitalId, item)
        return (
            <View>
                <RenderDoctorInfo
                    item={item}
                    navigation={this.props.navigation}
                    docInfoData={{ isLoggedIn, fee, feeWithoutOffer, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }}
                    addToFavoritesList={(doctorId) => { this.addToFavoritesList(doctorId) }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                    shouldUpdate={`${item.doctorIdHostpitalId}-${fee}-${feeWithoutOffer}-${patientFavoriteListCountOfDoctorIds.includes(item.doctor_id)}`}
                >
                </RenderDoctorInfo>
            </View>
        )
    }

    renderAvailableSlots(doctorIdHostpitalId, slotData) {
        let selectedSlotIndex = this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] !== undefined ? this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] : -1;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        return (
            <View>
                <RenderSlots
                    selectedDate4DocIdHostpitalIdToStoreInObj={this.selectedDate4DocIdHostpitalIdToStoreInObj}
                    selectedSlotItem4DocIdHostpitalIdToStoreInObj={this.selectedSlotItem4DocIdHostpitalIdToStoreInObj}
                    slotDetails={{ slotData, selectedSlotIndex, doctorIdHostpitalId }}
                    shouldUpdate={`${doctorIdHostpitalId}-${selectedSlotIndex}-${this.selectedDate4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId]}`}
                    onSlotItemPress={(doctorIdHostpitalId, selectedSlot, selectedSlotItemIndex) => this.onSlotItemPress(doctorIdHostpitalId, selectedSlot, selectedSlotItemIndex)}
                >
                </RenderSlots>
            </View>
        )
    }


    /* Change the Date from Date Picker */
    onDateChanged = async (selectedDate, doctorIdHostpitalId, indexOfItem) => {
        this.onEndReachedIsTriggedFromRenderDateList = false
        this.selectedDate4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = selectedDate;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = -1;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] = null;
        if (this.weekWiseDatesList.includes(selectedDate) === false) {
            const endDateByMoment = addMoment(getMoment(selectedDate), 7, 'days');
            await this.getDoctorAvailabilitySlots(doctorIdHostpitalId, getMoment(selectedDate), endDateByMoment, indexOfItem);
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    callSlotsServiceWhenOnEndReached = async (doctorIdHostpitalId, weekWiseDatesList, indexOfItem) => { // call availability slots service when change dates on next week
        this.onEndReachedIsTriggedFromRenderDateList = true;
        const finalIndex = weekWiseDatesList.length
        const lastProcessedDate = weekWiseDatesList[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.weekWiseDatesList.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            await this.getDoctorAvailabilitySlots(doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem);
        }
    }
    renderDatesOnFlatList(doctorIdHostpitalId, slotData, indexOfItem) {
        const selectedDate = this.selectedDate4DocIdHostpitalIdToStoreInObj[doctorIdHostpitalId] || this.state.currentDate;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
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
            if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId).slotData === undefined) {
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
                                        <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId, indexOfItem)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 18, height: 31, width: 66, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, marginLeft: -6 }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
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
                                                        style={{ backgroundColor: 'green', borderColor: '#000', height: 30, borderRadius: 20, justifyContent: 'center', marginLeft: 5, marginRight: 5, marginTop: 5 }}>
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

        )
    }

}


const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(DoctorList)
