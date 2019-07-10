import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, View, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Badge } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {


        return (

            <Container style={styles.container}>


                <Content>

                    <Grid style={styles.curvedGrid}>

                    </Grid>

                    <Grid style={{ marginTop: -100, height: 100 }}>
                        <Row>

                            <Col style={{ width: '100%', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>

                                <Item style={{ borderBottomWidth: 0 }}>

                                    <Text style={{ fontFamily: 'OpenSans', color: '#fff' }}>SEARCH RESULTS</Text>
                                </Item>

                            </Col>
                            <Col style={{ width: '10%' }}>
                            </Col>

                        </Row>

                    </Grid>
                    <Card transparent style={{ padding: 10, marginTop: 60 }} onTouchStart={() => this.props.navigation.navigate('MedicineCheckout')} >
                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>20%</Text>

                                        </View>
                                    </View>
                                </Col>


                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Aminocaproic Acid</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}80</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card>

                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQtUYMSYsZlwJM46ZccW_Ev3KULxQA-o2yFEygywoQBs0KBnlJg' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>50%</Text>

                                        </View>
                                    </View>

                                </Col>

                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Gemtuzumab ozogamicin</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}50</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>Wellness Craft Pharmacy</Text>

                                </Col>
                            </Grid>

                        </Card>



                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTSgZ9jiVeVoxjDCuYlwzlbUop6Y_EQOtMj-2DoLZQ1he-azufKg' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>25%</Text>

                                        </View>
                                    </View>
                                </Col>

                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Hydroxyurea for sickle cell disease</Text>
                                    <Row>

                                        <Text style={styles.subText}>{'\u20B9'}75</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>Shoprite Pharmacy</Text>
                                </Col>
                            </Grid>

                        </Card>

                        <Card style={{ padding: 10 }}>
                            <Grid>
                                <Col style={{ width: '25%' }}>
                                    <View>
                                        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
                                        <View style={{
                                            position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                            backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                            borderColor: 'green', borderWidth: 1
                                        }}>
                                            <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>20%</Text>

                                        </View>
                                    </View>
                                </Col>


                                <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                    <Text style={styles.normalText}>Aminocaproic Acid</Text>
                                    <Row>
                                        <Text style={styles.subText}>{'\u20B9'}80</Text>
                                        <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}100</Text>
                                    </Row>
                                    <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
                                </Col>
                            </Grid>
                        </Card>

                    </Card>

                </Content>
                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row>
                        <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                            <TouchableOpacity>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>8</Text>
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
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }}>


                                <Row style={{ justifyContent: 'center', }}>

                                    <Icon name='ios-cart' />

                                    <Text style={{ marginLeft: -25, marginTop: 2, }}>VIEW CART</Text>
                                    <View>
                                        <Text style={{ position: 'absolute', height: 20, width: 20, fontSize: 13, backgroundColor: '#ffa723', top: 0, marginLeft: -105, borderRadius: 20, marginTop: -10 }}>
                                            20
                                        </Text>
                                    </View>
                                </Row>
                            </Button>
                        </Col>

                    </Row>


                </Footer>
            </Container>

        )
    }

}

export default MedicineSearchList


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',
    },

    bodyContent: {
        padding: 0
    },
    customImage: {
        height: 90,
        width: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: 50
    },

    curvedGrid:
    {
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

    normalText:
    {
        fontFamily: 'OpenSans',
        fontSize: 17,
        marginTop: 10
    },
    offerText:
    {
        fontFamily: 'OpenSans',
        fontSize: 13,
        color: 'green'

    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: 'black',
        //marginLeft: 5
    }

});