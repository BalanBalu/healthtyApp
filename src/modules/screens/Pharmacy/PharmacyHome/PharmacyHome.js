import React, { Component } from 'react';
import { Container, Content, Toast, Text, Title, Header, Button, H3, Item, List, ListItem, Card, Input, Left, Right, Thumbnail, Body, Icon, View, Footer, FooterTab } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { getMedicineDetails,getSearchedMedicines } from '../../../providers/pharmacy/pharmacy.action'
import { StyleSheet, Image, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { addToCart,medicineRateAfterOffer } from '../../../common';
import Autocomplete from '../../../../components/Autocomplete'


let  userId; 
class PharmacyHome extends Component {
    constructor(props) {
        super(props)       
        this.state={
            medicineData:[],
            clickCard:null,
            footerSelectedItem:'',
            cartItems:[],
            searchMedicine:[],
            keyword:''
            
        }   
    }

    async componentDidMount(){
        this.setState({clickCard:null});               
        this.getMedicineList();
        await this.searchMedicineByName();
    }

    /*Get medicine list*/
    getMedicineList=async()=>{
        console.log("getmedicine");    
       temp = await AsyncStorage.getItem('userId')
       userId = JSON.stringify(temp);  
       console.log(userId);    

        medicineSearchMap = new Map();
        let result=await getMedicineDetails();

        if(result.success){
            console.log("reust.success")
        result.data.forEach(element =>{           
            medicineSearchMap.set(element.medicine_id,element)

        })  
    }         
        const cartItems = await AsyncStorage.getItem('cartItems-'+userId);
        console.log(cartItems);
        if(cartItems===null){
            console.log("");
        if(Array.isArray(JSON.parse(cartItems)) == true){
          this.setState({cartItems:JSON.parse(cartItems)})           
            this.state.cartItems.forEach(element => {  
                if(medicineSearchMap.get(element.medicine_id) != undefined){    
                    medicineSearchMap.set(element.medicine_id, element);
                }
            })
        }
    }

        let temp = [...medicineSearchMap.values()]        
        this.setState({medicineData:temp});
        console.log('this.state.medicineData'+JSON.stringify(this.state.medicineData))      
    }

    /*Search medicine*/
    searchMedicineByName = async () => {
        try {
            let requestData = {
                value: this.state.keyword           
            };
          
            let result = await getSearchedMedicines(requestData);
            console.log('result'+JSON.stringify(result));
            await this.setState({ searchMedicine: result.data, isLoading: true })
            console.log('this.staete'+JSON.stringify(this.state.searchMedicine));
            }
        catch (e) {
            console.log(e);
        }
        finally {
            this.setState({ isLoading: false });
        }
    }



    onPressCard=async(item,index)=>{
     this.setState({clickCard:index})
     await this.setState({footerSelectedItem:item});
   }

   async addSubOperation(selectItem,operation){
    let data = await addToCart(this.state.medicineData, selectItem, operation);    
    this.setState({footerSelectedItem:data.selectemItemData})       
   }

   onSearchPress(selectedMedicineName) {
       console.log("selectmed") 
       console.log(selectedMedicineName)
       if(selectedMedicineName.length!=0){
           console.log("null")
        this.props.navigation.navigate('medicineSearchList',{medicineList:selectedMedicineName}) 

       }
    //    if(this.state.searchText!==null){
    //    }else{
    //     Toast.show({
    //         type:"danger",
    //         text: 'Kindly enter a medicine to search',
    //         duration: 3000
    //       })
    //    }
    }

    autoCompleteMedicineName(keyword){
        console.log("auto")
        if (keyword === '' || keyword === undefined || keyword === null) {
            return [];
        }
        const { searchMedicine } = this.state;

        if(searchMedicine!=undefined){
        const regex = new RegExp(`${keyword.trim()}`, 'i');
        console.log(regex);        
        selectedMedicineName = searchMedicine.filter(value => value.medicine_name.search(regex) >= 0);
        console.log('selectedMedicineName'+JSON.stringify(selectedMedicineName));
        if(selectedMedicineName.length==0){
            let defaultValue={medicine_name:'Medicine is not available'}
            selectedMedicineName.push(defaultValue);
        
        }
        return selectedMedicineName;
        }
    }

     
    render() {
        const {medicineData}=this.state
        var selectedMedicineName=[]
        selectedMedicineName=this.autoCompleteMedicineName(this.state.keyword);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();


        return (
            <Container style={styles.container}>
                <NavigationEvents
					onWillFocus={payload => { this.componentDidMount() }}
				/>
                <Content >
                    <Grid style={styles.curvedGrid}>
                    </Grid>
                            <View style={{marginTop:-65}}>
                                <Autocomplete style={{ borderBottomWidth: 0, backgroundColor: '#F1F1F1', borderRadius: 5, padding:6, width: '60%', marginLeft:49}} 
                                data={this.state.searchMedicine!=undefined?(selectedMedicineName.length === 1 && comp(this.state.keyword, selectedMedicineName[0].medicine_name) ? [] : selectedMedicineName):selectedMedicineName}
                                    defaultValue={this.state.keyword}
                                    onChangeText={text => this.setState({ keyword:text })}
                                    placeholder='Search Medicine'
                                    listStyle={{ marginLeft: 45, width: '62%', marginTop: -3.5,padding:1}}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.setState({ keyword: item.medicine_name})}>
                                            <Text style={{fontSize: 15,color:'gray',borderBottomWidth:0.3}}>{item.medicine_name}</Text>
                                        </TouchableOpacity>
                                    )}
                                  keyExtractor={(item, index) => index.toString()} />
                            </View>
                            <View>
                            <Button style={{ backgroundColor: '#000', borderRadius: 10, height:40, marginTop:-42, marginLeft:296, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, }}  onPress={()=>this.onSearchPress(selectedMedicineName)} testID='searchMedicine'>
                                        <Icon name="ios-search" style={{ color: 'white' }}/>
                            </Button>
                            </View>

                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop:55 }}>
                        <Button style={{ justifyContent: "center", backgroundColor: '#745DA6', borderRadius: 5 }} onPress={() => this.props.navigation.navigate('UploadPrescription')} testID="clickButtonToUploadPrescription">
                            <Icon style={{ fontSize: 30}} name='ios-cloud-upload'>
                                <Text style={{ padding: 2, color: '#fff'}}>Upload your prescription</Text>
                            </Icon>
                        </Button>
                    </View>
                    <Card transparent >
                    {medicineData.length == 0 ?
                            <Item style={{ borderBottomWidth: 0, justifyContent:'center',alignItems:'center', height:70 }}>
                               <Text style={{fontSize:20,justifyContent:'center',alignItems:'center'}}>No Medicines </Text>
                            </Item>  :
                        <Grid style={{ marginTop: 25, padding: 10, width: 'auto' }}>
                            <FlatList 
                                data={medicineData}
                                extraData={this.state}
                                horizontal={false}
                                numColumns={2}
                                renderItem={
                                   ({ item, index }) =>
                                            <View style={styles.customColumn}>
                                                <TouchableOpacity onPress={()=>this.onPressCard(item,index)} testID='selectToMedicine'>
                                                    <View style={{ width: 'auto', flex: 1, flexDirection: 'row' }}>
                                                        <Text style={{ marginTop: -30, fontFamily: 'OpenSans', fontSize: 13, color: '#ffa723', }}>{'Get'+' '+item.offer+'%'+' '+'OFF'}
                                                        </Text>                                                        
                                                        <Right>
                                                        {this.state.clickCard!==index?<Icon  style={{ color: '#5cb75d', marginTop: -30, }} />
                                                         :<Icon name="checkmark-circle" style={{ color: '#5cb75d', marginTop: -30, }} />}
                         
                                                        </Right>
                                                    </View>
                                                    <Image source={{ uri: 'https://vimecare.com/WelcomeDesign/images/doctor-icon.png' }} style={styles.customImage} />
                                                   <Text style={styles.pageText}>{item.medicine_name}</Text>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <Text style={{
                                                            textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: 'black',

                                                            fontWeight: "bold"
                                                        }}>{'MRP'+' '+'Rs.'+item.price}</Text>
                                                        <Text style={{
                                                            fontFamily: 'OpenSans',
                                                            fontSize: 12,
                                                            color: '#000',
                                                            marginLeft: 10,
                                                            fontWeight: "bold"
                                                        }} >{medicineRateAfterOffer(item)}</Text>
                                                    </View>


                                                </TouchableOpacity>
                                            </View>
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </Grid>
                    }
                    </Card>
                </Content>
                
                {this.state.clickCard!==null?<Footer style={{ backgroundColor: '#7E49C3', }}>
                    <Row>
                        <Col style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                            <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"sub")} testID='decreaseMedicineQuantity'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 40, textAlign: 'center', marginTop: -5, color: 'black' }}>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text style={{ marginLeft: 5, color: 'white', fontSize: 20 }}>{this.state.footerSelectedItem.selectedQuantity==undefined?0:this.state.footerSelectedItem.selectedQuantity}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>this.addSubOperation(this.state.footerSelectedItem,"add")} testID='addMedicineQuantity'>
                                <View style={{ padding: 0, justifyContent: 'center', borderWidth: 1, borderColor: 'black', width: 40, height: 35, marginLeft: 5, backgroundColor: 'white' }}>
                                    <Text style={{
                                        fontSize: 20, textAlign: 'center', marginTop: -5,
                                        color: 'black'
                                    }}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>

                        <Col style={{ marginRight: 40 }} >
                            <Button success style={{ borderRadius: 10, marginTop: 10, marginLeft: 45, height: 40, justifyContent: 'center' }} onPress={()=> this.props.navigation.navigate('PharmacyCart')} testID='clickButtonToViewCartPage'>


                                <Row style={{ justifyContent: 'center', }}>

                                    <Icon name='ios-cart'/>

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


                </Footer>:null}

            </Container>

        )
    }

}

export default PharmacyHome


const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ffffff',
    },
    bodyContent: {
        padding: 5
    },
    customImage: {
        height: 70,
        width: 70,
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
    searchBox: {
        width: '50%',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 35,
        alignItems: 'center',
        marginTop:-80,
        marginBottom: 'auto',
        padding: 20,
        flex:1
    },
    customColumn: {
        padding: 10,
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 10,
        borderColor: '#D92B4B',
        borderWidth: 1,
        margin: 5,
        width: '45%',
        marginRight: 10
    },
    pageText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        fontWeight: "bold"
    }
});