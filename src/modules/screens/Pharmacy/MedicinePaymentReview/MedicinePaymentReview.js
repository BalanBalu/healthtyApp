import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

class MedicinePaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render() {
        var medNames = [{
            medName: 'Antibiotic', pharName: 'Apollo pharmacy', QTY: 10, Rs: 5000,
            medName1: 'Dollo650', pharName1: 'Shanthi pharmacy', QTY1: 11, Rs1: 4000
        }
        ];
        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>


                    <ScrollView>

                        <Grid style={styles.underLine}>
                            <Row>
                                <Col>

                                    <Text style={styles.Heading} >Date And Time</Text>
                                    <Text style={styles.customizedText}>12 August,2019 12:30 AM </Text>
                                </Col>

                            </Row>
                        </Grid>
                        <Grid style={styles.underLine}>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='medkit' style={styles.medkitIcon}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                    <Text note style={{ fontFamily: 'OpenSans' }}>shanthi house</Text>

                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='pin' style={styles.pinIcon}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                    <View>
                                        <Text note >1/32,4th cross street</Text>
                                        <Text note >ambattur</Text>

                                        <View>
                                            <Text note >chennai</Text>
                                            <Text note >600053</Text>
                                        </View>

                                    </View>
                                </Col>
                            </Row>
                        </Grid>
                        <FlatList
                            data={medNames}
                            renderItem={
                                ({ item }) =>
                                    <Grid style={styles.underLine}>
                                        <View>
                                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>Order Details</Text>
                                            <Row>
                                                <Col style={{ width: '6%' }}>
                                                    <Text style={styles.customizedText}>1.</Text>
                                                </Col>
                                                <Col style={{ width: '94%' }}>
                                                    <Text style={styles.customizedText}>{item.medName}</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{ width: '50%' }}>
                                                    <Text note style={styles.customizedText}>{item.pharName}</Text>
                                                </Col>
                                                <Col style={{ width: '30%' }}>
                                                    <Text style={styles.customizedText}>QTY:{item.QTY}</Text>
                                                </Col>
                                                <Col style={{ width: '20%' }}>
                                                    <Text style={styles.amountName}>{'\u20B9'}{item.Rs}</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{ width: '6%' }}>
                                                    <Text style={styles.customizedText}>2.</Text>
                                                </Col>
                                                <Col style={{ width: '94%' }}>
                                                    <Text style={styles.customizedText}>{item.medName1}</Text>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col style={{ width: '50%' }}>
                                                    <Text note style={styles.customizedText}>{item.pharName1}</Text>
                                                </Col>
                                                <Col style={{ width: '30%' }}>
                                                    <Text style={styles.customizedText}>QTY:{item.QTY1}</Text>
                                                </Col>
                                                <Col style={{ width: '20%' }}>
                                                    <Text style={styles.amountName}>{'\u20B9'}{item.Rs1}</Text>
                                                </Col>
                                            </Row>




                                        </View>
                                    </Grid>
                            } />
                        <Grid style={styles.underLine}>
                            <Row>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.Heading}>Apply Coupons</Text>
                                    <Input underlineColorAndroid='gray' placeholder="Enter Your Coupon Code Here" style={styles.transparentLabel}
                                        getRef={(input) => { this.enterCouponCode = input; }}
                                        secureTextEntry={true}
                                        returnKeyType={'go'}
                                        value={this.state.password}
                                        onChangeText={enterCouponCode => this.setState({ enterCouponCode })}
                                    />
                                </Col>

                            </Row>

                        </Grid>



                        <Grid style={styles.underLine}>
                            <Row>
                                <Col style={{ width: '79%' }}>
                                    <Text style={styles.Heading}>Total Amount</Text>
                                </Col>
                                <Col style={{ width: '90%' }}>
                                    <Row>
                                        <Text style={styles.amountName}>{'\u20B9'}200000</Text>
                                        {/* <Text style={{ marginLeft: 3, fontSize: 20, marginTop: -5 }}>-</Text> */}
                                    </Row>
                                    {/* <Row>
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 15, borderBottomWidth: 0.3, BorderBottomcolor: '#000000', width: '20%' }}>{'\u20B9'}100000</Text>
                                    </Row> */}

                                </Col>
                            </Row>
                            {/* <Row style={{ marginTop: 2 }}>
                                <Col style={{ width: '79%' }}>
                                    <Text style={styles.customizedText}>Final Amount</Text>
                                </Col>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>{'\u20B9'}100000</Text>
                                </Col>
                            </Row> */}
                        </Grid>

                        <Button block success style={{ padding: 10, borderRadius: 6, margin: 6, marginBottom: 20 }}
                        >
                            <Text uppercase={false} >Pay Now</Text>
                        </Button>

                    </ScrollView>

                </Content>

            </Container>

        )
    }

}

export default MedicinePaymentReview


const styles = StyleSheet.create({

    container:
    {
        backgroundColor: '#ffffff',

    },

    bodyContent: {

    },

    customizedText: {
        fontFamily: 'OpenSans',
        fontSize: 15, marginTop: 5
    },
    medName: {
        fontFamily: 'OpenSans',
        fontSize: 15,
        fontWeight: 'bold'
    },
    amountName: {
        color: '#c26c57',
        fontFamily: 'OpenSans',
        fontSize: 15,
        marginTop: 5
    },
    Heading: {
        fontWeight: 'bold',
        fontFamily: 'OpenSans',
        fontSize: 15,
        marginTop: 5
    },
    underLine: {
        borderBottomWidth: 0.3,
        color: '#f2f2f2',
        padding: 10,
        marginLeft: 10
    },
    medkitIcon: {
        fontSize: 16,
        fontFamily: 'OpenSans',
        color: 'gray'
    },
    pinIcon: {
        fontSize: 18,
        fontFamily: 'OpenSans',
        color: 'gray'
    }
});