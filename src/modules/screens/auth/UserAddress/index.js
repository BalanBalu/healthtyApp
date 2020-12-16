
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Item, Text, Icon, Header, Left, Row, } from 'native-base';
import MapboxAutocomplete from './AutoComplete';
let token = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjZ0ZXMwdWozNDRteTB4bG14Y2o1In0.A34n-MA-vy3hsydgt_8pRQ';

export default class UserAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            locationFetchSuccess: false,
            fromProfile: false,
            navigationOption: null
        }
        this.fromProfile = props.navigation.getParam('fromProfile') || false
        this.navigationOption = props.navigation.getParam('navigationOption') || null;
    }
    getSelectedLocationDate = (locationData) => {
        this.props.navigation.navigate('MapBox', { locationData: locationData, fromProfile: this.fromProfile })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
                {!this.fromProfile && !this.navigationOption ?
                    <Header style={{ backgroundColor: '#7E49C3' }}>
                        <Row>
                            <Left>
                                <TouchableOpacity onPress={() => this.props.navigation.pop()} style={Platform.OS === "ios" ? { paddingRight: 10, paddingTop: 10, paddingBottom: 10, alignItems: 'flex-start', flexDirection: 'row', color: '#775DA3', marginTop: -10, marginLeft: -10 } : { paddingRight: 10, paddingTop: 10, paddingBottom: 10, alignItems: 'flex-start', flexDirection: 'row', color: '#775DA3', marginLeft: 10 }} >
                                    <Icon name="arrow-back" style={{ color: '#fff', fontSize: 30, marginLeft: 10, marginTop: 10 }} />
                                    <Text style={{ color: '#fff', fontSize: 20, marginLeft: 20, marginTop: 10 }}>Back</Text>
                                </TouchableOpacity>

                            </Left>
                        </Row>
                    </Header>
                    : null}
                {Platform.OS === "ios" ?
                    <View style={style.iosSlide}>
                        <Text style={[style.welcome, { marginTop: 20 }]}>Hi, Add Your Location</Text>
                        <Icon name='pin' style={{ fontSize: 30, color: '#775DA3', marginLeft: 10, marginTop: 20 }} />
                    </View> :
                    <Item style={style.slide}>
                        <Text style={style.welcome}>Hi, Add Your Location </Text>
                        <Icon name='pin' style={{ fontSize: 50, color: '#775DA3', marginLeft: 10 }} />
                    </Item>
                }
                <MapboxAutocomplete
                    text={this.state.enteredText}
                    minLength={2}
                    placeholder='Search Your Location'
                    accessToken={token}
                    countryCode={'IN'}
                    returnKeyType={'search'}
                    fetchDetails={true}
                    listViewDisplayed={true}
                    value={this.state.enteredText}
                    autoFocus={true}
                    onPress={this.getSelectedLocationDate}
                    onChangeText={(enteredText) => this.setState({ enteredText })}
                    style={{
                        backgroundColor: 'white', borderRadius: 5, marginLeft: 30,
                        marginRight: 30, fontfamily: 'OpenSans', fontSize: 18
                    }}
                />
            </View>
        );
    }
}
const style = StyleSheet.create({
    welcome:
    {
        fontSize: 22,
        textAlign: 'center',
        marginTop: -10,
        fontFamily: 'opensans-semibold',
    },
    slide: {
        borderBottomWidth: 0,
        justifyContent: 'center',
        marginTop: 30,
        paddingLeft: 30,
        paddingRight: 40,
        fontFamily: 'OpenSans',
    },
    iosSlide: {
        borderBottomWidth: 0,
        justifyContent: 'center',
        fontFamily: 'OpenSans',
        flexDirection: 'row',
        marginTop: 30
    },
});
