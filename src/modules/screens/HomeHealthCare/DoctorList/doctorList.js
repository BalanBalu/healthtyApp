import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon, Input } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import styles from '../../CommonAll/styles'
import {
    SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
    SET_FILTERED_DOCTOR_DATA,
    SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
    searchByHomeHealthcareDocDetailsService,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    addFavoritesToDocByUserService,
    fetchDocHomeHealthcareAvailabilitySlotsService,
    serviceOfUpdateDocSponsorViewCountByUser,
    getFavoriteListCount4PatientService,
    SET_PREVIOUS_DOC_LIST_WHEN_CLEAR_FILTER,
} from '../../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, getMoment } from '../../../../setup/helpers';
import { Loader } from '../../../../components/ContentLoader';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { acceptNumbersOnly, debounce } from '../../../common';
import { store } from '../../../../setup/store';
import { RenderListNotFound, RenderNoSlotsAvailable } from '../../CommonAll/components';
import { enumerateStartToEndDates, sortByPrimeDoctors } from '../../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
import RenderDatesList from './RenderDateList'
import Styles from '../Styles';
const CALL_AVAILABILITY_SLOTS_SERVICE_BY_NO_OF_IDS_COUNT = 5;
const PAGINATION_COUNT_FOR_GET_DOCTORS_LIST = 8;
class DoctorList extends Component {
    weekWiseDatesList = [];
    docInfoAndAvailableSlotsMapByDoctorId = new Map();
    selectedDate4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotIndex4DocIdHostpitalIdToStoreInObj = {};
    selectedSlotItem4DocIdHostpitalIdToStoreInObj = {};
    totalSearchedDoctorIdsArray = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            isLoadingNextWeekAvailabilitySlots: false,
            expandItemOfDocIdToShowSlotsData: [],
            storeFeeBySelectedSlotOfDocIdHostpitalIdInObj: {},
            isLoggedIn: false,
            renderRefreshCount: 1,
            isLoading: true,
            isLoadingDatesAndSlots: false,
            isLoadingMoreDocList: false,
            doctorInfoListAndSlotsData1: [],
            pinCode: '',
            searchedInputTextValue: '',
            searchedInputPinCodeValue: '',
        }
        this.conditionFromFilterPage = false,
            this.isEnabledLoadMoreData = true;
        this.selectedDataFromFilterPage = null;
        this.incrementPaginationCount = 0;
        this.onEndReachedIsTriggedFromRenderDateList = false;
        this.defaultInputText4FetchDocList = 'Primary care';
        this.defaultPinCode4FetchDocList = '600053';

        this.callGetDocListService = debounce(this.callGetDocListService, 300);
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
        if (!this.conditionFromFilterPage) {
            await store.dispatch(
                {
                    type: SET_PREVIOUS_DOC_LIST_WHEN_CLEAR_FILTER,
                    data: false
                },
            );
        }

    }
    searchByDoctorDetails = async () => {
        try {
            const { bookAppointmentData: { getPreviousDocListWhenClearFilter } } = this.props;
            debugger
            let type;
            let reqData4ServiceCall = {}
            reqData4ServiceCall.locationData = this.defaultPinCode4FetchDocList ? { from_pincode: this.defaultPinCode4FetchDocList, to_pincode: this.defaultPinCode4FetchDocList } : { from_pincode: this.state.searchedInputPinCodeValue, to_pincode: this.state.searchedInputPinCodeValue };
            reqData4ServiceCall.inputText = this.defaultInputText4FetchDocList ? this.defaultInputText4FetchDocList : this.state.searchedInputTextValue;
            debugger
            if (this.conditionFromFilterPage && !getPreviousDocListWhenClearFilter) {
                type = 'filter';
                // reqData4ServiceCall = { ...reqData4ServiceCall, ...this.selectedDataFromFilterPage }
            }
            else if (!this.defaultInputText4FetchDocList && !this.defaultPinCode4FetchDocList && !this.state.searchedInputTextValue) {
                type = 'location'
            }
            else {
                type = 'search';
            }
            debugger
            const docListResponse = await searchByHomeHealthcareDocDetailsService(type, reqData4ServiceCall, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_DOCTORS_LIST);
            // console.log('docListResponse====>', JSON.stringify(docListResponse));
            debugger
            if (docListResponse.success) {
                debugger
                this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_DOCTORS_LIST;
                const searchedDoctorIdsArray = [];
                const docListData = docListResponse.data || [];
                docListData.map(item => {
                    debugger
                    searchedDoctorIdsArray.push(item.doctor_id);
                    this.docInfoAndAvailableSlotsMapByDoctorId.set(item.doctor_id, item);
                    debugger
                })
                debugger
                await Promise.all([
                    ServiceOfGetDoctorFavoriteListCount4Pat(searchedDoctorIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                    serviceOfGetTotalReviewsCount4Doctors(searchedDoctorIdsArray).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
                ]);
                debugger
                let doctorInfoList = Array.from(this.docInfoAndAvailableSlotsMapByDoctorId.values()) || [];
                // console.log('doctorInfoList=-==>', activeSponsor, doctorInfoList);
                debugger
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
                debugger
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

    onChangeInputTextValue = async (enteredText) => {
        await this.setState({ searchedInputTextValue: enteredText });
        this.defaultInputText4FetchDocList = '';
        this.incrementPaginationCount = 0;
        this.callGetDocListService();  // Call the search list API with Debounce method
    }

    callGetDocListService = async () => {
        this.isEnabledLoadMoreData = true;
        // await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props
        this.docInfoAndAvailableSlotsMapByDoctorId.clear();
        await this.searchByDoctorDetails();
    }
    onChangeInputPinCodeValue = async (enteredPinCode) => {
        await this.setState({ searchedInputPinCodeValue: enteredPinCode });
        this.defaultPinCode4FetchDocList = '';
        this.incrementPaginationCount = 0;
        this.callGetDocListService();  // Call the search list API with Debounce method
    }
    render() {
        const { bookAppointmentData: { doctorInfoListAndSlotsData, } } = this.props;
        const { searchedInputTextValue, searchedInputPinCodeValue, isLoading, isLoadingMoreDocList } = this.state;
        if (isLoading) return <Loader style='list' />;
        return (
            <Container style={styles.container}>
                <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                    <Row style={{ height: 35, alignItems: 'center' }}>
                        <Col size={5} style={{ flexDirection: 'row', marginLeft: 5, justifyContent: 'center' }} onPress={() => this.sortByTopRatings(doctorInfoListAndSlotsData)}>
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
                <View style={{ padding: 10, paddingBottom: 10, height: 45 }}>
                    <Grid>
                        <Col size={10}>
                            <Item style={styles.specialismInput} >
                                <Input
                                    placeholder='Search by Specialism ...'
                                    style={{ fontSize: 12, width: '100%', }}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    onChangeText={(text) => { this.onChangeInputTextValue(text) }}
                                    value={searchedInputTextValue}
                                    returnKeyType={'go'}
                                    multiline={false} />
                                <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                    <Icon name='ios-search' style={{ color: '#909090', fontSize: 20 }} />
                                </TouchableOpacity>
                            </Item>
                        </Col>
                    </Grid>
                </View>
                <View>
                    <Row style={{ marginTop: 5, padding: 10, }}>
                        <Col size={7}>
                            <Text style={styles.showingDoctorText}>Showing Doctors in the <Text style={styles.picodeText}> PinCode -  {this.defaultPinCode4FetchDocList ? this.defaultPinCode4FetchDocList : searchedInputPinCodeValue}</Text></Text>
                        </Col>
                        <Col size={3}>
                            <View style={{ borderRadius: 5, height: 20, justifyContent: 'center', backgroundColor: '#F0F0F0' }}>
                                <Item style={{ borderBottomWidth: 0 }}>
                                    <Input placeholder='Enter PinCode'
                                        style={{ fontSize: 12 }}
                                        keyboardType="numeric"
                                        maxLength={7}
                                        onChangeText={pinCode => acceptNumbersOnly(pinCode) == true || pinCode === '' ? this.onChangeInputPinCodeValue(pinCode) : null}
                                        value={searchedInputPinCodeValue}
                                    />
                                </Item>
                            </View>
                        </Col>
                    </Row>
                </View>
                {/* <View style={{ marginTop: 15 }}> */}
                {doctorInfoListAndSlotsData.length ?
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
                {/* </View> */}
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
            // console.log('calling On End reached=====>');
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
                text: 'Please Select a Slot to continue booking',
                type: 'warning',
                duration: 3000
            })
            return;
        }
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        doctorData.doctorName = doctorData.first_name + ' ' + doctorData.last_name;
        doctorData.doctorId = doctorData.doctor_id;
        const confirmSlotDetails = { ...doctorData, slotData: selectedSlotItemByDoctor };
        this.props.navigation.navigate('HomeHealthcareConfirmation', { resultconfirmSlotDetails: confirmSlotDetails })
    }


    onPressGoToBookAppointmentPage(doctorItemData) {
        // this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        // doctorItemData.doctorId = doctorItemData.doctor_id;
        // const doctorItemHaveSlotsDataObj = this.docInfoAndAvailableSlotsMapByDoctorId.get(doctorItemData.doctor_id).slotData;
        // if (doctorItemHaveSlotsDataObj) {
        //     doctorItemData.slotData = doctorItemHaveSlotsDataObj;
        // }
        // const singleDoctorItemData = { ...doctorItemData };
        // this.props.navigation.navigate('Doctor Details Preview', { doctorId: doctorItemData.doctor_id, singleDoctorItemData: singleDoctorItemData, weekWiseDatesList: this.weekWiseDatesList })
    }

    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctor_id, item) {
        if (selectedSlotData) {
            const selectedSlotIndex = this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctor_id] || 0;
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
            const availableOn = moment(selectedSlotData[0].slotDate).format('ddd, DD MMM YY');
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
            this.weekWiseDatesList = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.weekWiseDatesList);
            const orderedDataFromWholeData = this.getOrderDataByIndexOfItemFromWholeData4CallAavailabilityService(indexOfItem) // get 5 Or LessThan 5 of doctor_ids in order wise using index of given input of doctorInfoListAndSlotsData
            const reqDataDoctorIdsArry = [];
            orderedDataFromWholeData.map((item) => {
                reqDataDoctorIdsArry.push(item.doctor_id)
            })
            const reqData4Availability = {
                "doctorIds": reqDataDoctorIdsArry
            }
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchDocHomeHealthcareAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            // console.log('resultSlotsData====>' + JSON.stringify(resultSlotsData))

            if (resultSlotsData.success) {
                const availabilitySlotsData = resultSlotsData.data;
                if (availabilitySlotsData.length != 0) {
                    this.setDoctorAvailabilitySlotsDataByDocAndHospitalIds(availabilitySlotsData || []);
                    const docInfoAndAvailableSlotsMap = Array.from(this.docInfoAndAvailableSlotsMapByDoctorId.values());
                    debugger

                    store.dispatch({
                        type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
                        data: docInfoAndAvailableSlotsMap
                    });
                    debugger

                    // this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
                }
            }
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }
    /*  Set Doctor Availability Slots data by doctor_ids   */
    setDoctorAvailabilitySlotsDataByDocAndHospitalIds = (SourceOfSlotsDataArray) => {
        debugger
        SourceOfSlotsDataArray.map((item) => {
            debugger

            const baCupOfDocInfo = this.docInfoAndAvailableSlotsMapByDoctorId.get(item.doctor_id);
            const finalSlotsDataObj = { ...baCupOfDocInfo.slotData, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            delete baCupOfDocInfo.slotData
            const finalDocAndAvailabilityObj = {
                ...baCupOfDocInfo, slotData: finalSlotsDataObj
            }
            debugger

            this.docInfoAndAvailableSlotsMapByDoctorId.set(item.doctor_id, finalDocAndAvailabilityObj);
            debugger

        });
    }

    renderDoctorInformationCard(item) {
        const { isLoggedIn, currentDate } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || currentDate], item.slotData, item.doctor_id, item)
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


    /* Change the Date from Date Picker */
    onDateChanged = async (selectedDate, doctor_id, indexOfItem) => {
        this.onEndReachedIsTriggedFromRenderDateList = false
        this.selectedDate4DocIdHostpitalIdToStoreInObj[doctor_id] = selectedDate;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctor_id] = -1;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctor_id] = null;
        if (this.weekWiseDatesList.includes(selectedDate) === false) {
            const endDateByMoment = addMoment(getMoment(selectedDate), 7, 'days');
            await this.getDoctorAvailabilitySlots(doctor_id, getMoment(selectedDate), endDateByMoment, indexOfItem);
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
        return (
            <View>
                <RenderDatesList
                    selectedDate={selectedDate}
                    slotData={slotData}
                    indexOfItem={indexOfItem}
                    doctor_id={doctor_id}
                    selectedDate4DocIdHostpitalIdToStoreInObj={this.selectedDate4DocIdHostpitalIdToStoreInObj}
                    selectedSlotItem4DocIdHostpitalIdToStoreInObj={this.selectedSlotItem4DocIdHostpitalIdToStoreInObj}
                    weekWiseDatesList={this.weekWiseDatesList}
                    onDateChanged={(item, doctor_id, indexOfItem) => { this.onDateChanged(item, doctor_id, indexOfItem) }}
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

    onPressBookingAvailableButton(doctor_id, selectedAvailableBookingItem, item, index) {
        const { storeFeeBySelectedSlotOfDocIdHostpitalIdInObj } = this.state;
        this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[doctor_id] = index;
        this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[doctor_id] = selectedAvailableBookingItem;
        if ((selectedAvailableBookingItem.fee != storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctor_id])) {
            if (storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctor_id] != undefined) {
                Toast.show({
                    text: 'Appointment Fee Updated',
                    type: 'warning',
                    duration: 3000
                });
            }
            storeFeeBySelectedSlotOfDocIdHostpitalIdInObj[doctor_id] = selectedAvailableBookingItem.fee
            this.setState({ storeFeeBySelectedSlotOfDocIdHostpitalIdInObj });
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    renderDoctorCard(item, indexOfItem) {
        const { currentDate, expandItemOfDocIdToShowSlotsData, isLoadingDatesAndSlots } = this.state;
        return (
            <View style={{ marginTop: 15 }}>
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
                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}> {this.getNextAvailableDateAndTime(item.slotData && item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || currentDate], item)}</Text>
                                    </Col>
                                    <Col style={{ width: "15%" }}>
                                        {!expandItemOfDocIdToShowSlotsData.includes(item.doctor_id) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.doctor_id, indexOfItem)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 18, height: 31, width: 66, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, marginLeft: -6 }}>
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
                                                <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date and time</Text>
                                            </Row>
                                            {this.renderDatesOnFlatList(item.doctor_id, item.slotData, indexOfItem)}
                                            {
                                                item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || this.state.currentDate] !== undefined ?
                                                    <Row style={{ justifyContent: 'center', marginTop: 20 }}>
                                                        <Button onPress={() => this.onPressBookingAvailableButton(item.doctor_id, item.slotData[this.selectedDate4DocIdHostpitalIdToStoreInObj[item.doctor_id] || this.state.currentDate][0], item, 0)} style={this.selectedSlotIndex4DocIdHostpitalIdToStoreInObj[item.doctor_id] == 0 ? Styles.enabledBookingAvailableBtn : Styles.defaultBookingAvailableBtn}>
                                                            <Text>{"Booking Available"}</Text>
                                                        </Button>
                                                    </Row>
                                                    : <RenderNoSlotsAvailable
                                                        text={'Booking Not Available'}
                                                    />
                                            }
                                            <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                                <Row style={{ marginTop: 10 }}>
                                                    <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                        <Text style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                        <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id] ? formatDate(this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id].slotDate, 'ddd DD MMM YYYY') : null}</Text>
                                                    </Col>
                                                    <Col size={4}>
                                                        <TouchableOpacity
                                                            onPress={() => { console.log('......Pressing....'); this.onPressToContinue4PaymentReview(item, this.selectedSlotItem4DocIdHostpitalIdToStoreInObj[item.doctor_id], item.doctor_id) }}
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
