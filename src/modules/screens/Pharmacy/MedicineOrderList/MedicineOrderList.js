import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';

class MedicineMyOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            orderList:[]
           // isLoading: false
        }

    }

    componentDidMount() {

        this.getAddToCart();
        this.medicineOrderList();
    }

    async medicineOrderList(){    
        try {
        //    let userId='5d2420a2731df239784cd001';
           let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderList(userId);
           // let array=[];
            //rray.push(JSON.stringify(result.data.order_items));
            console.log('success' + JSON.stringify(result.data));
            this.setState({ orderList: result.data})
            }
        catch (e) {
            console.log(e);
        }        
    }

    getAddToCart = async () => {
        try {
         //   this.setState({ isLoading: true })
            this.setAddToCart()
         //  this.setState({ isLoading: false })
            // const cartItems = await AsyncStorage.getItem('cartItems');
            // if( cartItems === undefined){
            //     this.setState({ cartItems: [], isLoading: false });
            // }else{       
            //     this.setState({ cartItems: JSON.parse(cartItems), isLoading: false });
            // }
        }
        catch (e) {
            console.log(e);
        }
    }


    increase(index) {
        let selectedCartItem = this.state.cartItems;
        selectedCartItem[index].quantity++;
        this.setState({ cartItems: selectedCartItem })
        AsyncStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))

    }

    decrease(index) {
        let selectedCartItem = this.state.cartItems;
        if (selectedCartItem[index].quantity > 1) {
            selectedCartItem[index].quantity--;
            this.setState({ cartItems: selectedCartItem })
            AsyncStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))
        }
    }

    medicineOffer(item) {

        return parseInt(item.price) - ((parseInt(item.offerPercentage) / 100) * parseInt(item.price));
    }

    removeMedicine(index) {
        let data = this.state.cartItems;
        data.splice(index, 1);
        this.setState({ cartItems: data });
        AsyncStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))
    }

    totalPrice() {
        let total = 0;
        if (this.state.cartItems) {
            this.state.cartItems.forEach(element => {
                total = total + ((parseInt(element.price) - (parseInt(element.offerPercentage) / 100) * parseInt(element.price)) * parseInt(element.quantity))
            })
            return total;
        }
    }


    render() {
        const { isLoading, cartItems , orderList} = this.state;

        return (
            <Container style={styles.container}>

                {isLoading == true ? <Loader style='list' /> :

                    <Content style={styles.bodyContent}>



                        <Card transparent >
                            <Grid >
                                <Row style={{ justifyContent: 'center', width: '100%', marginTop: 30 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 22, padding: 5 }}>Your Order</Text>
                                </Row>
                            </Grid>

                            <View style={{
                                padding: 5, marginTop: 20
                            }}>



                                {orderList == '' ?
                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                        <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No Medicines Are Found Your Cart</Text>
                                    </Item> :
                                    <FlatList
                                        data={orderList}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>

                                            <Card style={{ marginTop: 10, padding: 5, height: 155, borderRadius: 5 }}>
                                                <Grid>
                                                    <Row>
                                                        <Right><Text style={{
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 16, color: '#e84393', marginRight: 10, fontWeight: 'bold'
                                                        }}>Friday, July 26-2019 11:25 am</Text></Right>
                                                    </Row>


                                                    <View style={{ marginLeft: 10, marginTop: 20, flexDirection: 'row' }}>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold', color: '#3966c6' }}>Order Id </Text>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginLeft: 48, fontWeight: 'bold' }}>:  {this.state.orderList.user_id} </Text>

                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6', }}>Pharmacy </Text>
                                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 42, fontWeight: 'bold' }}> : {this.state.orderList.medicine_name} </Text>
                                                    </View>


                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>

                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>No of Medicine </Text>
                                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10, fontWeight: 'bold' }}>:  10</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>

                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Medicine Name </Text>
                                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10, fontWeight: 'bold' }}>: Alkof </Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Total </Text>
                                                        <Text style={styles.subText}>:{'  '}{'\u20B9'}{this.medicineOffer(item)}</Text>

                                                    </View>

                                                </Grid>
                                            </Card>

                                        } />
                                }
                            </View>
                        </Card>

                    </Content>}

                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Total </Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:' + this.totalPrice()}</Text>
                    </Row>
                    <Col >
                        <Button style={{ backgroundColor: '#5cb75d', borderRadius: 10, padding: 10, marginTop: 10, marginLeft: 40, height: 35 }} onPress={() => this.props.navigation.navigate('MedicineCheckout')}>
                            <Text>Checkout</Text>
                        </Button>
                    </Col>
                </Footer>
            </Container >
        )
    }
}


export default MedicineMyOrders


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

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


    curvedGrid: {
        borderRadius: 800,
        width: '200%',
        height: 690,
        marginLeft: -200,
        marginTop: -600,
        position: 'relative',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#745DA6'
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
        fontWeight: 'bold'
    },

    textDesc:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        width: '80%'
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
        marginLeft: 79,
        fontWeight: "bold"
    }



});
