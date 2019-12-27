
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Item, Text, Icon, Header, Left, Row } from 'native-base';
import MapboxAutocomplete from './AutoComplete';
let token = 'sk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanZhMjZ0ZXMwdWozNDRteTB4bG14Y2o1In0.A34n-MA-vy3hsydgt_8pRQ';
let publicToken = 'pk.eyJ1IjoidmFpcmFpc2F0aGlzaCIsImEiOiJjanRyZnFvN2YwcGo3NGRxc251bnl3Nzd0In0.A5faVs4HJr1xUgi7k9eg-A';
import MapBox from './MapBox';
import { connect } from 'react-redux';

class UserAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            locationFetchSuccess: false,
            fromProfile: false
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        const fromProfile = navigation.getParam('fromProfile') || false
        console.log(fromProfile)
        if (fromProfile) {
            this.setState({ fromProfile: true })
        }
    }

    getSelectedLocationDate = (locationData) => {

        this.props.navigation.navigate('MapBox', { locationData: locationData, fromProfile: this.state.fromProfile })
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
                {!this.state.fromProfile ?
                    <Header style={{ backgroundColor: '#7E49C3' }}>
                        <Row>
                            <Left>
                                <TouchableOpacity onPress={() => this.props.navigation.pop()} style={{ paddingRight: 10, paddingTop: 10, paddingBottom: 10, alignItems: 'flex-start', flexDirection: 'row', color: '#775DA3', marginLeft: 10 }} >
                                    <Icon name="arrow-back" style={{ color: '#fff', fontSize: 30, marginLeft: 10, marginTop: 10 }} />
                                    <Text style={{ color: '#fff', fontSize: 20, marginLeft: 20, marginTop: 10 }}>Back</Text>
                                </TouchableOpacity>

                            </Left>
                        </Row>
                    </Header>
                    : null}

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
export default UserAddress;
const routes = {
    UserLocation: {
        name: 'UserLocation',
        path: 'UserLocation',
        screen: UserAddress,
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
