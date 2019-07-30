import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';

class MedicineMyOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            orderList:[],
          //  isLoading: false
        }
    }
    componentDidMount() {
        this.getAddToCart();
         this.medicineOrderList();
    }
    async medicineOrderList(){    
        try {
           let userId='5d2420a2731df239784cd001';
           // let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderList(userId);
            console.log('result' + JSON.stringify(result));
            this.setState({ orderList: result.data})
            }
        catch (e) {
            console.log(e);
        }        
    }
 
    setAddToCart = async () => {
        const cart = [
            {
                medicineName: 'Dolo650',
                price: 100,
                offerPercentage: 20,
                quantity: 5
            },
            {
                medicineName: 'Antibiotic',
                price: 100,
                offerPercentage: 50,
                quantity: 1
            },
            {
                medicineName: 'Dextromethorphan',
                price: 10,
                offerPercentage: 10,
                quantity: 1
            },
            {
                medicineName: 'Amoxicillin',
                price: 50,
                offerPercentage: 50,
                quantity: 1
            }
        ]
        await AsyncStorage.setItem('cartItems', JSON.stringify(cart))
        this.setState({ cartItems: (cart) });
    }

    getAddToCart = async () => {
        try {
            this.setState({ isLoading: true })
            this.setAddToCart()
            this.setState({ isLoading: false })
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
        const { isLoading, cartItems } = this.state;

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
                                padding: 5, borderRadius: 10, borderColor: '#8e44ad', borderWidth: 2,
                            }}>


                                <Row style={{ marginTop: 20, }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, marginLeft: 10, color: '#0a3d62', fontWeight: 'bold' }}>Order List: 1</Text>
                                    <Right><Text style={{ fontFamily: 'OpenSans', fontSize: 18, color: '#0a3d62', marginRight: 10, fontWeight: 'bold' }}>23-7-2019</Text></Right>
                                </Row>


                                {cartItems == '' ?
                                    <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                        <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No Medicines Are Found Your Cart</Text>
                                    </Item> :
                                    <FlatList
                                        data={cartItems}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>

                                            <View style={{ marginTop: 10, padding: 5, height: 160, borderTopColor: '#000', borderTopWidth: 1 }}>
                                                <Grid>

                                                    <View style={{ flexDirection: 'column' }}>
                                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hoBS1Om5R7srf1jULEdImPjOS1gdCSTMUFgccbOfymosJAwP' }} style={{
                                                            width: 110, height: 110, borderRadius: 10, marginTop: 20
                                                        }} />


                                                    </View>
                                                    <View>
                                                        <View style={{ marginLeft: 20, marginTop: 15 }}>
                                                            <Text style={styles.labelTop}>{item.medicineName} </Text>
                                                            <Text style={styles.textDesc}>Dolo 650 MG Tablet is used to tempo-rarily relieve </Text>


                                                        </View>
                                                        <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', marginTop: 10 }}>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Pharmacy :</Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>Apollo Pharmacy</Text>

                                                        </View>
                                                        <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', marginTop: 5 }}>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Quantity :</Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>10</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', marginLeft: 20, color: '#3966c6' }}>Total :</Text>
                                                            <Text style={styles.subText}>{'\u20B9'}{this.medicineOffer(item)}</Text>

                                                        </View>
                                                    </View>
                                                </Grid>
                                            </View>

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


export default MedicineMyOrderList


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
        marginLeft: 10,
        fontWeight: "bold"
    }



});