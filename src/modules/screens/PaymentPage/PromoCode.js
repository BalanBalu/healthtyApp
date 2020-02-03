import React, { Component } from 'react';
import { Container, Content, Text, Button, FooterTab, Card, Footer, Icon, Input, Toast, Form, Right, Left, Grid, Row, Col } from 'native-base';
import { StyleSheet, Image, View, AsyncStorage, TextInput, TouchableOpacity } from 'react-native';






class PromoCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            couponCodeDiscountAmount: 0
        }
    }

    onCouponPress(coupenCodeText) {
        this.setState({ coupenCodeText: coupenCodeText.toUpperCase() })
    }


    render() {
        return (
            <Container>
                <Content>

                    <View style={{ backgroundColor: '#fff', }}>
                        <View style={{ backgroundColor: '#f2f2f2' }}>

                            <View style={{ marginTop: 10, marginBottom: 10, paddingBottom: 10 }}>
                                <Grid style={{ marginRight: 15, marginLeft: 15 }}>
                                    <Col>
                                        <Form>

                                            <Input placeholder="Enter Your 'Coupon' Code here" style={styles.transparentLabel}
                                                placeholderTextColor="#C1C1C1"
                                                getRef={(input) => { this.enterCouponCode = input; }}
                                                keyboardType={'default'}
                                                returnKeyType={'go'}
                                                multiline={false}
                                                value={this.state.coupenCodeText}
                                                onChangeText={enterCouponCode => this.onCouponPress(enterCouponCode)}
                                            />

                                        </Form>
                                        <Row style={{ position: 'absolute' }}>
                                            <Right>
                                                {/* <Button style={{marginTop:10,backgroundColor:'#2ecc71',color:'#fff',borderRadius:10}}><Text style={{fontSize:15,fontFamily:'OpenSans',fontWeight:'bold'}}>submit</Text></Button> */}
                                                <TouchableOpacity style={{ marginTop: 23, marginRight: 15 }}>
                                                    <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#775DA3' }}>APPLY</Text>
                                                </TouchableOpacity>
                                            </Right>
                                        </Row>
                                    </Col>
                                </Grid>
                            </View>
                            <Text style={{ paddingBottom: 10, marginRight: 20, marginLeft: 20, fontFamily: 'OpenSans', fontSize: 14 }}>Available Coupons</Text>
                        </View>
                        <Grid style={{ marginRight: 20, marginLeft: 20, marginTop: 10 }}>
                            <Row >
                                <Col size={5}>
                                    <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'left', fontStyle: 'italic' }}>MEDFLIC</Text>
                                </Col>
                                <Col size={5}>
                                    <Text style={{ color: '#C1C1C1', fontSize: 12, fontFamily: 'OPenSans', textAlign: 'right' }}> RECOMMENDED</Text>
                                </Col>
                            </Row>

                            <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 10 }}>
                                {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, }}>50% OFF on your first Order</Text>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333' }}>Use code MEDS45 and get 50% off on orders above {'\u20B9'}120,Maximum discount {'\u20B9'}100.</Text>
                            </Row>
                            <Row style={{ marginTop: 5, borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3 }}>
                                <Text style={{ color: '#378DDF', fontSize: 12 }}>View Details</Text>
                            </Row>
                            <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10 }}>
                                <Col size={4} style={{ marginTop: 5, }}>
                                    <Row style={{ padding: 5, backgroundColor: '#F3EBF8' }}>
                                        <Col size={3}>
                                            <Image source={require('../..//../../assets/images/Logo.png')} style={{ height: 20, width: 20 }} />
                                        </Col>
                                        <Col size={7}>
                                            <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'left', }}>MEDS50</Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col size={6}>
                                    <Text style={{ color: '#775DA3', fontSize: 12, fontFamily: 'OPenSans', textAlign: 'right', fontWeight: 'bold', marginTop: 15 }}> APPLY</Text>
                                </Col>
                            </Row>
                        </Grid>


                    </View>


                </Content>
            </Container>
        );
    }
}

export default PromoCode;
const styles = StyleSheet.create({
    transparentLabel:
    {

        borderColor: '#C1C1C1',
        borderWidth: 0.3
        , backgroundColor: '#fff',
        height: 45,
        marginTop: 10,
        borderRadius: 5,
        paddingLeft: 20,
        fontFamily: 'OpenSans',
        margin: 2,
        fontSize: 12,
        fontWeight: 'bold'
    },
});