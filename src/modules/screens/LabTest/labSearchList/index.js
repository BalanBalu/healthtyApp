import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Form, CheckBox, Picker, Item, List, ListItem, Left, Thumbnail, Icon, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image, Modal } from 'react-native';
import { searchByLabDetailsService, fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';
import { RenderFavoritesComponent, RenderFavoritesCount, RenderStarRatingCount, RenderPriceDetails, RenderOfferDetails, RenderAddressInfo, renderLabTestImage, RenderNoSlotsAvailable, RenderListNotFound } from '../../CommonAll/components';
import { enumerateStartToEndDates } from '../../CommonAll/functions'
import { Loader } from '../../../../components/ContentLoader';
import { formatDate, addMoment, getMoment } from '../../../../setup/helpers';
import styles from '../../CommonAll/styles'
import RenderDates from './RenderDateList';
import RenderSlots from './RenderSlots';
import { getWishList4PatientByLabTestService, addFavoritesToLabByUserService, getTotalWishList4LabTestService, getTotalReviewsCount4LabTestService, SET_SINGLE_LAB_ITEM_DATA } from '../../../providers/labTest/labTestBookAppointment.action'
import { store } from '../../../../setup/store'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { color } from 'react-native-reanimated';

const CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT = 5;

class labSearchList extends Component {
    availabilitySlotsDatesArry = [];
    selectedDateObj = {};
    selectedSlotByLabIdsObj = {};
    selectedSlotItemByLabIdsObj = {};
    totalLabIdsArryBySearched = [];
    availableSlotsDataMap = new Map();
    constructor(props) {
        super(props)
        this.state = {
            currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
            selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
            labListData: [],
            expandedLabIdToShowSlotsData: [],
            isLoading: false,
            refreshCountOnDateFL: 1,
            renderRefreshCount: 0,
            isLoggedIn: false,
            modalVisible: false,
            proposedVisible: false,
            testOptionChecked: false,
            values: [3, 7],
            selected: "key0"
        }
    }
    async componentDidMount() {
        const userId = await AsyncStorage.getItem('userId');
        this.searchByLabCatAndDetails();
        if (userId) {
            this.getPatientWishListsByUserId(userId);
            this.setState({ isLoggedIn: true })
        }
    }
    /* Update Favorites for LabTest by UserId  */
    addToFavoritesList = async (labId) => {
        const userId = await AsyncStorage.getItem('userId');
        await addFavoritesToLabByUserService(userId, labId);
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }
    getPatientWishListsByUserId = (userId) => {
        try {
            getWishList4PatientByLabTestService(userId);
        } catch (Ex) {
            console.log('Ex is getting on get Wish list details for Patient====>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on WishList for Patient : ${Ex}`
            }
        }
    }
    searchByLabCatAndDetails = async () => {
        try {
            this.setState({ isLoading: true });
            const inputDataBySearch = this.props.navigation.getParam('inputDataFromLabCat');
            const labListResponse = await searchByLabDetailsService(inputDataBySearch);
            console.log('labListResponse====>', labListResponse);
            if (labListResponse.success) {
                const labListData = labListResponse.data;
                this.totalLabIdsArryBySearched = labListData.map(item => String(item.labInfo.lab_id));
                await this.setState({ labListData });
                console.log("labListData", this.state.labListData)
                this.getTotalWishList4LabTest(this.totalLabIdsArryBySearched);
                this.getTotalReviewsCount4LabTest(this.totalLabIdsArryBySearched);

            }
        } catch (ex) {
            Toast.show({
                text: 'Something Went Wrong' + ex,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false })
        }
    }

    getTotalWishList4LabTest = async (labIdsArry) => {
        try {
            getTotalWishList4LabTestService(labIdsArry);
        } catch (Ex) {
            console.log('Ex is getting on get Wish list details for Patient====>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on WishList for Patient : ${Ex}`
            }
        }
    }
    getTotalReviewsCount4LabTest = async (labIdsArry) => {
        try {
            // getTotalReviewsCount4LabTestService(labIdsArry);
        } catch (Ex) {
            console.log('Ex is getting on get Reviews count for Lab====>', Ex)
            return {
                success: false,
                statusCode: 500,
                error: Ex,
                message: `Exception while getting on Reviews count for Lab : ${Ex}`
            }
        }
    }



    getLabIdsArrayByInput = labIdFromItem => {
        const findIndexOfLabId = this.totalLabIdsArryBySearched.indexOf(String(labIdFromItem));
        return this.totalLabIdsArryBySearched.slice(findIndexOfLabId, findIndexOfLabId + CALL_AVAILABILITY_SERVICE_BY_NO_OF_IDS_COUNT) || []

    }

    /* get Lab Test Availability Slots service */
    getLabTestAvailabilitySlots = async (labIdFromItem, startDateByMoment, endDateByMoment) => {
        try {
            this.availabilitySlotsDatesArry = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.availabilitySlotsDatesArry);
            const arryOfLabIds = this.getLabIdsArrayByInput(labIdFromItem) // get 5 Or LessThan 5 of LabIds in order wise using index of given input of labIdFromItem
            const reqData4Availability = {
                "labIds": arryOfLabIds
            }
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchLabTestAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            console.log('resultSlotsData======>', resultSlotsData);
            if (resultSlotsData.success) {
                const availabilityData = resultSlotsData.data;
                if (availabilityData.length != 0) {
                    availabilityData.map((item) => {
                        let previousSlotsDataByItem = this.availableSlotsDataMap.get(String(item.labId))
                        let finalSlotsDataObj = { ...previousSlotsDataByItem, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
                        this.availableSlotsDataMap.set(String(item.labId), finalSlotsDataObj)
                    })
                    this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
                }
            }
        } catch (ex) {
            console.log('Ex getting on getAvailabilitySlots service======', ex.message);
        }
    }

    onBookPress = async (labIdFromItem) => {
        const { expandedLabIdToShowSlotsData } = this.state;
        if (expandedLabIdToShowSlotsData.indexOf(labIdFromItem) !== -1) {
            expandedLabIdToShowSlotsData.splice(expandedLabIdToShowSlotsData.indexOf(labIdFromItem), 1)
        } else {
            expandedLabIdToShowSlotsData.push(labIdFromItem);
        }
        const startDateByMoment = addMoment(this.state.currentDate)
        const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
        console.log('slot is Booked');
        if (!this.availableSlotsDataMap.has(String(labIdFromItem))) {
            this.getLabTestAvailabilitySlots(labIdFromItem, startDateByMoment, endDateByMoment);
        }
        else {
            this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
    }

    /* Change the Date from Date Picker */
    onDateChanged(selectedDate, labId) {
        this.selectedDateObj[labId] = selectedDate;
        this.selectedSlotByLabIdsObj[labId] = -1;
        this.selectedSlotItemByLabIdsObj[labId] = null;
        this.setState({ refreshCountOnDateFL: this.state.refreshCountOnDateFL + 1 })
    }
    onSlotItemPress(labId, selectedSlot, selectedSlotIndex) {
        this.selectedSlotByLabIdsObj[labId] = selectedSlotIndex;
        this.selectedSlotItemByLabIdsObj[labId] = selectedSlot;
        this.setState({ selectedSlotIndex })
    }
    callSlotsServiceWhenOnEndReached = (labId, availabilitySlotsDatesArry) => { // call availability slots service when change dates on next week
        const finalIndex = availabilitySlotsDatesArry.length
        const lastProcessedDate = availabilitySlotsDatesArry[finalIndex - 1];
        const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
        const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
        if (!this.availabilitySlotsDatesArry.includes(endDateByMoment.format('YYYY-MM-DD'))) {
            this.getLabTestAvailabilitySlots(labId, startDateByMoment, endDateByMoment);
        }
    }
    renderDatesOnFlatList(labId) {
        const selectedDate = this.selectedDateObj[labId] || this.state.currentDate;
        const slotDataObj4Item = this.availableSlotsDataMap.get(String(labId)) || {}
        if (!Object.keys(slotDataObj4Item)) {
            return null;
        }
        return (
            <View>
                <RenderDates availabilitySlotsDatesArry={this.availabilitySlotsDatesArry}
                    onDateChanged={(item, labId) => this.onDateChanged(item, labId)}
                    selectedDate={selectedDate}
                    selectedDateObj={this.selectedDateObj}
                    availableSlotsData={slotDataObj4Item}
                    labId={labId}
                    callSlotsServiceWhenOnEndReached={(labId, availabilitySlotsDatesArry) => {
                        this.callSlotsServiceWhenOnEndReached(labId, availabilitySlotsDatesArry)
                    }}
                    shouldUpdate={`${labId}-${selectedDate}`}
                >
                </RenderDates>
            </View>
        )
    }
    renderAvailableSlots(labId, slotsData) {
        let selectedSlotIndex = this.selectedSlotByLabIdsObj[labId] !== undefined ? this.selectedSlotByLabIdsObj[labId] : -1;
        return (
            <View>
                <RenderSlots
                    selectedSlotIndex={selectedSlotIndex}
                    // selectedDate={selectedDate}
                    slotData={slotsData}
                    labId={labId}
                    shouldUpdate={`${labId}-${selectedSlotIndex}`}
                    onSlotItemPress={(labId, selectedSlot, selectedSlotIndex) => this.onSlotItemPress(labId, selectedSlot, selectedSlotIndex)}
                >
                </RenderSlots>
            </View>
        )
    }

    onPressToContinue4PaymentReview(labData, selectedSlotItem) {   // navigate to next further process
        const { labInfo, labCatInfo } = labData;
        console.log("labCatInfo", labCatInfo)
        if (!selectedSlotItem) {
            Toast.show({
                text: 'Please Select a Slot to continue booking',
                type: 'warning',
                duration: 3000
            })
            return;
        }
        let packageDetails = {
            lab_id: labInfo.lab_id,
            lab_test_categories_id: labCatInfo.lab_test_categories_id,
            lab_test_description: labCatInfo.category_discription || 'null',
            fee: labCatInfo.price || 0,
            extra_charges: labInfo.extra_charges || 0,
            mobile_no: labInfo.mobile_no || null,
            lab_name: labInfo.lab_name,
            category_name: labCatInfo.category_name,
            appointment_starttime: selectedSlotItem.slotStartDateAndTime,
            appointment_endtime: selectedSlotItem.slotEndDateAndTime,
            "location": labInfo.location
        }
        this.props.navigation.navigate('labConfirmation', { packageDetails })
    }

    onPressGoToBookAppointmentPage(labItemData) {
        const { labInfo } = labItemData
        labItemData.labId = labInfo.lab_id;
        labItemData.slotData = this.availableSlotsDataMap.get(String(labInfo.lab_id)) || {};
        let reqLabBookAppointmentData = { ...labItemData }
        store.dispatch({
            type: SET_SINGLE_LAB_ITEM_DATA,
            data: reqLabBookAppointmentData
        });
        this.props.navigation.navigate('LabBookAppointment', { LabId: labInfo.lab_id, availabilitySlotsDatesArry: this.availabilitySlotsDatesArry });
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    multiSliderValuesChange = (values) => {
        this.setState({
            values,
        });
    }
    onValueChange(value) {
        this.setState({
            selected: value
        });
    }
    renderLabListCards(item) {

        const { labTestData: { patientWishListLabIds, wishListCountByLabIds, reviewCountsByLabIds } } = this.props;
        const { expandedLabIdToShowSlotsData, isLoggedIn } = this.state;
        const slotDataObj4Item = this.availableSlotsDataMap.get(String(item.labInfo.lab_id)) || {}
        return (
            <View>
                <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                    <List style={{ borderBottomWidth: 0 }}>
                        <ListItem style={{ borderBottomWidth: 0 }}>
                            <Grid>
                                <Row onPress={() => this.onPressGoToBookAppointmentPage(item)}>
                                    <Col style={{ width: '5%' }}>
                                        <Thumbnail source={renderLabTestImage(item.labInfo)} style={{ height: 60, width: 60 }} />
                                    </Col>
                                    <Col style={{ width: '80%' }}>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{item.labInfo.lab_name + ' ' + item.labInfo.location_code}</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 12 }}>{(item.labCatInfo.categoryInfo && item.labCatInfo.categoryInfo.category_name) + ' - '}</Text>
                                            <Text style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 12 }}>{item.labCatInfo.category_name}</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>

                                            <RenderAddressInfo
                                                addressInfo={item.labInfo.location && item.labInfo.location.address ? item.labInfo.location.address : null}
                                            />
                                        </Row>
                                    </Col>
                                    <Col style={{ width: '15%' }}>
                                        <Row>
                                            <RenderFavoritesComponent
                                                isLoggedIn={isLoggedIn}
                                                isEnabledFavorites={patientWishListLabIds.includes(item.labInfo.lab_id)}
                                                onPressFavoriteIcon={() => this.addToFavoritesList(item.labInfo.lab_id)}
                                            />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col style={{ width: "25%", marginLeft: -10 }}>
                                        <RenderFavoritesCount
                                            favoritesCount={wishListCountByLabIds[item.labInfo.lab_id] ? wishListCountByLabIds[item.labInfo.lab_id] : '0'}
                                        />
                                    </Col>
                                    <Col style={{ width: "25%" }}>

                                        <RenderStarRatingCount
                                            totalRatingCount={reviewCountsByLabIds[item.labInfo.lab_id] ? reviewCountsByLabIds[item.labInfo.lab_id].average_rating : ' 0'}
                                        />
                                    </Col>
                                    <Col style={{ width: "25%" }}>

                                        <RenderOfferDetails
                                            offerInfo={item.labCatInfo && item.labCatInfo.offer ? item.labCatInfo.offer : ' '}
                                        />
                                    </Col>
                                    <Col style={{ width: "25%", marginLeft: 10 }}>
                                        <RenderPriceDetails
                                            priceInfo={item.labCatInfo && item.labCatInfo.price ? item.labCatInfo.price : ' '}
                                        />
                                    </Col>
                                </Row>
                                <Row  >
                                    <Col style={{ width: "5%" }}>
                                        <Icon name='ios-time' style={{ fontSize: 20, marginTop: 12 }} />
                                    </Col>
                                    <Col style={{ width: "80%" }}>
                                        <Text note style={{ fontFamily: 'OpenSans', marginTop: 15, fontSize: 12, marginRight: 50, fontWeight: 'bold' }}>Available On Thu,23 Jan 20 </Text>
                                    </Col>
                                    <Col style={{ width: "15%" }}>
                                        {!expandedLabIdToShowSlotsData.includes(item.labInfo.lab_id) ?
                                            <TouchableOpacity onPress={() => this.onBookPress(item.labInfo.lab_id)} style={{ textAlign: 'center', backgroundColor: 'green', borderColor: '#000', marginTop: 10, borderRadius: 20, height: 30, justifyContent: 'center', paddingLeft: 1, paddingRight: 1, }}>
                                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'OpenSans' }}>BOOK </Text>
                                            </TouchableOpacity> : null}
                                    </Col>
                                </Row>
                                {expandedLabIdToShowSlotsData.includes(item.labInfo.lab_id) ?
                                    <View>
                                        <Row style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Select appointment date and time</Text>
                                        </Row>
                                        {this.renderDatesOnFlatList(item.labInfo.lab_id)}
                                        {
                                            slotDataObj4Item[this.selectedDateObj[item.labInfo.lab_id] || this.state.currentDate] !== undefined ?
                                                this.renderAvailableSlots(item.labInfo.lab_id, slotDataObj4Item[this.selectedDateObj[item.labInfo.lab_id] || this.state.currentDate])
                                                : <RenderNoSlotsAvailable
                                                    text={'No Slots Available'}
                                                />
                                        }
                                        <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                    <Text note style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                    <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{this.selectedSlotItemByLabIdsObj[item.labInfo.lab_id] ? formatDate(this.selectedSlotItemByLabIdsObj[item.labInfo.lab_id].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                </Col>
                                                <Col size={4}>
                                                    <TouchableOpacity
                                                        onPress={() => { this.onPressToContinue4PaymentReview(item, this.selectedSlotItemByLabIdsObj[item.labInfo.lab_id], item.labInfo.lab_id) }}
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

    render() {
        const { labTestData: { patientWishListLabIds } } = this.props;

        const { labListData, isLoading } = this.state;
        return (
            <Container style={styles.container}>
                {isLoading ? <Loader style='list' /> :
                    <Content>
                        <View>
                            <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
                                <Row>
                                    <Col style={{ width: '55%', flexDirection: 'row', marginLeft: 5, }} >
                                        <Row>
                                            <Col style={{ width: '15%' }}>
                                                <Icon name='ios-arrow-down' style={{ color: '#000', fontSize: 20, marginTop: 5 }} />
                                            </Col>
                                            <Col style={{ width: '85%' }}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, textAlign: 'center', marginTop: 5 }}>Top Rated </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col style={{ width: '45%', alignItems: 'flex-start', flexDirection: 'row', borderLeftColor: 'gray', borderLeftWidth: 1 }}>
                                        <Row>
                                            <TouchableOpacity onPress={() => {
                                                this.setModalVisible(true);
                                            }} style={{ flexDirection: 'row' }}>
                                                <Col style={{ width: '35%', marginLeft: 10 }}>
                                                    <Icon name='ios-funnel' style={{ color: 'gray' }} />
                                                </Col>
                                                <Col style={{ width: '65%' }}>
                                                    <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5, marginLeft: 5, width: '100%' }}>Filters </Text>
                                                </Col>
                                            </TouchableOpacity>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                            <View>
                                {labListData.length === 0 ? <RenderListNotFound text={' No Lab list found!'} /> :
                                    <View>
                                        <FlatList
                                            data={labListData}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) =>
                                                this.renderLabListCards(item)
                                            } />
                                    </View>
                                }
                            </View>
                        </View>

                        <Modal
                            animationType='fade'
                            transparent={true}
                            backdropColor="transparent"
                            backgroundColor="transparent"
                            containerStyle={{
                                justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                            visible={this.state.modalVisible}
                            animationType={'slide'}
                            overlayColor={'rgba(0,0,0,0.5)'}
                        >
                            <Grid style={{
                                backgroundColor: '#fff',
                                position: 'absolute',
                                top: 100,
                                justifyContent: 'center',
                                borderRadius: 5, borderColor: 'gray', borderWidth: 0.3
                            }}>
                                <View style={{ width: '100%' }}>
                                    <View style={{ marginLeft: 20, marginTop: 10, marginRight: 20 }}>
                                        <Row >
                                            <Col size={6}>
                                                <Row style={styles.rowMainText}>
                                                    <Text style={styles.mainHeadText}>Test Option</Text>
                                                </Row>
                                            </Col>
                                            <Col size={4}></Col>
                                        </Row>
                                        <View>
                                            <Row style={{ paddingBottom: 15, borderBottomColor: '#909090', borderBottomWidth: 0.3, }}>
                                                <Col size={6} >
                                                    <Row style={{ marginTop: 10, paddingLeft: 5 }}>
                                                        <Col size={5}>
                                                            <TouchableOpacity style={styles.homeTextButton}>
                                                                <Text style={styles.innerTexts}>Test at Home</Text>

                                                            </TouchableOpacity>
                                                        </Col>
                                                        <Col size={5} style={{ marginLeft: 5 }}>
                                                            <TouchableOpacity style={styles.labTextButton}>
                                                                <Text style={styles.innerTexts}>Test at Lab</Text>

                                                            </TouchableOpacity>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col size={4}>
                                                </Col>
                                            </Row>
                                        </View>
                                        <Row style={{ marginTop: 10 }} >
                                            <Col size={6}>
                                                <Row style={styles.rowMainText}>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#000' }}>Services</Text>
                                                </Row>
                                            </Col>
                                            <Col size={4}></Col>
                                        </Row>

                                        <Row style={{ marginTop: 10, paddingBottom: 15, borderBottomColor: '#909090', borderBottomWidth: 0.3 }}>
                                            <Col size={10}>
                                                <TouchableOpacity onPress={() => this.toggle("Services")}>
                                                    <Row >

                                                        <Col size={10} style={styles.multiSelectStyle}>
                                                            <SectionedMultiSelect
                                                                styles={{
                                                                    selectToggleText: {
                                                                        color: '#909090',
                                                                        fontSize: 12,

                                                                        marginTop: 20,
                                                                        height: 15

                                                                    },
                                                                    chipIcon: {
                                                                        color: '#909090',
                                                                    },

                                                                }}
                                                                items={this.state.languageData}
                                                                uniqueKey='value'
                                                                displayKey='value'
                                                                selectText='Select Services'
                                                                selectToggleText={{ fontSize: 10, }}
                                                                searchPlaceholderText='Search Your Languages'
                                                                modalWithTouchable={true}
                                                                showDropDowns={true}
                                                                hideSearch={false}
                                                                showRemoveAll={true}
                                                                showChips={false}
                                                                readOnlyHeadings={false}
                                                                onSelectedItemsChange={this.onSelectedStatusChange}
                                                                selectedItems={this.state.language}
                                                                colors={{ primary: '#18c971' }}
                                                                showCancelButton={true}
                                                                animateDropDowns={true}
                                                                selectToggleIconComponent={
                                                                    <Icon
                                                                        name="ios-arrow-down"
                                                                        style={{
                                                                            fontSize: 20,
                                                                            marginHorizontal: 6,
                                                                            color: '#909090',
                                                                            textAlign: 'center',
                                                                            marginTop: 10,
                                                                        }}
                                                                    />
                                                                }

                                                                testID='languageSelected'
                                                            />
                                                        </Col>



                                                    </Row>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col size={6}>
                                                <Row style={styles.rowMainText}>
                                                    <Text style={styles.mainHeadText}>Sub Categories</Text>
                                                </Row>
                                            </Col>
                                            <Col size={4}></Col>
                                        </Row>
                                        <Row style={{ marginTop: 10, paddingBottom: 15, borderBottomColor: '#909090', borderBottomWidth: 0.3 }}>
                                            <Col size={10}>
                                                <TouchableOpacity onPress={() => this.toggle("Services")}>
                                                    <Row >

                                                        <Col size={10} style={styles.multiSelectStyle}>
                                                            <SectionedMultiSelect
                                                                styles={{
                                                                    selectToggleText: {
                                                                        color: '#909090',
                                                                        fontSize: 12,
                                                                        marginTop: 20,
                                                                        height: 15
                                                                    },
                                                                    chipIcon: {
                                                                        color: '#909090',
                                                                    },
                                                                }}
                                                                items={this.state.languageData}
                                                                uniqueKey='value'
                                                                displayKey='value'
                                                                selectText='Select Sub Category'
                                                                selectToggleText={{ fontSize: 10, }}
                                                                searchPlaceholderText='Search Your Languages'
                                                                modalWithTouchable={true}
                                                                showDropDowns={true}
                                                                hideSearch={false}
                                                                showRemoveAll={true}
                                                                showChips={false}
                                                                readOnlyHeadings={false}
                                                                onSelectedItemsChange={this.onSelectedStatusChange}
                                                                selectedItems={this.state.language}
                                                                colors={{ primary: '#18c971' }}
                                                                showCancelButton={true}
                                                                animateDropDowns={true}
                                                                selectToggleIconComponent={
                                                                    <Icon
                                                                        name="ios-arrow-down"
                                                                        style={{
                                                                            fontSize: 20,
                                                                            marginHorizontal: 6,
                                                                            color: '#909090',
                                                                            textAlign: 'center',
                                                                            marginTop: 10,
                                                                        }}
                                                                    />
                                                                }

                                                                testID='languageSelected'
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TouchableOpacity>
                                            </Col>
                                        </Row>
                                        <View >
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={6}>

                                                    <Row style={styles.rowMainText}>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#000' }}>Price</Text>
                                                    </Row>
                                                </Col>
                                                <Col size={4}></Col>
                                            </Row>
                                            <View >
                                                <Row style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5, }}>
                                                    <Col size={10}>
                                                        <Row>
                                                            <Col size={1} style={{ justifyContent: 'center', height: 25, }}>
                                                                <TouchableOpacity style={styles.priceDetails}>
                                                                    <Text style={styles.innerTexts}>100</Text>
                                                                </TouchableOpacity>
                                                            </Col>
                                                            <Col size={8} style={{ marginTop: -12, marginLeft: 8 }}>
                                                                <MultiSlider
                                                                    values={[this.state.values[0], this.state.values[1]]}
                                                                    sliderLength={275}
                                                                    onValuesChange={this.multiSliderValuesChange}
                                                                    min={0}
                                                                    max={10}
                                                                    step={1}
                                                                    touchDimensions={{ height: 50, width: 50, borderRadius: 15, slipDisplacement: 200 }}
                                                                    customMarkerRight={(e) => {
                                                                        return (<CustomSliderMarkerRight
                                                                            currentValue={e.currentValue} />)
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col size={1} style={{ justifyContent: 'center', height: 25, marginLeft: 5 }}>
                                                                <TouchableOpacity style={styles.priceDetails}>
                                                                    <Text style={styles.innerTexts}>800</Text>

                                                                </TouchableOpacity>
                                                            </Col>
                                                        </Row>

                                                    </Col>
                                                </Row>
                                                <Row style={{ borderTopColor: '#909090', borderTopWidth: 0.3, paddingBottom: 15, paddingTop: 10 }}>
                                                    <Right>
                                                    <TouchableOpacity onPress={() => { this.setModalVisible(false)}}>
                                                        <Text style={styles.doneButton}>DONE</Text>
                                                        </TouchableOpacity>
                                                    </Right>
                                                </Row>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Grid>
                        </Modal>
                    </Content>
                }
            </Container >
        )
    }
}

const LabTestBookAppointmentState = (state) => ({
    labTestData: state.labTestData
})
export default connect(LabTestBookAppointmentState)(labSearchList)

