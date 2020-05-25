import React, { Component } from 'react';
import {
    Container, Content, Text, Item, ListItem, Input, Icon, Footer, FooterTab,

    View, CheckBox as CheckedBox,
    Badge,
    Toast
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { getMedicinesSearchList, getNearOrOrderPharmacy } from '../../../providers/pharmacy/pharmacy.action';
import { MAX_DISTANCE_TO_COVER, PHARMACY_MAX_DISTANCE_TO_COVER } from '../../../../setup/config';
import { getAddress, getKiloMeterCalculation, renderPharmacyImage } from '../CommomPharmacy'
import Spinner from "../../../../components/Spinner";
import { connect } from 'react-redux'
class ChosePharmacyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pharmacyData: [],
            pharmacyMainData: [],
            isLoading: true,
            locationCordinates: null,
            selectedPharmacy: -1,
            checked: false,
            prescriptionDetails: null,
        }
    }
    componentDidMount() {
        let prescriptionDetails = this.props.navigation.getParam('prescriptionDetails') || null;
        this.setState({ prescriptionDetails })
        this.getNearByPharmacyList()
    }
    getNearByPharmacyList = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;
            locationData = {
                "coordinates": locationCordinates,
                "maxDistance": PHARMACY_MAX_DISTANCE_TO_COVER
            }
            console.log('JSON.stringify(locationData)')
            console.log(JSON.stringify(locationData))
            this.setState({ locationCordinates: locationCordinates })
            userId = await AsyncStorage.getItem('userId')
            let postData = [
                {
                    type: 'geo',
                    value: locationData
                }
            ]
            // let result = await getMedicinesSearchList(postData);
            let result = await getNearOrOrderPharmacy(null, JSON.stringify(locationData));
            console.log(JSON.stringify(result))


            if (result.success) {
                await this.setState({ pharmacyData: result.data, pharmacyMainData: result.data })
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false })
        }

    }
    async pharmacySelected(index) {

        if (this.state.selectedPharmacy === index) {
            await this.setState({ selectedPharmacy: -1, checked: !this.state.checked });
        } else {

            await this.setState({ selectedPharmacy: index, checked: !this.state.checked });
        }
    }
    onProceedToPayment = () => {
        const { selectedPharmacy, pharmacyData, prescriptionDetails } = this.state;

        if (selectedPharmacy === -1) {
            Toast.show({
                text: 'kindly choose pharmacy',
                type: 'warning',
                duration: 3000
            })
        } else {
            let temp = [];

            let value = pharmacyData[selectedPharmacy].pharmacyInfo
            // value.PrescriptionId = prescriptionDetails._id
            // value.prescription_ref_no = prescriptionDetails.prescription_ref_no

            // temp.push(value)
            this.props.navigation.navigate("MedicineCheckout", {
                pharmacyInfo: value, isPrescription: true, hasChosePharmacyReload: true
            })
        }
    }
    filterPharmacies(searchValue) {

        const { pharmacyMainData } = this.state;
        if (!searchValue) {
            this.setState({ searchValue, pharmacyData: pharmacyMainData });
        } else {
            const filteredPharmacies = pharmacyMainData.filter(ele =>
                ele.pharmacyInfo.name.toLowerCase().search(searchValue.toLowerCase()) !== -1
            );
            this.setState({ searchValue, pharmacyData: filteredPharmacies, selectedPharmacy: -1 })
        }
    }
    renderStickeyHeader() {
        return (
            <View style={{ width: '100%' }} >
                <Row style={styles.SearchRow}>

                    <Col size={9.1} style={{ justifyContent: 'center', }}>
                        <Input
                            placeholder="Search Pharmacy"
                            style={styles.inputfield}
                            placeholderTextColor="#e2e2e2"
                            keyboardType={'email-address'}
                            value={this.state.searchValue}
                            onChangeText={searchValue => this.filterPharmacies(searchValue)}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={false}
                        />
                    </Col>
                    <Col size={0.9} style={styles.SearchStyle}>
                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <Icon name="ios-search" style={{ color: 'gray', fontSize: 20, padding: 2 }} />
                        </TouchableOpacity>
                    </Col>

                </Row>
            </View>
        )
    }

    render() {
        const { pharmacyData, isLoading, locationCordinates, selectedPharmacy, checked, prescriptionDetails } = this.state;
        const nearPharmacy = [{ name: 'Apollo Pharmacy', km: '2.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }, { name: 'Medplus', km: '5.30KM', address: 'No.28,Kamarajar Nagar,4th cross street, Ambattur, Chennai - 600051.', }]

        return (

            <Container style={{ backgroundColor: '#f2f2f2' }}>
                <Content style={{ padding: 10 }}>
                    {isLoading == true ?

                        <Spinner
                            color="blue"
                            style={[styles.containers, styles.horizontal]}
                            visible={true}
                            size={"large"}
                            overlayColor="none"
                            cancelable={false}
                        /> :
                        <View>
                            {pharmacyData.length === 0 ?
                                <View>
                                    {this.renderStickeyHeader()}

                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                        <Text style={{ fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>No Pharmacies Found Near by current Location</Text>
                                    </Item>
                                </View> :
                                <View>
                                    <FlatList
                                        data={pharmacyData}
                                        extraData={selectedPharmacy}
                                        ListHeaderComponent={this.renderStickeyHeader()}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                                            <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10, }}>
                                                <Row style={{ paddingBottom: 2 }}>
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
                                                            {selectedPharmacy === index ?
                                                                <View>
                                                                    <CheckedBox
                                                                        checked={true}
                                                                        onPress={() => this.pharmacySelected(index)}
                                                                    />
                                                                </View>
                                                                :
                                                                <View>
                                                                    <CheckedBox
                                                                        checked={false}
                                                                        onPress={() => this.pharmacySelected(index)}
                                                                    />
                                                                </View>
                                                            }





                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </View>
                                        } />
                                </View>}
                        </View>
                    }

                </Content>
                <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}>
                    <FooterTab>
                        <Row>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                {prescriptionDetails !== null ?
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{'Ref_no:' + prescriptionDetails.prescription_ref_no} </Text> : null}

                            </Col>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                <TouchableOpacity onPress={() => this.onProceedToPayment()}>
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>Proceed</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}


// export default ChosePharmacyList

function ChosePharmacyListState(state) {

    return {
        bookappointment: state.bookappointment,


    }
}
export default connect(ChosePharmacyListState)(ChosePharmacyList)
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
    containers: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "column",
        justifyContent: "center",
        padding: 10
    }


});