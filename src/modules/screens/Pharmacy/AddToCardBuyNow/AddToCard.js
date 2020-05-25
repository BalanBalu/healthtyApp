import React, { Component } from 'react';

import { StyleSheet, Image, Dimensions, AsyncStorage, Modal, TouchableOpacity, TextInput, } from 'react-native';

import {
    Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, Col,
    Text, Thumbnail, Content, CheckBox, Item, Input, Icon, Picker
} from 'native-base';
import { ProductIncrementDecreMent, medicineRateAfterOffer, getMedicineName, renderMedicineImage } from '../CommomPharmacy'
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'
import { hasLoggedIn } from '../../../providers/auth/auth.actions';


export class AddToCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            userAddedMedicineQuantity: 0,
            userAddedTotalMedicineAmount: 0,
            cartItems: [],
            threshold_message: null
        }
    }

    async componentDidMount() {
        let data = this.props.data;


        console.log('addtocard data=======================');
        console.log(JSON.stringify(data))
        if (data.userAddedMedicineQuantity) {
            let userAddedMedicineQuantity = data.userAddedMedicineQuantity || 1
            let discountedValue = medicineRateAfterOffer(data);
            let userAddedTotalMedicineAmount = Number(Number(userAddedMedicineQuantity * discountedValue).toFixed(2))

            await this.setState({ userAddedMedicineQuantity, userAddedTotalMedicineAmount })
        } else {

            this.productQuantityOperator(data, 'add')
        }
        this.setState({ data })

    }
    async productQuantityOperator(item, operator) {
        let discountedValue = medicineRateAfterOffer(item)
        let result = await ProductIncrementDecreMent(this.state.userAddedMedicineQuantity, discountedValue, operator, item.threshold_limit)
        let userAddedTotalMedicineAmount = result.totalAmount || 0;
        let userAddedMedicineQuantity = result.quantity || 0;
        let threshold_message = result.threshold_message || null;
        if (threshold_message !== null) {
            Toast.show({
                text: threshold_message,
                duration: 3000,
                type: 'danger',
                position: "bottom",
                style: { bottom: "50%" }

            })
        }
        this.setState({ userAddedTotalMedicineAmount, userAddedMedicineQuantity, threshold_message })
    }
    async cancelCard() {
        this.props.popupVisible({
            visible: false,
            updatedVisible: false
        })

    }
    cardAction = async () => {
        const { data, userAddedMedicineQuantity, userAddedTotalMedicineAmount } = this.state
        let temp = [];
        temp = data
        temp.userAddedMedicineQuantity = userAddedMedicineQuantity;
        temp.userAddedTotalMedicineAmount = userAddedTotalMedicineAmount
        if (data.selectedType === 'Add to Cart') {
            const isLoggedIn = await hasLoggedIn(this.props);
            if (!isLoggedIn) {
                this.props.navigation.navigate('login');
                return
            }
            let cartItems = []
            let userId = await AsyncStorage.getItem('userId')
            let cart = await AsyncStorage.getItem('cartItems-' + userId);

            if (cart != null) {
                cartItems = JSON.parse(cart);
            }
            if (temp.index != undefined) {
                let index = temp.index
                delete temp.index
                cartItems.splice(index, 1, temp)
            } else {
                cartItems.push(temp);
            }
            let count = cartItems.length;
            console.log("count", count)
            await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cartItems))

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

            <View style={{ height: 200, position: 'absolute', bottom: 0, flex: 1 }}>
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
                        marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: 'grey', width: '95%', paddingBottom: 15, padding: 10
                    }}>
                        <Row >
                            <Col size={7}>
                                <Text style={{ color: '#7227C7', fontSize: 16, fontWeight: '500' }}>{data.selectedType || ''}</Text>
                                <Row style={{ marginTop: 5 }}>
                                    <Col size={4}>
                                        <Image source={renderMedicineImage(data)} style={{ height: 80, width: 70, marginLeft: 5, marginTop: 2.5 }} />
                                    </Col>
                                    <Col size={6} style={{ marginTop: -5 }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{getMedicineName(data)}</Text>
                                        {/* <Text style={{ color: '#7d7d7d', fontFamily: 'OpenSans', fontSize: 12.5, }}>{'By ' + data.pharmacy_name || 'nill'}</Text> */}

                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#848484', }}>{'Total - ₹ ' + (this.state.userAddedTotalMedicineAmount)}</Text>


                                    </Col>

                                </Row>
                            </Col>
                            <Col size={3}>
                                <TouchableOpacity style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <Icon name='ios-close-circle' style={{ fontSize: 20, color: '#FF0000' }} onPress={() => this.cancelCard()} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 15, marginTop: 10, color: "#8dc63f", fontFamily: 'OpenSans', textAlign: 'right', marginRight: 5, marginTop: 10 }}>{'₹' + (medicineRateAfterOffer(data))}</Text>

                                {(data.productDetails && data.productDetails.available !== 0) || data.productDetails === null ?
                                    <Row style={{ justifyContent: 'flex-end', marginTop: 20 }}>
                                        <Col size={4} style={{ marginLeft: 5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.productQuantityOperator(data, 'sub')} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E6E6E6' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: this.state.userAddedMedicineQuantity !== 1 ? '#FF0000' : 'grey' }}>-</Text>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={2} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 12, marginTop: 2.5, fontFamily: 'OpenSans', textAlign: 'center' }}>{this.state.userAddedMedicineQuantity}</Text>
                                        </Col>
                                        <Col size={4} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.productQuantityOperator(data, 'add')} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E6E6E6' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: '#8dc63f' }}>+</Text>
                                            </TouchableOpacity>
                                        </Col>
                                    </Row> : null}
                                {/* api did not ready so condition use in reverse  */}
                                {(data.productDetails && data.productDetails.available === 0) || data.productDetails !== null ?
                                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#ff4e42', marginTop: 5, textAlign: 'center', backgroundColor: '#E6E6E6', }}>Out of stock</Text> :
                                    <TouchableOpacity onPress={() => this.cardAction()} style={{ borderColor: '#4e85e9', borderWidth: 1, borderRadius: 2.5, height: 30, paddingTop: 2, backgroundColor: '#4e85e9', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>

                                        <Icon name='ios-cart' style={{ color: '#fff', fontSize: 13, }} />
                                        <Text style={{ fontSize: 12, color: '#fff', marginTop: 2.5, fontWeight: '500', fontFamily: 'OpenSans', marginLeft: 5, marginBottom: 5, textAlign: 'center' }}>{data.selectedType}</Text>

                                    </TouchableOpacity>
                                }
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



