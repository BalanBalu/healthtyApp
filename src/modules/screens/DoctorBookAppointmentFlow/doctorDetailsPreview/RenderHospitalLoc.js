import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, FlatList, AsyncStorage, } from 'react-native';
import Mapbox from '../../bookappoinment/Mapbox';

import { Text, Card, List, ListItem, Left, Body, Icon } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';


export default class RenderHospitalLoc extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.number === nextProps.number) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        const { hopitalLocationData } = this.props;
        const addressData = hopitalLocationData.location.address;
        return (
            <View style={{ marginLeft: 5, marginRight: 5, borderTopColor: 'gray', borderTopWidth: 0.7, }}>

                <Row style={{ marginTop: 10 }}>
                    <Icon name='ios-home' style={{ fontSize: 20, color: 'gray' }} />
                    <Text style={{ fontFamily: 'OpenSans', fontSize: 13, fontWeight: 'bold', marginLeft: 10, marginTop: 1 }}>{hopitalLocationData.name}</Text>
                </Row>
                <Card transparent style={{ margin: 20, backgroundColor: '#ecf0f1' }}>

                    <Card>
                        {/* <Mapbox hospitalLocation={hopitalLocationData} /> */}
                        <List>
                            <ListItem avatar>
                                <Left>
                                    <Icon name="locate" style={{ color: '#7E49C3', fontSize: 20 }}></Icon>
                                </Left>
                                <Body>
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.no_and_street}</Text>
                                    {addressData.address_line_1 ? <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.address_line_1}</Text> : null}
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.city}</Text>
                                    {addressData.district ? <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.district}</Text> : null}
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.state}</Text>
                                    {addressData.post_office_name ? <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.post_office_name}</Text> : null}
                                    <Text note style={{ fontFamily: 'OpenSans', fontSize: 15 }}>{addressData.pin_code}</Text>
                                </Body>
                            </ListItem>
                        </List>
                    </Card>
                </Card>
            </View>
        )
    }
};