import React, { Component } from 'react';
import { Container, Content, Toast, Text, Title, Header, Button, H3, Item, Form, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { getPopularMedicine, getSearchedMedicines, getNearOrOrderPharmacy, searchRecentItemsByPharmacy, getAvailableStockForListOfProducts,getCartListByUserId } from '../../../providers/pharmacy/pharmacy.action'
import { StyleSheet, Image, FlatList, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { medicineRateAfterOffer, setCartItemCountOnNavigation, renderMedicineImage, getMedicineName, getIsAvailable, getselectedCartData } from '../CommomPharmacy';
import { PHARMACY_MAX_DISTANCE_TO_COVER } from '../../../../setup/config'
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
            medicineDataAvailable: [],
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
        const { bookappointment: { locationCordinates } } = this.props;
        if (locationCordinates === null) {
            CurrentLocation.getCurrentPosition();
        }

        this.getMedicineList();
        this.getNearByPharmacyList();

    }

    async backNavigation(payload) {
        try{
            let hascartReload = await AsyncStorage.getItem('hasCartReload')
  
        if (hascartReload === 'true') {
            await AsyncStorage.removeItem('hasCartReload');
            
            if (userId) {
                let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                let cartData = []
                if (cart.length != 0) {
                    cartData = JSON.parse(cart)

                }
                setCartItemCountOnNavigation(this.props.navigation);
                // console.log(JSON.stringify(cartData[]))
                await this.setState({ cartItems: cartData })
                await AsyncStorage.removeItem('hasCartReload');
            }
        }
       
        if (payload.action.type == 'Navigation/BACK' || 'Navigation/POP') {

            // this.getMedicineList();
            // this.getNearByPharmacyList();
        }
    }catch(e){
        console.log(e)
    }
    }

    /*Get medicine list*/
    getMedicineList = async () => {
        try {
            userId = await AsyncStorage.getItem('userId')

            let result = await searchRecentItemsByPharmacy(10)
             console.log('result==========================================')
                 console.log(JSON.stringify(result))


            if (result) {
                let prodcuctIds = []
                result.map(ele => {
                    prodcuctIds.push(ele.id)
                })

                let availableResult = await getAvailableStockForListOfProducts(prodcuctIds);

                this.setState({ medicineData: result, medicineDataAvailable: availableResult })
                console.log("medicineData", this.state.medicineData)
                if (userId) {
                    let cartResult=await getCartListByUserId(userId)
                    if(cartResult){
                        await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cartResult))

                    }
                    let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                    if (cart.length != 0) {
                        let cartData = JSON.parse(cart)
                        await this.setState({ cartItems: cartData })
                        setCartItemCountOnNavigation(this.props.navigation);
                    }
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



    getNearByPharmacyList = async () => {
        try {
            const { bookappointment: { locationCordinates } } = this.props;
            let locationData = {
                "coordinates": locationCordinates,
                "maxDistance": PHARMACY_MAX_DISTANCE_TO_COVER
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
    async selectedItems(data, selected, cartData) {
        try {
            let selectedData = getselectedCartData(data, selected, cartData)

            await this.setState({ selectedMedcine: selectedData })

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
                setCartItemCountOnNavigation(this.props.navigation);
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
        // console.log(text);
        this.props.navigation.navigate('MedicineSuggestionList', { medicineName: text })

    }

    render() {
        const { medicineData, pharmacyData, cartItems } = this.state
        const { navigation } = this.props;
        const { bookappointment: { patientSearchLocationName, locationCordinates } } = this.props;

        return (
            <Container style={styles.container}>
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload) }}
                />
                <View style={{ backgroundColor: '#7F49C3', padding: 5, paddingBottom: 10, height: 45 }}>
                    <Grid>
                        <Col size={10}>
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
                    </Grid>
                </View>
                <Content style={{ backgroundColor: '#F5F5F5', }}>

                    <Row style={{ marginLeft: 15, marginRight: 15, marginTop: 10 }}>

                        <Col onPress={() => navigation.navigate('PharmacyList')}
                            size={6} style={{ justifyContent: 'center', backgroundColor: '#fff', height: 30, borderColor: 'gray', borderWidth: 0.3, borderRadius: 2 }}>
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

                            <TouchableOpacity style={{ backgroundColor: '#4B86EA', height: 30, borderRadius: 2 }} onPress={() => this.props.navigation.navigate('Locations', { navigationOption: 'Medicines' })}>
                                <Row style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                                    <Col size={0.5} style={{ alignItems: 'flex-start' }}>
                                        <Icon name='locate' style={{ fontSize: 15, color: '#fff', }} />
                                    </Col>
                                    <Col size={3.5} style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#fff' }}>{patientSearchLocationName || ''} </Text>
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
                    <View style={{ marginTop: 10, marginRight: 10, marginLeft: 10, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('UploadPrescription')}>
                            <View style={styles.uploadStyles}>
                                <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Col size={7.5} style={{ justifyContent: 'center' }}>
                                        <Text style={styles.uploadText}>Upload your prescription and get your order quickly </Text>
                                        <Row style={{ alignItems: 'center', }}>
                                            <TouchableOpacity style={styles.uploadTouchable} onPress={() => this.props.navigation.navigate('UploadPrescription')}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                                                    UPLOAD PRESCRIPTION
                                                </Text>
                                                <Icon name='ios-arrow-forward' style={{ marginLeft: 5, color: '#fff', fontSize: 15 }} />
                                            </TouchableOpacity>
                                        </Row>
                                    </Col>
                                    <Col size={2.5} >
                                        <Image
                                            source={require('../../../../../assets/images/PresciptionUploadImage.png')}
                                            style={{
                                                width: 80, height: 80, alignItems: 'center'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                                        extraData={cartItems}
                                        numColumns={2}
                                        columnWrapperStyle={{ margin: 3 }}
                                        keyExtractor={(item, index) => index.toString()}
                                        initialNumToRender={4}
                                        renderItem={({ item }) =>
                                            <Row onPress={() =>
                                                this.props.navigation.navigate('MedicineInfo', {
                                                    medicineId: item.id,
                                                    medicineData: item
                                                })}>
                                                <Col size={5} style={{ backgroundColor: '#fff', marginLeft: 5, height: '100%', borderRadius: 2.5, }}>

                                                    <Row>
                                                    {item.h1Product ?
                                                            <Col size={1} style={{ position: 'absolute', alignContent: 'flex-end', marginTop: -10, marginRight: 120 }}>
                                                              
                                                                <Text style={{ width: 50, height: 45,fontSize:8,marginTop: 10,color:'red'}}>{'* Prescription'}</Text>
                                                             
                                                            </Col> : null}
                                                        <Col size={8} style={{ alignItems: 'center' }}>
                                                            <Image source={renderMedicineImage(item.productImages)}
                                                                style={{ height: 80, width: 70, marginLeft: 5, marginTop: 2.5 }} />
                                                        </Col>
                                                        {item.discount !== undefined && item.discount !== null ?
                                                            <Col size={1} style={{ position: 'absolute', alignContent: 'flex-end', marginTop: -10, marginLeft: 120 }}>
                                                                <Image
                                                                    source={require('../../../../../assets/images/Badge.png')}
                                                                    style={{
                                                                        width: 45, height: 45, alignItems: 'flex-end'
                                                                    }}
                                                                />
                                                                <Text style={styles.offerText}>{item.discount.value}</Text>
                                                                <Text style={styles.offText}>{item.discount.type === 'PERCENT' ? "OFF" : "Rs"}</Text>
                                                            </Col> : null}
                                                    </Row>


                                                    <Row style={{ alignSelf: 'center', marginTop: 5 }} >
                                                        <Text style={styles.mednames}>{getMedicineName(item)}</Text>
                                                    </Row>
                                            
                                                    <Row style={{ alignSelf: 'center', marginTop: 2 }}>
                                                        <Text style={item.discount !== undefined && item.discount !== null ? styles.oldRupees : styles.newRupees}>₹{item.price||0}</Text>
                                                        {item.discount !== undefined && item.discount !== null ?
                                                            <Text style={styles.newRupees}>₹{medicineRateAfterOffer(item)}</Text> : null}
                                                    </Row>
                                                    {getIsAvailable(item,this.state.medicineDataAvailable) === false ?
                                                                <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: -5 }}>Currently Out of stock</Text> :

                                                    <Row style={{ marginBottom: 5, marginTop: 5, alignSelf: 'center' }}>
                                                        {cartItems.length == 0 || cartItems.findIndex(ele => ele.item.productId == item.id) === -1 ?
                                                            <TouchableOpacity style={styles.addCartTouch}
                                                                onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(item, 'Add to Cart') }} >

                                                                <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 12, marginLeft: 3.5, paddingTop: 2.3, }} />
                                                                <Text style={styles.addCartText}>Add to Cart</Text>

                                                            </TouchableOpacity> :
                                                            <TouchableOpacity style={styles.addCartTouch}
                                                                onPress={() => { this.setState({ isAddToCart: true }), this.selectedItems(item, 'Add to Cart', cartItems.find(ele => ele.item.productId == item.id)) }} >

                                                                <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 12, marginLeft: 3.5, paddingTop: 2.3, }} />
                                                                <Text style={styles.addCartText}>{'Added ' + cartItems[cartItems.findIndex(ele => String(ele.item.productId) == String(item.id))].item.quantity}</Text>

                                                            </TouchableOpacity>}

                                                        <TouchableOpacity style={styles.buyNowTouch} onPress={() => { this.setState({ isBuyNow: true }), this.selectedItems(item, 'Buy Now') }} >
                                                            <Icon name="ios-cart" style={{ fontSize: 12, color: '#fff', marginTop: 1 }} />
                                                            <Text style={styles.BuyNowText}>Buy Now</Text>
                                                        </TouchableOpacity>
                                                        {this.state.isBuyNow == true || this.state.isAddToCart == true ?
                                                            <AddToCard
                                                                navigation={this.props.navigation}
                                                                data={this.state.selectedMedcine}
                                                                popupVisible={(data) => this.getVisible(data)}
                                                            />
                                                            : null}
                                                    </Row>
                                        }
                                                </Col>
                                            </Row>
                                                        
                                        } />
                                }
                            </Row>
                        </View>
                    </View>


                    <View style={{ marginTop: 10, }}>
                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginLeft: 10, color: '#4c4c4c' }}>Near by pharmacy</Text>
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
                                        <View style={{ marginTop: 5, marginLeft: 10, backgroundColor: '#fff', padding: 5, width: 210, borderRadius: 2.5, }}>

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
                                                                <Icon name="ios-cart" style={{ fontSize: 12, color: '#fff', marginTop: 3 }} />
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
                    <View style={{ marginTop: 10, marginRight: 10, marginLeft: 10, marginBottom: 10, borderRadius: 5 }}>
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
        flex: 1
    },
    bodyContent: {
        padding: 5,
        flex: 1
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
    },
    uploadStyles:{
        backgroundColor: '#fff', 
        marginTop: 5, 
        width: '100%', 
        paddingBottom: 5, 
        paddingTop: 5, 
        paddingLeft: 10, 
        borderRadius: 5
    },
    uploadText:{
        fontSize: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 5, 
        lineHeight: 20 
    },
    uploadTouchable:{
        backgroundColor: '#7F49C3', 
        paddingRight: 10, 
        paddingBottom: 4,
         paddingTop: 4, 
         paddingLeft: 10, 
         flexDirection: 'row', 
         justifyContent: 'center', 
         borderRadius: 5,
         marginRight: 10, 
    }
});