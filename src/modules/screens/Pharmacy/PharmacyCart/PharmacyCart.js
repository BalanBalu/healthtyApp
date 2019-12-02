import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';
import { medicineRateAfterOffer } from '../../../common';

let temp, userId; 
class PharmacyCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems:[],
            isLoading: true
        }       
    }

     componentDidMount(){
        this.getAddToCart();
    }

    getAddToCart= async() => {
    try{
        this.setState({ isLoading: true })
        temp = await AsyncStorage.getItem('userId')
        userId = JSON.stringify(temp);

        const cartItems = await AsyncStorage.getItem('cartItems-'+userId);       
        if( cartItems === undefined){
            this.setState({ cartItems: [], isLoading: false });
        }else{       
            this.setState({ cartItems: JSON.parse(cartItems), isLoading: false });
        }
    }
    catch(e){
        console.log(e);
    }
    finally {
         this.setState({ isLoading: false });
        }
    }

    increase(index){
        let selectedCartItem = this.state.cartItems;        
        selectedCartItem[index].selectedQuantity++;
        this.setState({cartItems: selectedCartItem})
        AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(this.state.cartItems))
    }

    decrease(index){
        let selectedCartItem = this.state.cartItems;
        if(selectedCartItem[index].selectedQuantity > 1){
            selectedCartItem[index].selectedQuantity--;       
         this.setState({cartItems: selectedCartItem})
            AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(this.state.cartItems))
        }
    }
  
    removeMedicine(index){
            let data = this.state.cartItems;
            data.splice(index, 1);
            this.setState({ cartItems: data });
             AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(this.state.cartItems))
      }
      
      totalPrice() {
        let total = 0;
        if(this.state.cartItems) {
            this.state.cartItems.forEach(element => {
                total = total + ((parseInt(element.price) - (parseInt(element.offer)/100) * parseInt(element.price)) * parseInt(element.selectedQuantity))
            }) 
            return total.toFixed(2);
        }   
      }


    render() {            
              const { isLoading,cartItems } = this.state;

     return (            
      <Container style={styles.container}>

          {isLoading == true ? <Loader style='list' /> :

             <Content style={styles.bodyContent}>

             <Grid style={styles.curvedGrid}>
              </Grid>
             <Grid style={{ marginTop: -60, height: 100, }}>
               <Row style={{ justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'OpenSans', color: '#fff', fontSize: 18, }}>CHECKOUT</Text>
               </Row>
             </Grid>

            <Card transparent >
            <Grid >
              <Row style={{ justifyContent: 'center', width: '100%', marginTop: -15 }}>
                <Text style={{ fontFamily: 'OpenSans', fontWeight: 'bold', fontSize: 20, padding: 5 }}>Your Order</Text>
               </Row>
            </Grid>
              {cartItems== '' || cartItems== null  ?
               <Item style={{ borderBottomWidth: 0, justifyContent:'center',alignItems:'center', height:70 }}>
               <Text style={{fontSize:20,justifyContent:'center',alignItems:'center'}}>No Medicines Are Found Your Cart</Text>
               </Item>  :
                <FlatList
                   data={cartItems}
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({ item, index }) =>

                <Card style={{ marginTop: 10, padding: 10,  }}>
                  <Grid>
                    <Row >
                        <Col style={{width:'30%'}}>
                        <Image source={{ uri: 'https://static01.nyt.com/images/2019/03/05/opinion/05Fixes-1/05Fixes-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale' }} style={{
                                        width: 100, height: 100, borderRadius: 10,  }} />

                        </Col>
                        <Col style={{width:'70%',marginTop:-20}}>
                        <Text style={styles.labelTop}>{item.medicine_name} </Text>
                        <Row style={{marginTop:10,marginLeft:20}}>
                        <Text style={styles.subText}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
                            <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}{item.price}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#ffa723', marginLeft: 5, fontWeight: 'bold' }}> {'Get'+ ' ' +item.offer+ '%' +' ' +'Off'}</Text>
                        </Row>
                        <Row style={{marginTop:10,marginLeft:20}}>
                            <Col style={{width:'50%'}}>
                                <Row>
                            <TouchableOpacity  onPress={()=>this.decrease(index)} testID='decreaseMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 35, height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <TextInput type='number' min='1' style={{ marginLeft: 5, marginTop: -12, color: '#c26c57' }} >{item.selectedQuantity}</TextInput>
                            <TouchableOpacity  onPress={()=>this.increase(index)} testID='increaseMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 35, height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: -5, color: 'black' }}>+</Text>
                                </View>
                            </TouchableOpacity>
                            </Row>
                            </Col>
                            <Col style={{width:'50%',marginLeft:-60}}>
                            <TouchableOpacity style={{ marginLeft: 55, alignItems: 'center'}} onPress={()=> this.removeMedicine(index)} testID='removeMedicineToCart'>
                                <Icon style={{ fontSize: 30, color: 'red', marginTop: -4 }} name='ios-trash' />
                            </TouchableOpacity>  
                            </Col>
                        
                      
                         
                        </Row>
                        </Col>
                     </Row>
                  </Grid>
                </Card>
                
                }/>
              }
            </Card>

            </Content>}
              {this.state.cartItems != ''?
                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Total </Text>
                        {this.totalPrice()== undefined ?
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:0'}</Text>:
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:'+this.totalPrice()}</Text>
                        }
                    </Row>
                    <Col >
                        <Button style={{ backgroundColor: '#5cb75d', borderRadius: 10, padding: 10, marginTop: 10, marginLeft: 40, height: 35 }} onPress={()=> this.props.navigation.navigate('MedicineCheckout',{medicineDetails:this.state.cartItems})} testID='navigateToCheckout'>
                            <Text>Checkout</Text>
                        </Button>
                    </Col>
                </Footer>: null}
            </Container >
        )
    }
}


export default PharmacyCart


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
    customText:
    {
        fontFamily: 'OpenSans',
        fontSize: 16,
        color: '#2F3940',
        fontWeight: 'bold'
    },
    labelTop:
    {
        fontFamily: 'OpenSans',
        fontSize: 18,
        marginLeft: 20,
        marginTop: 15,
        fontWeight: 'bold'
    },
    medName:
    {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5
    },
    medPhar:
    {
        fontFamily: 'OpenSans',
        fontSize: 12,
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
    },
    badgeText:
    {
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingTop: 5
    },
    button1: {
        backgroundColor: "#5cb75d",
        marginLeft: 20,
        marginTop: -10,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
    },
    button2: {
        marginLeft: 70,
        marginTop: -5,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 5,
        height: 35,
        backgroundColor: 'gray',
    },
    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        color: '#c26c57',
        marginLeft: 5,
        fontWeight: "bold"
    }



});