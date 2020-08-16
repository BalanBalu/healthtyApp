import React, { Component } from 'react';
import { Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner, List, ListItem, Left, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Image } from 'react-native';
import RenderReviews from './RenderReviews'
// import RenderDescription from './RenderDescription';
import { formatDate, addMoment, getMoment, getUnixTimeStamp } from '../../../../setup/helpers';
import RenderDates from '../labSearchList/RenderDateList';
import RenderSlots from '../labSearchList/RenderSlots';
import { RenderFavoritesComponent, RenderFavoritesCount, RenderStarRatingCount, RenderPriceDetails, RenderOfferDetails, renderLabProfileImage, RenderNoSlotsAvailable } from '../../CommonAll/components'
import { enumerateStartToEndDates } from '../../CommonAll/functions'
import { } from '../../../providers/labTest/labTestBookAppointment.action';
import { fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';
import RenderLabLocation from '../RenderLabLocation';
import { Loader } from '../../../../components/ContentLoader';
import { addFavoritesToLabByUserService, getLabDetails, getTotalWishList4LabTestService, getTotalReviewsCount4LabTestService } from '../../../providers/labTest/labTestBookAppointment.action'
import RenderLabCategories from '../RenderLabCategories';
import styles from '../../CommonAll/styles'
fields = "lab_name,mobile_no,location_code,location,extra_charges,available_lab_test_categories";

class LabBookAppointment extends Component {
  availabilitySlotsDatesArry = [];
  slotData4ItemMap = new Map();
  selectedSlotItem = null;
  selectedSlotIndex = -1
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
      isLoading: true,
      onPressTabView: 1,
      selectedSlotIndex: -1,
      labId: null,
      isAvailabilityLoading: false,
      isLoggedIn: false,
      userId: null,
      showMoreOption: false,
      renderRefreshCount: 0,
      refreshCountOnDateFL: 1,
      buttonEnable: false,
      labInfoData: {},
      fetchAvailabiltySlots: props.navigation.getParam('fetchAvailabiltySlots') || false
    }
  }


  async componentDidMount() {
    const { navigation } = this.props;
    const { labInfoData, fetchAvailabiltySlots } = this.state;
    this.setState({ isLoading: true });
    const startDateByMoment = addMoment(this.state.selectedDate)
    const endDateByMoment = addMoment(this.state.selectedDate, 7, 'days');
    let userId = await AsyncStorage.getItem('userId');
    if (userId) {
      this.setState({ isLoggedIn: true, userId });
    }
    if (fetchAvailabiltySlots) {
      let labDetailsObj = {}, result;
      const labId = navigation.getParam('labId') || false;
      const labDetailsResp = await getLabDetails(labId, fields)

      if (labDetailsResp.success && labDetailsResp.data && labDetailsResp.data[0]) {
        result = labDetailsResp.data[0];
        labDetailsObj.labInfo = {
          lab_id: result.lab_id,
          mobile_no: result.mobile_no || null,
          lab_name: result.lab_name,
          location: result.location,
          location_code: result.location_code
        }
        labDetailsResp.data[0].available_lab_test_categories.map(CatInfo => {
          if (labId.includes(CatInfo.branch_details.lab_id)) {
            labDetailsObj.labCatInfo = CatInfo;
          }
        })

      }

      this.setState({ labInfoData: labDetailsObj, labId });
      await this.getLabTestAvailabilitySlots(labId, startDateByMoment, endDateByMoment);

    } else {
      const labId = navigation.getParam('labId') || false;
      const labInfoData = navigation.getParam('singleLabItemData');
      await this.setState({ labInfoData, labId });

      this.availabilitySlotsDatesArry = navigation.getParam('availabilitySlotsDatesArry');
      if (Object.keys(labInfoData.slotData).length === 0) {
        await this.getLabTestAvailabilitySlots(labInfoData.labInfo.lab_id, startDateByMoment, endDateByMoment);
      }
      else {
        this.slotData4ItemMap.set(String(labInfoData.labInfo.lab_id), labInfoData.slotData)
      }
    }
    this.setState({ isLoading: false });
  }


  /* get Lab Test Availability Slots service */
  getLabTestAvailabilitySlots = async (labIdFromItem, startDateByMoment, endDateByMoment) => {
    try {
      this.availabilitySlotsDatesArry = enumerateStartToEndDates(startDateByMoment, endDateByMoment, this.availabilitySlotsDatesArry);
      const reqData4Availability = {
        "labIds": [labIdFromItem]
      }
      const reqStartAndEndDates = {
        startDate: formatDate(startDateByMoment, 'YYYY-MM-DD'),
        endDate: formatDate(endDateByMoment, 'YYYY-MM-DD')
      }
      const resultSlotsData = await fetchLabTestAvailabilitySlotsService(reqData4Availability, reqStartAndEndDates);
      console.log("resultSlotsData", resultSlotsData);
      
      if (resultSlotsData.success) {
        const availabilityData = resultSlotsData.data;
        if (availabilityData.length != 0) {
          availabilityData.map((item) => {
            let previousSlotsDataByItem = this.slotData4ItemMap.get(String(item.labId))
            let finalSlotsDataObj = { ...previousSlotsDataByItem, ...item.slotData } // Merge the Previous weeks and On change the Next week slots data
            this.slotData4ItemMap.set(String(item.labId), finalSlotsDataObj)
          })
          this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
        }
      }
    } catch (ex) {
      console.log('Ex getting on getAvailabilitySlots service======', ex.message);
    }
    finally {
      this.setState({ isLoading: false });
    }
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


  /* Change the Date using Date Picker */
  onDateChanged(onChangeDate) {
    let { selectedDate } = this.state
    selectedDate = onChangeDate;
    this.selectedSlotIndex = -1;
    this.selectedSlotItem = null;
    this.setState({ selectedDate, refreshCountOnDateFL: this.state.refreshCountOnDateFL + 1 });
  }
  renderDatesOnFlatList() {
    const { selectedDate, labId } = this.state
    const slotDataObj4Item = this.slotData4ItemMap.get(String(labId)) || {}

    if (Object.keys(slotDataObj4Item).length === 0) {
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

  onSlotItemPress(labId, selectedSlot, selectedSlotIndex) {
    this.selectedSlotIndex = selectedSlotIndex;
    this.selectedSlotItem = selectedSlot;
    this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 })
  }
  renderWorkingHours(slotsData) {
    const { selectedDate, labId } = this.state;
    return (
      <View>
        <RenderSlots
          selectedSlotIndex={this.selectedSlotIndex}
          selectedDate={selectedDate}
          slotData={slotsData}
          labId={labId}
          shouldUpdate={`${labId}-${this.selectedSlotIndex}`}
          onSlotItemPress={(labId, selectedSlot, selectedSlotIndex) => this.onSlotItemPress(labId, selectedSlot, selectedSlotIndex)}
        >
        </RenderSlots>
      </View>
    )
  }

  renderLabLocAddress() {
    const { labInfoData } = this.state;
    const { labInfo } = labInfoData || {};
    if (!labInfo.location) {
      return null;
    }
    return labInfo.location ?
      <RenderLabLocation
        number={labInfo.lab_id}
        locationData={labInfo.location}
        name={labInfo.lab_name + " " + labInfo.location_code}
      /> : null
  }
  onPressContinueForPaymentReview(labData, selectedSlotItem) {
    const { labInfo, labCatInfo } = labData;
    if (!selectedSlotItem) {
      Toast.show({
        text: 'Please Select a Slot to continue booking',
        type: 'warning',
        duration: 3000
      })
      return;
    }
    let fee = (parseInt(labCatInfo.branch_details.price) - ((parseInt(labCatInfo.branch_details.offer) / 100) * parseInt(labCatInfo.branch_details.price)))
    let packageDetails = {
      lab_id: labInfo.lab_id,
      lab_test_categories_id: labCatInfo.lab_test_categories_id,
      lab_test_description: labCatInfo.category_discription || 'null',
      fee: fee || labCatInfo.price || 0,
      extra_charges: labInfo.extra_charges || 0,
      mobile_no: labInfo.mobile_no || null,
      lab_name: labInfo.lab_name,
      category_name: labCatInfo.category_name,
      selectedSlotItem: selectedSlotItem,
      location: labInfo.location
    }
    this.props.navigation.navigate('labConfirmation', { packageDetails })
  }
  /* Update Favorites for LabTest by UserId  */
  addToFavoritesList = async (labId) => {
    this.setState({ buttonEnable: true });
    const updateResp = await addFavoritesToLabByUserService(this.state.userId, labId);
    if (updateResp)
      Toast.show({
        text: 'Lab wish list updated successfully',
        type: "success",
        duration: 3000,
      });
    this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1, buttonEnable: false, });
  }
  render() {
    const { selectedDate, labInfoData, isLoggedIn, showMoreOption, labId, onPressTabView, isLoading, buttonEnable } = this.state;
    const slotDataObj4Item = this.slotData4ItemMap.get(String(labId)) || {}
    const { labTestData: { patientWishListLabIds, wishListCountByLabIds, reviewCountsByLabIds } } = this.props;
    const { labInfo, labCatInfo } = labInfoData;

    return (
      <Container style={styles.container}>
        {isLoading ?
          <Loader style='appointment' /> :
          <Content contentContainerStyle={{ flex: 0, padding: 10 }}>
            <Card style={{ borderBottomWidth: 2 }}>
              <Grid >
                <Row >
                  <Col style={{ width: '5%', marginLeft: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderLabProfileImage(labInfo && labInfo), title: 'Profile photo' })}>
                      <Thumbnail circle source={renderLabProfileImage(labInfo && labInfo)} style={{ height: 60, width: 60, borderRadius: 60 / 2 }} />
                    </TouchableOpacity>
                  </Col>
                  <Col style={{ width: '78%' }}>
                    <Row style={{ marginLeft: 55, marginTop: 10 }}>
                      <Col size={9}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>{(labInfo && labInfo.lab_name) + ' ' + (labInfo && labInfo.location_code)}</Text>
                        <Row>
                          <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>{labCatInfo && labCatInfo.categoryInfo && labCatInfo.categoryInfo.category_name}</Text>
                          <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>{' - '}</Text>
                          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginTop: 5 }}>{labCatInfo && labCatInfo.category_name}</Text>
                        </Row>
                      </Col>
                      <Col size={1}>
                      </Col>
                    </Row>
                  </Col>
                  <Col style={{ width: '17%' }}>
                    <RenderFavoritesComponent
                      isLoggedIn={isLoggedIn}
                      isButtonEnable={buttonEnable}
                      isFromLabBookApp={true}
                      isEnabledFavorites={patientWishListLabIds.includes(labInfo.lab_id)}
                      onPressFavoriteIcon={() => this.addToFavoritesList(labInfo.lab_id)}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col style={{ width: "22%", marginTop: 15, }}>
                    <RenderFavoritesCount
                      isFromLabBookApp={true}
                      favoritesCount={wishListCountByLabIds[labInfo.lab_id] ? wishListCountByLabIds[labInfo.lab_id] : '0'}
                    />
                  </Col>
                  <Col style={{ width: "25%", marginTop: 15, }}>
                    <RenderStarRatingCount
                      isFromLabBookApp={true}
                      totalRatingCount={reviewCountsByLabIds[labInfo.lab_id] ? reviewCountsByLabIds[labInfo.lab_id].average_rating : ' 0'}
                    />
                  </Col>
                  <Col style={{ width: "26%", marginTop: 15, marginLeft: 25 }}>
                    <RenderOfferDetails
                      offerInfo={labCatInfo && labCatInfo.offer ? labCatInfo.offer : labCatInfo.branch_details.offer ? labCatInfo.branch_details.offer : '0'}
                    />
                  </Col>
                  <Col style={{ width: "27%", marginTop: 15, marginLeft: -25 }}>
                    <RenderPriceDetails
                      priceInfo={labCatInfo && labCatInfo ? labCatInfo : ' '}
                    />
                  </Col>
                </Row>
              </Grid>
            </Card>
            <Row style={{ marginLeft: 5, marginRight: 5 }}>
              <Segment>
                <TouchableOpacity first style={[{ width: '50%', borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#000' }]} onPress={() => { this.setState({ onPressTabView: 1 }) }}>
                  <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{ width: '50%', borderBottomWidth: 4, alignContent: 'center', justifyContent: 'center', borderBottomColor: '#000' }]} onPress={() => { this.setState({ onPressTabView: 2 }) }}>
                  <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>Reviews</Text>
                </TouchableOpacity>
              </Segment>
            </Row>

            {onPressTabView == 2 ?
              <RenderReviews />
              :
              <Content>
                <View>
                  <Row style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Choose appointment date and time</Text>
                  </Row>
                  {this.availabilitySlotsDatesArry.length !== 0 ? this.renderDatesOnFlatList() : null}
                  {
                    slotDataObj4Item[selectedDate] ?
                      this.renderWorkingHours(slotDataObj4Item[selectedDate])
                      : <RenderNoSlotsAvailable
                        text={'No Slots Available'}
                      />
                  }
                  <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                    <Row style={{ marginTop: 10 }}>
                      <Text note style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                    </Row>
                    <Row style={{ marginTop: 5 }}>
                      <Col style={{ width: '40%' }}>
                        <Text style={{ marginTop: 2, marginBottom: 2, color: '#000', fontSize: 12, fontFamily: 'OpenSans' }}>{this.selectedSlotItem ? formatDate(this.selectedSlotItem.slotStartDateAndTime, 'ddd DD MMM, h:mm a') : null}</Text>
                      </Col>
                      <Col style={{ width: '35%' }}></Col>
                      <Col style={{ width: '25%' }}></Col>
                    </Row>
                  </View>
                </View>
                {this.renderLabLocAddress()}
                <RenderLabCategories> </RenderLabCategories>
              </Content>
            }
          </Content>}

        <Footer style={{ backgroundColor: '#7E49C3', }}>
          <Row>
            <Col style={{ marginRight: 40 }} >
              <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}
                onPress={() => this.onPressContinueForPaymentReview(labInfoData, this.selectedSlotItem)}
                testID='clickButtonToPaymentReviewPage'>
                <Row style={{ justifyContent: 'center', }}>
                  <Text style={{ marginLeft: -25, marginTop: 2, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center' }}>BOOK APPOINTMENT</Text>
                </Row>
              </Button>
            </Col>
          </Row>
        </Footer>
      </Container >
    )
  }
}

const LabTestBookAppointmentState = (state) => ({
  labTestData: state.labTestData
})
export default connect(LabTestBookAppointmentState)(LabBookAppointment)
