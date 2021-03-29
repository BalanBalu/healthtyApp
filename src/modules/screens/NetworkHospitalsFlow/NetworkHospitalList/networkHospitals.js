import React, { Component } from 'react';
import { Text, Container, Icon, Item, Input, Toast } from 'native-base';
import { Row, Col } from 'react-native-easy-grid';
import { View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux'
import { MAX_DISTANCE_TO_COVER_HOSPITALS } from '../../../../setup/config';
import RenderNetworkHospitalInfo from './renderNetworkHospitals';
import { serviceOfSearchByNetworkHospitalDetails } from '../../../providers/corporate/corporate.actions';
import { Loader } from '../../../../components/ContentLoader';
import Styles from '../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { NavigationEvents } from 'react-navigation';
import { primaryColor } from '../../../../setup/config'


const PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST = 10;

class NetworkHospitals extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hospitalName: '',
            hospitalInfoList: [],
            selectedHospitalData: null,
            isLoading: true,
            isLoadingMoreHospitalList: false,
            enableSearchIcon: false,
            isLoadingOnChangeHospitalList: false,
            showFullInfoCard: -1,
            isFromMapBox: false,
            selectedLocCoOrdinates: null,
            selectedCityName: ''
        }
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
            const reqData4ServiceCall={};
            if(coordinates&&coordinates.length){
            //  reqData4ServiceCall.locationData={
            //         coordinates,
            //         maxDistance: MAX_DISTANCE_TO_COVER_HOSPITALS
            //     }
            }
            if(this.selectedTpaCode) reqData4ServiceCall.tpaCode=this.selectedTpaCode;
            if(this.state.hospitalName) reqData4ServiceCall.hospitalName=this.state.hospitalName;

            const getHospitalList = await serviceOfSearchByNetworkHospitalDetails( reqData4ServiceCall,this.incrementPaginationCount, PAGINATION_COUNT_FOR_GET_HOSPITAL_LIST);
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
        // const { bookappointment: { locationCordinates }} = this.props;
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
            >
            </RenderNetworkHospitalInfo>
        )
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

    onPressSearchByNetworkHospitalName = async () => {
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
                await this.setState({ isFromMapBox, selectedLocCoOrdinates, selectedCityName, isLoadingOnChangeHospitalList: true, hospitalInfoList: [] })
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
    render() {
        const { hospitalInfoList, isLoadingMoreHospitalList, enableSearchIcon, isLoading, isLoadingOnChangeHospitalList, selectedCityName, isFromMapBox } = this.state;
        const { bookappointment: { isLocationSelected, patientSearchLocationName, isSearchByCurrentLocation } } = this.props;
        const locationText = isLocationSelected ? isSearchByCurrentLocation ? 'Showing Hospitals in Near Current Location' : 'Showing Hospitals in ' + patientSearchLocationName + ' City' : 'Please Choose your Location in Map';
        if (isLoading) return <Loader style='list' />;
        return (
            <Container>
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
                                placeholder="Search your Network Hospitals"
                                style={{
                                    color: 'gray',
                                    fontFamily: 'Roboto',
                                    fontSize: 12,
                                    padding: 5,
                                    paddingLeft: 10
                                }}
                                onChangeText={hospitalName => hospitalName || !hospitalName ? !hospitalName ? this.setState({ hospitalName, enableSearchIcon: false }) : this.setState({ hospitalName, enableSearchIcon: true }) : ths.setState({ enableSearchIcon: false })}
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
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.navigateToLocationMap()}>
                        <Row style={{ padding: 5, height: 40, marginHorizontal: 15, marginVertical: 5, backgroundColor: '#EFEFF0', borderRadius: 5 }}>
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
                        : <Item style={{ borderBottomWidth: 0, marginTop: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }} > No Hospitals list found!</Text>
                        </Item>
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

