import React, { Component } from 'react';
import {
    Container, Content, Text, Icon, View, Card, Thumbnail, Item, Button, Footer
} from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { StyleSheet, AsyncStorage, FlatList, TouchableOpacity, Platform, ScrollView,ActivityIndicator } from 'react-native';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';
import { formatDate } from '../../../../setup/helpers';
import { statusBar } from '../CommomPharmacy'
import Spinner from '../../../../components/Spinner';
import noAppointmentImage from "../../../../../assets/images/noappointment.png";

class MyOrdersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isLoading: true,
            pagination: 0,
            
            footerLoading: false
        }
        this.onEndReachedCalledDuringMomentum = true;
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let result = await this.getMedicineOrderList();
        if (result.success) {
            this.setState({ isLoading: false });
        }
    }

    getFinalPriceOfOrder(orderItems, data) {
        let finalPriceForOrder = 0;
        if (data.is_order_type_recommentation === true) {
            orderItems.forEach(element => {
                finalPriceForOrder += Number(element.medicine_recommentation_max_price);
            });
        } else {
            orderItems.forEach(element => {
                finalPriceForOrder += element.final_price;
            });
        }
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

            let userId = await AsyncStorage.getItem('userId');
            let result = await getMedicineOrderList(userId, this.state.pagination);



            if (result) {

                let data = this.state.data;
                let temp = data.concat(result);
                
                this.setState({ data: temp })
            }
            return {
                success: true
            }
        } catch (e) {
            console.log(e);
            this.setState({ isLoading: false });
        }
    }
    handleLoadMore = async () => {
        if(!this.onEndReachedCalledDuringMomentum) {
        
        this.onEndReachedCalledDuringMomentum = true;
        this.setState({ pagination: this.state.pagination + 1, footerLoading: true });
        let result = await this.getMedicineOrderList()
         this.setState({ footerLoading: false })
        
        }


    }
    getorderDescription(data) {
        if (!!data.items) {
            return `No of products:${data.items.length}`
        } else if (!!data.prescriptions) {
            return `Product:prescription `
        } else {
            return null
        }

    }
    renderFooter() {
        return (
        //Footer View with Load More button
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.loadMoreData}
            
              style={styles.loadMoreBtn}>
             {this.state.footerLoading?
            
                <ActivityIndicator color="blue"  style={styles.btnText} />:null}

            </TouchableOpacity>
          </View>
        );
      }

    render() {
        const { data, isLoading } = this.state;
       
        return (
            <Container style={{ backgroundColor: '#E6E6E6', flex: 1 }}>
                <ScrollView

                 style={{flex: 1}}
                 contentContainerStyle={{flex: 1}}>


                    <Spinner
                        visible={isLoading}
                    />
                    {data.length === 0 ?
                        <Card transparent style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "20%"
                        }}>
                            <Thumbnail
                                square
                                source={noAppointmentImage}
                                style={{ height: 100, width: 100, marginTop: "10%" }}
                            />

                            <Text
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: 15,
                                    marginTop: "10%"
                                }}
                                note
                            >
                                No orders Are Found
                    </Text>
                            <Item style={{ marginTop: "15%", borderBottomWidth: 0 }}>
                                <Button style={[styles.bookingButton, styles.customButton]}
                                    onPress={() =>
                                        this.props.navigation.navigate('Medicines')
                                    } testID='navigateToHome'>
                                    <Text style={{ fontFamily: 'Opensans', fontSize: 15, fontWeight: 'bold' }}>Place Order</Text>
                                </Button>
                            </Item>
                        </Card>
                        // <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 70 }}>
                        //     <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No Medicines Are Found Your Cart</Text>
                        // </Item> 
                        :
                        <View>
                            <FlatList data={data}

                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={() => this.handleLoadMore()}
                                onEndReachedThreshold={0.5}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                ListFooterComponent={this.renderFooter.bind(this)}
                               
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity
                                        testID="orderDetailsNavigation"
                                        onPress={() => this.props.navigation.navigate('OrderDetails', { serviceId: item.orderNumber })}>
                                        <View style={{ margin: 5, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginBottom: 10,borderRadius: 2.5, }}>
                                            <View style={{ marginBottom: 10 }}>
                                                <Row style={{ borderBottomWidth: 0.5, borderBottomColor: '#E6E6E6', paddingBottom: 5, marginLeft: 10, marginRight: 10 }}>
                                                    <Col>
                                                        <Text style={styles.Head}>Order Id</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={{ fontSize: 12, textAlign: 'right', marginTop: 13, fontFamily: 'OpenSans', marginRight: 5 }}>{item.orderNumber || index}</Text>
                                                    </Col>
                                                </Row>
                                                <Row style={styles.Row} />
                                                <Row>
                                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>{this.getorderDescription(item)}</Text>
                                                </Row>
                                                <Row >
                                                    <Text style={styles.Head1}>Ordered On</Text>
                                                </Row>
                                                <Row >
                                                    <Text style={styles.orderprice}>{formatDate(item.createdDate, 'DD MMMM,YYYY')}</Text>
                                                </Row>

                                                <Row >
                                                    <Col>
                                                        <Row  >
                                                            <Text style={styles.Head1}>Total price</Text>
                                                        </Row>

                                                        <Row style={{}}>
                                                            <Col size={5}>
                                                                <Text style={styles.orderprice}>₹ {item.totalAmount}</Text>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row style={styles.Row}>

                                                    <Text style={[styles.orderprice1, { color: statusBar[item.status].color }]}>{statusBar[item.status].status}</Text>
                                                </Row>

                                            </View>

                                            <Row style={{
                                                marginBottom: 10, borderTopWidth: 0.5, marginLeft: 10, marginRight: 10,
                                                borderTopColor: '#E6E6E6', paddingTop: 5,
                                            }}>
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
                                                            <Text style={styles.Buynow}><Icon name='ios-cart' style={styles.cart} />Buy Again</Text>
                                                        </TouchableOpacity>
                                                    </Col> :
                                                    null}
                                            </Row>
                                        </View>
                                    </TouchableOpacity>
                                } />



                        </View>}
                  
                {/* </Content> */}
                </ScrollView>
                {/* <Footer style={
                    Platform.OS === "ios" ?
                        { height: 30 } : { height: 45 }}> */}

                {/* </Footer> */}
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
        marginLeft: 10,
        marginRight: 10, marginTop: 5
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      btnText: {
        color: 'blue',
        fontSize: 15,
        textAlign: 'center',
      },


    buytext: {
        fontSize: 12,
        color: '#8dc63f',
        fontFamily: 'OpenSans',
        fontWeight: 'bold'
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
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'OpenSans',
        color: '#7F49C3',
        marginTop: 5,
    },
    Head1: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
        marginLeft: 10,
        color: '#4c4c4c'
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
        fontFamily: 'OpenSans',
        fontSize: 12,
        color: '#4c4c4c', marginTop: 1,
        marginLeft: 10
    },
    orderprice1: {
        fontFamily: 'OpenSans',
        fontSize: 12,
        marginTop: 1,
        fontWeight: 'bold'
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
