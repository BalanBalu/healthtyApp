import React, { Component } from 'react';

import { StyleSheet, Image, Dimensions, AsyncStorage, Modal, TouchableOpacity, TextInput } from 'react-native';

import {
    Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, Col,
    Text, Thumbnail, Content, CheckBox, Item, Input, Icon
} from 'native-base';
import { ProductIncrementDecreMent, medicineRateAfterOffer } from '../CommomPharmacy'
import { store } from '../../../../setup/store';
import { connect } from 'react-redux'
// import { SET_ADDTOCART_DETAILS} from '../../../../modules/providers/bookappointment/bookappointment.reducer'


export class AddToCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userAddedMedicineQuantity: 0,
            cartItems: []
        }
    }

    async componentDidMount() {
        let data = {
            ...this.props.data,
            offeredAmount: medicineRateAfterOffer(this.props.data),
        }
        this.setState({ data })
        this.productQuantityOperator(data, 'add')
    }
    async productQuantityOperator(item, operator) {
        let result = await ProductIncrementDecreMent(this.state.userAddedMedicineQuantity, item.offeredAmount, operator)
        userAddedTotalMedicineAmount = result.totalAmount || 0,
            userAddedMedicineQuantity = result.quantity || 0
        this.setState({ userAddedTotalMedicineAmount, userAddedMedicineQuantity })
    }
    async cancelCard() {
        this.props.popupVisible({
            visible: false,
            updatedVisible: false
        })

    }
    async  cardAction() {
        const { data, userAddedMedicineQuantity, userAddedTotalMedicineAmount } = this.state
        let temp = [];
        temp = data
        console.log("temp", temp)
        temp.userAddedMedicineQuantity = userAddedMedicineQuantity;
        temp.userAddedTotalMedicineAmount = userAddedTotalMedicineAmount
        if (data.selectedType === 'Add to Card') {
            let cartItems = []
            let userId = await AsyncStorage.getItem('userId')
            let cart = await AsyncStorage.getItem('cartItems-' + userId);
            if (cart != null) {
                cartItems = JSON.parse(cart);
            }
            cartItems.push(temp);
            await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cartItems))
            cartItems = await AsyncStorage.getItem('cartItems-' + userId);
            await this.setState({ cartItems: JSON.parse(cartItems) })
            console.log("cartItems", JSON.parse(this.state.cartItems.length))

            if (this.state.cartItems.length != 0) {
                console.log("setParams")
                this.props.navigation.setParams({ cartItemsCount: this.state.cartItems.length });
            }

            this.props.popupVisible({
                visible: false,
                updatedVisible: false,
                isNavigateCart: true,
                medicineData: temp
            })
        }
        else if (data.selectedType === 'Buy Now') {
            this.props.popupVisible({
                visible: false,
                updatedVisible: true,
                isNavigate: true,
                medicineData: temp
            })
        }
    }

    render() {
        const { data } = this.state;
        return (

            <View style={{ height: 200, position: 'absolute', bottom: 0 }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    backgroundColor='rgba(0,0,0,0.7)'
                    containerStyle={{ justifyContent: 'flex-end', }}
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                >

                    <Grid style={{
                        backgroundColor: '#fff',
                        position: 'absolute',
                        bottom: 0,
                        marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: 'grey'
                    }}>
                        <Row style={{ backgroundColor: '#fff', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <Left>
                                <Text style={{ color: '#7227C7', fontSize: 16, fontWeight: '500' }}>{data.selectedType || ''}</Text>
                            </Left>
                            <Right>
                                <TouchableOpacity>
                                    <Icon name='ios-close-circle' style={{ fontSize: 20, color: '#FF0000' }} onPress={() => this.cancelCard()} />
                                </TouchableOpacity>
                            </Right>
                        </Row>


                        <View>
                            <Row>
                                <Col size={1} style={{ marginLeft: 5 }}>
                                    <Image source={require('../../../../../assets/images/paracetamol.jpg')} style={{ height: 80, width: 70, marginLeft: 5, marginTop: 2.5 }} />
                                </Col>
                                <Col size={6} style={{ marginLeft: 70 }}>

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{data.medicine_name}</Text>
                                    <Text style={{ color: '#7d7d7d', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{'By ' + data.pharmacy_name || 'nill'}</Text>
                                </Col>
                                <Col size={3} style={{ marginLeft: 2.5, marginRight: 5, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 10 }}>
                                    <Row>
                                        <Text style={{ fontSize: 15, marginTop: 10, color: "#8dc63f", fontFamily: 'OpenSans', textAlign: 'right', marginRight: 5 }}>{'₹' + data.offeredAmount}</Text>
                                    </Row>
                                    <Row style={{ marginLeft: 2.5, marginTop: 10, }}>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <TouchableOpacity onPress={() => this.productQuantityOperator(data, 'sub')} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E6E6E6' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#FF0000' }}>-</Text>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={2}>
                                            <Text style={{ fontSize: 12, marginTop: 2.5, fontFamily: 'OpenSans' }}>{this.state.userAddedMedicineQuantity}</Text>
                                        </Col>
                                        <Col size={4}>
                                            <TouchableOpacity onPress={() => this.productQuantityOperator(data, 'add')} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E6E6E6' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#8dc63f' }}>+</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </View>
                        <Row style={{ marginLeft: 20, marginTop: 10, marginRight: 15, marginBottom: 10 }}>

                            <Col style={{ width: '60%' }}>
                                <Text style={{ fontFamily: 'OpenSans', textAlign: 'right', fontSize: 14, marginBottom: 5, color: '#848484', marginRight: 10 }}>{'Total - ₹ ' + (this.state.userAddedMedicineQuantity * data.offeredAmount)}</Text>
                            </Col>
                            <Col style={{ width: '40%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', }}>
                                <TouchableOpacity onPress={() => this.cardAction()} style={{ borderColor: '#4e85e9', borderWidth: 1, marginLeft: 25, borderRadius: 2.5, marginTop: -12.5, height: 30, width: 120, paddingBottom: -5, paddingTop: 2, backgroundColor: '#4e85e9' }}>
                                    <Row style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#fff', marginTop: 2.5, fontWeight: '500', fontFamily: 'OpenSans', marginLeft: 25, marginBottom: 5, textAlign: 'center' }}><Icon name='ios-cart' style={{ color: '#fff', fontSize: 13, marginLeft: 5, paddingTop: 2.3 }} />{data.selectedType}</Text>
                                    </Row>
                                </TouchableOpacity>
                            </Col>


                        </Row>
                    </Grid>

                </Modal>
            </View>


        );
    }
}

function addToCartState(state) {

    return {
        bookappointment: state.bookappointment,
    }
}
export default connect(addToCartState)(AddToCard)



