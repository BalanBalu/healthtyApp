import React, { Component } from 'react';
import { Container, Content, View, Text,Left, Item,Right,Footer,List,ListItem, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input, } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import {bloodDonationFilter,getfilteredBloodList}from '../../providers/profile/profile.action';
import { bloodGroupList } from "../../common";
import { RadioButton, } from 'react-native-paper';


class BloodDonerFilters extends Component {
     constructor(props) {
                super(props)
                this.state = {
                   data:[],
                   hidden1: false,
                   selectedOne:'BLOODGROUP',
                   filteredList:[],
                   isloading:false
                }
        this.filterData=[];
            }
          
          componentDidMount(){
             this. getBlooddonationfilterList(this.filterData);
             }
            filterApiCall=async()=>{
              this. getBlooddonationfilterList(this.filterData);
            //   console.log("filterApi calls");
            //    let totalData = await bloodDonationFilter(this.filterData);
            //    console.log(totalData);

           }
         getBlooddonationfilterList= async(data)=>{
                 try {
          //let data=[]
          alert(data)
             let result = await bloodDonationFilter(data);
               if(result.success){
                 this.setState({data:result.data})
                  console.log(result)
                
               }
             await this.setState({ isloading: true })
               } catch (e) {
                 console.log(e)
               }
               }

          toggle1(create){  
                    this.setState({selectedOne: create }) 
               }
      
         bloodGroupList(value){
           const result= {
             type: "blood_group",
             value:value
           }
           this.filterData.push(result);
           console.log(this.filterData)
           this.setState({onSelect:value})
           this.filterApiCall();
         }
        Countrylist(value){
          const result ={
            type:'address.address.country',
            value:value
          }
          this.filterData.push(result);
          console.log(this.filterData)
          this.setState({onSelect:value})
          this.filterApiCall();
              }
        Statelist(value){
          const result ={
            type:'address.address.state',
            value:value
          }
          this.filterData.push(result);
          console.log(this.filterData)
          this.setState({onSelect:value})
          this.filterApiCall();
              }
        Districtlist(value){
          const result ={
            type:'address.address.district',
            value:value
          }
          this.filterData.push(result);
          console.log(this.filterData)
          this.setState({onSelect:value})
          this.filterApiCall();
              }
      Citylist(value){
        const result ={
          type:'address.address.city',
          value:value
        }
        this.filterData.push(result);
        console.log(this.filterData)
        this.setState({onSelect:value})
        this.filterApiCall();
            }

            filteredTotalDataList1(result) {
             
              if(data.result!=0){
               this.props.navigation.navigate('BloodDonersList',{data:result}) 
                 console.log(result)
               this.setState({filteredList:this.filterData.data})
              }
           }
    //  async filteredTotalDataList(){
    //  let filterListData = await getfilteredBloodList(this.filterData)
    //    if (filterListData.success){
    //       console.log(filterListData)
    //     await this.setState({filteredList:this.filterData.data})
    //    }
    //    this.props.navigation.navigate('BloodDonersList',{data:filterListData.data});
    //      console.log(filterListData)
    //           }    
          
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
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item,index})=>
                        
                          <ListItem >
                              <TouchableOpacity 
                       onPress={()=>this.bloodGroupList(item)}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group   onValueChange={onSelect => this.bloodGroupList(onSelect)}
                           value={this.state.onSelect}
                           > 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
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
                               data={this.state.data.countryList}
                               keyExtractor={(item, index) => index.toString()}
                               renderItem={({item})=>
                           <ListItem >
                               <TouchableOpacity 
                       onPress={()=>this.Countrylist(item)}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group  onValueChange={onSelect => this.Countrylist(onSelect)}
                           value={this.state.onSelect}> 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
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
                               data={this.state.data.stateList}
                               keyExtractor={(item, index) => index.toString()}
                               renderItem={({item})=>
                           <ListItem >
                              <TouchableOpacity 
                       onPress={()=>this.Statelist(item)}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group   onValueChange={onSelect => this.Satelist(onSelect)}
                           value={this.state.onSelect}> 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
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
                          data={this.state.data.districtList}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item})=>
                          <ListItem >
                             <TouchableOpacity 
                       onPress={()=>this.Districtlist(item)}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group   onValueChange={onSelect => this.Districtlist(onSelect)}
                           value={this.state.onSelect}> 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
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
                             data={this.state.data.cityList}
                             keyExtractor={(item, index) => index.toString()}
                             renderItem={({item})=>
                          <ListItem >
                             <TouchableOpacity 
                       onPress={()=>this.Citylist(item)}
                          style={{flexDirection:'row'}}
                          >
                           <Left>
                             <Text style={styles.subText}>{item}</Text>
                           </Left>
                           <Right>
                           <RadioButton.Group   onValueChange={onSelect => this.Citylist(onSelect)}
                           value={this.state.onSelect}> 
                                <RadioButton value={item}/>
                              </RadioButton.Group>
                           </Right>
                           </TouchableOpacity>
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
                  <TouchableOpacity  onPress={()=>this.toggle1('BLOODGROUP')}  style={{flexDirection:'row'}}> 
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
                <TouchableOpacity onPress={()=>this.filteredTotalDataList1()} style={{justifyContent:'center'}}>
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