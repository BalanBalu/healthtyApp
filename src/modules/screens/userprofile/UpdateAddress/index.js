
import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Item, Text, Icon } from 'native-base';
import MapboxAutocomplete from './AutoComplete';
let token = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjZ0ZXMwdWozNDRteTB4bG14Y2o1In0.A34n-MA-vy3hsydgt_8pRQ';
let publicToken = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanRyZnFvN2YwcGo3NGRxc251bnl3Nzd0In0.A5faVs4HJr1xUgi7k9eg-A';
import MapBox from './MapBox';
import { connect } from 'react-redux';

class UpdateAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            locationFetchSuccess: false
        }
    }
    getSelectedLocationDate = (locationData) => {
        console.log("signup1")
        const { navigation } = this.props;
        const fromProfile = navigation.getParam('fromProfile') || false

        this.props.navigation.navigate('MapBox', { locationData: locationData, fromProfile }),
            console.log('Location Data Success');
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>

                <Item style={style.slide}>
                    <Text style={style.welcome}>Hi, Add Your Location </Text>
                    <Icon name='pin' style={{ fontSize: 50, color: '#775DA3', marginLeft: 10 }} />
                </Item>
                <MapboxAutocomplete
                    text={this.state.text}
                    minLength={2}
                    placeholder='Search Your Location'
                    accessToken={token}
                    countryCode={'IN'}
                    returnKeyType={'search'}
                    fetchDetails={true}
                    listViewDisplayed={true}
                    value={this.state.text}
                    autoFocus={true}
                    onPress={this.getSelectedLocationDate}
                    onChangeText={(text) => this.setState({ text: text })}
                    style={{
                        backgroundColor: 'white', borderRadius: 5, marginLeft: 30,
                        marginRight: 30, fontfamily: 'OpenSans', fontSize: 18
                    }}

                />

            </View>

        );
    }



}
export default UpdateAddress;
const routes = {
    UserLocation: {
        name: 'UserLocation',
        path: 'UserLocation',
        screen: UpdateAddress,
    },
    MapBox: {
        name: 'MapBox',
        path: 'MapBox',
        screen: MapBox,
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
        marginTop: '30%',
        paddingLeft: 30,
        paddingRight: 40,
        fontFamily: 'OpenSans',
    },

});
