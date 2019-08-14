import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, ScrollView, AsyncStorage, FlatList } from 'react-native';
import { medicineRateAfterOffer } from '../../../common';

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

                                    <Text style={styles.customizedText}>{addressData[0]&& addressData[0].fullName}</Text>

                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ width: '8%' }}>
                                    <Icon name='pin' style={{ fontSize: 18, fontFamily: 'OpenSans', color: 'gray' }}></Icon>
                                </Col>
                                <Col style={{ width: '90%' }}>
                                {this.state.addressData ?
                                    <View>
                                        <Text style={styles.customizedText}>{(addressData[0] && addressData[0].address.no_and_street) + ', ' + (addressData[0] && addressData[0].address.address_line_1)}</Text>
                                        <Text style={styles.customizedText}>{addressData[0] && addressData[0].address.address_line_2}</Text>
                                        <Text style={styles.customizedText}>{(addressData[0] && addressData[0].address.city) + ','+ (addressData[0] && addressData[0].address.pin_code)}</Text>
                                    </View>: null}
                                </Col>
                            </Row>
                        </Grid>
                        <Grid style={{ borderBottomWidth: 0.3, color: '#f2f2f2', padding: 10, marginLeft: 10 }}>
                           
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 18, fontWeight: 'bold' }}>Order Details</Text>
                                <FlatList
                                    data={cartItems}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) =>
                                    <View>
                                <Text note style={styles.customizedText}>Pharmacy</Text>
                                <Text style={styles.customizedText}>MedPlus</Text>
                                <Text note style={styles.customizedText}>Medicine</Text>

                                <Row>
                                    <Col style={{ width: '50%' }}>
                                        <Text style={styles.customizedText}>{item.medicine_name}</Text>
                                    </Col>
                                    <Col style={{ width: '35%' }}>
                                        <Text style={styles.customizedText}>{item.selectedQuantity}</Text>
                                    </Col>
                                    <Col style={{ width: '15%' }}>
                                        <Text style={styles.customizedText}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
                                    </Col>
                                </Row>
                                </View>
                                }/>
                            
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
                                    <Text style={styles.customizedText}>{this.totalPrice()}</Text>
                                </Col>
                            </Row>
                        </Grid>
                        <Button block success style={{ borderRadius: 6, margin: 6 }} onPress={()=> this.props.navigation.navigate('MedicinePaymentSuccess')} >
                            <Text uppercase={false}>payLater</Text>
                        </Button>
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
        fontSize: 15
    }
});