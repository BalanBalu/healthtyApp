import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
  Toast,
  Button,
  Card,
  Item,
  List,
  ListItem,
  Left,
  Thumbnail,
  Icon,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../CommonAll/styles';
import {
  SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
  SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
  SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
  BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
  searchByDocDetailsService,
  serviceOfGetTotalReviewsCount4Doctors,
  ServiceOfGetDoctorFavoriteListCount4Pat,
  addFavoritesToDocByUserService,
  fetchDoctorAvailabilitySlotsService,
  serviceOfUpdateDocSponsorViewCountByUser,
  getFavoriteListCount4PatientService,
} from '../../providers/BookAppointmentFlow/action';
import { formatDate, addMoment, getMoment } from '../../../setup/helpers';
import { Loader } from '../../../components/ContentLoader';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { store } from '../../../setup/store';
import { primaryColor } from '../../../setup/config';
import { translate } from '../../../setup/translator.helper';

import {
  RenderListNotFound
} from '../CommonAll/components';
import {
  sortByPrimeDoctors,
} from '../CommonAll/functions';
import RenderDoctorInfo from './RenderDoctorInfo';
let currentDoctorOrder = 'ASC';
const PAGINATION_COUNT_FOR_GET_DOCTORS_LIST = 8;
class DoctorList extends Component {
  weekWiseDatesList = [];
  docInfoAndAvailableSlotsMapByDoctorIdHostpitalId = new Map();
  selectedDate4DocIdHostpitalIdToStoreInObj = {};
  selectedSlotIndex4DocIdHostpitalIdToStoreInObj = {};
  selectedSlotItem4DocIdHostpitalIdToStoreInObj = {};
  totalSearchedDoctorIdsArray = [];
  hospitalAndDoctorIdsArray = []; // for remove avoid the sponsors doctors with hospital list duplication
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: formatDate(new Date(), 'YYYY-MM-DD'),
      currentDate: formatDate(new Date(), 'YYYY-MM-DD'),
      isLoadingNextWeekAvailabilitySlots: false,
      expandItemOfDocIdHospitalsToShowSlotsData: [],
      storeFeeBySelectedSlotOfDocIdHostpitalIdInObj: {},
      isLoggedIn: false,
      renderRefreshCount: 1,
      refreshCountOnDateFL: 1, // need to check
      isLoading: true,
      isLoadingDatesAndSlots: false,
      isLoadingMoreDocList: false,
      isCorporateUser: false
    };
    (this.conditionFromFilterPage = false), (this.isEnabledLoadMoreData = true);
    this.selectedDataFromFilterPage = null;
    this.incrementPaginationCount = 0;
    this.onEndReachedIsTriggedFromRenderDateList = false;
    this.isRenderedTopRatedDocList = false;
  }
  navigateToFilters() {
    this.props.navigation.navigate('Filter Doctor Info', {
      filterData: this.selectedDataFromFilterPage,
    });
  }
  componentNavigationMount = async () => {
    try {
      const { navigation } = this.props;
      this.selectedDataFromFilterPage = navigation.getParam('filterData');
      this.conditionFromFilterPage = navigation.getParam(
        'conditionFromFilterPage',
      );
      const {
        bookAppointmentData: { getPreviousDocListWhenClearFilter },
      } = this.props;
      if (this.conditionFromFilterPage && getPreviousDocListWhenClearFilter) {
        //Call Initial search service  when clear the Filter data from filter page
        await this.callInitialSearchOrFilterServiceWithClearedData(true);
      } else if (
        this.conditionFromFilterPage &&
        this.selectedDataFromFilterPage &&
        !getPreviousDocListWhenClearFilter
      ) {
        // Call Filter service when have selected filtered data from Filter Page
        await this.callInitialSearchOrFilterServiceWithClearedData();
      }
    } catch (Ex) {
      console.log('Ex is getting on Filter by Doctor details ===>', Ex.message);
    }
  };

  async componentDidMount() {
    try {
      const isCorporateUser = await AsyncStorage.getItem('is_corporate_user') === 'true';
      this.setState({ isCorporateUser: isCorporateUser });
      // await this.dispatchAndCResetOfRattingAndFavorites(); // clear the Ratting and Favorites counts in search list Props
      const memberId = await AsyncStorage.getItem('memberId');
      /** Passing ActiveSponsor is TRUE Or FALSE values on Params **/
      // await this.callSearchAndFilterServiceWithActiveSponsorTrueAndFalse(); // multiple times services call
      await this.searchByDoctorDetails(false);

      if (memberId) {
        // await this.getFavoriteCounts4PatByUserId(memberId);
        this.setState({ isLoggedIn: true });
      }
    } catch (Ex) {
      Toast.show({
        text: 'Something Went Wrong' + Ex,
        duration: 3000,
        type: 'danger',
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }
  callInitialSearchOrFilterServiceWithClearedData = async (
    conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond,
  ) => {
    this.setState({ isLoading: true });
    if (conditionFromFilterPageIsTrueAndWithClearedFilteredDataCond) {
      this.props.navigation.setParams({ conditionFromFilterPage: false });
      this.conditionFromFilterPage = false;
    }
    this.isEnabledLoadMoreData = true;
    this.incrementPaginationCount = 0;
    this.onEndReachedIsTriggedFromRenderDateList = false;
    this.totalSearchedDoctorIdsArray = [];
    this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.clear();
    await this.dispatchAndCResetOfRattingAndFavorites(); // clear the Ratting and Favorites counts in search list Props;
    /** Passing ActiveSponsor is TRUE Or FALSE values on Params **/
    await this.callSearchAndFilterServiceWithActiveSponsorTrueAndFalse(); // multiple times services call
    this.setState({
      isLoading: false,
      renderRefreshCount: this.state.renderRefreshCount + 1,
    });
  };

  callSearchAndFilterServiceWithActiveSponsorTrueAndFalse = async () => {
    await Promise.all([
      this.searchByDoctorDetails(true).catch((Ex) =>
        console.log(
          'Ex is getting on get Doctor details by search service call using Active Sponsor TRUE====>',
          Ex.message,
        ),
      ),
      this.searchByDoctorDetails(false).catch((Ex) =>
        console.log(
          'Ex is getting on get Doctor details by search service call using Active Sponsor FALSE====>',
          Ex.message,
        ),
      ),
    ]);
  };

  dispatchAndCResetOfRattingAndFavorites = async () => {
    await store.dispatch({
      type: SET_DOC_REVIEW_COUNTS_OF_DOCTOR_IDS,
      data: {},
    });
    await store.dispatch({
      type: SET_DOC_FAVORITE_COUNTS_OF_DOCTOR_IDS,
      data: {},
    });
    await store.dispatch({
      type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
      data: [],
    });
  };
  searchByDoctorDetails = async (activeSponsor) => {
    try {
      const locationDataFromSearch = this.props.navigation.getParam(
        'locationDataFromSearch',
      );
      const inputKeywordFromSearch = this.props.navigation.getParam(
        'inputKeywordFromSearch',
      );
      const {
        bookAppointmentData: { getPreviousDocListWhenClearFilter },
      } = this.props;
      let type;
      let reqData4ServiceCall = {
        locationData: locationDataFromSearch,
      };
      if (!this.conditionFromFilterPage && inputKeywordFromSearch)
        reqData4ServiceCall.inputText = inputKeywordFromSearch;

      if (this.conditionFromFilterPage && !getPreviousDocListWhenClearFilter) {
        type = 'filter';
        reqData4ServiceCall = {
          ...reqData4ServiceCall,
          ...this.selectedDataFromFilterPage,
        };
      } else if (!inputKeywordFromSearch) {
        type = 'location';
      } else {
        type = 'search';
      }
      console.log('reqData4ServiceCall',JSON.stringify(reqData4ServiceCall))
      const docListResponse = await searchByDocDetailsService(
        type,
        reqData4ServiceCall,
        this.incrementPaginationCount,
        PAGINATION_COUNT_FOR_GET_DOCTORS_LIST,
      );

      if (docListResponse.success) {
        // if (!activeSponsor) {
        this.incrementPaginationCount =
          this.incrementPaginationCount +
          PAGINATION_COUNT_FOR_GET_DOCTORS_LIST;
        // }
        const searchedDoctorIdsArray = [];
        const docListData = docListResponse.data || [];
        docListData.map((item) => {
          item.specialist = item.specialistInfo;
          delete item.specialistInfo;
          const doctorIdHostpitalId = item.hospitalInfo.doctorIdHospitalId;
          item.doctorIdHostpitalId = doctorIdHostpitalId;
          if (!this.totalSearchedDoctorIdsArray.includes(item.doctorId)) {
            searchedDoctorIdsArray.push(item.doctorId);
            this.totalSearchedDoctorIdsArray.push(item.doctorId);
          }
          // if (activeSponsor && item.is_doctor_sponsor) {
          //   this.hospitalAndDoctorIdsArray.push(String(doctorIdHostpitalId));
          //   if (!activeSponsorDocIdsArry.includes(item.doctor_id)) {
          //     activeSponsorDocIdsArry.push(item.doctor_id);
          //   }
          // }
          if (
            !activeSponsor &&
            this.hospitalAndDoctorIdsArray &&
            this.hospitalAndDoctorIdsArray.includes(String(doctorIdHostpitalId))
          ) {
          } else {
            this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.set(
              doctorIdHostpitalId,
              item,
            );
          }
        });
        // await Promise.all([
        //   ServiceOfGetDoctorFavoriteListCount4Pat(
        //     searchedDoctorIdsArray,
        //   ).catch((Ex) =>
        //     console.log(
        //       'Ex is getting on get Favorites list details for Patient====>',
        //       Ex,
        //     ),
        //   ),
        //   serviceOfGetTotalReviewsCount4Doctors(
        //     searchedDoctorIdsArray,
        //   ).catch((Ex) =>
        //     console.log(
        //       'Ex is getting on get Total Reviews  list details for Patient' +
        //         Ex,
        //     ),
        //   ),
        // ]);
        // if (activeSponsor) {
        //   this.updateDocSponsorViewersCountByUser(activeSponsorDocIdsArry);
        // }
        let doctorInfoList =
          Array.from(
            this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values(),
          ) || [];
        // doctorInfoList.sort(sortByPrimeDoctors); // Sort by active Sponsors list in TOP
        if (!activeSponsor && docListData.length <= 3) {
          this.isEnabledLoadMoreData = false;
        }
        store.dispatch({
          type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
          data: doctorInfoList,
        });
        if (!this.conditionFromFilterPage) {
          store.dispatch({
            type: BA_CUP_DOCTOR_INFO_LIST_AND_SLOTS_DATA_4_FILTER,
            data: doctorInfoList,
          });
        }
      } else {
        this.isEnabledLoadMoreData = false;
        if (this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.size > 7) {
          Toast.show({
            text: translate('No more Doctors Available!'),
            duration: 4000,
            type: 'success',
          });
        }
      }
    } catch (Ex) {
      Toast.show({
        text: translate('Something Went Wrong') + Ex,
        duration: 3000,
        type: 'danger',
      });
    }
  };

  getFavoriteCounts4PatByUserId = async (memberId) => {
    try {
      await getFavoriteListCount4PatientService(memberId);
    } catch (Ex) {
      return {
        success: false,
        statusCode: 500,
        error: Ex,
        message: `Exception while getting on Favorites for Patient : ${Ex}`,
      };
    }
  };
  setDocListByPreviousOrder() {
    let docList =
      Array.from(
        this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.values(),
      ) || [];
    docList.sort(sortByPrimeDoctors); // Sort by active Sponsors list in TOP
    return docList || [];
  }
  render() {
    const {
      bookAppointmentData: { doctorInfoListAndSlotsData },
    } = this.props;
    const { isLoading, isLoadingMoreDocList } = this.state;
    if (isLoading) return <Loader style="list" />;
    return (
      <Container style={styles.container}>
        {/* <NavigationEvents
          onWillFocus={(payload) => {
            this.componentNavigationMount();
          }}
        /> */}
        <Card style={{ borderRadius: 7, paddingTop: 5, paddingBottom: 5 }}>
          <Row style={{ height: 35, alignItems: 'center' }}>
            <Col
              size={5}
              style={{
                flexDirection: 'row',
                marginLeft: 5,
                justifyContent: 'center',
              }}
              onPress={() => this.sortByTopRatings(doctorInfoListAndSlotsData)}>
              <Col size={2.0}>
                <MaterialIcons
                  name={
                    this.isRenderedTopRatedDocList
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-down'
                  }
                  style={{ color: 'gray', fontSize: 24 }}
                />
              </Col>
              <Col size={8.0} style={{ justifyContent: 'center' }}>
                <Text
                  uppercase={false}
                  style={{
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontSize: 13,
                    textAlign: 'center',
                  }}>
                  {translate('Top Rated')}{' '}
                </Text>
              </Col>
            </Col>
            <Col
              size={5}
              style={{
                flexDirection: 'row',
                borderLeftColor: '#909090',
                borderLeftWidth: 1,
                justifyContent: 'center',
              }}
              onPress={() => this.navigateToFilters()}>
              <Col size={8.0} style={{ justifyContent: 'center' }}>
                <Text
                  uppercase={false}
                  style={{
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontSize: 13,
                    marginLeft: 10,
                    width: '100%',
                    textAlign: 'center',
                  }}>
                  {translate('Filters')}{' '}
                </Text>
              </Col>
              <Col size={2.0} style={{ marginLeft: 5 }}>
                <Icon name="ios-funnel" style={{ color: 'gray', fontSize: 20 }} />
              </Col>
            </Col>
          </Row>
        </Card>
        {doctorInfoListAndSlotsData && doctorInfoListAndSlotsData.length ? (
          <FlatList
            scrollEventThrottle={26}
            data={doctorInfoListAndSlotsData}
            onEndReachedThreshold={
              doctorInfoListAndSlotsData.length <= 3 ? 2 : 0.5
            }
            onEndReached={() => {
              if (this.isEnabledLoadMoreData) {
                this.loadMoreData();
              }
            }}
            renderItem={({ item, index }) => this.renderDoctorCard(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <RenderListNotFound
            text={
              this.conditionFromFilterPage
                ? translate('Doctors Not found!..Choose Filter again')
                : translate('No Doctor list found!')
            }
          />
        )}
        {isLoadingMoreDocList ? (
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <ActivityIndicator
              style={{ marginBottom: 17 }}
              animating={isLoadingMoreDocList}
              size="large"
              color="blue"
            />
          </View>
        ) : null}
      </Container>
    );
  }

  loadMoreData = async () => {
    try {
      this.setState({ isLoadingMoreDocList: true });
      await this.searchByDoctorDetails(false);
    } catch (error) {
      console.log('Ex is getting on load more doctor ist data', error.message);
    } finally {
      this.setState({ isLoadingMoreDocList: false });
    }
  };


  /* Update Favorites for Doctor by memberId  */
  addToFavoritesList = async (doctorId) => {
    const memberId = await AsyncStorage.getItem('memberId');
    const updateResp = await addFavoritesToDocByUserService(memberId, doctorId);
    if (updateResp)
      Toast.show({
        text: translate('Doctor wish list updated successfully'),
        type: 'success',
        duration: 3000,
      });
    this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
  };

  /*   navigate to next further process    */

  onPressGoToBookAppointmentPage(doctorItemData) {
    this.props.navigation.setParams({ conditionFromFilterPage: false });
    doctorItemData.doctorId = doctorItemData.doctorId;
    const singleDoctorItemData = { ...doctorItemData };
    const reqData4BookAppPage = {
      singleDoctorItemData: singleDoctorItemData,
      doctorId: doctorItemData.doctorId,
      // weekWiseDatesList : this.weekWiseDatesList
    };
    // const doctorItemHaveSlotsDataObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(
    //   doctorItemData.doctorIdHostpitalId,
    // ).slotData;
    // if (doctorItemHaveSlotsDataObj) {
    //   reqData4BookAppPage.singleDoctorAvailabilityData = doctorItemHaveSlotsDataObj;
    //   reqData4BookAppPage.weekWiseDatesList = this.weekWiseDatesList;
    // }
    // this.props.navigation.navigate(
    //   'Doctor Details Preview',
    //   reqData4BookAppPage,
    // );
    this.props.navigation.navigate(
      'DoctorConsultation',
      reqData4BookAppPage,
    );

  }


  getNextAvailableDateAndTime = (selectedSlotData, item) => {
    if (selectedSlotData) {
      const startTime = moment(selectedSlotData[0].slotStartDateAndTime).format(
        'h:mm a',
      );
      const endTime = moment(
        selectedSlotData[selectedSlotData.length - 1].slotEndDateAndTime,
      ).format('h:mm a');
      return translate('Available') + startTime + ' - ' + endTime;
    } else {
      if (item.nextAvailableDateAndTime) {
        const availableOn = moment(item.nextAvailableDateAndTime).format(
          'ddd, DD MMM YY',
        );
        return translate('Available On') + availableOn;
      } else {
        return translate('Not Available');
      }
    }
  };

  sortByTopRatings(doctorDataList) {
    // const {
    //   bookAppointmentData: {docReviewListCountOfDoctorIDs},
    // } = this.props;
    // if (!this.isRenderedTopRatedDocList) {
    //   this.isRenderedTopRatedDocList = true;
    //   const doctorDataListBySort = doctorDataList.sort(function (a, b) {
    //     let ratingA = 0;
    //     let ratingB = 0;
    //     if (docReviewListCountOfDoctorIDs[a.doctorId]) {
    //       ratingA =
    //         docReviewListCountOfDoctorIDs[a.doctorId].average_rating || 0;
    //     }
    //     if (docReviewListCountOfDoctorIDs[b.doctorId]) {
    //       ratingB =
    //         docReviewListCountOfDoctorIDs[b.doctorId].average_rating || 0;
    //     }
    //     if (a.is_doctor_sponsor || b.is_doctor_sponsor) {
    //       return ratingB - ratingA;
    //     }
    //     if (currentDoctorOrder === 'ASC') {
    //       return ratingB - ratingA;
    //     }
    //   });
    //   store.dispatch({
    //     type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    //     data: doctorDataListBySort,
    //   });
    // } else {
    //   this.isRenderedTopRatedDocList = false;
    //   store.dispatch({
    //     type: SET_DOCTOR_INFO_LIST_AND_SLOTS_DATA,
    //     data: this.setDocListByPreviousOrder(),
    //   });
    // }
  }

  renderDoctorInformationCard(item) {
    const { isLoggedIn, currentDate } = this.state;
    const {
      bookAppointmentData: {
        patientFavoriteListCountOfDoctorIds,
        docFavoriteListCountOfDoctorIDs,
        docReviewListCountOfDoctorIDs,
      },
    } = this.props;
    // const {fee, feeWithoutOffer} = this.getFeesBySelectedSlot(
    //   item.slotData &&
    //     item.slotData[
    //       this.selectedDate4DocIdHostpitalIdToStoreInObj[
    //         item.doctorIdHostpitalId
    //       ] || currentDate
    //     ],
    //   item.slotData,
    //   item.doctorIdHostpitalId,
    //   item,
    // );
    const fee = null;
    const feeWithoutOffer = null;
    return (
      <View>
        <RenderDoctorInfo
          item={item}
          navigation={this.props.navigation}
          docInfoData={{
            isLoggedIn,
            fee,
            feeWithoutOffer,
            patientFavoriteListCountOfDoctorIds,
            docFavoriteListCountOfDoctorIDs,
            docReviewListCountOfDoctorIDs,
          }}
          addToFavoritesList={(doctorId) => {
            this.addToFavoritesList(doctorId);
          }}
          onPressGoToBookAppointmentPage={(item) => {
            this.onPressGoToBookAppointmentPage(item);
          }}
          shouldUpdate={
            `${item.doctorIdHostpitalId
            }-${fee}-${feeWithoutOffer}-${patientFavoriteListCountOfDoctorIds.includes(
              item.doctorId,
            )}`
          }
        />
      </View>
    );
  }


  onPressBookBtn = async (doctorItemData) => {  // need to implement  SHOBANA work on this method
    try {
      this.props.navigation.setParams({ conditionFromFilterPage: false });
      doctorItemData.doctorId = doctorItemData.doctorId;
      const singleDoctorItemData = { ...doctorItemData };
      const reqData4BookAppPage = {
        singleDoctorItemData: singleDoctorItemData,
        doctorId: doctorItemData.doctorId,
        // weekWiseDatesList : this.weekWiseDatesList
      };
      // const doctorItemHaveSlotsDataObj = this.docInfoAndAvailableSlotsMapByDoctorIdHostpitalId.get(
      //   doctorItemData.doctorIdHostpitalId,
      // ).slotData;
      // if (doctorItemHaveSlotsDataObj) {
      //   reqData4BookAppPage.singleDoctorAvailabilityData = doctorItemHaveSlotsDataObj;
      //   reqData4BookAppPage.weekWiseDatesList = this.weekWiseDatesList;
      // }
      this.props.navigation.navigate(
        'DoctorConsultation',
        reqData4BookAppPage,
      );
    } catch (Ex) {
      console.log(
        'Ex is getting on when Pressed BOOK button in Doctor list :',
        Ex,
      );
    }
  };

  renderDoctorCard(item, indexOfItem) {
    const {
      currentDate,
      isLoadingDatesAndSlots,
    } = this.state;
    return (
      <Card style={{ padding: 2, borderRadius: 10 }}>
        <List style={{ borderBottomWidth: 0 }}>
          <ListItem style={{ borderBottomWidth: 0 }}>
            <Grid>
              {this.renderDoctorInformationCard(item)}
              <Row
                style={{
                  borderTopColor: '#000',
                  borderTopWidth: 0.4,
                  marginTop: 5,
                }}>
                <Col size={0.8}>
                  <Icon name="ios-time" style={{ fontSize: 20, marginTop: 12 }} />
                </Col>
                <Col size={7.5}>
                  <Text
                    note
                    style={{
                      fontFamily: 'opensans-bold',
                      marginTop: 15,
                      fontSize: 12,
                      marginRight: 50,
                    }}>
                    {'Next available on ... '}
                    {/* {this.getNextAvailableDateAndTime(
                      item.slotData &&
                        item.slotData[
                          this.selectedDate4DocIdHostpitalIdToStoreInObj[
                            item.doctorIdHostpitalId
                          ] || currentDate
                        ],
                      item,
                    )} */}
                  </Text>
                </Col>
                <Col size={1.7}>
                  <TouchableOpacity
                    onPress={() =>
                      this.onPressBookBtn(item)
                    }
                    style={{
                      textAlign: 'center',
                      backgroundColor: 'green',
                      borderColor: '#000',
                      marginTop: 10,
                      borderRadius: 18,
                      height: 30,
                      justifyContent: 'center',
                      paddingLeft: 1,
                      paddingRight: 1,
                      marginLeft: -6,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'opensans-bold',
                      }}>
                      {translate('BOOK')}{' '}
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          </ListItem>
        </List>
      </Card>
    );
  }
}

const bookAppointmentDataState = ({ bookAppointmentData } = state) => ({
  bookAppointmentData,
});
export default connect(bookAppointmentDataState)(DoctorList);
