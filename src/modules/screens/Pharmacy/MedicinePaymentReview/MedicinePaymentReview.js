import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, ScrollView } from 'react-native';

class MedicinePaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render() {

        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>
                    <ScrollView>
                        <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col>

                                    <Text style={styles.customizedText} note>Date And Time</Text>
                                    <Text style={styles.customizedText}>12 August,2019 12:30 AM </Text>
                                </Col>

                            </Row>
                        </Grid>
                        <Grid style={{ borderBottomWidth: 0.3, color: 'gray', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='medkit' style={{ fontSize: 16, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                    <Text note style={{ fontFamily: 'OpenSans' }}>uuu</Text>

                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='pin' style={{ fontSize: 18, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                    <View>
                                        <Text note >kkkk</Text>
                                        <Text note >llll</Text>

                                        <View>
                                            <Text note >kkk</Text>
                                            <Text note >ooo</Text>
                                        </View>

                                    </View>
                                </Col>
                            </Row>
                        </Grid>
                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                            <View>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold' }}>Order Details</Text>
                                <Text note style={styles.customizedText}>Pharmacy</Text>
                                <Text style={styles.customizedText}>pharmacy name1</Text>
                                <Text note style={styles.customizedText}>Medicine</Text>

                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <Text style={styles.customizedText}>Antibiotic</Text>
                                    </Col>
                                    <Col style={{ width: '35%' }}>
                                        <Text style={styles.customizedText}>QTY:10</Text>
                                    </Col>
                                    <Col style={{ width: '15%' }}>
                                        <Text style={styles.customizedText}>{'\u20B9'}5000</Text>
                                    </Col>
                                </Row>
                                <Text style={styles.customizedText}>pharmacy name2</Text>
                                <Text note style={styles.customizedText}>Medicine</Text>

                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <Text style={styles.customizedText}>Antibiotic</Text>
                                    </Col>
                                    <Col style={{ width: '35%' }}>
                                        <Text style={styles.customizedText}>QTY:5</Text>
                                    </Col>
                                    <Col style={{ width: '15%' }}>
                                        <Text style={styles.customizedText}>{'\u20B9'}100</Text>
                                    </Col>
                                </Row>





                            </View>
                        </Grid>

                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>Apply Coupons</Text>
                                    <Input underlineColorAndroid='gray' placeholder="Enter Your 'Coupon' Code here" style={styles.transparentLabel}
                                        getRef={(input) => { this.enterCouponCode = input; }}
                                        secureTextEntry={true}
                                        returnKeyType={'go'}
                                        value={this.state.password}
                                        onChangeText={enterCouponCode => this.setState({ enterCouponCode })}
                                    />
                                </Col>

                            </Row>

                        </Grid>



                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                            <Row>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>Total</Text>
                                </Col>
                                <Col style={{ width: '90%' }}>
                                    <Text style={styles.customizedText}>2000</Text>
                                </Col>
                            </Row>
                        </Grid>
                        <Button block success style={{ borderRadius: 6, margin: 6 }} >
                            <Text uppercase={false}>payLater</Text>
                        </Button>
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
        fontSize: 15
    }
});