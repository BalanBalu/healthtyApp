import React, { Component } from 'react';
import { Container, Content, Text, Button, FooterTab, Card, Footer, Icon, Input, Toast, Form, Right, Left, Grid, Row, Col } from 'native-base';
import { StyleSheet, Image, View, AsyncStorage, TextInput, TouchableOpacity } from 'react-native';
import {getPromodataList} from '../../providers/PromoCode/promo.action'
import { FlatList } from 'react-native-gesture-handler';
import {formatDate} from "../../../setup/helpers";

class PromoCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            couponCodeDiscountAmount: 0,
            displayMore: false,
            data:[]
        }
    }

componentDidMount(){
    let data = [];
 this.getPromolistDatas(data)
}


getPromolistDatas  = async (data) => {
    try{
        let result = await getPromodataList(data)
        if(result.success){
            this.setState({data:result.data})
            console.log(result);
        }
    }
         catch (e) {
         console.log(e)
      }
}
    onCouponPress(coupenCodeText) {
        this.setState({ coupenCodeText: coupenCodeText.toUpperCase() })
    }

    displayMoreData(){
        this.setState({ displayMore: true })
    }


    
      getPromocode(promocode) {
        if ( promocode.promo_code != undefined ) {
          return `${ promocode.promo_code || ''}`
        } else {
          return null
        }
      }
     
      getDescription(data) {
          if(data.description != undefined) {
              return `${data.description || ''}`
          }else{
              return null
          }
      }
      getAppoinment(data){
          if(data.applicableService_type != undefined){
              return `${data.applicableService_type || ''}`
            }else{
                return null
            }
        }
 
        endDate(date){
            if(date.valid_upto != undefined){
                return  `${date.valid_upto || ''}`
            }else{
                return null
            }
        }

        OnCopyedValue(){
            if(this.state.coupenCodeText !=null ){}
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
                                                <TouchableOpacity style={{ marginTop: 23, marginRight: 15 }} onPress={()=>this.OnCopyedValue()}>
        <Text style={{ fontSize: 15, fontFamily: 'OpenSans', fontWeight: 'bold', color: '#775DA3' }}>{alert(this.state.coupenCodeText)}APPLY</Text>
                                                </TouchableOpacity>
                                            </Right>
                                        </Row>
                                    </Col>
                                </Grid>
                            </View>
                            <Text style={{ paddingBottom: 10, marginRight: 20, marginLeft: 20, fontFamily: 'OpenSans', fontSize: 14 }}>Available Coupons</Text>
                        </View>
<FlatList
data={this.state.data}
keyExtractor={(item, index) => index.toString()}
renderItem={({item})=>

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
                                    <Text style={{ color: '#775DA3', fontSize: 15, fontFamily: 'OPenSans', textAlign: 'right', fontWeight: 'bold', marginTop: 10, marginRight: 10 }}> APPLY</Text>
                                </Col>
                            </Row>
                            <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10, marginTop: 10 }}>
                                {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                                <Text style={{ fontFamily: 'OpenSans', fontSize: 14, }}>50% OFF on your first {this.getAppoinment(item)}</Text>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                {/* <Text>50% OFF up to {'\u20B9'}150 0n 3 orders</Text> */}
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', lineHeight: 20 }}>{ this.getDescription(item)}</Text>
                            </Row>
                            <Row style={{ marginTop: 5, marginBottom: 5 }}>
                                <TouchableOpacity onPress={() =>this.displayMoreData()}>
                                <Text style={{ color: '#378DDF', fontSize: 12, fontWeight: 'bold' }}>+ MORE</Text>
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
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Offer is Valid only on select {this.getAppoinment(item)}</Text>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Other T&Cs may apply</Text>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 30, marginTop: -12 }}>{'\u2022'}</Text>
                                    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, textAlign: 'left', color: '#33333', marginLeft: 10 }}>Offer valid till {formatDate(this.endDate(item),'MMM DD,YYYY HH:MM  A')}</Text>
                                </Row>
                            </View> :null}
                            <Row style={{ borderBottomColor: '#C1C1C1', borderBottomWidth: 0.3, paddingBottom: 10, }} />
                        </Grid>
                            }/>                       
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