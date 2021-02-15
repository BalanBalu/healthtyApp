import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon, Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import styles from '../../CommonAll/styles'
import {primaryColor} from '../../../../setup/config'

import {
    SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
    SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
    searchByHomeHealthcareDocDetailsService,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    addFavoritesToDocByUserService,
    fetchDocHomeHealthcareAvailabilitySlotsService,
    getFavoriteListCount4PatientService,
} from '../../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, getMoment, setCurrentISOTime4GivenDate } from '../../../../setup/helpers';
import { Loader } from '../../../../components/ContentLoader';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../../setup/store';
import { enumerateStartToEndDates } from '../../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
import RenderDatesList from './RenderDateList'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT = 5;
const PAGINATION_COUNT_FOR_GET_DOCTORS_LIST = 8;
let doctorListOrder = 'ASC';

class DoctorList extends Component {
    weekWiseDatesList = [];
    docInfoAndAvailableSlotsMapByDoctorId = new Map();
    selectedDate4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotItem4DocIdHostpitalIdToStoreInObj = {};
    selectedCurrentDateSlotItem4DocIdToStoreInObj = {};
    storeFeeBySelectedSlotOfDocIdHostpitalIdInObj = {};
    totalSearchedDoctorIdsArray = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            isLoadingNextWeekAvailabilitySlots: false,
            expandItemOfDocIdToShowSlotsData: [],
            isLoggedIn: false,
            renderRefreshCount: 1,
            isLoading: true,
            isLoadingDatesAndSlots: false,
            isLoadingMoreDocList: false,
            doctorInfoListAndSlotsData1: [],
            reqSpecialistData: props.navigation.getParam('categoryName'),
            reqPinCode: props.navigation.getParam('pinCode'),
            userAddressInfo: props.navigation.getParam('userAddressInfo') || null,
            isLoadingOnChangeDocList: false,
            isOnEditPincode: false,
        }
        this.conditionFromFilterPage = false,
            this.isEnabledLoadMoreData = true;
        this.selectedDataFromFilterPage = null;
        this.incrementPaginationCount = 0;
        this.onEndReachedIsTriggedFromRenderDateList = false;
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true });
            await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props
            const userId = await AsyncStorage.getItem('userId');
            await this.searchByDoctorDetails();
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
    callInitialSearchOrFilterServiceWithClearedData = async (conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond) => {
        this.setState({ isLoading: true, });
        if (conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond) {
            this.props.navigation.setParams({ 'conditionFromFilterPage': false });
            this.conditionFromFilterPage = false;
        }
        this.isEnabledLoadMoreData = true;
        this.incrementPaginationCount = 0;
        this.onEndReachedIsTriggedFromRenderDateList = false;
        this.totalSearchedDoctorIdsArray = [];
        this.docInfoAndAvailableSlotsMapByDoctorId.clear();
        await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props;
        await this.searchByDoctorDetails();
        this.setState({ isLoading: false, renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    navigateToFilters() {
        this.props.navigation.navigate("HomeHealthcareFilterPage", {
            filterData: this.selectedDataFromFilterPage,
        })
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
    searchByDoctorDetails = async () => {
        try {
            const { bookAppointmentData: { getPreviousDocListWhenClearFilter } } = this.props;
            const { reqSpecialistData, reqPinCode } = this.state;
            let type;
            let reqData4ServiceCall = {}
            if (reqPinCode) {
                reqData4ServiceCall.locationData = { from_pincode: reqPinCode, to_pincode: reqPinCode }
            }
            if (!this.conditionFromFilterPage && reqSpecialistData) {
                reqData4ServiceCall.inputText = reqSpecialistData
            }
            if (this.conditionFromFilterPage && !getPreviousDocListWhenClearFilter) {
                type = 'filter';
                reqData4ServiceCall = { ...reqData4ServiceCall, ...this.selectedDataFromFilterPage }
            }
            else if (!reqSpecialistData) {
                type = 'location'
            }
            else {
                type = 'search';
            }
            const docListResponse = await searchByHomeHealthcareDocDetailsService(type, reqData4ServiceCall, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_DOCTORS_LIST);
            if (docListResponse.success) {
                this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_DOCTORS_LIST;
                const searchedDoctorIdsArray = [];
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    item.specialist = item.specialistInfo;
                    delete item.specialistInfo;
                    searchedDoctorIdsArray.push(item.doctor_id);
                    this.docInfoAndAvailableSlotsMapByDoctorId.set(item.doctor_id, item);
                })
                await Promise.all([
                    ServiceOfGetDoctorFavoriteListCount4Pat(searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                let doctorInfoList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorId.values()) || [];
                if (docListData.length <= 3) {
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
                if (this.docInfoAndAvailableSlotsMapByDoctorId.size < 3) this.isEnabledLoadMoreData = false;
                else if (this.docInfoAndAvailableSlotsMapByDoctorId.size > 4) {
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

    callGetDocListService = async () => {
        try {
            this.isEnabledLoadMoreData = true;
            this.incrementPaginationCount = 0;
            this.conditionFromFilterPage = false;
            this.selectedDataFromFilterPage = null;
            this.setState({ isLoadingOnChangeDocList: true })
            await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props
            this.docInfoAndAvailableSlotsMapByDoctorId.clear();
            await this.searchByDoctorDetails();
        } catch (Ex) {
            console.log('Ex is getting on Fetch Doc list===>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Fetch Doc list  : ${Ex}`
            }
        }
        finally {
            this.setState({ isLoadingOnChangeDocList: false });
        }
    }

    renderDocListByTopRated(doctorDataList) {
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = this.props;
        const doctorDataListBySort = doctorDataList.sort(function (a, b) {
            let ratingA = 0;
            let ratingB = 0;
            if (docReviewListCountOfDoctorIDs[a.doctor_id]) {
                ratingA = docReviewListCountOfDoctorIDs[a.doctor_id].average_rating || 0
            };
            if (docReviewListCountOfDoctorIDs[b.doctor_id]) {
                ratingB = docReviewListCountOfDoctorIDs[b.doctor_id].average_rating || 0
            }
            if (doctorListOrder === 'ASC') {
                return ratingB - ratingA;
            } else if (doctorListOrder === 'DESC') {
                return ratingA - ratingB;
            }
        });
        store.dispatch({
            type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
            data: doctorDataListBySort
        });
        if (doctorListOrder === 'ASC') {
            doctorListOrder = 'DESC';
        } else if (doctorListOrder === 'DESC') {
            doctorListOrder = 'ASC';
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    render() {
        const { bookAppointmentData: { doctorInfoListAndSlotsData, } } = this.props;
        const { reqPinCode, isLoading, isLoadingMoreDocList, isLoadingOnChangeDocList } = this.state;
        if (isLoading) return <Loader style='list' />;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
                <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                    <Row style={{ height: 35, alignItems: 'center' }}>
                        <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, justifyContent: 'center' }} onPress={() => this.renderDocListByTopRated(doctorInfoListAndSlotsData)}>
                            <Col size={2.0} >
                                <MaterialIcons name='keyboard-arrow-down' style={{ color: 'gray', fontSize: 24 }} />
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
                                <Icon name='ios-funnel' style={{ color: 'gray', fontSize: 20 }} />
                            </Col>
                        </Col>
                    </Row>
                </Card>
                <View>
                    <Text style={{
                        marginLeft: 5,
                        fontFamily: 'OpenSans',
                        color: '#000',
                        fontSize: 13,
                        marginTop: 5
                    }}>{"Showing Doctors in the"}
                        <Text style={{
                            fontFamily: 'OpenSans',
                            color: primaryColor,
                            fontSize: 13,
                        }}>{" "}PinCode - {reqPinCode}</Text>
                    </Text>
                </View>
                {                        doctorInfoListAndSlotsData.length ?
                    < FlatList
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
                    :
                    <Item style={{ borderBottomWidth: 0, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} >{this.conditionFromFilterPage ? 'Doctors Not found!..Choose Filter again' : ' No Doctor list found!'}</Text>
                    </Item>
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
            await this.searchByDoctorDetails();
        } catch (error) {
            console.log("Ex is getting on load more doctor ist data", error.message);
        }
        finally {
            this.setState({ isLoadingMoreDocList: false })
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
    onPressToContinue4PaymentReview = async (doctorData, selectedSlotItemByDoctor, doctor_id) => {
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
        const isoFormatOfSelectedDate = setCurrentISOTime4GivenDate(selectedSlotItemByDoctor.slotDate);  // send only selected slot date and get with ISO format;
        selectedSlotItemByDoctor.slotDate = isoFormatOfSelectedDate;
        const confirmSlotDetails = { ...doctorData, slotData: selectedSlotItemByDoctor };
        this.props.navigation.navigate('HomeHealthcareConfirmation', { resultconfirmSlotDetails: confirmSlotDetails, userAddressInfo: this.state.userAddressInfo })
    }

    getFeesBySelectedSlot(selectedSlotData, item) {
        if (selectedSlotData) {
            return {
                fee: selectedSlotData.fee,
                feeWithoutOffer: selectedSlotData.feeWithoutOffer
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
            const availableOn = moment(selectedSlotData.slotDate).format('ddd, DD MMM YY');
            return 'Available On ' + availableOn;
        }
        else if (item.nextAvailableDateAndTime) {
            const availableOn = moment(item.nextAvailableDateAndTime).format('ddd, DD MMM YY');
            return 'Available On ' + availableOn;
        }
        else {
            return 'Not Available';
        }
    }

    getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService = indexOfItem => {
        const { bookAppointmentData: { doctorInfoListAndSlotsData } } = this.props;
        const orderedDataFromWholeData = doctorInfoListAndSlotsData.slice(indexOfItem, indexOfItem + CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT)
        return orderedDataFromWholeData || []
    }
    /* get Doctor  Availability Slots service */
    getDoctorAvailabilitySlots = async (doctor_id, startDateByMoment, endDateByMoment, indexOfItem) => {
        try {
            const { reqPinCode } = this.state;
            this.weekWiseDatesList = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.weekWiseDatesList);
            const orderedDataFromWholeData = this.getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService(indexOfItem) // get 5 Or LessThan 5 of doctor_ids in order wise using index of given input of doctorInfoListAndSlotsData
            const reqDataDoctorIdsArry = [];
            orderedDataFromWholeData.map((item) => {
                reqDataDoctorIdsArry.push(item.doctor_id)
            })
            const reqData4Availability = {
                "doctorIds": reqDataDoctorIdsArry
            }
            if (reqPinCode) {
                reqData4Availability.locationData = {
                    from_pincode: reqPinCode,
                    to_pincode: reqPinCode,
                }
            }
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchDocHomeHealthcareAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            if (resultSlotsData.success) {
                const availabilitySlotsData = resultSlotsData.data;
                if (availabilitySlotsData.length != 0) {
                    this.setDoctorAvailabilitySlotsDataByDocAndHospitalIds(availabilitySlotsData || []);
                    const docInfoAndAvailableSlotsMap = Array.from(this.docInfoAndAvailableSlotsMapByDoctorId.values());
                    store.dispatch({
                        type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                        data: docInfoAndAvailableSlotsMap
                    });
                }
            }
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }
    /*  Set Doctor Availability Slots data by doctor_ids   */
    setDoctorAvailabilitySlotsDataByDocAndHospitalIds = (SourceOfSlotsDataArray) => {
        SourceOfSlotsDataArray.map((item) => {
            const baCupOfDocInfo = this.docInfoAndAvailableSlotsMapByDoctorId.get(item.doctor_id);
            const finalSlotsDataObj = { ...baCupOfDocInfo.slotData, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            delete baCupOfDocInfo.slotData
            const finalDocAndAvailabilityObj = {
                ...baCupOfDocInfo, slotData: finalSlotsDataObj
            }
            this.docInfoAndAvailableSlotsMapByDoctorId.set(item.doctor_id, finalDocAndAvailabilityObj);
        });
    }

    renderDoctorInformationCard(item) {
        const { isLoggedIn, currentDate } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || currentDate], item)
        return (
            <View>
                <RenderDoctorInfo
                    item={item}
                    navigation={this.props.navigation}
                    docInfoData={{ isLoggedIn, fee, feeWithoutOffer, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }}
                    addToFavoritesList={(doctorId) => { this.addToFavoritesList(doctorId) }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                // shouldUpdate={`${item.doctor_id}-${fee}-${feeWithoutOffer}-${patientFavoriteListCountOfDoctorIds.includes(item.doctor_id)}`}
                >
                </RenderDoctorInfo>
            </View>
        )
    }
    onPressGoToBookAppointmentPage(doctorItemData) {
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        doctorItemData.doctorId = doctorItemData.doctor_id;
        const singleDoctorItemData = { ...doctorItemData };
        const reqData4BookAppPage = {
            singleDoctorItemData: singleDoctorItemData,
            doctorId: doctorItemData.doctor_id,
        }
        const doctorItemHaveSlotsDataObj = this.docInfoAndAvailableSlotsMapByDoctorId.get(doctorItemData.doctor_id).slotData;
        if (doctorItemHaveSlotsDataObj) {
            reqData4BookAppPage.singleDoctorAvailabilityData = doctorItemHaveSlotsDataObj;
            reqData4BookAppPage.weekWiseDatesList = this.weekWiseDatesList;
        }
        if (this.state.userAddressInfo) {
            reqData4BookAppPage.userAddressInfo = this.state.userAddressInfo;
            reqData4BookAppPage.reqPinCode = this.state.reqPinCode
        }
        this.props.navigation.navigate('Home Healthcare Doctor Details Preview', reqData4BookAppPage)
    }


    /* Change the Date from Date Picker */
    onDateChanged = async (selectedDate, doctor_id, indexOfItem, selectedSlotItem) => {
        this.onEndReachedIsTriggedFromRenderDateList = false
        this.selectedDate4DocIdHostpitalIdToStoreInObj[doctor_id] = selectedDate;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctor_id] = selectedSlotItem;
        if (this.weekWiseDatesList.includes(selectedDate) === false) {
            const endDateByMoment = addMoment(getMoment(selectedDate), 7, 'days');
            await this.getDoctorAvailabilitySlots(doctor_id, getMoment(selectedDate), endDateByMoment, indexOfItem);
        }
        if (selectedSlotItem && selectedSlotItem.fee != this.storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctor_id]) {
            Toast.show({
                text: 'Appointment Fee Updated',
                type: 'warning',
                duration: 1000
            });
            this.storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctor_id] = selectedSlotItem.fee
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    callSlotsServiceWhenOnEndReached = async (doctor_id, weekWiseDatesList, indexOfItem) => { // call availability slots service when change dates on next week
        this.onEndReachedIsTriggedFromRenderDateList = true;
        const finalIndex = weekWiseDatesList.length
        const lastProcessedDate = weekWiseDatesList[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.weekWiseDatesList.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            await this.getDoctorAvailabilitySlots(doctor_id, startDateByMoment, endDateByMoment, indexOfItem);
        }
    }
    renderDatesOnFlatList(doctor_id, slotData, indexOfItem) {
        const selectedDate = this.selectedDate4DocIdHostpitalIdToStoreInObj[doctor_id] || this.state.currentDate;
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        if (slotData[this.state.currentDate] && !this.selectedCurrentDateSlotItem4DocIdToStoreInObj[doctor_id]) {
            this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctor_id] = slotData[this.state.currentDate];
            this.selectedCurrentDateSlotItem4DocIdToStoreInObj[doctor_id] = true;
        }

        return (
            <View>
                <RenderDatesList
                    selectedDate={selectedDate}
                    slotData={slotData}
                    indexOfItem={indexOfItem}
                    doctor_id={doctor_id}
                    weekWiseDatesList={this.weekWiseDatesList}
                    onDateChanged={(item, doctor_id, indexOfItem, selectedSlotItem) => { this.onDateChanged(item, doctor_id, indexOfItem, selectedSlotItem) }}
                    callSlotsServiceWhenOnEndReached={(doctor_id, weekWiseDatesList, indexOfItem) => {
                        this.callSlotsServiceWhenOnEndReached(doctor_id, weekWiseDatesList, indexOfItem);
                    }}
                    shouldUpdate={`${doctor_id}-${selectedDate}`}
                    onEndReachedIsTriggedFromRenderDateList={this.onEndReachedIsTriggedFromRenderDateList}
                >
                </RenderDatesList>
            </View>
        )
    }

    onBookPress = async (doctorId, indexOfItem) => {
        try {
            this.onEndReachedIsTriggedFromRenderDateList = false;
            this.setState({ isLoadingDatesAndSlots: true, isLoadingDatesAndSlotsByRespectedItem: doctorId });
            const { expandItemOfDocIdToShowSlotsData } = this.state;
            if (expandItemOfDocIdToShowSlotsData.indexOf(doctorId) !== -1) {
                expandItemOfDocIdToShowSlotsData.splice(expandItemOfDocIdToShowSlotsData.indexOf(doctorId), 1)
            } else {
                expandItemOfDocIdToShowSlotsData.push(doctorId);
            }
            const startDateByMoment = addMoment(this.state.currentDate)
            const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
            if (this.docInfoAndAvailableSlotsMapByDoctorId.get(doctorId).slotData === undefined) {
                await this.getDoctorAvailabilitySlots(doctorId, startDateByMoment, endDateByMoment, indexOfItem);
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
        const { currentDate, expandItemOfDocIdToShowSlotsData, isLoadingDatesAndSlots } = this.state;
        return (
            <View style={{ marginTop: 15 }}>
                <Card style={{ padding: 2, borderRadius: 10, }}>
                    <List style={{ borderBottomWidth: 0 }}>
                        <ListItem style={{ borderBottomWidth: 0 }}>
                            <Grid >
                                {this.renderDoctorInformationCard(item)}
                                <Row style={{ borderTopColor: '#000', borderTopWidth: 0.4, marginTop: 5 }} >
                                    <Col size={0.8}>
                                        <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />
                                    </Col>
                                    <Col size={7.5}>
                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}> {this.getNextAvailableDateAndTime(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || currentDate], item)}</Text>
                                    </Col>
                                    <Col size={1.7}>
                                        {!expandItemOfDocIdToShowSlotsData.includes(item.doctor_id) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctor_id, indexOfItem)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 18, height: 31, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, marginLeft: -6 }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity> :
                                            null}
                                        {this.state.isLoadingDatesAndSlotsByRespectedItem == item.doctor_id ?
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
                                {expandItemOfDocIdToShowSlotsData.includes(item.doctor_id) ?
                                    item.slotData ?
                                        <View>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment Date</Text>
                                            </Row>
                                            {this.renderDatesOnFlatList(item.doctor_id, item.slotData, indexOfItem)}
                                            <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        <Text style={this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id || currentDate] ? { fontSize: 12, alignSelf: 'flex-start', color: '#000', fontFamily: 'OpenSans' } : { color: '#a90e0e', fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}> {this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id || currentDate] ? "You Selected Appointment on" : "Appointment is Not Available"}</Text>
                                                        <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: primaryColor, fontSize: 12, fontFamily: 'OpenSans', marginTop: 5, marginLeft: 5 }}>{this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id || currentDate] ? formatDate(this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id || currentDate].slotDate, 'ddd DD MMM YYYY') : null}</Text>
                                                    </Col>
                                                    <Col size={4}>
                                                        <TouchableOpacity
                                                            onPress={() => { this.onPressToContinue4PaymentReview(item, this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id], item.doctor_id) }}
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
            </View>
        )
    }

}


const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(DoctorList)
