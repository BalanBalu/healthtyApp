import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    TextInput,
    View,
    FlatList,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Platform,
    ActivityIndicator,
    PixelRatio
} from 'react-native';
import Qs from 'qs';

const WINDOW = Dimensions.get('window');

const defaultStyles = {
    container: {
        marginTop: 2
    },
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        height: 44,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row'
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        height: 28,
        borderRadius: 5,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 7.5,
        marginLeft: 8,
        marginRight: 8,
        fontSize: 15,
        flex: 1
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    powered: {},
    listView: {
        //flex: 1,
    },
    row: {
        padding: 13,
        height: 44,
        flexDirection: 'row',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    administrative: {},
    loader: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
};

export default class MapboxAutocomplete extends Component {
    _isMounted = false;
    _results = [];
    _requests = [];
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    setAddressText = address => this.setState({ text: address })

    getAddressText = () => this.state.text


    componentWillMount() {
        this._request = this._request;
    }

    componentDidMount() {
        this._isMounted = true;
        this._onChangeText(this.state.text);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            listViewDisplayed: nextProps.listViewDisplayed,
        });


        if (typeof (nextProps.text) !== "undefined" && this.state.text !== nextProps.text) {
            this.setState({
                listViewDisplayed: true
            }, this._handleChangeText(nextProps.text));
        }
    }

    componentWillUnmount() {
        this._abortRequests();
        this._isMounted = false;
    }

    buildRowsFromResults = (results) => {
        let res = [];

        if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
            res = [...this.props.predefinedPlaces];

            if (this.props.currentLocation === true) {
                res.unshift({
                    administrative: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        }

        res = res.map(place => ({
            ...place,
            isPredefinedPlace: true
        }));

        return [...res, ...results];
    }

    _abortRequests = () => {
        this._requests.map(i => i.abort());
        this._requests = [];
    }

    /**
     * This method is exposed to parent components to focus on textInput manually.
     * @public
     */
    triggerFocus = () => {
        if (this.refs.textInput) this.refs.textInput.focus();
    }

    /**
     * This method is exposed to parent components to blur textInput manually.
     * @public
     */
    triggerBlur = () => {
        if (this.refs.textInput) this.refs.textInput.blur();
    }

    getCurrentLocation = () => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (this.props.nearbyPlacesAPI === 'None') {
                    let currentLocation = {
                        administrative: this.props.currentLocationLabel,
                        geometry: {
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        }
                    };
                } else {
                    console.warn('navigator not Enabled');
                    //this._requestNearby(position.coords.latitude, position.coords.longitude);
                }
            },
            (error) => {
                alert(error.message);
            },
            options
        );
    }





    _request = (text) => {
        this._abortRequests();
        if (text.length !== 0 && text.length >= this.props.minLength) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200 && request.status !== 0) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.features !== 'undefined') {
                        if (this._isMounted === true) {
                            this._results = responseJSON.features;
                            this.setState({
                                dataSource: this.buildRowsFromResults(responseJSON.features),
                            });
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
            url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + text.split(' ').join('+') + '.json' + '?' + Qs.stringify({
                limit: 5,
                access_token: this.props.accessToken,
                country: this.props.countryCode
                //bbox: this.props.bbox
            })
            request.open('GET', url);
            request.send();

        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    }

    _onChangeText = (text) => {
        this._request(text);

        this.setState({
            text: text,
            listViewDisplayed: true,
        });
    }

    _handleChangeText = (text) => {
        this._onChangeText(text);

        const onChangeText = this.props
            && this.props.textInputProps
            && this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText(text);
        }
    }

    _getRowLoader() {
        return (
            <ActivityIndicator
                animating={true}
                size="small"
            />
        );
    }

    _renderRowData = (rowData) => {
        if (this.props.renderRow) {
            return this.props.renderRow(rowData);
        }
        let firstRowLine = rowData.text;
        if (rowData.address) {
            firstRowLine = `${rowData.address} ${rowData.text}`
        }

        let secondRowLine = '';
        if (rowData.context) {
            for (let i = 0; i < rowData.context.length; i++) {
                secondRowLine += rowData.context[i].text + ', '
            }
        } else {
            secondRowLine = rowData.place_name;
        }

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>

                <Text style={[defaultStyles.administrative, this.props.styles.RowFirstLine, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
                    numberOfLines={1}
                >
                    {this._renderDescription(firstRowLine)}
                </Text>


                <Text style={[defaultStyles.administrative, this.props.styles.RowSecondLine, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
                    numberOfLines={1}
                >
                    {this._renderDescription(secondRowLine)}
                </Text>

            </View>
        );
    }

    _renderDescription = (rowData) => {
        if (this.props.renderDescription) {
            return this.props.renderDescription(rowData);
        }
        return rowData;
    }

    _renderLoader = (rowData) => {
        if (rowData.isLoading === true) {
            return (
                <View style={[defaultStyles.loader, this.props.styles.loader]}>
                    {this._getRowLoader()}
                </View>
            );
        }

        return null;
    }

    _renderRow = (rowData = {}, sectionID, rowID) => {
        return (
            <ScrollView
                style={{ flex: 1 }}
                scrollEnabled={this.props.isRowScrollable}
                keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <TouchableHighlight
                    style={{ width: WINDOW.width }}
                    onPress={() => this._onPress(rowData)}
                    underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
                >
                    <View style={[defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
                        {this._renderRowData(rowData)}
                        {this._renderLoader(rowData)}
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }
    _onPress = (rowData) => {
        this.props.onPress(rowData)
    }
    _renderSeparator = (sectionID, rowID) => {
        if (rowID == this.state.dataSource.length - 1) {
            return null
        }

        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={[defaultStyles.separator, this.props.styles.separator]} />
        );
    }

    _onBlur = () => {
        this.triggerBlur();

        this.setState({
            listViewDisplayed: false
        });
    }

    _onFocus = () => this.setState({ listViewDisplayed: true })


    _renderLeftButton = () => {
        if (this.props.renderLeftButton) {
            return this.props.renderLeftButton()
        }
    }

    _renderRightButton = () => {
        if (this.props.renderRightButton) {
            return this.props.renderRightButton()
        }
    }

    _getFlatList = () => {
        const keyGenerator = () => (
            Math.random().toString(36).substr(2, 10)
        );

        if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
            return (
                //I added code here

                <FlatList
                    style={[defaultStyles.listView, this.props.styles.listView]}
                    data={this.state.dataSource}
                    keyExtractor={keyGenerator}
                    extraData={[this.state.dataSource, this.props]}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={({ item }) => this._renderRow(item)}
                    {...this.props}
                />

            );
        }

        return null;
    }

    render() {
        let {
            onFocus,
            ...userProps
        } = this.props.textInputProps;
        return (
            <View
                style={[defaultStyles.container, this.props.styles.container]}
            >
                {!this.props.textInputHide &&
                    <View
                        style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
                    >
                        {this._renderLeftButton()}
                        <TextInput
                            ref="textInput"
                            returnKeyType={this.props.returnKeyType}
                            autoFocus={this.props.autoFocus}
                            style={[defaultStyles.textInput, this.props.styles.textInput]}
                            value={this.state.text}
                            placeholder={this.props.placeholder}
                            autoCorrect={false}
                            placeholderTextColor={this.props.placeholderTextColor}
                            onFocus={onFocus ? () => { this._onFocus(); onFocus() } : this._onFocus}
                            clearButtonMode="while-editing"
                            underlineColorAndroid={this.props.underlineColorAndroid}
                            {...userProps}
                            onChangeText={this._handleChangeText}
                        />
                        {this._renderRightButton()}
                    </View>
                }
                {this._getFlatList()}
                {this.props.children}
            </View>
        );
    }
}

MapboxAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    returnKeyType: PropTypes.string,
    onPress: PropTypes.func,
    onNotFound: PropTypes.func,
    onFail: PropTypes.func,
    minLength: PropTypes.number,
    fetchDetails: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoFillOnNotFound: PropTypes.bool,
    getDefaultValue: PropTypes.func,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    query: PropTypes.object,
    styles: PropTypes.object,
    textInputProps: PropTypes.object,
    enablePoweredByContainer: PropTypes.bool,
    predefinedPlaces: PropTypes.array,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    nearbyPlacesAPI: PropTypes.string,
    enableHighAccuracyLocation: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    enableEmptySections: PropTypes.bool,
    renderDescription: PropTypes.func,
    renderRow: PropTypes.func,
    renderLeftButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    listUnderlayColor: PropTypes.string,

    isRowScrollable: PropTypes.bool,
    text: PropTypes.string,
    textInputHide: PropTypes.bool,
    accessToken: PropTypes.string
}
MapboxAutocomplete.defaultProps = {
    placeholder: 'Search',
    placeholderTextColor: '#A8A8A8',
    isRowScrollable: true,
    underlineColorAndroid: 'transparent',
    returnKeyType: 'default',
    onPress: () => { },
    onNotFound: () => { },
    onFail: () => { },
    minLength: 0,
    fetchDetails: false,
    autoFocus: false,
    autoFillOnNotFound: false,
    keyboardShouldPersistTaps: 'always',
    getDefaultValue: () => '',
    timeout: 20000,
    onTimeout: () => console.warn('google places autocomplete: request timeout'),
    query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
    },
    GoogleReverseGeocodingQuery: {},
    GooglePlacesSearchQuery: {
        rankby: 'distance',
        types: 'food',
    },
    styles: {},
    textInputProps: {},
    enablePoweredByContainer: true,
    predefinedPlaces: [],
    currentLocation: false,
    currentLocationLabel: 'Current location',
    nearbyPlacesAPI: 'GooglePlacesSearch',
    enableHighAccuracyLocation: true,
    filterReverseGeocodingByTypes: [],
    predefinedPlacesAlwaysVisible: false,
    enableEmptySections: true,
    listViewDisplayed: 'auto',

    textInputHide: false
}

// this function is still present in the library to be retrocompatible with version < 1.1.0


