import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, ScrollView, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';

class PharmacyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            isLoading: true
        }
    }

    render() {
        const { isLoading, cartItems } = this.state;
        const nearPharmacy = [{ name: 'Apollo Pharmacy', km: '2.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }]

        return (
            <Container style={{ backgroundColor: '#f2f2f2' }}>
                <Content style={{ padding: 10 }}>
                    <View>
                        <FlatList
                            data={nearPharmacy}
                            renderItem={({ item }) =>
                                <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10, }}>
                                    <Row style={{ paddingBottom: 2 }}>
                                        <Col size={2}>
                                            <Image
                                                source={require('../../../../../assets/images/apollopharmacy.jpeg')}
                                                style={{
                                                    width: 70, height: 75, alignItems: 'flex-end'
                                                }} />
                                        </Col>
                                        <Col size={8} style={{ marginLeft: 20 }}>
                                            <Row>
                                                <Col size={7}>
                                                    <Text style={styles.mednames}>{item.name}</Text>
                                                    <Text style={styles.addressText}>{item.address}</Text>
                                                </Col>
                                                <Col size={3}>
                                                    <Text style={styles.kmText}>{item.km}</Text>
                                                </Col>
                                            </Row>
                                            <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 5 }}>
                                                <TouchableOpacity style={{ backgroundColor: '#8dc63f', flexDirection: 'row', paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, marginLeft: 5, borderRadius: 2 }}>
                                                    <Icon name="ios-cart" style={{ fontSize: 10, color: '#fff', marginTop: 2 }} />
                                                    <Text style={styles.BuyNowText}>Order Medicines</Text>
                                                </TouchableOpacity>
                                            </Row>
                                        </Col>
                                    </Row>
                                </View>
                            } />
                    </View>
                </Content>
            </Container>
        )
    }
}


export default PharmacyList


const styles = StyleSheet.create({
    mednames: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: "700",
        color: '#775DA3'
    },
    kmText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#909090',
        marginTop: 3,
        textAlign: 'right'
    },
    addressText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        textAlign: 'left',
        lineHeight: 15,
        color: '#626262',
        marginTop: 3
    },

    BuyNowText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#fff',
        marginLeft: 2
    },


});