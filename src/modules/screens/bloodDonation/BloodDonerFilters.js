import React, { Component } from 'react';
import { Container, Content, View, Text,Left, Item,Right,Footer,List,ListItem, Spinner,Card,Picker, Radio,Row,Col,Form,Button,Icon,Input, } from 'native-base';
import {StyleSheet,TextInput,TouchableOpacity,ScrollView} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import Autocomplete from '../../../components/Autocomplete'
import {bloodDonationFilter,bloodDonationList}from '../../providers/profile/profile.action'
import { RadioButton, } from 'react-native-paper';


class BloodDonerFilters extends Component {
     constructor(props) {
                super(props)
                this.state = {
                   data:[],
                   hidden1: false,
                   selectedOne:'BLOODGROUP',
                   filteredList:[],
                   isloading:false,
                   onSelect:''
                }
        this.filterData=[];
            }
          
          componentDidMount(){
             this. getBlooddonationfilterList(this.filterData);
             }
            filterApiCall=async()=>{
              this. getBlooddonationfilterList(this.filterData);
          
           }
         getBlooddonationfilterList= async(data)=>{
                 try {
          //let data=[]
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
           console.log(this.filterData)
           
         let bloodlist=  this.filterData.findIndex(list => list.type ==="blood_group")
         if(bloodlist!=-1){
          this.filterData.splice(bloodlist,1)
         }
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
          let countrylist=  this.filterData.findIndex(list => list.type ==="address.address.country")
          if(countrylist!=-1){
           this.filterData.splice(countrylist,1)
          }
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
          let statelist=  this.filterData.findIndex(list => list.type ==="address.address.state")
          if(statelist!=-1){
           this.filterData.splice(statelist,1)
          }
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
          let dislist=  this.filterData.findIndex(list => list.type ==="address.address.district")
          if(dislist!=-1){
           this.filterData.splice(dislist,1)
          }
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
        let cityList=  this.filterData.findIndex(list => list.type ==="address.address.city")
        if(cityList!=-1){
         this.filterData.splice(cityList,1)
        }
        const result ={
          type:'address.address.city',
          value:value
        }
        this.filterData.push(result);
        console.log(this.filterData)
        this.setState({onSelect:value})
        this.filterApiCall();
            }

         async  filteredTotalDataList1() {
           console.log('comes filtewr data')
              let user =[], doctor=[];
             console.log(JSON.stringify(this.filterData))
             let result = await bloodDonationList(this.filterData);
             console.log(result)
             if(result.success){
               user = result.data.userList 
              doctor = result.data.doctorList
                user.concat(doctor);
                console.log(user)
                await this.setState({data:user})
              }
              
               this.props.navigation.navigate('BloodDonersList',{data:user}) 
                 console.log(result)
              
              
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
                          data={this.state.data.bloodGroupList}
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
                           <RadioButton.Group  onValueChange={value => this.Countrylist(value)}
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
                           <RadioButton.Group   onValueChange={value => this.Statelist(value)}
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