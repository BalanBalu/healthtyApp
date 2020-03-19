import React, { Component } from 'react';
import { Container, Content, Toast, Text, Title, Header, Button, H3, Item, Form, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { getPopularMedicine, getSearchedMedicines, getNearOrOrderPharmacy } from '../../../providers/pharmacy/pharmacy.action'
import { StyleSheet, Image, FlatList, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { medicineRateAfterOffer } from '../CommomPharmacy';
import { MAX_DISTANCE_TO_COVER } from '../../../../setup/config'
import Locations from '../../../screens/Home/Locations';
import CurrentLocation from '../../Home/CurrentLocation';

import Autocomplete from '../../../../components/Autocomplete'
import Spinner from '../../../../components/Spinner'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import bannerOffer from '../../../../../assets/images/25offer-banner.jpg'
import flatBannerOffer from '../../../../../assets/images/20flatoff-banner.jpg'
import { AddToCard } from '../AddToCardBuyNow/AddToCard'

let userId;
class PharmacyHome extends Component {
    searchedMedicinetext = '';
    constructor(props) {
        super(props)
        this.state = {
            medicineData: [],
            clickCard: null,
            footerSelectedItem: '',
            cartItems: [],
            searchMedicine: [],
            keyword: '',
            isLoading: true,
            locationName: '',
            pharmacyData: '',
            selectedMedcine: '',
            isBuyNow: false,
            isAddToCart: false
        }

    }

    async componentDidMount() {

        CurrentLocation.getCurrentPosition();
        this.getCurrentLocation()
        this.getMedicineList();
        this.getNearByPharmacyList();
      
    }

    backNavigation(payload) {
        if (payload.action.type == 'Navigation/BACK' || 'Navigation/POP') {
            this.getCurrentLocation();
            this.getMedicineList();
            this.getNearByPharmacyList();
        }
    }

    /*Get medicine list*/
    getMedicineList = async () => {
        try {
            userId = await AsyncStorage.getItem('userId')
            let result = await getPopularMedicine(userId);
            if (result.success) {
                this.setState({ medicineData: result.data })
                let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                if (cart.length != 0) {
                    let cartData = JSON.parse(cart)
                    this.setState({ cartItems: cartData })
                }
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    /*Get Current Location */
    getCurrentLocation() {
        const { bookappointment: { patientSearchLocationName, locationUpdatedCount } } = this.props;
        if (locationUpdatedCount !== this.locationUpdatedCount) {
            let locationName = patientSearchLocationName;
            this.setState({ locationName })
        }
        this.locationUpdatedCount = locationUpdatedCount;
    }

    getNearByPharmacyList = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;
            locationData = {
                "coordinates": locationCordinates,
                "maxDistance": MAX_DISTANCE_TO_COVER
            }
            let result = await getNearOrOrderPharmacy(userId, JSON.stringify(locationData));
            if (result.success) {
                this.setState({ pharmacyData: result.data })
            }
        }
        catch (e) {
            console.log(e)
        }

    }
    async selectedItems(data, selected, index) {
        try {
            let temp = {
                ...data.medInfo,
                ...data.medPharDetailInfo
            }
            temp.pharmacy_name = data.pharmacyInfo.name;
            temp.pharmacy_id = data.pharmacyInfo.pharmacy_id;
            temp.medicine_id = data.medInfo.medicine_id;
            temp.pharmacyInfo = data.pharmacyInfo;
            temp.offeredAmount = medicineRateAfterOffer(data.medPharDetailInfo)
            temp.selectedType = selected;

            if (index !== undefined) {
                cardItems = this.state.cartItems;
                temp.userAddedMedicineQuantity = cardItems[index].userAddedMedicineQuantity
                temp.index = index
            }
            await this.setState({ selectedMedcine: temp })

        } catch (e) {
            console.log(e)
        }

    }
    getVisible = async (val) => {
        try {
            if (val.isNavigate) {
                this.setState({ isBuyNow: false })
                let temp = [];
                temp.push(val.medicineData)
                this.props.navigation.navigate("MedicineCheckout", {
                    medicineDetails: temp
                })
            }
            else if (val.isNavigateCart) {
                Toast.show({
                    text: 'Item added to card',
                    duration: 3000,

                })
                if (userId) {
                    let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                    if (cart.length != 0) {
                        let cardData = JSON.parse(cart)
                        await this.setState({ cartItems: cardData })
                    }
                }
                this.setState({ isAddToCart: false })
            }
            else {
                this.setState({ isAddToCart: false, isBuyNow: false })
            }
        } catch (e) {
            console.log(e)
        }
    }
    navigatePress(text) {
        console.log(text);
        this.props.navigation.navigate('MedicineSuggestionList', { medicineName: text })

    }

    render() {
        const { medicineData, pharmacyData, cartItems } = this.state
        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload) }}
                />
                <View style={{ backgroundColor: '#7F49C3', padding: 5, paddingBottom: 10, height: 45 }}>
                    <Grid>
                        <Col size={6}>
                            <Item style={{ borderBottomWidth: 0, backgroundColor: '#fff', height: 30, borderRadius: 2 }}>
                                <Input
                                    placeholder='Search for Medicines and Health Products...     '
                                    style={{ fontSize: 12, width: '300%' }}
                                    placeholderTextColor="#C1C1C1"
                                    keyboardType={'default'}
                                    onChangeText={(text) => this.navigatePress(text)}
                                    // onKeyPress={(evet) => this.navigatePress(evet)}
                                    returnKeyType={'go'}
                                    multiline={false} />

                                <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                                    <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 20 }} />
                                </TouchableOpacity>
                            </Item>

                        </Col>
                        <Col size={4} style={{ marginLeft: 5 }}>
                            <TouchableOpacity style={{ backgroundColor: '#fff', height: 30, borderRadius: 2 }} onPress={() => this.props.navigation.navigate('UploadPrescription')}>
                                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Col size={1.5} style={{ alignItems: 'center' }}>
                                        <Icon name='ios-share' style={{ fontSize: 15, color: 'grey', }} />
                                    </Col>
                                    <Col size={8.5} style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: '#000' }}>Upload Prescription</Text>
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </View>
                <Content style={{ backgroundColor: '#F5F5F5', }}>

                    <Row style={{ marginLeft: 15, marginRight: 15, marginTop: 10 }}>

                        <Col size={6} style={{ justifyContent: 'center', backgroundColor: '#fff', height: 30, borderColor: 'gray', borderWidth: 0.3, borderRadius: 2 }}>
                            <Row>
                                <Col size={.5}>
                                    <Icon name='ios-pin' style={{ fontSize: 20, color: '#775DA3', marginTop: 5, marginLeft: 4 }} />
                                </Col>
                                <Col size={5.5} style={{ justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10, color: '#775DA3', marginLeft: 5 }}>Search Near by Stores</Text>
                                </Col>
                            </Row>

                        </Col>
                        <Col size={4} style={{ marginLeft: 5 }}>

                            <TouchableOpacity style={{ backgroundColor: '#4B86EA', height: 30, borderRadius: 2 }} onPress={() => this.props.navigation.navigate('Locations', { navigationOption: 'Near by pharmacies' })}>
                                <Row style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                                    <Col size={0.5} style={{ alignItems: 'flex-start' }}>
                                        <Icon name='locate' style={{ fontSize: 15, color: '#fff', }} />
                                    </Col>
                                    <Col size={3.5} style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#fff' }}>{this.state.locationName} </Text>
                                    </Col>
                                </Row>

                            </TouchableOpacity>
                        </Col>
                    </Row>


                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}

                    >
                        <View style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, marginLeft: 15, backgroundColor: '#fff' }}>
                            <Image
                                source={bannerOffer}
                                style={{
                                    width: 235, height: 120, alignItems: 'center'
                                }}
                            />
                        </View>

                        <View style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, marginLeft: 5, backgroundColor: '#fff' }}>


                            <Image
                                source={flatBannerOffer}
                                style={{
                                    width: 235, height: 120, alignItems: 'center'
                                }}
                            />


                        </View>
                    </ScrollView>



                    <View style={{ marginTop: 10, marginLeft: 5, marginRight: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#4c4c4c', marginBottom: 10, marginLeft: 5 }}>Popular Medicines</Text>
                        <View>
                            <Row>
                                {medicineData.length === 0 ?
                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                        <Text style={{ fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>No Medicines are Available </Text>
                                    </Item> :
                                    <FlatList
                                        data={medicineData}
                                        numColumns={2}
                                        columnWrapperStyle={{ margin: 3 }}
                                        keyExtractor={(item, index) => index.toString()}
                                        initialNumToRender={4}
                                        renderItem={({ item }) =>

                                            <Col size={5} style={{ backgroundColor: '#fff', marginLeft: 5, height: '100%' }}>

                                                <Row onPress={() =>
                                                    this.props.navigation.navigate('MedicineInfo', {
                                                        medicineId: item.medInfo.medicine_id,
                                                        pharmacyId: item.pharmacyInfo.pharmacy_id,
                                                        medicineData: item
                                                    })}>
                                                    <Col size={9} style={{ alignItems: 'center' }}>
                                                        <Image
                                                            source={require('../../../../../assets/images/images.jpeg')}
                                                            style={{
                                                                width: 80, height: 80, alignItems: 'center'
                                                            }}
                                                        />
                                                    </Col>
                                                    {item.medPharDetailInfo.discount_type != undefined ?
                                                        <Col size={1} style={{ position: 'absolute', alignContent: 'flex-end', marginTop: -10, marginLeft: 130 }}>
                                                            <Image
                                                                source={require('../../../../../assets/images/Badge.png')}
                                                                style={{
                                                                    width: 45, height: 45, alignItems: 'flex-end'
                                                                }}
                                                            />
                                                            <Text style={styles.offerText}>{item.medPharDetailInfo.discount_value}</Text>
                                                            <Text style={styles.offText}>{item.medPharDetailInfo.discount_type == 'PERCENTAGE' ? "OFF" : "Rs"}</Text>
                                                        </Col> : null}
                                                </Row>


                                                <Row style={{ alignSelf: 'center', marginTop: 5 }} >
                                                    <Text style={styles.mednames}>{item.medInfo.medicine_name}</Text>
                                                </Row>
                                                <Row style={{ alignSelf: 'center' }} >
                                                    <Text style={styles.hosname}>{item.pharmacyInfo.name}</Text>
                                                </Row>
                                                <Row style={{ alignSelf: 'center', marginTop: 2 }}>
                                                    <Text style={item.medPharDetailInfo.discount_type != undefined ? styles.oldRupees : styles.newRupees}>₹{item.medPharDetailInfo.price}</Text>
                                                    {item.medPharDetailInfo.discount_type != undefined ?
                                                        <Text style={styles.newRupees}>₹{medicineRateAfterOffer(item.medPharDetailInfo)}</Text> : null}
                                                </Row>

                                                <Row style={{ marginBottom: 5, marginTop: 5, alignSelf: 'center' }}>
                                                    {cartItems.length == 0 || cartItems.findIndex(ele => ele.medicine_id == item.medPharDetailInfo.medicine_id && ele.pharmacy_id == item.medPharDetailInfo.pharmacy_id) === -1 ?
                                                        <TouchableOpacity style={styles.addCartTouch}
                                                            onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(item, 'Add to Card') }} >
                                                          
                                                                <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 11, marginLeft: 3.5, paddingTop: 2.3 }} />
                                                                <Text style={styles.addCartText}>Add to Cart</Text>
                                                           
                                                        </TouchableOpacity> :
                                                        <TouchableOpacity style={styles.addCartTouch}
                                                            onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(item, 'Add to Card', cartItems.findIndex(ele => ele.medicine_id == item.medPharDetailInfo.medicine_id && ele.pharmacy_id == item.medPharDetailInfo.pharmacy_id)) }} >
                                                            
                                                                <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 11, marginLeft: 3.5, paddingTop: 2.3 }} />
                                                            <Text style={styles.addCartText}>{'Added ' + cartItems[cartItems.findIndex(ele => ele.medicine_id == item.medPharDetailInfo.medicine_id && ele.pharmacy_id == item.medPharDetailInfo.pharmacy_id)].userAddedMedicineQuantity}</Text>
                                                          
                                                        </TouchableOpacity>}

                                                    <TouchableOpacity style={styles.buyNowTouch} onPress={() => { this.setState({ isBuyNow: true }), this.selectedItems(item, 'Buy Now') }} >
                                                        <Icon name="ios-cart" style={{ fontSize: 12, color: '#fff' }} />
                                                        <Text style={styles.BuyNowText}>Buy Now</Text>
                                                    </TouchableOpacity>
                                                    {this.state.isBuyNow == true || this.state.isAddToCart == true ?
                                                        <AddToCard
                                                            data={this.state.selectedMedcine}
                                                            popupVisible={(data) => this.getVisible(data)}
                                                        />
                                                        : null}
                                                </Row>
                                            </Col>
                                        } />
                                }
                            </Row>
                        </View>
                    </View>


                    <View style={{ marginTop: 10, }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginLeft: 10, color: '#4c4c4c' }}>Nearby Pharmacies</Text>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {pharmacyData.length == 0 ?
                                <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                    <Text style={{ fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>No Pharmacies Found Near by current Location</Text>
                                </Item> :
                                <FlatList
                                    data={pharmacyData}
                                    horizontal={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <View style={{ marginTop: 5, marginLeft: 10, backgroundColor: '#fff', padding: 5, width: 210 }}>

                                            <Row style={{ borderBottomColor: 'gray', borderBottomWidth: .3, paddingBottom: 2 }}>
                                                <Col size={5}>
                                                    <Text style={styles.mednames}>{item.pharmacyInfo.name}</Text>
                                                </Col>
                                                <Col size={5}>
                                                    <Text style={styles.kmText}>{item.km}</Text>
                                                </Col>
                                            </Row>
                                            <View style={{ marginTop: 5 }}>
                                                <Row>
                                                    <Text style={styles.addressText}>{(item.pharmacyInfo && item.pharmacyInfo.location.address.no_and_street) + ',' +
                                                        (item.pharmacyInfo && item.pharmacyInfo.location.address.address_line_1 ? item.pharmacyInfo.location.address.address_line_1 : null) + ',' + (item.pharmacyInfo && item.pharmacyInfo.location.address.city) + ',' + (item.pharmacyInfo && item.pharmacyInfo.location.address.state) + ',' + (item.pharmacyInfo && item.pharmacyInfo.location.address.country) + ',' + (item.pharmacyInfo && item.pharmacyInfo.location.address.pin_code)}</Text>

                                                    {/* <Text style={styles.addressText}>{item.address}</Text> */}
                                                </Row>
                                                <Row style={{ marginTop: 5 }}>
                                                    <Col size={4}>
                                                    </Col>
                                                    <Col size={6}>
                                                        <Row style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                                            <TouchableOpacity
                                                                onPress={() => this.props.navigation.navigate('medicineSearchList', {
                                                                    byPharmacy: true,
                                                                    pharmacyInfo: item.pharmacyInfo
                                                                })}
                                                                style={{ backgroundColor: '#8dc63f', flexDirection: 'row', paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, marginLeft: 5, borderRadius: 2 }}>
                                                                <Icon name="ios-cart" style={{ fontSize: 10, color: '#fff' }} />
                                                                <Text style={styles.orderNowText}>Order Medicines</Text>
                                                            </TouchableOpacity>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </View>
                                        </View>
                                    } />
                            }
                        </ScrollView>

                    </View>
                    <View style={{ marginTop: 10, marginRight: 10, marginLeft: 10, marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#4c4c4c' }}>Here is What you do!</Text>
                        <View style={{ backgroundColor: '#fff', marginTop: 5 }}>
                            <Image
                                source={require('../../../../../assets/images/pharmacyprocess.png')}
                                style={{
                                    width: 350, height: 80, alignItems: 'center'
                                }}
                            />
                        </View>
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
export default connect(pharmacyState)(PharmacyHome)


const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
    customImage: {
        height: 70,
        width: 70,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    curvedGrid: {
        width: 250,
        height: 250,
        borderRadius: 125,
        marginTop: -135,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#745DA6',
        transform: [
            { scaleX: 2 }
        ],
        position: 'relative',
        overflow: 'hidden',

    },
    searchBox: {
        width: '50%',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        marginTop: -80,
        marginBottom: 'auto',
        padding: 20,
        flex: 1
    },
    customColumn: {
        padding: 10,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        borderColor: '#D92B4B',
        borderWidth: 1,
        margin: 5,
        width: '45%',
        marginRight: 10
    },
    pageText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: "bold"
    },
    firstTransparentLabel:
    {
        color: '#000',
        fontFamily: 'OpenSans',
        fontSize: 12
    },
    transparentLabel1: {
        backgroundColor: '#fff',
        height: 30,
        borderRadius: 2
    },
    mednames: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: "700",
        color: '#775DA3'
    },
    hosname: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#909090'
    },
    oldRupees: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        textDecorationLine: 'line-through',
        textDecorationColor: '#ff4e42',
        textDecorationStyle: 'solid',
        color: '#ff4e42',
        marginLeft: 2,
        marginTop: 2
    },
    newRupees: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5
    },
    offerText: {
        fontFamily: 'OpenSans',
        fontSize: 8,
        position: 'absolute',
        color: '#fff',
        marginTop: 13,
        marginLeft: 16
    },
    offText: {
        fontFamily: 'OpenSans',
        fontSize: 6,
        position: 'absolute',
        color: '#fff',
        marginTop: 22,
        marginLeft: 16,
        fontWeight: '700'
    },
    kmText: {
        fontFamily: 'OpenSans',
        fontSize: 8,
        textAlign: 'right',
        color: '#4c4c4c'
    },
    addressText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        textAlign: 'left',
        lineHeight: 20,
        color: '#626262'
    },
    addCartTouch: {
        borderColor: '#4e85e9',
        borderWidth: 0.5,
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 2
    },
    addCartText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#4e85e9',
        marginLeft: 2
    },
    buyNowTouch: {
        backgroundColor: '#8dc63f',
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        marginLeft: 5,
        borderRadius: 2
    },
    BuyNowText: {
        fontFamily: 'OpenSans',
        fontSize: 10,
        color: '#fff',
        marginLeft: 2
    },
    orderNowText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#fff',
        marginLeft: 2
    }
});