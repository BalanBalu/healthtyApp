import React, { Component } from 'react';
import { View, StyleSheet, Image, PermissionsAndroid, AsyncStorage } from 'react-native';

import MapboxGL from '@react-native-mapbox-gl/maps';

import { IS_ANDROID } from '../../../common';
import { Container, Toast, Body, Button, Text, Item, Input, Icon, Card, CardItem, Label, Form, Content, Picker } from 'native-base';
import { MAP_BOX_TOKEN } from '../../../../setup/config';
import axios from 'axios';
import { userFiledsUpdate } from '../../../providers/auth/auth.actions';
MapboxGL.setAccessToken(MAP_BOX_TOKEN);
import Qs from 'qs';
import Spinner from '../../../../components/Spinner';

export default class MapBox extends React.Component {
    _requests = [];
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            fromProfile: false,
            loading: false,
            coordinates:
                null,
            center: [],
            zoom: 12,
            isFinisedLoading: false,
            locationFullText: null,
            showAllAddressFields: false,
            address: {
                no_and_street: null,
                city: null,
                state: null,
                country: null,
                pin_code: null
            }
        }
        this.onPress = this.onPress.bind(this);
        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.onRegionIsChanging = this.onRegionIsChanging.bind(this);
        this.onDidFinishLoadingMap = this.onDidFinishLoadingMap.bind(this);

    }

    componentDidMount() {
        if (IS_ANDROID) {
            PermissionsAndroid.requestMultiple(
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
        }

        this._isMounted = true;
        const { navigation } = this.props;
        const fromProfile = navigation.getParam('fromProfile') || false
        showAllAddressFields = navigation.getParam('mapEdit') || false
        let locationData = this.props.navigation.getParam('locationData');
        this.formUserAddress(locationData)

        this.setState({ coordinates: locationData.center, fromProfile, showAllAddressFields })
    }

    formUserAddress(locationData) {
        let locationFullText = '';
        if (locationData.context) {
            for (let i = 0; i < locationData.context.length; i++) {
                let textValue = locationData.context[i].text;
                locationFullText += textValue + ', '
                let contextType = locationData.context[i].id.split('.')[0];

                switch (contextType) {
                    case 'locality':
                        this.updateAddressObject('no_and_street', textValue);
                        break
                    case 'district':
                        this.updateAddressObject('city', textValue);
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
        this.setState({  address: { ...this.state.address}, locationFullText });
        this.setState({ center: locationData.center })
    }

    updateAddressObject(addressNode, value) {
        let statusCopy = Object.assign({}, this.state);
        statusCopy.address[addressNode] = value;
        // statusCopy.hospitalAddress.address[addressNode] = value;
        this.setState(statusCopy);
    }

    async updateAddressData() {
        try {

            this.setState({ loading: true })
            let Lnglat = this.state.center;
            let userAddressData = {
               
                address: {
                    coordinates: [Lnglat[1], Lnglat[0]],
                    type: 'Point',
                    address: this.state.address
                }
               
            }

            const userId = await AsyncStorage.getItem('userId')
            let result = await userFiledsUpdate(userId, userAddressData);
            this.setState({ loading: false });
            if (result.success) {
                Toast.show({
                    text: result.message,
                    type: 'success',
                    duration: 3000,
                })
                if (this.state.fromProfile)
                    this.props.navigation.navigate('Profile');
                else {
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

            console.log(result);
        } catch (e) {
            Toast.show({
                text: 'Exception Occured' + e,
                type: 'danger',
                duration: 5000
            })
        }
    }

    async onRegionDidChange() {
        // Toast.show({
        //     text: 'Region Did Change',
        //     duration : 3000
        // })
        //const center = this.state.center;
        //const center = await this._map.getCenter();
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
        this.setState({ isFinisedLoading: true })
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
                            onRegionDidChange={this.onRegionDidChange}
                            regionDidChangeDebounceTime={500}
                            onRegionIsChanging={this.onRegionIsChanging}
                            onDidFinishLoadingMap={this.onDidFinishLoadingMap}
                        >

                            {this.state.coordinates !== null ?
                                <MapboxGL.Camera
                                    zoomLevel={this.state.zoom}
                                    centerCoordinate={this.state.coordinates}
                                    animationDuration={2000}
                                /> : null}


                            {<MapboxGL.PointAnnotation
                                id={'Map Center Pin'}
                                title={this.state.locationFullText}
                                coordinate={this.state.center}>
                                <Image
                                    source={require('../../../../../assets/marker.png')}
                                    style={{
                                        flex: 1,
                                        resizeMode: 'contain',
                                        width: 25,
                                        height: 25
                                    }} />
                            </MapboxGL.PointAnnotation>}
                        </MapboxGL.MapView> : null}
                </View>

                {!this.state.showAllAddressFields ?
                    <Card>
                        <CardItem bordered>
                            <Body>

                                <Item floatingLabel>
                                    <Label>Location</Label>
                                    <Input placeholder="Location" style={styles.transparentLabel}
                                        value={this.state.locationFullText}
                                        //editable={false}
                                        onFocus={() => this.props.navigation.navigate('UserAddress')}
                                        onChangeText={locationFullText => this.setState({ locationFullText })} />
                                </Item>

                                <Button iconLeft block success onPress={() => this.setState({ showAllAddressFields: true })}>
                                    <Icon name='paper-plane'></Icon>
                                    <Text>Confirm Location</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card> :

                    <Content style={styles.bodyContent}>
                        <Form>
                            {/* <Item style={styles.transparentLabel}>
                                <Picker style={{ fontFamily: 'OpenSans', fontSize: 14, backgroundColor: '#F1F1F1' }}
                                    mode="dropdown"
                                    placeholder="Select Type"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholder="Select Type"
                                    textStyle={{ color: "gray", fontFamily: 'OpenSans' }}
                                    itemStyle={{
                                        backgroundColor: "gray",
                                        marginLeft: 0,
                                        paddingLeft: 10
                                    }}
                                    onValueChange={(typeValue) => this.setState({ hospitalAddress: { ...this.state.hospitalAddress, type: typeValue } })}
                                    itemTextStyle={{ color: '#788ad2' }}
                                    style={{ width: undefined }}
                                    selectedValue={this.state.hospitalAddress.type}
                                >
                                    <Picker.Item label="Hospital" value="HOSPITAL" />
                                    <Picker.Item label="Clinic" value="CLINIC" />

                                </Picker>
                            </Item>
                            <Item floatingLabel>
                                <Label>Hospital Name</Label>
                                <Input placeholder="Hospital Name" style={styles.transparentLabel}
                                    value={this.state.hospitalAddress.name}
                                    onChangeText={hospitalName => this.setState({ hospitalAddress: { ...this.state.hospitalAddress, name: hospitalName } })} />
                            </Item> */}
                            <Item floatingLabel>
                                <Label>No And Street</Label>
                                <Input placeholder="No And Street" style={styles.transparentLabel}
                                    value={this.state.address.no_and_street}
                                    onChangeText={value => this.updateAddressObject('no_and_street', value)} />
                            </Item>
                            <Item floatingLabel >
                                <Label>City</Label>
                                <Input placeholder="City" style={styles.transparentLabel}
                                    value={this.state.address.city}
                                    onChangeText={value => this.updateAddressObject('city', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>State</Label>
                                <Input placeholder="State" style={styles.transparentLabel}
                                    value={this.state.address.state}
                                    onChangeText={value => this.updateAddressObject('state', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Country</Label>
                                <Input placeholder="Country" style={styles.transparentLabel}
                                    value={this.state.address.country}
                                    onChangeText={value => this.updateAddressObject('country', value)} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Pin Code</Label>
                                <Input placeholder="Pin Code" style={styles.transparentLabel}
                                    value={this.state.address.pin_code}
                                    onChangeText={value => this.updateAddressObject('pin_code', value)} />
                            </Item>


                            <Button success iconLeft style={styles.loginButton} block onPress={() => this.updateAddressData()}>
                                <Icon name='paper-plane'></Icon>
                                <Text>Update</Text>
                            </Button>



                        </Form>
                    </Content>
                }
            </Container>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        color: '#000',
        fontFamily: 'OpenSans',
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
});