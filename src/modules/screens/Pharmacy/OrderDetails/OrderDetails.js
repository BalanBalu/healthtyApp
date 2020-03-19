import React, { Component } from 'react';
import {
    Container, Content, Text, Item, View,
} from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import { formatDate } from '../../../../setup/helpers';
import { getMedicineOrderDetails } from '../../../providers/pharmacy/pharmacy.action';
import { getPaymentInfomation } from '../../../providers/bookappointment/bookappointment.action'
import Spinner from '../../../../components/Spinner';

/*
  TODO: 
    1. Need to make the Arriving on Draw Line Dynamically

*/

class OrderDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId: '',
            myOrderList: [],
            orderList:[],
            paymentDetails: {},
            isLoading: true,
        }
    }
    async componentDidMount() {
        const { navigation } = this.props;
        await this.setState({ orderList: navigation.getParam('orderDetails'), isLoading: false })
        this.medicineOrderDetails();
    }

    

    async medicineOrderDetails() {
        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let orderId = this.state.orderList._id
            let result = await getMedicineOrderDetails(orderId , userId);
            if (result.success) {
                this.setState({ myOrderList: result.data[0] });
                this.getPaymentInfo(result.data[0].payment_id)
            }
        }
        catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    }


    noOrders() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Orders Available </Text>
            </Item>
        )
    }

    getAddress(address) {
        if (address.pickup_or_delivery_address) {
            let temp = address.pickup_or_delivery_address.address;
            return `${ temp.no_and_street || '' },${temp.address_line_1 || ''},${temp.district || ''},${temp.city || ''},${temp.state || ''},${temp.country || ''},${temp.pin_code || ''}`
        } else {
            return null
        }
      }
    getName(name) {
      if (name.pickup_or_delivery_address) {
        let temp = name.pickup_or_delivery_address;
        return `${ temp.full_name || '' }`
      } else {
        return null
      }
    }
    getMobile(number){
      if (number.pickup_or_delivery_address) {
        let temp = number.pickup_or_delivery_address;
        return `${ temp.mobile_number || '' }`
      } else {
        return null
      }
    }

    getFinalPriceOfOrder(orderItems) {
        let finalPriceForOrder = 0;
        orderItems.forEach(element => {
            finalPriceForOrder += element.final_price;
        });
        return finalPriceForOrder;
    }
    getGrandTotal(orderInfo) {
        const itemTotal = this.getFinalPriceOfOrder( orderInfo.order_items || []);
        const deliveryCharge = orderInfo.delivery_charges;
        const deliveryTax = orderInfo.delivery_tax
        let totalAmount = Number(Number(itemTotal) + Number(deliveryCharge || 0) + Number(deliveryTax || 0)).toFixed(2)
        return `${totalAmount || ''}`
    }
    getPaymentInfo = async (paymentId) => {
        try {
          let result = await getPaymentInfomation(paymentId);
         
          if (result.success) {
            this.setState({ paymentDetails: result.data[0] })
          }
        }
        catch (e) {
          console.log(e)
        }
    }

    render() {
        const { navigation } = this.props;
        const { isLoading, myOrderList, paymentDetails, orderList } = this.state;
        return (
            <Container style={styles.container}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
               
                    <Spinner
                        visible={isLoading}
                    />
                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <Row>
                            <Col size={5}>
                                <Text style={styles.orderIdText}>Order Id</Text>
                            </Col>
                            <Col size={5}>
                                <Text style={{ fontSize: 12, textAlign: 'right', marginTop: 13, fontFamily: 'OpenSans' }}>{orderList._id || ''}</Text>
                            </Col>
                        </Row>
                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 10, }}>
                        <Text style={styles.arrHeadText}>Arriving On Today</Text>
                        
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={[{ status: 'Ordered and Approved', checked: true, drawLine: true },
                            { status: 'Packed and Out for Delivery', checked: true, drawLine: true },
                            { status: 'Delivered', checked: false },]}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <Row style={{}}>
                                    <Col size={0.7}>
                                        {item.checked === true ?
                                            <TouchableOpacity style={styles.lengthTouch}>
                                            </TouchableOpacity> : null}

                                        {item.checked === false ?
                                            <TouchableOpacity style={styles.bottomText}>
                                            </TouchableOpacity> :
                                            null}

                                        {item.checked === true && item.drawLine === true ?
                                            <TouchableOpacity style={styles.TouchLegth}>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={{
                                                height: 60,
                                                padding: 1,
                                                width: 4,
                                                marginLeft: 4
                                            }}>
                                            </TouchableOpacity>}
                                    </Col>
                                    <Col size={9.3}>
                                        <View style={{ marginTop: -3 }}>
                                            <Text style={styles.trackingText}>{item.status}</Text>
                                            <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: '#909090' }}>17th February,2020 at 05.27 PM</Text>
                                        </View>

                                    </Col>
                                </Row>
                            } />


                        <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}>Ordered Medicines</Text>
                        <FlatList
                            data={myOrderList.order_items}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={myOrderList.order_items}
                            renderItem={({ item }) =>
                                <Row style={styles.rowStyle}>
                                    <Col size={2}>
                                        <Image
                                            source={require('../../../../../assets/images/images.jpeg')}
                                            style={{
                                                width: 60, height: 60, alignItems: 'center'
                                            }}
                                        />
                                    </Col>
                                    <Col size={8} style={[styles.nameText, { marginTop: 5}]}>
                                        <Text style={styles.nameText}>{item.medicine_name}</Text>
                                        <Text style={styles.pharText}>{item.pharmacyInfo.name}</Text>
                                    </Col>
                                    <Col size={2} style={[styles.nameText, { alignSelf: 'flex-end' }]}>
                                        <Text style={styles.amountText}>₹{item.final_price}</Text>
                                    </Col>
                                </Row>
                            } />
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.ItemText}>Item Total</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ {this.getFinalPriceOfOrder(myOrderList.order_items || [])}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.mainText}>Delivery Charges</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ {myOrderList.delivery_charges || 0}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.mainText}>Tax</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ {myOrderList.delivery_tax || 0}</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.grandTotalText}>Grand Total</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.totalsText}>₹ {this.getGrandTotal(myOrderList)}</Text>
                            </Col>
                        </Row>
                    </View>

                    <View style={styles.mainView}>
                        <Text style={styles.orderText}>OrderDetails</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Payment</Text>
                            <Text style={styles.rightText}>{paymentDetails.payment_method || 0 }</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Ordered On</Text>
                        <Text style={styles.rightText}>{formatDate(myOrderList.created_date,'Do MMM,YYYY')}</Text>
                        </View>
                        <View style={{ marginTop: 10, paddingBottom: 10 }}>
                            <Text style={styles.innerText}>Customer Details</Text>
                        <Text style={styles.nameTextss}>{this.getName(myOrderList)}</Text>          
                          <Text style={styles.addressText}>{this.getAddress(myOrderList)}</Text>
                        <Text style={styles.addressText}>Mobile - {this.getMobile(myOrderList)}</Text>

                        </View>

                    </View>
                </Content>
            </Container>
        )
    }
}


export default OrderDetails
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

    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: '#c26c57',
        marginLeft: 10,
        fontWeight: "bold"
    },
    delHeadText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: '500',
        color: '#ff4e42'
    },
    arrHeadText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        fontWeight: '500',
        color: '#8dc63f'
    },
    rowStyle: {
        marginTop: 15,
        paddingBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.3
    },
    nameText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 14,
        fontWeight: '500',
        color: '#4c4c4c'
    },
    pharText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#909090',
        marginTop: 3
    },
    amountText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#8dc63f',
        textAlign: 'right'
    },
    ItemText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    rsText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        textAlign: 'right'
    },
    mainText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#909090'
    },
    grandTotalText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    totalsText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#8dc63f',
        textAlign: 'right'
    },
    mainView: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 5,
    },
    orderText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: '500',
        color: '#4c4c4c'
    },
    innerText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#7F49C3'
    },
    rightText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c'

    },
    addressText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        marginTop: 5
    },
    nameTextss: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c',
        fontWeight: '500',
        marginTop: 5
    },
    lengthTouch: {
        height: 12,
        width: 12,
        borderRadius: 12 / 2,
        backgroundColor: '#7F49C3'
    },
    TouchLegth: {
        height: 60,
        backgroundColor: '#7F49C3',
        padding: 1,
        width: 4,
        marginLeft: 4
    },
    bottomText: {
        height: 12,
        width: 12,
        borderRadius: 12 / 2,
        borderColor: 'gray',
        borderWidth: 0.3
    },
    trackingText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'OpenSans',
        color: '#4c4c4c'
    },
    orderIdText: {
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'OpenSans',
        color: '#7F49C3', marginTop: 8
    }
});
