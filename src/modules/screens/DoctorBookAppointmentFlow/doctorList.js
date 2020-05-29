import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native';
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
} from '../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, addTimeUnit, getMoment, intersection, getUnixTimeStamp } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';

import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../setup/store';
const vipLogo = require('../../../../assets/images/viplogo.png')
let fields = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,experience,profile_image";
import { RenderListNotFound, RenderNoSlotsAvailable } from '../CommonAll/components';
import { enumerateStartToEndDates } from '../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
import RenderDatesList from './RenderDateList'
import RenderSlots from './RenderSlots'

let conditionFromFilterPage;
const SELECTED_EXPERIENCE_START_END_YEARS = {
    10: { start: 0, end: 10 },
    20: { start: 10, end: 20 },
    30: { start: 20, end: 30 },
    40: { start: 40, end: 100 }
}
let currentDoctorOrder = 'ASC';
const SHOW_NO_OF_PRIME_DOCTORS_COUNT_ON_SWIPER_LIST_VIEW = 2;
const CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT = 5;

class DoctorList extends Component {
    docListDataArry = [];
    searchedDoctorIdsArray = [];
    searchedDocAndHospitalIdsArray = [];
    availableSlotsDataMap = new Map();
    availabilitySlotsDatesArry = [];
    docInfoAndAvailableSlotsMapByDoctorIdHostpitalId = new Map();
    selectedDateObjOfDoctorIds = {};
    selectedSlotByDoctorIdsObj = {};
    selectedSlotItemByDoctorIds = {};
    showNoOfPrimeDocsCountOnSwiperListView = SHOW_NO_OF_PRIME_DOCTORS_COUNT_ON_SWIPER_LIST_VIEW;
    constructor(props) {
        super(props)
        conditionFromFilterPage = null,  // for check FilterPage Values
            // this.showNoOfPrimeDocsCountOnSwiperListView = SHOW_NO_OF_PRIME_DOCTORS_COUNT_ON_SWIPER_LIST_VIEW;
            this.state = {
                selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
                currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
                nextAvailableSlotDate: '',
                isLoading: true,
                isAvailabilityLoading: false,
                filterBySelectedAvailabilityDateCount: 0,
                filterData: null,
                yearOfExperience: '',
                sliderPageIndex: 0,
                sliderPageIndexesByDoctorIds: {},
                expandedDoctorIdHospitalsToShowSlotsData: [],
                showedFeeByDoctorIds: {},
                isLoggedIn: false,
                renderRefreshCount: 1,
                refreshCountOnDateFL: 1,
                isSlotsLoading: false,

            }
    }

    componentNavigationMount = async () => { }   //   Need to Check filter Page implementation also
    async componentDidMount() {
        const userId = await AsyncStorage.getItem('userId');
        this.searchByDoctorDetails();
        if (userId) {
            //     this.getFavoriteCounts4PatByUserId(userId);
            this.setState({ isLoggedIn: true })
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
    searchByDoctorDetails = async () => {
        try {
            // //debugger
            this.setState({ isLoading: true });
            const locationDataFromSearch = this.props.navigation.getParam('locationDataFromSearch');
            const inputKeywordFromSearch = this.props.navigation.getParam('inputKeywordFromSearch');
            const docListResponse = await searchByDocDetailsService(locationDataFromSearch, inputKeywordFromSearch);
            //debugger
            console.log('docListResponse====>', JSON.stringify(docListResponse));
            if (docListResponse.success) {
                // //debugger
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    const doctorIdHostpitalId = item.doctor_id + '-' + item.hospitalInfo.hospital_id;
                    if (!this.searchedDoctorIdsArray.includes(item.doctor_id)) {
                        this.searchedDoctorIdsArray.push(item.doctor_id)
                    }
                    this.searchedDocAndHospitalIdsArray.push(doctorIdHostpitalId);
                    item.doctorIdHostpitalId = doctorIdHostpitalId;
                    this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(doctorIdHostpitalId, item);
                })
                //debugger
                const [activeDoctorsSponsorDetails, docsFavoriteDetails, docsReviewDetails] = await Promise.all([
                    serviceOfGetTotalActiveSponsorDetails4Doctors(this.searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                    ServiceOfGetDoctorFavoriteListCount4Pat(this.searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(this.searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                //debugger
                const doctorInfoList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values()) || [];
                console.log('doctorInfoList========>', JSON.stringify(doctorInfoList));
                const activeDoctorsSponsorData = activeDoctorsSponsorDetails.data;
                // if (activeDoctorsSponsorData.length !== 0) {
                //     const sponsorIdsArray = [];
                //     let incrementPrimeDoctorCountToShow = 0;
                //     activeDoctorsSponsorData.map((sponsorItem) => {
                //         sponsorIdsArray.push(sponsorItem._id);
                //         const hospitalId = sponsorItem.location[0] && sponsorItem.location[0].hospital_id;
                //         const doctorIdHostpitalId = sponsorItem.doctor_id + '-' + hospitalId;
                //         if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.has(doctorIdHostpitalId)) {
                //             const baCupDocHospitalIdItemObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId)
                //             if (incrementPrimeDoctorCountToShow < this.showNoOfPrimeDocsCountOnSwiperListView) {
                //                 obj.isDoctorIdHostpitalIdSponsored = true;
                //                 incrementPrimeDoctorCountToShow += 1;
                //             } else {
                //                 obj.primeDocOnNonPrimeList = true;
                //             }
                //         }

                //     });
                //     // this.updateSponsorViewersCount(sponsorIdArray)
                // }
                store.dispatch({
                    type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                    data: doctorInfoList
                })
            }
            else {
                store.dispatch({
                    type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                    data: []
                })
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
        const { showedFeeByDoctorIds } = this.state;
        this.selectedSlotByDoctorIdsObj[doctorIdHostpitalId] = index;
        this.selectedSlotItemByDoctorIds[doctorIdHostpitalId] = item
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
        if ((item.fee != showedFeeByDoctorIds[doctorIdHostpitalId])) {
            if (showedFeeByDoctorIds[doctorIdHostpitalId] != undefined) {
                Toast.show({
                    text: 'Appointment Fee Updated',
                    type: 'warning',
                    duration: 3000
                });
            }
            showedFeeByDoctorIds[doctorIdHostpitalId] = item.fee
            this.setState({ showedFeeByDoctorIds });
        }
    }

    onPressGoToBookAppointmentPage(doctorItemData) {
        doctorItemData.doctorId = doctorItemData.doctor_id;
        let reqDocBookAppointmentData = { ...doctorItemData }
        store.dispatch({
            type: SET_SINGLE_DOCTOR_ITEM_DATA,
            data: reqDocBookAppointmentData
        })
        this.props.navigation.navigate('Book Appointment', { doctorId: doctorItemData.doctor_id, processedAvailabilityDates: this.availabilitySlotsDatesArry })
    }

    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctorIdHostpitalId) {
        // let { selectedSlotByDoctorIdsObj } = this.state;
        if (selectedSlotData) {
            selectedSlotIndex = this.selectedSlotByDoctorIdsObj[doctorIdHostpitalId] || 0;
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
        else { return {} }
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

    getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService = indexOfItem => {
        const { bookAppointmentData: { doctorInfoListAndSlotsData } } = this.props;
        const orderedDataFromWholeData = doctorInfoListAndSlotsData.slice(indexOfItem, indexOfItem + CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT)
        return orderedDataFromWholeData || []
    }
    /* get Doctor  Availability Slots service */
    getDoctorAvailabilitySlots = async (doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem) => {
        try {
            debugger
            this.availabilitySlotsDatesArry = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.availabilitySlotsDatesArry);
            alert(indexOfItem)

            const orderedDataFromWholeData = this.getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService(indexOfItem) // get 5 Or LessThan 5 of doctorIdHostpitalIds in order wise using index of given input of doctorInfoListAndSlotsData
            debugger
            const setDoctorIdHostpitalIdsArrayMap = new Map();
            orderedDataFromWholeData.map((item) => {
                const doctorIdFromItem = item.doctor_id;
                const hospitalIdFromItem = item.hospitalInfo && item.hospitalInfo.hospital_id;
                if (setDoctorIdHostpitalIdsArrayMap.has(doctorIdFromItem)) {  //Execute condition  when Doctor Id is repeated;
                    console.log('setDoctorIdHostpitalIdsArrayMap.has(docId)====>', setDoctorIdHostpitalIdsArrayMap.has(doctorIdFromItem));
                    let baCupDocHospitalIdsObj = setDoctorIdHostpitalIdsArrayMap.get(doctorIdFromItem);
                    console.log('baCupDocHospitalIdsObj====>', baCupDocHospitalIdsObj);
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
            console.log('reqData4Availability=====>', reqData4Availability);
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchDoctorAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            console.log('resultSlotsData======>', JSON.stringify(resultSlotsData));
            debugger
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
            debugger
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }
    /*  Set Doctor Availability Slots data by doctorIdHostpitalIds   */
    setDoctorAvailabilitySlotsDataByDocAndHospitalIds = (SourceOfSlotsDataArray) => {
        //debugger
        SourceOfSlotsDataArray.map((item) => {
            const baCupOfDocInfo = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(item.doctorIdHostpitalId);
            const finalSlotsDataObj = { ...baCupOfDocInfo.slotData, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            delete baCupOfDocInfo.slotData
            const finalDocAndAvailabilityObj = {
                ...baCupOfDocInfo, slotData: finalSlotsDataObj
            }
            this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(item.doctorIdHostpitalId, finalDocAndAvailabilityObj)
        });
        console.log('Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values())===>', JSON.stringify(Array.from(this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values())));
        //debugger
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


    renderSponsorDoctorList(item) {   // Need to Implement Sponsors card items
    }
    render() {
        const { bookAppointmentData: { doctorInfoListAndSlotsData, filteredDoctorData } } = this.props;
        debugger
        const { isLoading } = this.state;
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
                            {doctorInfoListAndSlotsData.length === 0 ? <RenderListNotFound text={' No Doctor list found!'} />
                                :
                                <View>
                                    <View style={{ borderBottomColor: '#B6B6B6', borderBottomWidth: 0.5, paddingBottom: 8 }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 10 }}>Recommended <Text style={{ color: '#775DA3', fontFamily: 'OpenSans', fontSize: 12 }}>Prime Doctors</Text> in Hearing Specialist near you</Text>
                                        <ScrollView horizontal={true} style={{ marginTop: 8 }}>
                                            <FlatList
                                                horizontal
                                                data={filteredDoctorData || []}
                                                extraData={this.state.renderRefreshCount}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item }) =>
                                                    item.isDoctorIdHostpitalIdSponsored === true ? this.renderSponsorDoctorList(item) : null
                                                } />
                                        </ScrollView>
                                    </View>
                                    <FlatList
                                        data={doctorInfoListAndSlotsData}
                                        extraData={this.state.renderRefreshCount}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            item.isDoctorIdHostpitalIdSponsored === true ? null : this.renderDoctorCard(item, index)
                                        } />
                                </View>}
                        </View>
                    </Content>
                }
            </Container >
        )
    }
    renderDoctorInformationCard(item) {
        const { isLoggedIn, currentDate } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDateObjOfDoctorIds[item.doctorIdHostpitalId] || currentDate], item.slotData, item.doctorIdHostpitalId)
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
        const { showedFee } = this.state;
        let selectedSlotIndex = this.selectedSlotByDoctorIdsObj[doctorIdHostpitalId] !== undefined ? this.selectedSlotByDoctorIdsObj[doctorIdHostpitalId] : -1
        return (
            <View>
                <RenderSlots
                    selectedDateObjOfDoctorIds={this.selectedDateObjOfDoctorIds}
                    selectedSlotItemByDoctorIds={this.selectedSlotItemByDoctorIds}
                    slotDetails={{ selectedSlotIndex, slotData, doctorIdHostpitalId }}
                    // shouldUpdate={`${doctorIdHostpitalId}-${selectedSlotIndex}`}
                    onSlotItemPress={(doctorIdHostpitalId, selectedSlot, selectedSlotIndex) => this.onSlotItemPress(doctorIdHostpitalId, selectedSlot, selectedSlotIndex)}
                >
                </RenderSlots>
            </View>
        )
    }


    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, doctorIdHostpitalId, indexOfItem) {
        this.selectedDateObjOfDoctorIds[doctorIdHostpitalId] = selectedDate;
        this.selectedSlotByDoctorIdsObj[doctorIdHostpitalId] = -1;
        this.selectedSlotItemByDoctorIds[doctorIdHostpitalId] = null;
        if (this.availabilitySlotsDatesArry.includes(selectedDate) === false) {
            const endDateByMoment = addMoment(getMoment(selectedDate), 7, 'days');
            this.getDoctorAvailabilitySlots(doctorIdHostpitalId, getMoment(selectedDate), endDateByMoment, indexOfItem);
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    callSlotsServiceWhenOnEndReached = (doctorIdHostpitalId, availabilitySlotsDatesArry, indexOfItem) => { // call availability slots service when change dates on next week
        const finalIndex = availabilitySlotsDatesArry.length
        const lastProcessedDate = availabilitySlotsDatesArry[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.availabilitySlotsDatesArry.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            this.getDoctorAvailabilitySlots(doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem);
        }
    }
    renderDatesOnFlatList(doctorIdHostpitalId, slotData, indexOfItem) {
        const selectedDate = this.selectedDateObjOfDoctorIds[doctorIdHostpitalId] || this.state.currentDate;
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
                    selectedDateObjOfDoctorIds={this.selectedDateObjOfDoctorIds}
                    selectedSlotItemByDoctorIds={this.selectedSlotItemByDoctorIds}
                    availabilitySlotsDatesArry={this.availabilitySlotsDatesArry}
                    onDateChanged={(item, doctorIdHostpitalId) => this.onDateChanged(item, doctorIdHostpitalId)}
                    callSlotsServiceWhenOnEndReached={(doctorIdHostpitalId, availabilitySlotsDatesArry, indexOfItem) => {
                        this.callSlotsServiceWhenOnEndReached(doctorIdHostpitalId, availabilitySlotsDatesArry, indexOfItem)
                    }}
                    shouldUpdate={`${doctorIdHostpitalId}-${selectedDate}`}
                >
                </RenderDatesList>
            </View>
        )
    }

    onBookPress = async (doctorIdHostpitalId, indexOfItem) => {
        try {
            this.setState({ isSlotsLoading: true, isSlotsLoadingByRespectedItem: doctorIdHostpitalId });
            const { expandedDoctorIdHospitalsToShowSlotsData } = this.state;
            if (expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHostpitalId) !== -1) {
                expandedDoctorIdHospitalsToShowSlotsData.splice(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHostpitalId), 1)
            } else {
                expandedDoctorIdHospitalsToShowSlotsData.push(doctorIdHostpitalId);
            }
            const startDateByMoment = addMoment(this.state.currentDate)
            const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
            if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(doctorIdHostpitalId).slotData == undefined) {
                await this.getDoctorAvailabilitySlots(doctorIdHostpitalId, startDateByMoment, endDateByMoment, indexOfItem);
            }
            else {
                this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
            }
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
        catch (Ex) {
            console.log(Ex);
        }
        finally {
            this.setState({ isSlotsLoading: false });
        }
    }

    renderDoctorCard(item, indexOfItem) {
        const { expandedDoctorIdHospitalsToShowSlotsData, isSlotsLoading } = this.state;
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
                                        {!expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId, indexOfItem)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity> :
                                            null}
                                        {this.state.isSlotsLoadingByRespectedItem == item.doctorIdHostpitalId ?
                                            isSlotsLoading == true ?
                                                <View style={{ marginTop: 6 }}>
                                                    <ActivityIndicator
                                                        animating={isSlotsLoading}
                                                        size="large"
                                                        color='green'
                                                    />
                                                </View>
                                                : null
                                            : null}
                                    </Col>
                                </Row>
                                {expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?
                                    item.slotData ?
                                        <View>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date and time</Text>
                                            </Row>
                                            {this.renderDatesOnFlatList(item.doctorIdHostpitalId, item.slotData, indexOfItem)}
                                            {
                                                item.slotData[this.selectedDateObjOfDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate] !== undefined ?
                                                    this.renderAvailableSlots(item.doctorIdHostpitalId, item.slotData[this.selectedDateObjOfDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate])
                                                    : <RenderNoSlotsAvailable
                                                        text={'No Slots Available'}
                                                    />
                                            }
                                            <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        <Text style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                        <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{this.selectedSlotItemByDoctorIds[item.doctorIdHostpitalId] ? formatDate(this.selectedSlotItemByDoctorIds[item.doctorIdHostpitalId].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                    </Col>
                                                    <Col size={4}>
                                                        <TouchableOpacity
                                                            onPress={() => { console.log('......Pressing....'); this.onPressToContinue4PaymentReview(item, this.selectedSlotItemByDoctorIds[item.doctorIdHostpitalId], item.doctorIdHostpitalId) }}
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