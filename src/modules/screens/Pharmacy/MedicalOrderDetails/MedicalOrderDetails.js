import React, { Component } from 'react';
import { Container, Content, Text, Radio, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, View, Segment, Col, Row, } from 'native-base';
import { Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';


class MedicalOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Container >
                <Content>
                    <View style={styles.customColumn}>
                        <Row>
                            <Right>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 20, color: '#ffa723', }}> Get 50% OFF
                        </Text>
                            </Right>
                        </Row>
                        <Card style={styles.cardsize}>
                            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVhVjZA3NTx2H-txWOe-bW4Jt16EwXGFd1OVo0LoYviSQLWMx' }} style={{
                                width: '100%', height: 200, borderRadius: 10,
                            }} />

                        </Card>
                        <View>
                            <Text style={{ fontFamily: 'Opensans', fontWeight: 'bold', fontSize: 21, marginTop: 20, marginLeft: 26 }}>Human Factor VIII with von Willebrand factor (also called Humate-P®)</Text>
                            <View style={{ marginLeft: 26, marginTop: 5 }}>

                                <Row>
                                    <Text style={{ fontFamily: 'Opensans', fontWeight: 'bold', fontSize: 18, color: '#0066c4' }}>Pharmacy </Text>
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 18, color: 'black', marginTop: 3, marginLeft: 10
                                    }}>: {'  '} Apollo Pharmacy</Text>

                                </Row>
                                <Row style={{ marginTop: 5 }}>
                                    <Text style={{ fontFamily: 'Opensans', fontWeight: 'bold', fontSize: 18, color: '#0066c4' }}>Total</Text>
                                    <Text style={{
                                        fontFamily: 'OpenSans', fontSize: 18, color: 'black', marginTop: 1, marginLeft: 53
                                    }}> :{'   '} {'\u20B9'}80</Text>
                                    <Text style={{ marginLeft: 10, marginTop: 3, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                        {'\u20B9'}100</Text>

                                </Row>

                            </View>
                            <Row style={{ marginTop: 15, }}>
                                <Col style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                    <TouchableOpacity>
                                        <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                            <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{ marginLeft: 5, color: '#000', fontSize: 20 }}>10</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
                                            <Text style={{
                                                fontSize: 20, textAlign: 'center', marginTop: -5,
                                                color: 'black'
                                            }}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Col>

                                <Col style={{ marginRight: 40 }} >
                                    <Button success style={{ borderRadius: 10, marginLeft: 25, height: 40, justifyContent: 'center' }}>


                                        <Row style={{ justifyContent: 'center', }}>

                                            <Icon name='ios-cart' onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} />

                                            <Text style={{ marginLeft: -25, marginTop: 2, }}>ADD TO CART</Text>

                                        </Row>
                                    </Button>
                                </Col>

                            </Row>
                        </View>
                    </View>
                    <Row>
                        <Icon style={{ fontSize: 30, marginTop: 20, marginLeft: 42, color: '#9c88ff' }} name='ios-paper' />
                        <Text style={{ fontFamily: 'Opensans', fontWeight: 'bold', fontSize: 20, marginTop: 20, marginLeft: 10 }}>Description</Text>
                    </Row>
                    <View>
                        <Text style={{ fontSize: 18, marginTop: 20, marginLeft: 42, color: '#636e72', width: "90%" }}>
                            An antibiotic is a type of antimicrobial substance active against bacteria and is the most important type of antibacterial agent for fighting bacterial infections. Antibiotic medications are widely used in the treatment and prevention of such infections. They may either kill or inhibit the growth of bacteria.

                        </Text>

                    </View>
                    <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, marginTop: 20, width: '95%', marginLeft: 10 }} />
                    <Row>
                        <Icon style={{ fontSize: 30, marginTop: 20, marginLeft: 42, color: '#9c88ff' }} name='md-warning' />
                        <Text style={{ fontFamily: 'Opensans', fontWeight: 'bold', fontSize: 20, marginTop: 20, marginLeft: 10 }}>Disclaimer</Text>
                    </Row>
                    <View>
                        <Text style={{ fontSize: 18, marginTop: 20, marginLeft: 42, color: '#636e72', width: "90%", marginBottom: 20 }}>
                            product will not be returned if the seal is broken.for warranty-related claims, please contact the brand service center

                        </Text>

                    </View>
                </Content>
            </Container>
        );
    }
}

export default MedicalOrderDetails;

const styles = StyleSheet.create({
    cardsize: {
        alignItems: 'center',
        padding: 5,
        width: '50%',
        marginTop: 40,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    customColumn: {
        padding: 10,
        paddingTop: 20,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 6,
        width: '97%',
        backgroundColor: '#f5f6fa'
    }

})
