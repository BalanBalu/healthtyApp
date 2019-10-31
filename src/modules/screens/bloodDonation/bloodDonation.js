import React, { Component } from 'react';
import { Container, Content, View, Text,Left, Item,Right,Footer,List,ListItem, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input, } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'


class bloodDonation extends Component {
     constructor(props) {
                super(props)
                this.state = {
                   
                }
            }
          
    render() {
     
        return (
            <Container>
            <Content style={{padding:5}}>
                <View style={{marginBottom:50}}>
                      <View style={{flexDirection:'row',flex:1}}>
                      <View style={{width:'30%',}}>
                        </View>
                           
                          <View style={{width:'70%',position:'relative'}}>
                          <ScrollView>
                        
                          <ListItem style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',}}>Blood Group</Text>
                          </ListItem>
                          <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>B+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>B-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>AB+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>AB-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>O+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>O-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A1+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A1-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A2+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A2-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A1B+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A1B-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A2B+</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>A2B-</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem> 
                        



                          
                           {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',}}>Country</Text>
                          </ListItem>
                           <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>BANGLADESH</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>INDIA</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>MALAYSIA</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>NEPAL</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>OMAN</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>SRI LANKA</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>YEMEN</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem> */}

                        
                         {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',}}>State</Text>
                          </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Assam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Bihar</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Candigarh</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Delhi</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Goa</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Gujarat</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Haryana</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Himachal pradesh</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Kerala</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem> */}



                         
                       
                       {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',}}>District</Text>
                          </ListItem>
                          <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Alapuzha</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Ernakulam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Idukki</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Kannur</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Kasaragod</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Kollam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>kottayam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Kozhikode</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Malapuram</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Palakkad</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem> */}





                          {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold',}}>City</Text>
                          </ListItem>
                         
                          <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Agali</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Alathur</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Chittur</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>kollengode</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Mannarkad</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Ottapalam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Pattambi</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Sreekrishnapuram</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Thrithala</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                         <ListItem >
                           <Left>
                             <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Coyalmannam</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem> */}
                         

                         </ScrollView>
                           </View>
                          
                    
                            </View>
                       
                      
                      
               </View>
              </Content>
              <View style={{width:'30%',borderRightColor:'gray',borderRightWidth:1,height:600,position:'absolute'}}>
                              
                              <List style={{marginLeft:-20}}>
                              <ListItem style={{justifyContent:'center'}}>
                              <Text style={{fontFamily:'OpenSans',fontSize:16,fontWeight:'bold'}}>Categories</Text>
                                </ListItem>
                              
                                <ListItem style={{backgroundColor:'#784EBC',paddingLeft:10}}>
                                  <Left>
                                  <Text style={{fontFamily:'OpenSans',fontSize:14,color:'#fff'}}>Blood Group</Text>
                                  </Left>
                                  <Right>
                                    <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                                  </Right>
                                </ListItem>
                                <ListItem style={{paddingLeft:10}}>
                                <Left>
                                  <Text style={{fontFamily:'OpenSans',fontSize:14}}>Country</Text>
                                  </Left>
                                  <Right>
                                    <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                                  </Right>
                                </ListItem>
                                <ListItem style={{paddingLeft:10}}>
                                <Left>
                                  <Text style={{fontFamily:'OpenSans',fontSize:14}}>State</Text>
                                  </Left>
                                  <Right>
                                    <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                                  </Right>
                                </ListItem>
                                <ListItem style={{paddingLeft:10}}>
                                <Left>
                                  <Text style={{fontFamily:'OpenSans',fontSize:14,}}>District</Text>
                                  </Left>
                                  <Right>
                                    <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                                  </Right>
                                </ListItem>
                                <ListItem style={{paddingLeft:10}}>
                                <Left>
                                  <Text style={{fontFamily:'OpenSans',fontSize:14,}}>City</Text>
                                  </Left>
                                  <Right>
                                    <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                                  </Right>
                                </ListItem>
                              </List>
                           </View>
                         
              <Footer style={{ backgroundColor: '#7E49C3', }}>
                <TouchableOpacity  style={{justifyContent:'center'}}>
                <Text style={{alignItems:'center',fontFamily:'OpenSans',fontSize:18,fontWeight:'bold',color:'#fff'}}>Search</Text>
                  </TouchableOpacity>
              </Footer>
          </Container>
        )
    }
}

export default bloodDonation

const styles = StyleSheet.create({
   NumText:{
       fontFamily:'OpenSans',
       fontSize:16
   },
   transparentLabel:{
       backgroundColor:'#F1F1F1',
       height:40,
       marginTop:10,
       borderRadius:5,
       paddingLeft:20,
       fontFamily:'OpenSans',
       fontSize:15
   } ,
   contentView:{
    marginTop:5,
     height: 45, 
     alignItems: 'center', 
     backgroundColor: '#EBEBEB',
     
 },
 subTitle:{
    fontFamily:'OpenSans',
    fontSize:15,
    marginLeft:20
  },
})