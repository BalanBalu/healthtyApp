import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, ScrollView, AsyncStorage, FlatList } from 'react-native';
import { medicineRateAfterOffer } from '../../../common';
import { formatDate } from '../../../../setup/helpers';

class MedicinePaymentReview extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cartItems:[],
            addressData: [],
            isLoading: false
        }
    }
   async componentDidMount(){
    const { navigation } = this.props;
    const deliveryAddress = navigation.getParam('data');
    this.setState({addressData: deliveryAddress})
    console.log('deliveryAddress'+JSON.stringify(this.state.address));
       await this.getAddToCart();
        
    }
    getAddToCart= async() => { 
        try{
            temp = await AsyncStorage.getItem('userId')
            userId = JSON.stringify(temp);
            const cartItems = await AsyncStorage.getItem('cartItems-'+userId);       
             this.setState({ cartItems: JSON.parse(cartItems)});
             console.log(this.state.cartItems);
        }
        catch(e){
            console.log(e);
        }
        }
        totalPrice() {
            let total = 0;
            if(this.state.cartItems) {
                this.state.cartItems.forEach(element => {
                    total = total + ((parseInt(element.price) - (parseInt(element.offer)/100) * parseInt(element.price)) * parseInt(element.selectedQuantity))
                })    
            return total;
            }
          }
          
        

    render() {
        const{ cartItems,addressData } = this.state;

        return (

            <Container style={styles.container}>

                <Content style={styles.bodyContent}>


                    <ScrollView>

                        <Grid style={styles.underLine}>
                            <Row>
                                <Col>

                                    <Text style={styles.Heading} >Date And Time</Text>
                                    <Text style={styles.customizedText}>{formatDate(new Date(),"DD MMMM, YYYY hh:mm A")} </Text>

                                </Col>

                            </Row>
                        </Grid>
                        <Grid style={styles.underLine}>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='medkit' style={styles.medkitIcon}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                    <Text note style={{ fontFamily: 'OpenSans' }}>{addressData[0]&& addressData[0].fullName}</Text>

                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='pin' style={styles.pinIcon}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>

                                { addressData != undefined ?
                                    <View>
                                        <Text style={styles.customizedText}>{(addressData[0] && addressData[0].address.no_and_street) + ', ' + (addressData[0] && addressData[0].address.address_line_1)}</Text>
                                        <Text style={styles.customizedText}>{addressData[0] && addressData[0].address.address_line_2 + ', ' }</Text>
                                        <Text style={styles.customizedText}>{(addressData[0] && addressData[0].address.city) + ','+ (addressData[0] && addressData[0].address.pin_code)}</Text>
                                    </View>: null}
                                </Col>
                            </Row>
                        </Grid>

                        <Grid style={styles.underLine}>
                            <Row>
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 15, fontWeight: 'bold' }}>Order Details</Text>
                            </Row>
                            <FlatList
                                    data={cartItems}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                        <View>
                                            <Row>
                                                {/* <Col style={{ width: '6%' }}>
                                                    <Text style={styles.customizedText}>1.</Text>
                                                </Col> */}
                                                <Col style={{ width: '94%' }}>
                                                    <Text style={styles.customizedText}>{item.medicine_name}</Text>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{ width: '50%' }}>
                                                    <Text note style={styles.customizedText}>MedPlus</Text>
                                                </Col>
                                                <Col style={{ width: '30%' }}>
                                                    <Text style={styles.customizedText}>QTY:{item.selectedQuantity}</Text>
                                                </Col>
                                                <Col style={{ width: '20%' }}>
                                                    <Text style={styles.amountName}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
                                                </Col>
                                            </Row>
                                        </View>

                                } />



                        </Grid>

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
                                        <Text style={styles.amountName}>{'\u20B9'}{this.totalPrice()}</Text>
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

                        <Button block success style={{ padding: 10, borderRadius: 6, margin: 6, marginBottom: 20 }}>
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