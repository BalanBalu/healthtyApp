import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import {getMyOrders} from '../../../providers/pharmacy/pharmacy.action'
import { formatDate } from '../../../../setup/helpers'


class MedicineMyOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId:'',
            myOrderList:[],
            isLoading:true,
        }
    }
    componentDidMount(){
        this.getMedicineOrder();        
    }
    getMedicineOrder=async()=>{
        let orderId="5d418339170fc31bd0c3a5cb"
        await this.setState({orderId:orderId});
        let response=await getMyOrders(this.state.orderId);
        await this.setState({myOrderList:response.data[0],isLoading:false});
    }
    render() {
        const { isLoading,myOrderList } = this.state;
        return (
            <Container style={styles.container}>

                {isLoading == true ? <Loader style='list' /> :
                    <Content style={styles.bodyContent}>
                    <Grid style={styles.curvedGrid}>
                    </Grid>

                        <Card transparent >

                        <Grid style={{ marginTop: -100, height: 100 }}>
                                <Row style={{ justifyContent: 'center', width: '100%', marginTop: 30 }}>
                                    <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 22, padding: 5,color:'#fff' }}>Your Order</Text>
                                </Row>
                            </Grid>

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
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>{myOrderList.pharmacyInfo.name}</Text>

                                                        </View>
                                                        <View style={{ marginLeft: 20, flex: 1, flexDirection: 'row', marginTop: 5 }}>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', color: '#3966c6' }}>Quantity :</Text>
                                                            <Text style={{ fontSize: 15, fontFamily: 'OpenSans', marginLeft: 10 }}>{item.quantity}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'OpenSans', marginLeft: 20, color: '#3966c6' }}>Total :</Text>
                                                            <Text style={styles.subText}>{'\u20B9'}{item.price}</Text>

                                                        </View>
                                                    </View>
                                                </Grid>
                                            </View>

                                        } />
                                
                            </View>
                        </Card>

                    </Content>}
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
        marginLeft: -150,
        marginTop: -600,
        // position: 'relative',
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
    }
});
