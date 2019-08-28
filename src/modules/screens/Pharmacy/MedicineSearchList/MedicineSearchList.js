import React, { Component } from 'react';
import { Container, Content, Text, Title, Header, View, Button, H3, Item, List, ListItem, Card, 
    Input, Left, Right, Thumbnail, Body, Icon, Footer, FooterTab, Badge } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { StyleSheet, Image, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getSearchedMedicines } from '../../../providers/pharmacy/pharmacy.action';
import { NavigationEvents } from 'react-navigation';
import { addToCart, medicineRateAfterOffer } from '../../../common';

class MedicineSearchList extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state={
            value:[],
            clickCard:null,
            footerSelectedItem:'',
            cartItems: [],
            isLoading: false
        }
    }
async componentDidMount(){
    this.setState({clickCard:null});  
    const keyword=this.props.navigation.getParam('medicineKeyword');
    this.storeMedicineToCart()
    await this.searchedMedicines(keyword); 

};

    searchedMedicines = async (keyword) => {
        try {
            let requestData = {
                value: keyword           
            };
          
            let result = await getSearchedMedicines(requestData);
            this.setState({ value: result.data, isLoading: true })
            }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }

    async addSubOperation(selectItem,operation){
        let data = await addToCart(this.state.value, selectItem, operation);  
       // console.log('data:'+JSON.stringify(data)  )
        this.setState({footerSelectedItem:data.selectemItemData})       
    }

    onPressCard=async(item,index)=>{
        this.setState({clickCard:index})
        await this.setState({footerSelectedItem:item});
       

      }  
  
    storeMedicineToCart= async() =>{
        let data = await AsyncStorage.getItem('userId')
        let userId = JSON.stringify(data);
        
        medicineSearchMap = new Map();
        if(this.state.value != undefined){
        this.state.value.forEach(element =>{           
            medicineSearchMap.set(element.medicine_id,element)
        }) 
    } 
        const cartItems = await AsyncStorage.getItem('cartItems-'+userId);
        if(Array.isArray(JSON.parse(cartItems)) == true){
          this.setState({cartItems:JSON.parse(cartItems)})           
            this.state.cartItems.forEach(element => {  
                if(medicineSearchMap.get(element.medicine_id) != undefined){    
                    medicineSearchMap.set(element.medicine_id, element);
                }
            })
        }


        let temp = [...medicineSearchMap.values()]   
        this.setState({value:temp});   
        // console.log('value222'+JSON.stringify(this.state.value));

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
                 <NavigationEvents
					onWillFocus={payload => { this.componentDidMount() }}
				/>
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
                       
                    {this.state.value==null?this.noMedicines():
                     <FlatList data={value}
                     extraData={this.state}
                     keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={()=>this.onPressCard(item,index)} testID='selectMedicineToList'>

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
                                                        <Text style={{ padding: 5, backgroundColor: 'transparent', color: 'white', fontSize: 13 }}>{item.offer}</Text>

                                                    </View>
                                                </View>
                                            </Col>


                                            <Col style={{ marginLeft: 20, width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginTop: 10 }}>
                                                <Text style={styles.normalText}>{item.medicine_name}</Text>
                                                <Row>
                                                    <Text style={styles.subText}>{'\u20B9'}{medicineRateAfterOffer(item)}</Text>
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


                </Content>
                {this.state.clickCard!==null?<Footer style={{ backgroundColor: '#7E49C3', }}>

                    <Row>
                        <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"sub")} testID='decreaseMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                            <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>{this.state.footerSelectedItem.selectedQuantity==undefined?0:this.state.footerSelectedItem.selectedQuantity}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"add")} testID='addMedicine'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
                                    <Text style={{
                                        fontSize: 20, textAlign: 'center', marginTop: -5,
                                        color: 'black'
                                    }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>

                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }} onPress={()=> this.props.navigation.navigate('PharmacyCart')} testID='viewToCartPage'>


                                <Row style={{ justifyContent: 'center', }}>

                                    <Icon name='ios-cart' onPress={() => this.props.navigation.navigate('PharmacyCart')} />

                                    <Text style={{ marginLeft: -25, marginTop: 2, }} >VIEW CART</Text>
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