import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

class OrderPayment extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        var payment = [{
            bankName: 'State Bank', number: '2344'

        }]


        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>

                    <Grid style={styles.curvedGrid}>

                    </Grid>


                    <View style={{ marginTop: -85, height: 100 }}>
                        <Row>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Date</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={styles.normalText}>Jan 24,2019</Text>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: -28 }}>
                            <Col style={{ width: '30%', alignItems: 'center', marginLeft: 12 }}>
                                <Text style={styles.normalText}>TotalBill</Text>
                            </Col>
                            <Col style={{ width: '40%', alignItems: 'center' }}>
                            </Col>
                            <Col style={{ width: '30%', alignItems: 'center', marginLeft: -30 }}>
                                <Text style={styles.normalText}>Rs.100</Text>
                            </Col>
                        </Row>
                    </View>



                    <Card transparent style={{ padding: 10, marginTop: 10 }}>

                        <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 16, padding: 5 }}>PaymentInfo</Text>
                        <Segment>
                            <Button first active>
                                <Text uppercase={false}>DefaultCard</Text>
                            </Button>
                            <Button>
                                <Text uppercase={false}>AddNewCard</Text>
                            </Button>

                        </Segment>
                        <FlatList
                            data={payment}
                            renderItem={
                                ({ item }) =>
                                    <Card style={{ padding: 20, marginTop: 20, borderRadius: 5 }}>
                                        <Row>
                                            <Col style={{ width: '32%' }}>
                                                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKuPIQiZ-73x4xDj522X2WR1wUvbZoT14N3Jl4wa92mOig4WkKg' }}
                                                    style={{ width: '30%', height: 50, }}
                                                />
                                            </Col>
                                            <Col style={{ width: '58%', marginTop: 5, marginLeft: -20 }}>
                                                <Row>
                                                    <Text style={{ fontSize: 15, marginTop: 2 }} >******</Text>
                                                    <Text style={{ fontSize: 15 }}>{item.number}</Text>
                                                </Row>
                                                <Text style={{ color: 'blue', fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 15 }}>{item.bankName}</Text>
                                            </Col>
                                            <Col style={{ width: '10%', marginTop: 15, marginLeft: 20, }} >
                                                <Icon style={{ color: 'green', fontSize: 25 }} name="ios-checkmark-circle" />
                                            </Col>
                                        </Row>

                                        {/* <Grid style={{ padding: 5, margin: 10 }}>
                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/180/visa.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://s3.amazonaws.com/peoplepng/wp-content/uploads/2018/03/20133416/Free-Credit-Card-Visa-And-Master-Card-PNG-Transparent-Image-1024x668.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>


                            <Col style={{ borderColor: '#D92B4B', borderWidth: 1, padding: 10, alignItems: 'center', borderRadius: 10, margin: 10 }}>
                                <Image source={{ uri: 'https://cdn.freebiesupply.com/logos/large/2x/cirrus-3-logo-png-transparent.png' }} style={{ width: '100%', height: 50, borderRadius: 10 }} /></Col>

                        </Grid>

                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CardHolderName</Text>
                                <Input placeholder="CardHolderName" style={styles.transparentLabel} />

                            </Col>
                        </Grid>

                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CardNumber</Text>
                                <Input placeholder="CardNumber" style={styles.transparentLabel} />
                            </Col>
                        </Grid>
                        <Grid style={{ marginTop: 5 }}>
                            <Col>
                                <Text style={styles.labelTop}>CVV</Text>
                                <Input placeholder="CVV" style={styles.transparentLabel} />
                            </Col>
                            <Col>
                                <Text style={styles.labelTop}>ExpiredDate</Text>
                                <Input placeholder="ExpiredDate" style={styles.transparentLabel} />
                            </Col>

                        </Grid>

                        <Item style={{ borderBottomWidth: 0, margintop: 5 }}>
                            <CheckBox checked={true} color="green"  ></CheckBox>
                            <Text style={{ marginLeft: 15, color: 'gray', fontFamily: 'OpenSans' }}>Save creditcard Information</Text>
                        </Item>

                        <Button onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} block style={styles.loginButton}><Text>Continue</Text></Button> */}
                                    </Card>
                            } />
                    </Card>
                </Content>

            </Container>

        )
    }

}


export default OrderPayment


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
        marginTop:-135,
        marginLeft:'auto',
        marginRight:'auto',
        backgroundColor: '#745DA6',
        transform: [
          {scaleX: 2}
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
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        color: '#000',


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
    }
});