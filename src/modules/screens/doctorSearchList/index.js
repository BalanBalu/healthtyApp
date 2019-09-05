import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Right, Thumbnail, Body, Icon, DatePicker } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage, Slider } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { insertDoctorsWishList, searchDoctorList, fetchAvailabilitySlots, getMultipleDoctorDetails, getDoctorsReviewsCount, getPatientWishList, SET_BOOK_APP_SLOT_DATA, SET_BOOK_APP_DOCTOR_DATA, SET_SELECTED_DATE } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, addMoment, addTimeUnit, getMoment,addDate,dateDiff, findArrayObj, intersection } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { RenderHospitalAddress, renderProfileImage } from '../../common';
import { NavigationEvents } from 'react-navigation';
import Spinner from '../../../components/Spinner';
import moment from 'moment';

import { store } from '../../../setup/store';
import Swiper from 'react-native-swiper';

let conditionFromFilterPage;
const NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE = 3;
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
                isModalVisible: false,
                starCount: 0,
                doctorDetails: [],
                selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
                currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
                singleHospitalDataSlots: {
                    _id: null,
                    hospitalLocationData: {},
                    hospitalSlotArray: []
                },
                singleDataWithDoctorDetails: {},
                selectedSlotIndex: -1,
                selectedDoctorHospitalLocations: [],
                confirmSlotDetails: {},
                doctorData: [],
                searchedResultData: [],
                reviewData: null,
                confirm_button: true,
                getSearchedDoctorIds: null,
                nextAvailableSlotDate: '',
                isLoading: false,
                filterBySelectedAvailabilityDateCount: 0,
                patientWishListsDoctorIds: [],
                filterData : null,
                uniqueFilteredDocArray: [],
                yearOfExperience: '',
                isHidden: false,
                processedDoctorAvailabilityDates: [],
                sliderPageIndex : 0,
                sliderPageIndexesByDoctorIds: {},
                selectedDatesByDoctorIds: {},
                selectedSlotByDoctorIds: {},
                expandedDoctorIdHospitalsToShowSlotsData: [],
                showedFee: null
            }
    }

    confirmAppointmentPress = (confirmedSlot) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: this.state.confirmSlotDetails })
    };
    navigateToFilters() {
        this.props.navigation.navigate('Filters', { 
            doctorData: this.state.doctorData, 
            doctorDetailsWitSlots: this.state.doctorDetails,  
            filterData : this.state.filterData,
            filterBySelectedAvailabilityDateCount: this.state.filterBySelectedAvailabilityDateCount
        })
    }
    componentDidMount = async () => {
        store.dispatch({
            type: SET_SELECTED_DATE,
            data: this.state.selectedDate
        });
        this.getPatientWishLists();
        this.getPatientSearchData();
    }
    componentNavigationMount = async () => {
        const { navigation } = this.props;
        const filterData = navigation.getParam('filterData');

        const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount');
        conditionFromFilterPage = navigation.getParam('ConditionFromFilter');
        await this.setState({ filterData: filterData, filterBySelectedAvailabilityDateCount: filterBySelectedAvailabilityDateCount })
        if (conditionFromFilterPage == true) {
            console.log('comming FilterPage');
            this.renderDoctorListByFilteredData(filterData, filterBySelectedAvailabilityDateCount)
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

            if (filterData.gender_preference) {
                if (doctorElement.gender_preference.includes(filterData.gender_preference)) {
                    genderPreferenceMatchedList.push(doctorIdHostpitalId);
                }
            }
            if (filterData.language) {
                doctorElement.language.forEach((docLanguage) => {
                    filterData.language.forEach((filLanguage) => {
                        if (docLanguage.includes(filLanguage)) {
                            languageMatchedList.push(doctorIdHostpitalId)
                        }
                    })
                })
            }

            if (filterData.experience && doctorElement.calulatedExperience) {
                let doctorExperienceMonths = (doctorElement.calulatedExperience.year || 0 * 12) +  doctorElement.calulatedExperience.month || 0
                let filterValueExperienceInMonth = filterData.experience * 12; // value is returning as year to convert to months multiplies by 12 
                 if (filterValueExperienceInMonth >= doctorExperienceMonths) {
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
      
        console.log()
        if (filterData) {
            if (filterData.gender_preference) {
                selectedFiltesArray.push(genderPreferenceMatchedList);
                console.log('genderPreferenceMatchedList:' +genderPreferenceMatchedList)
            }
            if (filterData.language) {
                selectedFiltesArray.push(languageMatchedList);
                console.log('languageMatchedList:' +languageMatchedList)
            }
            if (filterData.experience) {
                selectedFiltesArray.push(experienceMatchedList);
                console.log('experienceMatchedList:' +experienceMatchedList)
            }
            if (filterData.category) {
                selectedFiltesArray.push(categoryMatchedList);
            }
            if (filterData.service) {
                selectedFiltesArray.push(servicesMatchedList);
                console.log('servicesMatchedList:' +servicesMatchedList)
            }
        }
/* Finally Rendered the Doctor Lists  */
        console.log("selectedFiltesArray" + JSON.stringify(selectedFiltesArray))
        if (filterData || availtyDateCount !== 0 ) {
            console.log('Came Filter Availability and DocData , Filter only DocDatas  ')
            let filteredDocListArray = intersection(selectedFiltesArray);
            await this.setState({ uniqueFilteredDocArray: filteredDocListArray })
            if (filteredDocListArray.length ===0) {
                // this.noDoctorsAvailable();
                Toast.show({
                    text: 'Doctors Not found!..Choose Filter again',
                    type: "danger",
                    duration: 5000,
                })
            }
        }
    }
    /* Insert Doctors Favourite Lists  */
    addToWishList = async (doctorId) => {
        try {
          let requestData = {
             active: true
          };
          let userId = await AsyncStorage.getItem('userId');
          if(userId) {
            let result = await insertDoctorsWishList(userId, doctorId, requestData);
            //   console.log('result'+JSON.stringify(result));

            if (result.success) {
                Toast.show({
                    text: result.message,
                    type: "success",
                    duration: 3000,
                })
                let wishLists = this.state.patientWishListsDoctorIds;
                wishLists.push(doctorId)
                this.setState({ patientWishListsDoctorIds: wishLists });
            }
         }
      }
        catch (e) {
            console.log(e);
        }
    }
    getPatientWishLists = async () => {
        try {
            let userId = await AsyncStorage.getItem('userId');
            let result = await getPatientWishList(userId);

            if (result.success) {
                let wishListDoctorsIds = [];
                result.data.forEach(element => {
                    wishListDoctorsIds.push(element.doctorInfo.doctor_id)
                })
                this.setState({ patientWishListsDoctorIds: wishListDoctorsIds });
            }
        } catch (e) {
            this.setState({ patientWishListsDoctorIds: [] });
            console.log(e);
        }

    }


    /* get the Doctor Id's list from Search Module  */
    getPatientSearchData = async () => {
        this.setState({ isLoading: true });
        const { navigation } = this.props;
        const searchedInputValues = navigation.getParam('resultData');
        let endDateMoment = addMoment(this.state.selectedDate, 7, 'days')

        const userId = await AsyncStorage.getItem('userId');
        let resultData = await searchDoctorList(userId, searchedInputValues);
        // console.log(' resultData'+JSON.stringify(resultData.data));
        await this.setState({ searchedResultData: resultData.data });
        if (resultData.success) {
            let doctorIds = resultData.data.map((element) => {
                return element.doctor_id
            }).join(',');
            this.setState({ getSearchedDoctorIds: doctorIds });
            this.getDoctorAllDetails(this.state.getSearchedDoctorIds, getMoment(this.state.selectedDate), endDateMoment);// for getting multiple Doctor details,Reviews ,ReviewCount,etc....
        } else {
            this.setState({ isLoading: false })
        }
    }

    async getDoctorAllDetails(doctorIds, startDate, endDate) {
        try {

            this.setState({ isLoading: true });
            await this.getDoctorDetails(doctorIds).catch(res => console.log("Exception on  getDoctorDetails: " + res));

            await this.getAvailabilitySlots(doctorIds, startDate, endDate).catch(res => console.log("Exception" + res));

            this.getPatientReviews(doctorIds).catch(res => console.log("Exception on getPatientReviews" + res));
            
            let doctorData = this.state.doctorData;
            let uniqueFilteredDocArray = []; 
            doctorData.forEach((element) => {
                uniqueFilteredDocArray.push(element.doctorIdHostpitalId)
            })
            await this.setState({ uniqueFilteredDocArray: uniqueFilteredDocArray })

        } catch (error) {
            console.log('exception on getting multiple Requests');
            console.log(error)
        } finally {
            this.setState({ isLoading: false });
        }
    }

    /*Get doctor specialist and Degree details*/

    getDoctorDetails = async (doctorIds) => {
        try {

            let fields = "first_name,last_name,prefix,dob,specialist,education,language,gender_preference,experience,profile_image";
            let resultDoctorDetails = await getMultipleDoctorDetails(doctorIds, fields);
            console.log(resultDoctorDetails);
            if (resultDoctorDetails.success) {
                resultDoctorDetails.data.forEach((element) => {
                    this.doctorDetailsMap.set(element.doctor_id, element) // total_rating
                })
            }
            console.log('finished loading get Doctor Details');

        } catch (ex) {
            console.log(ex);
            console.log('Exception occured on getMultplieDocDetail')
        }
    }

    /* get the  Doctors Availability Slots */
    getAvailabilitySlots = async (getSearchedDoctorIds, startDate, endDate) => {
        console.log('started loading get availability');
        this.setState({ isAvailabilityLoading: true });
        try {
            let totalSlotsInWeek = {
                startDate: formatDate(startDate, 'YYYY-MM-DD'),
                endDate: formatDate(endDate, 'YYYY-MM-DD')
            }
            let resultData = await fetchAvailabilitySlots(getSearchedDoctorIds, totalSlotsInWeek);
            if (resultData.success) {
                // console.log(resultData.data);

                for (let docCount = 0; docCount < resultData.data.length; docCount++) {
                    let doctorSlotData = resultData.data[docCount];
                    if (this.processedDoctorIds.includes(doctorSlotData.doctorIdHostpitalId)) { // condition to append another week conditions
                        let index = this.processedDoctorIds.indexOf(doctorSlotData.doctorIdHostpitalId);
                        //let processedSlotData = this.processedDoctorData[index].slotData;
                        for (var key in doctorSlotData.slotData) {
                            if (this.processedDoctorData[index].slotData[key] === undefined) {
                                this.processedDoctorData[index].slotData[key] = doctorSlotData.slotData[key]
                            }
                            if (this.processedDoctorDetailsData[index].slotData[key] === undefined) {
                                this.processedDoctorDetailsData[index].slotData[key] = doctorSlotData.slotData[key]
                            }
                        }
                    } else {
                        console.log(doctorSlotData.slotData);
                        this.processedDoctorData.push(doctorSlotData);
                        this.processedDoctorIds.push(doctorSlotData.doctorIdHostpitalId);
                        let doctorDetailsData = this.doctorDetailsMap.get(doctorSlotData.doctorId)
                        let obj = {
                            ...doctorDetailsData,
                            doctorIdHostpitalId: doctorSlotData.doctorIdHostpitalId,
                            slotData: doctorSlotData.slotData,
                            location: doctorSlotData.slotData[Object.keys(doctorSlotData.slotData)[0]].length > 0 ?  doctorSlotData.slotData[Object.keys(doctorSlotData.slotData)[0]][0].location : null,
                        }
                        this.processedDoctorDetailsData.push(obj);
                    }
            }
                store.dispatch({
                    type: SET_BOOK_APP_SLOT_DATA,
                    data: this.processedDoctorData
                })
                
                store.dispatch({
                    type: SET_BOOK_APP_DOCTOR_DATA,
                    data: this.processedDoctorDetailsData
                })
                console.log(this.processedDoctorDetailsData);
                await this.enumarateDates(startDate, endDate)
                await this.setState({ doctorDetails: this.processedDoctorData, doctorData: this.processedDoctorDetailsData });
            }
        } catch (e) {
            this.setState({ doctorDetails: [] });
            console.log(e);
        }
        finally {
            this.setState({ isAvailabilityLoading: false });
        }
    }
   async enumarateDates(startDate, endDate) {
        let now = startDate.clone();
        while (now.isSameOrBefore(endDate)) {
            this.processedDoctorAvailabilityDates.push(now.format('YYYY-MM-DD'));
            now = now.add(1, 'day');
        }
        await this.setState({ processedDoctorAvailabilityDates : this.processedDoctorAvailabilityDates });
        console.log('Process Dates are ' + this.state.processedDoctorAvailabilityDates);
       
    }


    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, doctorIdHostpitalId) {
        
        let { selectedDatesByDoctorIds }  = this.state;
        
        selectedDatesByDoctorIds[doctorIdHostpitalId] = selectedDate;
        this.setState({ selectedDatesByDoctorIds });
        if (this.processedDoctorAvailabilityDates.includes(selectedDate) === false) {
           let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');
           this.getAvailabilitySlots(this.state.getSearchedDoctorIds, getMoment(selectedDate), endDateMoment);
        }

    }

    /* Click the Slots from Doctor List page */
    onPressContinueForPaymentReview = async (doctorData, selectedSlotItem) => {
     
                console.log('is it coming here?')
            var confirmSlotDetails = {
                ...doctorData,
                slotData: selectedSlotItem
            };
            console.log(confirmSlotDetails);
            this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
        
    }
    /* Click the Hospital location and names from Book Appointment Popup page */
    onClickedHospitalName = async (hospitalId) => {
        let selectedHospitalData = findArrayObj(this.state.selectedDoctorHospitalLocations, '_id', hospitalId);
        await this.setState({ singleHospitalDataSlots: selectedHospitalData });
    }

    /* Get Patients Reviews*/
    reviewMap = new Map();
    getPatientReviews = async (doctorIds) => {
        let resultReview = await getDoctorsReviewsCount(doctorIds);
        // console.log('resultReview'+JSON.stringify(resultReview));

        if (resultReview.success) {

            this.setState({ reviewData: resultReview.data });

            for (i = 0; i < resultReview.data.length; i++) {
                this.reviewMap.set(resultReview.data[i]._id, resultReview.data[i]) // total_rating
            }
        }
    }


    getDoctorSpecialist(doctorId) {
        if (this.doctorDetailsMap.has(doctorId)) {
            if (this.doctorDetailsMap.get(doctorId).specialist) {
                return this.doctorDetailsMap.get(doctorId).specialist[0] ? this.doctorDetailsMap.get(doctorId).specialist[0].category : ''
            }
            return '';
        }
        return '';
    }
    getDoctorEducation(educationData) {
        let degree = '';
        if (educationData) {
            educationData.forEach(eduData => {
                degree += eduData.degree + ','
            });
            return degree.slice(0, -1);
        }
        return '';
    }

    /* Click the Slots and Book Appointment on Popup page */
    onBookSlotsPress = async (item, index) => {

        this.setState({ confirm_button: false });
        var confirmSlotDetails = {};
        confirmSlotDetails = { ...this.state.singleDataWithDoctorDetails };
        confirmSlotDetails.slotData = item;
        await this.setState({ selectedSlotIndex: index, confirmSlotDetails: confirmSlotDetails });
    }

    navigateToBookAppointmentPage(doctorAvailabilityData, doctorIdHostpitalId) {
        
        let selectedDate = this.state.selectedDatesByDoctorIds[doctorIdHostpitalId] || this.state.currentDate;
                                                   
        const slotData = doctorAvailabilityData.slotData[selectedDate];
        console.log(slotData);
        console.log(selectedDate);
        this.props.navigation.navigate('Book Appointment', { doctorDetails: doctorAvailabilityData, slotList: slotData })
    }
    
 
    haveAvailableSlots(doctorIdHostpitalId, slotsData) {
        let { selectedSlotByDoctorIds , showedFee}  = this.state;
        selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] || -1
        return (
            <Row>
              <Col style={{width:'8%'}}></Col>
             
            <FlatList
              numColumns={4}
              data={slotsData}
              extraData={this.state}
            
              renderItem={({ item, index }) =>
            <Col style={{width:'23.5%'}}>
              <TouchableOpacity disabled={item.isSlotBooked} style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ? styles.slotSelectedBgColor : styles.slotDefaultBgColor} onPress={()=> { 
                   let { selectedSlotByDoctorIds }  = this.state;
                   selectedSlotByDoctorIds[doctorIdHostpitalId] = index;
                   this.setState({ selectedSlotByDoctorIds , selectedSlotItem: item });
                 
                   if((item.fee != showedFee)) {
                       this.setState( { showedFee : item.fee})
                       if(showedFee != null) {
                         Toast.show({
                            text: 'Your Appointment Fee got Changed',
                            type:'warning',
                            duration: 3000
                         });
                       }
                   }
               }}>
               <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
              {/* item.isSlotBooked ? <Text style={styles.slotBookedTextColor}>Booked</Text> : null */}
              </TouchableOpacity>
            </Col>
      } 
      keyExtractor={(item, index) => index.toString()}/>
       <Col style={{width:'8%'}}></Col>
      </Row>
        )
    }
    getFeesBySelectedSlot(selectedSlotData,wholeSlotData, doctorIdHostpitalId ) {
       
        let { selectedSlotByDoctorIds }  = this.state;
        selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] || 0;
        if(!selectedSlotData) {
            selectedSlotData = wholeSlotData[Object.keys(wholeSlotData)[0]]
        }
        selectedIndex = selectedSlotData[selectedSlotIndex] ? selectedSlotIndex : 0;
        selectedSlotFee = selectedSlotData[selectedIndex].fee;
        return selectedSlotFee;
    }

    getDisplayAvailableTime =(selectedSlotData, wholeSlotData) => {
        
        if(selectedSlotData) {
            let startTime = moment(selectedSlotData[0].slotStartDateAndTime).format('h:mm a');
            let endTime =  moment(selectedSlotData[selectedSlotData.length - 1 ].slotEndDateAndTime).format('h:mm a');
            return 'Available ' + startTime + ' - ' + endTime;
        } else {
            if(wholeSlotData[Object.keys(wholeSlotData)[0]].length > 0) {  
                selectedSlotData = wholeSlotData[Object.keys(wholeSlotData)[0]]
                let availableOn = moment(selectedSlotData[0].slotStartDateAndTime).format('ddd, DD MMM YY');
                return 'Available On ' + availableOn;
            }
        }
    }
    getAvailabilityDateSliderData = (doctorId) => {
        let {  sliderPageIndexesByDoctorIds }  = this.state;
        let sliderPageIndex = sliderPageIndexesByDoctorIds[doctorId] || 0;
        let startingDataCount = sliderPageIndex * NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE;
        let endingDataCount = startingDataCount + NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE;
        let startDate = moment().add(startingDataCount, 'days');
        let now = startDate.clone();
        let availabiltySliderDates = [];
        for(let dateCount = startingDataCount; dateCount < endingDataCount; dateCount++ ) {
            availabiltySliderDates.push(now.format('YYYY-MM-DD'));
            now = now.add(1, 'day');
        }
        return availabiltySliderDates
    }

    slidePrevious = async (doctorId) => {
        let { sliderPageIndexesByDoctorIds }  = this.state;
        let sliderPageIndex = sliderPageIndexesByDoctorIds[doctorId] || 0;
        if(sliderPageIndex !== 0) {
            sliderPageIndexesByDoctorIds[doctorId] = sliderPageIndex - 1;
            await this.setState({sliderPageIndexesByDoctorIds}) 
            this.getAvailabilityDateSliderData(doctorId)
        }
    }
    slideNext = async (doctorId) => {
        let { sliderPageIndexesByDoctorIds }  = this.state;
        let sliderPageIndex = sliderPageIndexesByDoctorIds[doctorId] || 0;

            sliderPageIndexesByDoctorIds[doctorId] = sliderPageIndex + 1;
            await this.setState({sliderPageIndexesByDoctorIds}) 
            console.log(this.state.sliderPageIndexesByDoctorIds)
            this.getAvailabilityDateSliderData(doctorId)
    }
    
    
    noAvailableSlots(doctorIdHostpitalId, slotData) {
        let nextAvailableDate;
        for (let nextAvailableSlotDate of Object.keys(slotData)) {
            if (this.state.selectedDate < nextAvailableSlotDate) {
                nextAvailableDate = nextAvailableSlotDate;
                break;
            }
        }
        return (
            <Row style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button disabled style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }} onPress={() => { if (nextAvailableDate) {
                      let { selectedDatesByDoctorIds }  = this.state;
                      selectedDatesByDoctorIds[doctorIdHostpitalId] = nextAvailableDate;
                      this.setState({ selectedDatesByDoctorIds });
                }
                 }}>
                 <Text>No Slots Available</Text>    
                {/*nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>*/}
                </Button>
            </Row>
        )
    }
    getSlotDatesByObject = (slotData) => {
        availableSlotDates = Object.keys(slotData).map(element => {
          return {
             date: element
          }     
        });
        return availableSlotDates;     
     }
     
     

    onBookPress(doctorIdHospitalId) {
        console.log('you have pressed onBookPress');
        const { expandedDoctorIdHospitalsToShowSlotsData } = this.state;
        if(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId) !== -1) {
            expandedDoctorIdHospitalsToShowSlotsData.splice(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId), 1)
        } else {
            expandedDoctorIdHospitalsToShowSlotsData.push(doctorIdHospitalId);
        }
        this.setState({ expandedDoctorIdHospitalsToShowSlotsData });
    }
    noDoctorsAvailable() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Doctors available! </Text>
            </Item>
        )
    }
    
    onpressSideSlider() {
        console.log('you pressed the sideslider')
    }
    
    
    render() {

        // const doctorList = [{docname:'Dr.John williams', degree:'MBBS,MD-DNB,Opththalmology',hospital:'dominur - Manipal Hospital',Experience:'12yrs',Rating:3.5,
        // Favorite:'85%',fees:250,selectedappointment:'fri 13 Aug 9:00 am'},{docname:'Dr.John williams', degree:'MBBS,MD-DNB,Opththalmology',hospital:'dominur - Manipal Hospital',Experience:'12yrs',Rating:3.5,
        // Favorite:'85%',fees:250,selectedappointment:'fri 13 Aug 9:00 am'}]

        const { bookappointment: { slotData, selectedDate, doctorData } } = this.props;
        const { navigation } = this.props;
        const { selectedDatesByDoctorIds, expandedDoctorIdHospitalsToShowSlotsData, patientWishListsDoctorIds,
             isLoading, isAvailabilityLoading, processedDoctorAvailabilityDates, 
            uniqueFilteredDocArray, searchedResultData, categories, singleDataWithDoctorDetails, singleHospitalDataSlots, reviewData, doctorList /* doctorDetails */} = this.state;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
              <Content>
              <View>
                <Card style={{ borderRadius: 7,paddingTop:5,paddingBottom:5 }}>
                    <Grid>
                      <Row>
                        <Col style={{ width: '55%',  flexDirection: 'row' }}>
                          <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center',marginLeft:20,marginTop:5 }}>Top Rated </Text>
                          <Right>
                            <Icon name='ios-arrow-down' style={{ color: '#000', marginLeft: 50, fontSize: 20 }} />
                          </Right>
                        </Col>
                             <View style={{borderRightWidth: 1, borderRightColor: 'gray',paddingLeft:20,marginRight:20}}/>  
                             <Col style={{ width:'45%',alignItems: 'flex-start', flexDirection: 'row', }} onPress={() => this.navigateToFilters()}>
                                <Row>
                                  <Left><Icon name='ios-funnel' style={{ color: 'gray' }}/></Left>
                                  <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginLeft: 8,textAlign: 'center',marginTop:5 }}>Filters </Text>
                                </Row>  
                             </Col>
                       </Row>
                    </Grid>
                </Card>
                
                    <FlatList
                        data={doctorData.filter(ele => uniqueFilteredDocArray.includes(ele.doctorIdHostpitalId))}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => 
                         <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                            <List style={{borderBottomWidth:0}}>
                              <ListItem>
                                <Grid >
                                  <Row onPress={()=> this.navigateToBookAppointmentPage(item, item.doctorIdHostpitalId) }>
                                    <Col style={{width:'5%'}}>
                                        <Thumbnail square source={ renderProfileImage(item) } style={{ height: 60, width: 60 }} />
                                     </Col>
                                     <Col style={{width:'78%'}}>
                                        <Row style={{marginLeft:55,}}>
                                           <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold'}}>{(item.prefix || '') + (item.first_name || '') + ' ' + (item.last_name || '')}</Text>
                                        </Row>
                                        <Row style={{marginLeft:55,}}>
                                           <Text note  style={{ fontFamily: 'OpenSans',marginTop:2 ,fontSize:11}}>{(this.getDoctorEducation(item.education)) + ', ' +  this.getDoctorSpecialist(item.doctor_id)}</Text>
                                        </Row>
                                        <Row style={{marginLeft:55,}}>
                                       
                                           <Text style={{ fontFamily: 'OpenSans',marginTop:5,fontSize:12,fontWeight:'bold' }}>
                                              {item.location.location.address.city + ' - ' + item.location.name}
                                           </Text>
                                        </Row>
                                     </Col>
                                      <Col style={{width:'17%'}}>
                                         <Icon name="heart" onPress={()=>this.addToWishList(item.doctor_id)} 
                                            style={patientWishListsDoctorIds.includes(item.doctor_id) ? { marginLeft:20, color: '#B22222', fontSize:20 } : {marginLeft:20, borderColor: '#fff',fontSize:20}}>

                                            </Icon>
                                         {/* <Row>
                                           <Text style={{ fontFamily: 'OpenSans',marginTop:20,fontSize:12,marginLeft:5 }}> 2.6km</Text>
                                         </Row> */}
                                       </Col> 
                                   </Row>
                                 
                                   <Row>
                                       <Col style={{width:"25%",marginTop:20}}>        
                                         <Text note style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5, }}> Experience</Text>
                                         <Text style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5,fontWeight:'bold' }}> {item.calulatedExperience ? item.calulatedExperience.year + ' Yrs' : 'N/A'}</Text>
                                       </Col>
                                       <Col style={{width:"25%",marginTop:20}}>
                                          <Text note style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5, }}> Rating</Text>
                                                <View style={{flexDirection:'row',marginLeft:10}}>
                                                <StarRating 
                                                    fullStarColor='#FF9500' 
                                                    starSize={12} width={85} 
                                                    containerStyle={{ marginLeft:15,marginTop:2}} 
                                                                    disabled={true}
                                                                    rating={1}
                                                                    maxStars={1}
                                                                />
                                                               
                                                <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',marginLeft:2 }}> {this.reviewMap.has(item.doctor_id) ? this.reviewMap.get(item.doctor_id).average_rating : ' 0'}</Text>
                                                </View>
                                                
                                        </Col>
                                                <Col style={{width:"25%",marginTop:20}}>
                                                
                                                <Text note style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5 ,}}> Favourite</Text>
                                                <Text style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5,fontWeight:'bold' }}> {item.Favorite}</Text>


                                                </Col>
                                                <Col style={{width:"25%",marginTop:20}}>
                                                    <Text note style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5, }}> Fees</Text>
                                                    <Text  style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',marginLeft:5 }}> {this.getFeesBySelectedSlot(item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate], item.slotData, item.doctorIdHostpitalId )}</Text>
                                                </Col>
                                            </Row>
                                           
                                           

                                            <Row style={{borderTopColor:'#000',borderTopWidth:0.4,marginTop:5}} >
                                                <Col style={{width:"8%"}}>
                                                
                                                <Icon name='ios-time' style={{fontSize:20,marginTop:15}}/>

                                                </Col>
                                                <Col style={{width:"70%"}}>
                                                
                                                <Text note style={{ fontFamily: 'OpenSans',marginTop:15,fontSize:12,marginRight:50,fontWeight:'bold' }}> {this.getDisplayAvailableTime(item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate], item.slotData)}</Text>
                                              </Col>
                                                <Col style={{width:"22%"}}>
                                                <TouchableOpacity  onPress={()=>this.onBookPress(item.doctorIdHostpitalId)}  style={{ textAlign:'center',backgroundColor:'green',borderColor: '#000', marginTop:15, borderRadius: 20, height: 30,justifyContent:'center' ,marginLeft:5,marginRight:5 ,}}>
                                                    <Text style={{textAlign:'center',color:'#fff',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>BOOK </Text>
                                                </TouchableOpacity>  
                                               
                                                </Col>
                                               
                                            </Row>
                                           
                                            {expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ? 
                                           
                                            <View>
                                            
                                                <Row style={{marginTop:10}}>
                                                <Text style={{fontSize:13,fontFamily:'OpenSans'}}>Select appoinment date And time</Text>
                                            </Row>

                                            <Row style={{marginLeft:'auto',marginRight:'auto'}}  >
                                              <Col style={{width:'8%'}}>
                                                  <Icon name='ios-arrow-back' onPress={() => this.slidePrevious(item.doctorIdHostpitalId)} style={{fontSize:25,marginTop:25}}/>
                                              </Col> 
                                              {this.getAvailabilityDateSliderData(item.doctorIdHostpitalId).map(date => {
                                                   let availableslotData = item.slotData[date] || [];
                                                   let selectedDate = selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate;
                                                   return (
                                                      <Col style={{width:'30%',}} key={date}>
                                                       <TouchableOpacity style={[styles.availabilityBG, selectedDate === date ? { backgroundColor:'#775DA3' } : { backgroundColor:'#ced6e0' } ]} onPress={() => this.onDateChanged( date, item.doctorIdHostpitalId)}>
                                                          <Text style={[{textAlign:'center',fontSize:12,fontFamily:'OpenSans'}, selectedDate === date ? { color:'#fff' } : { color:'#000' } ] }>{formatDate(moment(date), 'ddd, DD MMM')}</Text>
                                                          <Text style={[{textAlign:'center',fontSize:10,fontFamily:'OpenSans'}, selectedDate === date ? { color:'#fff' } : { color:'#000' } ] }>{ availableslotData.length === 0 ? 'No Slots Available' : availableslotData.length + ' Slots Available' }</Text>
                                                       
                                                       </TouchableOpacity>
                                                     </Col>
                                                    )
                                              })}
                                                <Col style={{width:'8%'}}>
                                                    <Icon name='ios-arrow-forward' onPress={()=>this.slideNext(item.doctorIdHostpitalId)} style={{fontSize:25,marginTop:25,marginLeft:5,marginRight:5}}/>
                                                 </Col>
                                             </Row>
                                             {  
                                                 item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate] !== undefined ?
                                                   this.haveAvailableSlots(item.doctorIdHostpitalId,item.slotData[selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate]) 
                                                   : this.noAvailableSlots(item.doctorIdHostpitalId, item.slotData)
                                              }

                                         <View style={{borderTopColor:'#000',borderTopWidth:0.5,marginTop:10}}>
                                            <Row style={{marginTop:10}}>
                                                <Text note style={{fontSize:12,fontFamily:'OpenSans'}}>Selected Appointment on</Text>
                                            </Row>
                                            <Row style={{marginTop:5}}>
                                               <Col style={{width:'40%'}}>
                                                 <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',marginLeft:-16}}>{item.selectedappointment}</Text>
                                               </Col>
                                               <Col style={{width:'30%'}}>
                                               </Col>
                                               <Col style={{width:'30%'}}>
                                                  <TouchableOpacity 
                                                     onPress={() => { console.log('......Pressing....'); this.onPressContinueForPaymentReview(item, this.state.selectedSlotItem) }}
                                                     style={{backgroundColor:'green', borderColor: '#000', marginTop:10, height: 30, borderRadius: 20,justifyContent:'center' ,marginLeft:5,marginRight:5,marginTop:-5 }}>
                                                     <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>Continue </Text>
                                                  </TouchableOpacity> 
                                               </Col>
                                            </Row>
                                         </View>
                                         
                                            </View> : null }
                                           
                                            </Grid>
                                           
                                          
                                            
                                            
                                        </ListItem>

                                        
                                    </List>
                                </Card>
                        }/>
                       </View>

</Content>

                {/* <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />
                {isLoading ? <Loader style='list' /> :
                    <Content style={styles.bodyContent}>

                        <Spinner color="blue"
                            visible={isAvailabilityLoading} />

                        <Card style={{ borderRadius: 7 }}>
                            <Grid>
                                <Row>
                                    <Col style={{ width: '30%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, textAlign: 'center' }}>Top Rated
                                    </Text>

                                        <Icon name='ios-arrow-down' style={{ color: 'gray', marginLeft: 5, fontSize: 21 }} />


                                    </Col>

                                    <View
                                        style={{
                                            borderLeftWidth: 2,
                                            borderLeftColor: 'whitesmoke',
                                        }}
                                    />
                                    <Col style={{ width: '40%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

                                        <DatePicker
                                            locale={"en"}
                                            timeZoneOffsetInMinutes={undefined}
                                            animationType={"fade"}
                                            androidMode={"default"}
                                            placeHolderText={this.state.selectedDate}
                                            textStyle={{ color: "#5A5A5A" }}
                                            placeHolderTextStyle={{ color: "#5A5A5A" }}
                                            onDateChange={date => { this.onDateChanged(date); }}
                                            disabled={false}
                                            testID='datePicked' />

                                        <Icon name='ios-arrow-down' style={{ color: 'gray', marginLeft: 5, fontSize: 21 }} />




                                    </Col>
                                    <View
                                        style={{
                                            borderLeftWidth: 2,
                                            borderLeftColor: 'whitesmoke',
                                        }}
                                    />


                                    <Col style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.navigateToFilters()}>

                                        <Icon name='ios-funnel' style={{ color: 'gray' }} />

                                        <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: 'gray', fontSize: 13, marginLeft: 5 }}>Filter
                                    </Text>
                                    </Col>
                                </Row>
                            </Grid>

                        </Card>
                        {searchedResultData == null ? this.noDoctorsAvailable() :

                            <FlatList
                                data={slotData.filter(ele => uniqueFilteredDocArray.includes(ele.doctorIdHostpitalId))}
                                extraData={this.state}
                                style={{ borderBottomWidth: 0 }}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>

                                    <Card style={{ padding: 5, borderRadius: 10, borderBottomWidth: 2 }}>
                                        <List>
                                            <ListItem avatar onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                <Left>
                                                    {
                                                        item.profile_image != undefined
                                                            ? <Thumbnail square source={{ uri: item.profile_image.imageURL }} style={{ height: 60, width: 60 }} />
                                                            : <Thumbnail square source={{ uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_thumb,g_face,r_max/face_left.png' }} style={{ height: 80, width: 80 }} />
                                                    }

                                                </Left>
                                                <Body style={{ margin: 'auto' }}>
                                                    <Text style={{ fontFamily: 'OpenSans' }}>{item.doctorName}</Text>
                                                    {item.slotData[this.state.selectedDate] ?
                                                        <View>
                                                            <Grid style={{ marginTop: 5 }}>
                                                                <Col>
                                                                    <Text style={{ fontFamily: 'OpenSans-SemiBold', color: '#282727', fontSize: 12 }}>{this.getDoctorSpecialist(item.doctorId)}  - Fee: ₹{item.slotData[this.state.selectedDate][0].fee}</Text>
                                                                </Col>
                                                            </Grid>
                                                            {item.slotData[this.state.selectedDate][0].location ?
                                                                <RenderHospitalAddress
                                                                    hospitalAddress={item.slotData[this.state.selectedDate][0].location}
                                                                    hospotalNameTextStyle={{ fontFamily: 'OpenSans-SemiBold' }}
                                                                    textStyle={{ fontFamily: 'OpenSans' }}
                                                                    gridStyle={{ marginTop: 5 }}
                                                                    renderHalfAddress={true}
                                                                />
                                                                : null}
                                                            <Grid style={{ marginTop: 5 }}>
                                                                <Col style={{ width: '40%', marginBottom: 8, marginTop: 5 }}>

                                                                    <StarRating fullStarColor='#FF9500' starSize={14} width={85} containerStyle={{ width: 80 }}
                                                                        disabled={true}
                                                                        maxStars={5}
                                                                        rating={this.reviewMap.get(item.doctorId) ? this.reviewMap.get(item.doctorId).average_rating : 0}
                                                                    />
                                                                </Col>
                                                                <Col style={{ width: '60%', marginLeft: 5 }}>
                                                                    <Text style={{ fontFamily: 'OpenSans', paddingLeft: 5, color: 'gray', fontSize: 15 }}>{this.reviewMap.get(item.doctorId) ? Number(this.reviewMap.get(item.doctorId).total_rating).toFixed(0) : ''} </Text>
                                                                </Col>
                                                            </Grid>

                                                        </View>
                                                        : //condition
                                                        <View>
                                                            <Grid>

                                                                <Col>
                                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{this.getDoctorSpecialist(item.doctorId)}</Text>
                                                                </Col>
                                                            </Grid>
                                                            <Grid style={{ marginTop: 5 }}>
                                                                <Row>
                                                                    <Col style={{ width: '90%' }}>

                                                                        <StarRating fullStarColor='#FF9500' starSize={13} width={80} containerStyle={{ width: 80 }}
                                                                            disabled={false}
                                                                            maxStars={5}
                                                                            rating={item.overall_rating}
                                                                        />
                                                                    </Col>

                                                                    <Col style={{ width: '10%' }}>
                                                                        <Text>{item.average_rating}</Text>
                                                                    </Col>
                                                                </Row>


                                                            </Grid>

                                                        </View>}

                                                </Body> */}
                                                {/* 
                                                <Right>
                                                    <Icon name='heart' type='Ionicons'
                                                        style={patientWishListsDoctorIds.includes(item.doctorId) ? { color: 'red', fontSize: 25 } : { color: 'gray', fontSize: 25 }}
                                                        onPress={() => this.addToWishList(item.doctorId, index)} ></Icon>

                                                        <Button style={{borderRadius:15,marginTop:90,height:35}} onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                            <Text style={{fontFamily:'OpenSans',fontSize:11,justifyContent:'center'}}>View Profile</Text>
                                                        </Button>
                //                                 </Right> */}
                                   {/* </ListItem>  */}

                {/* //                             <Grid>
                //                                 <Row>
                //                                     {item.slotData[this.state.selectedDate] !== undefined ?
                //                                         <ListItem>
                //                                             <ScrollView horizontal={true}>
                //                                                 {
                //                                                     this.haveAvailableSlots(item, item.slotData[this.state.selectedDate])
                //                                                 }
                //                                             </ScrollView>
                //                                         </ListItem> : this.noAvailableSlots(item.slotData)
                //                                     }
                //                                 </Row>
                //                             </Grid>
                //                         </List>
                //                     </Card>
                //                 } />
                //         }
                //     </Content>
                // } */}

{/* 
                <Modal isVisible={this.state.isModalVisible} >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <Card style={{ padding: 7, borderRadius: 10, height: 420 }}>
                            <ListItem noBorder>
                                <Left></Left>
                                <Body>
                                    <Text style={{ marginLeft: -50, fontFamily: 'OpenSans', fontSize: 15, color: 'gray' }}>Confirmation</Text></Body>
                                <Right>

                                    <Button iconRight transparent onPress={() => {
                                        this.setState({ isModalVisible: !this.state.isModalVisible });
                                    }}>
                                        <Icon name='ios-close' style={{ fontSize: 25, marginTop: -5 }}></Icon>
                                    </Button>
                                </Right>
                            </ListItem>

                            <Grid>
                                <Col style={{ width: '20%' }}>

                                    <FlatList numColumns={1}
                                        data={this.state.selectedDoctorHospitalLocations}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>

                                            <TouchableOpacity onPress={() => this.onClickedHospitalName(item._id)}>
                                                <Grid style={{ marginTop: 45 }}>
                                                    <Text style={styles.newText}>{item.hospitalLocationData.name}</Text>
                                                </Grid>
                                            </TouchableOpacity>
                                        } />

                                </Col>
                                <Col style={{ width: '10%' }}>
                                    <Row style={{ marginTop: 60 }}>
                                        <Text style={styles.roundText}></Text>
                                    </Row>
                                    <Row style={{ marginTop: 60 }}>
                                        <Text style={styles.roundText}></Text>
                                    </Row>
                                </Col>

                                <Col style={{ width: '70%', borderLeftWidth: 1, borderColor: '#F2889B', paddingLeft: 10 }}>

                                    <Col style={{ width: '75%' }}>
                                        <Text style={{ fontFamily: 'OpenSans' }}>{singleDataWithDoctorDetails.doctorName}</Text>
                                        <Item style={{ borderBottomWidth: 0 }}>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>{categories}</Text>
                                        </Item>
                                    </Col>


                                    <StarRating fullStarColor='#FF9500' starSize={15} width={100} containerStyle={{ width: 100 }}
                                        disabled={false}
                                        maxStars={5}
                                        rating={reviewData && reviewData[0].overall_rating}
                                    />
                                    <Grid>
                                        <Col>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>Address </Text>
                                            <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.name}</Text>
                                            {singleHospitalDataSlots.hospitalLocationData.location ?
                                                <View>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.no_and_street}</Text>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.city}</Text>
                                                    <Text note style={{ fontFamily: 'OpenSans' }}>{singleHospitalDataSlots.hospitalLocationData.location.address.state}</Text>
                                                </View> : null}
                                        </Col>

                                    </Grid>

                                    <Grid >
                                        <View >
                                            <FlatList numColumns={3}
                                                data={this.state.singleHospitalDataSlots.hospitalSlotArray}
                                                extraData={this.state}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) =>

                                                    <TouchableOpacity disabled={item.isSlotBooked === true ? true : false}
                                                        style={this.state.selectedSlotIndex === index ? styles.slotSelectedBg : item.isSlotBooked === false ?
                                                            styles.slotDefaultBg : styles.slotBookedBgColorFromModal} onPress={() => this.onBookSlotsPress(item, index)}>
                                                        <Row style={{ width: '100%', alignItems: 'center' }}>
                                                            <Col style={{ width: '80%', alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontFamily: 'OpenSans', fontSize: 10 }}>
                                                                    {formatDate(item.slotStartDateAndTime, 'hh:mm')}</Text>
                                                            </Col>
                                                            <Col style={styles.customPadge}>
                                                                <Text style={{ color: 'white', fontFamily: 'OpenSans', fontSize: 8 }}>
                                                                    {formatDate(item.slotStartDateAndTime, 'A')}</Text>
                                                            </Col>
                                                        </Row>
                                                    </TouchableOpacity>
                                                }
                                            />
                                        </View>
                                    </Grid>

                                    <Button block success disabled={this.state.confirm_button} style={{ borderRadius: 10, marginLeft: 10 }} onPress={this.confirmAppointmentPress}>
                                        <Text uppercase={false} >Confirm Appointment</Text>

                                    </Button>

                                </Col>
                            </Grid>
                        </Card>

                        <Button title="Hide modal" onPress={this.confirmAppointmentPress} />
                    </View>
                </Modal> */}

            </Container >
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
        textAlign:'center',
        backgroundColor:'#ced6e0', 
        borderColor: '#000', 
        marginTop:10, 
        height: 30, 
        borderRadius: 5, 
        justifyContent:'center' ,
        marginRight:5,
        paddingLeft:5,
        paddingRight:5
    },
    slotDefaultTextColor : {
        textAlign:'center',
        color:'#000',
        fontSize:12,
        fontFamily:'OpenSans'
    },
    slotBookedBgColor: {
        textAlign:'center',
        backgroundColor:  '#A9A9A9', //'#775DA3',
        borderColor: '#000', 
        marginTop:10, height: 30, 
        borderRadius: 5, 
        justifyContent:'center', 
        marginRight:5,
        paddingLeft:5,
        paddingRight:5
    },
    slotSelectedBgColor: {
        textAlign:'center',
        backgroundColor: '#775DA3',
        borderColor: '#000', 
        marginTop:10, height: 30, 
        borderRadius: 5, 
        justifyContent:'center', 
        marginRight:5,
        paddingLeft:5,
        paddingRight:5
    },
    slotBookedTextColor: {
        textAlign:'center',
        color:'#fff',
        fontSize:12,
        fontFamily:'OpenSans'
    },
    slotBookedBgColorFromModal: {
        backgroundColor: '#878684',
        borderRadius: 5,
        width: '30%',
        height: 30,
        margin: 5
    },
    slotDefaultBg: {
        backgroundColor: '#2652AC',
        borderRadius: 5,
        width: '30%',
        height: 30,
        margin: 5
    },
    slotSelectedBg: {
        backgroundColor: '#808080',
        borderRadius: 5,

        width: '30%',
        height: 30,
        margin: 5
    },
    availabilityBG: {
        textAlign:'center',
        borderColor: '#000', 
        marginTop:10, 
        height: 50,
        borderRadius: 5, 
        justifyContent:'center', 
        marginRight:5, 
        paddingLeft:5, 
        paddingRight:5
    },
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },

});