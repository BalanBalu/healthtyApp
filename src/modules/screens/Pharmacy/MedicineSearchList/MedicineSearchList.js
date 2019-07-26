import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, View, Button, H3, Item, List, ListItem, Card, 
    Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Badge } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getSearchedMedicines } from '../../../providers/pharmacy/pharmacy.action';

let temp, userId; 
class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state={
            value:[],
            clickCard:null,
            footerSelectedItem:'',
            cartItems: []
        }
    }
async componentDidMount(){
    
    const keyword=this.props.navigation.getParam('medicineKeyword');
    await this.searchedMedicines(keyword);
    this.storeMedicineToCart();
};

    searchedMedicines = async (keyword) => {
        try {
            let requestData = {
                value: keyword           
            };
            //let userId = await AsyncStorage.getItem('userId');
            let result = await getSearchedMedicines(requestData);
            this.setState({ value: result.data, isLoading: true })
            }
        catch (e) {
            console.log(e);
        }
    }
    addSubOperation(selectItem,operation){
        let itemQuantity;
        if(operation==="add"){           
        itemQuantity = (selectItem.selectedQuantity==undefined?0:selectItem.selectedQuantity);
        selectItem.selectedQuantity=++itemQuantity;    
        }else{
            if(selectItem.selectedQuantity>0){
            itemQuantity=selectItem.selectedQuantity;
            selectItem.selectedQuantity = --itemQuantity;
            }     
        }    
        let temp =this.state.value
        this.setState({value: temp})  
        this.addToCart();
  
       }

    onPressCard=async(item,index)=>{
        this.setState({clickCard:index})
        await this.setState({footerSelectedItem:item});
      }
   
    medicineOffer(item){

        return parseInt(item.price) - ((parseInt(item.offer)/100) * parseInt(item.price));
    }

    addToCart= async() => {
        let cart =[];
            this.state.value.filter(element=>{
               if( element.selectedQuantity>=1){
                   cart.push(element);
               }
           })
           await AsyncStorage.setItem('cartItems-'+userId, JSON.stringify(cart))
        }
   
    storeMedicineToCart= async() =>{
        temp = await AsyncStorage.getItem('userId')
        userId = JSON.stringify(temp);
        console.log('cartItems-'+userId) 
        
        medicineSearchMap = new Map();
        this.state.value.forEach(element =>{           
            medicineSearchMap.set(element.medicine_id,element)
        })   
        const cartItems = await AsyncStorage.getItem('cartItems-'+userId);        
        if(Array.isArray(JSON.parse(cartItems)) == true){
          this.setState({cartItems:JSON.parse(cartItems)})  
            this.state.cartItems.forEach(element => {  
                if(medicineSearchMap.get(element.medicine_id) != undefined){    
                    medicineSearchMap.set(element.medicine_id, element);
                }
                      this.setState({cartItems:cartItems}) 
            })
        }

        let temp = [...medicineSearchMap.values()]   
        this.setState({value:temp});      
    }
    noMedicines() {
        return (
            <Item style={{ borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, justifyContent: 'center', alignItems: 'center' }} > No Medicines available! </Text>
            </Item>
        )
    }
    render() {
        const {value} =this.state;
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
                    {/* <Card transparent style={{ padding: 10, marginTop: 60 }} onTouchStart={() => this.props.navigation.navigate('MedicineCheckout')} > */}
                       
                    {this.state.value==null?this.noMedicines():
                     <FlatList data={value}
                     extraData={this.state}
                     keyExtractor={(item, index) => index.toString()}
                            renderItem={
                                ({ item, index }) =>
                                <TouchableOpacity onPress={()=>this.onPressCard(item,index)}>

                                    <Card style={{ padding: 10, marginTop: 20, }}>
                                        <View style={{ width: 'auto', flex: 1, flexDirection: 'row' }}>

                                            <Right>
                                            {this.state.clickCard!==index?<Icon  style={{ color: '#5cb75d', marginTop: 20, }} />
                                                :<Icon name="checkmark-circle" style={{ color: '#5cb75d', marginTop: 20, }} />} 
                                             </Right>
                                             </View>

                                        <Grid>
                                            <Col style={{ width: '25%' }}>
                                                <View>

                                                    <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-GVencCM4e7LuKxP2SaFTbONdLA1BiOGz96ICf1fkBixV-Tv' }} style={styles.customImage} />
                                                    <View style={{
                                                        position: 'absolute', width: 30, height: 30, borderRadius: 20, marginLeft: 5,
                                                        backgroundColor: 'green', right: 0, top: 0, justifyContent: 'center', alignItems: 'center',
                                                        borderColor: 'green', borderWidth: 1
                                                    }}>
                                                        <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>{item.offer+'%'}</Text>

                                                    </View>
                                                </View>
                                            </Col>


                                            <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                                <Text style={styles.normalText}>{item.medicine_name}</Text>
                                                <Row>
                                                    <Text style={styles.subText}>{'\u20B9'}{this.medicineOffer(item)}</Text>
                                                    <Text style={{ marginLeft: 10, marginTop: 2, color: 'gray', fontSize: 15, textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'gray' }}>
                                                        {'\u20B9'}{item.price}</Text>
                                                </Row>
                                                <Text style={{ color: 'gray', fontSize: 16 }}>White Pigeon Pharmacy</Text>
                                            </Col>
                                        </Grid>

                                    </Card>
                                    </TouchableOpacity> 
                            } />
                        }

                    {/* </Card> */}

                </Content>
                {this.state.clickCard!==null?<Footer style={{ backgroundColor: '#7E49C3', }}>

                    <Row>
                        <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"sub")}>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                            <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>{this.state.footerSelectedItem.selectedQuantity==undefined?0:this.state.footerSelectedItem.selectedQuantity}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"add")}>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
                                    <Text style={{
                                        fontSize: 20, textAlign: 'center', marginTop: -5,
                                        color: 'black'
                                    }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>

                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }} onPress={()=> this.props.navigation.navigate('MedicinePaymentResult')}>


                                <Row style={{ justifyContent: 'center', }}>

                                    <Icon name='ios-cart' onPress={() => this.props.navigation.navigate('MedicinePaymentResult')} />

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

                </Footer>:null
            }
            </Container > 
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
        color: 'black'
    }
});