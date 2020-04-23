import React, { Component } from 'react';
import {
    Container, Content, Text, Icon, View
} from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';
import { formatDate } from '../../../../setup/helpers';
import Spinner from '../../../../components/Spinner';

class MyOrdersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: true,
        }
    }
    componentDidMount() {
        this.getMedicineOrderList();
    }

    getFinalPriceOfOrder(orderItems) {
        let finalPriceForOrder = 0;
        orderItems.forEach(element => {
            finalPriceForOrder += element.final_price;
        });
        return finalPriceForOrder;
    }
    renderNoOrders() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>No orders yet</Text>
            </View>
        )
    }

    getMedicineOrderList = async () => {
        try {
            this.setState({ isLoading: true })
            let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderList(userId);
            this.setState({ isLoading: false });
            if (result.success) {
                this.setState({ data: result.data })
            }
        } catch (e) {
            console.log(e);
            this.setState({ isLoading: false });
        }
    }


    render() {
        const { data, isLoading } = this.state;
        console.log(isLoading);
        return (
            <Container style={{ backgroundColor: '#E6E6E6', flex: 1 }}>
                <Content style={{ flex: 1 }}>
                    <Spinner
                        visible={isLoading}
                    />
                    <FlatList data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, key }) =>
                            <TouchableOpacity
                                testID="orderDetailsNavigation"
                                onPress={() => this.props.navigation.navigate('OrderDetails', { serviceId: item._id })}>
                                <View style={{ margin: 5, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                                    <View>
                                        <Row style={{ marginBottom: -5 }}>
                                            <Col>
                                                <Text style={styles.Head}>Order Id</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontSize: 10, textAlign: 'right', margin: 10, fontFamily: 'OpenSans' }}>{item.order_ref_no || ''}</Text>
                                            </Col>
                                        </Row>
                                        <Row style={styles.Row} />
                                        <Row>
                                            <Text style={{ fontSize: 10, margin: 10, fontFamily: 'OpenSans' }}>{item.description}</Text>
                                        </Row>
                                        <Row style={{ marginTop: -10 }}>
                                            <Text style={styles.Head}>Ordered On</Text>
                                        </Row>
                                        <Row style={{ marginTop: -10 }}>
                                            <Text style={styles.orderprice}>{formatDate(item.created_date, 'DD MMMM,YYYY')}</Text>
                                        </Row>
                                        <Row style={{ marginBottom: -15, marginTop: -5 }}>
                                            <Col>
                                                <Row style={{ marginTop: -5 }}>
                                                    <Text style={styles.Head}>Total price</Text>
                                                </Row>
                                                <Row style={{ marginBottom: 7.5, marginTop: -10 }}>
                                                    <Col size={5}>
                                                        <Text style={styles.orderprice}>₹ {this.getFinalPriceOfOrder(item.order_items || [])}</Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 7.5 }}>
                                            <Row style={styles.Row} />
                                        </Row>

                                    </View>

                                    <Row style={{ marginBottom: -12.5 }}>
                                        <Col size={7}>
                                            {item.status == "PENDING" ?
                                                <Text style={styles.buytext}>Arrving on 24 Hours</Text> :
                                                null}
                                            {item.status == "IN PROGRESS" ?
                                                <Text style={styles.buytext}>Arrving on Today</Text> :
                                                null}
                                            {item.status == "COMPLETED" ?
                                                <Text style={{ marginBottom: 25, fontSize: 11, marginTop: 10, margin: 10, color: '#ff4e42', fontFamily: 'OpenSans', fontWeight: '500' }}>Deliveried on </Text> :
                                                null}
                                        </Col>
                                        {item.status == "COMPLETED" ?
                                            <Col size={3} style={{ marginRight: 10, marginTop: 10 }}>
                                                <TouchableOpacity style={styles.Touch} onPress={() => { this.props.navigation.navigate("medicineSearchList") }}>
                                                    <Text style={styles.Buynow}><Icon name='ios-cart' style={styles.cart} />  Buy Again</Text>
                                                </TouchableOpacity>
                                            </Col> :
                                            null}
                                    </Row>
                                </View>
                            </TouchableOpacity>
                        } />




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
        marginTop: 5,
        marginBottom: -1.5,
        marginLeft: 10,
        marginRight: 10
    },

    buytext: {
        marginBottom: 25,
        fontSize: 11,
        marginTop: 10,
        margin: 10,
        color: '#8dc63f',
        fontFamily: 'OpenSans',
        fontWeight: '500'
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

    cart: {
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
        marginBottom: 5
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
