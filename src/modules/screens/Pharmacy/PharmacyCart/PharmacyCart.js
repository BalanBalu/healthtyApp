import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, ScrollView, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { ProductIncrementDecreMent, medicineRateAfterOffer } from '../CommomPharmacy'

let temp, userId;
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
            let userId = await AsyncStorage.getItem('userId')
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
        let offeredAmount = medicineRateAfterOffer(item);
        let result = await ProductIncrementDecreMent(item.userAddedMedicineQuantity, offeredAmount, operator)
        let temp = item;
        temp.userAddedTotalMedicineAmount = result.totalAmount || 0,
            temp.userAddedMedicineQuantity = result.quantity || 0
        this.setState({ cartItems: temp })

    }

    // increase(index) {
    //     let selectedCartItem = this.state.cartItems;
    //     selectedCartItem[index].selectedQuantity++;
    //     this.setState({ cartItems: selectedCartItem })
    //     AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    // }

    // decrease(index) {
    //     let selectedCartItem = this.state.cartItems;
    //     if (selectedCartItem[index].selectedQuantity > 1) {
    //         selectedCartItem[index].selectedQuantity--;
    //         this.setState({ cartItems: selectedCartItem })
    //         AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    //     }
    // }

    removeMedicine(index) {
        let data = this.state.cartItems;
        data.splice(index, 1);
        this.setState({ cartItems: data });
        AsyncStorage.setItem('cartItems-' + userId, JSON.stringify(this.state.cartItems))
    }

    totalPrice() {
        let total = 0;
        if (this.state.cartItems) {
            this.state.cartItems.forEach(element => {
                total = total + ((parseInt(element.price) - (parseInt(element.offer) / 100) * parseInt(element.price)) * parseInt(element.selectedQuantity))
            })
            return total.toFixed(2);
        }
    }
    paidAmount() {
        return parseInt(this.state.cartItems.userAddedTotalMedicineAmount) + parseInt(this.state.deliveryCharge)
    }

    render() {
        const { isLoading, cartItems } = this.state;

        return (
            <Container style={{ backgroundColor: '#EAE6E6' }}>
                <Content>

                    {/* <View style={{ margin: 5, marginTop:10, backgroundColor: '#fff', borderRadius: 5 }}>
                        <Row>
                            <Col>
                                <Text style={{ margin: 10, fontFamily: 'Open Sans', color: '#7401DF' }}>Delivery Address</Text>
                            </Col>
                            <Col>
                                <TouchableOpacity>
                                    <Text style={{ fontFamily: 'Open Sans', marginTop: 12.5, margin: 10, fontSize: 11, textAlign: 'right', color: '#ff4e42' }}>Change</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        <Row>
                            <Text style={{ fontFamily: 'Open Sans', margin: 10, fontSize: 12.5, marginTop: -5, color: '#848484' }} >No 67, Gandhi taurret, OT Bus Stand, Ambattur - 600051</Text>
                        </Row>
                    </View> */}
                    <View style={{ margin: 5, backgroundColor: '#fff', borderRadius: 5 }}>
                    <FlatList
                        data={this.state.cartItems}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                                <Row>
                                    <Image source={require('../../../../../assets/images/paracetamol.jpg')} style={{ height: 100, width: 70, margin: 5 }} />
                                    <Col Size={5} style={{ marginLeft: 10 }}>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginTop: 5 }}>{item.medicine_name}</Text>
                                        <Text style={{ color: '#A4A4A4', fontFamily: 'OpenSans', fontSize: 12.5, marginBottom: 20 }}>{item.pharmacy_name}</Text>
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
                    {/* <View style={{ backgroundColor: '#fff', margin: 5, borderRadius: 5 }}>
                        <Row>
                            <Col>
                                <Text style={{ margin: 10, fontFamily: 'Open Sans', color: '#7401DF', marginBottom: -5 }}>Add More Item</Text>
                            </Col>
                            <Col>
                                <TouchableOpacity>
                                    <Icon name='ios-add-circle' style={{ margin: 10, color: '#7401DF', fontSize: 25, marginLeft: 125, paddingTop: 2.3 }} />
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View> */}

                    <View style={{ backgroundColor: '#fff', margin: 5, borderRadius: 5 }}>
                        <Row>
                            <Col size={7.5}>
                                <Text style={styles.Totalamount}>Total Amount of Products in the Cart</Text>
                            </Col>
                            <Col size={2.5}>
                                <Text style={{ margin: 10, color: '#5FB404', fontSize: 15, textAlign: 'right' }}>₹ {this.state.cartItems.userAddedTotalMedicineAmount}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Col size={7.5}>
                                <Text style={styles.Totalamount}>Delivery Charges</Text>
                            </Col>
                            <Col size={2.5}>
                                <Text style={{ margin: 10, color: '#ff4e42', fontSize: 15, textAlign: 'right' }}>₹ {this.state.deliveryCharge}</Text>
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
                    </View>



                    {/* <View style={{ margin: 100 }}>
                        <Image source={require('../../../../../assets/images/Emptycart.png')} style={{ height: 175, width: 175 }} />
                        <Text style={{ margintop: -20, textAlign: 'center', color: '#7401DF', fontWeight: '500', fontFamily: 'OpenSans' }}>OOPS!</Text>
                        <Text style={{ textAlign: 'center', color: '#848484', fontFamily: 'OpenSans', fontWeight: '400', marginTop:2.5}}>Your Cart is Empty!</Text>
                        <TouchableOpacity style={{ borderColor: '#5FB404', borderWidth: 1, marginLeft: 20, borderRadius: 2.5, marginTop: 15, height: 30, width: 120, paddingBottom: -5, paddingTop: 2, backgroundColor: '#5FB404' }}>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, color: '#fff', marginTop: 2.5, fontWeight: '500', fontFamily: 'OpenSans', marginRight: 10, marginLeft: 10, marginBottom: 5, textAlign: 'center' }}><Icon name='ios-cart' style={{ color: '#fff', fontSize: 13, marginLeft: 2.5, paddingTop: 2.3 }} /> Add Item</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* {isLoading == true ? <Loader style='list' /> :

             <Content style={styles.bodyContent}>

             <Grid style={styles.curvedGrid}>
              </Grid>
             <Grid style={{ marginTop: -60, height: 100, }}>
               <Row style={{ justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 18, }}>CHECKOUT</Text>
               </Row>
             </Grid>

            <Card transparent >
            <Grid >
              <Row style={{ justifyContent: 'center', width: '100%', marginTop: -15 }}>
                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 20, padding: 5 }}>Your Order</Text>
               </Row>
            </Grid>
              {cartItems== '' || cartItems== null  ?
               <Item style={{ borderBottomWidth: 0, justifyContent:'center',alignItems:'center', height:70 }}>
               <Text style={{fontSize:20,justifyContent:'center',alignItems:'center'}}>No Medicines Are Found Your Cart</Text>
               </Item>  :
                <FlatList
                   data={cartItems}
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({ item, index }) =>

                <Card style={{ marginTop: 10, padding: 10,  }}>
                  <Grid>
                    <Row >
                        <Col style={{width:'30%'}}>
                        <Image source={{ uri: 'https://static01.nyt.com/images/2019/03/05/opinion/05Fixes-1/05Fixes-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale' }} style={{
                                        width: 100, height: 100, borderRadius: 10,  }} />

                        </Col>
                        <Col style={{width:'70%',marginTop:-20}}>
                        <Text style={styles.labelTop}>{item.medicine_name} </Text>
                        <Row style={{marginTop:10,marginLeft:20}}>
                        <Text style={styles.subText}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
                            <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}{item.price}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#ffa723', marginLeft: 5, fontWeight: 'bold' }}> {'Get'+ ' ' +item.offer+ '%' +' ' +'Off'}</Text>
                        </Row>
                        <Row style={{marginTop:10,marginLeft:20}}>
                            <Col style={{width:'50%'}}>
                                <Row>
                            <TouchableOpacity  onPress={()=>this.decrease(index)} testID='decreaseMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 35, height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <TextInput type='number' min='1' style={{ marginLeft: 5, marginTop: -12, color: '#c26c57' }} >{item.selectedQuantity}</TextInput>
                            <TouchableOpacity  onPress={()=>this.increase(index)} testID='increaseMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 35, height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: -5, color: 'black' }}>+</Text>
                                </View>
                            </TouchableOpacity>
                            </Row>
                            </Col>
                            <Col style={{width:'50%',marginLeft:-60}}>
                            <TouchableOpacity style={{ marginLeft: 55, alignItems: 'center'}} onPress={()=> this.removeMedicine(index)} testID='removeMedicineToCart'>
                                <Icon style={{ fontSize: 30, color: 'red', marginTop: -4 }} name='ios-trash' />
                            </TouchableOpacity>  
                            </Col>
                        
                      
                         
                        </Row>
                        </Col>
                     </Row>
                  </Grid>
                </Card>
                
                }/>
              }
            </Card>

            </Content>}
              {this.state.cartItems != ''?
                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Total </Text>
                        {this.totalPrice()== undefined ?
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:0'}</Text>:
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:'+this.totalPrice()}</Text>
                        }
                    </Row>
                    <Col >
                        <Button style={{ backgroundColor: '#5cb75d', borderRadius: 10, padding: 10, marginTop: 10, marginLeft: 40, height: 35 }} onPress={()=> this.props.navigation.navigate('MedicineCheckout',{medicineDetails:this.state.cartItems})} testID='navigateToCheckout'>
                            <Text>Checkout</Text>
                        </Button>
                    </Col>
                </Footer>: null} */}
                </Content>
               

                <Footer style={{}}>
                    <FooterTab>
                        <Row>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                                <TouchableOpacity >
                                    <Text style={{ color: '#ff4e42', fontSize: 20, margin: 10, marginLeft: 7.5 }}><Icon name='ios-trash' style={{ color: '#ff4e42', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin: 10 }} /> Remove All</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col size={5} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#8dc63f' }}>
                                <TouchableOpacity>
                                    <Text style={{ color: '#fff', fontSize: 20, marginLeft: 20, margin: 10 }}><Icon name='ios-cart' style={{ color: '#fff', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin: 10 }} /> Buy Now</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </FooterTab>
                </Footer>









                {/* <View style={{marginTop:200,  backgroundColor:'#fff'}}>
                        
                        <Row>
                            <Col size={5} >
                                <TouchableOpacity style={{backgroundColor:'#fff'}}>
                    <Text style={{ color: '#ff4e42', fontSize:20, margin:10,marginLeft:25}}><Icon name='ios-trash' style={{ color: '#ff4e42', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin:10 }} /> Remove All</Text>
                    </TouchableOpacity>
                    </Col>
                    <Col size={5} style={{backgroundColor:'#5FB404'}}>
                    <TouchableOpacity  style={{backgroundColor:'#5FB404'}}>
                    <Text style={{ color: '#fff', fontSize:20, marginLeft:40, margin:10}}><Icon name='ios-cart' style={{ color: '#fff', fontSize: 20, marginLeft: -2.5, paddingTop: 2.3, margin:10 }} /> Buy Now</Text>
                    </TouchableOpacity>
                    </Col>
                    </Row>
                    </View> */}


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