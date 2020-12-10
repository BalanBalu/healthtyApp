import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, ScrollView, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import {  getNearOrOrderPharmacy } from '../../../providers/pharmacy/pharmacy.action'
import { connect } from 'react-redux';
import { MAX_DISTANCE_TO_COVER } from '../../../../setup/config'
import { getAddress } from  '../../../common';
import { setCartItemCountOnNavigation,renderPharmacyImage,getKiloMeterCalculation } from '../CommomPharmacy';
class PharmacyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            pharmacyData: [],
            PharmacyName:''
        }
    }
    componentDidMount() {
        this.getNearByPharmacyList();
        const { navigation } = this.props;
        setCartItemCountOnNavigation(navigation);
    }
    getNearByPharmacyList = async () => {
        try {
            this.setState({ isLoading: true })
            const { bookappointment: { locationCordinates } } = this.props;
            let locationData = {
                "coordinates": locationCordinates,
                "maxDistance": MAX_DISTANCE_TO_COVER
            }
            const userId = await AsyncStorage.getItem('userId')
            let result = await getNearOrOrderPharmacy(userId, JSON.stringify(locationData));
            console.log('JSON.stringify(result)==============================pharmacylist')
            console.log(JSON.stringify(result))
            this.setState({ isLoading: false })
           
            if (result.success) {
                this.setState({ pharmacyData: result.data })
            }
        }
        catch (e) {
            this.setState({ isLoading: false })
            console.log(e)
        }
    }
    goPharmacyMedicineList(item) {
        this.props.navigation.navigate('medicineSearchList', {
            byPharmacy: true,
            pharmacyInfo: item.pharmacyInfo
        })
    }
    render() {
        const { isLoading, pharmacyData } = this.state;
        console.log("bbbb",pharmacyData)
        const { bookappointment: { locationCordinates } } = this.props;
        return (
            <Container style={{ backgroundColor: '#f2f2f2' }}>
                <Content style={{ padding: 10 }}>
                <View style={{ flex: 1, }}>
                    <Item style={{ borderBottomWidth: 0, backgroundColor: '#fff', height: 30, borderRadius: 2, borderWidth: 1, borderColor: 'gray' }}>
                            <Input
                                placeholder='Search Pharmacies'
                                style={{ fontSize: 12, width: '300%' }}
                                placeholderTextColor="#909894"
                                keyboardType={'default'}
                                returnKeyType={'go'}
                                value={this.state.PharmacyName}
                                autoFocus={true}
                                // onChangeText={enteredText => this.SearchKeyWordFunction(enteredText)}
                                multiline={false} />
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} >
                                <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 20 }} />
                            </TouchableOpacity>
                        </Item>
                        <FlatList
                            data={pharmacyData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10,borderRadius: 5, }}>
                                    <Row onPress={() => this.goPharmacyMedicineList(item)}
                                    style={{ paddingBottom: 2 }}>
                                        <Col size={2}>
                                            <Image
                                            source={renderPharmacyImage(item.pharmacyInfo.profile_image)}
                                           
                                               
                                                style={{
                                                    width: 70, height: 75, alignItems: 'flex-end'
                                                }} />
                                        </Col>
                                        <Col size={8} style={{ marginLeft: 20 }}>
                                            <Row>
                                                <Col size={7}>
                                                    <Text style={styles.mednames}>{item.pharmacyInfo.name}</Text>
                                                    <Text style={styles.addressText}>{getAddress(item.pharmacyInfo.location)}</Text>
                                                </Col>
                                                <Col size={3}>
                                                    <Text style={styles.kmText}>{getKiloMeterCalculation(item.pharmacyInfo.location.coordinates, locationCordinates)}</Text>
                                                </Col>
                                            </Row>
                                            <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 5 }}>
                                                <TouchableOpacity 
                                                    onPress={() => this.goPharmacyMedicineList(item)}
                                                    style={{ backgroundColor: '#8dc63f', flexDirection: 'row', paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, marginLeft: 5, borderRadius: 2 }}>
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

function pharmacyState(state) {
    return {
        bookappointment: state.bookappointment,
    }
}
export default connect(pharmacyState)(PharmacyList)


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