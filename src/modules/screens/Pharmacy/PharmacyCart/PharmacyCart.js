import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, ScrollView, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { ProductIncrementDecreMent, medicineRateAfterOffer, renderMedicineImage, getMedicineNameByProductName, getMedicineWeightUnit, setCartItemCountOnNavigation, renderMedicineImageByimageUrl } from '../CommomPharmacy';

import { getmedicineAvailableStatus, deleteCartById, deleteCartByIds,createCart,getCartListByUserId } from '../../../providers/pharmacy/pharmacy.action';
import noAppointmentImage from "../../../../../assets/images/noappointment.png";

let userId;
class PharmacyCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            isLoading: true,

        }

    }

    async componentDidMount() {
        await this.getAddToCart();
    }

    getAddToCart = async () => {
        try {
            this.setState({ isLoading: true })
            userId = await AsyncStorage.getItem('userId')
            let cartItems = await AsyncStorage.getItem('cartItems-' + userId) || [];
            console.log('cartItemscartItemscartItemscartItems')
            console.log(cartItems)

            if (cartItems.length === 0) {
                this.setState({ cartItems: [], isLoading: false });
            } else {

                this.setState({ cartItems: JSON.parse(cartItems), isLoading: false });

            }
          
        }

        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }
    unitOfPrice(data) {
        if (data && data.item) {
            let unitPrice = Number(data.item.totalPrice) / Number(data.item.quantity)
            return unitPrice
        }
    }

    async productQuantityOperator(item, operator, index) {
        // let userId = await AsyncStorage.getItem('userId')
        // let offeredAmount = medicineRateAfterOffer(item);
        let offeredAmount = this.unitOfPrice(item);
        let result = await ProductIncrementDecreMent(item.item.quantity, offeredAmount, operator, item.item.maxThreashold)
        let temp = item;

        temp.item.totalPrice = result.totalAmount || 0,
            temp.item.quantity = result.quantity || 0
        let threshold_message = result.threshold_message || null;
        if (threshold_message !== null) {
            Toast.show({
                text: threshold_message,
                duration: 3000,
                type: 'danger',
                position: "bottom",
                style: { bottom: "50%" }

            })
            return false
        }
           createCart(temp)
        //    getCartListByUserId(userId)
            
             
           await AsyncStorage.setItem('hasCartReload','true')         
              

             
        let cartItems = this.state.cartItems
        cartItems[index] == temp
        this.setState({ cartItems })
        await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    }

    removeMedicine = async (index, removeData) => {
        let data = this.state.cartItems;
        let result = await deleteCartById(removeData.id)
        if (result) {
            data.splice(index, 1);
            this.setState({ cartItems: data });

            await AsyncStorage.setItem('hasCartReload', 'true')
            await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
            setCartItemCountOnNavigation(this.props.navigation)

        }
    }

    totalPrice() {
        let total = 0;

        if (this.state.cartItems) {

            this.state.cartItems.map(element => {


                total = total + element.item.totalPrice
            })

            return total.toFixed(2);
        }
    }
    paidAmount() {
        return Number(this.totalPrice()).toFixed(2);
    }
    removeAllItems = async () => {
        let cartIds = []
        this.state.cartItems.forEach(ele => {
            cartIds.push(ele.id)

        })
        let result = await deleteCartByIds(cartIds)
        if (result) {
            this.setState({ cartItems: [] })
            await AsyncStorage.setItem('hasCartReload', 'true')
            await AsyncStorage.removeItem('cartItems-' + userId);
            setCartItemCountOnNavigation(this.props.navigation)
        }
    }
    async procced() {
        const { cartItems } = this.state;
      let   hasCartReload= await AsyncStorage.getItem('hasCartReload') 
      if(hasCartReload){
        await AsyncStorage.removeItem('hasCartReload') 
      }
        this.props.navigation.navigate("MedicineCheckout", {
            medicineDetails: cartItems,
            orderOption: "pharmacyCart",
        })
        
    }
    render() {
        const { isLoading, cartItems } = this.state;

        return (
            <Container style={{ backgroundColor: '#EAE6E6', flex: 1 }}>
                <Content style={{ flex: 1 }}>

                    {cartItems.length === 0 ?
                        <Card transparent style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "20%"
                        }}>
                            <Thumbnail
                                square
                                source={noAppointmentImage}
                                style={{ height: 100, width: 100, marginTop: "10%" }}
                            />

                            <Text
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: 15,
                                    marginTop: "10%"
                                }}
                                note
                            >
                                No medicines found on your Cart
                    </Text>
                            <Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
                                <Button style={[styles.bookingButton, styles.customButton]}
                                    onPress={() =>
                                        this.props.navigation.pop()
                                    } testID='navigateToHome'>
                                    <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Place Order</Text>
                                </Button>
                            </Item>
                        </Card>

                        :
                        <View style={{ margin: 5, backgroundColor: '#fff', borderRadius: 5, paddingBottom: 5 }}>
                            <FlatList
                                data={this.state.cartItems}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    <Row style={{ justifyContent: 'center', paddingBottom: 5 }}>
                                        <Col size={2} style={{ justifyContent: 'center' }}>

                                            <Image source={renderMedicineImageByimageUrl(item.item)}
                                                style={{ height: 100, width: 70, margin: 5 }} />
                                            {item.is_outofStack !== undefined && item.is_outofStack === true ?
                                                <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: 5, textAlign: 'center', backgroundColor: '#E6E6E6', marginTop: -40, marginLeft: 5 }}>Out of stock</Text> : null}

                                        </Col>
                                        <Col size={7} style={{ marginLeft: 10, justifyContent: 'center' }}>
                                            <Row>
                                                <Col size={7}>
                                                    {item.item.isH1Product && <Text style={{ color: '#A4A4A4', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{'*Prescription'}</Text>}
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginTop: 5 }}>{getMedicineNameByProductName(item)}<Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginTop: 5, color: '#909090' }}>{getMedicineWeightUnit(item.medicine_weight, item.medicine_weight_unit)}</Text></Text>


                                                </Col>
                                                <Col size={3}>
                                                    <Row style={{ marginTop: 20, justifyContent: 'flex-end', marginRight: 5 }}>
                                                        <TouchableOpacity style={styles.touch} onPress={() => this.productQuantityOperator(item, 'sub', index)}>
                                                            <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#FF0000' }} testID='decreaseMedicine'>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={{ fontWeight: '300', fontSize: 15, textAlign: 'center', marginTop: 4.5, marginLeft: 5, fontFamily: 'OpenSans' }}>{item.item.quantity}</Text>
                                                        <TouchableOpacity style={styles.touch} onPress={() => this.productQuantityOperator(item, 'add', index)} testID='increaseMedicine'>
                                                            <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#8dc63f' }}>+</Text>
                                                        </TouchableOpacity>
                                                    </Row>
                                                </Col>
                                            </Row>




                                            <Row style={{}}>
                                                <Col size={7} style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: 9.5, marginBottom: -15, marginTop: 30, marginLeft: 3.5, color: "#ff4e42" }}>MRP</Text>
                                                    {item.item.discountedAmount !== undefined && item.item.discountedAmount !== 0 && item.item.discountedAmount !== null ?
                                                        <Row>
                                                            <Text style={{ fontSize: 9.5, marginTop: 30, color: "#ff4e42", textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginLeft: 5 }}>₹ {item.item.unitPrice}</Text>
                                                            <Text style={{ fontSize: 15, marginTop: 25, color: "#5FB404", marginLeft: 5 }}>₹ {item.item.unitPrice - item.item.discountedAmount}</Text>
                                                        </Row>
                                                        : <Text style={{ fontSize: 15, marginTop: 25, color: "#5FB404", marginLeft: 5 }}>₹ {item.item.unitPrice}</Text>}
                                                </Col>
                                                <Col size={3}>
                                                    <Row style={{ marginTop: 30, }}>
                                                        <TouchableOpacity style={{ borderColor: '#ff4e42', borderWidth: 1, marginLeft: -25, borderRadius: 2.5, marginTop: -12.5, height: 30, width: 100, paddingBottom: -5, paddingTop: 2, backgroundColor: '#fff' }} onPress={() => this.removeMedicine(index, item)} testID='removeMedicineToCart'>
                                                            <Row style={{ alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 12, color: '#ff4e42', marginTop: 2.5, fontWeight: '500', fontFamily: 'OpenSans', marginLeft: 25, marginBottom: 5, textAlign: 'center' }}><Icon name='ios-trash' style={{ color: '#ff4e42', fontSize: 13, marginLeft: -2.5, paddingTop: 2.3 }} /> Remove</Text>
                                                            </Row>
                                                        </TouchableOpacity>
                                                    </Row>
                                                </Col>


                                            </Row>





                                        </Col>
                                    </Row>
                                }
                            />
                        </View>
                    }

                    {cartItems.length !== 0 ?
                        <View style={{ backgroundColor: '#fff', margin: 5, borderRadius: 5 }}>
                            <Row>
                                <Col size={7.5}>
                                    <Text style={styles.Totalamount}>Total Amount of Products in the Cart</Text>
                                </Col>
                                <Col size={2.5}>
                                    <Text style={{ margin: 10, color: '#5FB404', fontSize: 15, textAlign: 'right' }}>₹ {this.totalPrice()}</Text>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: 10 }}>
                                <Col size={7.5}>
                                    <Text style={{ margin: 10, fontWeight: '500', fontSize: 14 }}>Amount to be Paid</Text>
                                </Col>
                                <Col size={2.5}>
                                    <Text style={{ margin: 10, color: '#5FB404', fontSize: 15, textAlign: 'right' }}>₹ {this.paidAmount()}</Text>
                                </Col>
                            </Row>
                        </View> : null
                    }

                </Content>
                {cartItems.length !== 0 ?

                    <Footer style={{}}>
                        <FooterTab>
                            <Row>
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                    <TouchableOpacity onPress={() => this.removeAllItems()}>
                                        <Text style={{ color: '#ff4e42', fontSize: 20, margin: 10, marginLeft: 7.5 }}><Icon name='ios-trash' style={{ color: '#ff4e42', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin: 10 }} /> Remove All</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                    <TouchableOpacity onPress={() => this.procced()}>
                                        <Text style={{ color: '#fff', fontSize: 20, marginLeft: 20, margin: 10 }}><Icon name='ios-cart' style={{ color: '#fff', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin: 10 }} /> Buy Now</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </FooterTab>
                    </Footer> : null}

            </Container >
        )
    }
}


export default PharmacyCart


const styles = StyleSheet.create({


    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 50,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    Totalamount: {
        margin: 10,
        color: '#A4A4A4',
        fontSize: 14
    },

    touch: {
        marginLeft: 2.5,
        marginTop: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E6E6E6',
        justifyContent: 'center',
        alignItems: 'center'
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

    loginButton: {
        marginTop: 12,
        backgroundColor: '#775DA3',
        borderRadius: 5,
    },
    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    customText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: '#2F3940',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 18,
        marginLeft: 20,
        marginTop: 15,
        fontWeight: 'bold'
    },
    medName:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5
    },
    medPhar:
    {
        fontFamily: 'OpenSans',
        fontSize: 12,
    },
    transparentLabel:
    {
        borderBottomColor: 'transparent',
        backgroundColor: '#F1F1F1',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
    },
    badgeText:
    {
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingTop: 5
    },
    button1: {
        backgroundColor: "#5cb75d",
        marginLeft: 20,
        marginTop: -10,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
    },
    button2: {
        marginLeft: 70,
        marginTop: -5,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
        height: 35,
        backgroundColor: 'gray',
    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: '#c26c57',
        marginLeft: 5,
        fontWeight: "bold"
    },
    customButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        backgroundColor: "#775DA3",
        marginLeft: 15,
        borderRadius: 10,
        width: "auto",
        height: 40,
        color: "white",
        fontSize: 12,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto"
    },


});