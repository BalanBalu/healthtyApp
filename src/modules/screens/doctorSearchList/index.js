import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button,Spinner, Card, Item, List,  ListItem, Left, Right, Thumbnail, Body, Icon, DatePicker } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating';

import { insertDoctorsWishList, searchDoctorList, fetchAvailabilitySlots, 
    getMultipleDoctorDetails, 
    getDoctorsReviewsCount, 
    getPatientWishList, 
    SET_BOOK_APP_SLOT_DATA, 
    SET_BOOK_APP_DOCTOR_DATA, 
    SET_SELECTED_DATE,
    SET_SINGLE_DOCTOR_DATA, 
    SET_PATIENT_WISH_LIST_DOC_IDS, 
    SET_FAVORITE_DOCTOR_COUNT_BY_IDS, 
    SET_FILTERED_DOCTOR_DATA,
    getDoctorFaviouteList} from '../../providers/bookappointment/bookappointment.action';
import { formatDate, addMoment, addTimeUnit, getMoment, intersection } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { RenderHospitalAddress, renderDoctorImage,  getDoctorSpecialist, getDoctorEducation  } from '../../common';
import { NavigationEvents } from 'react-navigation';
//import Spinner from '../../../components/Spinner';
import moment from 'moment';

import { store } from '../../../setup/store';
let fields = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,gender_preference,experience,profile_image";            
let conditionFromFilterPage;
const NO_OF_SLOTS_SHOULD_SHOW_PER_SLIDE = 3;
let  currentDoctorOrder = 'ASC'; 
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
                doctorDetails: [],
                selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
                currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
                doctorData: [],
                searchedResultData: [],
                getSearchedDoctorIds: null,
                nextAvailableSlotDate: '',
                isLoading: true,
                filterBySelectedAvailabilityDateCount: 0,
                filterData : null,
                yearOfExperience: '',
                processedDoctorAvailabilityDates: [],
                sliderPageIndex : 0,
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
        let userId = await AsyncStorage.getItem('userId');
        if(userId) {
           this.setState({ isLoggedIn : true })
           this.getPatientWishLists();
        } else {
            this.setState({ isLoggedIn : false }) 
        }
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
             if (filteredDocListArray.length ===0) {
                Toast.show({
                    text: 'Doctors Not found!..Choose Filter again',
                    type: "danger",
                    duration: 5000,
                })
            } else {
                let filteredDocData = [];
                filteredDocListArray.forEach(doctorIdHospitalId => {
                   filteredDocData.push(doctorDataInMap.get(String(doctorIdHospitalId)));
                });
                store.dispatch({
                    type: SET_FILTERED_DOCTOR_DATA,
                    data: filteredDocData
                }) 
            }
        }
    }
    /* Insert Doctors Favourite Lists  */
    addToWishList = async (doctorId) => {
        try {
           const { bookappointment: { patientWishListsDoctorIds, favouriteListCountByDoctorIds } } = this.props;  
           
           console.log(patientWishListsDoctorIds);
          let requestData = {
             active: !patientWishListsDoctorIds.includes(doctorId)
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
                if(requestData.active) {
                  if(favouriteListCountByDoctorIds[doctorId]) {
                        favouriteListCountByDoctorIds[doctorId] = favouriteListCountByDoctorIds[doctorId] + 1;
                  }
                  patientWishListsDoctorIds.push(doctorId)
                } else {
                    if(favouriteListCountByDoctorIds[doctorId]) {
                      favouriteListCountByDoctorIds[doctorId] = favouriteListCountByDoctorIds[doctorId] - 1;
                    }
                    let indexOfDoctorIdOnPatientWishList = patientWishListsDoctorIds.indexOf(doctorId);
                    patientWishListsDoctorIds.splice(indexOfDoctorIdOnPatientWishList, 1);
                }
                store.dispatch({
                    type: SET_PATIENT_WISH_LIST_DOC_IDS,
                    data: patientWishListsDoctorIds
                })
                store.dispatch({
                    type: SET_FAVORITE_DOCTOR_COUNT_BY_IDS,
                    data: favouriteListCountByDoctorIds
                })
                this.setState( { refreshCount : this.state.refreshCount  + 1 });
                
            } else {
            Toast.show({
                text: result.message,
                type: 'danger',
                duration: 3000,
            })
           }
         }
      }
        catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                type: "success",
                duration: 3000,
            })
        }
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
            await this.getPatientReviews(doctorIds).catch(res => console.log("Exception on getPatientReviews" + res));
            
            await this.getAvailabilitySlots(doctorIds, startDate, endDate).catch(res => console.log("Exception" + res));

            this.getDoctorFaviouteList(doctorIds).catch(res => console.log("Exception on getPatient Wish List" + res));
            let doctorData = this.state.doctorData;
            
            
            doctorData.forEach((element) => {
                doctorDataInMap.set(String(element.doctorIdHostpitalId), element) 
            });
            /*store.dispatch({
                type: SET_FILTERED_DOCTOR_DATA,
                data: doctorData
            }) */
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
        this.enumarateDates(startDate, endDate)
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
                this.setState({ doctorDetails: this.processedDoctorData, doctorData: this.processedDoctorDetailsData });
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
        
        let { selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds }  = this.state;
       
        selectedDatesByDoctorIds[doctorIdHostpitalId] = selectedDate;
        selectedSlotByDoctorIds[doctorIdHostpitalId] = -1;
        selectedSlotItemByDoctorIds[doctorIdHostpitalId] = null;
        
        this.setState({ selectedDatesByDoctorIds, selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount : this.state.refreshCount + 1});
       
        if (this.processedDoctorAvailabilityDates.includes(selectedDate) === false) {
           let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');
           this.getAvailabilitySlots(this.state.getSearchedDoctorIds, getMoment(selectedDate), endDateMoment);
        }
        console.log('ended loading the onDateChanged')
    }

    /* Click the Slots from Doctor List page */
    onPressContinueForPaymentReview = async (doctorData, selectedSlotItemByDoctor, doctorIdHostpitalId) => {
             console.log(selectedSlotItemByDoctor);   
            if(!selectedSlotItemByDoctor) {
                Toast.show({
                    text: 'Please Select a Slot to continue booking',
                    type : 'warning',
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
       
        let { selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, showedFeeByDoctorIds }  = this.state;

        selectedSlotByDoctorIds[doctorIdHostpitalId] = index;
        selectedSlotItemByDoctorIds[doctorIdHostpitalId] = item
       
        this.setState({ selectedSlotByDoctorIds, selectedSlotItemByDoctorIds, refreshCount : this.state.refreshCount + 1 });
       
      // console.log( selectedSlotIndex + '. and index :' +  index) ;
       if((item.fee != showedFeeByDoctorIds[doctorIdHostpitalId])) {
            if(showedFeeByDoctorIds[doctorIdHostpitalId] != undefined) {
              Toast.show({
                 text: 'Appointment Fee Updated',
                 type:'warning',
                 duration: 3000
              });
            }
            showedFeeByDoctorIds[doctorIdHostpitalId] = item.fee
            this.setState( { showedFeeByDoctorIds });
        }
        console.log( item);
    }
    
    getPatientReviews = async (doctorIds) => {
       console.log('coming to get review Count ');
        getDoctorsReviewsCount(doctorIds);
    }
    getDoctorFaviouteList = async (doctorIds) => {
       getDoctorFaviouteList(doctorIds);
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
        let { selectedSlotByDoctorIds , showedFee}  = this.state;
        let selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] !== undefined ? selectedSlotByDoctorIds[doctorIdHostpitalId] : -1
        console.log('Selected slot index:' + selectedSlotIndex);
        const {width} = Dimensions.get('screen');
        const itemWidth = (width) / 4;
        return (
            <Row>
              {/* <Col style={{width:'8%'}}></Col> */}
            <FlatList
              numColumns={4}
              data={slotsData}
              extraData={[this.state.selectedDatesByDoctorIds, this.state.selectedSlotByDoctorIds]}
              renderItem={({ item, index }) =>
            <Col style={{width: itemWidth - 10 }}>
              <TouchableOpacity disabled={item.isSlotBooked} 
                    style={item.isSlotBooked ? styles.slotBookedBgColor : selectedSlotIndex === index ? 
                           styles.slotSelectedBgColor : styles.slotDefaultBgColor} 
                    onPress={() => this.onSlotItemPress(doctorIdHostpitalId, item, index )}>
               <Text style={item.isSlotBooked ? styles.slotBookedTextColor : selectedSlotIndex === index ? styles.slotBookedTextColor : styles.slotDefaultTextColor}> {formatDate(item.slotStartDateAndTime, 'hh:mm A')} </Text>
              {/* item.isSlotBooked ? <Text style={styles.slotBookedTextColor}>Booked</Text> : null */}
              </TouchableOpacity>
            </Col>
      } 
      keyExtractor={(item, index) => index.toString()}/>
         {/* <Col style={{width:'8%'}}></Col> */}
      </Row>
        )
    }
    getFeesBySelectedSlot(selectedSlotData,wholeSlotData, doctorIdHostpitalId ) {
       
        let { selectedSlotByDoctorIds }  = this.state;
        selectedSlotIndex = selectedSlotByDoctorIds[doctorIdHostpitalId] || 0;
        if(selectedSlotData  === undefined) {
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
        if(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId) !== -1) {
            expandedDoctorIdHospitalsToShowSlotsData.splice(expandedDoctorIdHospitalsToShowSlotsData.indexOf(doctorIdHospitalId), 1)
        } else {
            expandedDoctorIdHospitalsToShowSlotsData.push(doctorIdHospitalId);
        }
        this.setState({ expandedDoctorIdHospitalsToShowSlotsData, refreshCount : this.state.refreshCount + 1 });
    }
    sortByTopRatings(filteredDoctorData) {
        const { bookappointment: {  reviewsByDoctorIds } } = this.props;
       console.log(reviewsByDoctorIds);
        filteredData = filteredDoctorData.sort(function(a, b) {
            let ratingA = 0;
            let ratingB = 0;
            if(reviewsByDoctorIds[a.doctor_id]) {
                ratingA = reviewsByDoctorIds[a.doctor_id].average_rating || 0 
            };
            if(reviewsByDoctorIds[b.doctor_id]) {
                ratingB = reviewsByDoctorIds[b.doctor_id].average_rating || 0
            }
            if(currentDoctorOrder === 'ASC') {
               return ratingB - ratingA;
            } else if(currentDoctorOrder === 'DESC') {
                return  ratingA - ratingB;
            }
             
        });
        store.dispatch({
            type: SET_FILTERED_DOCTOR_DATA,
            data: filteredData
        })
        if(currentDoctorOrder === 'ASC') {
            currentDoctorOrder = 'DESC';
        } else if(currentDoctorOrder === 'DESC') {
            currentDoctorOrder = 'ASC';
        }
        this.setState( { refreshCount : this.state.refreshCount  + 1 });
    }
    
    
    render() {
       
        const { bookappointment: {  doctorData, patientWishListsDoctorIds, favouriteListCountByDoctorIds, reviewsByDoctorIds, filteredDoctorData } } = this.props;
        const { selectedDatesByDoctorIds, expandedDoctorIdHospitalsToShowSlotsData, isLoggedIn, selectedSlotItemByDoctorIds, 
            processedDoctorAvailabilityDates,
             isLoading, isAvailabilityLoading
             } = this.state;
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.componentNavigationMount() }}
                />

              { isLoading ? <Loader style='list' /> :
                     

              <Content>
              <View>
                <Card style={{ borderRadius: 7,paddingTop:5,paddingBottom:5 }}>
                    <Grid>
                      <Row>
                        <Col style={{ width: '55%',  flexDirection: 'row' }} onPress={() => this.sortByTopRatings(filteredDoctorData)}>
                          <Left>
                            <Icon name='ios-arrow-down' style={{ color: '#000', marginLeft: 50, fontSize: 20 }} />
                          </Left>
                          <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center',marginLeft:20,marginTop:5 }}>Top Rated </Text>
                          
                        </Col> 
                        {/* <Col style={{ width:'45%',alignItems: 'flex-start', flexDirection: 'row', }} onPress={() => this.navigateToFilters()}>
                                <Row>
                                  <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginLeft: 8,textAlign: 'center',marginTop:5 }}>Top Rated </Text>
                                  <Right><Icon name='ios-funnel' style={{ color: 'gray', marginRight:20, }}/></Right>
                                 
                                </Row>  
                        </Col> */}
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
                         <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                            <List style={{borderBottomWidth:0}}>
                              <ListItem>
                                <Grid >
                                  <Row onPress={()=> this.navigateToBookAppointmentPage(item) }>
                                    <Col style={{width:'5%'}}>
                                        <Thumbnail square source={ renderDoctorImage(item) } style={{ height: 60, width: 60 }} />
                                     </Col>
                                     <Col style={{width:'78%'}}>
                                        <Row style={{marginLeft:55,}}>
                                           <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold'}}>{(item.prefix ? item.prefix + '. ' : '' ) + (item.first_name || '') + ' ' + (item.last_name || '')}</Text>
                                        </Row>
                                        <Row style={{marginLeft:55,}}>
                                           <Text note  style={{ fontFamily: 'OpenSans',marginTop:2 ,fontSize:11}}>{(getDoctorEducation(item.education)) + ' ' +  getDoctorSpecialist(item.specialist)}</Text>
                                        </Row>
                                        <Row style={{marginLeft:55,}}>
                                       
                                           <Text style={{ fontFamily: 'OpenSans',marginTop:5,fontSize:12,fontWeight:'bold' }}>
                                              {item.location.location.address.city + ' - ' + item.location.name}
                                           </Text>
                                        </Row>
                                     </Col>
                                      <Col style={{width:'17%'}}>
                                          {isLoggedIn  ? 
                                             <Icon name="heart" onPress={()=>this.addToWishList(item.doctor_id)} 
                                                style={patientWishListsDoctorIds.includes(item.doctor_id) ? { marginLeft:20, color: '#B22222', fontSize:20 } : {marginLeft:20, borderColor: '#fff',fontSize:20}}>
                                             </Icon> : null }
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
                                                               
                                                <Text style={{ fontFamily: 'OpenSans',fontSize:12,fontWeight:'bold',marginLeft:2 }}> {reviewsByDoctorIds[item.doctor_id] !== undefined ? reviewsByDoctorIds[item.doctor_id].average_rating : ' 0'}</Text>
                                                </View>
                                                
                                        </Col>
                                                <Col style={{width:"25%",marginTop:20}}>
                                                
                                                <Text note style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5 ,}}> Favourite</Text>
                                                <Text style={{ fontFamily: 'OpenSans',fontSize:12,marginLeft:5,fontWeight:'bold' }}> { favouriteListCountByDoctorIds[item.doctor_id] ? favouriteListCountByDoctorIds[item.doctor_id] : 0 }</Text>


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
                                                {!expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ? 
                                                  <TouchableOpacity  onPress={()=>this.onBookPress(item.doctorIdHostpitalId)}  style={{ textAlign:'center',backgroundColor:'green',borderColor: '#000', marginTop:15, borderRadius: 20, height: 30,justifyContent:'center' ,marginLeft:5,marginRight:5 ,}}>
                                                      <Text style={{textAlign:'center',color:'#fff',fontSize:12,fontWeight:'bold',fontFamily:'OpenSans'}}>BOOK </Text>
                                                  </TouchableOpacity>  : null }
                                               </Col>
                                               
                                            </Row>
                                           
                                            {expandedDoctorIdHospitalsToShowSlotsData.includes(item.doctorIdHostpitalId) ? 
                                           
                                            <View>
                                            
                                                <Row style={{marginTop:10}}>
                                                <Text style={{fontSize:13,fontFamily:'OpenSans'}}>Select appoinment date and time</Text>
                                            </Row>
                                            {isAvailabilityLoading && !isLoading ? <Spinner/> : null}      
                                             {/* <Spinner visible={isAvailabilityLoading && !isLoading}/>      */}
                                              {this.renderDatesOnFlatlist(item.slotData, selectedDatesByDoctorIds[item.doctorIdHostpitalId] || this.state.currentDate, item.doctorIdHostpitalId)}
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
                                                 <Text style={{color:'#000',fontSize:12,fontFamily:'OpenSans',marginLeft:-16}}>{ selectedSlotItemByDoctorIds[item.doctorIdHostpitalId] ? formatDate(selectedSlotItemByDoctorIds[item.doctorIdHostpitalId].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null }</Text>
                                               </Col>
                                               <Col style={{width:'30%'}}>
                                               </Col>
                                               <Col style={{width:'30%'}}>
                                                  <TouchableOpacity                                                                                                                   
                                                     onPress={() => { console.log('......Pressing....'); this.onPressContinueForPaymentReview(item, selectedSlotItemByDoctorIds[item.doctorIdHostpitalId], item.doctorIdHostpitalId) }}
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
                    }
                       </View>
                </Content> 
            }

            </Container >
        )
    }
    renderDatesOnFlatlist(slotData, selectedDate,doctorIdHostpitalId ) {
      
        const reducer = (accumulator, currentValue) => { 
            if(!currentValue.isSlotBooked)
               return 1 + accumulator;
            else 
               return accumulator    
        }
       
        return ( 
            
            <FlatList
            horizontal={true}
            data={this.processedDoctorAvailabilityDates}
            extraData={[ this.state.selectedDatesByDoctorIds, this.state.selectedSlotItemByDoctorIds ]}
            onEndReachedThreshold={1}
            onEndReached={({ distanceFromEnd }) => {
                let endIndex = this.processedDoctorAvailabilityDates.length
                let lastProcessedDate = this.processedDoctorAvailabilityDates[endIndex - 1];
                let startMoment = getMoment(lastProcessedDate).add(1,'day');
                let endDateMoment = addMoment(lastProcessedDate, 7, 'days')
                if(this.state.isAvailabilityLoading === false)
                    this.getAvailabilitySlots(this.state.getSearchedDoctorIds,startMoment, endDateMoment)
            }}
            renderItem={({ item }) => 
            <Col style={{ width:100, justifyContent: 'center' }}>
             <TouchableOpacity  style={[styles.availabilityBG, selectedDate === item ? { backgroundColor:'#775DA3' } : { backgroundColor:'#ced6e0' } ]} 
               onPress={() => this.onDateChanged( item, doctorIdHostpitalId)}>
                <Text style={[{textAlign:'center',fontSize:12,fontFamily:'OpenSans'}, selectedDate === item ? { color:'#fff' } : { color:'#000' } ] }>{formatDate(moment(item), 'ddd, DD MMM')}</Text>
                <Text style={[{textAlign:'center',fontSize:10,fontFamily:'OpenSans'}, selectedDate === item ? { color:'#fff' } : { color:'#000' } ] }>{ slotData[item] ? slotData[item].reduce(reducer, 0) + ' Slots Available' : 'No Slots Available' }</Text>
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
        marginTop:10, 
        height: 30, 
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