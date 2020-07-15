import React, { Component } from 'react';
import {
    Container, Content, Text, Item, ListItem, Input, Icon, Footer, FooterTab,
    View, CheckBox,
    Badge,
    Toast
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { getMedicinesSearchList, getNearOrOrderPharmacy, getproductDetailsByPharmacyId } from '../../../providers/pharmacy/pharmacy.action';
import { MAX_DISTANCE_TO_COVER, PHARMACY_MAX_DISTANCE_TO_COVER } from '../../../../setup/config';
import { getAddress, getKiloMeterCalculation, renderPharmacyImage, medicineRateAfterOffer, medicineDiscountedAmount, getMedicineName, CartMedicineImage, ProductIncrementDecreMents, getMedicineNameByProductName } from '../CommomPharmacy'
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
            showDetailsSelectedIndex: -1,
            checked: false,
            prescriptionDetails: null,
            medicineOrderData: [],
            productAvailableData: [],
            pharmacyMedicineData: []
        }
    }
    componentDidMount() {
        let medicineOrderData = this.props.navigation.getParam('medicineOrderData') || [];

        this.setState({ medicineOrderData })
        this.getNearByPharmacyList()
    }
    getNearByPharmacyList = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;
            let locationData = {
                "coordinates": locationCordinates,
                "maxDistance": PHARMACY_MAX_DISTANCE_TO_COVER
            }

            this.setState({ locationCordinates: locationCordinates })



            let result = await getNearOrOrderPharmacy(null, JSON.stringify(locationData));



            if (result.success) {
                await this.setState({ pharmacyData: result.data, pharmacyMainData: result.data })
                if (this.state.medicineOrderData.length !== 0) {
                    let pharmacyIds = []
                    let productmasterIds = []
                    result.data.forEach(element => {
                        pharmacyIds.push(element.pharmacyInfo.pharmacy_id)

                    });
                    this.state.medicineOrderData.forEach(ele => {
                        productmasterIds.push(ele.item.masterProductId)
                    })

                    let productResult = await getproductDetailsByPharmacyId(pharmacyIds, productmasterIds);

                    if (productResult) {
                        let modifiedData = {}
                        let pharmacyData = []
                        result.data.forEach(element => {
                            let pharmacyAvailableData = [];
                            let totalAmount = 0
                            let pharmacyProductData = productResult.find(ele => {
                                return ele.pharmacyId === element.pharmacyInfo.pharmacy_id
                            })

                            if (pharmacyProductData !== undefined && (pharmacyProductData.products !== undefined && pharmacyProductData.products.length !== 0)) {

                                modifiedData = this.medicineDataModify(pharmacyProductData, true)




                            } else {
                                modifiedData = this.medicineDataModify(pharmacyProductData, false)
                            }
                            pharmacyData.push({
                                ...element,
                                pharmacyAvailable: modifiedData.productWithItemData,
                                pharmacyAvailableData: modifiedData.medicineDataModify,
                                unavailableMedicineData: modifiedData.unavailableMedicineData,
                                totalAmount: modifiedData.totalAmount
                            })


                        });

                        this.setState({ pharmacyData: pharmacyData,pharmacyMainData: pharmacyData})
                    }
                }

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
            let value = pharmacyData[selectedPharmacy];
          
            this.props.navigation.navigate("MedicineCheckout", {
                pharmacyInfo: value.pharmacyInfo, isPrescription: true, hasChosePharmacyReload: true, medicineDetails: value.pharmacyAvailable
            });
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
                    <Col size={0.9} style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={{ justifyContent: 'center' }}>
                            <Icon name="ios-search" style={{ color: 'gray', fontSize: 25, }} />
                        </TouchableOpacity>
                    </Col>

                </Row>
            </View>
        )
    }

    medicineDataModify(data, isAvailable) {
        let medicineDataModify = [];
        let unavailableMedicineData = [];
        let productWithItemData=[];
        let totalAmount = 0
        if (isAvailable) {
            this.state.medicineOrderData.forEach(element => {

                let temp = element.item
                let index = data.products.findIndex(ele => {
                    return ele.masterProductId === temp.masterProductId
                })
                if (index !== -1) {
                    let element = data.products[index]
                    console.log('element===')
             console.log(JSON.stringify(element))
                    let item = {
                        discountedAmount: element.discount ? medicineDiscountedAmount(element) : 0,
                        productName: getMedicineName(element),
                        productId: String(element.id),
                        masterProductId: String(element.masterProductId),
                        quantity: temp.quantity,
                        tax: 0,
                        unitPrice: Number(element.price),
                        image: CartMedicineImage(element.productImages)
                    }
                    if (temp.maxThreashold) {
                        item.maxThreashold = temp.maxThreashold
                    }
                    if (temp.h1Product) {
                        item.isH1Product = temp.h1Product
                    }

                    let discountedValue = medicineRateAfterOffer(element);

                    let price = ProductIncrementDecreMents(temp.quantity, discountedValue, 'add', temp.maxThreashold)
                    //   
                    item.totalPrice = price.totalAmount
                    totalAmount = +price.totalAmount
                    productWithItemData.push({ item })
                    medicineDataModify.push(item)
                   
                } else {
                    
                    let data = {
                        productName: temp.productName,
                        status: 'unavailable'
                    }
                    unavailableMedicineData.push(data)

                }
            })
        } else {
            this.state.medicineOrderData.forEach(element => {
                let temp = {
                    productName: element.item.productName,
                    status: 'unavailable'
                }
                unavailableMedicineData.push(temp)
            })

        }
        return {
            productWithItemData:productWithItemData,
            medicineDataModify: medicineDataModify,
            unavailableMedicineData: unavailableMedicineData,
            totalAmount: totalAmount
        }



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
                        <View style={{ marginBottom: 20 }}>
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
                                            <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10, borderRadius: 2.5, }}>
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
                                                            <Col size={3} >
                                                                <View style={{ alignItems: 'flex-end', }}>
                                                                    <Text style={styles.kmText}>{getKiloMeterCalculation(item.pharmacyInfo.location.coordinates, locationCordinates)}</Text>
                                                                </View>
                                                                {selectedPharmacy === index ?
                                                                    <View style={{ marginTop: 10, alignItems: 'flex-end', marginRight: 20 }}>
                                                                        <CheckBox style={{ borderRadius: 5 }}
                                                                            checked={true}
                                                                            onPress={() => this.pharmacySelected(index)}
                                                                        />
                                                                    </View>
                                                                    :
                                                                    <View style={{ marginTop: 10, alignItems: 'flex-end', marginRight: 20 }}>
                                                                        <CheckBox style={{ borderRadius: 5 }}
                                                                            checked={false}
                                                                            onPress={() => this.pharmacySelected(index)}
                                                                        />
                                                                    </View>
                                                                }
                                                            </Col>

                                                        </Row>
                                                        <Row style={{ marginTop: 5 }}>

                                                            {/* vetri */}
                                                            {item.pharmacyAvailableData !== undefined ?

                                                                <View style={{ width: '100%' }} >
                                                                    <Row>
                                                                        <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                                                            {item.pharmacyAvailableData !== undefined && item.pharmacyAvailableData.length !== 0 ?
                                                                                item.pharmacyAvailableData.length === this.state.medicineOrderData.length ?
                                                                                    <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: 'green', fontWeight: '400' }}>{'All product available'} </Text>
                                                                                    :
                                                                                    <Row>
                                                                                        <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: 'green', fontWeight: '400' }}>{item.pharmacyAvailableData.length === 1 ? item.pharmacyAvailableData.length + 'product available' : item.pharmacyAvailableData.length + 'products available'} </Text>
                                                                                        <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: 'green', fontWeight: '400' }}>{item.unavailableMedicineData.length === 1 ? item.unavailableMedicineData.length + 'product un available' : item.unavailableMedicineData.length + 'products un available'} </Text>
                                                                                    </Row>
                                                                                :
                                                                                <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: 'red', fontWeight: '400' }}>{'product un available'} </Text>}

                                                                        </Col>
                                                                        {item.pharmacyAvailableData !== undefined && item.pharmacyAvailableData.length !== 0 ?
                                                                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>

                                                                                <TouchableOpacity onPress={() => this.state.showDetailsSelectedIndex === index ? this.setState({ showDetailsSelectedIndex: -1 }) : this.setState({ showDetailsSelectedIndex: index })}>
                                                                                    <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#fff', fontWeight: '400' }}>{this.state.showDetailsSelectedIndex === index ? 'show hide' : 'show details'}</Text>
                                                                                </TouchableOpacity>
                                                                            </Col> : null}
                                                                    </Row>
                                                                    <View>
                                                                        {this.state.showDetailsSelectedIndex === index ?
                                                                            <FlatList
                                                                                data={item.pharmacyAvailableData}
                                                                                extraData={item.pharmacyAvailableData}
                                                                                keyExtractor={(item, index) => index.toString()}
                                                                                renderItem={({ item }) =>
                                                                                    <Row style={{ marginTop: 10 }}>
                                                                                        <Col size={8}>
                                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#6a6a6a' }}>{item.productName || '' + ' -'}
                                                                                                {item.isH1Product && <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400', color: 'red' }}>
                                                                                                    {'*prescription'}</Text>}
                                                                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#8dc63f' }}>{'(X' + item.quantity + ')'}</Text> </Text>
                                                                                            {/* </Text> */}
                                                                                        </Col>
                                                                                        <Col size={5} style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#8dc63f', textAlign: 'right' }}>{'₹' + item.totalPrice || ''} </Text>

                                                                                        </Col>
                                                                                    </Row>
                                                                                } />
                                                                            : null}
                                                                    </View>

                                                                </View>
                                                                : null}

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
                                <TouchableOpacity onPress={() =>
                                    this.props.navigation.navigate("MedicineCheckout")}>
                                    <Text style={{ fontSize: 16, fontFamily: 'OpenSans', color: '#000', fontWeight: '400' }}>{'Home Delivery'} </Text>
                                </TouchableOpacity>

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
    },
    SearchRow: {
        backgroundColor: 'white',
        borderColor: '#000',
        marginTop: 10,
        marginBottom: 20, height: 40
    },


});