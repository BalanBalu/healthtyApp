import React, { Component } from 'react';
import { Text, Container, Icon, Item, Input, Toast, Button } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { connect } from 'react-redux'
import { MAX_DISTANCE_TO_COVER_HOSPITALS } from '../../../../setup/config';
import RenderNetworkHospitalInfo from './renderNetworkHospitals';
import { serviceOfSearchByNetworkHospitalDetails } from '../../../providers/corporate/corporate.actions';
import { Loader } from '../../../../components/ContentLoader';
import Styles from '../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NavigationEvents } from 'react-navigation';
import { primaryColor } from '../../../../setup/config'
import { HospitalDrawing } from '../../Home/corporateHome/svgDrawings';
import { debounce } from '../../../common';
import {translate} from '../../../../setup/translator.helper';

const PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST = 10;

class NetworkHospitals extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hospitalInfoList: [],
            selectedHospitalData: null,
            isLoading: true,
            isLoadingMoreHospitalList: false,
            enableSearchIcon: false,
            isLoadingOnChangeHospitalList: false,
            showFullInfoCard: -1,
            isFromMapBox: false,
            selectedLocCoOrdinates: null,
            selectedCityName: '',
            visibleClearIcon: '',
        }
        this.onChangeCallByNetworkHospList = debounce(this.onChangeCallByNetworkHospList, 300);
        this.isEnabledLoadMoreData = true;
        this.incrementPaginationCount = 0;
        this.hospitalInfoListArray = [];
        this.navigationPage = props.navigation.getParam('navigationPage') || null;
        this.selectedTpaInfoObj = props.profile && props.profile.memberTpaInfo || null;
        this.selectedTpaCode = props.profile && props.profile.memberTpaInfo && props.profile.memberTpaInfo.tpaCode || null;

    }

    async componentDidMount() {
        try {
            await this.searchByNetworkHospitalDetails();
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


    searchByNetworkHospitalDetails = async () => {
        try {
            const { isFromMapBox, selectedLocCoOrdinates } = this.state
            const { bookappointment: { locationCordinates } } = this.props;
            const coordinates = isFromMapBox ? selectedLocCoOrdinates : locationCordinates;
            const reqData4ServiceCall = {};
            // if (coordinates && coordinates.length) {
            //     reqData4ServiceCall.locationData = {
            //         coordinates,
            //         maxDistance: MAX_DISTANCE_TO_COVER_HOSPITALS
            //     }
            // }
            if (this.selectedTpaCode) reqData4ServiceCall.tpaCode = this.selectedTpaCode;
            if (this.state.visibleClearIcon) reqData4ServiceCall.enteredText = this.state.visibleClearIcon;
            const getHospitalList = await serviceOfSearchByNetworkHospitalDetails(reqData4ServiceCall, this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST);
            if (getHospitalList && getHospitalList.length) {
                this.incrementPaginationCount = this.incrementPaginationCount + PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST;
                this.hospitalInfoListArray = [...this.hospitalInfoListArray, ...getHospitalList];
                this.setState({ hospitalInfoList: this.hospitalInfoListArray })
            }
            else {
                if (this.hospitalInfoListArray.length > 8) {
                    Toast.show({
                        text: 'No more hospitals Available!',
                        duration: 3000,
                        type: "success"
                    })
                }
                this.isEnabledLoadMoreData = false;
            }
        } catch (Ex) {
            console.log('Ex is getting on Get Network Hospitals ==>', Ex.message)
            Toast.show({
                text: 'Something Went Wrong' + Ex.message,
                duration: 3000,
                type: "danger"
            })
        }
    }

    navigateToLocationMap() {
        Alert.alert(
            "Choose Location",
            "Please choose the location to find Hospitals...!",
            [
                { text: "Cancel" },
                {
                    text: "OK", onPress: () => this.props.navigation.navigate('MapBox', { isFromNetworkHospital: true }),
                }
            ],
        );
    }
    onPressGoPreAuthRequestForm = () => {
        const preAuthReqData = {
            hospitalInfo: this.state.selectedHospitalData,
            tpaInfo: this.selectedTpaInfoObj
        }
        this.props.navigation.navigate("FamilyInfoList", { preAuthReqData, navigationPage: "PreAuthSubmission" })     // shouldUpdate={``}
    }
    onPressGoPreConsultation = () => {
    }
    renderHospitalInformationCard(item, index) {
        const { showFullInfoCard } = this.state;
        return (
            <RenderNetworkHospitalInfo
                item={item}
                showFullInfoCard={showFullInfoCard}
                onPressArrowIconSelectedIndex={index}
                navigation={this.props.navigation}
                navigationPage={this.navigationPage}
                onPressUpOrDownArrowToViewFullInfo={(onPressArrowIconSelectedIndex, typeOfArrowIcon, selectedHospitalData) => this.onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, typeOfArrowIcon, selectedHospitalData)}
                onPressGoPreAuthRequestForm={() => this.onPressGoPreAuthRequestForm()}
                onPressGoPreConsultation={() => this.onPressGoPreConsultation()}
                onPressOpenGoogleMapPage={(item) => this.onPressOpenGoogleMapPage(item)}

            >
            </RenderNetworkHospitalInfo>
        )
    }
    onPressOpenGoogleMapPage = (item) => {
        try {
            const hospitalName = item.hospitalName ? item.hospitalName : 'Un known hospital';
            const destinationCoOrdinates = item.geoLocation && item.geoLocation.coordinates;
            if (!destinationCoOrdinates && !destinationCoOrdinates.length) {
                Toast.show({
                    text: 'coordinates getting Invalid! ',
                    type: 'warning',
                    duration: 3000,
                });
                return
            }
            const [lat, long] = destinationCoOrdinates;
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLong = `${lat},${long}`;
            const label = hospitalName;
            const url = Platform.select({
                ios: `${scheme}${label}@${latLong}`,
                android: `${scheme}${latLong}(${label})`
            });
            Linking.openURL(url);
        } catch (error) {
            console.log('Error is getting on View destination Map ', error.message);
        }
    }
    loadMoreData = async () => {
        try {
            this.setState({ isLoadingMoreHospitalList: true });
            await this.searchByNetworkHospitalDetails();
        } catch (error) {
            console.log("Ex is getting on load more hospitals", error.message);
        }
        finally {
            this.setState({ isLoadingMoreHospitalList: false })
        }
    }

    onChangeCallByNetworkHospList = async () => {
        try {
            this.isEnabledLoadMoreData = true;
            this.incrementPaginationCount = 0;
            this.hospitalInfoListArray = [];
            this.setState({ isLoadingOnChangeHospitalList: true, hospitalInfoList: [] });
            await this.searchByNetworkHospitalDetails()
        }
        catch (Ex) {
            console.log('Ex is getting on Get Network Hospital list by hospital names')
        }
        finally {
            this.setState({ isLoadingOnChangeHospitalList: false })
        }
    }
    onPressUpOrDownArrowToViewFullInfo(onPressArrowIconSelectedIndex, typeOfArrowIcon, selectedHospitalData) {
        if (typeOfArrowIcon === 'DOWN') {
            this.setState({ showFullInfoCard: onPressArrowIconSelectedIndex, selectedHospitalData })
        }
        else {
            this.setState({ showFullInfoCard: -1, selectedHospitalData: null })
        }
    }
    backNavigation = async (navigationData) => {
        try {
            const { navigation } = this.props;
            const isFromMapBox = navigation && navigation.getParam('isFromMapBox') || false;
            if (navigationData.action && isFromMapBox) {
                const selectedCityName = navigation.getParam('selectedCityName') || '';
                const selectedLocCoOrdinates = navigation.getParam('coordinates') || null;
                this.isEnabledLoadMoreData = true;
                this.incrementPaginationCount = 0;
                this.hospitalInfoListArray = [];
                await this.setState({ isFromMapBox, selectedLocCoOrdinates, selectedCityName, isLoadingOnChangeHospitalList: true, hospitalInfoList: [] , selectedHospitalData: null, showFullInfoCard: -1,})
                await this.searchByNetworkHospitalDetails();
            }
        }
        catch (Ex) {
            console.log('Ex is getting on Get Network Hospital list by Selected Location in Map Page')
        }
        finally {
            this.setState({ isLoadingOnChangeHospitalList: false })
        }
    }

    getSuggestionListFunction = async (enteredText) => {
        await this.setState({ visibleClearIcon: enteredText });
        this.onChangeCallByNetworkHospList(enteredText);  // Call the Network hospitals API with Debounce method
    }
    clearTotalTextFromSearchBar = async () => {
        this.setState({ visibleClearIcon: '', selectedHospitalData: null, showFullInfoCard: -1, hospitalInfoList: [] })
        await this.onChangeCallByNetworkHospList();  // Call Initial network hospitals API 

    };

    render() {
        const { visibleClearIcon, hospitalInfoList, isLoadingMoreHospitalList, enableSearchIcon, isLoading, isLoadingOnChangeHospitalList, selectedCityName, isFromMapBox } = this.state;
        const { bookappointment: { isLocationSelected, patientSearchLocationName, isSearchByCurrentLocation } } = this.props;
        const locationText = isLocationSelected ? isSearchByCurrentLocation ? 'Showing Hospitals in Near Current Location' : 'Showing Hospitals in ' + patientSearchLocationName + ' City' : 'Please Choose your Location in Map';
        if (isLoading) return <Loader style='newList' />;
        return (
            <Container>
                <View style={Styles.inputMainView}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }} />
                    <Grid>
                        <Col size={10}>
                            <Item style={Styles.inputItem}>
                                <Input
                                    placeholder="Search by name, pincode, city, state, country etc..."
                                    style={{ fontSize: 14, width: '300%' }}
                                    placeholderTextColor="#909894"
                                    keyboardType={'default'}
                                    onChangeText={enteredText => this.getSuggestionListFunction(enteredText)}
                                    returnKeyType={'done'}
                                    multiline={false}
                                    value={visibleClearIcon}
                                    underlineColorAndroid="transparent"
                                />
                                <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                    {visibleClearIcon ?
                                        <Button transparent onPress={() => this.clearTotalTextFromSearchBar()} style={{ justifyContent: 'flex-start', marginLeft: -10 }}>
                                            <Icon name="ios-close" style={{ fontSize: 25, color: 'gray' }} />
                                        </Button>
                                        :
                                        <Icon name='ios-search' style={{ color: primaryColor, fontSize: 22 }} />
                                    }
                                </TouchableOpacity>
                            </Item>
                        </Col>
                    </Grid>
                </View>
                {/* 

                <View style={{ paddingBottom: 5, height: 45, marginHorizontal: 15, }}>
                    <NavigationEvents
                        onWillFocus={payload => { this.backNavigation(payload) }} />
                    <Row style={{
                        backgroundColor: 'white',
                        borderColor: '#000',
                        borderWidth: 0.5,
                        height: 32,
                        marginTop: 5, borderRadius: 5
                    }}>
                        <Col size={8.1} style={{ justifyContent: 'center', }}>
                            <Input
                                placeholder="Search by name, pinCode, city State, Country etc..."
                                style={{
                                    color: '#7B7776',
                                    fontFamily: 'Roboto',
                                    fontSize: 12,
                                    padding: 5,
                                    paddingLeft: 10
                                }}
                                onChangeText={enteredText => enteredText || !enteredText ? !enteredText ? this.setState({ enteredText, enableSearchIcon: false }) : this.setState({ enteredText, enableSearchIcon: true }) : ths.setState({ enableSearchIcon: false })}
                                placeholderTextColor="#e2e2e2"
                                underlineColorAndroid="transparent"
                            />
                        </Col>
                        <Col size={0.9} style={enableSearchIcon ? Styles.enableSearchIcon4Hospital : Styles.disableSearchIcon4Hospital}>
                            <TouchableOpacity onPress={() => enableSearchIcon ? this.onPressSearchByNetworkHospitalName() : null}>
                                <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                </View> */}
                <View>
                    <TouchableOpacity onPress={() => this.navigateToLocationMap()}>
                        <Row style={{ padding: 5, height: 30, marginHorizontal: 15, marginVertical: 5, backgroundColor: '#EFEFF0', borderRadius: 5 }}>
                            <Col size={1} style={{ justifyContent: 'center' }}>

                                <MaterialIcons color={primaryColor} name="my-location" style={{ fontSize: 20 }}></MaterialIcons>


                            </Col>
                            <Col size={8} style={{ justifyContent: 'center' }}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    color: '#000',
                                    fontSize: 13,
                                }}>
                                    {isFromMapBox ? 'Showing Hospitals in ' + selectedCityName + ' City' : locationText}

                                </Text>
                            </Col>
                            <Col size={1} style={{ justifyContent: 'center' }}>

                                <TouchableOpacity style={{ marginLeft: 10 }}  >
                                    <MaterialIcons color={'black'} name="keyboard-arrow-right" style={{ fontSize: 20 }}></MaterialIcons>
                                </TouchableOpacity>

                            </Col>
                        </Row>
                    </TouchableOpacity>
                </View>
                {isLoadingOnChangeHospitalList ?
                    <View style={{ marginTop: 60 }}>
                        <ActivityIndicator
                            animating={isLoadingOnChangeHospitalList}
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
                        : <View style={{ borderBottomWidth: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <HospitalDrawing />
                            <Text style={{
                                fontFamily: "Roboto",
                                fontSize: 15,
                                marginTop: "10%"
                            }} >{translate('No Hospitals list found!')}</Text>
                            <View style={{ borderTopWidth: 3, width: 55, transform: [{ rotate: '120 deg' }], position: 'absolute', borderTopColor: primaryColor, top: 297 }} />

                        </View>
                }
                {isLoadingMoreHospitalList ?
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <ActivityIndicator
                            style={{ marginBottom: 17 }}
                            animating={isLoadingMoreHospitalList}
                            size="large"
                            color='blue'
                        />
                    </View>
                    : null}
            </Container>
        )
    }
}


const NetworkHospitalsDataState = ({ NetworkHospitalsData, bookappointment, profile } = state) => ({ NetworkHospitalsData, bookappointment, profile })
export default connect(NetworkHospitalsDataState)(NetworkHospitals)

