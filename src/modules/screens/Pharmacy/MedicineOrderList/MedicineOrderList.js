import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, 
    Footer, FooterTab, Picker, Segment, CheckBox, View,Spinner, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { getMedicineOrderList } from '../../../providers/pharmacy/pharmacy.action';
import {formatDate} from '../../../../setup/helpers'

class MedicineMyOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            orderList:[],
            isLoading: true
        }
    }
    componentDidMount() {
        this.medicineOrderList();
    }
    async medicineOrderList(){    
        try {
        //    let userId='5d2420a2731df239784cd001';
           let userId = await AsyncStorage.getItem('userId');
           let result = await getMedicineOrderList(userId);
           this.setState({  orderList: result.data[0], isLoading:false });
           console.log('orderList' + JSON.stringify(this.state.orderList));
            }
        catch (e) {
            console.log(e);
        }        
    }

    renderNoOrders() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Text style={{ fontSize: 20, justifyContent: 'center', alignItems: 'center' }}>No orders yet</Text>
            </Item>
        )
    }

    renderOrders() {
        const { isLoading, orderList} = this.state;
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
    data={orderList.order_items}
    extraData={this.state}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) =>
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('MedicineMyOrders')}>
    <Card style={{ marginTop: 10, padding: 5, height: 155, borderRadius: 5 }}>
    <Grid>
      <Row>
      <Right><Text style={{fontFamily: 'OpenSans', fontSize: 16, color: '#e84393', marginRight: 10,
       fontWeight: 'bold' }}>{formatDate(orderList.order_date,"dddd, MMMM DD-YYYY, hh:mm a")}</Text></Right>
       </Row>
     <View style={{ marginLeft: 10, marginTop: 20, flexDirection: 'row' }}>
    <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold', color: '#3966c6' }}>Order Id </Text>
    <Text style={{ fontFamily: 'OpenSans', fontSize: 16, marginLeft: 48, fontWeight: 'bold' }}>:  {item.medicine_id} </Text>
     </View>
   <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
   <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6', }}>Pharmacy </Text>
  <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 42, fontWeight: 'bold' }}> :  {orderList.pharmacyInfo.name} </Text>
   </View>
   <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
   <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>No of Medicine </Text>
   <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10, fontWeight: 'bold' }}>:  {item.quantity} </Text>
    </View>
    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
   <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Total </Text>
   <Text style={styles.subText}>:{'  '}{'\u20B9'}{item.price}</Text>
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
        return (
            <Container style={styles.container}>
                <Content style={styles.bodyContent}>
                {this.state.isLoading ? <Spinner color='blue' /> :
                        <Card>
                            {this.state.orderList !== null ? this.renderOrders() : this.renderNoOrders()}
                        </Card>}
                </Content>
            </Container>
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
