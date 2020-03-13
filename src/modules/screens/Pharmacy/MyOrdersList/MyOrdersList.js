import React, { Component } from 'react';
import {
    Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon,
    Footer, FooterTab, Picker, Segment, CheckBox, View, Spinner, Badge
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';
import { formatDate } from '../../../../setup/helpers';

class MyOrdersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            orderList: [],
            orderId: '',
            isLoading: true
        }
    }
    componentDidMount() {
        this.medicineOrderList();
    }

    async medicineOrderList() {
        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderList(userId);
            if (result.success) {
                this.setState({ orderList: result.data });
            }
        }
        catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    calcTotalAmount(data) {
        let temp = 0;
        data.forEach(element => {
            temp += (element.quantity * element.price)
        })
        return temp;
    }

    renderNoOrders() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>No orders yet</Text>
            </View>
        )
    }

    renderOrders() {
        const { isLoading, orderList } = this.state;
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
                                <FlatList
                                    data={orderList}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity testID="orderDetailsNavigation" onPress={() => this.props.navigation.navigate('OrderDetails', { orderDetails: item })}>
                                            <Card style={{ marginTop: 10, padding: 5, height: 155, borderRadius: 5 }}>
                                                <Grid>
                                                    <Row>
                                                        <Right><Text style={{
                                                            fontFamily: 'OpenSans', fontSize: 16, color: '#e84393', marginRight: 10,
                                                            fontWeight: 'bold'
                                                        }}>{formatDate(item.order_date, "dddd, MMMM DD-YYYY, hh:mm a")}</Text></Right>
                                                    </Row>
                                                    <View style={{ marginLeft: 10, marginTop: 20, flexDirection: 'row' }}>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold', color: '#3966c6' }}>Order Id </Text>
                                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginLeft: 48, fontWeight: 'bold' }}>:  {item._id} </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>No of Medicine </Text>
                                                        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10, fontWeight: 'bold' }}>:  {item.order_items.length} </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Total </Text>
                                                        <Text style={styles.subText}>:{'  '}{'\u20B9'}{this.calcTotalAmount(item.order_items)}</Text>
                                                    </View>
                                                </Grid>
                                            </Card>
                                        </TouchableOpacity>
                                    } />
                            </View>
                        </Card>
                    </Content>}

            </Container >
        )
    }

    render() {
        const List=[{Orderid:'2020735588',content:'Horlicks Health and Nutrician Drink Classic Malt( x 1 ), Fluticasone and salmeterol( x 3 ), LA Shield Sunscreen Gel SPF 40 ( x 1 ).',date:'3rd march, 2020',price:' ₹ 790.00',greendel:'Arrving on Today'}]
        const Order=[{Ordersid:'2020735589',content:'Horlicks Health and Nutrician Drink Classic Malt( x 1 ), Fluticasone and salmeterol( x 3 ), LA Shield Sunscreen Gel SPF 40 ( x 1 ).',dates:'4th march, 2020.',price:'₹ 790.00',reddel:'Delivery on 6th march 2020.'},
        {Ordersid:'2020735590',content:'Horlicks Health and Nutrician Drink Classic Malt( x 1 ), Fluticasone and salmeterol( x 3 ), LA Shield Sunscreen Gel SPF 40 ( x 1 ).',dates:'4th march, 2020.',price:'₹ 790.00',reddel:'Delivery on 6th march 2020.'},
        {Ordersid:'2020735591',content:'Horlicks Health and Nutrician Drink Classic Malt( x 1 ), Fluticasone and salmeterol( x 3 ), LA Shield Sunscreen Gel SPF 40 ( x 1 ).',dates:'5th march, 2020.',price:'₹ 790.00',reddel:'Delivery on 7th march 2020.'},
        {Ordersid:'2020735592',content:'Horlicks Health and Nutrician Drink Classic Malt( x 1 ), Fluticasone and salmeterol( x 3 ), LA Shield Sunscreen Gel SPF 40 ( x 1 ).',dates:'5th march, 2020.',price:'₹ 790.00',reddel:'Delivery on 7th march 2020.'}]
        return (
            <Container style={{ backgroundColor: '#E6E6E6' }}>
                <Content>
                <FlatList 
                data={List}
                    renderItem={({item})=>
                    <View style={{ margin: 5, backgroundColor: '#fff', marginLeft:10, marginRight:10}}>
                        <Row style={{ marginBottom: -5 }}>
                            <Col>
                                <Text style={styles.Head}>Order Id</Text>
                            </Col>
                            <Col>
                                <Text style={{ fontSize: 10, textAlign: 'right', margin: 10, fontFamily: 'OpenSans' }}>{item.Orderid}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.Row} />
                        <Row>
                            <Text style={{ fontSize: 10, margin: 10, fontFamily: 'OpenSans' }}>{item.content}</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Text style={styles.Head}>Ordered On</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Text style={styles.orderprice}>{item.date}</Text>
                        </Row>
                        <Row style={{marginBottom:-15, marginTop:-5}}>    
                            <Col>                  
                            <Row style={{ marginTop: -5}}>
                            <Text style={styles.Head}>Total price</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Col size={5}>
                            <Text style={styles.orderprice}>{item.price}</Text>
                            </Col>
                            <Col size={5} style={{ marginRight: -5, marginTop: -7.5 }}>
                                <TouchableOpacity style={{ borderRadius: 2.5, paddingBottom: -5, paddingTop: 2, marginBottom: 20, borderWidth: 1, borderColor: '#8dc63f', width: 85, height: 17.5, marginLeft: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 7.5, color: '#8dc63f', marginTop:0.5}}>Track Order</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        </Col>  
                        </Row>

                        <Row style={styles.Row}/>
                        <Row style={{marginBottom: -12.5}}>
                            <Col size={7}>
                                <Text style={{fontSize: 11, margin: 10, color: '#8dc63f', fontFamily: 'OpenSans', fontWeight:'500'}}>{item.greendel}</Text>
                            </Col>
                            <Col size={3} style={{ marginRight: 10, marginTop: 10 }}>
                                <TouchableOpacity style={styles.Touch}>
                                    <Text style={styles.Buynow}><Icon name='ios-cart' style={styles.cart} />  Buy Again</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View> }/>



                    <FlatList 
                data={Order}
                    renderItem={({item})=>
                    <View style={{ margin: 5, backgroundColor: '#fff',  marginLeft:10, marginRight:10}}>
                        <Row style={{ marginBottom: -5 }}>
                            <Col>
                                <Text style={styles.Head}>Order Id</Text>
                            </Col>
                            <Col>
                                <Text style={{ fontSize: 10,  textAlign: 'right', margin: 10, fontFamily: 'OpenSans' }}>{item.Ordersid}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.Row}/>
                        <Row>
                        <Text style={{ fontSize: 10,  margin: 10, fontFamily: 'OpenSans' }}>{item.content}</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Text style={styles.Head}>Ordered On</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                        <Text style={styles.orderprice}>{item.dates}</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Text style={styles.Head}>Total price</Text>
                        </Row>
                        <Row style={{ marginTop: -10 }}>
                            <Col size={5}>
                            <Text style={styles.orderprice}>{item.price}</Text>
                            </Col>
                        </Row>
                        <Row style={styles.Row}/>
                        <Row style={{marginBottom:-12.5}}>
                            <Col size={7} >
                                <Text style={{fontSize: 11, margin: 10, color: '#ff4e42', fontFamily: 'OpenSans', fontWeight:'500'}}>{item.reddel}</Text>
                            </Col>
                            <Col size={3} style={{ marginLeft:-10 , marginTop: 10 }}>
                            <TouchableOpacity style={styles.Touch}>
                                    <Text style={styles.Buynow}><Icon name='ios-cart' style={styles.cart} />  Buy Again</Text>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View> }/> 
                    {/* <Content contentContainerStyle={styles.BodyContent}>
                   {this.state.isLoading ? <Spinner color='blue' /> :
                        <View  style={{justifyContent: "center", alignItems: "center" }}>
                            {this.state.orderList.length !== 0 ? this.renderOrders() : this.renderNoOrders()}
                        </View>}
                </Content> */}       
                       
                </Content>
            </Container>
        )
    }
}

export default MyOrdersList
const styles = StyleSheet.create({
    BodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    Row: {
        borderWidth: 0.5, 
        borderColor: '#E6E6E6', 
        margin: 2.5, 
        marginTop:5, 
        marginBottom:-1.5, 
        marginLeft: 10, 
        marginRight: 10
    },

    Buynow: {
        fontFamily: 'OpenSans', 
        fontSize: 7.5, 
        color: '#fff', 
        marginTop: 2, 
        fontWeight: '500', 
        fontFamily: 'OpenSans', 
        marginRight: 10, 
        marginLeft: 10, 
        marginBottom: 14, 
        textAlign: 'center' 
    },

    cart:  {
        color: '#fff', 
        fontSize: 9.5, 
        marginLeft: 1.5
    },

    Touch: {
        backgroundColor: '#4e85e9', 
        borderRadius: 2.5, 
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: '#4e85e9', 
        width: 85, 
        height: 17.5, 
        marginLeft: -5
    },

    Head: {
        fontSize: 10,
        margin: 10,
        color: '#775DA3',
        fontFamily: 'OpenSans',
        fontWeight: '500'
    },
    customImage: {
        height: 50,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    orderprice: { 
        fontSize: 11, 
        textAlign: 'left',
        fontFamily: 'OpenSans', 
        marginLeft: 10,
        marginBottom:5
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
