import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';

import {
    searchByDocDetailsService, fetchAvailabilitySlots,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    SET_BOOK_APP_DOCTOR_DATA,
    SET_SINGLE_DOCTOR_ITEM_DATA,
    SET_FILTERED_DOCTOR_DATA,
    addFavoritesToDocByUserService,
    fetchDoctorAvailabilitySlotsService
} from '../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, addTimeUnit, getMoment, intersection, getUnixTimeStamp } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';

import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../setup/store';
const vipLogo = require('../../../../assets/images/viplogo.png')
let fields = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,experience,profile_image";
import { RenderListNotFound } from '../CommonAll/components';
import { enumerateStartToEndDates } from '../CommonAll/functions';

import RenderDoctorInfo from './RenderDoctorInfo';


let conditionFromFilterPage;
const SELECTED_EXPERIENCE_START_END_YEARS = {
    10: { start: 0, end: 10 },
    20: { start: 10, end: 20 },
    30: { start: 20, end: 30 },
    40: { start: 40, end: 100 }
}

let currentDoctorOrder = 'ASC';
let doctorDataWithAviablityInMap = new Map();
const SHOW_NO_OF_PRIME_DOCS_ON_PRIME_LIST_SWIPPER_LIST = 2;
const CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT = 5;

class DoctorList extends Component {
    processedDoctorIds = [];
    processedDoctorData = [];
    processedDoctorDetailsData = [];
    processedDoctorAvailabilityDates = [];
    sponsorIdWithHospitalIdArray = [];
    doctorDetailsMap = new Map();
    distanceMap = new Map();
    showNoOfPrimeDocsOnSwipperList;




    docListDataArry = [];
    docInfoListMap = new Map();
    searchedDoctorIdsArray = [];
    searchedDocAndHospitalIdsArray = [];
    availableSlotsDataMap = new Map();
    availabilitySlotsDatesArry = [];
    setDoctorIdHospitalIdsArrayMap = new Map()

    constructor(props) {
        super(props)
        conditionFromFilterPage = null,  // for check FilterPage Values
            this.showNoOfPrimeDocsOnSwipperList = SHOW_NO_OF_PRIME_DOCS_ON_PRIME_LIST_SWIPPER_LIST;

        this.state = {
            selectedSlotItemByDoctorIds: {},
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            doctorData: [],
            searchedResultData: [],
            getSearchedDoctorIds: null,
            nextAvailableSlotDate: '',
            isLoading: true,
            isAvailabilityLoading: false,
            filterBySelectedAvailabilityDateCount: 0,
            filterData: null,
            yearOfExperience: '',
            processedDoctorAvailabilityDates: [],
            sliderPageIndex: 0,
            sliderPageIndexesByDoctorIds: {},
            selectedDatesByDoctorIds: {},
            selectedSlotByDoctorIds: {},
            expandedDoctorIdHospitalsToShowSlotsData: [],
            showedFeeByDoctorIds: {},
            isLoggedIn: false,
            refreshCount: 0,
            renderRefreshCount: 1,
        }
    }



    componentNavigationMount = async () => { }

    async componentDidMount() {
        debugger
        const userId = await AsyncStorage.getItem('userId');
        this.searchByDoctorDetails();
        if (userId) {
            //     this.getFavoriteCounts4PatByUserId(userId);
            this.setState({ isLoggedIn: true })
        }
    }
    getFavoriteCounts4PatByUserId = (userId) => {
        try {
            getFavoriteListCount4PatientService(userId);
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
    searchByDoctorDetails = async () => {
        try {
            // debugger
            this.setState({ isLoading: true });
            const locationDataFromSearch = this.props.navigation.getParam('locationDataFromSearch');
            const inputKeywordFromSearch = this.props.navigation.getParam('inputKeywordFromSearch');
            const docListResponse = await searchByDocDetailsService(locationDataFromSearch, inputKeywordFromSearch);
            debugger
            console.log('docListResponse====>', JSON.stringify(docListResponse));
            if (docListResponse.success) {
                // debugger
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    const doctorIdHospitalId = item.doctor_id + '-' + item.hospitalInfo.hospital_id;
                    if (!this.searchedDoctorIdsArray.includes(item.doctor_id)) {
                        this.searchedDoctorIdsArray.push(item.doctor_id)
                    }
                    this.searchedDocAndHospitalIdsArray.push(doctorIdHospitalId);
                    item.doctorIdHospitalId = doctorIdHospitalId;
                    if (this.setDoctorIdHospitalIdsArrayMap.has(item.doctor_id)) {  // Set ReqData body for Call Availability slots data service 
                        const baCupDocHospitalIds = this.setDoctorIdHospitalIdsArrayMap.get(item.doctor_id) || [];
                        this.setDoctorIdHospitalIdsArrayMap.set(item.doctor_id, [...baCupDocHospitalIds, item.hospitalInfo.hospital_id])
                    }
                    else {
                        this.setDoctorIdHospitalIdsArrayMap.set(item.doctor_id, [item.hospitalInfo.hospital_id])
                    }
                    this.docInfoListMap.set(doctorIdHospitalId, item);
                    // debugger
                })
                debugger
                await Promise.all([
                    ServiceOfGetDoctorFavoriteListCount4Pat(this.searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(this.searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                debugger
            }
        } catch (Ex) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false })
        }
    }


    /* Update Favorites for LabTest by UserId  */
    addToFavoritesList = async (doctorId) => {
        const userId = await AsyncStorage.getItem('userId');
        await addFavoritesToDocByUserService(userId, doctorId);
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, doctorIdHospitalId) {

        let { selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds } = this.state;

        selectedDatesByDoctorIds[doctorIdHospitalId] = selectedDate;
        selectedSlotByDoctorIds[doctorIdHospitalId] = -1;
        selectedSlotItemByDoctorIds[doctorIdHospitalId] = null;

        this.setState({ selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount: this.state.refreshCount + 1 });

        if (this.processedDoctorAvailabilityDates.includes(selectedDate) === false) {
            let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');

            this.callGetAvailabilitySlot(this.state.getSearchedDoctorIds, getMoment(selectedDate), endDateMoment);

        }
        //console.log('ended loading the onDateChanged')
    }

    /* Click the Slots from Doctor List page */
    onPressContinueForPaymentReview = async (doctorData, selectedSlotItemByDoctor, doctorIdHospitalId) => {
        //console.log(selectedSlotItemByDoctor);
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
        var confirmSlotDetails = {
            ...doctorData,
            slotData: selectedSlotItemByDoctor
        };
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
    }
    async onSlotItemPress(doctorIdHospitalId, item, index) {

        let { selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, showedFeeByDoctorIds } = this.state;

        selectedSlotByDoctorIds[doctorIdHospitalId] = index;
        selectedSlotItemByDoctorIds[doctorIdHospitalId] = item

        this.setState({ selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount: this.state.refreshCount + 1 });

        //console.log(selectedSlotIndex + '. and index :' + index);
        if ((item.fee != showedFeeByDoctorIds[doctorIdHospitalId])) {
            if (showedFeeByDoctorIds[doctorIdHospitalId] != undefined) {
                Toast.show({
                    text: 'Appointment Fee Updated',
                    type: 'warning',
                    duration: 3000
                });
            }
            showedFeeByDoctorIds[doctorIdHospitalId] = item.fee
            this.setState({ showedFeeByDoctorIds });
        }
        //console.log(item);
    }

    onPressGoToBookAppointmentPage(doctorItemData) {
        doctorItemData.doctorId = doctorItemData.doctor_id;
        // doctorItemData.slotData = this.availableSlotsDataMap.get(String(doctorItemData.doctor_id)) || {};
        let reqLabBookAppointmentData = { ...doctorItemData }
        store.dispatch({
            type: SET_SINGLE_DOCTOR_ITEM_DATA,
            data: reqLabBookAppointmentData
        })
        this.props.navigation.navigate('Book Appointment', { doctorId: doctorItemData.doctor_id, processedAvailabilityDates: this.processedDoctorAvailabilityDates })
    }


    haveAvailableSlots(doctorIdHospitalId, slotsData) {
        let { selectedSlotByDoctorIds, showedFee } = this.state;
        let selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHospitalId] !== undefined ? selectedSlotByDoctorIds[doctorIdHospitalId] : -1
        //console.log('Selected slot index:' + selectedSlotIndex);
        const { width } = Dimensions.get('screen');
        const itemWidth = (width) / 4;
        const sortByStartTime = (a, b) => {
            let startTimeSortA = getUnixTimeStamp(a.slotStartDateAndTime);
            let startTimeSortB = getUnixTimeStamp(b.slotStartDateAndTime);
            return startTimeSortA - startTimeSortB;
        }
        return (
            <Row>
                {/* <Col style={{width:'8%'}}></Col> */}
                <FlatList
                    numColumns={4}
                    data={slotsData.sort(sortByStartTime)}
                    extraData={[this.state.selectedDatesByDoctorIds, this.state.selectedSlotByDoctorIds]}
                    renderItem={({ item, index }) =>
                        <Col style={{ width: itemWidth - 10 }}>
                            <TouchableOpacity disabled={item.isSlotBooked}
                                style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ?
                                    styles.slotSelectedBgColor : styles.slotDefaultBgColor}
                                onPress={() => this.onSlotItemPress(doctorIdHospitalId, item, index)}>
                                <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
                            </TouchableOpacity>
                        </Col>
                    }
                    keyExtractor={(item, index) => index.toString()} />
                {/* <Col style={{width:'8%'}}></Col> */}
            </Row>
        )
    }
    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctorIdHospitalId) {

        let { selectedSlotByDoctorIds } = this.state;
        selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHospitalId] || 0;
        if (selectedSlotData === undefined) {
            selectedSlotData = wholeSlotData[Object.keys(wholeSlotData)[0]]
        }
        selectedIndex = selectedSlotData[selectedSlotIndex] ? selectedSlotIndex : 0;
        selectedSlotFee = selectedSlotData[selectedIndex].fee;
        selectedSlotFeeWithoutOffer = selectedSlotData[selectedIndex].feeWithoutOffer;

        return {
            fee: selectedSlotFee,
            feeWithoutOffer: selectedSlotFeeWithoutOffer
        }
    }

    getDisplayAvailableTime = (selectedSlotData, wholeSlotData) => {

        if (selectedSlotData) {
            let startTime = moment(selectedSlotData[0].slotStartDateAndTime).format('h:mm a');
            let endTime = moment(selectedSlotData[selectedSlotData.length - 1].slotEndDateAndTime).format('h:mm a');
            return 'Available ' + startTime + ' - ' + endTime;
        } else {
            if (wholeSlotData[Object.keys(wholeSlotData)[0]].length > 0) {
                selectedSlotData = wholeSlotData[Object.keys(wholeSlotData)[0]]
                let availableOn = moment(selectedSlotData[0].slotStartDateAndTime).format('ddd, DD MMM YY');
                return 'Available On ' + availableOn;
            }
        }
    }

    noAvailableSlots() {
        //console.log('started-loading-no-slots-available');
        return (
            <Row style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }}>
                    <Text>No Slots Available</Text>
                    {/*nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>*/}
                </Button>
            </Row>
        )
    }


    onBookPress(doctorIdHospitalId) {
        const { expandedDoctorIdHospitalsToShowSlotsData } = this.state;
        if (expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId) !== -1) {
            expandedDoctorIdHospitalsToShowSlotsData.splice(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId), 1)
        } else {
            expandedDoctorIdHospitalsToShowSlotsData.push(doctorIdHospitalId);
        }

        const startDateByMoment = addMoment(this.state.currentDate)
        const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
        if (!this.availableSlotsDataMap.has(String(doctorIdHospitalId))) {
            this.getDoctorAvailabilitySlots(doctorIdHospitalId, startDateByMoment, endDateByMoment);
        }
        else {
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
        // this.setState({ expandedDoctorIdHospitalsToShowSlotsData, refreshCount: this.state.refreshCount + 1 });
    }

    getDoctorIdHospitalIdsArrayByInput = doctorIdHospitalId => {
        const findIndexOfDoctorIdHospitalId = this.searchedDocAndHospitalIdsArray.indexOf(doctorIdHospitalId);
        const getNoOfDocIddHospitalIds4CallAavailabilityService = this.searchedDocAndHospitalIdsArray.slice(findIndexOfDoctorIdHospitalId, findIndexOfDoctorIdHospitalId + CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT)
        return getNoOfDocIddHospitalIds4CallAavailabilityService || []
    }
    /* get Lab Test Availability Slots service */
    getDoctorAvailabilitySlots = async (doctorIdHospitalId, startDateByMoment, endDateByMoment) => {
        try {
            debugger
            this.availabilitySlotsDatesArry = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.availabilitySlotsDatesArry);
            const arryOfDoctorIdHospitalIds = this.getDoctorIdHospitalIdsArrayByInput(doctorIdHospitalId) // get 5 Or LessThan 5 of LabIds in order wise using index of given input of labIdFromItem
            debugger
            const reqData4Availability = [], checkDuplicateDoctorIds = []
            arryOfDoctorIdHospitalIds.map((docHospitalIdItem) => {
                const splitByDoctorIdOnly = docHospitalIdItem.split('-')[0];
                if (!checkDuplicateDoctorIds.includes(splitByDoctorIdOnly)) {
                    checkDuplicateDoctorIds.push(splitByDoctorIdOnly);
                    const getHospitalIdsListOfDoctorId = this.setDoctorIdHospitalIdsArrayMap.get(splitByDoctorIdOnly) || [];
                    reqData4Availability.push({
                        doctorId: splitByDoctorIdOnly,
                        hospitalIds: getHospitalIdsListOfDoctorId,
                    })
                }
            })
            debugger
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            debugger
            const resultSlotsData = await fetchDoctorAvailabilitySlotsService(reqData4Availability || [], reqStartAndEndDates);
            console.log('resultSlotsData======>', resultSlotsData);
            debugger
            // if (resultSlotsData.success) {
            //     const availabilityData = resultSlotsData.data;
            //     if (availabilityData.length != 0) {
            //         availabilityData.map((item) => {
            //             let previousSlotsDataByItem = this.availableSlotsDataMap.get(String(item.labId))
            //             let finalSlotsDataObj = { ...previousSlotsDataByItem, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            //             this.availableSlotsDataMap.set(String(item.labId), finalSlotsDataObj)
            //         })
            //         this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
            //     }
            // }
            debugger
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }








    sortByTopRatings(filteredDoctorData) {
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs } } = this.props;
        //console.log(docReviewListCountOfDoctorIDs);
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
        this.setState({ refreshCount: this.state.refreshCount + 1 });
    }


    renderSponsorDoctorList(item) {
    }
    render() {
        const { bookAppointmentData: { docReviewListCountOfDoctorIDs, filteredDoctorData } } = this.props;
        const { isLoading } = this.state;
        const docInfoListMapData = Array.from(this.docInfoListMap.values());
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
                {isLoading ? <Loader style='list' /> :
                    <Content>
                        <View>
                            <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                                <Row>
                                    <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, }} onPress={() => this.sortByTopRatings(filteredDoctorData)}>
                                        <Col size={1.1} >
                                            <Icon name='ios-arrow-down' style={{ color: 'gray', fontSize: 20, marginTop: 10 }} />
                                        </Col>
                                        <Col size={8.9} style={{ justifyContent: 'center' }}>
                                            <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center', marginTop: 5 }}>Top Rated </Text>
                                        </Col>
                                    </Col>
                                    <Col size={5} style={{ flexDirection: 'row', borderLeftColor: '#909090', borderLeftWidth: 0.3 }} onPress={() => this.navigateToFilters()}>
                                        <Col size={1.1} style={{ marginLeft: 10 }}>
                                            <Icon name='ios-funnel' style={{ color: 'gray', fontSize: 25, marginTop: 5 }} />
                                        </Col>
                                        <Col size={8.9} style={{ justifyContent: 'center' }}>
                                            <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5, marginLeft: 5, width: '100%', textAlign: 'center' }}>Filters </Text>
                                        </Col>

                                    </Col>
                                </Row>
                            </Card>
                            {docInfoListMapData.length === 0 ? <RenderListNotFound text={' No Lab list found!'} />
                                :
                                <View>
                                    <View style={{ borderBottomColor: '#B6B6B6', borderBottomWidth: 0.5, paddingBottom: 8 }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10 }}>Recommended <Text style={{ color: '#775DA3', fontFamily: 'OpenSans', fontSize: 12 }}>Prime Doctors</Text> in Hearing Specialist near you</Text>
                                        <ScrollView horizontal={true} style={{ marginTop: 8 }}>
                                            <FlatList
                                                horizontal
                                                data={filteredDoctorData || []}
                                                extraData={this.state.refreshCount}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) =>
                                                    item.isDoctorHosptalSponsored === true ? this.renderSponsorDoctorList(item) : null
                                                } />
                                        </ScrollView>
                                    </View>
                                    <FlatList
                                        data={docInfoListMapData}
                                        extraData={this.state.refreshCount}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                            item.isDoctorHosptalSponsored === true ? null : this.renderDoctorCard(item)
                                        } />
                                </View>}
                        </View>
                    </Content>
                }
            </Container >
        )
    }
    renderDoctorInformationCard(item) {
        // debugger
        const { isLoggedIn } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        // debugger
        return (
            <View>
                <RenderDoctorInfo
                    item={item}
                    isLoggedIn={isLoggedIn}
                    patientFavoriteListCountOfDoctorIds={patientFavoriteListCountOfDoctorIds}
                    docFavoriteListCountOfDoctorIDs={docFavoriteListCountOfDoctorIDs}
                    docReviewListCountOfDoctorIDs={docReviewListCountOfDoctorIDs}
                    addToFavoritesList={(doctorId) => { this.addToFavoritesList(doctorId) }}
                    onPressGoToBookAppointmentPage={(item) => { this.onPressGoToBookAppointmentPage(item) }}
                // shouldUpdate4ReRender={`${item.doctor_id}-${item.doctor_id}`}
                >
                </RenderDoctorInfo>
            </View>
        )
        debugger
    }

    renderDoctorCard(item) {
        debugger
        const { bookAppointmentData: { docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { selectedDatesByDoctorIds, expandedDoctorIdHospitalsToShowSlotsData, isLoggedIn, selectedSlotItemByDoctorIds, } = this.state;
        debugger
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
                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}> Available on 23 Mon 05 2020</Text>
                                    </Col>
                                    <Col style={{ width: "15%" }}>
                                        {!expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHospitalId) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHospitalId)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity> : null}
                                    </Col>

                                </Row>

                                {expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHospitalId) ?

                                    <View>

                                        <Row style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date and time</Text>
                                        </Row>
                                        {this.renderDatesOnFlatlist(item.slotData, selectedDatesByDoctorIds[item.doctorIdHospitalId] || this.state.currentDate, item.doctorIdHospitalId)}
                                        {
                                            item.slotData[selectedDatesByDoctorIds[item.doctorIdHospitalId] || this.state.currentDate] !== undefined ?
                                                this.haveAvailableSlots(item.doctorIdHospitalId, item.slotData[selectedDatesByDoctorIds[item.doctorIdHospitalId] || this.state.currentDate])
                                                : this.noAvailableSlots(item.doctorIdHospitalId, item.slotData)
                                        }

                                        <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                    <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{selectedSlotItemByDoctorIds[item.doctorIdHospitalId] ? formatDate(selectedSlotItemByDoctorIds[item.doctorIdHospitalId].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                </Col>

                                                {/* <Col style={{ width: '35%' }}></Col> */}

                                                <Col size={4}>
                                                    <TouchableOpacity
                                                        onPress={() => { console.log('......Pressing....'); this.onPressContinueForPaymentReview(item, selectedSlotItemByDoctorIds[item.doctorIdHospitalId], item.doctorIdHospitalId) }}
                                                        style={{ backgroundColor: 'green', borderColor: '#000', height: 30, borderRadius: 20, justifyContent: 'center', marginLeft: 5, marginRight: 5, marginTop: -5 }}>
                                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>Continue </Text>
                                                    </TouchableOpacity>
                                                </Col>

                                            </Row>
                                        </View>

                                    </View> : null}

                            </Grid>

                        </ListItem>


                    </List>
                </Card>
            </View>
        )
    }

    renderDatesOnFlatlist(slotData, selectedDate, doctorIdHospitalId) {

        const reducer = (accumulator, currentValue, currentIndex, souceArray) => {
            if (!currentValue.isSlotBooked)
                return 1 + accumulator;
            else if (souceArray.length - 1 === currentIndex) {
                return accumulator == 0 ? 'No' : accumulator;
            }
            else
                return accumulator
        }
        return (

            <FlatList
                horizontal={true}
                data={this.processedDoctorAvailabilityDates}
                extraData={[this.state.selectedDatesByDoctorIds, this.state.selectedSlotItemByDoctorIds]}
                onEndReachedThreshold={1}
                onEndReached={({ distanceFromEnd }) => {
                    let endIndex = this.processedDoctorAvailabilityDates.length
                    let lastProcessedDate = this.processedDoctorAvailabilityDates[endIndex - 1];
                    let startMoment = getMoment(lastProcessedDate).add(1, 'day');
                    let endDateMoment = addMoment(lastProcessedDate, 7, 'days')
                    if (this.state.isAvailabilityLoading === false) {
                        this.callGetAvailabilitySlot(this.state.getSearchedDoctorIds, startMoment, endDateMoment);
                    }
                }}
                renderItem={({ item }) =>
                    <Col style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={[styles.availabilityBG, selectedDate === item ? { backgroundColor: '#775DA3', alignItems: 'center' } : { backgroundColor: '#ced6e0', alignItems: 'center' }]}
                            onPress={() => this.onDateChanged(item, doctorIdHospitalId)}>
                            <Text style={[{ fontSize: 12, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                            <Text style={[{ fontSize: 10, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{slotData[item] ? slotData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available'}</Text>
                        </TouchableOpacity>
                    </Col>
                } keyExtractor={(item, index) => index.toString()} />
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