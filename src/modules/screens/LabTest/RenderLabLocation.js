import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, FlatList,  Linking, Platform } from 'react-native';
import Mapbox from '../../screens/bookappoinment/Mapbox';

import { Text, Card, List, ListItem, Left, Body, Icon, Right } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import {primaryColor} from '../../../setup/config'


export default class RenderLabLocation extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.number === nextProps.number) return false;
        else return true;
    }
    openMap = (lat, lng, name) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        }); 
        Linking.openURL(url); 
    }

    render() {
        const { locationData, name } = this.props;
       
        const addressData = locationData && locationData.address;
        return (
            <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.7, }}>
                <Row style={{ marginTop: 10 }}>
                    <Icon name='ios-home' style={{ fontSize: 20, color: 'gray' }} />
                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>{name}</Text>
                </Row>
                {/* <Text  style={{ fontFamily: 'OpenSans',fontSize:13,marginLeft:26}}>  {addressData.no_and_street + ', ' + addressData.city + ', ' + addressData.state } </Text> */}
                <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>
                    <Card style={{ height: 250 }}>
                        <Mapbox locationData={locationData} 
                                hospitalLocation={{ location: locationData}}
                        />
                        <List>
                            <ListItem avatar>
                                <Left>
                                    <Icon name="locate" style={{ color: primaryColor, fontSize: 20 }}></Icon>
                                </Left>
                                <Body>
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 12 }}>{addressData.no_and_street}</Text>
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 12 }}>{addressData.city}</Text>
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 12 }}>{addressData.state}</Text>
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 12 }}>{addressData.pin_code}</Text>
                                </Body>
                                <Right>
                                <TouchableOpacity style={{flexDirection: 'row' }} >
                                    <Icon name="directions" type="MaterialIcons" style={{ color: primaryColor, fontSize: 20 }}></Icon>
                                    <Text onPress={()=> this.openMap(locationData.coordinates[0], locationData.coordinates[1], name)}
                                        style={{ fontFamily: 'OpenSans',
                                                 fontSize:13,
                                                 marginLeft: 2,
                                                }}>{'View Directions'}
                                    </Text>
                             </TouchableOpacity>
                                </Right>

                                
                            </ListItem>
                          </List>
                          
                          
                       
                    </Card>
                </Card>
            </View>
        )
    }
};