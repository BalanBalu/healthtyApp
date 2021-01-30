import React, { Component } from 'react';
import { Text, Container, Icon, Spinner, Right, Left, List, ListItem, Content, Card, Item, Input, Thumbnail, Toast } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, Image, AsyncStorage, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux'
import { MAX_DISTANCE_TO_COVER_HOSPITALS } from '../../../../setup/config';
// import RenderHospitalInfo from './RenderHospitalInfo';
import { Loader } from '../../../../components/ContentLoader';
// import styles from '../Styles';

const PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST = 7;

class NewtowrkHospitals extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hospitalName: '',
            expandData: -1,
            hospitalInfoList: [],
            isOnlyDateTimePickerVisible: false,
            appointmentDateTime: new Date(),
            isLoading: true,
            isLoadingMoreDocList: false,
            enableSearchIcon: false,
            isLoadingOnChangeDocList: false,
            renderRefreshCount: 1,
        }
        this.isEnabledLoadMoreData = true;
        this.incrementPaginationCount = 0;
        this.hospitalInfoListArray = [];

    
    }

    async componentDidMount() {
        try {
            // const userId = await AsyncStorage.getItem('userId');
            // await this.searchByHospitalDetails();
            // if (userId) {
            //     await this.getFavoriteCounts4PatByUserId(userId);
            //     this.setState({ isLoggedIn: true })
            // }
        } catch (Ex) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

 
    searchByHospitalDetails = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;
            let category_id = this.props.navigation.getParam('category_id') || null
            let reqData4ServiceCall = {
                locationData: {
                    coordinates: locationCordinates,
                    maxDistance: MAX_DISTANCE_TO_COVER_HOSPITALS
                }
            }
            if (category_id) {
                reqData4ServiceCall.category_id = category_id
            }
            if (this.state.hospitalName) reqData4ServiceCall.hospitalName = this.state.hospitalName;

            const hospitalResp = await serviceOfSearchByHospitalDetails(reqData4ServiceCall, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST);

            if (hospitalResp.success) {
 
                this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST;
                this.hospitalInfoListArray = [...this.hospitalInfoListArray, ...hospitalResp.data];
                const hospitalAdminIdsArray = hospitalResp.data.map(item => { return item.hospital_admin_id });
                await serviceOfGetHospitalFavoriteListCount4Pat(hospitalAdminIdsArray).catch(Ex => console.log('Ex is getting on get Favorites list details for Patient====>', Ex));
                this.setState({ hospitalInfoList: this.hospitalInfoListArray, category_id: category_id })
            }
            else {
                if (this.hospitalInfoListArray.length > 6) {
                    Toast.show({
                        text: 'No more hospitals Available!',
                        duration: 3000,
                        type: "success"
                    })
                }
                this.isEnabledLoadMoreData = false;
            }
        } catch (Ex) {
            Toast.show({
                text: 'Something Went Wrong' + Ex,
                duration: 3000,
                type: "danger"
            })
        }
    }


  
    onPressToContinue4PaymentReview = async (date) => {
        if (date < this.minimumDate) {
            Toast.show({
                text: 'Please select the time greater than ' + formatDate(this.minimumDate, 'Do MMM HH:mm A'),
                duration: 3000,
                type: 'warning'
            });
            return false;
        }



        const { haspitalValue, index } = this.selectedHospitalsForBooking;
        this.setState({ expandData: index })

        let userId = await AsyncStorage.getItem('userId');
        let reqData = {
            user_id: userId,
            hospital_admin_id: haspitalValue.hospital_admin_id,
            startDate: date,
            endDate: addTimeUnit(date, 30, 'minutes')
        }
        let response = await validateAppointment(reqData);

        if (response.success == false) {
            this.timeText = formatDate(response.data[0].appointment_starttime, 'hh:mm A')
            Alert.alert(
                "Appointment Warning",
                `You already booked for the same hospital on ${this.timeText}, You want to book the appointment to continue`,
                [
                    { text: "Cancel" },
                    {
                        text: "Continue", onPress: () => this.proceedToAppointment(date),
                    }
                ],
            );
            return
        } else {
            this.proceedToAppointment(date)
        }
    }
    getHospitalFee(data, category_id) {
        let fee = 200;
        
        if (data&&data.categories_data) {

            let find_categories_data = data.categories_data.find(ele => {
                return ele.category_id === category_id
            })

            if (find_categories_data) {
                fee = find_categories_data.fees;
            }
        }
        return fee
    }
    proceedToAppointment(date) {
        this.props.navigation.setParams({ 'conditionFromFilterPage': false });
        let category_id = this.props.navigation.getParam('category_id') || null

        const { haspitalValue, index } = this.selectedHospitalsForBooking;
        let fee = this.getHospitalFee(haspitalValue, category_id);
        let slotData = {
            fee: fee,
            slotStartDateAndTime: date,
            category_id: category_id,
            slotEndDateAndTime: addTimeUnit(date, 30, 'minutes'),
            booked_for: 'HOSPITAL',
            location: {
                location: haspitalValue.location,
                hospitalAdminId: haspitalValue.hospital_admin_id
            }
        }
        let data = haspitalValue
        data.slotData = slotData
        data.slotData.location.type = 'Hospital';
        this.props.navigation.navigate('Payment Review', { fromNavigation: 'HOSPITAL', resultconfirmSlotDetails: data })

    }
    navigateToLocationMap() {
        Alert.alert(
            "Choose Location",
            "Please choose the location to find Hospitals...!",
            [
                { text: "Cancel" },
                {
                    text: "OK", onPress: () => this.props.navigation.navigate('Locations'),
                }
            ],
        );
    }
    addToFavoritesList = async (hospitalAdminId) => {
        const userId = await AsyncStorage.getItem('userId');
        const updateResp = await addFavoritesToHospitalByUserService(userId, hospitalAdminId);
        if (updateResp.success) {
            Toast.show({
                text: 'Hospital wish list updated successfully',
                type: "success",
                duration: 3000,
            });
        }
        this.setState({ renderRefreshCount: this.state.renderRefreshCount + 1 });
    }

    renderHospitalInformationCard(item, index) {
        const { isLoggedIn, currentDate, category_id } = this.state;
        const { bookappointment: { locationCordinates }, hospitalBookAppointmentData: { patientFavoriteListCountOfHospitalAdminIds, hospitalFavoriteListCountOfHospitalAdminIds } } = this.props;
        return (
            <RenderHospitalInfo
                item={item}
                index={index}
                navigation={this.props.navigation}
                category_id={category_id}
                hospitalInfo={{ isLoggedIn, userLocDetails: locationCordinates, patientFavoriteListCountOfHospitalAdminIds, hospitalFavoriteListCountOfHospitalAdminIds }}
                openDateTimePicker={(item, index) => this.openDateTimePicker(item, index)}
                addToFavoritesList={(hospitalAdminId) => this.addToFavoritesList(hospitalAdminId)}

            // shouldUpdate={``}
            >
            </RenderHospitalInfo>
        )
    }
    loadMoreData = async () => {
        try {
            this.setState({ isLoadingMoreDocList: true });
            await this.searchByHospitalDetails();
        } catch (error) {
            console.log("Ex is getting on load more hospitals", error.message);
        }
        finally {
            this.setState({ isLoadingMoreDocList: false })
        }
    }

    onPressSearchByHospitalName = async () => {
        try {
            this.isEnabledLoadMoreData = true;
            this.incrementPaginationCount = 0;
            this.hospitalInfoListArray = [];
            this.setState({ isLoadingOnChangeDocList: true, hospitalInfoList: [] });
            await this.searchByHospitalDetails()
        }
        catch (Ex) {
            console.log('Ex is getting on Get Hospital list by hospital names')
        }
        finally {
            this.setState({ isLoadingOnChangeDocList: false })
        }
    }
    render() {
        const { hospitalInfoList, isLoadingMoreDocList, enableSearchIcon, isLoading, isLoadingOnChangeDocList } = this.state;
        const { bookappointment: { isLocationSelected, patientSearchLocationName, isSearchByCurrentLocation } } = this.props;
        const locationText = isLocationSelected ? isSearchByCurrentLocation ? 'Showing Hospitals in Near Current Location' : 'Showing Hospitals in ' + patientSearchLocationName + ' City' : 'Please Choose your Location in Map';
        if (isLoading) return <Loader style='list' />;
        return (
            <Container>
                <View style={{ paddingBottom: 5, paddingStart: 5, paddingEnd: 5, height: 45 }}>
                    <Row style={{
                        backgroundColor: 'white',
                        borderColor: '#000',
                        borderWidth: 0.5,
                        height: 32,
                        marginRight: 10,
                        marginLeft: 5,
                        marginTop: 5, borderRadius: 5
                    }}>
                        <Col size={8.1} style={{ justifyContent: 'center', }}>
                            <Input
                                placeholder="Search your Hospitals"
                                style={{
                                    color: 'gray',
                                    fontFamily: 'OpenSans',
                                    fontSize: 12,
                                    padding: 5,
                                    paddingLeft: 10
                                }}
                                onChangeText={hospitalName => hospitalName || !hospitalName ? !hospitalName ? this.setState({ hospitalName, enableSearchIcon: false }) : this.setState({ hospitalName, enableSearchIcon: true }) : ths.setState({ enableSearchIcon: false })}
                                placeholderTextColor="#e2e2e2"
                                underlineColorAndroid="transparent"
                            />
                        </Col>
                        <Col size={0.9} style={enableSearchIcon ? styles.enableSearchIcon4Hospital : styles.disableSearchIcon4Hospital}>
                            <TouchableOpacity onPress={() => enableSearchIcon ? this.onPressSearchByHospitalName() : null}>
                                <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </View>
                <View>
                   
                    <Row style={{ padding: 5, height: 40 }}>
                        <Col size={8}>
                            <Text style={{
                                marginLeft: 5,
                                fontFamily: 'OpenSans',
                                color: '#7F49C3',
                                fontSize: 13,
                                // marginTop: 5
                            }}>
                                {locationText}
                                {/* <Text style={{
                                            fontFamily: 'OpenSans',
                                            color: '#7F49C3',
                                            fontSize: 13,
                                        }}>{" "}location - {"Chennai"}</Text> */}
                            </Text>
                        </Col>
                        <Col size={2}>
                            <Row style={{ justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{
                                    marginRight: 12,
                                    borderColor: 'blue',
                                    borderWidth: 2,
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    padding: 5,
                                    borderRadius: 14
                                }} onPress={() => this.navigateToLocationMap()} >
                                    <Icon color={'white'} name="locate" style={{ fontSize: 20 }}></Icon>
                                </TouchableOpacity>
                            </Row>
                        </Col>
                    </Row>
                </View>
                {isLoadingOnChangeDocList ?
                    <View style={{ marginTop: 60 }}>
                        <ActivityIndicator
                            animating={isLoadingOnChangeDocList}
                            size="large"
                            color='blue'
                        />
                    </View>
                    :
                    hospitalInfoList.length ?
                        <FlatList
                            data={hospitalInfoList}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                if (this.isEnabledLoadMoreData) {
                                    this.loadMoreData();
                                }
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderHospitalInformationCard(item, index)
                            } />
                        : <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No Hospitals list found!</Text>
                        </Item>
                }
              
                {isLoadingMoreDocList ?
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <ActivityIndicator
                            style={{ marginBottom: 17 }}
                            animating={isLoadingMoreDocList}
                            size="large"
                            color='blue'
                        />
                    </View>
                    : null}
            </Container>
        )
    }
}

export default NewtowrkHospitals
