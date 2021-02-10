import React, { Component } from 'react';
import { Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Image, Share } from 'react-native';
import { formatDate, addMoment, getMoment, getUnixTimeStamp, setCurrentISOTime4GivenDate } from '../../../../setup/helpers';
import { store } from '../../../../setup/store';
import {primaryColor} from '../../../../setup/config'

import {
    addFavoritesToDocByUserService,
    getFavoriteListCount4PatientService,
    getMultipleDoctorDetails,
    serviceOfGetTotalReviewsCount4Doctors,
    ServiceOfGetDoctorFavoriteListCount4Pat,
    fetchDoctorAvailabilitySlotsService,
    fetchDocHomeHealthcareAvailabilitySlotsService,
    SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
    SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS
} from '../../../providers/BookAppointmentFlow/action';
import { userReviews } from '../../../providers/profile/profile.action';
import { fetchAvailableDoctors4Video } from '../../../screens/VideoConsulation/services/video-consulting-service';
import { fetchAvailableDoctors4Chat } from '../../../providers/chat/chat.action';
// import RenderHospitalLoc from './RenderHospitalLoc'
import { Loader } from '../../../../components/ContentLoader';
import { CATEGORY_BASE_URL, CURRENT_APP_NAME } from '../../../../setup/config';
import { RenderReviewData } from '../../Reviews/ReviewCard';
setDocInfoAndAvailableSlotsData = null;
showedHospitalDoctorId = null;
showLocBySelectedSlotItem = null;
selectedSlotFee = null;
selectedSlotFeeWithoutOffer = null;
showedFee = null;
const DOCTOR_FIELDS = "first_name,last_name,prefix,professional_statement,gender,specialist,education,language,gender_preference,experience,profile_image,hospital";
import styles from '../../CommonAll/styles';
import { enumerateStartToEndDates } from '../../CommonAll/functions';
import RenderDatesList from '../DoctorList/RenderDateList';
import RenderDoctorInfoPreview from '../../DoctorBookAppointmentFlow/doctorDetailsPreview/RenderDoctorInfoPreview';

class DoctorDetailsPreview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            onPressTabView: 1,
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            doctorData: {},
            doctorDetails: null,
            showedFee: undefined,
            doctorId: null,
            specialistWithServicesList: [],
            isAvailabilityLoading: false,
            isLoggedIn: false,
            categoryShownObj: {},
            isLoadedUserReview: false,
            reviewsData: [],
            userId: null,
            reqPinCode: null,
            userAddressInfo: null,
            isLoadingReviews: false,
            showMoreOption: false,
            renderRefreshCount: 1,
            reviewRefreshCount: 0,
        }
        this.isVideoAvailability = false;
        this.isChatAvailability = false;
        this.onEndReachedIsTriggedFromRenderDateList = false;
        this.selectedAppointmentSlot = null;
        this.weekWiseDatesList = [];
    }



    async componentDidMount() {
        const { navigation } = this.props;
        const { selectedDate } = this.state;
        const availabilitySlots = navigation.getParam('fetchAvailabiltySlots') || false;
        const startDateByMoment = addMoment(selectedDate)
        const endDateByMoment = addMoment(selectedDate, 7, 'days');
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
            this.setState({ isLoggedIn: true, userId });
        }
        if (availabilitySlots) { // coming from  My Home Health care Appointment list via click  Book again button.
            await this.dispatchAndCResetOfRattingAndFavorites();  // clear the Ratting and Favorites counts in search list Props.
            const doctorId = navigation.getParam('doctorId');
            const [doctorDetailsResp] = await Promise.all([
                getMultipleDoctorDetails(doctorId, DOCTOR_FIELDS).catch(Ex => console.log('Ex is getting on get Doctor details====>', Ex)),
                ServiceOfGetDoctorFavoriteListCount4Pat(doctorId).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex)),
                serviceOfGetTotalReviewsCount4Doctors(doctorId).catch(Ex => console.log("Ex is getting on get Total Reviews  list details for Patient" + Ex)),
            ]);
            if (doctorDetailsResp.success && doctorDetailsResp.data && doctorDetailsResp.data[0]) {
                this.setDocInfoAndAvailableSlotsData = doctorDetailsResp.data[0];
                const reqPinCode = navigation.getParam('reqPinCode');
                const userAddressInfo = navigation.getParam('userAddressInfo') || null;
                this.setState({ reqPinCode, userAddressInfo, doctorId, doctorData: this.setDocInfoAndAvailableSlotsData, isLoading: false });
                if (userId) {
                    await this.getFavoriteCounts4PatByUserId(userId);
                }
                await this.callVideAndChat(doctorId);
            }
            await this.getDoctorAvailabilitySlots(startDateByMoment, endDateByMoment);
            await this.getFeesBSelectedDate(this.setDocInfoAndAvailableSlotsData.slotData && this.setDocInfoAndAvailableSlotsData.slotData[selectedDate], this.setDocInfoAndAvailableSlotsData.slotData);
            await this.formServiceListByUsingSpecialist(this.setDocInfoAndAvailableSlotsData.specialist || []);
        } else {
            this.weekWiseDatesList = navigation.getParam('weekWiseDatesList') || [];
            let doctorItemData = navigation.getParam('singleDoctorItemData');
            const reqPinCode = navigation.getParam('reqPinCode');
            const userAddressInfo = navigation.getParam('userAddressInfo') || null;
            const singleDoctorAvailabilityData = navigation.getParam('singleDoctorAvailabilityData');
            this.setState({ reqPinCode, userAddressInfo, doctorId: doctorItemData.doctorId, doctorData: doctorItemData, isLoading: false });
            await this.callVideAndChat(doctorItemData.doctor_id);
            if (singleDoctorAvailabilityData) {
                doctorItemData.slotData = singleDoctorAvailabilityData
            }
            this.doctorDetailsObj = doctorItemData;
            this.setDocInfoAndAvailableSlotsData = doctorItemData;
            if (!doctorItemData.slotData) {
                await this.getDoctorAvailabilitySlots(startDateByMoment, endDateByMoment);
            }
            await this.getFeesBSelectedDate(this.setDocInfoAndAvailableSlotsData.slotData && this.setDocInfoAndAvailableSlotsData.slotData[selectedDate], this.setDocInfoAndAvailableSlotsData.slotData);
            await this.formServiceListByUsingSpecialist(doctorItemData.specialist || []);
        }
    }



    async callVideAndChat(doctorId) {
        try {
            let [availableDocsVideo, availableDocsChat] = await Promise.all([
                this.getDoctorAvailableDoctorData([doctorId]).catch(ex => { console.log(ex); return [] }),
                this.getDoctorAvailableDoctorDataChat([doctorId]).catch(ex => { console.log(ex); return [] }),
            ])
            availableDocsVideo.forEach(doc => {
                this.isVideoAvailability = true;
            });
            availableDocsChat.forEach(docChat => {
                this.isChatAvailability = true;
            })
        } catch (error) {
            console.log('Error is getting on Get Chat and Video video availability details==>', error.message)
        }
        finally {
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
    }


    getDoctorAvailableDoctorData = async (doctorIds) => {
        try {
            if (doctorIds) {
                doctorIds = doctorIds.join(',')
            }
            const availableDocData = await fetchAvailableDoctors4Video(doctorIds);
            if (availableDocData.success === true) {
                return availableDocData.data;
            }
        } catch (error) {
         
            return [];
        }
        return [];
    }

    getDoctorAvailableDoctorDataChat = async (doctorIds) => {
        try {
            let request = {};
            if (doctorIds) {
                request = {
                    doctor_ids: doctorIds
                }
            }
            const availableDocData = await fetchAvailableDoctors4Chat(request);
            if (availableDocData.success === true) {
                return availableDocData.data
            }
        } catch (error) {
            return []
        }
        return []
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

    }
    /* Update Favorites for Doctor by UserId  */
    addToFavoritesList = async (doctorId) => {
        const userId = await AsyncStorage.getItem('userId');
        await addFavoritesToDocByUserService(userId, doctorId);
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    getFavoriteCounts4PatByUserId = async (userId) => {
        try {
            await getFavoriteListCount4PatientService(userId);
        } catch (Ex) {
            
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Favorites for Patient : ${Ex}`
            }
        }
    }

    formServiceListByUsingSpecialist = (specialistArry) => {
        const specialistWithServicesList = [];
        const categoryIdsList = [];
        if (specialistArry.length) {
            specialistArry.forEach(item => {
                const findIndexOfCategoryId = categoryIdsList.indexOf(item.category_id);
                const service_id = item.service_id;
                const service_name = item.service;
                if (findIndexOfCategoryId === -1) {
                    const obj = {
                        category_id: item.category_id,
                        category_name: item.category,
                        isServiceShown: false,
                        services: [{
                            service_id,
                            service_name
                        }]
                    }
                    specialistWithServicesList.push(obj);
                    categoryIdsList.push(item.category_id);
                } else {
                    specialistWithServicesList[findIndexOfCategoryId].services.push({
                        service_id,
                        service_name
                    })
                }
            });
        }
        this.setState({ specialistWithServicesList, isLoading: false })
    }

    getDoctorAvailabilitySlots = async (startDateByMoment, endDateByMoment) => {
        try {
            const { reqPinCode } = this.state;
            this.weekWiseDatesList = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.weekWiseDatesList);
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const reqData4Availability = {
                "doctorIds": [this.state.doctorId]
            }
            if (reqPinCode) {
                reqData4Availability.locationData = {
                    from_pincode: reqPinCode,
                    to_pincode: reqPinCode,
                }
            }
            const availabilityResp = await fetchDocHomeHealthcareAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            const availabilityData = availabilityResp.data;
            if (availabilityResp.success === true && availabilityData && availabilityData.length > 0) {
                const availabilityDataObj = availabilityData[0].slotData;
                const baCupOfDocInfo = this.setDocInfoAndAvailableSlotsData;
                const finalSlotsDataObj = { ...baCupOfDocInfo.slotData, ...availabilityDataObj } // Merge the Previous weeks and On change the Next week slots data
                delete baCupOfDocInfo.slotData
                const finalDocAndAvailabilityObj = {
                    ...baCupOfDocInfo, slotData: finalSlotsDataObj
                }
                this.setDocInfoAndAvailableSlotsData = finalDocAndAvailabilityObj;
            }
            this.setState({ doctorData: this.setDocInfoAndAvailableSlotsData })
        } catch (error) {
            this.setState({ isLoading: false })
         
        }
    }

    getPatientReviews = async (doctorId) => {
        try {
            this.setState({ isLoadingReviews: true })
            const reviewsResp = await userReviews(doctorId, 'doctor');
            if (reviewsResp.success) {
                this.setState({ reviewsData: reviewsResp.data, isLoadedUserReview: true });
            }
        }
        catch (error) {
            console.log('Ex getting on get Patient Reviews list service======', error.message);
        }
        finally {
            this.setState({ isLoadingReviews: false });
        }
    }

    getFeesBSelectedDate(slotDataBySelectedDate, wholeSlotData) {
        this.selectedAppointmentSlot = slotDataBySelectedDate;
        if (slotDataBySelectedDate === undefined) {
            slotDataBySelectedDate = wholeSlotData[Object.keys(wholeSlotData)[0]]
        }
        if (slotDataBySelectedDate) {
            this.selectedSlotFee = slotDataBySelectedDate.fee;
            this.selectedSlotFeeWithoutOffer = slotDataBySelectedDate.feeWithoutOffer
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
    }
    /*   navigate to next further process    */
    onPressToContinue4PaymentReview = async () => {
        if (!this.selectedAppointmentSlot) {
            Toast.show({
                text: 'Please select a slot to continue booking',
                type: 'warning',
                duration: 3000
            })
            return;
        }
        const { doctorData } = this.state;
        const doctorDetails = doctorData;
        doctorDetails.doctorName = doctorDetails.first_name + ' ' + doctorDetails.last_name;
        doctorDetails.doctorId = doctorDetails.doctor_id;
        delete doctorDetails.slotData;
        const isoFormatOfSelectedDate = setCurrentISOTime4GivenDate(this.selectedAppointmentSlot.slotDate);  // send only selected slot date and get with ISO format;
        this.selectedAppointmentSlot.slotDate = isoFormatOfSelectedDate;
        const confirmSlotDetails = { ...doctorDetails, slotData: this.selectedAppointmentSlot };
        this.props.navigation.navigate('HomeHealthcareConfirmation', { resultconfirmSlotDetails: confirmSlotDetails, userAddressInfo: this.state.userAddressInfo })
    }

    shareDocInfo = async (doctorData) => {
        try {
            const doctorNameWithPrefix = `${doctorData.prefix}.${doctorData.first_name} ${doctorData.last_name}`;
            const result = await Share.share({
                title: CURRENT_APP_NAME + ' Consultation',
                message:
                    ` ${CURRENT_APP_NAME} Consultation :-
              Recommend  "${doctorNameWithPrefix}" from ${CURRENT_APP_NAME} select is one of the top "${this.state.specialistWithServicesList[0].category_name}" in the country.
              You can instantly consult  "${doctorNameWithPrefix}"   on the ${CURRENT_APP_NAME} app.`,
                // url: "https://medflic.com/appointment/booking?doctorId=" + this.state.doctorId
            });
            //  I recommend her for any relevant health concerns.
        } catch (error) {
            console.log('Ex is getting on Share plain content====>', Ex)
        }
    }

    renderDocInfoPreviewCard() {
        const { isLoggedIn, doctorData } = this.state;
        const { bookAppointmentData: { patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs } } = this.props;
        return (
            <View>
                <RenderDoctorInfoPreview
                    navigation={this.props.navigation}
                    doctorData={doctorData}
                    docInfoData={{ isLoggedIn, fee: this.selectedSlotFee, feeWithoutOffer: this.selectedSlotFeeWithoutOffer, isVideoAvailability: this.isVideoAvailability, isChatAvailability: this.isChatAvailability, patientFavoriteListCountOfDoctorIds, docFavoriteListCountOfDoctorIDs, docReviewListCountOfDoctorIDs }}
                    addToFavoritesList={(doctorId) => { this.addToFavoritesList(doctorId) }}
                    shareDocInfo={(doctorData) => { this.shareDocInfo(doctorData) }}
                >
                </RenderDoctorInfoPreview>
            </View>
        )
    }

    render() {
        const { doctorData, isLoading, selectedDate, onPressTabView, specialistWithServicesList, categoryShownObj, isLoadedUserReview, reviewsData, isLoadingReviews } = this.state;
        if (isLoading) return <Loader style='appointment' />;
        return (
            <Container style={{ backgroundColor: '#ffffff' }}>
                <Content contentContainerStyle={{ flex: 0, padding: 10 }}>
                    <Card style={{ borderBottomWidth: 0.3 }}>
                        <Grid>
                            {Object.keys(doctorData).length ? this.renderDocInfoPreviewCard() : null}
                        </Grid>
                    </Card>
                    <Row style={{ marginLeft: 5, marginRight: 5, marginTop: 10 }}>
                        <Segment>
                            <TouchableOpacity first style={[{ width: '50%', borderBottomWidth: 5, alignItems: 'center', justifyContent: 'center' }, onPressTabView === 1 ? { borderBottomColor: primaryColor } : { borderBottomColor: '#000' }]} onPress={() => { this.setState({ onPressTabView: 1 }) }}>
                                <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>About</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ width: '50%', borderBottomWidth: 5, alignContent: 'center', justifyContent: 'center' }, onPressTabView === 2 ? { borderBottomColor: primaryColor } : { borderBottomColor: '#000' }]} onPress={() => {
                                if (!isLoadedUserReview) {
                                    this.getPatientReviews(doctorData.doctor_id);
                                }
                                this.setState({ onPressTabView: 2 });
                            }}>
                                <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>Reviews</Text>
                            </TouchableOpacity>

                        </Segment>
                    </Row>

                    {onPressTabView === 1 ?
                        <Content>
                            {doctorData.professional_statement ?
                                <View>
                                    <View style={{ marginLeft: 5, marginRight: 5, marginTop: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}>Description</Text>
                                        {this.state.showMoreOption === false ?
                                            <Text style={styles.customText}>{(doctorData.professional_statement).slice(0, 100)} <Text style={{ fontFamily: 'OpenSans', color: 'blue', fontSize: 14 }} onPress={() => this.setState({ showMoreOption: true })}>{doctorData.professional_statement.length > 100 ? '...View more' : ''}</Text></Text> :
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12 }}>{doctorData.professional_statement} <Text style={{ fontFamily: 'OpenSans', color: 'blue', fontSize: 14 }} onPress={() => this.setState({ showMoreOption: false })}>...Hide</Text></Text>}
                                    </View>
                                    <Row style={{ marginLeft: 5, marginRight: 5, paddingBottom: 5 }}>
                                        <Right><Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: primaryColor }}></Text></Right>
                                    </Row>
                                </View> : null}
                            <View>
                                <Row style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date</Text>
                                </Row>
                                {this.renderDatesOnFlatList(doctorData.slotData, selectedDate)}
                                <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                    <Text style={doctorData.slotData && doctorData.slotData[selectedDate] ? { fontSize: 12, alignSelf: 'flex-start', color: '#000', fontFamily: 'OpenSans' } : { color: '#a90e0e', fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans', marginTop: 10 }}> {doctorData.slotData && doctorData.slotData[selectedDate] ? "You Selected Appointment on" : "Appointment is Not Available"}</Text>
                                    <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: primaryColor, fontSize: 12, fontFamily: 'OpenSans', marginTop: 5, marginLeft: 5 }}>{doctorData.slotData && doctorData.slotData[selectedDate] ? formatDate(doctorData.slotData[selectedDate].slotDate, 'ddd DD MMM YYYY') : null}</Text>
                                </View>
                            </View>
                            {doctorData.awards ?
                                <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.3, marginBottom: 5, marginTop: 10 }}>
                                    <Row style={{ marginTop: 10, paddingTop: 10 }}>
                                        <Icon name='ios-medkit' style={{ fontSize: 20, color: 'gray' }} />
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Awards</Text>
                                    </Row>
                                    <FlatList
                                        data={doctorData.awards || []}
                                        extraData={doctorData.awards}
                                        renderItem={({ item }) =>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 13, marginLeft: 26 }}>{item}</Text>
                                        } keyExtractor={(item, index) => index.toString()} />
                                </View> : null}

                            <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.3, marginTop: 10 }}>
                                <Row style={{ marginTop: 10, paddingTop: 10 }}>
                                    <Icon name='ios-medkit' style={{ fontSize: 20, color: 'gray' }} />
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Language Spoken</Text>
                                </Row>

                                <Row style={{ marginLeft: 20 }}>
                                    <FlatList
                                        data={doctorData.language}
                                        extraData={doctorData.language}
                                        horizontal={true}
                                        renderItem={({ item }) =>
                                            <View style={{ marginLeft: 10 }}>
                                                <View style={{ borderColor: '#000', borderWidth: 1, marginTop: 10, height: 25, borderRadius: 10, justifyContent: 'center' }}>
                                                    <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans', padding: 3 }}>{item}</Text>
                                                </View>
                                            </View>
                                        } keyExtractor={(item, index) => index.toString()} />
                                </Row>
                            </View>

                            <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.3, marginTop: 10 }}>
                                <Row style={{ marginTop: 10, paddingTop: 10 }}>
                                    <Icon name='ios-medkit' style={{ fontSize: 20, color: 'gray' }} />
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Services</Text>
                                </Row>
                                <FlatList
                                    data={specialistWithServicesList}
                                    extraData={categoryShownObj}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                var categoryShownObj = { ...this.state.categoryShownObj }
                                                categoryShownObj[item.category_id] = !categoryShownObj[item.category_id];
                                                this.setState({ categoryShownObj })
                                            }}>
                                                <Row style={{ marginLeft: 20, marginTop: 20, borderTopColor: 'gray', borderTopWidth: 0.3 }}>
                                                    <Col style={{ width: '22%', paddingTop: 10 }}>
                                                        <Image square source={{ uri: CATEGORY_BASE_URL + item.category_id + '.png' }}
                                                            style={{ height: 50, width: 50, borderRadius: 5 }} />
                                                    </Col>
                                                    <Col style={{ width: '83%', marginTop: 10, paddingTop: 10 }}>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', width: '90%' }}>{item.category_name}</Text>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontStyle: 'italic' }}>{item.services.length} {item.services.length === 1 ? 'Service' : 'Services'}</Text>
                                                    </Col>
                                                </Row>
                                            </TouchableOpacity>
                                            {categoryShownObj[item.category_id] === true ?
                                                <FlatList
                                                    data={item.services}
                                                    extraData={categoryShownObj}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={({ item }) =>
                                                        <Row style={{ marginLeft: 100, borderTopColor: 'gray', borderTopWidth: 0.3 }}>
                                                            <Text style={{ fontSize: 18 }}>{'\u2022'}</Text>
                                                            <Text style={{ flex: 1, paddingLeft: 5, fontSize: 12, fontFamily: 'OpenSans', marginTop: 6 }}>{item.service_name}</Text>
                                                        </Row>
                                                    } />
                                                : null}

                                        </View>} />
                            </View>

                        </Content> : null}

                    {onPressTabView === 2 ?
                        <Content >
                            {isLoadingReviews === true ? <Spinner color='blue' /> :
                                reviewsData.length === 0 ?
                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                        <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No reviews yet</Text>
                                    </Item> :
                                    <FlatList
                                        data={reviewsData}
                                        extraData={[this.state.reviewRefreshCount, reviewsData]}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) =>
                                            <RenderReviewData
                                                navigation={this.props.navigation}
                                                item={item}
                                                userId={this.state.userId}
                                                refreshCount={() => this.setState({ reviewRefreshCount: this.state.reviewRefreshCount + 1 })}
                                            />
                                        } />
                            }
                        </Content> : null}


                </Content>

                <Footer style={{ backgroundColor: primaryColor, }}>
                    <Row>
                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}
                                onPress={() => this.onPressToContinue4PaymentReview()}
                                testID='clickButtonToPaymentReviewPage'>
                                <Row style={{ justifyContent: 'center', }}>
                                    <Text style={{ marginLeft: -25, marginTop: 2, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center' }}>BOOK APPOINTMENT</Text>
                                </Row>
                            </Button>
                        </Col>
                    </Row>
                </Footer>
            </Container>
        )

    }


    renderDatesOnFlatList(slotData, selectedDate) {
        if (slotData === undefined || !Object.keys(slotData)) {
            return null;
        }
        return (
            <View>
                <RenderDatesList
                    selectedDate={selectedDate}
                    slotData={slotData}
                    doctor_id={this.state.doctorId}
                    weekWiseDatesList={this.weekWiseDatesList}
                    onDateChanged={(item) => { this.onDateChanged(item) }}
                    callSlotsServiceWhenOnEndReached={(doctor_id, weekWiseDatesList) => {
                        this.callSlotsServiceWhenOnEndReached(doctor_id, weekWiseDatesList);
                    }}
                    shouldUpdate={`${selectedDate}`}
                    onEndReachedIsTriggedFromRenderDateList={this.onEndReachedIsTriggedFromRenderDateList}
                >
                </RenderDatesList>
            </View>
        )
    }

    /* Change the Date from Date Picker */
    onDateChanged = async (date) => {
        this.onEndReachedIsTriggedFromRenderDateList = false;
        let { selectedDate, doctorData } = this.state;
        selectedDate = date;
        if (this.weekWiseDatesList.includes(selectedDate) === false) {
            let endDateMoment = addMoment(getMoment(selectedDate), 7, 'days');
            await this.getDoctorAvailabilitySlots(getMoment(selectedDate), endDateMoment);
        }
        this.getFeesBSelectedDate(doctorData.slotData[selectedDate], doctorData.slotData);
        this.setState({ selectedDate, renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    callSlotsServiceWhenOnEndReached = async (doctorId, weekWiseDatesList) => { // call availability slots service when change dates on next week
        this.onEndReachedIsTriggedFromRenderDateList = true;
        const finalIndex = weekWiseDatesList.length
        const lastProcessedDate = weekWiseDatesList[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.weekWiseDatesList.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            await this.getDoctorAvailabilitySlots(startDateByMoment, endDateByMoment);
        }
    }

}


const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({ bookAppointmentData })
export default connect(bookAppointmentDataState)(DoctorDetailsPreview)

