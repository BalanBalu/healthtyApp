import React, { Component } from 'react';

import { StyleSheet, Image, Dimensions, AsyncStorage, Modal, TouchableOpacity, TextInput, Picker } from 'react-native';

import {
    Container, Header, Title, Left, Right, Body, Button, Card, Toast, CardItem, Row, Grid, View, Col,
    Text, Thumbnail, Content, CheckBox, Item, Input, Icon
} from 'native-base';
import { ProductIncrementDecreMent, medicineRateAfterOffer } from '../CommomPharmacy'
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'


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
        let data = {
            ...this.props.data,
            ...this.props.data.variations[0],
            offeredAmount: medicineRateAfterOffer(this.props.data.variations[0]),
        }

        if (data.userAddedMedicineQuantity) {
            userAddedMedicineQuantity = data.userAddedMedicineQuantity
            userAddedTotalMedicineAmount = Number(Number(userAddedMedicineQuantity * data.offeredAmount).toFixed(2))

            this.setState({ userAddedMedicineQuantity, userAddedTotalMedicineAmount })
        } else {

            this.productQuantityOperator(data, 'add')
        }
        this.setState({ data })

    }
    async productQuantityOperator(item, operator) {
        let result = await ProductIncrementDecreMent(this.state.userAddedMedicineQuantity, item.offeredAmount, operator, item.threshold_limit)
        userAddedTotalMedicineAmount = result.totalAmount || 0,
            userAddedMedicineQuantity = result.quantity || 0
        threshold_message = result.threshold_message || null;
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
        if (data.selectedType === 'Add to Card') {
            let cartItems = []
            let userId = await AsyncStorage.getItem('userId')
            let cart = await AsyncStorage.getItem('cartItems-' + userId);

            if (cart != null) {
                cartItems = JSON.parse(cart);
            }
            if (temp.index != undefined) {
                index = temp.index
                delete temp.index
                cartItems.splice(index, 1, temp)
            } else {
                cartItems.push(temp);
            }
            let count = cartItems.length;
            console.log("count", count)
            await AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(cartItems))
            // this.props.navigation.setParams({
            //     cartItemsCount: count
            // })
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
    variationSelectedValue(value) {
        try {

            let { data, userAddedMedicineQuantity } = this.state
            let temp = {
                ...data,
                ...value,
                offeredAmount : medicineRateAfterOffer(value)
            }
            // data.offeredAmount = medicineRateAfterOffer(value),

         

            userAddedMedicineQuantity = userAddedMedicineQuantity === 0 ? temp.userAddedMedicineQuantity || 1 : userAddedMedicineQuantity
            userAddedTotalMedicineAmount = userAddedMedicineQuantity * temp.offeredAmount




            this.setState({
                data: temp, selected2: value, userAddedMedicineQuantity: userAddedMedicineQuantity, userAddedTotalMedicineAmount: userAddedTotalMedicineAmount
            });
        } catch (e) {
            console.log(e)
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
                                <Col size={6} style={{ marginLeft: 70, marginTop: -5 }}>

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{data.medicine_name}</Text>
                                    <Text style={{ color: '#7d7d7d', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{'By ' + data.pharmacy_name || 'nill'}</Text>
                                    {this.state.threshold_message !== null ?
                                        <Text style={{ fontSize: 8, color: "#ff4e42" }}>{this.state.threshold_message}</Text> : null}

                                    <Row style={{ marginTop: -15 }}>
                                        {data.variations !== undefined ?
                                            <Col size={4} style={{ height: 20, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 1, borderColor: '#000', borderWidth: 0.5, backgroundColor: '#E6E6E6', }}>
                                                <Picker
                                                    mode="dropdown"
                                                    style={{ width: undefined, fontSize: 10 }}
                                                    textStyle={{ fontSize: 12 }}
                                                    placeholder="Select your SIM"
                                                    placeholderStyle={{ color: "#bfc6ea" }}
                                                    placeholderIconColor="#007aff"
                                                    selectedValue={this.state.selected2}
                                                    onValueChange={this.variationSelectedValue.bind(this)}
                                                >


                                                    {data.variations.map((ele, key) => {

                                                        return <Picker.Item label={String(ele.medicine_weight)} value={ele} key={key} />
                                                    })}
                                                    {/* <Picker.Item label="1 MG" value="key0" />
                                    <Picker.Item label="2 MG" value="key1" />
                                    <Picker.Item label="3 MG" value="key2" />
                                    <Picker.Item label="4 MG" value="key3" /> */}
                                                </Picker>
                                            </Col>
                                            : null}
                                        <Col size={1.5}></Col>

                                    </Row>

                                </Col>
                                <Col size={3} style={{ marginLeft: 2.5, marginRight: 5, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 10 }}>
                                    <Row>
                                        <Text style={{ fontSize: 15, marginTop: 10, color: "#8dc63f", fontFamily: 'OpenSans', textAlign: 'right', marginRight: 5 }}>{'₹' + data.offeredAmount}</Text>
                                    </Row>
                                    <Row style={{ marginLeft: 2.5, marginTop: 10, }}>
                                        <Col size={4} style={{ marginLeft: 5 }}>
                                            <TouchableOpacity onPress={() => this.productQuantityOperator(data, 'sub')} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E6E6E6' }}>
                                                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'OpenSans', textAlign: 'center', color: this.state.userAddedMedicineQuantity !== 1 ? '#FF0000' : 'grey' }}>-</Text>
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
                                <Text style={{ fontFamily: 'OpenSans', textAlign: 'right', fontSize: 14, marginBottom: 5, color: '#848484', marginRight: 10 }}>{'Total - ₹ ' + (this.state.userAddedTotalMedicineAmount)}</Text>
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



