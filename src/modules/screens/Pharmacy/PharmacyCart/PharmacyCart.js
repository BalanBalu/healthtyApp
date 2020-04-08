import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, ScrollView, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { ProductIncrementDecreMent, medicineRateAfterOffer, renderMedicineImage } from '../CommomPharmacy';
import { getmedicineAvailableStatus } from '../../../providers/pharmacy/pharmacy.action'

let userId;
class PharmacyCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            isLoading: true,
            deliveryCharge: 10
        }

    }

    async componentDidMount() {
        await this.getAddToCart();
    }

    getAddToCart = async () => {
        try {
            this.setState({ isLoading: true })
            userId = await AsyncStorage.getItem('userId')
            const cartItems = await AsyncStorage.getItem('cartItems-' + userId);
            if (cartItems === undefined) {
                this.setState({ cartItems: [], isLoading: false });
            } else {
                this.setState({ cartItems: JSON.parse(cartItems), isLoading: false });
                console.log("cartItems", this.state.cartItems)
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    async productQuantityOperator(item, operator, index) {
        // let userId = await AsyncStorage.getItem('userId')
        let offeredAmount = medicineRateAfterOffer(item);
        let result = await ProductIncrementDecreMent(item.userAddedMedicineQuantity, offeredAmount, operator)
        let temp = item;
        temp.userAddedTotalMedicineAmount = result.totalAmount || 0,
            temp.userAddedMedicineQuantity = result.quantity || 0
        cartItems = this.state.cartItems
        cartItems[index] == temp
        this.setState({ cartItems })
        await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    }

    removeMedicine = async (index) => {
        let data = this.state.cartItems;
        data.splice(index, 1);
        this.setState({ cartItems: data });
        // let userId = await AsyncStorage.getItem('userId')
        await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    }

    totalPrice() {
        let total = 0;
        if (this.state.cartItems) {
            this.state.cartItems.map(element => {
                total = total + (element.userAddedMedicineQuantity) * (element.offeredAmount)
            })
            return total.toFixed(2);
        }
    }
    paidAmount() {
        return Number(this.totalPrice()).toFixed(2);
    }
    removeAllItems = async () => {
        this.setState({ cartItems: [] })
        await AsyncStorage.removeItem('cartItems-' + userId);
    }
    async  procced() {
        const { cartItems } = this.state;
        let order_items = []
        cartItems.map(element => {
            order_items.push({
                medicine_id: element.medicine_id,
                pharmacy_id: element.pharmacy_id,
                quantity: element.userAddedMedicineQuantity
            })

        })
        let obj = {
            order_items: order_items
        }
        let checkResult = await getmedicineAvailableStatus(obj)
        if (checkResult.success === true) {
            if (checkResult.data.length === cartItems.length) {
                this.props.navigation.navigate("MedicineCheckout", {
                    medicineDetails: cartItems
                })
            } else {
                cartItems.map((ele, index) => {
                    let value = checkResult.data.find(element => {
        
                        return element.pharmacy_id === ele.pharmacy_id && element.medicine_id === ele.medicine_id
                    })
                    console.log(value)
                    if (value === undefined) {
                       
                        ele.is_outofStack = true
                      
                        cartItems.splice(index, 1, ele)
                    }
                })
                this.setState({ cartItems })

            }
        }
    }
    render() {
        const { isLoading, cartItems } = this.state;

        return (
            <Container style={{ backgroundColor: '#EAE6E6' }}>
                <Content>

                    {cartItems == '' || cartItems == null ?
                        <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                            <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No Medicines Are Found Your Cart</Text>
                        </Item> :
                        <View style={{ margin:5 ,backgroundColor: '#fff', borderRadius: 5 ,paddingBottom:5}}>
                            <FlatList
                                data={this.state.cartItems}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>
                                    <Row style={{justifyContent:'center',paddingBottom:5}}>
                                        <Col size={2}  style={{justifyContent:'center'}}>
                                        <Image source={renderMedicineImage(item)}
                                             style={{ height: 100, width: 70, margin: 5 }} />
                                     <Text style={{ fontSize: 10, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: 5,textAlign:'center',backgroundColor:'#E6E6E6',marginTop:-40,marginLeft:5 }}>Out of stock</Text>

                                        </Col>
                                        <Col size={7} style={{ marginLeft: 10,justifyContent:'center' }}>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, marginTop: 5 }}>{item.medicine_name}<Text style={{ontFamily: 'OpenSans', fontSize: 15, marginTop: 5,color:'#909090'}}>(250 g)</Text></Text>
                                            <Text style={{ color: '#A4A4A4', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{item.pharmacy_name}</Text>
                                            {item.is_outofStack !== undefined && item.is_outofStack === true ?
                                                   
                                                   <Text style={{  color: "#ff4e42", fontFamily: 'OpenSans',fontSize: 15, fontWeight: '500', textDecorationLine: 'line-through', textDecorationStyle: 'solid' ,marginTop: 5 }}> {'Out of Stack'}</Text>:null}
                                                <Row style={{ marginTop: -15, marginRight: 10 }}>

                                                    <Col>
                                                        <Text style={{ fontSize: 9.5, marginBottom: -15, marginTop: 30, marginLeft: 3.5, color: "#ff4e42" }}>MRP</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{ fontSize: 9.5, marginTop: 30, marginLeft: -32.5, color: "#ff4e42", textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>₹ {item.price}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{ fontSize: 15, marginTop: 25, marginLeft: -50, color: "#5FB404" }}>₹ {item.offeredAmount}</Text>
                                                    </Col>
                                                   
                                                     
                                                    <Row style={{ marginTop: -25 }}>
                                                        <TouchableOpacity style={styles.touch} onPress={() => this.productQuantityOperator(item, 'sub', index)}>
                                                            <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#FF0000' }} testID='decreaseMedicine'>-</Text>
                                                        </TouchableOpacity>
                                                        <Text style={{ fontWeight: '300', fontSize: 15, textAlign: 'center', marginTop: 4.5, marginLeft: 5, fontFamily: 'OpenSans' }}>{item.userAddedMedicineQuantity}</Text>
                                                        <TouchableOpacity style={styles.touch} onPress={() => this.productQuantityOperator(item, 'add', index)} testID='increaseMedicine'>
                                                            <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#8dc63f' }}>+</Text>
                                                        </TouchableOpacity>
                                                    </Row>
                                                    <Row style={{ marginLeft: -75, marginTop: 30, marginRight: 12.5 }}>
                                                        <TouchableOpacity style={{ borderColor: '#ff4e42', borderWidth: 1, marginLeft: -25, borderRadius: 2.5, marginTop: -12.5, height: 30, width: 100, paddingBottom: -5, paddingTop: 2, backgroundColor: '#fff' }} onPress={() => this.removeMedicine(index)} testID='removeMedicineToCart'>
                                                            <Row style={{ alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 12, color: '#ff4e42', marginTop: 2.5, fontWeight: '500', fontFamily: 'OpenSans', marginLeft: 25, marginBottom: 5, textAlign: 'center' }}><Icon name='ios-trash' style={{ color: '#ff4e42', fontSize: 13, marginLeft: -2.5, paddingTop: 2.3 }} /> Remove</Text>
                                                            </Row>
                                                        </TouchableOpacity>
                                                    </Row>
                                                </Row>
                                        </Col>
                                    </Row>
                                }
                            />
                        </View>
                    }

                    {cartItems !== null ?
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
                {cartItems !== null ?

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
    }



});