import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';

import {
    searchDoctorList, fetchAvailabilitySlots,
    getMultipleDoctorDetails,
    getDoctorsReviewsCount,
    getPatientWishList,
    SET_BOOK_APP_DOCTOR_DATA,
    SET_SINGLE_DOCTOR_DATA,
    SET_FILTERED_DOCTOR_DATA,
    addToWishListDoctor,
    getDoctorFaviouteList,
    getAllDoctorsActiveSponsorDetails,
    updateSponsorViewCount
} from '../../providers/bookappointment/bookappointment.action';
import { formatDate, addMoment, addTimeUnit, getMoment, intersection, getUnixTimeStamp } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import {
    renderDoctorImage,
    getDoctorSpecialist,
    getDoctorEducation,
    getDoctorExperience
} from '../../common';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import { store } from '../../../setup/store';
let fields = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,experience,profile_image";
let conditionFromFilterPage;
const SELECTED_EXPERIENCE_START_END_YEARS = {
    10: { start: 0, end: 10 },
    20: { start: 10, end: 20 },
    30: { start: 20, end: 30 },
    40: { start: 40, end: 100 }
}

let currentDoctorOrder = 'ASC';
let doctorDataInMap = new Map();
class doctorSearchList extends Component {
    processedDoctorIds = [];
    processedDoctorData = [];
    processedDoctorDetailsData = [];
    processedDoctorAvailabilityDates = [];

    doctorDetailsMap = new Map();

    constructor(props) {
        super(props)
        conditionFromFilterPage = null,  // for check FilterPage Values

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
                isLoggedIn: null,
                refreshCount: 0
            }
    }

    navigateToFilters() {
        this.props.navigation.navigate('Filters', {
            filterData: this.state.filterData,
            filterBySelectedAvailabilityDateCount: this.state.filterBySelectedAvailabilityDateCount
        })
    }
    componentDidMount = async () => {
        let userId = await AsyncStorage.getItem('userId');
        this.getPatientSearchData();
        if (userId) {
            this.getPatientWishLists();
            this.setState({ isLoggedIn: true })
        } else {
            this.setState({ isLoggedIn: false })
        }
    }


    componentNavigationMount = async () => {
        console.log('is Navigation Mount is working');
        this.setState({ refreshCount: this.state.refreshCount + 1 });
        const { navigation } = this.props;
        const filterData = navigation.getParam('filterData');
        if (filterData) {
            const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount');
            conditionFromFilterPage = navigation.getParam('ConditionFromFilter');
            await this.setState({ filterData: filterData, filterBySelectedAvailabilityDateCount: filterBySelectedAvailabilityDateCount })
            if (conditionFromFilterPage == true) {
                console.log('comming FilterPage');
                this.renderDoctorListByFilteredData(filterData, filterBySelectedAvailabilityDateCount)
            }
        }
    }

    renderDoctorListByFilteredData = async (filterData, availtyDateCount) => {
        console.log('filterData' + JSON.stringify(filterData))
        console.log('availtyDateCount' + availtyDateCount);
        let genderPreferenceMatchedList = [];
        let languageMatchedList = [];
        let categoryMatchedList = [];
        let servicesMatchedList = [];
        let experienceMatchedList = [];
        let availabilityMatchedList = [];
        const { bookappointment: { doctorData } } = this.props;

        doctorData.forEach((doctorElement) => {
            let doctorIdHostpitalId = doctorElement.doctorIdHostpitalId
            debugger
            if (filterData.gender) {
                if (doctorElement.gender === filterData.gender) {
                    genderPreferenceMatchedList.push(doctorIdHostpitalId);
                }
            }
            if (filterData.language) {
                doctorElement.language.forEach((docLanguage) => {
                    filterData.language.forEach((filLanguage) => {
                        if (docLanguage.toLowerCase().includes(filLanguage.toLowerCase())) {
                            languageMatchedList.push(doctorIdHostpitalId)
                        }
                    })
                })
            }

            if (filterData.experience && doctorElement.calulatedExperience) {
                let doctorExperienceMonths = ((doctorElement.calulatedExperience.year || 0) * 12) + doctorElement.calulatedExperience.month || 0
                let selectedFilterInYearStartEnd = SELECTED_EXPERIENCE_START_END_YEARS[filterData.experience];

                let filteredStartMonth = selectedFilterInYearStartEnd.start * 12;
                let filteredEndMonth = selectedFilterInYearStartEnd.end * 12;

                if (doctorExperienceMonths > filteredStartMonth && doctorExperienceMonths <= filteredEndMonth) {
                    experienceMatchedList.push(doctorIdHostpitalId);
                }

            }
            if (filterData.category) {
                let specialistArray = doctorElement.specialist ? doctorElement.specialist : [];
                specialistArray.forEach((docSpecialist) => {
                    if (docSpecialist.category === filterData.category) {
                        categoryMatchedList.push(doctorIdHostpitalId)
                    }
                })
            }

            if (filterData.service) {
                let specialistArray = doctorElement.specialist ? doctorElement.specialist : [];
                specialistArray.forEach((docSpecialist) => {
                    if (filterData.service.includes(docSpecialist.service)) {
                        servicesMatchedList.push(doctorIdHostpitalId)
                    }
                })
            }
            if (availtyDateCount !== 0) {
                for (i = 0; i < availtyDateCount; i++) {
                    let availabilityDate = formatDate(addTimeUnit(this.state.currentDate, i, 'days'), "YYYY-MM-DD");
                    if (doctorElement.slotData[availabilityDate]) {
                        availabilityMatchedList.push(doctorElement.doctorIdHostpitalId)
                    }
                }
            }
        });

        let selectedFiltesArray = [];

        if (availtyDateCount !== 0) {
            selectedFiltesArray.push(availabilityMatchedList);
        }


        if (filterData) {
            if (filterData.gender) {
                selectedFiltesArray.push(genderPreferenceMatchedList);
                console.log('genderPreferenceMatchedList:' + genderPreferenceMatchedList)
            }
            if (filterData.language) {
                selectedFiltesArray.push(languageMatchedList);
                console.log('languageMatchedList:' + languageMatchedList)
            }
            if (filterData.experience) {
                selectedFiltesArray.push(experienceMatchedList);
                console.log('experienceMatchedList:' + experienceMatchedList)
            }
            if (filterData.category) {
                selectedFiltesArray.push(categoryMatchedList);
            }
            if (filterData.service) {
                selectedFiltesArray.push(servicesMatchedList);
                console.log('servicesMatchedList:' + servicesMatchedList)
            }
        }
        /* Finally Rendered the Doctor Lists  */
        console.log("selectedFiltesArray" + JSON.stringify(selectedFiltesArray))
        if (filterData || availtyDateCount !== 0) {
            console.log('Came Filter Availability and DocData , Filter only DocDatas  ')
            let filteredDocListArray = intersection(selectedFiltesArray);
            let filteredDocData = [];
            if (filteredDocListArray.length === 0) {
                Toast.show({
                    text: 'Doctors Not found!..Choose Filter again',
                    type: "danger",
                    duration: 5000,
                })
            } else {
                filteredDocListArray.forEach(doctorIdHospitalId => {
                    filteredDocData.push(doctorDataInMap.get(String(doctorIdHospitalId)));
                });
            }
            store.dispatch({
                type: SET_FILTERED_DOCTOR_DATA,
                data: filteredDocData
            })
        }
    }
    /* Insert Doctors Favourite Lists  */
    addToWishList = async (doctorId) => {
        let userId = await AsyncStorage.getItem('userId');
        let result = await addToWishListDoctor(doctorId, userId);
        if (result)
            Toast.show({
                text: result.message,
                type: "success",
                duration: 3000,
            })
        this.setState({ refreshCount: this.state.refreshCount + 1 });
    }


    getPatientWishLists = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            getPatientWishList(userId);
        } catch (e) {
            console.log(e);
        }
    }


    /* get the Doctor Id's list from Search Module  */
    getPatientSearchData = async () => {
        this.setState({ isLoading: true });
        const { navigation } = this.props;
        const searchedInputValues = navigation.getParam('resultData');
        console.log(searchedInputValues);
        let endDateMoment = addMoment(this.state.selectedDate, 7, 'days')

        const userId = await AsyncStorage.getItem('userId');
        let resultData = await searchDoctorList(userId, searchedInputValues);
        console.log('Result of patient Search Data ' + JSON.stringify(resultData));
        await this.setState({ searchedResultData: resultData.data });
        if (resultData.success) {
            let doctorIds = resultData.data.map((element) => {
                return element.doctor_id
            }).join(',');
            this.setState({ getSearchedDoctorIds: doctorIds });
            this.getDoctorAllDetails(this.state.getSearchedDoctorIds, getMoment(this.state.selectedDate), endDateMoment);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
        } else {
            store.dispatch({
                type: SET_BOOK_APP_DOCTOR_DATA,
                data: []
            })
            store.dispatch({
                type: SET_FILTERED_DOCTOR_DATA,
                data: []
            })
            this.setState({ isLoading: false })
        }
    }
    processFinalData(resultData) {

        for (let docCount = 0; docCount < resultData.length; docCount++) {
            let doctorSlotData = resultData[docCount];
            if (this.processedDoctorIds.includes(doctorSlotData.doctorIdHostpitalId)) { // condition to append another week conditions
                let index = this.processedDoctorIds.indexOf(doctorSlotData.doctorIdHostpitalId);
                //let processedSlotData = this.processedDoctorData[index].slotData;
                for (var key in doctorSlotData.slotData) {
                    if (this.processedDoctorDetailsData[index].slotData[key] === undefined) {
                        this.processedDoctorDetailsData[index].slotData[key] = doctorSlotData.slotData[key]
                    }
                }
            } else {
                this.processedDoctorIds.push(doctorSlotData.doctorIdHostpitalId);
                let doctorDetailsData = this.doctorDetailsMap.get(doctorSlotData.doctorId)
                let obj = {
                    ...doctorDetailsData,
                    doctorIdHostpitalId: doctorSlotData.doctorIdHostpitalId,
                    slotData: doctorSlotData.slotData,
                    location: doctorSlotData.slotData[Object.keys(doctorSlotData.slotData)[0]].length > 0 ? doctorSlotData.slotData[Object.keys(doctorSlotData.slotData)[0]][0].location : null,
                }
                this.processedDoctorDetailsData.push(obj);
            }
        }
        store.dispatch({
            type: SET_BOOK_APP_DOCTOR_DATA,
            data: this.processedDoctorDetailsData
        })
        store.dispatch({
            type: SET_FILTERED_DOCTOR_DATA,
            data: this.processedDoctorDetailsData
        })
        console.log(this.processedDoctorDetailsData);
        this.setState({ refreshCount: this.state.refreshCount + 1 });
        return this.processedDoctorDetailsData;
        this.setState({ doctorData: this.processedDoctorDetailsData });

    }
    async getDoctorAllDetails(doctorIds, startDate, endDate) {
        try {
            this.setState({ isLoading: true });

            const [resultDoctorDetails, slotData, patientReviesResult, favResult, getActiveSponsorDetails] = await Promise.all([
                this.getDoctorDetails(doctorIds).catch(res => console.log("Exception on  getDoctorDetails: " + res)),
                this.getAvailabilitySlots(doctorIds, startDate, endDate).catch(res => console.log("Exception" + res)),
                getDoctorsReviewsCount(doctorIds).catch(res => console.log("Exception on getPatientReviews" + res)),
                getDoctorFaviouteList(doctorIds).catch(res => console.log("Exception on getPatient Wish List" + res)),
                getAllDoctorsActiveSponsorDetails(doctorIds).catch(res => console.log("Exception on get All Doctors ActiveSponsor Details" + res))
            ]);

             console.log('There is No Active Sponsors for given list of Doctors' + JSON.stringify(getActiveSponsorDetails))
            if (getActiveSponsorDetails.data) {
                let sponsorIdArray = [];
                getActiveSponsorDetails.data.map((ele) => {
                    sponsorIdArray.push(ele._id)
                });
                this.updateSponsorViewersCount(sponsorIdArray)
            };

            resultDoctorDetails.forEach((element) => {
                this.doctorDetailsMap.set(element.doctor_id, element) // total_rating
            });

            let doctorData = this.processFinalData(slotData);

            this.setState({ refreshCount: this.state.refreshCount + 1 });
            doctorData.forEach((element) => {
                doctorDataInMap.set(String(element.doctorIdHostpitalId), element)
            });
        } catch (error) {
            console.log('exception on getting multiple Requests');
            console.log(error)
        } finally {
            this.setState({ isLoading: false });
        }
    };
    /* Update Active Sponsors count for Doctors */
    updateSponsorViewersCount = async (sponsorIdArray) => {
      try {
        let userId = await AsyncStorage.getItem('userId');
        if (!userId) userId = "NO_USER"
        let sponsorIds = {
            sponsorIds: sponsorIdArray
        }
        let resultData = await updateSponsorViewCount(userId, sponsorIds);
        console.log('successfully updated Doctors Sponsors counts ' + JSON.stringify(resultData.updatedResult))
      } catch (ex) {
          return {
              success: false, 
              message: 'Exception ' + ex
          }
      }
    }
    /*Get doctor specialist and Degree details*/

    getDoctorDetails = async (doctorIds) => {
        try {
            let doctorData = [];
            let resultDoctorDetails = await getMultipleDoctorDetails(doctorIds, fields);
            console.log(resultDoctorDetails);
            if (resultDoctorDetails.success) {
                doctorData = resultDoctorDetails.data;
                return doctorData;
            }
            console.log('finished loading get Doctor Details');

        } catch (ex) {
            console.log(ex);
            console.log('Exception occured on getMultplieDocDetail')
        }
        return doctorData;
    }

    async callGetAvailabilitySlot(getSearchedDoctorIds, startDate, endDate) {
        this.setState({ isAvailabilityLoading: true });
        let result = await this.getAvailabilitySlots(getSearchedDoctorIds, startDate, endDate);
        this.processFinalData(result);
        this.setState({ isAvailabilityLoading: false });

    }

    /* get the  Doctors Availability Slots */
    getAvailabilitySlots = async (getSearchedDoctorIds, startDate, endDate) => {
        console.log('started loading get availability');

        let availabilityData = [];
        this.enumarateDates(startDate, endDate)
        try {
            let totalSlotsInWeek = {
                startDate: formatDate(startDate, 'YYYY-MM-DD'),
                endDate: formatDate(endDate, 'YYYY-MM-DD')
            }
            let resultData = await fetchAvailabilitySlots(getSearchedDoctorIds, totalSlotsInWeek);

            if (resultData.success) {
                availabilityData = resultData.data
                return availabilityData
            }
        } catch (e) {
            console.log(e);
        }

        return availabilityData;

    }
    async enumarateDates(startDate, endDate) {
        let now = startDate.clone();
        while (now.isSameOrBefore(endDate)) {
            this.processedDoctorAvailabilityDates.push(now.format('YYYY-MM-DD'));
            now = now.add(1, 'day');
        }
        this.setState({ processedDoctorAvailabilityDates: this.processedDoctorAvailabilityDates });
        console.log('Process Dates are ' + this.state.processedDoctorAvailabilityDates);

    }

    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, doctorIdHostpitalId) {

        let { selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds } = this.state;

        selectedDatesByDoctorIds[doctorIdHostpitalId] = selectedDate;
        selectedSlotByDoctorIds[doctorIdHostpitalId] = -1;
        selectedSlotItemByDoctorIds[doctorIdHostpitalId] = null;

        this.setState({ selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount: this.state.refreshCount + 1 });

        if (this.processedDoctorAvailabilityDates.includes(selectedDate) === false) {
            let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');

            this.callGetAvailabilitySlot(this.state.getSearchedDoctorIds, getMoment(selectedDate), endDateMoment);

        }
        console.log('ended loading the onDateChanged')
    }

    /* Click the Slots from Doctor List page */
    onPressContinueForPaymentReview = async (doctorData, selectedSlotItemByDoctor, doctorIdHostpitalId) => {
         console.log(selectedSlotItemByDoctor);   
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
        console.log(confirmSlotDetails);
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })

    }
    async onSlotItemPress(doctorIdHostpitalId, item, index) {

        let { selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, showedFeeByDoctorIds } = this.state;

        selectedSlotByDoctorIds[doctorIdHostpitalId] = index;
        selectedSlotItemByDoctorIds[doctorIdHostpitalId] = item

        this.setState({ selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount: this.state.refreshCount + 1 });

        console.log( selectedSlotIndex + '. and index :' +  index) ;
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
        console.log( item);
    }





    navigateToBookAppointmentPage(doctorData) {
        doctorData.doctorId = doctorData.doctor_id;
        let requestData = {
            ...doctorData,
        }
        store.dispatch({
            type: SET_SINGLE_DOCTOR_DATA,
            data: requestData
        })
        console.log(requestData);
        this.props.navigation.navigate('Book Appointment', { doctorId: doctorData.doctor_id, processedAvailabilityDates: this.processedDoctorAvailabilityDates })
    }


    haveAvailableSlots(doctorIdHostpitalId, slotsData) {
        let { selectedSlotByDoctorIds, showedFee } = this.state;
        let selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] !== undefined ? selectedSlotByDoctorIds[doctorIdHostpitalId] : -1
        console.log('Selected slot index:' + selectedSlotIndex);
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
                                onPress={() => this.onSlotItemPress(doctorIdHostpitalId, item, index)}>
                                <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
                                {/* item.isSlotBooked ? <Text style={styles.slotBookedTextColor}>Booked</Text> : null */}
                            </TouchableOpacity>
                        </Col>
                    }
                    keyExtractor={(item, index) => index.toString()} />
                {/* <Col style={{width:'8%'}}></Col> */}
            </Row>
        )
    }
    getFeesBySelectedSlot(selectedSlotData, wholeSlotData, doctorIdHostpitalId) {

        let { selectedSlotByDoctorIds } = this.state;
        selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] || 0;
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
        console.log('started-loading-no-slots-available');
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
        console.log('you have pressed onBookPress');
        const { expandedDoctorIdHospitalsToShowSlotsData } = this.state;
        if (expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId) !== -1) {
            expandedDoctorIdHospitalsToShowSlotsData.splice(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId), 1)
        } else {
            expandedDoctorIdHospitalsToShowSlotsData.push(doctorIdHospitalId);
        }
        this.setState({ expandedDoctorIdHospitalsToShowSlotsData, refreshCount: this.state.refreshCount + 1 });
    }
    sortByTopRatings(filteredDoctorData) {
        const { bookappointment: { reviewsByDoctorIds } } = this.props;
           console.log(reviewsByDoctorIds);
        filteredData = filteredDoctorData.sort(function (a, b) {
            let ratingA = 0;
            let ratingB = 0;
            if (reviewsByDoctorIds[a.doctor_id]) {
                ratingA = reviewsByDoctorIds[a.doctor_id].average_rating || 0
            };
            if (reviewsByDoctorIds[b.doctor_id]) {
                ratingB = reviewsByDoctorIds[b.doctor_id].average_rating || 0
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


    render() {

        const { bookappointment: { patientWishListsDoctorIds, favouriteListCountByDoctorIds, reviewsByDoctorIds, filteredDoctorData } } = this.props;
        const { selectedDatesByDoctorIds, expandedDoctorIdHospitalsToShowSlotsData, isLoggedIn, selectedSlotItemByDoctorIds,
            processedDoctorAvailabilityDates,
            isLoading, isAvailabilityLoading
        } = this.state;
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
                                        <Col style={{ width: '55%', flexDirection: 'row' ,marginLeft:5,}} onPress={() => this.sortByTopRatings(filteredDoctorData)}>
                                        <Row>
                                                <Col style={{width:'15%'}}>
                                                <Icon name='ios-arrow-down' style={{ color: '#000', fontSize: 20,marginTop:5}} />

                                                </Col>
                                                <Col style={{width:'85%'}}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center',  marginTop: 5 }}>Top Rated </Text>

                                                </Col>
                                          
                                            </Row>
                                        </Col>
                                        {/* <Col style={{ width:'45%',alignItems: 'flex-start', flexDirection: 'row', }} onPress={() => this.navigateToFilters()}>
                                <Row>
                                  <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginLeft: 8,textAlign: 'center',marginTop:5 }}>Top Rated </Text>
                                  <Right><Icon name='ios-funnel' style={{ color: 'gray', marginRight:20, }}/></Right>
                                 
                                </Row>  
                        </Col> */}
                                        
                                        <Col style={{ width: '45%', alignItems: 'flex-start', flexDirection: 'row',borderLeftColor:'gray',borderLeftWidth:1 }} onPress={() => this.navigateToFilters()}>
                                            <Row >
                                            <Col style={{width:'35%',marginLeft:10}}>
                                      <Icon name='ios-funnel' style={{ color: 'gray' }} />
                                                </Col>
                                                <Col style={{width:'65%'}}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5 ,marginLeft:5,width:'100%'}}>Filters </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                               
                            </Card>

                            {filteredDoctorData.length === 0 ?
                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Doctors available! </Text>
                                </Item>
                                :
                                <FlatList
                                    data={filteredDoctorData}
                                    extraData={this.state.refreshCount}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        this.renderDoctorCard(item)
                                    } />
                            }
                        </View>
                    </Content>
                }

            </Container >
        )
    }
    renderDoctorCard(item) {
        const { bookappointment: { patientWishListsDoctorIds, favouriteListCountByDoctorIds, reviewsByDoctorIds } } = this.props;
        const { selectedDatesByDoctorIds, expandedDoctorIdHospitalsToShowSlotsData, isLoggedIn, selectedSlotItemByDoctorIds,
        
        } = this.state;
       const { fee, feeWithoutOffer } = this.getFeesBySelectedSlot(item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate], item.slotData, item.doctorIdHostpitalId)
        return (
            <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                                            <List style={{ borderBottomWidth: 0 }}>
                                                <ListItem>
                                                    <Grid >
                                                        <Row onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                            <Col style={{ width: '5%' }}>
                                                                <Thumbnail square source={renderDoctorImage(item)} style={{ height: 60, width: 60 }} />
                                                            </Col>
                                                            <Col style={{ width: '78%' }}>
                                                                <Row style={{ marginLeft: 55, }}>
                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{(item.prefix ? item.prefix + '. ' : '') + (item.first_name || '') + ' ' + (item.last_name || '')}</Text>
                                                                </Row>
                                                                <Row style={{ marginLeft: 55, }}>
                                                                    <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 11 }}>{(getDoctorEducation(item.education)) + ' ' + getDoctorSpecialist(item.specialist)}</Text>
                                                                </Row>
                                                                <Row style={{ marginLeft: 55, }}>

                                                                    <Text style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 12, fontWeight: 'bold' }}>
                                                                        {item.location.location.address.city + ' - ' + item.location.name}
                                                                    </Text>
                                                                </Row>
                                                            </Col>
                                                            <Col style={{ width: '17%' }}>
                                                                {isLoggedIn ?
                                                                    <Icon name="heart" onPress={() => this.addToWishList(item.doctor_id)}
                                                                        style={patientWishListsDoctorIds.includes(item.doctor_id) ? { marginLeft: 20, color: '#B22222', fontSize: 20 } : { marginLeft: 20, borderColor: '#fff', fontSize: 20 }}>
                                                                    </Icon> : null}
                                                                {/* <Row>
                                           <Text style={{ fontFamily: 'OpenSans',marginTop:20,fontSize:12,marginLeft:5 }}> 2.6km</Text>
                                         </Row> */}
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col style={{ width: "30%", marginTop: 20 }}>
                                                                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, }}> Experience</Text>
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, fontWeight: 'bold' }}>{getDoctorExperience(item.calulatedExperience)}</Text>
                                                            </Col>
                                                            <Col style={{ width: "25%", marginTop: 20 }}>
                                                                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, }}> Rating</Text>
                                                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                                    <StarRating
                                                                        fullStarColor='#FF9500'
                                                                        starSize={12} width={85}
                                                                        containerStyle={{ marginLeft: 15, marginTop: 2 }}
                                                                        disabled={true}
                                                                        rating={1}
                                                                        maxStars={1}
                                                                    />

                                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}> {reviewsByDoctorIds[item.doctor_id] !== undefined ? reviewsByDoctorIds[item.doctor_id].average_rating : ' 0'}</Text>
                                                                </View>

                                                            </Col>
                                                            <Col style={{ width: "25%", marginTop: 20 }}>

                                                                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5 }}> Favourite</Text>
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, fontWeight: 'bold' }}> {favouriteListCountByDoctorIds[item.doctor_id] !== undefined ? favouriteListCountByDoctorIds[item.doctor_id] : ' 0'}</Text>


                                                            </Col>
                                                            <Col style={{ width: "20%", marginTop: 20 }}>
                                                                <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 5, }}> Fees</Text>
                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 5 }}>{'\u20B9'}{fee} {' '}
                                                                 {fee !== feeWithoutOffer ?  
                                                                   <Text style={{ fontFamily: 'OpenSans', fontWeight: 'normal', fontSize: 12, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                                                      {'\u20B9'}{feeWithoutOffer}</Text> : null
                                                                 }
                                                          
                                                                </Text>
                                                                 </Col>
                                                        </Row>



                                                        <Row style={{ borderTopColor: '#000', borderTopWidth: 0.4, marginTop: 5 }} >
                                                            <Col style={{ width: "5%" }}>

                                                                <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />

                                                            </Col>
                                                            <Col style={{ width: "77%" }}>

                                                                <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}> {this.getDisplayAvailableTime(item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate], item.slotData)}</Text>
                                                            </Col>
                                                            <Col style={{ width: "18%" }}>
                                                                {!expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?
                                                                    <TouchableOpacity onPress={() => this.onBookPress(item.doctorIdHostpitalId)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center',  }}>
                                                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                                                    </TouchableOpacity> : null}
                                                            </Col>

                                                        </Row>

                                                        {expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ?

                                                            <View>

                                                                <Row style={{ marginTop: 10 }}>
                                                                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Select appoinment date and time</Text>
                                                                </Row>
                                                                {this.renderDatesOnFlatlist(item.slotData, selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate, item.doctorIdHostpitalId)}
                                                                {
                                                                    item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate] !== undefined ?
                                                                        this.haveAvailableSlots(item.doctorIdHostpitalId, item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate])
                                                                        : this.noAvailableSlots(item.doctorIdHostpitalId, item.slotData)
                                                                }

                                                                <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                                                <Row style={{ marginTop: 10 }}>
                                                                  <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                                    <Text note style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                                    <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans',  marginTop:5 }}>{selectedSlotItemByDoctorIds[item.doctorIdHostpitalId] ? formatDate(selectedSlotItemByDoctorIds[item.doctorIdHostpitalId].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                                  </Col>
                                                                 
                                                                 {/* <Col style={{ width: '35%' }}></Col> */}

                                                                        <Col size={4}>
                                                                            <TouchableOpacity
                                                                                onPress={() => { console.log('......Pressing....'); this.onPressContinueForPaymentReview(item, selectedSlotItemByDoctorIds[item.doctorIdHostpitalId], item.doctorIdHostpitalId) }}
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
        )
    }

    renderDatesOnFlatlist(slotData, selectedDate, doctorIdHostpitalId) {

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
                        <TouchableOpacity style={[styles.availabilityBG, selectedDate === item ? { backgroundColor: '#775DA3',alignItems:'center' } : { backgroundColor: '#ced6e0',alignItems:'center' }]}
                            onPress={() => this.onDateChanged(item, doctorIdHostpitalId)}>
                            <Text style={[{ fontSize: 12, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                            <Text style={[{ fontSize: 10, fontFamily: 'OpenSans' }, selectedDate === item ? { color: '#fff' } : { color: '#000' }]}>{slotData[item] ? slotData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available'}</Text>
                        </TouchableOpacity>
                    </Col>
                } keyExtractor={(item, index) => index.toString()} />
        )
    }

}

function bookApppointmentState(state) {
    return {
        bookappointment: state.bookappointment
    }
}
export default connect(bookApppointmentState)(doctorSearchList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },

    slotDefaultBgColor: {
        textAlign: 'center',
        backgroundColor: '#ced6e0',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
       
    },
    slotDefaultTextColor: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'OpenSans',
        paddingLeft: 5,
        paddingRight: 5
    },
    slotBookedBgColor: {
        textAlign: 'center',
        backgroundColor: '#A9A9A9', //'#775DA3',
        borderColor: '#000',
        marginTop: 10, height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
      
    },
    slotSelectedBgColor: {
        textAlign: 'center',
        backgroundColor: '#775DA3',
        borderColor: '#000',
        marginTop: 10,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        marginRight: 5,
        paddingLeft: 5,
        paddingRight: 5
     
    },
    slotBookedTextColor: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'OpenSans'
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