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
     const bloodGrp = [{group:'A+'},{group:'A-'},{group:'B+'},{group:'B+'},{group:'AB+'},{group:'AB-'},{group:'O+'},{group:'O-'},
     {group:'A1+'},{group:'A1-'},{group:'A2+'},{group:'A2-'},{group:'A1B+'},{group:'A1B-'},{group:'A2B+'},{group:'A2B-'}]
     const country = [{name:'BANGLADESH'},{name:'INDIA'},{name:'MALAYSIA'},{name:'NEPAL'},{name:'OMAN'},{name:'SRI LANKA'},
     {name:'YEMEN'},{name:'BANGLADESH'}] 
     const state =[{name:'kerala'},{name:'Assam'},{name:'Bihar'},{name:'Candigarh'},{name:'Delhi'},{name:'Goa'},
     {name:'Gujarat'},{name:'Himachal pradesh'},{name:'Haryana'},{name:'Haryana'}] 
     const district = [{name:'Palakkad'},{name:'Alapuzha'},{name:'Ernakulam'},{name:'Idukki'},{name:'Kannur'},{name:'Kasaragod'},
     {name:'Kollam'},{name:'kottayam'},{name:'Kozhikode'},{name:'Malapuram'}]
     
     const city = [{name:'Sreekrishnapuram'},{name:'Agali'},{name:'Alathur'},{name:'Chittur'},{name:'Coyalmannam'},
     {name:'kollengode'},{name:'Malapuram'},{name:'Manarkkad'},{name:'Ottapalam'},{name:'Pattambi'},{name:'Thirthala'}]
     return (
            <Container>
            <Content style={{padding:5}}>
                <View style={{marginBottom:50}}>
                      <View style={{flexDirection:'row',flex:1}}>
                      <View style={{width:'30%',}}>
                        </View>
                           <View style={{width:'70%',}}>
                         <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>Blood Group</Text>
                          </ListItem>
                          <FlatList 
                          data={bloodGrp}
                          renderItem={({item})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item.group}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                          }/>
                        
                        



                          
                           {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>Country</Text>
                          </ListItem>
                           <FlatList
                               data={country}
                               renderItem={({item})=>
                           <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item.name}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                          }/> */}

                        
                          {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>State</Text>
                          </ListItem>
                            <FlatList
                               data={state}
                               renderItem={({item})=>
                           <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item.name}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                        
                            }/> */}

                         
                       
                       {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>District</Text>
                          </ListItem>
                          <FlatList 
                          data={district}
                          renderItem={({item})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item.name}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>

                           }/> */}





                     {/* <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>City</Text>
                          </ListItem>
                           <FlatList
                             data={city}
                             renderItem={({item})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item.name}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                           }/> */}
                         
                      </View>
                   </View>
                </View>
              </Content>
              <View style={styles.ViewStyle}>
               <List style={{marginLeft:-20}}>
                <ListItem style={{justifyContent:'center'}}>
                <Text style={styles.textHead}>Categories</Text>
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
                <Text style={styles.searchText}>Search</Text>
                  </TouchableOpacity>
              </Footer>
          </Container>
        )
    }
}

export default bloodDonation

const styles = StyleSheet.create({
  textHead:{
    fontFamily:'OpenSans',
    fontSize:16,
    fontWeight:'bold',
  },
  subText:{
    fontFamily:'OpenSans',
    fontSize:14,
  },
  ViewStyle:{
    width:'30%',
    borderRightColor:'gray',
    borderRightWidth:1,
    height:800,
    position:'absolute'
  },
  searchText:{
    alignItems:'center',
    fontFamily:'OpenSans',
    fontSize:18,
    fontWeight:'bold',
    color:'#fff'
  }
})