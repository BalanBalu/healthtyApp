import React, { Component } from 'react';
import { Container, Content, Text, Toast, Button, Card, Item, List, ListItem, Left, Thumbnail, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Dimensions, ScrollView, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import { searchByLabDetailsService, fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';
import { renderLabTestImage, RenderNoSlotsAvailable, RenderListNotFound, enumerateStartToEndDates } from '../labTestCommon';
import { Loader } from '../../../../components/ContentLoader';
import { formatDate, addMoment, getMoment } from '../../../../setup/helpers';
import styles from '../styles'
import RenderDates from './RenderDateList';
import RenderSlots from './RenderSlots';
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
            // availabilitySlotsDatesArry: [],
            expandedLabIdToShowSlotsData: [],
            // selectedSlotByDoctorIds: {},
            // availableSlotsDataByService: {},
            // refreshCount: 0,
            isLoading: false,
            refreshCountOnDateFL: 1
        }
    }
    async componentDidMount() {
        this.searchByLabCatAndDetails()
    }
    searchByLabCatAndDetails = async () => {
        try {
            this.setState({ isLoading: true });
            // const { navigation } = this.props;
            const inputDataBySearch = this.props.navigation.getParam('inputDataFromLabCat');
            const labListResponse = await searchByLabDetailsService(inputDataBySearch);
            // console.log('labListResponse====>', JSON.stringify(labListResponse));
            if (labListResponse.success) {
                const labListData = labListResponse.data;
                this.totalLabIdsArryBySearched = labListData.map(item => String(item.labInfo.lab_id));
                await this.setState({ labListData })
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

    getLabIdsArrayByInput = labIdFromItem => {
        const findIndexOfLabId = this.totalLabIdsArryBySearched.indexOf(String(labIdFromItem));
        return this.totalLabIdsArryBySearched.slice(findIndexOfLabId, findIndexOfLabId + 5) || []
    }

    /* get Lab Test Availability Slots service */
    getLabTestAvailabilitySlots = async (labIdFromItem, startDateByMoment, endDateByMoment) => {
        try {
            this.availabilitySlotsDatesArry = enumerateStartToEndDates(startDateByMoment, endDateByMoment);
            const arryOfLabIds = this.getLabIdsArrayByInput(labIdFromItem) // get 5 Or LessThan 5 of LabIds in order wise using index of given input of labIdFromItem
            const reqData4Availability = {
                "labIds": arryOfLabIds
            }
            const reqStartAndEndDates = {
                startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
                endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
            }
            const resultSlotsData = await fetchLabTestAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
            // console.log('resultSlotsData======>', resultSlotsData)
            if (resultSlotsData.success) {
                const availabilityData = resultSlotsData.data;
                if (availabilityData.length != 0) {
                    availabilityData.map((item) => { this.availableSlotsDataMap.set(String(item.labId), item.slotData) })
                    this.setState({})
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
            this.setState({})
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

    onPressToContinue4PaymentReview() {   // navigate to next further process
        alert('Continue pressed')
    }

    renderLabListCards(item) {
        const { expandedLabIdToShowSlotsData, selectedDate } = this.state;
        const slotDataObj4Item = this.availableSlotsDataMap.get(String(item.labInfo.lab_id)) || {}
        return (
            <View>
                <Card style={{ padding: 2, borderRadius: 10, borderBottomWidth: 2 }}>
                    <List style={{ borderBottomWidth: 0 }}>
                        <ListItem style={{ borderBottomWidth: 0 }}>
                            <Grid>
                                <Row>
                                    <Col style={{ width: '5%' }}>
                                        <Thumbnail source={renderLabTestImage(item.labInfo)} style={{ height: 60, width: 60 }} />
                                    </Col>
                                    <Col style={{ width: '80%' }}>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{item.labInfo.lab_name}</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>
                                            <Text note style={{ fontFamily: 'OpenSans', marginTop: 2, fontSize: 11 }}>{item.labCatInfo.category_name}</Text>
                                        </Row>
                                        <Row style={{ marginLeft: 55, }}>
                                            {item.labInfo.location.address ?
                                                <View>
                                                    <Text note style={{ fontFamily: 'OpenSans', marginTop: 5, fontSize: 11, color: '#4c4c4c' }}>{item.labInfo.location.address.no_and_street + ' , ' +
                                                        item.labInfo.location.address.district + ' , ' +
                                                        item.labInfo.location.address.city + ' , ' +
                                                        item.labInfo.location.address.state}</Text>
                                                </View> : null}
                                        </Row>
                                    </Col>
                                    <Col style={{ width: '15%' }}>
                                        <Row>
                                            <TouchableOpacity>
                                                <Icon name="heart"
                                                    style={{ marginLeft: 20, color: '#000', fontSize: 20 }}>
                                                </Icon>
                                            </TouchableOpacity>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Col style={{ width: "25%", marginLeft: -10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}> Favourites</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{item.Favorites || ''}</Text>
                                    </Col>
                                    <Col style={{ width: "25%" }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center', }}> Rating</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <StarRating
                                                fullStarColor='#FF9500'
                                                starSize={12}
                                                width={85}
                                                containerStyle={{ marginTop: 2 }}
                                                disabled={true}
                                                rating={1}
                                                maxStars={1}
                                            />
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', marginLeft: 2 }}>0</Text>
                                        </View>
                                    </Col>
                                    <Col style={{ width: "25%" }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, }}>Offer</Text>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', color: 'green' }}>{item.labInfo && item.labInfo.labPriceInfo && item.labInfo.labPriceInfo[0] && item.labInfo.labPriceInfo[0].offer || ''} off</Text>
                                    </Col>
                                    <Col style={{ width: "25%", marginLeft: 10 }}>
                                        <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}>Package Amt</Text>
                                        <Row style={{ justifyContent: 'center' }}>
                                            <Text style={styles.finalRs}>₹ {item.labInfo && item.labInfo.labPriceInfo && item.labInfo.labPriceInfo[0] && item.labInfo.labPriceInfo[0].price || ''}</Text>
                                            {/* <Text style={styles.finalRs}>₹ {item.finalAmount || ''}</Text> */}
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <View> */}
                                {/* <View style={{ borderTopColor: '#090909', borderTopWidth: 0.2, marginTop: 10 }}> */}
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
                                                : <RenderNoSlotsAvailable />
                                        }
                                        <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col size={10} style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                                    <Text note style={{ fontSize: 12, alignSelf: 'flex-start', fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                                                    <Text style={{ alignSelf: 'flex-start', color: '#000', fontSize: 12, fontFamily: 'OpenSans', marginTop: 5 }}>{this.selectedSlotItemByLabIdsObj[item.labInfo.lab_id] ? formatDate(this.selectedSlotItemByLabIdsObj[item.labInfo.lab_id].slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                                                </Col>
                                                {/* <Col style={{ width: '35%' }}></Col> */}
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
                                            <Col style={{ width: '35%', marginLeft: 10 }}>
                                                <Icon name='ios-funnel' style={{ color: 'gray' }} />
                                            </Col>
                                            <Col style={{ width: '65%' }}>
                                                <Text uppercase={false} style={{ fontFamily: 'OpenSans', color: '#000', fontSize: 13, marginTop: 5, marginLeft: 5, width: '100%' }}>Filters </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                            <View>
                                {labListData.length === 0 ? <RenderListNotFound /> :
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
                    </Content>
                }
            </Container >
        )
    }
}
export default labSearchList
