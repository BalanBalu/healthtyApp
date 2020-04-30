
import React, { Component } from 'react';
import { View, StyleSheet, Image, PermissionsAndroid, AsyncStorage, TouchableOpacity } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { IS_ANDROID, validatePincode, validateName, validatePassword, validateFirstNameLastName, acceptNumbersOnly } from '../../../common';
import { Container, Toast, Body, Button, Text, Item, Input, Icon, Card, CardItem, Label, Form, Content, Picker } from 'native-base';
import { MAP_BOX_TOKEN } from '../../../../setup/config';
import axios from 'axios';
import { userFiledsUpdate, logout, getPostOffNameAndDetails } from '../../../providers/auth/auth.actions';
import Geolocation from 'react-native-geolocation-service';
MapboxGL.setAccessToken(MAP_BOX_TOKEN);
import Qs from 'qs';
import Spinner from '../../../../components/Spinner';
import locationIcon from '../../../../../assets/marker.png'
import { NavigationEvents } from 'react-navigation';

export default class MapBox extends React.Component {
    _requests = [];
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            fromProfile: false,
            loading: false,
            coordinates: null,
            center: [],
            zoom: 12,
            isFinisedLoading: false,
            locationFullText: null,
            showAllAddressFields: false,
            full_name: '',
            mobile_no: null,
            addressType: null,
            postOfficeData: [],
            editable: true,
            address: {
                no_and_street: null,
                address_line_1: null,
                city: null,
                district: null,
                state: null,
                country: null,
                pin_code: null,
                post_office_name: null
            }
        }
        this.onPress = this.onPress.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.onRegionIsChanging = this.onRegionIsChanging.bind(this);
        this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);
    }
    async componentDidMount() {
        try {
            if (IS_ANDROID) {
                const granted = PermissionsAndroid.requestMultiple(
                    [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION],
                    {
                        title: 'Give Location Permission',
                        message: 'App needs location permission to find your position.'
                    }
                ).then(granted => {
                    console.log(granted);
                }).catch(err => {
                    console.warn(err);
                });
                console.log("granted");
                console.log(await granted);
            }
            this._isMounted = true;
            const { navigation } = this.props;
            const fromProfile = navigation.getParam('fromProfile') || false
            showAllAddressFields = navigation.getParam('mapEdit') || false
            navigationOption = navigation.getParam('navigationOption') || null
            let locationData = this.props.navigation.getParam('locationData');
            console.log("locationData" + JSON.stringify(locationData))
            if (fromProfile) {
                await this.setState({ fromProfile: true })
                if (locationData) {
                    this.formUserAddress(locationData)
                    await this.setState({ coordinates: locationData.center, fromProfile, showAllAddressFields })
                }
                else {
                    this.getCurrentLocation();
                }
            } else if (navigationOption) {
                addressType = navigation.getParam('addressType') || null
                console.log("addressType", addressType)
                if (addressType) {
                    this.setState({ addressType: addressType.addressType, full_name: addressType.full_name, mobile_no: addressType.mobile_no })
                }
                else if (addressType == 'lab_delivery_Address') {
                    this.setState({ addressType: addressType })
                }

                this.setState({ navigationOption })

            }
            else {
                this.getCurrentLocation();
            }
        } catch (e) {
            console.log(e)
        }
    }
    backNavigation(navigationData) {
        if (navigationData.action) {
            if (navigationData.action.type === 'Navigation/NAVIGATE') {
                let searchLocationData = this.props.navigation.getParam('locationData')
                if (searchLocationData) {
                    this.formUserAddress(searchLocationData)
                    this.setState({ coordinates: searchLocationData.center })
                }
            }
        }
    }

    async getCurrentLocation() {
        try {
            Geolocation.getCurrentPosition(async (position) => {
                const origin_coordinates = [position.coords.longitude, position.coords.latitude];
                await this.setState({
                    center: origin_coordinates,
                    coordinates: origin_coordinates,
                    zoom: 12,
                    isFinisedLoading: true
                })
                this.updtateLocation(origin_coordinates);
            }), error => {
                console.log(error);
            }, { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
        }
        catch (e) {
            console.log(e)
        }
    }
    async updtateLocation(center) {
        let fullPath = `https://api.mapbox.com/geocoding/v5/mapbox.places/${center[0]},${center[1]}.json?types=poi&access_token=${MAP_BOX_TOKEN}`;
        //this._request(center[0].toFixed(2), center[1].toFixed(2))
        let resp = await axios.get(fullPath, {
            headers: {
                'Content-Type': null,
                'x-access-token': null,
                'userId': null
            }
        });
        let locationData = resp.data.features[0];
        if (locationData) {
            this.formUserAddress(locationData);
        }
    }
    formUserAddress(locationData) {
        let locationFullText = '';
        if (locationData.context) {
            for (let i = 0; i < locationData.context.length; i++) {
                let textValue = locationData.context[i].text;
                locationFullText += textValue + ', '
                let contextType = locationData.context[i].id.split('.')[0];
                switch (contextType) {
                    case 'no_and_street':
                        this.updateAddressObject('no_and_street', textValue);
                        break
                    case 'locality':
                        this.updateAddressObject('address_line_1', textValue);
                        break
                    case 'place':
                        this.updateAddressObject('city', textValue);
                        break
                    case 'post_office_name':
                        this.updateAddressObject('post_office_name', textValue);
                        break
                    case 'district':
                        this.updateAddressObject('district', textValue);
                        break
                    case 'region':
                        this.updateAddressObject('state', textValue);
                        break
                    case 'country':
                        this.updateAddressObject('country', textValue);
                        break
                    case 'pin_code':
                        this.updateAddressObject('pin_code', textValue);
                        break
                }
            }
        } else {
            locationFullText = locationData.place_name;
        }
        this.setState({ address: { ...this.state.address }, locationFullText });
        this.setState({ center: locationData.center })
        debugger
    }


    validPincode = async (value) => {
        var reg = /^[1-9][0-9]{5}$/;
        this.updateAddressObject('pin_code', value)
        if (value.match(reg)) {
            this.getPostOffName(value);
            return true;
        }
    }

    getPostOffName = async (value) => {
        let response = await getPostOffNameAndDetails(value);
        console.log("response::::", response)
        if (response.Status == 'Success') {
            let temp = [];
            temp = response.PostOffice;
            this.setState({ postOfficeData: temp })
        } else {
            Toast.show({
                text: response.Message,
                type: 'danger',
                duration: 5000
            })
            return false
        }
    }
    postOfficeAddress = async (value) => {
        if (value != null || value != undefined) {

            this.updateAddressObject('post_office_name', value.Name)
            await this.setState({
                editable: false,
                address: {
                    no_and_street: this.state.address.no_and_street,
                    address_line_1: this.state.address.address_line_1,
                    city: this.state.address.city,
                    district: value.District,
                    state: value.State,
                    country: value.Country,
                    pin_code: this.state.address.pin_code,
                    post_office_name: this.state.address.post_office_name
                }

            })
        }
    }

    updateAddressObject(addressNode, value) {
        let statusCopy = Object.assign({}, this.state);
        statusCopy.address[addressNode] = value;
        this.setState(statusCopy);
    }
    async updateAddressData() {
        try {
            this.setState({ loading: true })
            let Lnglat = this.state.center;
            // addressData = 'address'
            let userAddressData = {
                address: {
                    coordinates: [Lnglat[1], Lnglat[0]],
                    type: 'Point',
                    address: this.state.address
                }
            }
            console.log("userAddressData", userAddressData)
            if (this.state.addressType == 'delivery_Address') {

                if (validateFirstNameLastName(this.state.full_name) == false) {
                    Toast.show({
                        text: 'name should not contains white spaces and any Special Character',
                        type: 'danger',
                        duration: 5000
                    })
                    return false
                } else {
                    userAddressData.delivery_Address = userAddressData.address;
                    userAddressData.delivery_Address.full_name = this.state.full_name;
                    userAddressData.delivery_Address.mobile_no = this.state.mobile_no;

                    delete userAddressData.address

                }
            }
            if (this.state.addressType == 'lab_delivery_Address') {
                userAddressData.delivery_Address = userAddressData.address;
                delete userAddressData.address

            }



            console.log(userAddressData)
            const userId = await AsyncStorage.getItem('userId')
          
            this.setState({ loading: false });

            let result = await userFiledsUpdate(userId, userAddressData);
            if (result.success) {
                if (this.state.fromProfile) {
                    Toast.show({
                        text: result.message,
                        type: 'success',
                        duration: 3000,
                    })
                    this.props.navigation.navigate('Profile');
                } else if (this.state.navigationOption) {
                    this.props.navigation.navigate(navigationOption);

                }
                else {
                    logout();
                    Toast.show({
                        text: "Click Here Login to continue",
                        type: 'success',
                        duration: 3000,
                    })
                    this.props.navigation.navigate('login');
                }
            }
            else {
                Toast.show({
                    text: result.message,
                    type: 'warning',
                    duration: 3000,
                    buttonText: "Okay",
                    buttonTextStyle: {
                        color: "#008000"
                    },
                    buttonStyle: { backgroundColor: "#5cb85c" }
                })
                return
            }
        } catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                type: 'danger',
                duration: 5000
            })
        }
        finally {
            this.setState({ loading: false });
        }
    }
    async onRegionDidChange() {
        if (this.state.isFinisedLoading) {
            const zoom = await this._map.getZoom();
            const center = this.state.center;
            this.setState({ coordinates: center, zoom });
            let fullPath = `https://api.mapbox.com/geocoding/v5/mapbox.places/${center[0]},${center[1]}.json?types=poi&access_token=${MAP_BOX_TOKEN}`;
            //this._request(center[0].toFixed(2), center[1].toFixed(2))
            let resp = await axios.get(fullPath, {
                headers: {
                    'Content-Type': null,
                    'x-access-token': null,
                    'userId': null
                }
            });
            let locationData = resp.data.features[0];
            if (locationData) {
                this.formUserAddress(locationData);
            }
        }
    }

    async onRegionIsChanging() {
        if (this.state.isFinisedLoading) {
            const center = await this._map.getCenter();
            this.setState({ center: center });
        }
    }
    async onDidFinishLoadingMap() {
        await this.setState({ isFinisedLoading: true })
    }
    async onPress(e) {
        // const pointInView = await this._map.getPointInView(e.geometry.coordinates);
        // this.setState({pointInView});
        // console.log(this.state.pointInView);
    }
    _abortRequests = () => {
        this._requests.map(i => i.abort());
        this._requests = [];
    }
    _request = (lng, lat) => {
        this._abortRequests();
        if (lng && lat) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = 1000;
            request.ontimeout = 2000;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 200 && request.status !== 0) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.features !== 'undefined') {
                        if (this._isMounted === true) {
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        console.warn('Map places autocomplete: ' + responseJSON.error_message);
                    }
                } else {
                    //console.warn(JSON.stringify(request) + "request could not be completed or has been aborted");
                }
            };
            let url = '';
            url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lng + ',' + lat + '.json' + '?' + Qs.stringify({
                types: 'poi',
                access_token: MAP_BOX_TOKEN,
            })
            request.open('GET', url);
            request.send();
        }
    }

    render() {
        return (
            <Container>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload); }}
                />
                <Spinner color='blue'
                    visible={this.state.isLoading}
                    textContent={'Please wait Loading...'}
                />
                <View style={{ flex: 1 }}>

                    {this.state.coordinates !== null ?
                        <MapboxGL.MapView
                            ref={(c) => this._map = c}
                            style={{ flex: 1 }}
                            compassEnabled={false}
                            showUserLocation={true}
                            styleURL={MapboxGL.StyleURL.Street}

                            onRegionDidChange={this.onRegionDidChange}
                            regionDidChangeDebounceTime={500}
                            onRegionIsChanging={this.onRegionIsChanging}
                            onDidFinishLoadingMap={this.onDidFinishLoadingMap}
                            centerCoordinate={this.state.coordinates}
                        >
                            {this.state.coordinates !== null ?
                                <MapboxGL.Camera
                                    zoomLevel={this.state.zoom}
                                    centerCoordinate={this.state.coordinates}
                                    animationDuration={2000}
                                /> : null}
                            <MapboxGL.Images
                                images={{ location: locationIcon }}
                            />
                            {this.state.locationFullText !== null ?
                                <MapboxGL.PointAnnotation
                                    id={'Map Center Pin'}
                                    title={this.state.locationFullText}
                                    coordinate={this.state.center}>
                                </MapboxGL.PointAnnotation> : null}
                        </MapboxGL.MapView>
                        : null}
                    <View style={[styles.containerForBubble, { bottom: 0 }]}>
                        <TouchableOpacity style={styles.fab} onPress={() => this.getCurrentLocation()}>
                            <Icon color={'white'} name="locate" style={styles.text}></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.showAllAddressFields == false ?
                    <Card>
                        <CardItem bordered>
                            <Body>
                                <Button iconLeft block success onPress={() => this.setState({ showAllAddressFields: true })}>
                                    <Icon name='paper-plane'></Icon>
                                    <Text>Confirm Location</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card> :
                    <Content style={styles.bodyContent}>
                        <Form>
                            {this.state.addressType == 'delivery_Address' ?
                                <View>
                                    <Item floatingLabel>
                                        <Label>Name</Label>
                                        <Input placeholder="No And Street" style={styles.transparentLabel}
                                            value={this.state.full_name}
                                            onChangeText={value => this.setState({ full_name: value })} />
                                    </Item>
                                    <Item floatingLabel>
                                        <Label>Mobile no </Label>
                                        <Input placeholder="Address Line 1" style={styles.transparentLabel}
                                            value={this.state.mobile_no}
                                            onChangeText={value => acceptNumbersOnly(value) == true || value === '' ? this.setState({ mobile_no: value }) : null}
                                        />
                                    </Item>
                                </View>
                                : null}
                            <Item floatingLabel>
                                <Label>No And Street</Label>
                                <Input placeholder="No And Street" style={styles.transparentLabel}
                                    value={this.state.address.no_and_street}
                                    onChangeText={value => this.updateAddressObject('no_and_street', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Address Line 1</Label>
                                <Input placeholder="Address Line 1" style={styles.transparentLabel}
                                    value={this.state.address.address_line_1}
                                    onChangeText={value => this.updateAddressObject('address_line_1', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Pin Code</Label>
                                <Input placeholder="Pin Code" style={styles.transparentLabel}
                                    keyboardType="numeric"
                                    value={this.state.address.pin_code}
                                    onChangeText={(value) => this.validPincode(value)} />
                            </Item>
                            <Item style={[styles.transparentLabel1]}>
                                <Picker style={{ fontFamily: 'OpenSans', fontSize: 14, backgroundColor: '#F1F1F1' }}
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholder="Select your Post Office Name"
                                    textStyle={{ color: "gray", fontFamily: 'OpenSans' }}
                                    itemStyle={{
                                        backgroundColor: "gray",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                    }}
                                    onValueChange={(value) => this.postOfficeAddress(value)}
                                    itemTextStyle={{ color: '#788ad2' }}
                                    style={{ width: undefined }}
                                    selectedValue={this.state.address.post_office_name}
                                >
                                    {this.state.postOfficeData.map((ele, index) => {
                                        return <Picker.Item label={String(ele.Name)} value={ele} key={index} testID='pickPostOfficeName' />
                                    })}

                                </Picker>
                            </Item>
                            <Item floatingLabel >
                                <Label>City Or Area</Label>
                                <Input placeholder="City" style={styles.transparentLabel}
                                    value={this.state.address.city}
                                    onChangeText={value => this.updateAddressObject('city', value)} />
                            </Item>
                            <Item floatingLabel >
                                <Label>District</Label>
                                <Input placeholder="District" style={styles.transparentLabel}
                                    value={this.state.address.district}
                                    editable={this.state.editable}
                                    onChangeText={value => this.updateAddressObject('district', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>State</Label>
                                <Input placeholder="State" style={styles.transparentLabel}
                                    value={this.state.address.state}
                                    editable={this.state.editable}
                                    onChangeText={value => this.updateAddressObject('state', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Country</Label>
                                <Input placeholder="Country" style={styles.transparentLabel}
                                    value={this.state.address.country}
                                    editable={this.state.editable}
                                    onChangeText={value => this.updateAddressObject('country', value)} />
                            </Item>
                           
                            <Button success style={styles.loginButton} block onPress={() => this.updateAddressData()}>
                                <Icon name='paper-plane'></Icon>
                                <Text>Update</Text>
                            </Button>


                        </Form>
                    </Content>
                }
                <View style={{ position: 'absolute', }}>
                    <Row style={styles.SearchRow1}>
                        <View style={styles.SearchStyle} >
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Icon name="ios-search" style={{ color: '#fff', fontSize: 20, padding: 2 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', width: '90%' }}>
                            <Input placeholder=" Search Location"
                                value={this.state.locationFullText}
                                style={styles.inputfield}
                                placeholderTextColor="black"
                                onFocus={() => { this.state.fromProfile ? this.props.navigation.navigate('UserAddress', { fromProfile: true }) : this.state.navigationOption ? this.props.navigation.navigate('UserAddress', { navigationOption: navigationOption }) : this.props.navigation.navigate('UserAddress') }}
                                onChangeText={locationFullText => this.setState({ locationFullText })} />
                        </View>
                    </Row>

                </View>
            </Container>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerForBubble: {
        borderRadius: 30,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'flex-end',
        left: 0,
        right: 0,
        paddingVertical: 16,
        minHeight: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    fab: {
        height: 50,
        width: 50,
        borderRadius: 200,
        position: 'absolute',
        bottom: 20,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#686cc3',
    },
    header: {
        backgroundColor: '#f6f8fa',
        textAlign: 'center',
        fontFamily: 'OpenSans',
    },
    map: {
        height: 400,
        marginTop: 80
    },
    customText: {
        marginLeft: 10,
        fontFamily: 'OpenSans',
    },
    transparentLabel: {
        borderBottomColor: 'transparent',
        height: 45,
        marginTop: 5,
        borderRadius: 5,
        color: '#000',
        fontFamily: 'OpenSans',
    },
    transparentLabel1: {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        color: '#000',
        fontFamily: 'OpenSans'
    },

    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },
    annotationFill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
        transform: [{ scale: 0.6 }]
    },
    bodyContent: {
        paddingLeft: 10,
        paddingRight: 20,
    },
    loginButton: {
        marginTop: 25,
        backgroundColor: '#775DA3',
        borderRadius: 5,
        fontFamily: 'OpenSans',
        marginLeft: 15,
        marginBottom: 10
    },
    SearchStyle: {
        backgroundColor: '#7E49C3',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#000',
        borderRightWidth: 0.5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        height: 35,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 5,
        marginTop: 50
    },
    inputfield: {
        color: 'black',
        fontFamily: 'OpenSans',
        fontSize: 12,
        padding: 5,
        paddingLeft: 10
    },
    SearchRow1: {
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 0.5,
        height: 35,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 5,
        marginTop: 35
    },
});