import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, Form, Textarea, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Picker, Segment, CheckBox, View, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, Image, AsyncStorage, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Loader } from '../../../../components/ContentLoader';

class MedicinePaymentResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems:[],
            isLoading: false
        }
        
    }

     componentDidMount(){
        this.getAddToCart();
    }


    getAddToCart= async() => {
    try{
        // const cartItems = await AsyncStorage.getItem('cartItems');
        // console.log('cartItems'+cartItems)
        // this.setState({cartItems: cartItems} )
        // this.setState({ isLoading : true })
        // this.setAddToCart()
        // this.setState({ isLoading : false })


        let userId = AsyncStorage.getItem('userId')
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
    }


    increase(index){
        let selectedCartItem = this.state.cartItems;
        console.log('selectedCartItem'+JSON.stringify(selectedCartItem))
        selectedCartItem[index].selectedQuantity++;
        this.setState({cartItems: selectedCartItem})

    }

    decrease(index){
        let userId = AsyncStorage.getItem('userId')

        let selectedCartItem = this.state.cartItems;
        if(selectedCartItem[index].selectedQuantity > 1){
            selectedCartItem[index].selectedQuantity--;       
         this.setState({cartItems: selectedCartItem})
            AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(this.state.cartItems))
        }
    }

    medicineOffer(item){

        return parseInt(item.price) - ((parseInt(item.offer)/100) * parseInt(item.price));
    }
  
    removeMedicine(index){
        let userId = AsyncStorage.getItem('userId')

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
        return total;
        }    
      }


    render() {            
              const {isLoading,cartItems} = this.state;

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
              {cartItems== '' ?
               <Item style={{ borderBottomWidth: 0, justifyContent:'center',alignItems:'center', height:70 }}>
               <Text style={{fontSize:20,justifyContent:'center',alignItems:'center'}}>No Medicines Are Found Your Cart</Text>
               </Item>  :
                <FlatList
                   data={cartItems}
                   extraData={this.state}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={({ item, index }) =>

                <Card style={{ marginTop: 10, padding: 5, height: 180 }}>
                  <Grid>
                    <Row >
                      <Image source={{ uri: 'https://static01.nyt.com/images/2019/03/05/opinion/05Fixes-1/05Fixes-1-articleLarge.jpg?quality=75&auto=webp&disable=upscale' }} style={{
                                        width: 100, height: 100, borderRadius: 10, marginTop: 20 }} />

                        <View style={{ width: '75%', }}>
                            <Text style={styles.labelTop}>{item.medicine_name} </Text>
                        </View>
                     </Row>

                        <View style={{ marginLeft: 105, flex: 1, flexDirection: 'row', marginTop: 15 }}>
                          <Row>
                            <Text style={styles.subText}>{'\u20B9'}{this.medicineOffer(item)}</Text>
                            <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                            {'\u20B9'}{item.price}</Text>
                            <Text style={{ fontFamily: 'OpenSans', fontSize: 15, color: '#ffa723', marginLeft: 20, fontWeight: 'bold' }}> {'Get'+ ' ' +item.offer+ '%' +' ' +'Off'}</Text>

                          </Row>
                        </View>
                                
                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 110 }}>
                          <Button style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, marginLeft: 5, backgroundColor: 'white' }} onPress={()=>this.decrease(index)}>
                             <Text style={{ fontSize: 25, justifyContent: 'flex-start', textAlign: 'center', marginTop: -15, marginRight:10, color: '#c26c57', fontWeight: 'bold' }}>-</Text>
                          </Button>
                         <View>
                            <TextInput type='number' min='1' style={{ marginLeft: 5, color: '#c26c57' }} >{item.selectedQuantity}</TextInput>
                         </View>

                          <Button style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: '#c26c57', width: 30, height: 25, marginLeft: 5, backgroundColor: 'white' }} onPress={()=>this.increase(index)}>
                             <Text style={{ fontSize: 20, justifyContent: 'flex-start', textAlign: 'center', marginTop: -10, marginRight:10, color: '#c26c57', fontWeight: 'bold' }}>+</Text>
                          </Button>
                        
                        <TouchableOpacity style={{ marginLeft: 50, alignItems: 'center'}} onPress={()=> this.removeMedicine(index)}>
                           <Icon style={{ fontSize: 30, color: 'red', marginTop: -4 }} name='ios-trash' />
                         </TouchableOpacity>  
                        

                    </View>
                  </Grid>
                </Card>
                
                }/>
              }
            </Card>

            </Content>}

                <Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Total </Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{'Rs:'+this.totalPrice()}</Text>
                    </Row>
                    <Col >
                        <Button style={{ backgroundColor: '#5cb75d', borderRadius: 10, padding: 10, marginTop: 10, marginLeft: 40, height: 35 }} onPress={()=> this.props.navigation.navigate('MedicineCheckout')}>
                            <Text>Checkout</Text>
                        </Button>
                    </Col>
                </Footer>
            </Container >
        )
    }
}


export default MedicinePaymentResult


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
        marginLeft: 10,
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