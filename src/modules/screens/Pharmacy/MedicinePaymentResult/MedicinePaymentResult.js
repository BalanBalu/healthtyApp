import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, TextInput } from 'react-native';

class MedicinePaymentResult extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }
    render() {


        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    <Grid style={styles.curvedGrid}>

                    </Grid>
                    <Grid style={{ marginTop: -60, height: 100, }}>
                        <Row style={{ justifyContent: 'center' }}>

                            <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 18, }}>CHECKOUT</Text>


                        </Row>
                    </Grid>


                    {/* <Grid style={{ marginTop: -70, height: 100, }}>
                        <Row style={{ marginLeft: 100, }}>
                            <Col>

                                <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 14 }}>Date: </Text>
                            </Col>
                            <Col>

                                <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 14 }}> 24,2019</Text>
                            </Col>




                        </Row>

                    </Grid> */}







                    <Card transparent >



                        <Grid >

                            <Row style={{ justifyContent: 'center', width: '100%', marginTop: -15 }}>
                                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 20, padding: 5 }}>Your Order</Text>
                            </Row>

                        </Grid>

                        <Card style={{ marginTop: 10, padding: 5, height: 180 }}>
                            <Grid>
                                <Row >
                                    <Image source={{ uri: 'https://static01.nyt.com/images/2019/03/05/opinion/05Fixes-1/05Fixes-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale' }} style={{
                                        width: 100, height: 100, borderRadius: 10,
                                        marginTop: 20
                                    }} />
                                    <View style={{ width: '75%', }}>
                                        <Text style={styles.labelTop}>Anti-Inhibitor Coagulant Complex (FEIBA)  </Text>

                                    </View>

                                </Row>
                                <View style={{ marginLeft: 105, flex: 1, flexDirection: 'row', marginTop: 25 }}>

                                    <Text style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 16,
                                        color: '#c26c57',
                                        fontWeight: "bold"
                                    }} > Rs.50</Text>
                                    <Text style={{
                                        textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                        fontFamily: 'OpenSans',
                                        fontSize: 14,
                                        color: 'gray',
                                        marginLeft: 10,
                                        fontWeight: "bold"
                                    }}>MRP: Rs 100</Text>

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#ffa723', marginLeft: 10, fontWeight: 'bold' }}> Get 50% Off</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', width: '65%', marginLeft: 110, }}>
                                    <Text style={{ fontSize: 14, color: '#000', marginTop: -10 }}>Pharmacy name </Text>

                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 110 }}>
                                    <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, }}>
                                        <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: '#c26c57' }}>-</Text>
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 5, color: '#c26c57' }}>8</Text>
                                    </View>
                                    <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, marginLeft: 5 }}>
                                        <Text style={{
                                            fontSize: 20, textAlign: 'center', marginTop: -5,
                                            color: '#c26c57'
                                        }}>+</Text>
                                    </View>
                                    {/* <View >
                                        <Button style={styles.button1}><Text> Save for later</Text></Button>
                                    </View> */}
                                    <View>
                                        {/* <Button style={styles.button2}> */}


                                        <Icon style={{ fontSize: 30, color: 'red', marginLeft: 2, marginLeft: 50, marginTop: -4 }} name='ios-trash' />
                                        {/* <Text style={{ color: '#fff', marginLeft: -30 }}> Remove</Text> */}



                                        {/* </Button> */}
                                    </View>
                                </View>


                            </Grid>




                        </Card>
                        <Card style={{ marginTop: 10, padding: 5, height: 180 }}>
                            <Grid>
                                <Row >
                                    <Image source={{ uri: 'http://www.sunnyph.com/Content/Uploads/2015/01/pills.jpg' }} style={{
                                        width: 100, height: 100, borderRadius: 10,
                                        marginTop: 20
                                    }} />
                                    <View style={{ width: '75%', }}>
                                        <Text style={styles.labelTop}>Anti-Inhibitor Coagulant Complex (FEIBA)  </Text>

                                    </View>

                                </Row>
                                <View style={{ marginLeft: 105, flex: 1, flexDirection: 'row', marginTop: 25 }}>

                                    <Text style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 16,
                                        color: '#c26c57',
                                        fontWeight: "bold"
                                    }} > Rs.50</Text>
                                    <Text style={{
                                        textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                        fontFamily: 'OpenSans',
                                        fontSize: 14,
                                        color: 'gray',
                                        marginLeft: 10,
                                        fontWeight: "bold"
                                    }}>MRP: Rs 100</Text>

                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#ffa723', marginLeft: 10, fontWeight: 'bold' }}> Get 50% Off</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', width: '65%', marginLeft: 110, }}>
                                    <Text style={{ fontSize: 14, color: '#000', marginTop: -10 }}>Pharmacy name </Text>

                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 110 }}>
                                    <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, }}>
                                        <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: '#c26c57' }}>-</Text>
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 5, color: '#c26c57' }}>8</Text>
                                    </View>
                                    <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, marginLeft: 5 }}>
                                        <Text style={{
                                            fontSize: 20, textAlign: 'center', marginTop: -5,
                                            color: '#c26c57'
                                        }}>+</Text>
                                    </View>
                                    {/* <View>
                                        <Button style={styles.button1}><Text> Save for later</Text></Button>
                                    </View> */}
                                    <View>
                                        {/* <Button style={styles.button2}> */}


                                        <Icon style={{ fontSize: 30, color: 'red', marginLeft: 2, marginTop: -4, marginLeft: 50, }} name='ios-trash' />
                                        {/* <Text style={{ color: '#fff', marginLeft: -30 }}> Remove</Text> */}



                                        {/* </Button> */}
                                    </View>
                                </View>


                            </Grid>




                        </Card>













                    </Card>
                </Content>
                <Footer style={{ backgroundColor: '#7E49C3', }}>

                    <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Total </Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Rs: 300</Text>
                    </Row>


                    <Col >
                        <Button style={{ backgroundColor: '#5cb75d', borderRadius: 10, padding: 10, marginTop: 10, marginLeft: 40, height: 35 }}>
                            <Text>Checkout</Text>
                        </Button>
                    </Col>



                </Footer>
            </Container >

        )
    }

}


export default MedicinePaymentResult


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
        marginLeft: 10,
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



});