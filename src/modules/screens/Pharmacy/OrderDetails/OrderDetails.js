import React, { Component } from 'react';
import {
    Container, Content, Text, Title, Header, Form, Textarea,
    Button, H3, Item, List, ListItem, Card, Input, Left, Right,
    Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge, Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { formatDate } from '../../../../setup/helpers';
import { getMedicineOrderDetails } from '../../../providers/pharmacy/pharmacy.action';

class OrderDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId: '',
            myOrderList: [],
            isLoading: true,
        }
    }
    // async componentDidMount() {
    //     const { navigation } = this.props;
    //     await this.setState({ myOrderList: navigation.getParam('orderDetails'), isLoading: false })
       
    // }

    componentDidMount() {
        this.medicineOrderDetails();
    }

    async medicineOrderDetails() {
        try {
            this.setState({ isLoading: true });
            let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderDetails("5e68adbb30a7db0ee1f5f2c2" , userId);
            // console.log("result+++++++++++++++++"+JSON.stringify(result))
            if (result.success) {
                this.setState({ myOrderList: result.data[0] });
                // console.log("baluuuorderList+++++++++++++++++"+JSON.stringify(this.state.myOrderList))
  
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
    render() {
        const { navigation } = this.props;
        const { isLoading, myOrderList } = this.state;
        const MedDetail = [{ medname: 'Horlicks Health and Nutrician Drink Classic Malt (x 1)', pharname: 'By Apollo Pharmacy', amount: '₹ 180.00' },
        { medname: 'Horlicks Health and Nutrician Drink Classic Malt (x 1)', pharname: 'By Apollo Pharmacy', amount: '₹ 180.00' },
        { medname: 'Horlicks Health and Nutrician Drink Classic Malt (x 1)', pharname: 'By Apollo Pharmacy', amount: '₹ 180.00' }]
        return (
            <Container style={styles.container}>
                <Content style={{ backgroundColor: '#F5F5F5', padding: 10 }}>
                    <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                        <Row>
                            <Col size={5}>
                                <Text style={styles.orderIdText}>Order Id</Text>
                            </Col>
                            <Col size={5}>
                                <Text style={{ fontSize: 12, textAlign: 'right', marginTop: 13, fontFamily: 'OpenSans' }}>2020729443</Text>
                            </Col>
                        </Row>
                    </View>
                    <View style={{ backgroundColor: '#fff', padding: 10, }}>
                        <Text style={styles.arrHeadText}>Arriving On Today</Text>
                        {/* Delivery date display  */}
                        {/* <Text style={styles.delHeadText}>Delivery On 29th February,2020</Text> */}

                        <FlatList
                            style={{ marginTop: 10 }}
                            data={[{ status: 'Ordered and Approved', checked: true, drawLine: true },
                            { status: 'Packed and Out for Delivery', checked: true, drawLine: true },
                            { status: 'Delivered', checked: false },]}
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

                        <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'OpenSans', color: '#7F49C3', marginTop: 10 }}> Ordered Medicines</Text>
                        <FlatList
                            data={myOrderList.order_items}
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
                                    <Col size={8} style={styles.nameText}>
                                        <Text style={styles.nameText}>{item.medicine_name}</Text>
                                        <Text style={styles.pharText}>{item.pharname}</Text>
                                        <Text style={styles.amountText}>₹{item.final_price}</Text>
                                    </Col>
                                </Row>
                            } />
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.ItemText}>Item Total</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ 540.00</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.mainText}>Delivery Charges</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ 50.00</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.mainText}>Tax</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.rsText}>₹ 50.00</Text>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col size={5}>
                                <Text style={styles.grandTotalText}>Grand Total</Text>

                            </Col>
                            <Col size={5}>
                                <Text style={styles.totalsText}>₹ 640.00</Text>
                            </Col>
                        </Row>
                    </View>

                    <View style={styles.mainView}>
                        <Text style={styles.orderText}>OrderDetails</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Payment</Text>
                            <Text style={styles.rightText}>Cash on Delivery</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.innerText}>Ordered On</Text>
                        <Text style={styles.rightText}>{formatDate(myOrderList.created_date,'Do MMM,YYYY')}</Text>
                        </View>
                        <View style={{ marginTop: 10, paddingBottom: 10 }}>
                            <Text style={styles.innerText}>Customer Details</Text>
                            <Text style={styles.nameTextss}>S.Mukesh Kannan</Text>          
                          <Text style={styles.addressText}>{this.getAddress(myOrderList)}</Text>
                            <Text style={styles.addressText}>Mobile - 8989567891</Text>

                        </View>

                    </View>

                </Content>





















                {/* {isLoading == true ? <Spinner color='blue' /> :
                    <Content style={styles.bodyContent}>
                   <Grid style={styles.curvedGrid}>
                    </Grid>
                        <Card transparent >
                        <Grid style={{ marginTop: -100, height: 100 }}>
                                <Row style={{ justifyContent: 'center', width: '100%', marginTop: 30 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 22, padding: 5,color:'#fff' }}>Your Order</Text>
                                </Row>
                            </Grid>
                            {myOrderList===undefined? this.noOrders():
                                                
                            <View style={{padding: 5, borderRadius: 10, borderColor: '#8e44ad', borderWidth:2}}>
                                           
                                <Row style={{ marginTop: 20 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 14, marginLeft: 10, color: '#0a3d62', fontWeight: 'bold',width:'70%' }}>OrderNo:{myOrderList._id}</Text>
                                    <Right><Text style={{ fontFamily: 'OpenSans', fontSize: 14, color: '#0a3d62', marginRight: 10, fontWeight: 'bold' }}>{formatDate(myOrderList.order_date,"DD-MM-YYYY")}</Text></Right>
                                </Row>

                                <FlatList
                                        data={myOrderList.order_items}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) =>
                        <TouchableOpacity testID="medicineOrderNavigation" 
                        onPress={()=>this.props.navigation.navigate('OrderMedicineDetails')}>

                                            <View style={{ marginTop: 10, padding: 5, height: 160, borderTopColor: '#000', borderTopWidth: 1 }}>
                                                <Grid>

                                                    <View style={{ flexDirection: 'column' }}>
                                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hoBS1Om5R7srf1jULEdImPjOS1gdCSTMUFgccbOfymosJAwP' }} style={{
                                                            width: 110, height: 110, borderRadius: 10, marginTop: 20
                                                        }} />


                                                    </View>
                                                    <View>
                                                        <View style={{ marginLeft: 20, marginTop: 20}}>
                                                            <Text style={styles.labelTop}>{item.medicine_name} </Text>
                                                        </View>
                                                        <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', marginTop: 25 }}>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Pharmacy :</Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>{item.pharmacyInfo.name}</Text>

                                                        </View>
                                                        <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', marginTop: 5 }}>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Quantity :</Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>{item.quantity}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', marginLeft: 20, color: '#3966c6' }}>Amount :</Text>
                                                            <Text style={styles.subText}>{'\u20B9'}{item.price}</Text>

                                                        </View>
                                                    </View>
                                                </Grid>
                                            </View>
                                            </TouchableOpacity> 
                                        } />                               
                                    </View>
                            }
                                
                        </Card>             
                    </Content>} */}
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
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: '500',
        color: '#4c4c4c'
    },
    pharText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#909090'
    },
    amountText: {
        fontFamily: 'OpenSans',
        fontSize: 12,
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
