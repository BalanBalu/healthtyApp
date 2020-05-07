import React, { Component } from 'react';
import { Container, Content, Text, Segment, Button, Card, Right, Thumbnail, Icon, Toast, Item, Footer, Spinner, List, ListItem, Left, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity, View, FlatList, AsyncStorage, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import RenderReviews from './RenderReviews'
import RenderDescription from './RenderDescription';
import { formatDate, addMoment, getMoment, getUnixTimeStamp } from '../../../../setup/helpers';
import RenderDates from '../labSearchList/RenderDateList';
import { enumerateStartToEndDates } from '../CommonLabTest'
import { } from '../../../providers/labTest/labTestBookAppointment.action';
import { fetchLabTestAvailabilitySlotsService } from '../../../providers/labTest/basicLabTest.action';

class LabBookAppointment extends Component {
  availabilitySlotsDatesArry = [];
  labDescriptionData = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccccccccccccccccccccccccccccccccccddddddddddddddddddddddddddddddd';

  slotData4ItemMap = new Map();
  constructor(props) {
    super(props)

    this.state = {
      currentDate: formatDate(new Date(), 'YYYY-MM-DD'),

      selectedSlotItem: null,
      isLoading: true,
      pressTab: 1,
      selectedSlotIndex: -1,
      sliderPageIndex: 0,
      doctorData: {
        prefix: null,
        slotData: {}
      },
      doctorDetails: null,
      showedFee: undefined,
      labId: null,
      slotDatesToShow: [],
      isAvailabilityLoading: false,
      isLoggedIn: false,
      servicesByCategories: [],
      hidden: false,
      categoryShownObj: {},
      isLoadedUserReview: false,
      reviewData: [],
      reviewRefreshCount: 0,
      userId: null,
      isReviewLoading: false,
      showMoreOption: false,
      doctorIdWithHosId: [],
      renderRefreshCount: 0,
    }

  }

  async componentDidMount() {
    const { navigation } = this.props;

    const fromMyAppointment = navigation.getParam('fromMyAppointment') || false;
    // this.setState({ isLoading: true });
    const startDateByMoment = addMoment(this.state.currentDate)
    const endDateByMoment = addMoment(this.state.currentDate, 7, 'days');
    let userId = await AsyncStorage.getItem('userId');
    if (userId) {
      this.setState({ isLoggedIn: true, userId });
    }
    if (fromMyAppointment) {
      // ...
      //...
    } else {

      this.availabilitySlotsDatesArry = navigation.getParam('availabilitySlotsDatesArry');
      const { labTestData: { singleLabItemData } } = this.props;
      console.log('from Book appomt singleLabItemData====>', singleLabItemData);
      console.log(' singleLabItemData.slotData====>', singleLabItemData.slotData);

      if (Object.keys(singleLabItemData.slotData).length === 0) {
        this.getLabTestAvailabilitySlots(singleLabItemData.labId, startDateByMoment, endDateByMoment);
      }
      else {
        this.slotData4ItemMap.set(String(singleLabItemData.labId), singleLabItemData.slotData)

      }

      // this.processedDoctorDetailsAndSlotData = singleLabItemData;

      this.getLabItemLocData(singleLabItemData)

      await this.setState({ labId: singleLabItemData.labId, labItemData: singleLabItemData });
    }
    // this.setState({ isLoading: false });
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
      console.log('resultSlotsData======>', resultSlotsData);
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
  }

  getLabItemLocData(labItemData) {
    if (labItemData) {
      this.showLabItemLoc = labItemData.labInfo.location
    }
    return this.showLabItemLoc;
  }

  onSegemntClick(index) {
    this.setState({ pressTab: index })
  }

  callSlotsServiceWhenOnEndReached = (labId, availabilitySlotsDatesArry) => { // call availability slots service when change dates on next week
    // const finalIndex = availabilitySlotsDatesArry.length
    // const lastProcessedDate = availabilitySlotsDatesArry[finalIndex - 1];
    // const startDateByMoment = getMoment(lastProcessedDate).add(1, 'day');
    // const endDateByMoment = addMoment(lastProcessedDate, 7, 'days');
    // if (!this.availabilitySlotsDatesArry.includes(endDateByMoment.format('YYYY-MM-DD'))) {
    //   this.getLabTestAvailabilitySlots(labId, startDateByMoment, endDateByMoment);
    // }
  }
  renderDatesOnFlatList() {
    const { currentDate, labId } = this.state
    // const selectedDate = this.state.currentDate;
    const slotDataObj4Item = this.slotData4ItemMap.get(String(labId)) || {}

    const selectedDateObj = {}

    if (Object.keys(slotDataObj4Item).length === 0) {
      return null;
    }
    return (
      <View>
        <RenderDates availabilitySlotsDatesArry={this.availabilitySlotsDatesArry}
          onDateChanged={(item, labId) => this.onDateChanged(item, labId)}
          selectedDate={currentDate}
          selectedDateObj={this.selectedDateObj}
          availableSlotsData={slotDataObj4Item}
          labId={labId}
          callSlotsServiceWhenOnEndReached={(labId, availabilitySlotsDatesArry) => {
            this.callSlotsServiceWhenOnEndReached(labId, availabilitySlotsDatesArry)
          }}
          shouldUpdate={`${labId}-${currentDate}`}
        >
        </RenderDates>
      </View>
    )
  }



  render() {
    const { showMoreOption } = this.state;

    const data = [{ checkup: 'full body checkup', initalprice: 2500, finalprice: 1500 },
    { checkup: 'Diabetes Test', initalprice: 2500, finalprice: 1500 },
    { checkup: 'Fever Test', initalprice: 1500, finalprice: 1000 },
    { checkup: 'Arthristis', initalprice: 500, finalprice: 400 },
    { checkup: 'Allergy profile', initalprice: 200, finalprice: 100 },
    { checkup: 'Healthy men', initalprice: 250, finalprice: 150 }]
    return (
      <Container style={styles.container}>
        <Content style={styles.bodyContent} contentContainerStyle={{ flex: 0, padding: 10 }}>
          <Card style={{ borderBottomWidth: 2 }}>
            <Grid >
              <Row >
                <Col style={{ width: '5%', marginLeft: 20, marginTop: 10 }}>
                  <Thumbnail circular source={require('../../../../../assets/images/profile_male.png')} style={{ height: 60, width: 60 }} />
                </Col>
                <Col style={{ width: '78%' }}>
                  <Row style={{ marginLeft: 55, marginTop: 10 }}>
                    <Col size={9}>
                      <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold' }}>Quest Diagnostics India Pvt Ltd</Text>
                      <Text note style={{ fontFamily: 'OpenSans', fontSize: 11, marginTop: 5 }}>Full body check up test</Text>
                    </Col>
                    <Col size={1}>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ width: '17%' }}>
                  <TouchableOpacity>
                    <Icon name="heart"
                      style={{ color: '#000000', fontSize: 20, marginTop: 10 }}>
                    </Icon>
                  </TouchableOpacity>
                </Col>
              </Row>

              <Row style={{ marginBottom: 10 }}>
                <Col style={{ width: "25%", marginTop: 15, }}>
                  <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Favourites</Text>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>2</Text>
                </Col>
                <Col style={{ width: "25%", marginTop: 15, }}>
                  <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Rating</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <StarRating
                      fullStarColor='#FF9500'
                      starSize={12} width={85}
                      containerStyle={{ marginTop: 2 }}
                      disabled={true}
                      rating={1}
                      maxStars={1} />
                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>0</Text>
                  </View>
                </Col>
                <Col style={{ width: "25%", marginTop: 15, }}>

                  <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Offer</Text>
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: 'green' }}>40%</Text>
                </Col>
                <Col style={{ width: "25%", marginTop: 15, }}>
                  <Text note style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'center' }}> Package Amt</Text>
                  <Row style={{ justifyContent: 'center' }}>
                    <Text style={styles.rsText}>₹ 1500</Text>
                    <Text style={styles.finalRs}>₹ 1000</Text>
                  </Row>

                </Col>
              </Row>


            </Grid>
          </Card>
          <Row style={{ marginLeft: 5, marginRight: 5 }}>
            <Segment>
              <TouchableOpacity first style={[{ width: '50%', borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', borderBottomColor: '#000' }]} onPress={() => { this.onSegemntClick(1) }}>
                <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[{ width: '50%', borderBottomWidth: 4, alignContent: 'center', justifyContent: 'center', borderBottomColor: '#000' }]} onPress={() => { this.onSegemntClick(2) }}>
                <Text style={{ color: '#000', fontSize: 12, fontFamily: 'OpenSans', textAlign: 'center' }}>Reviews</Text>
              </TouchableOpacity>
            </Segment>
          </Row>



          {this.state.pressTab == 2 ?
            <RenderReviews />
            :
            <Content>
              <RenderDescription
                labDescriptionData={this.labDescriptionData}
                showMoreOption={showMoreOption}
                onPressShowAndHide={(condition) => this.setState({ showMoreOption: condition })}
              />
              <View>

                <Row style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontFamily: 'OpenSans' }}>Select appoinment date and time</Text>
                </Row>


                {this.availabilitySlotsDatesArry.length !== 0 ? this.renderDatesOnFlatList() : null}
                {/* {
                    doctorData.slotData[selectedDate] !== undefined ?
                      this.haveAvailableSlots(doctorData.slotData[selectedDate])
                      : this.noAvailableSlots()
                  } */}

                {/* <Row>
                  <FlatList
                    data={slotdata}
                    horizontal={true}
                    renderItem={({ item }) =>

                      <Col style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={[styles.availabilityBG, { backgroundColor: '#775DA3', alignItems: 'center' }]}>
                          <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'OpenSans', color: '#fff' }}>{item.date}</Text>
                          <Text style={{ textAlign: 'center', fontSize: 10, fontFamily: 'OpenSans', lineHeight: 11, color: '#fff' }}>{item.slot}</Text>
                        </TouchableOpacity>
                      </Col>
                    } />
                </Row>
                <FlatList
                  data={slot}
                  numColumns={4}
                  renderItem={({ item }) =>
                    <Col style={{ width: '25%' }}>
                      <TouchableOpacity
                        style={styles.slotBookedBgColor}>
                        <Text style={styles.slotBookedTextColor}>{item.slots}</Text>
                      </TouchableOpacity>
                    </Col>
                  } /> */}
                <View style={{ borderTopColor: '#000', borderTopWidth: 0.5, marginTop: 10 }}>
                  <Row style={{ marginTop: 10 }}>
                    <Text note style={{ fontSize: 12, fontFamily: 'OpenSans' }}>Selected Appointment on</Text>
                  </Row>
                  <Row style={{ marginTop: 5 }}>
                    <Col style={{ width: '40%' }}>
                      <Text style={{ marginTop: 2, marginBottom: 2, color: '#000', fontSize: 12, fontFamily: 'OpenSans' }}> 12,03 2020 10.20 am</Text>
                    </Col>
                    <Col style={{ width: '35%' }}></Col>
                    <Col style={{ width: '25%' }}></Col>
                  </Row>
                </View>
              </View>

              <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.7, marginBottom: 5 }}>
                <Row style={{ marginTop: 10 }}>
                  <Icon name='ios-home' style={{ fontSize: 20, color: 'gray' }} />
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Laboratory</Text>
                </Row>
              </View>

              <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 1, }}>
                <Row style={{ marginTop: 10 }}>
                  <Icon name='ios-medkit' style={{ fontSize: 20, color: 'gray' }} />
                  <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>Other Packages</Text>
                </Row>



                <View style={{ marginBottom: 10, marginTop: 10 }}>
                  <FlatList
                    horizontal={true}
                    data={data}
                    renderItem={({ item, index }) =>
                      <Col style={styles.mainCol}>
                        <View style={{ height: 110, width: 100 }}>
                          <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                            <Image
                              source={require('../../../../../assets/images/labCategories/Diabetes.png')}
                              style={{
                                width: 60, height: 60, alignItems: 'center'
                              }}
                            />
                            <Text style={styles.mainText}>{item.checkup}</Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Text style={styles.rsText}>₹ {item.initalprice}</Text>
                              <Text style={styles.finalRs}>₹ {item.finalprice}</Text>
                            </View>


                          </TouchableOpacity>
                        </View>
                      </Col>
                    }
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>



            </Content>
          }

          {/* {this.state.pressTab === 2 ?
              <Content style={styles.bodyContent}>
                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No reviews yet</Text>
                    </Item> 

              </Content> : null} */}


        </Content>

        <Footer style={{ backgroundColor: '#7E49C3', }}>
          <Row>
            <Col style={{ marginRight: 40 }} >
              <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}
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
}


// export default labBookAppointment
const LabTestBookAppointmentState = (state) => ({
  labTestData: state.labTestData
})
export default connect(LabTestBookAppointmentState)(LabBookAppointment)



const styles = StyleSheet.create({

  container:
  {
    backgroundColor: '#ffffff',
  },

  bodyContent: {
    // paddingLeft: 20,
    // paddingRight: 20,

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

  logo: {
    height: 80,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10
  },

  customCard: {
    borderRadius: 20,
    padding: 15,
    marginTop: -180,
    marginLeft: 20,
    marginRight: 20,

  },
  topValue: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  bottomValue:
  {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  multipleStyles:
  {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: 'white'
  },
  slotDefaultBg: {
    backgroundColor: 'pink',
    borderRadius: 5,
    width: '30%',
    height: 30,
    margin: 5
  },
  slotBookedBg: {
    backgroundColor: 'gray',
    borderRadius: 5,
    width: '30%',
    height: 30,
    margin: 5
  },
  slotSelectedBg: {
    backgroundColor: '#2652AC',
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
  customText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,
    marginTop: 5
  },
  commentText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 12,
    marginTop: 5
  },
  reviewText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: -20
  },
  subtitlesText: {
    fontSize: 15,
    margin: 10,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  titlesText: {
    fontSize: 15,
    color: '#F2889B',
    fontFamily: 'opensans-semibold',

  },
  profileImage:
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    height: 80,
    width: 80,
    borderColor: '#f5f5f5',
    borderWidth: 2,
    borderRadius: 50
  },
  customIcon:
  {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    color: 'white',
    borderRadius: 8,
    fontSize: 19,
    paddingLeft: 8,
    paddingRight: 6,
    paddingTop: 6,
    paddingBottom: 6

  },
  rowText:
  {
    fontFamily: 'OpenSans',
    color: '#000',
    fontSize: 14,
    margin: 5
  },
  slotBookedBgColor: {
    backgroundColor: '#A9A9A9', //'#775DA3',
    borderColor: '#000',
    marginTop: 10, height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 5,

  },
  slotSelectedBgColor: {

    backgroundColor: '#775DA3',
    borderColor: '#000',
    marginTop: 10, height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 5,

  },
  slotBookedTextColor: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    fontFamily: 'OpenSans'
  },
  slotDefaultBgColor: {
    backgroundColor: '#ced6e0',
    borderColor: '#000',
    marginTop: 10,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 5,
  },
  slotDefaultTextColor: {
    textAlign: 'center',
    color: '#000',
    fontSize: 12,
    fontFamily: 'OpenSans'
  },
  rsText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '200',
    color: '#ff4e42',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ff4e42',
    marginTop: 2
  },
  finalRs: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
    marginLeft: 5,
    color: '#8dc63f'
  },
  textcenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'OpenSans'
  },

  column:
  {
    width: '15%',
    borderRadius: 10,
    margin: 10,
    padding: 6
  },


  customImage: {
    height: 100,
    width: 100,
    margin: 10,
    alignItems: 'center'
  },

  titleText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'OpenSans',

  },
  SearchRow: {
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    height: 35,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5, borderRadius: 5
  },
  SearchStyle: {

    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputfield: {
    color: 'gray',
    fontFamily: 'OpenSans',
    fontSize: 12,
    padding: 5,
    paddingLeft: 10
  },
  mainCol: {
    justifyContent: "center",
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    marginLeft: 10,
    marginBottom: 1, backgroundColor: '#fafafa',
  },
  mainText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    color: '#7F49C3'
  },
  subText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
  },
  rsText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
    color: '#ff4e42',
    marginTop: 2,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ff4e42'
  },
  finalRs: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '200',
    paddingTop: 1,
    marginLeft: 5,
    color: '#8dc63f'
  }

});