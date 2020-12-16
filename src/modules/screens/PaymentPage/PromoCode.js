import React, { Component } from 'react';
import { Container, Content, Text, Button, FooterTab, Card, Footer, Icon, Input, Toast, Form, Right, Left, Grid, Row, Col } from 'native-base';
import { StyleSheet, Image, View, AsyncStorage, TextInput, TouchableOpacity } from 'react-native';
import { getPromodataList } from '../../providers/PromoCode/promo.action'
import { FlatList } from 'react-native-gesture-handler';
import { formatDate } from "../../../setup/helpers";

class PromoCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            couponCodeDiscountAmount: 0,
            displayMore: false,
            data: []
        }
    }

    componentDidMount() {
        let data = [];
        this.getPromolistDatas(data)
    }


    getPromolistDatas = async (data) => {
        try {
            let result = await getPromodataList(data)
           
            if (result.success) {
                this.setState({ data: result.data })

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    onCouponPress(coupenCodeText) {
        this.setState({ coupenCodeText: coupenCodeText.toUpperCase() })
    }

    displayMoreData() {
        this.setState({ displayMore: !this.state.displayMore })
    }



    getPromocode(promocode) {
        if (promocode.promo_code != undefined) {
            return `${promocode.promo_code || ''}`
        } else {
            return null
        }
    }

    getDescription(data) {
        if (data.description != undefined) {
            return `${data.description || ''}`
        } else {
            return null
        }
    }
    getPromocodeDiscription(data) {
        if (data.service_type != undefined) {
            return `${data.service_type || ''}`
        } else {
            return null
        }
    }

   
    OnCopyedValue() {
        if (this.state.coupenCodeText != null) { }
    }
    navigateToPaymentPage(data) {
        this.props.navigation.navigate('paymentPage',{hasReload:true,coupenCodeText:data.promo_code})
        
    }

    render() {

        return (
            <Container>
                <Content>
                    <View style={{ backgroundColor: '#fff', }}>
                        <View style={{ backgroundColor: '#f2f2f2' }}>
                            <Row style={{ marginTop: 20, paddingBottom: 20 }}>
                                <Text style={{ marginRight: 20, marginLeft: 20, fontFamily: 'OpenSans', fontSize: 16, }}>Available Coupons</Text>
                            </Row>
                        </View>
                        <FlatList
                            data={this.state.data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>

                                <Grid style={{ marginRight: 20, marginLeft: 20, marginTop: 10 }}>
                                    <Row >
                                        <Col size={4}>
                                            <Row style={{ padding: 5, backgroundColor: '#F3EBF8', justifyContent: 'center' }}>
                                                <Left>
                                                    <Image source={require('../..//../../assets/images/Logo.png')} style={{ height: 20, width: 20 }} />
                                                </Left>

                                                <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center', lineHeight: 30 }}>{this.getPromocode(item)}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={6}>
                                        <TouchableOpacity onPress={() => this.navigateToPaymentPage(item)}>
                                                <Text style={{ color: '#775DA3', fontSize: 15, fontFamily: 'OPenSans', textAlign: 'right', fontWeight: 'bold', marginTop: 10, marginRight: 10 }}> APPLY</Text>
                                                </TouchableOpacity>
                                        </Col>
                                    </Row>
                                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 10 }}>
                                        {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 14, }}>{this.getPromocodeDiscription(item)}</Text>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                                        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', lineHeight: 20 }}>{this.getDescription(item)}</Text>
                                    </Row>
                                    <Row style={{ marginTop: 5, marginBottom: 5 }}>
                                        <TouchableOpacity onPress={() => this.displayMoreData()}>
                                            <Text style={{ color: '#378DDF', fontSize: 12, fontWeight: 'bold' }}>{this.state.displayMore == false ? "+ MORE":"-LESS"}</Text>
                                        </TouchableOpacity>
                                    </Row>
                                    {this.state.displayMore == true ?
                                        <View>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333' }}>Terms & Conditions Apply</Text>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}> Valid in select cities only</Text>

                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Offer is Valid on all modes of payments</Text>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Offer is Valid only on select {this.getPromocodeDiscription(item)}</Text>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Other T&Cs may apply</Text>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                                <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Offer valid till {formatDate(item.expiration_date, 'MMM DD,YYYY HH:MM  A')}</Text>
                                            </Row>
                                        </View> : null}
                                    <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10, }} />
                                </Grid>
                            } />
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