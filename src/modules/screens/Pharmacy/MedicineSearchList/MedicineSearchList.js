import React, { Component } from 'react';
import {
    Container, Content, Text, View, Button, H3, Item, Card,
    Input, Left, Right, Icon, Footer, Badge, Form, CardItem, Toast
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList, TouchableHighlight, Modal } from 'react-native';
import Spinner from "../../../../components/Spinner";
import { NavigationEvents } from 'react-navigation';
import { getMedicinesSearchList, getMedicinesSearchListByPharmacyId } from '../../../providers/pharmacy/pharmacy.action'
import { medicineRateAfterOffer, setCartItemCountOnNavigation, getMedicineName, renderMedicineImage, quantityPriceSort } from '../CommomPharmacy'
import { AddToCard } from '../AddToCardBuyNow/AddToCard'
import { connect } from 'react-redux'
import { MAX_DISTANCE_TO_COVER, PHARMACY_MAX_DISTANCE_TO_COVER } from '../../../../setup/config';
class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: [],
            clickCard: null,
            footerSelectedItem: '',
            cartItems: [],
            modalVisible: false,
            //new impementation
            isLoading: true,
            data: [],
            isBuyNow: false,
            selectedMedcine: {},
            medicineName: '',
            AddToCardData: null

        }
    }
    async  componentDidMount() {
        this.setState({ isLoading: true })
        let medicineName = this.props.navigation.getParam('medicineName') || ''
        let medicineInfo = this.props.navigation.getParam('medicineInfo') || ''
        const navigationByPharmacySelect = this.props.navigation.getParam('byPharmacy') || false;
        let userId = await AsyncStorage.getItem('userId')
        if (userId) {
            let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
            if (cart.length != 0) {
                let cartData = JSON.parse(cart)
                this.setState({ cartItems: cartData })
                const { navigation } = this.props;
                setCartItemCountOnNavigation(navigation);
            }
        }
        if (navigationByPharmacySelect === true) {
            let pharmacyInfo = this.props.navigation.getParam('pharmacyInfo') || null;
            this.medicineSearchListByPharmacyId(pharmacyInfo.pharmacy_id)
        }
        else {
            const { bookappointment: { locationCordinates } } = this.props;
            const locationData = {
                "coordinates": locationCordinates,
                "maxDistance": PHARMACY_MAX_DISTANCE_TO_COVER
            }

            let postData = [
                {
                    type: 'geo',
                    value: locationData
                },
                {
                    type: 'medicine_name',
                    value: medicineName
                }
            ]
            if (medicineInfo.medicine_dose) {
                postData.push({
                    type: 'medicine_dose',
                    value: medicineInfo.medicine_dose
                })
            }
            if (medicineInfo.medicine_unit) {
                postData.push({
                    type: 'medicine_unit',
                    value: medicineInfo.medicine_unit
                })
            }
            await this.MedicineSearchList(postData)
        }
        this.setState({ isLoading: false })

    }
    MedicineSearchList = async (postData) => {
        try {
            let medicineResultData = await getMedicinesSearchList(postData);
            // console.log('MedicineSearchList')
            // console.log(JSON.stringify(medicineResultData.data))
            if (medicineResultData.success) {

                let sortedData = await quantityPriceSort(medicineResultData.data)

                this.setState({
                    data: sortedData,
                });
            } else {
                this.setState({
                    data: [],
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    medicineSearchListByPharmacyId = async (pharmacyId) => {
        try {
            let medicineResultData = await getMedicinesSearchListByPharmacyId(pharmacyId);
            console.log(JSON.stringify(medicineResultData.data))
            if (medicineResultData.success) {
                let sortedData = await quantityPriceSort(medicineResultData.data)

                this.setState({
                    data: sortedData
                });
            } else {
                this.setState({
                    data: [],
                });
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
                ...data.medPharDetailInfo,
            }
            temp.pharmacy_name = data.pharmacyInfo.name;
            temp.pharmacy_id = data.pharmacyInfo.pharmacy_id
            temp.pharmacyInfo = data.pharmacyInfo
            temp.selectedType = selected

            if (index !== undefined) {
                let cardItems = this.state.cartItems;
                temp.userAddedMedicineQuantity = cardItems[index].userAddedMedicineQuantity
                temp.index = index
            }
            await this.setState({ selectedMedcine: temp, isBuyNow: true })


        } catch (e) {
            console.log(e)
        }

    }


    async  getvisble(val) {
        try {
            if (val.isNavigate) {
                let temp = [];
                // console.log(val);
                temp.push(val.medicineData)
                await this.setState({ isBuyNow: false })
                this.props.navigation.navigate("MedicineCheckout", {
                    medicineDetails: temp
                })
            } else if (val.isNavigateCart) {
                setCartItemCountOnNavigation(this.props.navigation);
                Toast.show({
                    text: 'Item added to card',
                    duration: 3000,

                })
                let userId = await AsyncStorage.getItem('userId')
                if (userId) {
                    let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                    // console.log('card')
                    if (cart.length != 0) {
                        let cardData = JSON.parse(cart)
                        await this.setState({ cartItems: cardData })
                    }
                }
                this.setState({ isBuyNow: false })
            }
            else {
                this.setState({ isBuyNow: false })
            }

        } catch (e) {
            console.log(e)
        }
    }
    async backNavigation(payload) {
        let hascartReload = await AsyncStorage.getItem('hasCartReload');
        let userId = await AsyncStorage.getItem('userId')

        if (hascartReload === 'true') {
            await AsyncStorage.removeItem('hasCartReload');
            if (userId) {
                let cart = await AsyncStorage.getItem('cartItems-' + userId) || []
                let cartData = []
                if (cart.length != 0) {
                    cartData = JSON.parse(cart)

                }
                await this.setState({ cartItems: cartData })
            }
        }
    }

    render() {
        const { medicineName, isLoading, data, cartItems } = this.state;


        return (
            <Container style={{ flex: 1 }} >
                <NavigationEvents
                    onWillFocus={payload => { this.backNavigation(payload) }}
                />
                <Content style={{ backgroundColor: '#EAE6E6', padding: 10, flex: 1 }}>
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

                            <View style={{ flex: 1, }}>
                                <Item style={{ borderBottomWidth: 0, backgroundColor: '#fff', height: 30, borderRadius: 2, }}>
                                    <Input
                                        placeholder='Search for Medicines and Health Products...     '
                                        style={{ fontSize: 12, width: '300%' }}
                                        placeholderTextColor="#C1C1C1"
                                        keyboardType={'default'}
                                        returnKeyType={'go'}
                                        value={this.state.medicineName}
                                        autoFocus={false}
                                        onChangeText={enteredText => this.props.navigation.navigate('MedicineSuggestionList', { medicineName: enteredText })}
                                        multiline={false} />
                                    <TouchableOpacity style={{ alignItems: 'flex-end' }} >
                                        <Icon name='ios-search' style={{ color: '#775DA3', fontSize: 20 }} />
                                    </TouchableOpacity>
                                </Item>
                            </View>
                            {/* </TouchableOpacity> */}
                            {data.length == 0 ?
                                <Text style={{ marginTop: 5, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 12.5, color: '#7227C7' }}> No medicine were found</Text> :
                                <View>
                                    <Text style={{ marginTop: 5, marginLeft: 5, fontFamily: 'OpenSans', fontSize: 12.5, color: '#7227C7' }}>Showing all results for <Text style={{ fontStyle: 'italic', fontSize: 12.5, color: '#7227C7' }}>{medicineName}</Text></Text>
                                    <View>
                                        <FlatList
                                            data={data}
                                            extraData={this.state}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) =>
                                                <View style={{ backgroundColor: '#fff', marginTop: 10, borderRadius: 5 }}>
                                                    <Row onPress={() =>
                                                        this.props.navigation.navigate('MedicineInfo', {
                                                            medicineId: item.medInfo.medicine_id,
                                                            pharmacyId: item.pharmacyInfo.pharmacy_id,
                                                            medicineData: item
                                                        })
                                                    }>

                                                        <Col size={4}>
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("ImageView", { passImage: renderMedicineImage(item.medInfo), title: item.medInfo.medicine_name })}>

                                                                <Image source={renderMedicineImage(item.medInfo)}

                                                                    style={{ height: 80, width: 70, marginLeft: 5, marginTop: 2.5 }} />
                                                            </TouchableOpacity>
                                                        </Col>
                                                        <Col size={12.5}>
                                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{getMedicineName(item.medInfo)}</Text>
                                                            <Text style={{ color: '#7d7d7d', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{'By ' + item.pharmacyInfo.name}</Text>
                                                            {item.medPharDetailInfo.variations[0].total_quantity === 0 ?
                                                                <Text style={{ fontSize: 15, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: -5 }}>Currently Out of stock</Text> :
                                                                <Row>
                                                                    <Col size={5} style={{ flexDirection: 'row' }}>
                                                                        <Text style={{ fontSize: 8, marginBottom: -15, marginTop: -5, marginLeft: -3, color: "#ff4e42" }}>{'MRP'}</Text>
                                                                        {item.medPharDetailInfo.variations[0].discount_type !== undefined ?
                                                                            <Row>
                                                                                <Text style={{ fontSize: 8, marginLeft: 1.5, marginTop: -5, color: "#ff4e42", textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginLeft: 5 }}>₹ {item.medPharDetailInfo.variations[0].price || ''}</Text>
                                                                                <Text style={{ fontSize: 13, marginTop: -10, marginLeft: 2.5, color: "#8dc63f", marginLeft: 5 }}>₹ {medicineRateAfterOffer(item.medPharDetailInfo.variations[0])}</Text>
                                                                            </Row> : 
                                                                            <Text style={{ fontSize: 13, marginTop: -10, marginLeft: 2.5, color: "#8dc63f", marginLeft: 5 }}>₹ {medicineRateAfterOffer(item.medPharDetailInfo.variations[0])}</Text>
                                                                            }
                                                                    </Col>
                                                                    {cartItems.length == 0 || cartItems.findIndex(ele => ele.medicine_id == item.medPharDetailInfo.medicine_id && ele.pharmacy_id == item.medPharDetailInfo.pharmacy_id) === -1 ?
                                                                        <Col size={3} style={{ height: 20, marginLeft: 4 }}>
                                                                            <Row>
                                                                                <TouchableOpacity style={{ borderColor: '#4e85e9', marginLeft: 1.5, borderWidth: 1, borderRadius: 2.5, marginTop: -12.5, height: 25, width: 65, paddingBottom: 5, paddingTop: 2 }}
                                                                                    onPress={() => this.selectedItems(item, 'Add to Card')} >
                                                                                    <Row style={{ alignItems: 'center' }}>
                                                                                        <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 11, marginLeft: 3.5, paddingTop: 2.3 }} />
                                                                                        <Text style={{ fontSize: 7, color: '#4e85e9', marginTop: 2.5, marginLeft: 6 }}>Add to Cart</Text>
                                                                                    </Row>
                                                                                </TouchableOpacity>
                                                                            </Row>
                                                                        </Col> :

                                                                        <Col size={3} style={{ height: 20, marginLeft: 4 }}>
                                                                            <Row>
                                                                                <TouchableOpacity style={{ borderColor: '#4e85e9', marginLeft: 1.5, borderWidth: 1, borderRadius: 2.5, marginTop: -12.5, height: 25, width: 65, paddingBottom: 5, paddingTop: 2 }}
                                                                                    onPress={() => this.selectedItems(item, 'Add to Card', cartItems.findIndex(ele => ele.medicine_id === item.medPharDetailInfo.medicine_id && ele.pharmacy_id === item.medPharDetailInfo.pharmacy_id))} >
                                                                                    {/* onPress={() =>  this.props.navigation.navigate("PharmacyCart")} > */}
                                                                                    <Row style={{ alignItems: 'center' }}>
                                                                                        <Text>{item.medicine_id}</Text>
                                                                                        <Icon name='ios-cart' style={{ color: '#4e85e9', fontSize: 11, marginLeft: 3.5, paddingTop: 2.3 }} />
                                                                                        <Text style={{ fontSize: 7, color: '#4e85e9', marginTop: 2.5, marginLeft: 6 }}>{'Added ' + cartItems[cartItems.findIndex(ele => ele.medicine_id === item.medPharDetailInfo.medicine_id && ele.pharmacy_id === item.medPharDetailInfo.pharmacy_id)].userAddedMedicineQuantity}</Text>
                                                                                    </Row>
                                                                                </TouchableOpacity>
                                                                            </Row>
                                                                        </Col>}
                                                                    <Col size={3.2} style={{ height: 20, marginLeft: 4, marginRight: 2.5 }}>
                                                                        <Row>
                                                                            <TouchableOpacity style={{ borderColor: '#8dc63f', borderWidth: 1, marginLeft: 1, borderRadius: 2.5, marginTop: -12.5, height: 25, width: 65, paddingBottom: 5, paddingTop: 2, backgroundColor: '#8dc63f' }}
                                                                                onPress={() => this.selectedItems(item, 'Buy Now')}>
                                                                                <Row style={{ alignItems: 'center' }}>
                                                                                    <Icon name='ios-cart' style={{ color: '#fff', fontSize: 11, marginLeft: 5, paddingTop: 2.3 }} />
                                                                                    <Text style={{ fontSize: 7, color: '#fff', marginTop: 2.5, marginLeft: 6 }}>Buy Now</Text>
                                                                                </Row>
                                                                            </TouchableOpacity>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </View>

                                            } />

                                    </View>
                                </View>
                            }

                        </View>
                    }
                    {this.state.isBuyNow == true ?
                        <AddToCard
                            data={this.state.selectedMedcine}
                            popupVisible={(data) => this.getvisble(data)}
                        />
                        : null}




                </Content>
            </Container>



        )
    }
}


function PharmacySearchListState(state) {
    return {
        bookappointment: state.bookappointment,
    }
}
export default connect(PharmacySearchListState)(MedicineSearchList)


const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 90,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: 50
    },

    curvedGrid:
    {
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

    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 17,
        marginTop: 10
    },
    offerText:
    {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: 'green'

    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: 'black'
    },
    transparentLabel1:
    {
        backgroundColor: "#fff",
        height: 35,
        borderRadius: 5
    },

    firstTransparentLabel: {
        fontSize: 12.5,
        marginLeft: 10

    }
});
