import React, { Component } from 'react';
import { Container, Content, View, Text,Left, Item,Right,Footer,List,ListItem, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input, } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import {bloodDonationFilter }from '../../providers/profile/profile.action';
import { bloodGroupList } from "../../common";


class BloodDonerFilters extends Component {
     constructor(props) {
                super(props)
                this.state = {
                   data:[],
        hidden1: false,
        selectedOne:null
                }
            }
          
componentDidMount(){
  this. getBlooddonationfilterList();
}

         getBlooddonationfilterList= async()=>{
               let result = await bloodDonationFilter();
               if(result.success){
                 this.setState({data:result.data})
               }
          
               console.log(result)
               }

          toggle1(create){  
                    this.setState({selectedOne: create }) 
               }
               
          
    render() {
    
    const {selectedOne} = this.state
     return (
            <Container>
            <Content style={{padding:5}}>
                <View style={{marginBottom:50}}>
                      <View style={{flexDirection:'row',flex:1}}>
                      <View style={{width:'30%',}}>
                        </View>
                           <View style={{width:'70%',}}>
                           {this.state.selectedOne == 'BLOODGROUP' ?
                               <View>
                         <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>Blood Group</Text>
                          </ListItem>
                          <FlatList 
                          data={bloodGroupList}
                          renderItem={({item,index})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                          }/> 
                          </View>
                       :null}

                          {this.state.selectedOne == 'COUNTRY' ?
                          <View>
                           <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>Country</Text>
                          </ListItem>
                           <FlatList
                               data={this.state.data.countryListArray}
                               renderItem={({item})=>
                           <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                          }/> 
                          </View>
                          :null}
                        
                        {this.state.selectedOne == 'STATE' ?
                        <View>
                          <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>State</Text>
                          </ListItem>
                            <FlatList
                               data={this.state.data.stateListArray}
                               renderItem={({item})=>
                           <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                        
                            }/>
                            </View>
                          : null}
                         
                       {this.state.selectedOne == 'DISTRICT'?
                       <View>
                      <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>District</Text>
                          </ListItem>
                          <FlatList 
                          data={this.state.data.districtListArray}
                          renderItem={({item})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>

                           }/> 
                           </View>
:null}


                    {this.state.selectedOne == 'CITY' ?
                    <View>

                   <ListItem style={{justifyContent:'center'}}>
                          <Text style={styles.textHead}>City</Text>
                          </ListItem>
                           <FlatList
                             data={this.state.data.cityListArray}
                             renderItem={({item})=>
                          <ListItem >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                              <Radio
                                   selectedColor={"#007bff"}
                                   selected={false}
                                      />
                           </Right>
                         </ListItem>
                           }/> 
                         </View>
                         :null}
                      </View>
                   </View>
                </View>
              </Content>
              <View style={styles.ViewStyle}>
               <List style={{marginLeft:-20}}>
                <ListItem style={{justifyContent:'center'}}>
                <Text style={styles.textHead}>Categories</Text>
                  </ListItem>
                
                  <ListItem style={selectedOne === 'BLOODGROUP' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity  onPress={()=>this.toggle1('BLOODGROUP',)}  style={{flexDirection:'row'}}> 
                    <Left> 
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>Blood Group</Text>
                   
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'COUNTRY' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.toggle1('COUNTRY')} style={{flexDirection:'row'}}>
                  <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14}}>Country</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'STATE' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.toggle1('STATE' )} style={{flexDirection:'row'}}>
                    <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14}}>State</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'DISTRICT' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.toggle1('DISTRICT' )} style={{flexDirection:'row'}}>
                 <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>District</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                  <ListItem style={selectedOne === 'CITY' ? {backgroundColor:'#784EBC',paddingLeft:10} : {paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.toggle1('CITY')} style={{flexDirection:'row'}}>
                  <Left>
                    <Text style={{fontFamily:'OpenSans',fontSize:14,}}>City</Text>
                    </Left>
                    <Right>
                      <Icon name="ios-arrow-forward" style={{fontSize:25}}/>
                    </Right>
                    </TouchableOpacity>
                  </ListItem>
                </List>
              </View>
              <Footer style={{ backgroundColor: '#7E49C3', }}>
                <TouchableOpacity  style={{justifyContent:'center'}}>
                <Text style={styles.searchText}>Filter</Text>
                  </TouchableOpacity>
              </Footer>
          </Container>
        )
    }
}

export default BloodDonerFilters

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
    fontSize:20,
    fontWeight:'bold',
    color:'#fff'
  }
})