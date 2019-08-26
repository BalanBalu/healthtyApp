import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Right, Thumbnail, Body, Icon, DatePicker } from 'native-base';
import { login } from '../../providers/auth/auth.actions';
import { messageShow, messageHide } from '../../providers/common/common.action';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import StarRating from 'react-native-star-rating';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { insertDoctorsWishList, searchDoctorList, fetchAvailabilitySlots, getMultipleDoctorDetails, getDoctorsReviewsCount, getPatientWishList } from '../../providers/bookappointment/bookappointment.action';
import { formatDate, addMoment, addTimeUnit, getMoment,addDate,dateDiff, findArrayObj, intersection } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { RenderHospitalAddress } from '../../common';
import { NavigationEvents } from 'react-navigation';
import Spinner from '../../../components/Spinner';
import moment from 'moment';


let conditionFromFilterPage;

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
                filterData: [],
                uniqueFilteredDocArray: [],
                yearOfExperience:''
            }
    }

    confirmAppointmentPress = (confirmedSlot) => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: this.state.confirmSlotDetails })
    };
    navigateToFilters() {
        this.props.navigation.navigate('Filters', { doctorData: this.state.doctorData, doctorDetailsWitSlots: this.state.doctorDetails })
    }
    componentDidMount = async () => {
        this.getPatientWishLists();
        this.getPatientSearchData();
    }
    componentNavigationMount = async() => {
        const { navigation } = this.props;
        const filterData = navigation.getParam('filterData');
        
        const filterBySelectedAvailabilityDateCount = navigation.getParam('filterBySelectedAvailabilityDateCount');
        conditionFromFilterPage = navigation.getParam('ConditionFromFilter');
        await this.setState({ filterData: filterData })
        if (conditionFromFilterPage == true) {
            console.log('comming FilterPage');
            this.renderDoctorListByFilteredData(filterData, filterBySelectedAvailabilityDateCount) 
        }
    }

    renderDoctorListByFilteredData = async (filterData, availtyDateCount) => {
        console.log('filterData' + JSON.stringify(filterData))
        console.log(availtyDateCount);
        let genderPreferenceMatchedList = [];
        let languageMatchedList = [];
        let categoryMatchedList = [];
        let servicesMatchedList = [];
        let experienceMatchedList = [];
        let availabilityMatchedList = [];
       
        this.state.doctorData.forEach((doctorElement) => {
            let doctorIdHostpitalId = doctorElement.doctorIdHostpitalId

            filterData.forEach((filterElement) => {
                if (filterElement.value) {
                    if(filterElement.type === 'gender_preference') {
                        if (doctorElement.gender_preference.includes(filterElement.value)) {
                            genderPreferenceMatchedList.push(doctorIdHostpitalId);
                        }
                    }

                    if(filterElement.type == 'language' ) {
                        doctorElement.language.forEach((docLanguage) => {
                            filterElement.value.forEach((filLanguage) => {
                                if (docLanguage.includes(filLanguage)) {
                                    languageMatchedList.push(doctorIdHostpitalId)
                                }
                            })
                        })     
                    }

                    if(filterElement.type === 'experience') {
                        if(doctorElement.experience) {
                           let updatedDate = moment(doctorElement.experience.updated_date);
                           let doctorExperienceMonth = dateDiff(updatedDate, moment(new Date()), 'months');
                           let filterValueExperienceInMonth = filterElement.value * 12; // value is returning as year to convert to months multiplies by 12 
                           if(filterValueExperienceInMonth >= doctorExperienceMonth) {
                                experienceMatchedList.push(doctorIdHostpitalId);
                           }
                        }
                    }

                    
                    if(filterElement.type === 'category') {
                       let specialistArray = doctorElement.specialist ? doctorElement.specialist : [];
                       specialistArray.forEach((docSpecialist) => {
                        if (docSpecialist.category === filterElement.value) {
                            categoryMatchedList.push(doctorIdHostpitalId)
                        }
                      })
                    }

                  if(filterElement.type === 'service') {
                    let specialistArray = doctorElement.specialist ? doctorElement.specialist : [];
                    specialistArray.forEach((docSpecialist) => {
                        if(filterElement.value.includes(docSpecialist.service)) {
                            servicesMatchedList.push(doctorIdHostpitalId)
                        }     
                    })
                  }
                }
              })
           });  
           let selectedFiltesArray = [];
          
           if (availtyDateCount !== 0) {
               this.state.doctorDetails.forEach((slotDetailElement) => {
                  for (i = 0; i < availtyDateCount; i++) {
                    let availabilityDate = formatDate(addTimeUnit(this.state.selectedDate, i, 'days'), "YYYY-MM-DD");
                    if (slotDetailElement.slotData[availabilityDate]) {
                        availabilityMatchedList.push(slotDetailElement.doctorIdHostpitalId)
                    }
                  }
                });
                selectedFiltesArray.push(availabilityMatchedList);
           } 
          
          
           filterData.forEach((filterElement) => {
            if (filterElement.value) {
                if(filterElement.type === 'gender_preference') {
                    selectedFiltesArray.push(genderPreferenceMatchedList); 
                }
                if(filterElement.type === 'language') {
                    selectedFiltesArray.push(languageMatchedList); 
                }
                if(filterElement.type === 'category') {
                    selectedFiltesArray.push(categoryMatchedList); 
                }
                if(filterElement.type === 'service') {
                    selectedFiltesArray.push(servicesMatchedList); 
                }
            }    
          });
         if(filterData.length !== 0 ) { 
            console.log(selectedFiltesArray);
            let filteredDocListArray = intersection(selectedFiltesArray);
            console.log(filteredDocListArray);
            await this.setState({ uniqueFilteredDocArray: filteredDocListArray })
        }
        //console.log(JSON.stringify(this.state.doctorDetails));
       /* let availableDateSlotsDocArray = [];
        if (availtyDateCount !== 0) {

            this.state.doctorDetails.forEach((docDetailElement) => {
                
                
                for (i = 0; i < availtyDateCount; i++) {
                    let sampleDateArray = formatDate(addTimeUnit(this.state.selectedDate, i, 'days'), "YYYY-MM-DD");
                    if (docDetailElement.slotData[sampleDateArray]) {
                        availableDateSlotsDocArray.push(docDetailElement.doctorId)
                    }
                }
            })
        } */
        // console.log('availableDateSlotsDocArray' + JSON.stringify(availableDateSlotsDocArray))

  /*      let filteredDocListArray = [];
        // console.log('this.state.doctorData'+JSON.stringify(this.state.doctorData))
        this.state.doctorData.forEach((doctorElement) => {
            let experience;

            filterData.forEach((filterElement) => {
                if (filterElement.value) {
                  if(filterElement.type ==='gender_preference'){  "M" --> doctor1 
                    if (doctorElement.gender_preference.includes(filterElement.value)) {
                        filteredDocListArray.push(doctorElement.doctor_id)
                    }
                  }
                    if(filterElement.type ==='experience') {  10 --> doctor2 

                        let updatedDate = moment(doctorElement.experience.updated_date);
                        let experienceInYear = dateDiff(updatedDate, this.state.selectedDate, 'year');
                        let experienceInMonth = dateDiff(updatedDate, this.state.selectedDate, 'months');
                        let year = (moment(doctorElement.experience.year) + experienceInYear);
                        let month = (moment(doctorElement.experience.month)) + experienceInMonth;
                        experience = experienceInYear + year;
                        // console.log('experience'+experience)
                        if (month >= 12) {
                          experience++;
                        }
                      
                    experience >= filterElement.value ? 
                       filteredDocListArray.push(doctorElement.doctor_id):null
                    }
                  
                    filterElement.type == 'language' ? 
                    doctorElement.language.forEach((docLanguage) => {
                            filterElement.value.forEach((filLanguage) => {
                                if (docLanguage.includes(filLanguage)) {
                                    filteredDocListArray.push(doctorElement.doctor_id)
                                }
                            })
                    }) :null
                
                filterElement.type ==='category' || 'service' ? --> doctor 2
                    doctorElement.specialist.forEach((docSpecialist) => {

                        if (docSpecialist.category.includes(filterElement.value)) {
                            filteredDocListArray.push(doctorElement.doctor_id)
                        }
                        if (docSpecialist.service.includes(filterElement.value)) {
                            filteredDocListArray.push(doctorElement.doctor_id)
                        }
                    }):null
                
                }
            })
        });
        // console.log('filteredDocListArray' + JSON.stringify(filteredDocListArray))

        var sortedArray = filteredDocListArray.slice().sort();

        var FinalFilteredByDocDetailsArray = [];

        for (var i = 0; i <= sortedArray.length - 1; i++) {
            if (sortedArray[i + 1] == sortedArray[i]) {
                FinalFilteredByDocDetailsArray.push(sortedArray[i]);
            }
        }
        // console.log('FinalFilteredByDocDetailsArray' + JSON.stringify(FinalFilteredByDocDetailsArray))

        let withAvailabilityDateDocArray = [];
        if (availableDateSlotsDocArray[0] && filteredDocListArray[0]) {
            // console.log('came filter availability date and DocDatas  condition')
            filteredDocListArray.forEach((ele_doctorId) => {
                if (availableDateSlotsDocArray.includes(ele_doctorId)) {
                    withAvailabilityDateDocArray.push(ele_doctorId);
                }
            })
            await this.setState({ uniqueFilteredDocArray: withAvailabilityDateDocArray })
            // console.log('withAvailabilityDateDocArray' + JSON.stringify(withAvailabilityDateDocArray))
        }

        else {
            if (availableDateSlotsDocArray[0]) {
                // console.log('came filter by only available dates')
                await this.setState({ uniqueFilteredDocArray: availableDateSlotsDocArray })
            }
            else {
                console.log('came both Filtered DocDetails data')
                filterData[1] !=undefined?
                    await this.setState({ uniqueFilteredDocArray: FinalFilteredByDocDetailsArray }):
                    await this.setState({ uniqueFilteredDocArray: filteredDocListArray })
                    // console.log('this.state.uniqueFilteredDocArray' + JSON.stringify(this.state.uniqueFilteredDocArray))
                
            }
        } */
    }
    /* Insert Doctors Favourite Lists  */
    addToWishList = async (doctorId, index) => {
        try {
            let requestData = {
                active: true
            };
            let userId = await AsyncStorage.getItem('userId');
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
            
            await this.getAvailabilitySlots(doctorIds,startDate, endDate).catch(res => console.log("Exception" + res));
            
            this.getPatientReviews(doctorIds).catch(res => console.log("Exception on getPatientReviews" + res));
            
          let doctorData = this.state.doctorData;
            let uniqueFilteredDocArray = []; 
            doctorData.forEach((element) => {
                console.log(element);
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
            
            let fields = "specialist,education,language,gender_preference,experience";
            let resultDoctorDetails = await getMultipleDoctorDetails(doctorIds, fields);
            if (resultDoctorDetails.success) {
                console.log(resultDoctorDetails.data);
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
                        }
                    } else {
                        this.processedDoctorData.push(doctorSlotData);
                        this.processedDoctorIds.push(doctorSlotData.doctorIdHostpitalId);
                        
                        let doctorDetailsData = this.doctorDetailsMap.get(doctorSlotData.doctorId)
                        let obj = {
                            ...doctorDetailsData,
                            doctorIdHostpitalId : doctorSlotData.doctorIdHostpitalId
                        }
                        this.processedDoctorDetailsData.push(obj);
                       
                    }
            }
                
                console.log(this.processedDoctorDetailsData);
                
                await this.setState({ doctorDetails: this.processedDoctorData, doctorData: this.processedDoctorDetailsData });
                this.enumarateDates(startDate, endDate)
                
            }
        } catch (e) {
            this.setState({ doctorDetails: [] });
            console.log(e);
        }
        finally {
            this.setState({ isAvailabilityLoading: false });
        }
    }
    enumarateDates(startDate, endDate) {
        let now = startDate.clone();
        while (now.isSameOrBefore(endDate)) {
            this.processedDoctorAvailabilityDates.push(now.format('YYYY-MM-DD'));
            now = now.add(1, 'day');
        }
    }


    /* Change the Date from Date Picker */
    onDateChanged(date) {
        let endDateMoment = addMoment(date, 7, 'days')

        let selectedDate = formatDate(date, 'YYYY-MM-DD');
        this.setState({ selectedDate: selectedDate });
        if (this.processedDoctorAvailabilityDates.includes(selectedDate) === false) {
            this.getAvailabilitySlots(this.state.getSearchedDoctorIds, getMoment(date), endDateMoment);
        }

    }

    /* Click the Slots from Doctor List page */
    onSlotPress = async (doctorData, selectedSlotItem, availableSlots, selectedSlotIndex) => {
        var selectedHospitalId = selectedSlotItem.location.hospital_id;
        let hospitalLocations = [];
        let tempHospitalArray = [];

        await this.setState({ singleDataWithDoctorDetails: doctorData });
        if (availableSlots[0].location.hospital_id === selectedHospitalId) {
            var confirmSlotDetails = {};
            confirmSlotDetails = this.state.singleDataWithDoctorDetails;
            confirmSlotDetails.slotData = selectedSlotItem;
            this.props.navigation.navigate('Payment Review', { resultconfirmSlotDetails: confirmSlotDetails })
        } else {
            availableSlots.forEach(element => {
                if (!tempHospitalArray.includes(element.location.hospital_id)) {
                    tempHospitalArray.push(element.location.hospital_id);
                    hospitalLocations.push({
                        _id: element.location.hospital_id,
                        hospitalLocationData: element.location,
                        hospitalSlotArray: [element]
                    });
                } else {
                    let index = tempHospitalArray.indexOf(element.location.hospital_id);
                    hospitalLocations[index].hospitalSlotArray.push(element);
                    this.getDoctorDetails(this.state.singleDataWithDoctorDetails.doctorId);
                    this.getPatientReviews(this.state.singleDataWithDoctorDetails.doctorId);
                }
            })
            await this.setState({ selectedDoctorHospitalLocations: hospitalLocations });
            await this.onClickedHospitalName(selectedHospitalId);
            await this.setState({ isModalVisible: true })
        }
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

    /* Click the Slots and Book Appointment on Popup page */
    onBookSlotsPress = async (item, index) => {

        this.setState({ confirm_button: false });
        var confirmSlotDetails = {};
        confirmSlotDetails = { ...this.state.singleDataWithDoctorDetails };
        confirmSlotDetails.slotData = item;
        await this.setState({ selectedSlotIndex: index, confirmSlotDetails: confirmSlotDetails });
    }

    navigateToBookAppointmentPage(doctorAvailabilityData) {
        console.log('coming here');
        const doctorDetails = doctorAvailabilityData;
        const slotData = doctorAvailabilityData.slotData[this.state.selectedDate]
        this.props.navigation.navigate('Book Appointment', { doctorDetails: doctorDetails, slotList: slotData })
    }



    noAvailableSlots(slotData) {
        let nextAvailableDate;
        for (let nextAvailableSlotDate of Object.keys(slotData)) {
            if (this.state.selectedDate < nextAvailableSlotDate) {
                nextAvailableDate = nextAvailableSlotDate;
                break;
            }
        }
        return (
            <Row style={{ justifyContent: 'center', marginTop: 20 }}>

                <Button style={{ alignItems: 'center', borderRadius: 10, backgroundColor: '#6e5c7b' }} onPress={() => { if (nextAvailableDate) this.setState({ selectedDate: nextAvailableDate }) }}>
                    {nextAvailableDate ? <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>Next Availability On {nextAvailableDate}</Text> : <Text style={{ color: '#fff', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16 }}> No Availablity for Next 7 Days</Text>}
                </Button>

            </Row>
        )
    }
    noDoctorsAvailable() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Doctors available! </Text>
            </Item>
        )
    }

    haveAvailableSlots(doctorData, slotsData) {
        return (
            <FlatList
                numColumns={100}
                data={slotsData}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                    <Row style={{ width: '28%', padding: 4 }}>
                        <Button disabled={item.isSlotBooked}
                            primary style={item.isSlotBooked ? styles.slotBookedBgColor : styles.slotDefaultBgColor}
                            onPress={() => { this.onSlotPress(doctorData, item, slotsData, index) }}>
                            <Text note style={{ fontFamily: 'OpenSans', color: 'white', fontSize: 13 }}>{formatDate(item.slotStartDateAndTime, 'hh:mm A')}</Text>
                        </Button>
                    </Row>

                } />
        )
    }


    render() {
        const { navigation } = this.props;
        const { isLoading, isAvailabilityLoading,
            uniqueFilteredDocArray, searchedResultData, categories, singleDataWithDoctorDetails, singleHospitalDataSlots, reviewData, patientWishListsDoctorIds } = this.state;
        return (

            <Container style={styles.container}>


                <NavigationEvents
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
                                data={this.state.doctorDetails.filter(ele => uniqueFilteredDocArray.includes(ele.doctorIdHostpitalId))}
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
                                                            ? <Thumbnail square source={{uri:item.profile_image.imageURL}} style={{ height: 60, width: 60 }} />
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

                                                </Body>
                                            {/* 
                                                <Right>
                                                    <Icon name='heart' type='Ionicons'
                                                        style={patientWishListsDoctorIds.includes(item.doctorId) ? { color: 'red', fontSize: 25 } : { color: 'gray', fontSize: 25 }}
                                                        onPress={() => this.addToWishList(item.doctorId, index)} ></Icon>

                                                        <Button style={{borderRadius:15,marginTop:90,height:35}} onPress={() => this.navigateToBookAppointmentPage(item)}>
                                                            <Text style={{fontFamily:'OpenSans',fontSize:11,justifyContent:'center'}}>View Profile</Text>
                                                        </Button>
                                                </Right> */}
                                            </ListItem>

                                            <Grid>
                                                <Row>
                                                    {item.slotData[this.state.selectedDate] !== undefined ?
                                                        <ListItem>
                                                            <ScrollView horizontal={true}>
                                                                {
                                                                    this.haveAvailableSlots(item, item.slotData[this.state.selectedDate])
                                                                }
                                                            </ScrollView>
                                                        </ListItem> : this.noAvailableSlots(item.slotData)
                                                    }
                                                </Row>
                                            </Grid>
                                        </List>
                                    </Card>
                                } />
                        }
                    </Content>
                }


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
                </Modal>

            </Container >
        )
    }

}

function loginState(state) {

    return {
        user: state.user
    }
}
export default connect(loginState, { login, messageShow, messageHide })(doctorSearchList)


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {
        padding: 5
    },

    slotDefaultBgColor: {
        height: 35,
        width: 90,
        fontFamily: 'OpenSans',
        fontSize: 12,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: '#745ca6'
    },


    slotBookedBgColor: {
        height: 35,
        width: '100%',
        fontFamily: 'OpenSans',
        fontSize: 12,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: '#878684'
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
    customPadge: {
        backgroundColor: 'green',
        alignItems: 'center',
        width: '30%'
    },

});